# Monomorph API Server - Status & Changelog

## Current Version: 1.7.0

**Last Updated:** December 22, 2025

---

## ✅ COMPLETED FEATURES

### v1.7.0 - Error Tracking & Frontend Polish (Current)
- [x] Sentry error tracking integration
- [x] Automatic error capture and reporting
- [x] Graceful shutdown with Sentry flush
- [x] Offline indicator component (Frontend)
- [x] Data freshness timestamps (Frontend)
- [x] useOnlineStatus hook
- [x] useDataFreshness hook

### v1.6.1 - Environment Validation
- [x] Environment variable validation at startup
- [x] Fail-fast on missing required config
- [x] Clear error messages for configuration issues
- [x] .env.example template
- [x] Feature detection (redis, database, auth, etc.)

### v1.6.0 - Swagger Documentation
- [x] Interactive API documentation at `/docs`
- [x] OpenAPI 3.0 specification
- [x] JSON and YAML spec endpoints
- [x] Custom styling for Swagger UI
- [x] Rate limit documentation

### v1.5.2 - Rate Limiting
- [x] Redis-backed rate limiting
- [x] In-memory fallback when Redis unavailable
- [x] Tiered limits (authenticated, apiKey, anonymous)
- [x] Sliding window algorithm
- [x] Standard rate limit headers
- [x] Strict limits on auth endpoints

### v1.5.1 - Toast Notifications (Frontend)
- [x] Toast notification system
- [x] Success, error, warning, info variants
- [x] Auto-dismiss with configurable duration
- [x] API error integration

### v1.3.0 - Foundation
- [x] Health check endpoint (`/api/v1/health`)
- [x] Readiness probe (`/api/v1/ready`)
- [x] Liveness probe (`/api/v1/live`)
- [x] API versioning (v1)
- [x] Structured logging (Pino)
- [x] Legacy route redirects
- [x] CI/CD pipeline (GitHub Actions)

---

## 📊 RATE LIMITS

| Tier | General | Writes | Workflow |
|------|---------|--------|----------|
| Authenticated | 200/min | 60/min | 20/min |
| API Key | 60/min | 20/min | 5/min |
| Anonymous | 30/min | — | — |
| Login | — | — | 5/5min |
| Register | — | — | 3/hour |

---

## 🔧 CONFIGURATION

### Required Environment Variables
None currently required (all have defaults or graceful fallbacks)

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 4000 |
| `NODE_ENV` | Environment | development |
| `LOG_LEVEL` | Logging level | info |
| `REDIS_URL` | Redis for rate limiting | (in-memory fallback) |
| `SENTRY_DSN` | Sentry error tracking | (disabled if not set) |
| `DATABASE_URL` | PostgreSQL | (not yet implemented) |
| `JWT_SECRET` | Auth signing key | (not yet implemented) |

---

## 🚀 DEPLOYMENT

### Production
- **Platform:** Railway
- **URL:** https://monomorphapi-production.up.railway.app
- **Docs:** https://monomorphapi-production.up.railway.app/docs
- **Auto-deploy:** Yes (GitHub push to main)

### Services
- **Redis:** Railway Redis (connected)
- **Sentry:** Optional (enable with SENTRY_DSN)
- **Database:** Not yet configured

---

## 📋 ROADMAP

### Completed ✅
- [x] Health endpoints & probes
- [x] API versioning
- [x] Structured logging
- [x] Toast notifications (frontend)
- [x] Rate limiting with Redis
- [x] Swagger documentation
- [x] Environment validation
- [x] CI/CD pipeline
- [x] Offline indicator (frontend)
- [x] Data freshness timestamps (frontend)
- [x] Error tracking (Sentry)

### Next Up
- [ ] Real data connections (Zerodha → Commercial vendor)
- [ ] User authentication (JWT)
- [ ] Database integration (Supabase/PostgreSQL)
- [ ] Multi-card display wiring
- [ ] Workflow builder UX overhaul

---

## 📁 FILE STRUCTURE

### Server
```
apps/server/
├── server.js                 # Main server (v1.7.0)
├── package.json              # Dependencies
├── .env.example              # Environment template
├── lib/
│   ├── env.js                # Environment validation
│   ├── logger.js             # Pino logging
│   ├── redis.js              # Redis connection
│   ├── rateLimit.js          # Rate limit logic
│   ├── rateLimitConfig.js    # Rate limit tiers
│   ├── swagger.js            # Swagger setup
│   └── sentry.js             # Error tracking
├── middleware/
│   └── rateLimiter.js        # Rate limit middleware
├── docs/
│   └── openapi.yaml          # API specification
└── mock-data/
    ├── master-stock-data.json
    └── cards/
        └── *.json            # Card data files
```

### Frontend (New Components)
```
apps/web/src/
├── hooks/
│   ├── index.ts              # Hooks export
│   ├── useOnlineStatus.ts    # Network status hook
│   └── useDataFreshness.ts   # Timestamp formatting hook
└── components/ui/
    ├── OfflineIndicator.tsx  # Offline banner component
    └── FreshnessIndicator.tsx # Data freshness display
```

---

## 🔗 ENDPOINTS

### Health
- `GET /api/v1/health` - Server health
- `GET /api/v1/ready` - Readiness probe
- `GET /api/v1/live` - Liveness probe

### Documentation
- `GET /docs` - Swagger UI
- `GET /docs/json` - OpenAPI spec (JSON)
- `GET /docs/yaml` - OpenAPI spec (YAML)

### Data
- `GET /api/v1/stocks` - All stocks
- `GET /api/v1/stocks/:symbol` - Stock by symbol
- `GET /api/v1/search?q=` - Search stocks
- `GET /api/v1/analytics/:cardId` - Analytics data

### Auth (Not yet implemented)
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/forgot-password`

---

## 📝 NOTES

### Zerodha Integration
> **Important:** Zerodha is a TEMPORARY data provider for testing.
> - Endpoints are ADMIN-ONLY
> - NOT for user authentication
> - Will be replaced with commercial data vendor for production

### Sentry Setup
To enable error tracking:
1. Create account at https://sentry.io
2. Create a Node.js project
3. Set `SENTRY_DSN` environment variable in Railway

### Frontend Components
New hooks and components for better UX:
- `useOnlineStatus` - Tracks network connectivity
- `useDataFreshness` - Human-readable timestamps
- `OfflineIndicator` - Shows banner when offline
- `FreshnessIndicator` - Shows "Updated 5 min ago"

---

## 📞 CHANGELOG

### v1.7.0 (2025-12-22)
- Added Sentry error tracking
- Added offline indicator component
- Added data freshness timestamps
- Added useOnlineStatus hook
- Added useDataFreshness hook
- Custom error handler with Sentry integration

### v1.6.1 (2025-12-22)
- Added environment validation module
- Fail-fast on missing required config
- Added .env.example template
- Added feature detection to health endpoint

### v1.6.0 (2025-12-22)
- Added Swagger UI documentation at /docs
- Added OpenAPI 3.0 specification
- Added custom Swagger styling

### v1.5.2 (2025-12-22)
- Added Redis-backed rate limiting
- Added tiered rate limits
- Added rate limit headers

### v1.5.1 (2025-12-22)
- Added toast notification system (frontend)

### v1.3.0 (2025-12-21)
- Initial production release
- Health endpoints
- API versioning
- Structured logging
- CI/CD pipeline
