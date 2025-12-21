/**
 * Rate Limiter Middleware
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Express middleware that applies rate limits based on:
 *   - Access tier (authenticated, apiKey, anonymous, admin)
 *   - Endpoint category (general, writes, workflow, etc.)
 * 
 * Headers Added:
 *   - X-RateLimit-Limit: Maximum requests allowed
 *   - X-RateLimit-Remaining: Requests remaining
 *   - X-RateLimit-Reset: When the limit resets (ISO timestamp)
 *   - Retry-After: Seconds until retry (only on 429)
 * 
 * Response on Rate Limit (429):
 * {
 *   "error": "Too Many Requests",
 *   "message": "Rate limit exceeded...",
 *   "retryAfter": 45,
 *   "limit": 100,
 *   "remaining": 0,
 *   "resetAt": "2025-12-22T02:30:00.000Z"
 * }
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const { checkRateLimit, generateRateLimitKey, getClientIP } = require('../lib/rateLimit');
const { getRateLimit, getEndpointCategory, isAdminEndpoint, isPublicEndpoint } = require('../lib/rateLimitConfig');
const { logger } = require('../lib/logger');

/**
 * Determine access tier from request
 * 
 * Priority:
 *   1. Admin (if admin auth present and endpoint is admin)
 *   2. Authenticated user (if user object present)
 *   3. API Key (if x-api-key header present)
 *   4. Anonymous (fallback to IP)
 * 
 * @param {object} req - Express request
 * @returns {string} Access tier
 */
function determineAccessTier(req) {
  const path = req.path;
  
  // Admin endpoints require admin auth
  if (isAdminEndpoint(path)) {
    if (req.admin || req.user?.isAdmin) {
      return 'admin';
    }
    // Non-admin trying to access admin endpoint - use strictest limits
    return 'anonymous';
  }
  
  // Check for authenticated user
  if (req.user && req.user.id) {
    return 'authenticated';
  }
  
  // Check for API key
  if (req.headers['x-api-key']) {
    return 'apiKey';
  }
  
  // Default to anonymous (IP-based)
  return 'anonymous';
}

/**
 * Create rate limiter middleware
 * 
 * @param {object} options - Override options
 * @param {string} options.category - Force specific category (optional)
 * @param {number} options.requests - Override request limit (optional)
 * @param {number} options.window - Override window in seconds (optional)
 * @param {function} options.keyGenerator - Custom key generator (optional)
 * @param {function} options.skip - Function to skip rate limiting (optional)
 * @returns {function} Express middleware
 */
function rateLimiter(options = {}) {
  return async (req, res, next) => {
    try {
      // Check if rate limiting should be skipped
      if (options.skip && options.skip(req)) {
        return next();
      }
      
      // Skip rate limiting for health checks in production
      if (req.path === '/api/v1/health' || req.path === '/api/v1/live') {
        return next();
      }
      
      // Determine access tier and endpoint category
      const tier = determineAccessTier(req);
      const category = options.category || getEndpointCategory(req);
      
      // Get rate limit config
      const config = getRateLimit(tier, category);
      const limit = options.requests || config.requests;
      const window = options.window || config.window;
      const message = config.message || 'Rate limit exceeded';
      
      // Generate rate limit key
      const key = options.keyGenerator 
        ? options.keyGenerator(req)
        : generateRateLimitKey(req, tier, category);
      
      // Check rate limit
      const result = await checkRateLimit(key, limit, window);
      
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': result.limit,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': result.resetAt.toISOString(),
      });
      
      if (!result.allowed) {
        // Add Retry-After header
        res.set('Retry-After', result.retryAfter);
        
        // Log rate limit hit
        logger.warn({
          component: 'rateLimiter',
          tier,
          category,
          ip: getClientIP(req),
          userId: req.user?.id,
          path: req.path,
          method: req.method,
        }, 'Rate limit exceeded');
        
        return res.status(429).json({
          error: 'Too Many Requests',
          message,
          retryAfter: result.retryAfter,
          limit: result.limit,
          remaining: result.remaining,
          resetAt: result.resetAt.toISOString(),
        });
      }
      
      next();
      
    } catch (err) {
      // Log error but don't block request (fail open)
      logger.error({
        component: 'rateLimiter',
        error: err.message,
        path: req.path,
      }, 'Rate limiter error - allowing request');
      
      next();
    }
  };
}

/**
 * Create strict rate limiter for specific endpoints
 * Useful for login, registration, and other sensitive endpoints
 * 
 * @param {number} requests - Maximum requests
 * @param {number} windowSeconds - Time window in seconds
 * @param {string} message - Custom error message
 * @returns {function} Express middleware
 */
function strictRateLimiter(requests, windowSeconds, message = 'Too many requests') {
  return rateLimiter({
    requests,
    window: windowSeconds,
    category: 'strict',
    keyGenerator: (req) => {
      // Always use IP for strict limits (prevent auth bypass)
      const ip = getClientIP(req);
      return `rl:strict:${ip}:${req.path}`;
    },
  });
}

/**
 * Create rate limiter specifically for authentication endpoints
 * Extra strict to prevent brute force attacks
 * 
 * @returns {function} Express middleware
 */
function authRateLimiter() {
  return rateLimiter({
    category: 'login',
    keyGenerator: (req) => {
      const ip = getClientIP(req);
      // Include username/email in key if provided (prevent distributed attacks)
      const identifier = req.body?.email || req.body?.username || '';
      const sanitized = identifier.toLowerCase().replace(/[^a-z0-9]/g, '');
      return `rl:auth:${ip}:${sanitized.substring(0, 32)}`;
    },
  });
}

/**
 * Create rate limiter for admin endpoints
 * Requires admin authentication
 * 
 * @returns {function} Express middleware
 */
function adminRateLimiter() {
  return (req, res, next) => {
    // Check admin auth first
    if (!req.admin && !req.user?.isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }
    
    // Apply admin rate limits
    return rateLimiter({ category: 'operations' })(req, res, next);
  };
}

/**
 * Apply global rate limiting to all routes
 * Should be used early in middleware chain
 * 
 * @returns {function} Express middleware
 */
function globalRateLimiter() {
  return rateLimiter({
    // Use 'general' category, tier determined per request
  });
}

module.exports = {
  rateLimiter,
  strictRateLimiter,
  authRateLimiter,
  adminRateLimiter,
  globalRateLimiter,
  determineAccessTier,
};
