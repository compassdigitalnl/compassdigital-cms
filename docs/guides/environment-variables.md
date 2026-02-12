# Environment Variables Reference

Complete guide to all environment variables in the AI Site Builder.

---

## 🔑 Quick Start - Minimum Required

For local development, you only need:

```env
# 1. Payload CMS
PAYLOAD_SECRET=your-secret-key-here

# 2. OpenAI API
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# 3. Redis (NO PASSWORD NEEDED!)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**That's it!** Everything else has smart defaults.

---

## 📦 Core Configuration

### Payload CMS

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PAYLOAD_SECRET` | ✅ Yes | - | Secret key for Payload CMS. Generate with: `openssl rand -base64 32` |
| `DATABASE_URL` | No | `file:./payload.db` | Database connection. Use SQLite locally, PostgreSQL in production |
| `PREVIEW_SECRET` | No | - | Secret for draft preview mode |

### Site Information

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `COMPANY_NAME` | No | "Your Company" | Company name for metadata |
| `SITE_NAME` | No | "Your Site Name" | Site name for SEO |
| `TWITTER_CREATOR` | No | - | Twitter handle for meta tags |
| `TWITTER_SITE` | No | - | Twitter site URL |

### Server URLs

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PAYLOAD_PUBLIC_SERVER_URL` | ✅ Yes | `http://localhost:3015` | Public URL for Payload CMS |
| `NEXT_PUBLIC_SERVER_URL` | ✅ Yes | `http://localhost:3015` | Public URL for Next.js (client-side) |

---

## 🚀 Redis Configuration

### Local Development

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_HOST` | ✅ Yes | `localhost` | Redis server host |
| `REDIS_PORT` | ✅ Yes | `6379` | Redis server port |
| `REDIS_PASSWORD` | No | `""` (empty) | Redis password. **Leave empty for local dev!** |

### Production (Upstash)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `UPSTASH_REDIS_REST_URL` | No | - | Upstash Redis REST URL (for production) |
| `UPSTASH_REDIS_REST_TOKEN` | No | - | Upstash Redis REST token (for production) |

**Local Setup:**
```bash
# macOS
brew install redis
brew services start redis

# No password needed! Just run the app
npm run dev
```

---

## 🤖 AI Providers

### OpenAI (Primary)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | ✅ Yes | - | OpenAI API key. Get from: https://platform.openai.com/api-keys |
| `AI_MODEL` | No | `gpt-4-turbo-preview` | OpenAI model for text generation |
| `AI_IMAGE_MODEL` | No | `dall-e-3` | OpenAI model for image generation |
| `OPENAI_MAX_TOKENS` | No | `4000` | Maximum tokens per request |
| `OPENAI_TEMPERATURE` | No | `0.7` | Creativity level (0.0-2.0) |
| `OPENAI_TIMEOUT` | No | `60000` | Request timeout in milliseconds |

### Future: Anthropic Claude (Week 5+)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | No | - | Anthropic API key (future multi-model support) |
| `ANTHROPIC_MODEL` | No | `claude-3-opus-20240229` | Claude model to use |
| `ANTHROPIC_MAX_TOKENS` | No | `4000` | Maximum tokens per request |

### Future: Google Gemini (Week 5+)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_AI_API_KEY` | No | - | Google AI API key (future multi-model support) |
| `GOOGLE_AI_MODEL` | No | `gemini-pro` | Gemini model to use |
| `GOOGLE_AI_MAX_TOKENS` | No | `4000` | Maximum tokens per request |

---

## ⚡ Performance Configuration

### Cache TTL (Time To Live)

| Variable | Default | Description |
|----------|---------|-------------|
| `CACHE_TTL_PERMANENT` | `7776000` (90 days) | For completed analyses, published content |
| `CACHE_TTL_STABLE` | `604800` (7 days) | For templates, reference data |
| `CACHE_TTL_DYNAMIC` | `3600` (1 hour) | For fresh content, translations |
| `CACHE_TTL_REALTIME` | `900` (15 min) | For live generation |

