# Redis Setup Guide
**Voor Performance Optimization (BullMQ + Caching)**

## Waarom Redis?

Redis is **essentieel** voor de performance optimizations:
- ✅ Job queue (BullMQ)
- ✅ Response caching (95%+ hit rate)
- ✅ SSE connection management
- ✅ Rate limiting
- ✅ Session storage

## Optie 1: Lokale Redis (Development) - AANBEVOLEN

### macOS (via Homebrew)

```bash
# Install Redis
brew install redis

# Start Redis (in background)
brew services start redis

# Check if running
redis-cli ping
# Should respond: PONG

# Stop Redis
brew services stop redis
```

### Linux (Ubuntu/Debian)

```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server

# Enable Redis on boot
sudo systemctl enable redis-server

# Check status
sudo systemctl status redis-server

# Test connection
redis-cli ping
# Should respond: PONG
```

### Windows (via WSL or Docker)

**Option A: WSL2 (Recommended)**
```bash
# Inside WSL2
sudo apt update
sudo apt install redis-server
sudo service redis-server start
redis-cli ping
```

**Option B: Docker**
```bash
docker run -d -p 6379:6379 --name redis redis:7-alpine
docker exec -it redis redis-cli ping
```

### Verify Installation

```bash
# Test Redis connection
redis-cli ping
# Response: PONG

# Set a test key
redis-cli set test "hello"
# Response: OK

# Get the test key
redis-cli get test
# Response: "hello"

# Delete test key
redis-cli del test
```

### Environment Variables

Add to your `.env`:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## Optie 2: Upstash Redis (Production) - CLOUD

Voor production gebruik je Upstash Redis (global, serverless, auto-scaling):

### 1. Create Account
1. Go to: https://upstash.com
2. Sign up (free tier available)
3. Create a new Redis database

### 2. Get Credentials
In your Upstash dashboard:
- Copy `UPSTASH_REDIS_REST_URL`
- Copy `UPSTASH_REDIS_REST_TOKEN`

### 3. Add to .env
```env
# Upstash Redis (Production)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### 4. Update Code (Optional)
Upstash wordt automatisch gebruikt als je de env variables instelt.

---

## Testing Redis Setup

### Test 1: Redis Connection

```bash
# Start your Next.js app
npm run dev

# You should see in console:
# ✅ Redis connected
# ✅ Redis ready
# ✅ Content Analysis Worker started
```

### Test 2: Queue a Job

```bash
curl -X POST http://localhost:3015/api/ai/analyze-content-async \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Dit is een test artikel voor de queue.",
    "language": "nl"
  }'

# Response (instant!):
{
  "success": true,
  "status": "queued",
  "jobId": "analyze-content-1234...",
  "message": "Analysis queued...",
  "estimatedTime": "10-20 seconds"
}
```

### Test 3: Check Cache

```bash
# First request (cache miss - slow)
time curl -X POST http://localhost:3015/api/ai/analyze-content-async \
  -H "Content-Type": "application/json" \
  -d '{"content": "Test content..."}'

# Second request (cache hit - FAST! <50ms)
time curl -X POST http://localhost:3015/api/ai/analyze-content-async \
  -H "Content-Type": "application/json" \
  -d '{"content": "Test content..."}'
```

### Test 4: Monitor Redis

```bash
# Watch Redis commands in real-time
redis-cli monitor

# You'll see:
# - SET commands (caching results)
# - GET commands (cache lookups)
# - PUBLISH commands (SSE updates)
```

### Test 5: Check Queue Stats

```bash
# View queue statistics
curl http://localhost:3015/api/ai/queue-stats
```

---

## Redis Commands (Debugging)

```bash
# Connect to Redis CLI
redis-cli

# View all keys
KEYS *

# View cached analysis
GET "analysis:content:abc123..."

# View queue jobs
KEYS "bull:content-analysis:*"

# Clear all cache (CAREFUL!)
FLUSHDB

# Monitor real-time
MONITOR

# Exit
exit
```

---

## Troubleshooting

### Error: "Could not connect to Redis"

**Solution 1: Redis not running**
```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis-server

# Docker
docker start redis
```

**Solution 2: Wrong port**
```bash
# Check Redis port
redis-cli -p 6379 ping

# Update .env if different
REDIS_PORT=6380  # or whatever port
```

**Solution 3: Password required**
```bash
# Set password in redis.conf
requirepass your-password

# Update .env
REDIS_PASSWORD=your-password
```

### Error: "Redis connection timeout"

**Solution:**
```env
# Increase timeout in redis.ts
timeout: 10000  // 10 seconds
```

### Queue not processing jobs

**Solution 1: Worker not running**
The worker runs automatically with `npm run dev`, but you can also run separately:
```bash
npm run worker  # (we'll add this script)
```

**Solution 2: Check worker logs**
```bash
# Should see:
# ✅ Content Analysis Worker started
# [WORKER] Processing content analysis: ...
```

---

## Performance Monitoring

### Redis Memory Usage

```bash
redis-cli info memory
```

### Queue Dashboard (Optional)

Install BullMQ Dashboard:
```bash
npm install -g bull-board
bull-board
```

Open: http://localhost:3000

---

## Production Checklist

Before deploying:

- [ ] Redis password configured
- [ ] Redis persistence enabled (AOF or RDB)
- [ ] Redis maxmemory policy set
- [ ] Upstash Redis configured (production)
- [ ] SSL/TLS enabled
- [ ] Monitoring setup (Sentry, etc.)
- [ ] Backup strategy defined

---

## Next Steps

Once Redis is running:

1. ✅ Test async content analysis
2. ✅ Monitor cache hit rates
3. ✅ Check queue performance
4. ✅ Review logs for errors

**Redis running? Let's test the performance! 🚀**
