/**
 * Redis Connection Module
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Provides Redis connection for rate limiting and caching.
 * Falls back to in-memory storage when Redis is unavailable.
 * 
 * Environment Variables:
 *   REDIS_URL - Redis connection string (e.g., redis://localhost:6379)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const { logger } = require('./logger');

let redis = null;
let isConnected = false;

// ═══════════════════════════════════════════════════════════════════════════
// IN-MEMORY FALLBACK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simple in-memory store for development/fallback
 * Mimics basic Redis operations
 */
class MemoryStore {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
    logger.warn({ component: 'redis' }, 'Using in-memory store (Redis unavailable)');
  }

  async zadd(key, score, member) {
    if (!this.store.has(key)) {
      this.store.set(key, new Map());
    }
    this.store.get(key).set(member, score);
    return 1;
  }

  async zremrangebyscore(key, min, max) {
    if (!this.store.has(key)) return 0;
    const set = this.store.get(key);
    let removed = 0;
    for (const [member, score] of set.entries()) {
      if (score >= min && score <= max) {
        set.delete(member);
        removed++;
      }
    }
    return removed;
  }

  async zcard(key) {
    if (!this.store.has(key)) return 0;
    return this.store.get(key).size;
  }

  async expire(key, seconds) {
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }
    // Set new expiry
    const timer = setTimeout(() => {
      this.store.delete(key);
      this.timers.delete(key);
    }, seconds * 1000);
    this.timers.set(key, timer);
    return 1;
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async set(key, value, ...args) {
    this.store.set(key, value);
    // Handle EX option
    const exIndex = args.indexOf('EX');
    if (exIndex !== -1 && args[exIndex + 1]) {
      await this.expire(key, parseInt(args[exIndex + 1]));
    }
    return 'OK';
  }

  async del(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    return this.store.delete(key) ? 1 : 0;
  }

  async incr(key) {
    const current = parseInt(this.store.get(key) || '0');
    this.store.set(key, String(current + 1));
    return current + 1;
  }

  pipeline() {
    const commands = [];
    const self = this;
    
    const pipelineObj = {
      zadd: (...args) => { commands.push(['zadd', args]); return pipelineObj; },
      zremrangebyscore: (...args) => { commands.push(['zremrangebyscore', args]); return pipelineObj; },
      zcard: (...args) => { commands.push(['zcard', args]); return pipelineObj; },
      expire: (...args) => { commands.push(['expire', args]); return pipelineObj; },
      incr: (...args) => { commands.push(['incr', args]); return pipelineObj; },
      exec: async () => {
        const results = [];
        for (const [cmd, args] of commands) {
          try {
            const result = await self[cmd](...args);
            results.push([null, result]);
          } catch (err) {
            results.push([err, null]);
          }
        }
        return results;
      }
    };
    
    return pipelineObj;
  }

  // Health check
  async ping() {
    return 'PONG';
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REDIS INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialize Redis connection
 * Falls back to in-memory store if Redis is unavailable
 */
async function initRedis() {
  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    logger.info({ component: 'redis' }, 'REDIS_URL not set, using in-memory store');
    redis = new MemoryStore();
    return redis;
  }

  try {
    const Redis = require('ioredis');
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    // Event handlers
    redis.on('connect', () => {
      isConnected = true;
      logger.info({ component: 'redis' }, 'Redis connected');
    });

    redis.on('error', (err) => {
      isConnected = false;
      logger.error({ component: 'redis', error: err.message }, 'Redis error');
    });

    redis.on('close', () => {
      isConnected = false;
      logger.warn({ component: 'redis' }, 'Redis connection closed');
    });

    redis.on('reconnecting', () => {
      logger.info({ component: 'redis' }, 'Redis reconnecting...');
    });

    // Attempt connection
    await redis.connect();
    await redis.ping();
    isConnected = true;
    
    logger.info({ component: 'redis', url: redisUrl.replace(/\/\/.*@/, '//***@') }, 'Redis ready');
    return redis;

  } catch (err) {
    logger.error({ component: 'redis', error: err.message }, 'Redis connection failed, using in-memory fallback');
    redis = new MemoryStore();
    return redis;
  }
}

/**
 * Get Redis client (initializes on first call)
 */
async function getRedis() {
  if (!redis) {
    await initRedis();
  }
  return redis;
}

/**
 * Check if Redis is connected
 */
function isRedisConnected() {
  return isConnected;
}

/**
 * Graceful shutdown
 */
async function closeRedis() {
  if (redis && typeof redis.quit === 'function') {
    try {
      await redis.quit();
      logger.info({ component: 'redis' }, 'Redis connection closed gracefully');
    } catch (err) {
      logger.error({ component: 'redis', error: err.message }, 'Error closing Redis connection');
    }
  }
}

module.exports = {
  getRedis,
  initRedis,
  isRedisConnected,
  closeRedis,
  MemoryStore,
};