### Rate Limiting

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_RATE_LIMIT_PER_MINUTE` | `50` | Maximum AI requests per minute |
| `AI_MAX_CONCURRENT_JOBS` | `5` | Maximum concurrent AI jobs |
| `AI_REQUEST_TIMEOUT` | `120000` | AI request timeout (2 minutes) |

### Cache Strategy

| Variable | Default | Description |
|----------|---------|-------------|
| `CACHE_ENABLED` | `true` | Enable/disable caching globally |
| `CACHE_HIT_RATE_TARGET` | `95` | Target cache hit rate (%) |

---

## 🔄 BullMQ Job Queue

### Queue Concurrency

| Variable | Default | Description |
|----------|---------|-------------|
| `QUEUE_CONTENT_ANALYSIS_CONCURRENCY` | `3` | Concurrent content analysis jobs |
| `QUEUE_SEO_ANALYSIS_CONCURRENCY` | `3` | Concurrent SEO analysis jobs |
| `QUEUE_TRANSLATION_CONCURRENCY` | `5` | Concurrent translation jobs |
| `QUEUE_BLOCK_GENERATION_CONCURRENCY` | `2` | Concurrent block generation jobs |
| `QUEUE_PAGE_GENERATION_CONCURRENCY` | `1` | Concurrent page generation jobs |

### Job Retry

| Variable | Default | Description |
|----------|---------|-------------|
| `QUEUE_MAX_ATTEMPTS` | `3` | Maximum retry attempts per job |
| `QUEUE_BACKOFF_DELAY` | `2000` | Initial backoff delay (ms). Exponential: 2s → 4s → 8s |

### Job Retention

| Variable | Default | Description |
|----------|---------|-------------|
| `QUEUE_COMPLETED_RETENTION` | `86400` (1 day) | How long to keep completed jobs |
| `QUEUE_FAILED_RETENTION` | `604800` (7 days) | How long to keep failed jobs |

---

## 📊 Monitoring & Logging

### Basic Monitoring

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment: `development`, `production`, `test` |
| `LOG_LEVEL` | `info` | Logging level: `debug`, `info`, `warn`, `error` |

### Sentry Error Tracking (Production)

| Variable | Default | Description |
|----------|---------|-------------|
| `SENTRY_DSN` | - | Sentry DSN for error tracking |
| `SENTRY_ENVIRONMENT` | - | Environment name in Sentry |
| `SENTRY_TRACES_SAMPLE_RATE` | `0.1` | Performance trace sampling (10%) |

### Performance Monitoring

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_PERFORMANCE_MONITORING` | `false` | Enable detailed performance tracking |
| `PERFORMANCE_LOG_SLOW_QUERIES` | `true` | Log slow database queries |
| `SLOW_QUERY_THRESHOLD_MS` | `1000` | Threshold for "slow" query (ms) |

---

## 💰 Cost Tracking & Budgets

### OpenAI Cost Management

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_COST_TRACKING_ENABLED` | `false` | Track OpenAI API costs |
| `OPENAI_MONTHLY_BUDGET_USD` | `1000` | Monthly budget alert threshold |
| `OPENAI_ALERT_THRESHOLD_PERCENT` | `80` | Alert when 80% of budget used |

### Multi-Model Optimization (Future)

| Variable | Default | Description |
|----------|---------|-------------|
| `AUTO_SELECT_CHEAPEST_MODEL` | `false` | Automatically use cheapest suitable model |
| `PREFERRED_MODEL_ORDER` | `gpt-4-turbo,claude-3-opus,gemini-pro` | Model preference order |

---

## 🎛️ Feature Flags

### AI Features

All default to `true`:

| Variable | Description |
|----------|-------------|
| `ENABLE_AI_CONTENT_GENERATION` | Text content generation |
| `ENABLE_AI_BLOCK_GENERATION` | Block/section generation |
| `ENABLE_AI_PAGE_GENERATION` | Full page generation |
| `ENABLE_AI_SEO_OPTIMIZATION` | SEO analysis and optimization |
| `ENABLE_AI_CONTENT_ANALYSIS` | Content quality analysis |
| `ENABLE_AI_TRANSLATION` | Multi-language translation |
| `ENABLE_AI_IMAGE_GENERATION` | AI image generation |

### Performance Features

All default to `true`:

| Variable | Description |
|----------|-------------|
| `ENABLE_ASYNC_PROCESSING` | Background job processing |
| `ENABLE_SSE_STREAMING` | Real-time SSE updates |
| `ENABLE_SMART_CACHING` | Intelligent caching |
| `ENABLE_REQUEST_DEDUPLICATION` | Prevent duplicate requests |

### Multi-Model Support (Future)

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_MULTI_MODEL` | `false` | Enable multiple AI providers |
| `ENABLE_MODEL_FALLBACK` | `false` | Fallback to alternative models on failure |

