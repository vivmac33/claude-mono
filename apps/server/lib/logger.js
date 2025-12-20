/**
 * Structured Logger (Pino)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Features:
 *   - JSON logging in production (machine-readable)
 *   - Pretty printing in development (human-readable)
 *   - Log levels: fatal, error, warn, info, debug, trace
 *   - Request ID tracking
 *   - Redaction of sensitive fields
 * 
 * Usage:
 *   const { logger } = require('./lib/logger');
 *   logger.info('Server started');
 *   logger.error({ err, userId }, 'Failed to process request');
 * ═══════════════════════════════════════════════════════════════════════════
 */

const pino = require('pino');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const isDev = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDev ? 'debug' : 'info');

// Fields to redact from logs (security)
const redactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-api-key"]',
  'password',
  'token',
  'apiKey',
  'secret',
];

// ═══════════════════════════════════════════════════════════════════════════
// LOGGER INSTANCE
// ═══════════════════════════════════════════════════════════════════════════

const logger = pino({
  level: logLevel,
  
  // Redact sensitive fields
  redact: {
    paths: redactPaths,
    censor: '[REDACTED]',
  },
  
  // Base context (added to every log)
  base: {
    service: 'monomorph-api',
    version: require('../package.json').version,
  },
  
  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
  
  // Pretty print in development
  transport: isDev ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss.l',
      ignore: 'pid,hostname,service,version',
      messageFormat: '{msg}',
      singleLine: false,
    },
  } : undefined,
  
  // Custom serializers
  serializers: {
    err: pino.stdSerializers.err,
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      // Don't log full headers in production
      headers: isDev ? req.headers : undefined,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// REQUEST ID GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a short unique request ID
 * Format: xxxxxxxx (8 hex chars)
 */
function generateRequestId() {
  return crypto.randomBytes(4).toString('hex');
}

// ═══════════════════════════════════════════════════════════════════════════
// HTTP REQUEST LOGGER MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════

const pinoHttp = require('pino-http');

const httpLogger = pinoHttp({
  logger,
  
  // Generate request ID
  genReqId: (req, res) => {
    const existingId = req.headers['x-request-id'];
    const id = existingId || generateRequestId();
    res.setHeader('x-request-id', id);
    return id;
  },
  
  // Custom log level based on status code
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  
  // Custom success message
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  
  // Custom error message
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
  },
  
  // Don't log these paths (reduce noise)
  autoLogging: {
    ignore: (req) => {
      // Skip health check endpoints
      const skipPaths = ['/api/v1/health', '/api/v1/ready', '/api/v1/live', '/health'];
      return skipPaths.some(path => req.url.startsWith(path));
    },
  },
  
  // Custom attribute keys
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
    responseTime: 'duration',
  },
  
  // Redact in HTTP logs too
  redact: redactPaths,
});

// ═══════════════════════════════════════════════════════════════════════════
// CHILD LOGGER FACTORY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a child logger with additional context
 * 
 * @example
 * const cardLogger = createChildLogger({ card: 'fair-value-forecaster' });
 * cardLogger.info({ symbol: 'TCS' }, 'Processing card');
 */
function createChildLogger(context) {
  return logger.child(context);
}

// ═══════════════════════════════════════════════════════════════════════════
// LOG HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Log an API request manually (if not using middleware)
 */
function logRequest(req, res, duration) {
  logger.info({
    type: 'request',
    method: req.method,
    url: req.url,
    status: res.statusCode,
    duration: `${duration}ms`,
    requestId: req.id,
  });
}

/**
 * Log startup info
 */
function logStartup(config) {
  logger.info({
    type: 'startup',
    ...config,
  }, `🚀 Server started on port ${config.port}`);
}

/**
 * Log shutdown
 */
function logShutdown(signal) {
  logger.info({
    type: 'shutdown',
    signal,
  }, `🛑 Server shutting down (${signal})`);
}

/**
 * Log an error with context
 */
function logError(err, context = {}) {
  logger.error({
    type: 'error',
    err,
    ...context,
  }, err.message);
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

module.exports = {
  logger,
  httpLogger,
  createChildLogger,
  generateRequestId,
  logRequest,
  logStartup,
  logShutdown,
  logError,
};
