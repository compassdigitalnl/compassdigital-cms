# 🔒 Webhook Security Guide - Email Marketing Engine

**Last Updated:** February 25, 2026
**Status:** ✅ Production Ready
**Version:** 1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Rate Limiting](#rate-limiting)
3. [Signature Verification](#signature-verification)
4. [Security Best Practices](#security-best-practices)
5. [Testing](#testing)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Webhook endpoints are publicly accessible and therefore vulnerable to:
- **DDoS attacks** - Overwhelming the server with requests
- **Replay attacks** - Resending old requests
- **Unauthorized access** - Spoofing requests from fake sources
- **Data breaches** - Accessing other tenants' data

Our webhook security system provides **defense-in-depth** protection with multiple layers.

### Security Layers

```
Request → Rate Limiting → Signature Verification → Validation → Processing
            ↓                    ↓                     ↓            ↓
         Block DDoS         Verify Source        Check Data    Execute
```

---

## ⏱️ Rate Limiting

### Multi-Tier Rate Limiting

We implement **5 simultaneous rate limits** to provide comprehensive protection:

| Tier | Window | Limit | Purpose |
|------|--------|-------|---------|
| **IP (minute)** | 1 min | 60 req | Prevent individual IP abuse |
| **IP (hourly)** | 1 hour | 1000 req | Long-term IP protection |
| **Tenant (minute)** | 1 min | 300 req | Prevent tenant quota abuse |
| **Tenant (hourly)** | 1 hour | 10000 req | Long-term tenant protection |
| **Global** | 1 min | 10000 req | Protect overall system |

### How It Works

1. **Request arrives** at webhook endpoint
2. **Extract identifiers**: IP address, tenant ID
3. **Check all 5 limits** simultaneously
4. **If ANY limit exceeded** → Return 429 Too Many Requests
5. **If all limits OK** → Proceed to next security layer

### Rate Limit Response

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2026-02-25T12:35:00Z
Retry-After: 45

{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 45
}
```

### Rate Limit Headers

All webhook responses include rate limit information:

```http
X-RateLimit-Limit: 60          # Maximum requests allowed
X-RateLimit-Remaining: 42      # Requests remaining in window
X-RateLimit-Reset: 2026-02-25T12:35:00Z  # When limit resets
```

### Implementation

```typescript
import { applyWebhookRateLimit, recordWebhookResult } from '@/lib/email/webhooks/RateLimiter'

export async function POST(req: NextRequest) {
  const tenantId = 'tenant_123'

  // Check rate limit
  const rateLimitResult = await applyWebhookRateLimit(req, tenantId)

  if (!rateLimitResult.allowed) {
    return Response.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
          'Retry-After': rateLimitResult.retryAfter?.toString() || '',
        },
      }
    )
  }

  // Process request...
  const success = true

  // Record result (for skip logic)
  await recordWebhookResult(req, tenantId, success)

  return Response.json({ success: true })
}
```

### Sliding Window Algorithm

We use **Redis sorted sets** for accurate sliding window rate limiting:

```
Time:    [-------- 60 seconds window --------]
         |                                   |
         t-60s                              now

Requests: ●    ●  ●    ●     ●    ●    ●
          ^    ^  ^    ^     ^    ^    ^
         old  old old  keep  keep keep keep

Algorithm:
1. Remove requests older than (now - 60s)
2. Count remaining requests
3. If count < limit → Add new request
4. If count >= limit → Reject
```

**Why sliding window?**
- ✅ More accurate than fixed window
- ✅ Prevents burst attacks at window boundaries
- ✅ Fairer for legitimate users

---

## 🔐 Signature Verification

### HMAC-SHA256 Signatures

Every webhook request must include a valid HMAC-SHA256 signature to prove authenticity.

### How It Works

**Sender (you):**
```
1. Generate timestamp (Unix seconds)
2. Construct payload: "{timestamp}.{json_body}"
3. Compute HMAC-SHA256(payload, secret)
4. Include signature + timestamp in headers
```

**Receiver (webhook endpoint):**
```
1. Extract signature and timestamp from headers
2. Check timestamp is within ±5 minutes (prevents replay attacks)
3. Reconstruct payload from request body
4. Compute expected signature
5. Compare signatures (timing-safe)
6. Accept if match, reject if not
```

### Request Format

```http
POST /api/webhooks/events HTTP/1.1
Host: yourdomain.com
Content-Type: application/json
X-Webhook-Signature: 8f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a
X-Webhook-Timestamp: 1708862400

{
  "eventType": "order.placed",
  "tenantId": "tenant_123",
  "email": "john@example.com",
  "total": 99.99
}
```

### Generating Signatures (Client Side)

**JavaScript/Node.js:**

```javascript
const crypto = require('crypto')

function generateWebhookSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000)
  const payloadString = JSON.stringify(payload)
  const signedPayload = `${timestamp}.${payloadString}`

  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex')

  return {
    signature,
    timestamp,
  }
}

