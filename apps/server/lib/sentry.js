/**
 * Sentry Error Tracking
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Integrates Sentry for error tracking and performance monitoring.
 * 
 * Setup:
 *   1. Create account at https://sentry.io
 *   2. Create a Node.js project
 *   3. Set SENTRY_DSN environment variable
 * 
 * Usage:
 *   const { initSentry, sentryErrorHandler } = require('./lib/sentry');
 *   
 *   // At app start (before other middleware)
 *   initSentry(app);
 *   
 *   // After all routes (as last error handler)
 *   app.use(sentryErrorHandler());
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const Sentry = require('@sentry/node');
const pkg = require('../package.json');

/**
 * Check if Sentry is configured
 */
function isSentryConfigured() {
  return Boolean(process.env.SENTRY_DSN);
}

/**
 * Initialize Sentry
 * Call this early in your app, before other middleware
 * 
 * @param {Express} app - Express application
 */
function initSentry(app) {
  if (!isSentryConfigured()) {
    console.log('⚠️  Sentry not configured (SENTRY_DSN not set)');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    release: `monomorph-api@${pkg.version}`,
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Capture 100% of errors
    sampleRate: 1.0,
    
    // Integrations
    integrations: [
      // Automatically instrument Node.js libraries
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],
    
    // Filter out noisy errors
    beforeSend(event, hint) {
      const error = hint.originalException;
      
      // Don't send 404 errors
      if (error && error.status === 404) {
        return null;
      }
      
      // Don't send rate limit errors
      if (error && error.status === 429) {
        return null;
      }
      
      return event;
    },
    
    // Add extra context
    initialScope: {
      tags: {
        service: 'monomorph-api',
        version: pkg.version,
      },
    },
  });

  // Add Sentry request handler (must be first middleware)
  if (app) {
    app.use(Sentry.Handlers.requestHandler());
    
    // Add tracing handler for performance monitoring
    app.use(Sentry.Handlers.tracingHandler());
  }

  console.log('✅ Sentry initialized');
}

/**
 * Sentry error handler middleware
 * Add this AFTER all routes but BEFORE your custom error handler
 * 
 * @returns {Function} Express error handler middleware
 */
function sentryErrorHandler() {
  if (!isSentryConfigured()) {
    // Return no-op middleware if Sentry isn't configured
    return (err, req, res, next) => next(err);
  }
  
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture 500 errors
      if (error.status >= 500) {
        return true;
      }
      
      // Capture unhandled errors
      if (!error.status) {
        return true;
      }
      
      return false;
    },
  });
}

/**
 * Manually capture an exception
 * 
 * @param {Error} error - Error to capture
 * @param {object} context - Additional context
 */
function captureException(error, context = {}) {
  if (!isSentryConfigured()) {
    console.error('Error (Sentry not configured):', error);
    return;
  }
  
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Manually capture a message
 * 
 * @param {string} message - Message to capture
 * @param {string} level - Severity level (info, warning, error)
 * @param {object} context - Additional context
 */
function captureMessage(message, level = 'info', context = {}) {
  if (!isSentryConfigured()) {
    console.log(`[${level}] ${message}`, context);
    return;
  }
  
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Set user context for error tracking
 * 
 * @param {object} user - User object with id, email, etc.
 */
function setUser(user) {
  if (!isSentryConfigured()) return;
  
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

/**
 * Clear user context (on logout)
 */
function clearUser() {
  if (!isSentryConfigured()) return;
  
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 * 
 * @param {object} breadcrumb - Breadcrumb data
 */
function addBreadcrumb(breadcrumb) {
  if (!isSentryConfigured()) return;
  
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Flush pending events (call before process exit)
 * 
 * @param {number} timeout - Timeout in ms (default: 2000)
 */
async function flush(timeout = 2000) {
  if (!isSentryConfigured()) return;
  
  await Sentry.flush(timeout);
}

module.exports = {
  initSentry,
  sentryErrorHandler,
  captureException,
  captureMessage,
  setUser,
  clearUser,
  addBreadcrumb,
  flush,
  isSentryConfigured,
  Sentry, // Export raw Sentry for advanced usage
};
