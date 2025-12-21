# Rate Limiting - Monomorph API v1.5.2

## Overview

Rate limiting protects your API from abuse, prevents server overload, and ensures fair usage for all users.

## Rate Limit Tiers

| Tier | Trust Level | Use Case |
|------|-------------|----------|
| **Authenticated** | High | Logged-in users (your customers) |
| **API Key** | Medium | Programmatic access (scripts/integrations) |
| **Anonymous** | Low | IP-only (unauthenticated requests) |
| **Admin** | Internal | Data provider operations |

## Rate Limits

### Authenticated Users (Highest Limits)

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General (reads) | 200 requests | 1 minute |
| Writes (CRUD) | 60 requests | 1 minute |
| Workflow execution | 20 requests | 1 minute |

### API Key Access (Stricter)

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General (reads) | 60 requests | 1 minute |
| Writes (CRUD) | 20 requests | 1 minute |
| Workflow execution | 5 requests | 1 minute |

### Anonymous / IP-Only (Strictest)

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Public endpoints | 30 requests | 1 minute |
| Login attempts | 5 requests | 5 minutes |
| Registration | 3 requests | 1 hour |

## Response Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 187
X-RateLimit-Reset: 2025-12-22T02:30:00.000Z
```

## Rate Limit Exceeded (429 Response)

When rate limited, you'll receive:

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please slow down.",
  "retryAfter": 45,
  "limit": 200,
  "remaining": 0,
  "resetAt": "2025-12-22T02:30:00.000Z"
}
```

Also includes header:
```
Retry-After: 45
```

## Check Your Rate Limits

```
GET /api/v1/rate-limit-info
```

Returns documentation of all rate limits.

## Implementation Details

### Storage

- **Production**: Redis (fast, persistent, scales horizontally)
- **Fallback**: In-memory (if Redis unavailable)

### Algorithm

Sliding window using Redis sorted sets:
1. Remove entries outside the current window
2. Count remaining entries
3. If count < limit, allow and add new entry
4. If count >= limit, reject with 429

### Identification

Requests are identified by (in priority order):
1. User ID (if authenticated)
2. API Key (if x-api-key header present)
3. IP Address (fallback)

## Environment Variables

```env
# Redis connection (optional - falls back to in-memory)
REDIS_URL=redis://localhost:6379
```

## Best Practices

### For API Consumers

1. **Check headers** - Use `X-RateLimit-Remaining` to throttle your requests
2. **Handle 429s** - Implement exponential backoff when rate limited
3. **Authenticate** - Get higher limits by authenticating
4. **Cache responses** - Reduce unnecessary API calls

### Example: Handling Rate Limits

```javascript
async function fetchWithRateLimit(url) {
  const response = await fetch(url);
  
  // Check remaining quota
  const remaining = response.headers.get('X-RateLimit-Remaining');
  console.log(`Requests remaining: ${remaining}`);
  
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    console.log(`Rate limited. Retry after ${retryAfter} seconds`);
    await sleep(retryAfter * 1000);
    return fetchWithRateLimit(url); // Retry
  }
  
  return response.json();
}
```

## Admin Endpoints

> **Note**: Zerodha endpoints are admin-only. Zerodha is a temporary data provider for testing. Will be replaced with a commercial data vendor when production-ready.

Admin endpoints are protected and not for user access:
- `/api/v1/admin/*`
- `/api/v1/data-sync/*`

## Troubleshooting

### "Rate limit exceeded" immediately?

- Check if you're making requests from a shared IP
- Authenticate to get user-specific limits
- Review your request patterns

### Redis connection issues?

The server falls back to in-memory rate limiting if Redis is unavailable. Check logs:

```
[WARN] Using in-memory store (Redis unavailable)
```

### Health check shows redis: "fallback"?

Set `REDIS_URL` environment variable or deploy Redis:

```bash
# Railway
railway add redis

# Local
docker run -d -p 6379:6379 redis:alpine
```
