/**
 * Rate Limit Core Logic
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Implements sliding window rate limiting using Redis sorted sets.
 * 
 * Algorithm:
 *   1. Use Redis sorted set where score = timestamp
 *   2. Remove entries outside the current window
 *   3. Count remaining entries
 *   4. If count < limit, allow and add new entry
 *   5. If count >= limit, reject with 429
 * 
 * Benefits:
 *   - Smooth rate limiting (no burst at window edges)
 *   - Accurate counting
 *   - Efficient with Redis pipeline
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const { getRedis } = require('./redis');
const { logger } = require('./logger');

/**
 * Check if a request is within rate limits
 * 
 * @param {string} key - Unique identifier for this rate limit (e.g., "rl:user:123:general")
 * @param {number} limit - Maximum requests allowed in window
 * @param {number} windowSeconds - Time window in seconds
 * @returns {Promise<object>} Result object
 */
async function checkRateLimit(key, limit, windowSeconds) {
  const redis = await getRedis();
  const now = Date.now();
  const windowStart = now - (windowSeconds * 1000);
  
  try {
    // Use pipeline for atomic operations
    const pipeline = redis.pipeline();
    
    // 1. Remove entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);
    
    // 2. Count entries in current window
    pipeline.zcard(key);
    
    // 3. Add current request (score = timestamp, member = unique ID)
    const requestId = `${now}:${Math.random().toString(36).substr(2, 9)}`;
    pipeline.zadd(key, now, requestId);
    
    // 4. Set expiry on the key (cleanup old keys)
    pipeline.expire(key, windowSeconds);
    
    const results = await pipeline.exec();
    
    // Extract count from pipeline results
    // results[1] is the zcard result: [error, count]
    const currentCount = results[1][1];
    
    const allowed = currentCount < limit;
    const remaining = Math.max(0, limit - currentCount - 1);
    const resetAt = new Date(now + windowSeconds * 1000);
    
    // Log rate limit check (debug level)
    logger.debug({
      component: 'rateLimit',
      key: key.replace(/:.+$/, ':***'),  // Mask user IDs
      allowed,
      current: currentCount,
      limit,
      remaining,
    }, 'Rate limit check');
    
    return {
      allowed,
      current: currentCount,
      limit,
      remaining,
      resetAt,
      retryAfter: allowed ? 0 : Math.ceil(windowSeconds - ((now - windowStart) / 1000)),
    };
    
  } catch (err) {
    logger.error({
      component: 'rateLimit',
      error: err.message,
      key: key.replace(/:.+$/, ':***'),
    }, 'Rate limit check failed');
    
    // Fail open - allow request if rate limiting fails
    return {
      allowed: true,
      current: 0,
      limit,
      remaining: limit,
      resetAt: new Date(now + windowSeconds * 1000),
      retryAfter: 0,
      error: err.message,
    };
  }
}

/**
 * Generate rate limit key based on request
 * 
 * Key format: rl:{tier}:{identifier}:{category}
 * Examples:
 *   - rl:user:123:general
 *   - rl:apikey:abc123:writes
 *   - rl:ip:192.168.1.1:login
 * 
 * @param {object} req - Express request
 * @param {string} tier - Access tier (authenticated, apiKey, anonymous)
 * @param {string} category - Endpoint category (general, writes, workflow, etc.)
 * @returns {string} Rate limit key
 */
function generateRateLimitKey(req, tier, category) {
  let identifier;
  
  switch (tier) {
    case 'authenticated':
      identifier = req.user?.id || req.user?.userId || 'unknown';
      break;
    case 'apiKey':
      identifier = req.apiKeyId || req.headers['x-api-key']?.substring(0, 16) || 'unknown';
      break;
    case 'admin':
      identifier = req.admin?.id || 'admin';
      break;
    case 'anonymous':
    default:
      identifier = getClientIP(req);
      break;
  }
  
  return `rl:${tier}:${identifier}:${category}`;
}

/**
 * Get client IP address, handling proxies
 * 
 * @param {object} req - Express request
 * @returns {string} Client IP address
 */
function getClientIP(req) {
  // Check various headers for real IP (behind proxy/load balancer)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first (client)
    return forwarded.split(',')[0].trim();
  }
  
  return req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         req.ip ||
         'unknown';
}

/**
 * Reset rate limit for a key
 * 
 * @param {string} key - Rate limit key to reset
 * @returns {Promise<boolean>} Success status
 */
async function resetRateLimit(key) {
  try {
    const redis = await getRedis();
    await redis.del(key);
    logger.info({ component: 'rateLimit', key }, 'Rate limit reset');
    return true;
  } catch (err) {
    logger.error({ component: 'rateLimit', error: err.message }, 'Failed to reset rate limit');
    return false;
  }
}

/**
 * Get current rate limit status for a key (without incrementing)
 * 
 * @param {string} key - Rate limit key
 * @param {number} limit - Maximum requests allowed
 * @param {number} windowSeconds - Time window
 * @returns {Promise<object>} Current status
 */
async function getRateLimitStatus(key, limit, windowSeconds) {
  const redis = await getRedis();
  const now = Date.now();
  const windowStart = now - (windowSeconds * 1000);
  
  try {
    // Remove old entries and count
    await redis.zremrangebyscore(key, 0, windowStart);
    const count = await redis.zcard(key);
    
    return {
      current: count,
      limit,
      remaining: Math.max(0, limit - count),
      resetAt: new Date(now + windowSeconds * 1000),
    };
  } catch (err) {
    return {
      current: 0,
      limit,
      remaining: limit,
      resetAt: new Date(now + windowSeconds * 1000),
      error: err.message,
    };
  }
}

module.exports = {
  checkRateLimit,
  generateRateLimitKey,
  getClientIP,
  resetRateLimit,
  getRateLimitStatus,
};
