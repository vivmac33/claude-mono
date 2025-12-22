/**
 * Environment Validation
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Validates required environment variables at startup.
 * Fails fast with clear error messages if configuration is missing.
 * 
 * Usage:
 *   const { validateEnv } = require('./lib/env');
 *   validateEnv(); // Throws if required vars missing
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Environment variable definitions
 * 
 * required: true = server won't start without it
 * required: false = optional, uses default or degrades gracefully
 */
const ENV_SCHEMA = {
  // ═══════════════════════════════════════════════════════════════════════
  // SERVER
  // ═══════════════════════════════════════════════════════════════════════
  PORT: {
    required: false,
    default: '4000',
    description: 'Server port',
  },
  NODE_ENV: {
    required: false,
    default: 'development',
    description: 'Environment (development, production, test)',
    validate: (val) => ['development', 'production', 'test'].includes(val),
    validValues: ['development', 'production', 'test'],
  },
  LOG_LEVEL: {
    required: false,
    default: 'info',
    description: 'Logging level',
    validate: (val) => ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].includes(val),
    validValues: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // REDIS (Rate Limiting)
  // ═══════════════════════════════════════════════════════════════════════
  REDIS_URL: {
    required: false, // Falls back to in-memory
    description: 'Redis connection URL for rate limiting',
    sensitive: true,
    example: 'redis://localhost:6379',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // DATABASE (Future)
  // ═══════════════════════════════════════════════════════════════════════
  DATABASE_URL: {
    required: false, // Not yet implemented
    description: 'PostgreSQL connection URL',
    sensitive: true,
    example: 'postgresql://user:pass@host:5432/db',
  },
  SUPABASE_URL: {
    required: false,
    description: 'Supabase project URL',
    example: 'https://xxx.supabase.co',
  },
  SUPABASE_ANON_KEY: {
    required: false,
    description: 'Supabase anonymous key',
    sensitive: true,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // AUTH (Future)
  // ═══════════════════════════════════════════════════════════════════════
  JWT_SECRET: {
    required: false, // Not yet implemented
    description: 'Secret for signing JWT tokens',
    sensitive: true,
    minLength: 32,
  },
  JWT_EXPIRES_IN: {
    required: false,
    default: '7d',
    description: 'JWT token expiration',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // DATA PROVIDERS (Admin only - Zerodha is TEMP)
  // ═══════════════════════════════════════════════════════════════════════
  ZERODHA_API_KEY: {
    required: false,
    description: 'Zerodha API key (TEMP - admin only)',
    sensitive: true,
    note: 'Temporary data provider for testing. Will be replaced.',
  },
  ZERODHA_API_SECRET: {
    required: false,
    description: 'Zerodha API secret (TEMP - admin only)',
    sensitive: true,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // EXTERNAL SERVICES (Future)
  // ═══════════════════════════════════════════════════════════════════════
  SENTRY_DSN: {
    required: false,
    description: 'Sentry error tracking DSN',
    sensitive: true,
  },
};

/**
 * Validation result
 */
class EnvValidationResult {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.loaded = {};
  }

  addError(key, message) {
    this.errors.push({ key, message });
  }

  addWarning(key, message) {
    this.warnings.push({ key, message });
  }

  get isValid() {
    return this.errors.length === 0;
  }
}

/**
 * Validate environment variables
 * 
 * @param {object} options
 * @param {boolean} options.exitOnError - Exit process on validation failure (default: true in production)
 * @param {boolean} options.logWarnings - Log warnings for missing optional vars (default: true)
 * @returns {EnvValidationResult}
 */
function validateEnv(options = {}) {
  const {
    exitOnError = process.env.NODE_ENV === 'production',
    logWarnings = true,
  } = options;

  const result = new EnvValidationResult();

  for (const [key, schema] of Object.entries(ENV_SCHEMA)) {
    const value = process.env[key];
    const hasValue = value !== undefined && value !== '';

    // Check required
    if (schema.required && !hasValue) {
      result.addError(key, `Required environment variable ${key} is missing`);
      continue;
    }

    // Apply default
    if (!hasValue && schema.default !== undefined) {
      process.env[key] = schema.default;
      result.loaded[key] = schema.default;
      continue;
    }

    // Skip validation if no value and not required
    if (!hasValue) {
      if (logWarnings && schema.description) {
        result.addWarning(key, `Optional: ${schema.description}`);
      }
      continue;
    }

    // Validate value
    if (schema.validate && !schema.validate(value)) {
      const validValues = schema.validValues ? ` Valid values: ${schema.validValues.join(', ')}` : '';
      result.addError(key, `Invalid value for ${key}: "${value}".${validValues}`);
      continue;
    }

    // Check minimum length (for secrets)
    if (schema.minLength && value.length < schema.minLength) {
      result.addError(key, `${key} must be at least ${schema.minLength} characters`);
      continue;
    }

    // Store loaded value (masked if sensitive)
    result.loaded[key] = schema.sensitive ? '***' : value;
  }

  // Handle results
  if (!result.isValid) {
    console.error('\n╔═══════════════════════════════════════════════════════════════╗');
    console.error('║  ❌ ENVIRONMENT VALIDATION FAILED                              ║');
    console.error('╠═══════════════════════════════════════════════════════════════╣');
    
    for (const error of result.errors) {
      console.error(`║  • ${error.message}`);
    }
    
    console.error('╠═══════════════════════════════════════════════════════════════╣');
    console.error('║  Fix the above issues and restart the server.                 ║');
    console.error('╚═══════════════════════════════════════════════════════════════╝\n');

    if (exitOnError) {
      process.exit(1);
    }
  }

  return result;
}

/**
 * Get environment configuration summary
 * Safe to log (sensitive values masked)
 */
function getEnvSummary() {
  const summary = {};

  for (const [key, schema] of Object.entries(ENV_SCHEMA)) {
    const value = process.env[key];
    const hasValue = value !== undefined && value !== '';

    if (hasValue) {
      summary[key] = schema.sensitive ? '***' : value;
    } else if (schema.default) {
      summary[key] = `${schema.default} (default)`;
    } else {
      summary[key] = '(not set)';
    }
  }

  return summary;
}

/**
 * Check if a specific feature is configured
 */
function isConfigured(feature) {
  const featureVars = {
    redis: ['REDIS_URL'],
    database: ['DATABASE_URL'],
    supabase: ['SUPABASE_URL', 'SUPABASE_ANON_KEY'],
    auth: ['JWT_SECRET'],
    zerodha: ['ZERODHA_API_KEY', 'ZERODHA_API_SECRET'],
    sentry: ['SENTRY_DSN'],
  };

  const vars = featureVars[feature];
  if (!vars) return false;

  return vars.every(v => process.env[v]);
}

/**
 * Get list of configured features
 */
function getConfiguredFeatures() {
  const features = ['redis', 'database', 'supabase', 'auth', 'zerodha', 'sentry'];
  return features.filter(isConfigured);
}

module.exports = {
  validateEnv,
  getEnvSummary,
  isConfigured,
  getConfiguredFeatures,
  ENV_SCHEMA,
};
