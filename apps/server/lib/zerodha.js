/**
 * Zerodha Kite Connect OAuth & Data Routes
 * ═══════════════════════════════════════════════════════════════════════════
 * Handles:
 *   - OAuth login flow
 *   - Access token generation
 *   - Market data fetching (quotes, OHLCV, instruments)
 * ═══════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const crypto = require('crypto');
const { logger } = require('./logger');

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const KITE_API_KEY = process.env.KITE_API_KEY;
const KITE_API_SECRET = process.env.KITE_API_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// In-memory session store (use Redis in production for multi-instance)
const sessions = new Map();

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate checksum for Kite Connect token exchange
 */
const generateChecksum = (apiKey, requestToken, apiSecret) => {
  const data = apiKey + requestToken + apiSecret;
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generate session ID
 */
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Store session data
 */
const storeSession = (sessionId, data) => {
  sessions.set(sessionId, {
    ...data,
    createdAt: Date.now(),
    expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours (Kite token validity)
  });
  
  // Cleanup expired sessions
  for (const [key, value] of sessions.entries()) {
    if (value.expiresAt < Date.now()) {
      sessions.delete(key);
    }
  }
};

/**
 * Get session data
 */
const getSession = (sessionId) => {
  const session = sessions.get(sessionId);
  if (session && session.expiresAt > Date.now()) {
    return session;
  }
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/v1/zerodha/login
 * Returns the Kite Connect login URL
 */
router.get('/login', (req, res) => {
  if (!KITE_API_KEY) {
    return res.status(500).json({ error: 'Zerodha API key not configured' });
  }
  
  const loginUrl = `https://kite.zerodha.com/connect/login?v=3&api_key=${KITE_API_KEY}`;
  
  logger.info({ event: 'zerodha_login_url_generated' });
  
  res.json({ 
    loginUrl,
    apiKey: KITE_API_KEY 
  });
});

/**
 * POST /api/v1/zerodha/callback
 * Exchange request_token for access_token
 */
router.post('/callback', async (req, res) => {
  const { request_token } = req.body;
  
  if (!request_token) {
    return res.status(400).json({ error: 'Missing request_token' });
  }
  
  if (!KITE_API_KEY || !KITE_API_SECRET) {
    return res.status(500).json({ error: 'Zerodha API credentials not configured' });
  }
  
  try {
    const checksum = generateChecksum(KITE_API_KEY, request_token, KITE_API_SECRET);
    
    // Exchange request_token for access_token
    const response = await fetch('https://api.kite.trade/session/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Kite-Version': '3'
      },
      body: new URLSearchParams({
        api_key: KITE_API_KEY,
        request_token: request_token,
        checksum: checksum
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'error') {
      logger.error({ event: 'zerodha_token_exchange_failed', error: data.message });
      return res.status(401).json({ error: data.message || 'Token exchange failed' });
    }
    
    // Create session
    const sessionId = generateSessionId();
    storeSession(sessionId, {
      accessToken: data.data.access_token,
      userId: data.data.user_id,
      userName: data.data.user_name,
      email: data.data.email,
      broker: data.data.broker
    });
    
    logger.info({ 
      event: 'zerodha_login_success', 
      userId: data.data.user_id,
      userName: data.data.user_name 
    });
    
    res.json({
      success: true,
      sessionId,
      user: {
        id: data.data.user_id,
        name: data.data.user_name,
        email: data.data.email,
        broker: data.data.broker
      }
    });
    
  } catch (error) {
    logger.error({ event: 'zerodha_callback_error', error: error.message });
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

/**
 * GET /api/v1/zerodha/profile
 * Get user profile (requires session)
 */
router.get('/profile', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }
  
  const session = getSession(sessionId);
  
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
  
  res.json({
    user: {
      id: session.userId,
      name: session.userName,
      email: session.email,
      broker: session.broker
    }
  });
});

/**
 * GET /api/v1/zerodha/quote/:symbol
 * Get live quote for a symbol (requires session)
 */
router.get('/quote/:symbol', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { symbol } = req.params;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }
  
  const session = getSession(sessionId);
  
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
  
  try {
    // Format: NSE:RELIANCE or BSE:RELIANCE
    const instrument = symbol.includes(':') ? symbol : `NSE:${symbol}`;
    
    const response = await fetch(
      `https://api.kite.trade/quote?i=${encodeURIComponent(instrument)}`,
      {
        headers: {
          'Authorization': `token ${KITE_API_KEY}:${session.accessToken}`,
          'X-Kite-Version': '3'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.status === 'error') {
      return res.status(400).json({ error: data.message });
    }
    
    res.json(data.data);
    
  } catch (error) {
    logger.error({ event: 'zerodha_quote_error', symbol, error: error.message });
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

/**
 * GET /api/v1/zerodha/ohlc/:symbol
 * Get OHLC data for a symbol (requires session)
 */
router.get('/ohlc/:symbol', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { symbol } = req.params;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }
  
  const session = getSession(sessionId);
  
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
  
  try {
    const instrument = symbol.includes(':') ? symbol : `NSE:${symbol}`;
    
    const response = await fetch(
      `https://api.kite.trade/quote/ohlc?i=${encodeURIComponent(instrument)}`,
      {
        headers: {
          'Authorization': `token ${KITE_API_KEY}:${session.accessToken}`,
          'X-Kite-Version': '3'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.status === 'error') {
      return res.status(400).json({ error: data.message });
    }
    
    res.json(data.data);
    
  } catch (error) {
    logger.error({ event: 'zerodha_ohlc_error', symbol, error: error.message });
    res.status(500).json({ error: 'Failed to fetch OHLC' });
  }
});

/**
 * GET /api/v1/zerodha/historical/:instrument_token
 * Get historical candle data (requires session)
 * Query params: from, to, interval (minute, day, etc.)
 */
router.get('/historical/:instrument_token', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { instrument_token } = req.params;
  const { from, to, interval = 'day' } = req.query;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }
  
  const session = getSession(sessionId);
  
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
  
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing from/to date parameters' });
  }
  
  try {
    const url = `https://api.kite.trade/instruments/historical/${instrument_token}/${interval}?from=${from}&to=${to}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${KITE_API_KEY}:${session.accessToken}`,
        'X-Kite-Version': '3'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'error') {
      return res.status(400).json({ error: data.message });
    }
    
    // Transform to more usable format
    const candles = data.data.candles.map(c => ({
      timestamp: c[0],
      open: c[1],
      high: c[2],
      low: c[3],
      close: c[4],
      volume: c[5]
    }));
    
    res.json({ candles });
    
  } catch (error) {
    logger.error({ event: 'zerodha_historical_error', instrument_token, error: error.message });
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

/**
 * GET /api/v1/zerodha/instruments
 * Get all instruments (cached, refreshed daily)
 */
let instrumentsCache = null;
let instrumentsCacheTime = 0;
const INSTRUMENTS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

router.get('/instruments', async (req, res) => {
  const { exchange = 'NSE' } = req.query;
  
  try {
    // Check cache
    if (instrumentsCache && Date.now() - instrumentsCacheTime < INSTRUMENTS_CACHE_TTL) {
      const filtered = instrumentsCache.filter(i => i.exchange === exchange);
      return res.json({ instruments: filtered, cached: true });
    }
    
    // Fetch fresh instruments list
    const response = await fetch('https://api.kite.trade/instruments', {
      headers: {
        'X-Kite-Version': '3'
      }
    });
    
    const csv = await response.text();
    
    // Parse CSV
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    const instruments = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const instrument = {};
      headers.forEach((h, idx) => {
        instrument[h] = values[idx];
      });
      instruments.push(instrument);
    }
    
    // Update cache
    instrumentsCache = instruments;
    instrumentsCacheTime = Date.now();
    
    const filtered = instruments.filter(i => i.exchange === exchange);
    
    logger.info({ event: 'instruments_fetched', count: instruments.length });
    
    res.json({ instruments: filtered, cached: false });
    
  } catch (error) {
    logger.error({ event: 'zerodha_instruments_error', error: error.message });
    res.status(500).json({ error: 'Failed to fetch instruments' });
  }
});

/**
 * POST /api/v1/zerodha/logout
 * Clear session
 */
router.post('/logout', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (sessionId) {
    sessions.delete(sessionId);
    logger.info({ event: 'zerodha_logout', sessionId: sessionId.substring(0, 8) + '...' });
  }
  
  res.json({ success: true });
});

/**
 * GET /api/v1/zerodha/status
 * Check if Zerodha integration is configured
 */
router.get('/status', (req, res) => {
  res.json({
    configured: !!(KITE_API_KEY && KITE_API_SECRET),
    apiKey: KITE_API_KEY ? KITE_API_KEY.substring(0, 6) + '...' : null
  });
});

module.exports = router;
