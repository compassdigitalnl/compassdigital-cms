# 🔧 Error Handling & Retry Logic Guide - Email Marketing Engine

**Last Updated:** February 25, 2026
**Status:** ✅ Production Ready
**Version:** 1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Error Classification](#error-classification)
3. [Retry Strategies](#retry-strategies)
4. [Exponential Backoff](#exponential-backoff)
5. [Dead Letter Queue](#dead-letter-queue)
6. [Implementation Examples](#implementation-examples)
7. [Monitoring & Debugging](#monitoring--debugging)
8. [Best Practices](#best-practices)

---

## 🎯 Overview

The Email Marketing Engine implements **production-grade error handling** with automatic retry logic to ensure:
- **Resilience** - Automatic recovery from temporary failures
- **Data integrity** - No lost operations due to transient errors
- **Observability** - Comprehensive error tracking and debugging
- **Fault tolerance** - Graceful degradation under failure conditions

### Error Handling Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Error Handling Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Operation → [Error?] → Classify → Retry Strategy           │
│                │                          │                  │
│                │                          ▼                  │
│                │                   ┌──────────────┐          │
│                │                   │ Temporary?   │          │
│                │                   └──────┬───────┘          │
│                │                          │                  │
│                │              YES ┌───────┴────────┐ NO     │
│                │                  ▼                ▼         │
│                │           [Retry with         [Dead         │
│                │            Backoff]            Letter       │
│                │                │               Queue]       │
│                │                │                │           │
│                ▼                ▼                ▼           │
│           [Log Error]    [Success/Fail]   [Manual Review]   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

1. **ErrorHandler** - Error classification and retry logic
2. **ResilientListmonkClient** - Auto-retry wrapper for Listmonk API
3. **DeadLetterQueue** - Storage for permanently failed operations
4. **BullMQ Integration** - Queue-based retry for async jobs

---

## 🏷️ Error Classification

The system classifies errors into **10 types**, each with specific handling strategies:

### 1. Network Errors (`NETWORK_ERROR`)

**Characteristics:**
- Connection refused
- DNS resolution failed
- Network timeout
- Socket errors

**Examples:**
```
ECONNREFUSED
ENOTFOUND
ETIMEDOUT (connection)
ENETUNREACH
```

**Retry Strategy:**
- **Attempts:** 5
- **Base delay:** 1 second
- **Max delay:** 1 minute
- **Jitter:** Yes

**Reason:** Network issues are usually temporary (DNS propagation, server restart, network blip)

---

### 2. Timeout Errors (`TIMEOUT`)

**Characteristics:**
- Request took too long
- Server not responding

**Examples:**
```
ETIMEDOUT (request)
Request timeout
Gateway timeout (504)
```

**Retry Strategy:**
- **Attempts:** 3
- **Base delay:** 5 seconds
- **Max delay:** 30 seconds
- **Jitter:** Yes

**Reason:** Server may be temporarily overloaded; give it time to recover

---

### 3. Rate Limit Errors (`RATE_LIMIT`)

**Characteristics:**
- HTTP 429 Too Many Requests
- X-RateLimit headers present

**Examples:**
```
HTTP 429 Too Many Requests
Rate limit exceeded
API quota exceeded
```

**Retry Strategy:**
- **Attempts:** 10
- **Base delay:** 60 seconds
- **Max delay:** 15 minutes
- **Jitter:** No (respect Retry-After header)

**Reason:** Wait for rate limit window to reset; aggressive backoff to avoid making it worse

---

### 4. Server Errors (`SERVER_ERROR`)

**Characteristics:**
- HTTP 5xx errors (500, 502, 503)
- Internal server errors

**Examples:**
```
HTTP 500 Internal Server Error
HTTP 502 Bad Gateway
HTTP 503 Service Unavailable
```

**Retry Strategy:**
- **Attempts:** 5
- **Base delay:** 10 seconds
- **Max delay:** 5 minutes
- **Jitter:** Yes

**Reason:** Server-side issues may resolve quickly (deployment, restart, temporary bug)

---

### 5. Validation Errors (`VALIDATION_ERROR`)

**Characteristics:**
- HTTP 400 Bad Request
- Invalid input data
- Schema validation failed

**Examples:**
```
HTTP 400 Bad Request
Invalid email format
Missing required field
Schema validation failed
```

**Retry Strategy:**
- **Attempts:** 0 (no retry)
- **Action:** Log and move to DLQ

**Reason:** Retrying won't help; data needs to be fixed first

---

### 6. Authentication Errors (`AUTH_ERROR`)

**Characteristics:**
- HTTP 401 Unauthorized
- Invalid credentials
- Expired token

**Examples:**
```
HTTP 401 Unauthorized
Invalid API key
Token expired
```

**Retry Strategy:**
- **Attempts:** 0 (no retry)
- **Action:** Log and alert

**Reason:** Retrying won't help; credentials need to be updated

---

### 7. Not Found Errors (`NOT_FOUND`)

**Characteristics:**
- HTTP 404 Not Found
- Resource doesn't exist

**Examples:**
```
HTTP 404 Not Found
Subscriber not found
Campaign not found
```

**Retry Strategy:**
- **Attempts:** 0 (no retry)
- **Action:** Log and move to DLQ

**Reason:** Resource won't magically appear; needs investigation

---

### 8. Duplicate Errors (`DUPLICATE`)

**Characteristics:**
- HTTP 409 Conflict
- Resource already exists
- Unique constraint violation

**Examples:**
```
HTTP 409 Conflict
Email already exists
Duplicate subscriber
```

**Retry Strategy:**
- **Attempts:** 0 (no retry)
- **Action:** Log (may not be an error)

**Reason:** Idempotent operation succeeded previously; no retry needed

---

### 9. Forbidden Errors (`FORBIDDEN`)

**Characteristics:**
- HTTP 403 Forbidden
- Insufficient permissions

**Examples:**
```
HTTP 403 Forbidden
Insufficient permissions
Access denied
```

**Retry Strategy:**
- **Attempts:** 0 (no retry)
- **Action:** Log and alert

**Reason:** Retrying won't help; permissions need to be fixed

---

### 10. Unknown Errors (`UNKNOWN`)

**Characteristics:**
- Uncategorized errors
- Unexpected exceptions

**Examples:**
```
Any error not matching above patterns
```

**Retry Strategy:**
- **Attempts:** 3
- **Base delay:** 30 seconds
- **Max delay:** 5 minutes
- **Jitter:** Yes

**Reason:** Conservative retry in case it's a temporary issue

---

## ⏱️ Retry Strategies

### Retry Configuration by Error Type

```typescript
const RETRY_CONFIGS = {
  NETWORK_ERROR: {
    maxAttempts: 5,
    baseDelay: 1000,      // 1 second
    maxDelay: 60000,      // 1 minute
    strategy: 'exponential',
    jitter: true,
  },
  TIMEOUT: {
    maxAttempts: 3,
    baseDelay: 5000,      // 5 seconds
    maxDelay: 30000,      // 30 seconds
    strategy: 'exponential',
    jitter: true,
  },
  RATE_LIMIT: {
    maxAttempts: 10,
    baseDelay: 60000,     // 1 minute
    maxDelay: 900000,     // 15 minutes
    strategy: 'exponential',
    jitter: false,        // Respect Retry-After header
  },
  SERVER_ERROR: {
    maxAttempts: 5,
    baseDelay: 10000,     // 10 seconds
    maxDelay: 300000,     // 5 minutes
    strategy: 'exponential',
    jitter: true,
  },
  UNKNOWN: {
    maxAttempts: 3,
    baseDelay: 30000,     // 30 seconds
    maxDelay: 300000,     // 5 minutes
    strategy: 'exponential',
    jitter: true,
  },
  // No retry for: VALIDATION_ERROR, AUTH_ERROR, NOT_FOUND, DUPLICATE, FORBIDDEN
}
```

### Retry Decision Tree

```
Error occurs
    │
    ▼
Classify error type
    │
    ├─ Temporary? (NETWORK, TIMEOUT, RATE_LIMIT, SERVER, UNKNOWN)
    │    │
    │    ├─ Attempts < maxAttempts?
    │    │    │
    │    │    ├─ YES → Calculate backoff → Wait → Retry
    │    │    │
    │    │    └─ NO → Move to DLQ
    │    │
    │    └─ (max attempts reached)
    │
    └─ Permanent? (VALIDATION, AUTH, NOT_FOUND, DUPLICATE, FORBIDDEN)
         │
         └─ Move to DLQ immediately (no retry)
```

---

## 📊 Exponential Backoff

### Algorithm

```typescript
function calculateBackoff(
  attempt: number,
  baseDelay: number = 1000,
  maxDelay: number = 300000,
  jitter: boolean = true
): number {
  // Exponential growth: baseDelay * 2^attempt
  let delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)

  // Add jitter (±25%) to prevent thundering herd
  if (jitter) {
    const jitterAmount = delay * 0.25
    delay = delay + (Math.random() * 2 - 1) * jitterAmount
  }

  return Math.floor(delay)
}
```

### Example Delay Sequences

**Network Error (baseDelay: 1s, maxDelay: 1min):**
```
Attempt 1: ~1s    (1 * 2^0 = 1s)
Attempt 2: ~2s    (1 * 2^1 = 2s)
Attempt 3: ~4s    (1 * 2^2 = 4s)
Attempt 4: ~8s    (1 * 2^3 = 8s)
Attempt 5: ~16s   (1 * 2^4 = 16s)
```

**Rate Limit (baseDelay: 60s, maxDelay: 15min):**
```
Attempt 1: ~60s    (60 * 2^0 = 60s)
Attempt 2: ~120s   (60 * 2^1 = 2min)
Attempt 3: ~240s   (60 * 2^2 = 4min)
Attempt 4: ~480s   (60 * 2^3 = 8min)
Attempt 5: ~900s   (capped at 15min)
```

**With Jitter (±25%):**
```
Base: 4000ms
Jitter range: 3000ms - 5000ms (±1000ms)

Example outcomes:
- 3234ms
- 4567ms
- 3891ms
- 4123ms
```

**Why Jitter?**
- Prevents **thundering herd** - Many clients retrying at exact same time
- Spreads load more evenly
- Increases success rate of retries

---

## 🗄️ Dead Letter Queue

### What is DLQ?

The **Dead Letter Queue (DLQ)** stores operations that have **permanently failed** after exhausting all retry attempts or encountering non-retryable errors.

### When Jobs Move to DLQ

1. **Max retries exhausted** - After 5 network error retries
2. **Permanent errors** - Validation, auth, not found, forbidden
3. **Manual intervention needed** - Jobs marked as non-retryable

### DLQ Entry Structure

```typescript
interface DeadLetterEntry {
  jobId: string
  jobName: string
  queueName: string
  data: any
  error: {
    message: string
    stack?: string
    type: ErrorType
  }
  attempts: number
  retryable: boolean
  failedAt: Date
  tenant?: string
  metadata?: Record<string, any>
}
```

### DLQ Operations

#### 1. Get DLQ Statistics

```typescript
import { getDeadLetterQueueManager } from '@/lib/queue/dead-letter-queue'

const dlq = getDeadLetterQueueManager()
const stats = await dlq.getStats()

console.log(stats)
// {
//   total: 45,
//   retryable: 30,
//   nonRetryable: 15,
//   byQueue: {
//     'email-marketing': 25,
//     'automation': 20
//   },
//   byErrorType: {
//     'network_error': 20,
//     'validation_error': 15,
//     'timeout': 10
//   }
// }
```

#### 2. List Failed Jobs

```typescript
const failedJobs = await dlq.getFailedJobs({ queue: 'email-marketing' }, 10)

for (const job of failedJobs) {
  console.log(`Job ${job.jobId}: ${job.error.message}`)
  console.log(`  Retryable: ${job.retryable}`)
  console.log(`  Attempts: ${job.attempts}`)
}
```

#### 3. Retry Single Job

```typescript
await dlq.retryFailedJob('job_abc123')
// Re-queues the job for processing
```

#### 4. Bulk Retry

```typescript
// Retry up to 50 retryable jobs from email-marketing queue
await dlq.bulkRetryFailedJobs(
  { queue: 'email-marketing', retryable: true },
  50
)
```

#### 5. Delete Old Entries

```typescript
// Delete jobs older than 30 days
await dlq.cleanupOldEntries(30)
```

### DLQ Monitoring

**Daily cleanup cron job:**
```bash
# Crontab - daily at 2am
0 2 * * * cd /app && npx tsx -e "
  import { getDeadLetterQueueManager } from '@/lib/queue/dead-letter-queue'
  const dlq = getDeadLetterQueueManager()
  await dlq.cleanupOldEntries(30)
"
```

**Alert on high DLQ count:**
```typescript
const stats = await dlq.getStats()
if (stats.total > 100) {
  await alertManager.sendAlert({
    type: AlertType.QUEUE_STUCK,
    severity: AlertSeverity.WARNING,
    title: 'High Dead Letter Queue Count',
    message: `${stats.total} jobs in DLQ (threshold: 100)`,
    metadata: stats,
  })
}
```

---

## 💻 Implementation Examples

### Example 1: Using ResilientListmonkClient

```typescript
import { getResilientListmonkClient } from '@/lib/email/listmonk/retry-wrapper'

const client = getResilientListmonkClient()

try {
  // This automatically retries on network errors, timeouts, etc.
  const subscriber = await client.createSubscriber({
    email: 'john@example.com',
    name: 'John Doe',
    status: 'subscribed',
    lists: [1, 2, 3],
  })

  console.log('Subscriber created:', subscriber.id)
} catch (error) {
  // Only throws after all retries exhausted
  console.error('Failed to create subscriber:', error)

  // Error is automatically logged and moved to DLQ
}
```

### Example 2: Custom Retry Logic

```typescript
import { executeWithRetry } from '@/lib/email/listmonk/retry-wrapper'

const result = await executeWithRetry(
  async () => {
    // Your operation here
    return await someApiCall()
  },
  {
    operation: 'custom-operation',
    maxAttempts: 5,
    baseDelay: 2000,
  }
)
```

### Example 3: Handling Specific Errors

```typescript
import { classifyError, ErrorType } from '@/lib/email/error-handling/ErrorHandler'

try {
  await sendEmail(recipient)
} catch (error: any) {
  const errorType = classifyError(error)

  switch (errorType) {
    case ErrorType.VALIDATION_ERROR:
      // Fix data and retry manually
      console.error('Invalid email address:', recipient.email)
      break

    case ErrorType.RATE_LIMIT:
      // Respect rate limit
      const retryAfter = parseInt(error.response?.headers['retry-after'] || '60')
      console.log(`Rate limited. Retry after ${retryAfter}s`)
      break

    case ErrorType.NETWORK_ERROR:
      // Will auto-retry via ResilientClient
      console.log('Network error, will retry...')
      break

    default:
      console.error('Unknown error:', error)
  }
}
```

### Example 4: BullMQ Job with Retry

```typescript
import { getEmailQueue } from '@/lib/queue/queues'
import { moveToDeadLetterQueue } from '@/lib/queue/dead-letter-queue'

const queue = getEmailQueue()

queue.process('send-campaign', async (job) => {
  try {
    // Your job logic
    await sendCampaign(job.data.campaignId)

    return { success: true }
  } catch (error: any) {
    const errorType = classifyError(error)
    const config = getRetryConfig(errorType)

    if (config.maxAttempts === 0 || job.attemptsMade >= config.maxAttempts) {
      // Move to DLQ
      await moveToDeadLetterQueue(
        job,
        error,
        errorType === ErrorType.NETWORK_ERROR // retryable
      )
      throw error // Mark job as failed
    }

    // Will auto-retry by BullMQ
    throw error
  }
})
```

---

## 🔍 Monitoring & Debugging

### 1. Error Logs

All errors are logged with context:

```typescript
console.error('[ErrorHandler] Operation failed:', {
  operation: 'createSubscriber',
  attempt: 3,
  errorType: 'NETWORK_ERROR',
  error: error.message,
  willRetry: true,
  nextRetryIn: '8s',
})
```

### 2. Metrics

Track error rates:

```typescript
import { trackApiRequest } from '@/lib/email/monitoring/MetricsCollector'

trackApiRequest('/api/subscribers', 'POST', 500, 1234)
// Automatically increments error counter
```

### 3. Sentry Integration

Capture errors in Sentry:

```typescript
import { captureError } from '@/lib/email/monitoring/SentryIntegration'

catch (error) {
  captureError(error, {
    tags: {
      component: 'email-sender',
      errorType: classifyError(error),
    },
    extra: {
      subscriber: subscriberEmail,
      campaign: campaignId,
    },
  })
}
```

### 4. Health Checks

Monitor error rates:

```typescript
const metrics = await getMetricsCollector().getSystemHealth()

if (metrics.emailsFailed24h / metrics.emailsSent24h > 0.1) {
  // Alert: 10%+ failure rate
}
```

---

## ✅ Best Practices

### 1. Always Use Retry-Safe Operations

**❌ Bad - Not idempotent:**
```typescript
await client.updateSubscriber({ email: 'john@example.com', credits: credits + 100 })
// If this retries, credits will be added multiple times!
```

**✅ Good - Idempotent:**
```typescript
await client.updateSubscriber({ email: 'john@example.com', credits: 200 })
// Safe to retry - same result every time
```

### 2. Set Appropriate Timeouts

```typescript
const response = await fetch(url, {
  signal: AbortSignal.timeout(10000), // 10 second timeout
})
```

### 3. Log with Context

```typescript
console.error('[CampaignSender] Failed to send campaign:', {
  campaignId,
  recipientCount,
  errorType,
  attempt,
})
```

### 4. Monitor DLQ Size

```bash
# Alert if DLQ > 100 items
*/15 * * * * check-dlq-size.sh
```

### 5. Regular DLQ Review

```typescript
// Weekly review of DLQ to identify patterns
const stats = await dlq.getStats()
console.log('Top error types:', stats.byErrorType)
```

### 6. Test Error Scenarios

```typescript
// Test network error handling
it('should retry on network error', async () => {
  const mockClient = {
    createSubscriber: jest.fn()
      .mockRejectedValueOnce(new Error('ECONNREFUSED'))
      .mockRejectedValueOnce(new Error('ECONNREFUSED'))
      .mockResolvedValueOnce({ id: 123 })
  }

  const result = await executeWithRetry(() => mockClient.createSubscriber(data))

  expect(mockClient.createSubscriber).toHaveBeenCalledTimes(3)
  expect(result.id).toBe(123)
})
```

### 7. Graceful Degradation

```typescript
try {
  await sendEmail(recipient)
} catch (error) {
  // Fallback: Queue for later
  await queue.add('send-email', { recipient }, {
    delay: 60000, // Try again in 1 minute
  })
}
```

---

## 📚 Related Documentation

- [Monitoring & Alerting Guide](./MONITORING_AND_ALERTING_GUIDE.md)
- [API Key Management Guide](./API_KEY_MANAGEMENT_GUIDE.md)
- [Webhook Security Guide](./WEBHOOK_SECURITY_GUIDE.md)
- [Master Implementation Plan](./MASTER_IMPLEMENTATIEPLAN_v1.md)

---

**Questions?** Contact your system administrator or refer to the monitoring section for real-time error tracking.
