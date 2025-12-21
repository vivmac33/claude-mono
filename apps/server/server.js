/**
 * Monomorph API Server v1.6.0
 * ═══════════════════════════════════════════════════════════════════════════
 * Financial Analytics Platform API
 * 
 * Features:
 *   - API Versioning (v1)
 *   - Structured logging (Pino)
 *   - Rate limiting (Redis-backed with in-memory fallback)
 *   - Interactive API documentation (Swagger UI)
 *   - Health checks and probes
 * 
 * Documentation:
 *   - /docs       - Interactive Swagger UI
 *   - /docs/json  - OpenAPI spec (JSON)
 *   - /docs/yaml  - OpenAPI spec (YAML)
 * 
 * Rate Limiting:
 *   - Authenticated users: 200 req/min (general), 60 req/min (writes)
 *   - API keys: 60 req/min (general), 20 req/min (writes)
 *   - Anonymous: 30 req/min (public), 5 per 5min (login)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Logging
const { logger, httpLogger, logStartup, logShutdown } = require('./lib/logger');

// Redis (for rate limiting)
const { initRedis, closeRedis, isRedisConnected } = require('./lib/redis');

// Rate Limiting
const { 
  rateLimiter, 
  strictRateLimiter, 
  authRateLimiter, 
  globalRateLimiter 
} = require('./middleware/rateLimiter');

// Swagger Documentation
const { setupSwagger } = require('./lib/swagger');

// ═══════════════════════════════════════════════════════════════════════════
// SERVER SETUP
// ═══════════════════════════════════════════════════════════════════════════

const SERVER_START_TIME = Date.now();
const pkg = require('./package.json');

const app = express();
const PORT = process.env.PORT || 4000;

// ═══════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

// CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Trust proxy (for accurate IP detection behind load balancers)
app.set('trust proxy', true);

// Structured request logging (Pino)
app.use(httpLogger);

// Global rate limiting (applies to all routes)
// Limits determined by access tier (authenticated, apiKey, anonymous)
app.use(globalRateLimiter());

// ═══════════════════════════════════════════════════════════════════════════
// SWAGGER DOCUMENTATION
// ═══════════════════════════════════════════════════════════════════════════

// Setup Swagger UI at /docs
setupSwagger(app);

// ═══════════════════════════════════════════════════════════════════════════
// DATA LOADING
// ═══════════════════════════════════════════════════════════════════════════

const loadCardData = (cardId) => {
  const filePath = path.join(__dirname, 'mock-data', 'cards', `${cardId}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
};

const masterStockData = (() => {
  const filePath = path.join(__dirname, 'mock-data', 'master-stock-data.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return { stocks: {}, sectors: {}, indices: {} };
})();

const getStockData = (cardId, symbol) => {
  const cardData = loadCardData(cardId);
  if (cardData && cardData[symbol]) {
    return cardData[symbol];
  }
  return { symbol, asOf: new Date().toISOString().split('T')[0], message: "Data being prepared" };
};

const getPortfolioData = (cardId) => {
  const cardData = loadCardData(cardId);
  return cardData || { asOf: new Date().toISOString().split('T')[0], message: "Data being prepared" };
};

// ═══════════════════════════════════════════════════════════════════════════
// API V1 ROUTER
// ═══════════════════════════════════════════════════════════════════════════

const v1Router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH & PROBES (no rate limit)
// ─────────────────────────────────────────────────────────────────────────────

v1Router.get('/health', (req, res) => {
  const now = Date.now();
  const uptimeMs = now - SERVER_START_TIME;
  const uptimeSeconds = Math.floor(uptimeMs / 1000);
  const uptimeMinutes = Math.floor(uptimeSeconds / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);
  const uptimeDays = Math.floor(uptimeHours / 24);

  let uptimeStr;
  if (uptimeDays > 0) {
    uptimeStr = `${uptimeDays}d ${uptimeHours % 24}h ${uptimeMinutes % 60}m`;
  } else if (uptimeHours > 0) {
    uptimeStr = `${uptimeHours}h ${uptimeMinutes % 60}m ${uptimeSeconds % 60}s`;
  } else if (uptimeMinutes > 0) {
    uptimeStr = `${uptimeMinutes}m ${uptimeSeconds % 60}s`;
  } else {
    uptimeStr = `${uptimeSeconds}s`;
  }

  const memUsage = process.memoryUsage();
  const memoryMB = {
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    rss: Math.round(memUsage.rss / 1024 / 1024),
  };

  const stockCount = Object.keys(masterStockData.stocks || {}).length;
  const cardsPath = path.join(__dirname, 'mock-data', 'cards');
  const cardCount = fs.existsSync(cardsPath) ? fs.readdirSync(cardsPath).length : 0;

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: pkg.version,
    apiVersion: 'v1',
    environment: process.env.NODE_ENV || 'development',
    uptime: {
      formatted: uptimeStr,
      seconds: uptimeSeconds,
    },
    memory: {
      heapUsed: `${memoryMB.heapUsed}MB`,
      heapTotal: `${memoryMB.heapTotal}MB`,
      rss: `${memoryMB.rss}MB`,
    },
    data: {
      stocks: stockCount,
      cards: cardCount,
    },
    services: {
      server: 'ok',
      redis: isRedisConnected() ? 'ok' : 'fallback',
      filesystem: fs.existsSync(cardsPath) ? 'ok' : 'warning',
    },
  };

  res.status(health.status === 'healthy' ? 200 : 503).json(health);
});

v1Router.get('/ready', (req, res) => {
  const stockCount = Object.keys(masterStockData.stocks || {}).length;
  if (stockCount > 0) {
    res.status(200).json({ ready: true, stocks: stockCount });
  } else {
    res.status(503).json({ ready: false, reason: 'Stock data not loaded' });
  }
});

v1Router.get('/live', (req, res) => {
  res.status(200).json({ live: true, timestamp: Date.now() });
});

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ENDPOINTS (strict rate limits - IP based)
// ─────────────────────────────────────────────────────────────────────────────

// Login - 5 attempts per 5 minutes
v1Router.post('/auth/login', 
  strictRateLimiter(5, 300, 'Too many login attempts. Please try again in 5 minutes.'),
  (req, res) => {
    // TODO: Implement actual auth
    res.json({ message: 'Login endpoint - auth not yet implemented' });
  }
);

// Register - 3 attempts per hour
v1Router.post('/auth/register',
  strictRateLimiter(3, 3600, 'Too many registration attempts. Please try again later.'),
  (req, res) => {
    // TODO: Implement actual auth
    res.json({ message: 'Register endpoint - auth not yet implemented' });
  }
);

// Forgot password - 3 attempts per 15 minutes
v1Router.post('/auth/forgot-password',
  strictRateLimiter(3, 900, 'Too many password reset attempts. Please try again later.'),
  (req, res) => {
    // TODO: Implement actual auth
    res.json({ message: 'Forgot password endpoint - auth not yet implemented' });
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// STOCK DATA ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

v1Router.get('/stocks', (req, res) => {
  res.json(masterStockData.stocks);
});

v1Router.get('/stocks/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const stock = masterStockData.stocks[symbol];
  if (stock) {
    res.json(stock);
  } else {
    res.status(404).json({ error: 'Stock not found', symbol });
  }
});

v1Router.get('/sectors', (req, res) => {
  res.json(masterStockData.sectors);
});

v1Router.get('/indices', (req, res) => {
  res.json(masterStockData.indices);
});

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────────────────────────────────────

v1Router.get('/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  
  const results = Object.entries(masterStockData.stocks || {})
    .filter(([symbol, data]) => 
      symbol.toLowerCase().includes(query) || 
      (data.name && data.name.toLowerCase().includes(query))
    )
    .slice(0, limit)
    .map(([symbol, data]) => ({
      symbol,
      name: data.name,
      sector: data.sector,
      price: data.price
    }));
  
  res.json({ query, count: results.length, results });
});

// ─────────────────────────────────────────────────────────────────────────────
// OHLCV DATA
// ─────────────────────────────────────────────────────────────────────────────

v1Router.get('/ohlcv/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const candlestickData = loadCardData('candlestick-hero');
  if (candlestickData && candlestickData[symbol]) {
    res.json(candlestickData[symbol].ohlcv);
  } else {
    res.status(404).json({ error: 'OHLCV data not found', symbol });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN / DATA PROVIDER ENDPOINTS
// NOTE: Zerodha is a TEMPORARY data provider for testing.
//       Will be replaced with commercial vendor when production-ready.
//       These endpoints are ADMIN-ONLY and not for user authentication.
// ─────────────────────────────────────────────────────────────────────────────

// Data sync endpoint (admin only)
v1Router.post('/admin/data-sync',
  rateLimiter({ category: 'dataSync' }),
  (req, res) => {
    // TODO: Implement with admin auth
    res.status(501).json({ 
      message: 'Data sync endpoint - admin auth not yet implemented',
      note: 'Zerodha is temp data provider - will switch to commercial vendor for production'
    });
  }
);

// Zerodha status (admin only - temp data provider)
v1Router.get('/admin/zerodha/status',
  rateLimiter({ category: 'dataSync' }),
  (req, res) => {
    // TODO: Implement with admin auth
    res.json({ 
      provider: 'zerodha',
      status: 'temp-provider',
      note: 'Zerodha is for internal testing only. Will be replaced with commercial data vendor.',
    });
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS - All cards use dynamic loading
// ─────────────────────────────────────────────────────────────────────────────

// Stock-level analytics (require symbol)
const stockAnalytics = [
  'stock-snapshot', 'fair-value-forecaster', 'valuation-summary', 'dcf-valuation',
  'piotroski-score', 'dupont-analysis', 'intrinsic-value-range', 'multi-factor-scorecard',
  'financial-health-dna', 'growth-summary', 'earnings-quality', 'efficiency-dashboard',
  'capital-allocation', 'sales-profit-cash', 'earnings-stability', 'management-quality',
  'profit-vs-cash-divergence', 'risk-health-dashboard', 'drawdown-var', 'fno-risk-advisor',
  'leverage-history', 'bankruptcy-health', 'financial-stress-radar', 'working-capital-health',
  'cashflow-stability-index', 'dividend-crystal-ball', 'dividend-sip', 'income-stability',
  'shareholding-pattern', 'candlestick-hero', 'technical-indicators', 'pattern-matcher',
  'trend-strength', 'momentum-heatmap', 'volatility-regime', 'seasonality-pattern',
  'market-regime-radar', 'price-structure', 'delivery-analysis', 'trade-flow-intel',
  'volume-profile', 'volume-profile-tpo', 'footprint-analysis', 'sentiment-contradiction',
  'vwap-analysis', 'orb-analysis', 'fibonacci-levels', 'playbook-builder', 'peer-comparison',
  'options-interest', 'fcf-health', 'cash-conversion-cycle', 'cash-conversion-earnings',
  'options-strategy', 'sentiment-zscore-mini', 'warning-sentinel-mini', 'factor-tilt-mini',
  'altman-graham-mini', 'ratio-evolution-mini'
];

// Portfolio-level analytics (no symbol needed)
const portfolioAnalytics = [
  'macro-calendar', 'earnings-calendar', 'quarterly-results', 'insider-trades',
  'institutional-flow', 'sector-insights', 'nse-currency-dashboard', 'mcx-commodity-dashboard',
  'portfolio-correlation', 'portfolio-leaderboard', 'portfolio-drift-monitor', 'etf-comparator',
  'rebalance-optimizer', 'tax-calculator', 'trade-journal', 'trade-expectancy',
  'advanced-screener', 'attribution-tax-optimizer', 'mf-explorer', 'mf-analyzer',
  'mf-portfolio-optimizer'
];

// Register stock analytics endpoints
stockAnalytics.forEach(cardId => {
  v1Router.get(`/analytics/${cardId}`, (req, res) => {
    const symbol = req.query.symbol || 'TCS';
    res.json(getStockData(cardId, symbol.toUpperCase()));
  });
});

// Register portfolio analytics endpoints
portfolioAnalytics.forEach(cardId => {
  v1Router.get(`/analytics/${cardId}`, (req, res) => {
    res.json(getPortfolioData(cardId));
  });
});

// Catch-all for any unregistered analytics cards
v1Router.get('/analytics/:cardId', (req, res) => {
  const cardId = req.params.cardId;
  const symbol = req.query.symbol || 'TCS';
  const cardData = loadCardData(cardId);
  
  if (cardData) {
    if (cardData[symbol.toUpperCase()]) {
      res.json(cardData[symbol.toUpperCase()]);
    } else if (typeof cardData === 'object' && !Array.isArray(cardData)) {
      res.json(cardData);
    } else {
      res.status(404).json({ error: `Data for ${symbol} not found in ${cardId}` });
    }
  } else {
    res.status(404).json({ error: `Card ${cardId} data not found` });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// WRITE ENDPOINTS (with stricter rate limits)
// ─────────────────────────────────────────────────────────────────────────────

// Watchlist CRUD
v1Router.post('/watchlist',
  rateLimiter({ category: 'writes' }),
  (req, res) => {
    res.status(501).json({ message: 'Watchlist endpoint - not yet implemented' });
  }
);

v1Router.put('/watchlist/:id',
  rateLimiter({ category: 'writes' }),
  (req, res) => {
    res.status(501).json({ message: 'Watchlist endpoint - not yet implemented' });
  }
);

v1Router.delete('/watchlist/:id',
  rateLimiter({ category: 'writes' }),
  (req, res) => {
    res.status(501).json({ message: 'Watchlist endpoint - not yet implemented' });
  }
);

// Workflow CRUD
v1Router.post('/workflow',
  rateLimiter({ category: 'writes' }),
  (req, res) => {
    res.status(501).json({ message: 'Workflow endpoint - not yet implemented' });
  }
);

// Workflow execution (heavy compute - strictest limits)
v1Router.post('/workflow/run',
  rateLimiter({ category: 'workflow' }),
  (req, res) => {
    res.status(501).json({ message: 'Workflow execution - not yet implemented' });
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// RATE LIMIT INFO ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════

v1Router.get('/rate-limit-info', (req, res) => {
  res.json({
    description: 'Rate limits are based on your access tier',
    tiers: {
      authenticated: {
        general: '200 requests per minute',
        writes: '60 requests per minute',
        workflow: '20 requests per minute',
      },
      apiKey: {
        general: '60 requests per minute',
        writes: '20 requests per minute',
        workflow: '5 requests per minute',
      },
      anonymous: {
        public: '30 requests per minute',
        login: '5 requests per 5 minutes',
        register: '3 requests per hour',
      },
    },
    headers: {
      'X-RateLimit-Limit': 'Maximum requests allowed in window',
      'X-RateLimit-Remaining': 'Requests remaining in current window',
      'X-RateLimit-Reset': 'Timestamp when the rate limit resets',
    },
    note: 'Authenticate for higher rate limits',
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// MOUNT ROUTERS
// ═══════════════════════════════════════════════════════════════════════════

// Mount v1 router
app.use('/api/v1', v1Router);

// ═══════════════════════════════════════════════════════════════════════════
// LEGACY ROUTES (Backward Compatibility)
// Redirect /api/* to /api/v1/* for existing clients
// ═══════════════════════════════════════════════════════════════════════════

app.use('/api', (req, res, next) => {
  // Don't redirect if already going to v1
  if (req.path.startsWith('/v1')) {
    return next();
  }
  
  // Build the new URL with query string
  const newPath = `/api/v1${req.path}`;
  const queryString = Object.keys(req.query).length 
    ? '?' + new URLSearchParams(req.query).toString() 
    : '';
  
  // 308 Permanent Redirect (preserves method)
  res.redirect(308, newPath + queryString);
});

// Legacy health endpoints
app.get('/health', (req, res) => res.redirect(308, '/api/v1/health'));

// ═══════════════════════════════════════════════════════════════════════════
// ROOT ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.json({
    name: 'Monomorph API',
    version: pkg.version,
    description: 'Financial Analytics Platform API',
    documentation: '/docs',
    endpoints: {
      docs: '/docs',
      docsJson: '/docs/json',
      health: '/api/v1/health',
      ready: '/api/v1/ready',
      live: '/api/v1/live',
      stocks: '/api/v1/stocks',
      search: '/api/v1/search?q=tcs',
      analytics: '/api/v1/analytics/:cardId?symbol=TCS',
      rateLimitInfo: '/api/v1/rate-limit-info',
    },
    rateLimits: 'See /api/v1/rate-limit-info for details',
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════════════════════════════════════════

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    hint: 'Try /docs for API documentation or /api/v1/health for status',
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════

async function startServer() {
  // Initialize Redis for rate limiting
  await initRedis();
  
  app.listen(PORT, () => {
    const stockCount = Object.keys(masterStockData.stocks || {}).length;
    const cardsPath = path.join(__dirname, 'mock-data', 'cards');
    const cardCount = fs.existsSync(cardsPath) ? fs.readdirSync(cardsPath).length : 0;
    
    // Log startup with structured data
    logStartup({
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      version: pkg.version,
      stocks: stockCount,
      cards: cardCount,
      redis: isRedisConnected() ? 'connected' : 'in-memory',
      docs: '/docs',
    });
    
    // Also print banner for humans in dev
    if (process.env.NODE_ENV !== 'production') {
      console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║  MONOMORPH API SERVER v${pkg.version}                                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  🚀 Running on http://localhost:${PORT}                                      ║
║  📊 Loaded ${String(stockCount).padEnd(2)} stocks                                                  ║
║  📁 ${String(cardCount).padEnd(2)} card data files                                           ║
║  🔒 Rate limiting: ${isRedisConnected() ? 'Redis' : 'In-memory'}                                          ║
║  📚 Documentation: http://localhost:${PORT}/docs                             ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  API v1 ENDPOINTS                                                          ║
║  ├─ Docs:        GET /docs                                                ║
║  ├─ Health:      GET /api/v1/health                                       ║
║  ├─ Stocks:      GET /api/v1/stocks                                       ║
║  ├─ Search:      GET /api/v1/search?q=tcs                                 ║
║  ├─ Analytics:   GET /api/v1/analytics/:cardId?symbol=TCS                 ║
║  └─ Rate Limits: GET /api/v1/rate-limit-info                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  📝 Logs: Structured JSON (set LOG_LEVEL=debug for verbose)               ║
║  ⚠️  Legacy /api/* routes redirect to /api/v1/* (backward compatible)     ║
╚═══════════════════════════════════════════════════════════════════════════╝
      `);
    }
  });
}

// Start the server
startServer().catch(err => {
  logger.fatal({ error: err.message }, 'Failed to start server');
  process.exit(1);
});

// ═══════════════════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════════════════════

process.on('SIGTERM', async () => {
  logShutdown('SIGTERM');
  await closeRedis();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logShutdown('SIGINT');
  await closeRedis();
  process.exit(0);
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.fatal({ err, type: 'uncaughtException' }, 'Uncaught exception - shutting down');
  process.exit(1);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, type: 'unhandledRejection' }, 'Unhandled promise rejection');
});