// Usage
const payload = {
  eventType: 'order.placed',
  tenantId: 'tenant_123',
  email: 'john@example.com',
  total: 99.99,
}

const secret = 'your_webhook_signing_secret'
const { signature, timestamp } = generateWebhookSignature(payload, secret)

fetch('https://yourdomain.com/api/webhooks/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': signature,
    'X-Webhook-Timestamp': timestamp.toString(),
  },
  body: JSON.stringify(payload),
})
```

**Python:**

```python
import hmac
import hashlib
import time
import json

def generate_webhook_signature(payload, secret):
    timestamp = int(time.time())
    payload_string = json.dumps(payload)
    signed_payload = f"{timestamp}.{payload_string}"

    signature = hmac.new(
        secret.encode('utf-8'),
        signed_payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    return signature, timestamp

# Usage
payload = {
    "eventType": "order.placed",
    "tenantId": "tenant_123",
    "email": "john@example.com",
    "total": 99.99
}

secret = "your_webhook_signing_secret"
signature, timestamp = generate_webhook_signature(payload, secret)

import requests
requests.post(
    'https://yourdomain.com/api/webhooks/events',
    headers={
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': str(timestamp),
    },
    json=payload
)
```

**cURL:**

```bash
# Generate signature
TIMESTAMP=$(date +%s)
PAYLOAD='{"eventType":"order.placed","tenantId":"tenant_123"}'
SIGNED_PAYLOAD="${TIMESTAMP}.${PAYLOAD}"
SIGNATURE=$(echo -n "$SIGNED_PAYLOAD" | openssl dgst -sha256 -hmac "your_secret" | cut -d' ' -f2)

# Send request
curl -X POST https://yourdomain.com/api/webhooks/events \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -H "X-Webhook-Timestamp: $TIMESTAMP" \
  -d "$PAYLOAD"
```

### Timestamp Tolerance

**Why 5 minutes?**
- ✅ Accommodates clock drift between systems
- ✅ Allows for network delays
- ❌ Short enough to prevent replay attacks

**Replay Attack Prevention:**

```
Attacker intercepts request at 12:00:00
  → Signature: abc123, Timestamp: 1708862400

Attacker resends at 12:10:00
  → Same signature + timestamp
  → Age: 10 minutes (600 seconds)
  → Rejected: "Webhook timestamp too old (600s > 300s)"
```

### Invalid Signature Response

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Invalid signature",
  "code": "INVALID_SIGNATURE"
}
```

### Configuration

Set webhook signing secret in environment variables:

```bash
# .env
WEBHOOK_SIGNING_SECRET=your_very_long_random_secret_key_min_32_characters
```

**Generate strong secret:**

```bash
# Linux/Mac
openssl rand -hex 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ Security Best Practices

### 1. Use HTTPS Only

```javascript
// ❌ WRONG
const WEBHOOK_URL = 'http://example.com/webhooks/events'

// ✅ CORRECT
const WEBHOOK_URL = 'https://example.com/webhooks/events'
```

**Why?**
- Prevents man-in-the-middle attacks
- Protects signature from being intercepted
- Required for PCI compliance

### 2. Rotate Secrets Regularly

**Recommended schedule:**
- **High-security:** Every 30 days
- **Normal:** Every 90 days
- **Low-risk:** Every 180 days

**Rotation process:**
1. Generate new secret
2. Update sender systems
3. Test with new secret
4. Deactivate old secret after grace period (7 days)

### 3. Implement Exponential Backoff

```javascript
async function sendWebhook(payload, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: generateHeaders(payload),
        body: JSON.stringify(payload),
      })

      if (response.status === 429) {
        // Rate limited - use Retry-After header
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60')
        await sleep(retryAfter * 1000)
        continue
      }

      if (response.ok) {
        return await response.json()
      }

      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      if (i === retries - 1) throw error

      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = Math.pow(2, i) * 1000
      await sleep(delay)
    }
  }
}
```

### 4. Monitor Failed Requests

Track and alert on:
- High rate of 401 (invalid signatures)
- High rate of 429 (rate limits)
- Unusual traffic patterns

### 5. Whitelist IPs (Optional)

For extra security, restrict webhooks to known IPs:

```typescript
const ALLOWED_IPS = [
  '192.168.1.100',
  '10.0.0.0/24',
]

function isIpAllowed(clientIp: string): boolean {
  return ALLOWED_IPS.some(allowedIp => {
    if (allowedIp.includes('/')) {
      // CIDR range check
      return checkCIDR(clientIp, allowedIp)
    }
    return clientIp === allowedIp
  })
}
```

---

## 🧪 Testing

### Test Signature Generation

```typescript
import { generateTestSignature } from '@/lib/email/webhooks/SignatureVerifier'

// Generate valid signature for testing
const payload = {
  eventType: 'test.event',
  tenantId: 'test_tenant',
}

