# Monomorph API Server - Status & Changelog

## Current Version: 1.6.1

**Last Updated:** December 22, 2025

---

## ✅ COMPLETED FEATURES

### v1.6.1 - Environment Validation (Current)
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
| `DATABASE_URL` | PostgreSQL | (not yet implemented) |
| `JWT_SECRET` | Auth signing key | (not yet implemented) |

---

## 🚀 DEPLOYMENT

### Production
- **Platform:** Railway
- **URL:** https://monomorphapi-production.up.railway.app
- **Auto-deploy:** Yes (GitHub push to main)

### Services
- **Redis:** Railway Redis (connected)
- **Database:** Not yet configured

---

## 📋 ROADMAP

### Next Up (Quick Wins)
- [ ] GitHub Actions CI/CD (2 hrs)
- [ ] Offline indicator - Frontend (2 hrs)
- [ ] Data freshness timestamps (2 hrs)
- [ ] Error tracking - Sentry (2 hrs)

### Later
- [ ] Real data connections (Zerodha → Commercial vendor)
- [ ] User authentication (JWT)
- [ ] Database integration (Supabase/PostgreSQL)
- [ ] Multi-card display wiring
- [ ] Workflow builder UX overhaul

---

## 📁 FILE STRUCTURE

```
apps/server/
├── server.js                 # Main server (v1.6.1)
├── package.json              # Dependencies
├── .env.example              # Environment template
├── lib/
│   ├── env.js                # Environment validation
│   ├── logger.js             # Pino logging
│   ├── redis.js              # Redis connection
│   ├── rateLimit.js          # Rate limit logic
│   ├── rateLimitConfig.js    # Rate limit tiers
│   └── swagger.js            # Swagger setup
├── middleware/
│   └── rateLimiter.js        # Rate limit middleware
├── docs/
│   └── openapi.yaml          # API specification
└── mock-data/
    ├── master-stock-data.json
    └── cards/
        └── *.json            # Card data files
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

### Architecture Decisions
1. **Rate Limiting:** Redis with in-memory fallback (graceful degradation)
2. **Logging:** Pino for structured JSON logs
3. **API Versioning:** All routes under `/api/v1/`
4. **Documentation:** OpenAPI 3.0 with Swagger UI

---

## 📞 CHANGELOG

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
