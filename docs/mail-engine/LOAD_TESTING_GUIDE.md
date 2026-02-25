# ⚡ Load Testing Guide - Email Marketing Engine

**Last Updated:** February 25, 2026
**Status:** ✅ Production Ready
**Version:** 1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Test Scenarios](#test-scenarios)
4. [Running Tests](#running-tests)
5. [Interpreting Results](#interpreting-results)
6. [Performance Benchmarks](#performance-benchmarks)
7. [Optimization Recommendations](#optimization-recommendations)
8. [CI/CD Integration](#cicd-integration)

---

## 🎯 Overview

This guide covers load testing the Email Marketing Engine using **k6**, an open-source load testing tool.

### Why Load Testing?

- **Validate performance** under expected traffic
- **Identify bottlenecks** before they impact users
- **Establish baselines** for future optimizations
- **Test rate limiting** and security measures
- **Ensure scalability** for growth

### Testing Stack

```
┌─────────────────────────────────────────────────────────────┐
│                  Load Testing Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐                                            │
│  │      k6      │ → Load Generator                           │
│  └──────┬───────┘                                            │
│         │                                                     │
│         ▼                                                     │
│  ┌──────────────┐                                            │
│  │ Application  │ → Email Marketing Engine                   │
│  └──────┬───────┘                                            │
│         │                                                     │
│         ├──→ Database (PostgreSQL)                           │
│         ├──→ Redis (Queue)                                   │
│         ├──→ Listmonk (Email)                                │
│         └──→ Monitoring (Metrics)                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Setup

### 1. Install k6

**macOS (Homebrew):**
```bash
brew install k6
```

**Ubuntu/Debian:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows (Chocolatey):**
```bash
choco install k6
```

**Docker:**
```bash
docker pull grafana/k6
```

### 2. Verify Installation

```bash
k6 version
# Expected: k6 v0.48.0 or higher
```

### 3. Configure Environment

Create `.env.load-test`:

```bash
# Base URL (staging or production)
BASE_URL=https://staging.yourdomain.com

# API Key with required scopes
API_KEY=sk_test_your_api_key_here

# Webhook signing secret
WEBHOOK_SIGNING_SECRET=your_webhook_secret_here
```

---

## 📊 Test Scenarios

### Test 1: Subscribers API

**File:** `tests/load/subscribers.test.js`

**What it tests:**
- Subscriber creation (POST)
- Subscriber listing (GET)
- API authentication
- Database writes/reads
- Rate limiting

**Load profile:**
- Ramp-up: 0 → 100 users over 8 minutes
- Sustained: 50 users for 5 minutes
- Peak: 100 users for 3 minutes
- Ramp-down: 100 → 0 over 2 minutes

**Expected performance:**
- P95 latency: < 500ms
- Error rate: < 5%
- Throughput: 100-200 req/s

---

### Test 2: Health Endpoints

**File:** `tests/load/health-endpoints.test.js`

**What it tests:**
- Health check endpoint
- Readiness probe
- Liveness probe
- Metrics API
- Monitoring overhead

**Load profile:**
- Ramp-up: 0 → 100 users over 2 minutes
- Sustained: 100 users for 1 minute
- Ramp-down: 100 → 0 over 30 seconds

**Expected performance:**
- P95 latency: < 200ms
- Health checks: < 150ms
- Metrics: < 300ms

---

### Test 3: Webhooks

**File:** `tests/load/webhooks.test.js`

**What it tests:**
- Webhook processing
- Signature verification
- Rate limiting (per IP, per tenant)
- Automation triggering
- Queue processing

**Load profile:**
- Aggressive: 0 → 50 users over 30 seconds
- Purpose: Trigger rate limits

**Expected behavior:**
- Rate limits triggered at 60 req/min per IP
- 429 responses include Retry-After header
- Signature verification overhead < 50ms

---

## 🚀 Running Tests

### Basic Test Run

```bash
# Run subscribers test
k6 run tests/load/subscribers.test.js

# Expected output:
# ✓ create status is 200 or 201
# ✓ list status is 200
#
# checks.........................: 100.00% ✓ 5420 ✗ 0
# data_received..................: 2.1 MB  35 kB/s
# data_sent......................: 1.8 MB  30 kB/s
# http_req_duration..............: avg=234ms p(95)=456ms
# http_reqs......................: 2710    45/s
```

### Test with Custom Parameters

```bash
# Override VUs and duration
k6 run --vus 50 --duration 5m tests/load/subscribers.test.js

# Override environment
k6 run --env BASE_URL=https://prod.yourdomain.com tests/load/subscribers.test.js

# Use environment file
export $(cat .env.load-test | xargs)
k6 run tests/load/subscribers.test.js
```

### Run All Tests

```bash
# Create run script
cat > run-load-tests.sh << 'EOF'
#!/bin/bash

echo "═══════════════════════════════════════════════════════"
echo "Running Load Tests - Email Marketing Engine"
echo "═══════════════════════════════════════════════════════"

export $(cat .env.load-test | xargs)

echo ""
echo "Test 1: Health Endpoints (Quick - 3 minutes)"
k6 run tests/load/health-endpoints.test.js

echo ""
echo "Test 2: Subscribers API (Moderate - 18 minutes)"
k6 run tests/load/subscribers.test.js

echo ""
echo "Test 3: Webhooks (Aggressive - 1 minute)"
k6 run tests/load/webhooks.test.js

echo ""
echo "═══════════════════════════════════════════════════════"
echo "All tests complete!"
echo "═══════════════════════════════════════════════════════"
EOF

chmod +x run-load-tests.sh
./run-load-tests.sh
```

### Docker Run

```bash
docker run --rm -i \
  -e BASE_URL=https://staging.yourdomain.com \
  -e API_KEY=sk_test_xxx \
  -v $(pwd)/tests:/tests \
  grafana/k6 run /tests/load/subscribers.test.js
```

---

## 📈 Interpreting Results

### Key Metrics

#### 1. HTTP Request Duration

```
http_req_duration
  avg=234ms
  p(50)=189ms    ← Median (50% of requests)
  p(95)=456ms    ← 95th percentile (acceptable: < 500ms)
  p(99)=789ms    ← 99th percentile
  max=1.2s
```

**What to look for:**
- **P95 < 500ms** ✅ Good performance
- **P95 500-1000ms** ⚠️ Acceptable but could improve
- **P95 > 1000ms** ❌ Performance issue

#### 2. HTTP Request Failed

```
http_req_failed
  rate=2.3%     ← Error rate (acceptable: < 5%)
```

**What to look for:**
- **< 2%** ✅ Excellent
- **2-5%** ⚠️ Acceptable
- **> 5%** ❌ Too many errors

#### 3. Iterations

```
iterations............: 2710    45/s
```

**What to look for:**
- Throughput in requests/second
- Should scale with VUs
- Bottlenecks prevent scaling

#### 4. Checks

```
checks................: 98.5% ✓ 5340 ✗ 82
```

**What to look for:**
- **> 95%** ✅ Good
- **90-95%** ⚠️ Investigate failures
- **< 90%** ❌ Significant issues

---

### Example Good Result

```
╔═══════════════════════════════════════════════════════════════╗
║         Load Test Results: Subscribers API                    ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Total Requests:       2710                                   ║
║  Average Duration:   234.56ms                                 ║
║  P95 Duration:       456.23ms                                 ║
║  Failed Requests:      2.30%                                  ║
║                                                               ║
║  Subscribers Created:       1355                              ║
║  Subscribers Retrieved:     1355                              ║
║  Error Rate:           2.30%                                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

✅ PASS: All thresholds met
```

---

### Example Problem Result

```
╔═══════════════════════════════════════════════════════════════╗
║         Load Test Results: Subscribers API                    ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Total Requests:       2710                                   ║
║  Average Duration:   1234.56ms  ❌                            ║
║  P95 Duration:       2456.23ms  ❌                            ║
║  Failed Requests:     12.30%  ❌                              ║
║                                                               ║
║  Subscribers Created:       1200                              ║
║  Subscribers Retrieved:     1100                              ║
║  Error Rate:          15.30%  ❌                              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

❌ FAIL: Thresholds not met
- http_req_duration p(95) > 500ms
- http_req_failed rate > 5%
```

**Common causes:**
- Database slow queries
- Insufficient database connections
- Memory pressure
- CPU saturation
- Network latency

---

## 🎯 Performance Benchmarks

### Target Performance

| Metric | Target | Good | Acceptable | Poor |
|--------|--------|------|------------|------|
| **P95 Latency** | < 300ms | < 500ms | < 1000ms | > 1000ms |
| **P99 Latency** | < 500ms | < 1000ms | < 2000ms | > 2000ms |
| **Error Rate** | < 1% | < 2% | < 5% | > 5% |
| **Throughput** | 200 req/s | 100 req/s | 50 req/s | < 50 req/s |

### Real-World Scenarios

#### Scenario 1: Normal Traffic

```
Daily active users: 1000
Avg requests/user: 20/day
Peak factor: 3x

Peak throughput: (1000 × 20) / (24 × 3600) × 3 = 0.7 req/s
Target: Handle 10 req/s comfortably
```

#### Scenario 2: Campaign Launch

```
Subscribers: 50,000
Campaign sends: 10,000/hour
Webhook events: 10,000/hour

Throughput: 10,000 / 3600 = 2.8 req/s
Target: Handle 20 req/s comfortably
```

#### Scenario 3: Black Friday

```
Normal traffic: 10 req/s
Black Friday spike: 10x
Peak throughput: 100 req/s

Target: Handle 150 req/s without degradation
```

---

## 🔧 Optimization Recommendations

### Database Optimizations

**Problem:** Slow query performance

**Solutions:**

1. **Add indexes**
   ```sql
   CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
   CREATE INDEX idx_email_events_created_at ON email_events(created_at);
   CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
   ```

2. **Increase connection pool**
   ```bash
   # .env
   DATABASE_POOL_MIN=5
   DATABASE_POOL_MAX=20
   ```

3. **Enable query caching**
   ```sql
   ALTER DATABASE yourdb SET shared_buffers = '256MB';
   ALTER DATABASE yourdb SET effective_cache_size = '1GB';
   ```

---

### Redis Optimizations

**Problem:** High Redis latency

**Solutions:**

1. **Increase memory**
   ```bash
   # Upgrade Redis instance to 1GB+ memory
   ```

2. **Enable pipelining**
   ```typescript
   const pipeline = redis.pipeline()
   pipeline.zadd(key1, score1, value1)
   pipeline.zadd(key2, score2, value2)
   await pipeline.exec()
   ```

3. **Set appropriate TTLs**
   ```typescript
   await redis.set(key, value, 'EX', 300) // 5 minutes
   ```

---

### Application Optimizations

**Problem:** High CPU or memory usage

**Solutions:**

1. **Enable caching**
   ```typescript
   import { cache } from '@/lib/cache'

   const subscribers = await cache.remember(
     `subscribers_${tenantId}`,
     300, // 5 minutes
     async () => {
       return await payload.find({ collection: 'email-subscribers' })
     }
   )
   ```

2. **Paginate large results**
   ```typescript
   const subscribers = await payload.find({
     collection: 'email-subscribers',
     limit: 50,
     page: 1,
   })
   ```

3. **Use streaming for large datasets**
   ```typescript
   const stream = payload.stream({ collection: 'email-subscribers' })
   for await (const doc of stream) {
     // Process one at a time
   }
   ```

---

### Scaling Strategies

#### Vertical Scaling (Scale Up)

- Increase server resources (CPU, RAM)
- Upgrade database instance
- Upgrade Redis instance

**When to use:**
- Quick wins
- Limited budget
- Not yet at capacity

---

#### Horizontal Scaling (Scale Out)

- Add more application instances
- Load balancer distribution
- Database read replicas

**When to use:**
- Vertical scaling maxed out
- Need high availability
- Global distribution

**Example setup:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                             │
│                         │                                    │
│         ┌───────────────┼───────────────┐                   │
│         │               │               │                   │
│    ┌────▼───┐      ┌────▼───┐     ┌────▼───┐              │
│    │ App 1  │      │ App 2  │     │ App 3  │              │
│    └────┬───┘      └────┬───┘     └────┬───┘              │
│         │               │               │                   │
│         └───────────────┼───────────────┘                   │
│                         │                                    │
│                   ┌─────┴─────┐                             │
│                   │           │                             │
│              ┌────▼───┐  ┌────▼───┐                        │
│              │ DB (M) │  │ Redis  │                        │
│              └────┬───┘  └────────┘                        │
│                   │                                          │
│              ┌────▼───┐                                     │
│              │DB (Rep)│                                     │
│              └────────┘                                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 CI/CD Integration

### GitHub Actions

Create `.github/workflows/load-test.yml`:

```yaml
name: Load Testing

on:
  schedule:
    # Run weekly (Sunday 2am)
    - cron: '0 2 * * 0'
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run load tests
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
          API_KEY: ${{ secrets.STAGING_API_KEY }}
        run: |
          k6 run tests/load/health-endpoints.test.js
          k6 run tests/load/subscribers.test.js

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: load-test-*.json
          retention-days: 30

      - name: Comment PR (if applicable)
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs')
            const results = fs.readFileSync('load-test-subscribers.json', 'utf8')
            // Parse and comment on PR
```

---

## 📚 Related Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Monitoring & Alerting Guide](./MONITORING_AND_ALERTING_GUIDE.md)
- [Operations Runbook](./OPERATIONS_RUNBOOK.md)
- [Master Implementation Plan](./MASTER_IMPLEMENTATIEPLAN_v1.md)

---

**Need help?** Run `k6 run --help` or visit https://k6.io/docs/