const headers = generateTestSignature(payload)

console.log(headers)
// {
//   'x-webhook-signature': 'abc123...',
//   'x-webhook-timestamp': '1708862400'
// }
```

### Test Rate Limiting

```bash
# Send 65 requests in 1 minute (exceeds 60/min limit)
for i in {1..65}; do
  curl -X POST https://yourdomain.com/api/webhooks/events \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Signature: $(generate_signature)" \
    -H "X-Webhook-Timestamp: $(date +%s)" \
    -d '{"eventType":"test","tenantId":"test"}'

  echo "Request $i"
done

# Expected: First 60 succeed, last 5 return 429
```

### Integration Tests

```typescript
import { test, expect } from '@playwright/test'

test('webhook rate limiting', async ({ request }) => {
  const payload = { eventType: 'test', tenantId: 'test' }

  // Send 60 requests (should all succeed)
  for (let i = 0; i < 60; i++) {
    const response = await request.post('/api/webhooks/events', {
      headers: generateTestSignature(payload),
      data: payload,
    })
    expect(response.status()).toBe(200)
  }

  // 61st request should be rate limited
  const response = await request.post('/api/webhooks/events', {
    headers: generateTestSignature(payload),
    data: payload,
  })
  expect(response.status()).toBe(429)
})

test('webhook signature verification', async ({ request }) => {
  const payload = { eventType: 'test', tenantId: 'test' }

  // Valid signature
  let response = await request.post('/api/webhooks/events', {
    headers: generateTestSignature(payload),
    data: payload,
  })
  expect(response.status()).toBe(200)

  // Invalid signature
  response = await request.post('/api/webhooks/events', {
    headers: {
      'x-webhook-signature': 'invalid',
      'x-webhook-timestamp': Math.floor(Date.now() / 1000).toString(),
    },
    data: payload,
  })
  expect(response.status()).toBe(401)
})
```

---

## 📊 Monitoring

### Metrics to Track

1. **Rate Limit Hits**
   - Number of 429 responses
   - Which tier triggered (IP, tenant, global)
   - Top offending IPs/tenants

2. **Signature Failures**
   - Number of 401 responses
   - Invalid timestamp vs invalid signature
   - Potential attacks

3. **Performance**
   - P50, P95, P99 latency
   - Redis response time
   - Signature verification time

### Alerting Rules

```yaml
alerts:
  - name: HighRateLimitHits
    condition: rate_limit_429_count > 100 per 5min
    severity: warning
    action: notify_ops

  - name: SignatureAttack
    condition: signature_401_count > 50 per 1min
    severity: critical
    action: notify_security

  - name: WebhookLatency
    condition: p95_latency > 500ms
    severity: warning
    action: notify_ops
```

### Dashboard Queries

```sql
-- Rate limit hits by tier (last hour)
SELECT
  tier,
  COUNT(*) as hits
FROM rate_limit_logs
WHERE timestamp > NOW() - INTERVAL '1 hour'
GROUP BY tier
ORDER BY hits DESC

-- Top IPs hitting rate limits
SELECT
  client_ip,
  COUNT(*) as hits
FROM rate_limit_logs
WHERE status = 429
  AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY client_ip
ORDER BY hits DESC
LIMIT 10
```

---

## 🔧 Troubleshooting

### "Rate limit exceeded" (429)

**Cause:** Too many requests from same IP or tenant

**Solutions:**
1. Implement exponential backoff
2. Respect `Retry-After` header
3. Request higher limits if legitimate use case
4. Check for infinite loops in your code

### "Invalid signature" (401)

**Cause:** Signature doesn't match expected value

**Common issues:**
1. **Wrong secret** - Check `WEBHOOK_SIGNING_SECRET`
2. **Clock drift** - Ensure system clocks are synchronized (use NTP)
3. **Payload modification** - Body must match exactly (no extra spaces, different order)
4. **Encoding issues** - Ensure UTF-8 encoding

**Debug:**
```javascript
// Log what you're signing
console.log('Timestamp:', timestamp)
console.log('Payload:', JSON.stringify(payload))
console.log('Signed:', `${timestamp}.${JSON.stringify(payload)}`)
console.log('Secret:', secret.substring(0, 10) + '...')
console.log('Signature:', signature)
```

### "Webhook timestamp too old"

**Cause:** Request timestamp is older than 5 minutes

**Solutions:**
1. **Synchronize clocks** - Use NTP
2. **Reduce retry delays** - Don't wait too long between retries
3. **Check timezone** - Use UTC timestamps

---

## 📚 Related Documentation

- [API Key Management Guide](./API_KEY_MANAGEMENT_GUIDE.md)
- [Error Handling Guide](./ERROR_HANDLING_GUIDE.md)
- [Master Implementation Plan](./MASTER_IMPLEMENTATIEPLAN_v1.md)

---

**Questions?** Contact your system administrator or refer to the troubleshooting section above.