---

## 💳 Stripe (E-commerce)

### Test Keys (Development)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client-side) |
| `STRIPE_WEBHOOKS_SIGNING_SECRET` | Webhook signature verification |

### Live Keys (Production)

Same variables, but use `sk_live_` and `pk_live_` prefixes.

---

## 📧 Email (Optional)

### SMTP Configuration

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server host (e.g., `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (usually `587` for TLS) |
| `SMTP_USER` | SMTP username/email |
| `SMTP_PASSWORD` | SMTP password (use app password for Gmail) |
| `SMTP_FROM` | From address for emails |

---

## 🔒 Security

### CORS & Rate Limiting

| Variable | Description |
|----------|-------------|
| `CORS_ORIGIN` | Allowed CORS origin for production |
| `API_RATE_LIMIT_WINDOW_MS` | Rate limit window (default: 15 min) |
| `API_RATE_LIMIT_MAX_REQUESTS` | Max requests per window |

### JWT (if needed)

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret for JWT token signing |
| `JWT_EXPIRATION` | Token expiration time (e.g., `7d`) |

---

## 🚀 Deployment (Production)

### Platform Configuration

| Variable | Description |
|----------|-------------|
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry |
| `CDN_URL` | CDN base URL for assets |

### Asset Optimization

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_IMAGE_OPTIMIZATION` | `true` | Enable Next.js image optimization |
| `IMAGE_QUALITY` | `85` | JPEG/WebP quality (1-100) |

---

## 🎯 Recommended Production Setup

### Minimum Production Variables

```env
# Core
PAYLOAD_SECRET=<strong-random-secret>
DATABASE_URL=postgresql://user:password@host:5432/dbname

# URLs
PAYLOAD_PUBLIC_SERVER_URL=https://yourdomain.com
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# AI
OPENAI_API_KEY=sk-your-production-key

# Monitoring
NODE_ENV=production
SENTRY_DSN=https://...@sentry.io/...
```

### Optional Production Enhancements

```env
# Cost Tracking
OPENAI_COST_TRACKING_ENABLED=true
OPENAI_MONTHLY_BUDGET_USD=5000
OPENAI_ALERT_THRESHOLD_PERCENT=80

# Performance Monitoring
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_LOG_SLOW_QUERIES=true

# Security
CORS_ORIGIN=https://yourdomain.com
API_RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🐛 Troubleshooting

### "Redis connection failed"

**Problem:** Cannot connect to Redis

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# If not, start it
brew services start redis  # macOS
sudo systemctl start redis-server  # Linux
```

### "OpenAI API key invalid"

**Problem:** Invalid or missing OpenAI API key

**Solution:**
1. Check `.env.local` has the correct key
2. Verify key at: https://platform.openai.com/api-keys
3. Ensure no extra spaces around the key
4. Restart dev server: `npm run dev`

### "Queue jobs not processing"

**Problem:** Workers not picking up jobs

**Solution:**
1. Check Redis is running: `redis-cli ping`
2. Check worker logs in console: Should see "✅ Content Analysis Worker started"
3. Verify `.env.local` has `REDIS_HOST=localhost`
4. Restart: `npm run dev`

### "Cache not working"

**Problem:** Always shows cache misses

**Solution:**
```bash
# Check Redis has keys
redis-cli
KEYS analysis:*

# Should show cached keys
# If empty, cache is not saving
```

**Check environment:**
```env
CACHE_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 📚 Next Steps

1. **Testing Phase 1:** See `docs/PHASE-1-QUICK-START.md`
2. **Redis Setup:** See `docs/redis-setup.md`
3. **Performance Plan:** See `docs/enterprise-performance-plan.md`

---

**Questions?** Check the troubleshooting sections in:
- `docs/redis-setup.md`
- `docs/PHASE-1-QUICK-START.md`
