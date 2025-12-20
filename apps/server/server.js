/**
 * Monomorph API Server v1.3.0
 * ═══════════════════════════════════════════════════════════════════════════
 * Financial Analytics Platform API
 * 
 * API Versioning:
 *   - All endpoints available at /api/v1/*
 *   - Legacy /api/* routes redirect to /api/v1/* for backward compatibility
 * 
 * Logging:
 *   - Structured JSON logs in production
 *   - Pretty console logs in development
 *   - Request ID tracking via x-request-id header
 * ═══════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Logging
const { logger, httpLogger, logStartup, logShutdown } = require('./lib/logger');

// ═══════════════════════════════════════════════════════════════════════════
// SERVER SETUP
// ═══════════════════════════════════════════════════════════════════════════

const SERVER_START_TIME = Date.now();
const pkg = require('./package.json');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Structured request logging (Pino)
app.use(httpLogger);

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
// HEALTH & PROBES
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
    checks: {
      server: 'ok',
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
    endpoints: {
      health: '/api/v1/health',
      ready: '/api/v1/ready',
      live: '/api/v1/live',
      stocks: '/api/v1/stocks',
      search: '/api/v1/search?q=tcs',
      analytics: '/api/v1/analytics/:cardId?symbol=TCS',
    },
    documentation: 'https://docs.monomorph.in',
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════════════════════════════════════════

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    hint: 'Try /api/v1/health or GET / for available endpoints',
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════

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
╠═══════════════════════════════════════════════════════════════════════════╣
║  API v1 ENDPOINTS                                                          ║
║  ├─ Health:    GET /api/v1/health                                         ║
║  ├─ Ready:     GET /api/v1/ready                                          ║
║  ├─ Live:      GET /api/v1/live                                           ║
║  ├─ Stocks:    GET /api/v1/stocks                                         ║
║  ├─ Search:    GET /api/v1/search?q=tcs                                   ║
║  └─ Analytics: GET /api/v1/analytics/:cardId?symbol=TCS                   ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  📝 Logs: Structured JSON (set LOG_LEVEL=debug for verbose)               ║
║  ⚠️  Legacy /api/* routes redirect to /api/v1/* (backward compatible)     ║
╚═══════════════════════════════════════════════════════════════════════════╝
    `);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════════════════════

process.on('SIGTERM', () => {
  logShutdown('SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  logShutdown('SIGINT');
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
