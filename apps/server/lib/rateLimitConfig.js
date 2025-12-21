/**
 * Rate Limit Configuration
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Defines rate limits for different access tiers and endpoint categories.
 * 
 * Access Tiers (by trust level):
 *   1. authenticated - Logged-in users (highest trust)
 *   2. apiKey        - Programmatic access (medium trust, stricter)
 *   3. anonymous     - IP-only access (lowest trust, most strict)
 *   4. admin         - Admin endpoints (internal/data provider)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const RATE_LIMITS = {
  // ═══════════════════════════════════════════════════════════════════════
  // AUTHENTICATED USERS (highest trust - your paying customers)
  // ═══════════════════════════════════════════════════════════════════════
  authenticated: {
    // General browsing - viewing stocks, analytics, etc.
    general: { 
      requests: 200, 
      window: 60,  // 200 requests per minute
      message: 'Rate limit exceeded. Please slow down.',
    },
    // Write operations - save, update, delete
    writes: { 
      requests: 60, 
      window: 60,  // 60 writes per minute
      message: 'Too many write operations. Please wait.',
    },
    // Heavy compute - workflow execution, complex analytics
    workflow: { 
      requests: 20, 
      window: 60,  // 20 workflow runs per minute
      message: 'Workflow rate limit exceeded. Please wait before running more.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // API KEY ACCESS (programmatic - stricter than authenticated)
  // Use case: scripts, bots, integrations
  // ═══════════════════════════════════════════════════════════════════════
  apiKey: {
    general: { 
      requests: 60, 
      window: 60,  // 60 per minute (3x stricter than authenticated)
      message: 'API rate limit exceeded. Reduce request frequency.',
    },
    writes: { 
      requests: 20, 
      window: 60,  // 20 writes per minute
      message: 'API write rate limit exceeded.',
    },
    workflow: { 
      requests: 5, 
      window: 60,  // 5 workflow runs per minute
      message: 'API workflow rate limit exceeded.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ANONYMOUS / IP-ONLY (lowest trust - highest abuse risk)
  // Only for public endpoints like login, register
  // ═══════════════════════════════════════════════════════════════════════
  anonymous: {
    // Login attempts - prevent brute force
    login: { 
      requests: 5, 
      window: 300,  // 5 attempts per 5 minutes
      message: 'Too many login attempts. Please try again in 5 minutes.',
    },
    // Registration - prevent spam accounts
    register: { 
      requests: 3, 
      window: 3600,  // 3 registrations per hour per IP
      message: 'Too many registration attempts. Please try again later.',
    },
    // Public endpoints (health, docs, etc.)
    public: { 
      requests: 30, 
      window: 60,  // 30 per minute
      message: 'Rate limit exceeded. Please authenticate for higher limits.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ADMIN ONLY (internal operations)
  // Data provider sync, admin dashboard, etc.
  // NOTE: Zerodha is temp data provider - will be replaced with commercial vendor
  // ═══════════════════════════════════════════════════════════════════════
  admin: {
    // Data synchronization from providers (Zerodha/future vendor)
    dataSync: { 
      requests: 30, 
      window: 60,  // 30 syncs per minute
      message: 'Data sync rate limit exceeded.',
    },
    // Admin operations
    operations: { 
      requests: 100, 
      window: 60,  // 100 per minute
      message: 'Admin rate limit exceeded.',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ENDPOINT CATEGORIES
// Maps route patterns to rate limit categories
// ═══════════════════════════════════════════════════════════════════════════

const ENDPOINT_CATEGORIES = {
  // Auth endpoints (anonymous limits)
  '/api/v1/auth/login': 'login',
  '/api/v1/auth/register': 'register',
  '/api/v1/auth/forgot-password': 'login',
  '/api/v1/auth/reset-password': 'login',
  
  // Write operations
  'POST:/api/v1/watchlist': 'writes',
  'PUT:/api/v1/watchlist': 'writes',
  'DELETE:/api/v1/watchlist': 'writes',
  'POST:/api/v1/portfolio': 'writes',
  'PUT:/api/v1/portfolio': 'writes',
  'DELETE:/api/v1/portfolio': 'writes',
  'POST:/api/v1/workflow': 'writes',
  'PUT:/api/v1/workflow': 'writes',
  'DELETE:/api/v1/workflow': 'writes',
  
  // Heavy compute
  'POST:/api/v1/workflow/run': 'workflow',
  'POST:/api/v1/analytics/run': 'workflow',
  'POST:/api/v1/backtest': 'workflow',
  
  // Admin/data provider (internal only)
  '/api/v1/admin': 'operations',
  '/api/v1/data-sync': 'dataSync',
  '/api/v1/zerodha': 'dataSync',  // Temp data provider - admin only
  
  // Public endpoints (no auth required)
  '/api/v1/health': 'public',
  '/api/v1/ready': 'public',
  '/api/v1/live': 'public',
  '/': 'public',
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get rate limit config for a request
 * @param {string} tier - Access tier (authenticated, apiKey, anonymous, admin)
 * @param {string} category - Endpoint category (general, writes, workflow, etc.)
 * @returns {object} Rate limit config { requests, window, message }
 */
function getRateLimit(tier, category) {
  const tierConfig = RATE_LIMITS[tier];
  if (!tierConfig) {
    return RATE_LIMITS.anonymous.public;
  }
  
  return tierConfig[category] || tierConfig.general || RATE_LIMITS.anonymous.public;
}

/**
 * Determine endpoint category from request
 * @param {object} req - Express request
 * @returns {string} Category name
 */
function getEndpointCategory(req) {
  const method = req.method;
  const path = req.path;
  
  // Check exact matches first
  const methodPath = `${method}:${path}`;
  if (ENDPOINT_CATEGORIES[methodPath]) {
    return ENDPOINT_CATEGORIES[methodPath];
  }
  
  // Check path-only matches
  if (ENDPOINT_CATEGORIES[path]) {
    return ENDPOINT_CATEGORIES[path];
  }
  
  // Check prefix matches
  for (const [pattern, category] of Object.entries(ENDPOINT_CATEGORIES)) {
    if (path.startsWith(pattern.replace(':' + method, ''))) {
      return category;
    }
  }
  
  // Default to 'general'
  return 'general';
}

/**
 * Check if endpoint is admin-only
 * @param {string} path - Request path
 * @returns {boolean}
 */
function isAdminEndpoint(path) {
  return path.includes('/admin') || 
         path.includes('/data-sync') || 
         path.includes('/zerodha');  // Zerodha is admin-only (temp data provider)
}

/**
 * Check if endpoint is public (no auth required)
 * @param {string} path - Request path
 * @returns {boolean}
 */
function isPublicEndpoint(path) {
  const publicPaths = [
    '/api/v1/health',
    '/api/v1/ready',
    '/api/v1/live',
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/forgot-password',
    '/',
  ];
  return publicPaths.some(p => path.startsWith(p));
}

module.exports = {
  RATE_LIMITS,
  ENDPOINT_CATEGORIES,
  getRateLimit,
  getEndpointCategory,
  isAdminEndpoint,
  isPublicEndpoint,
};
