# 📊 Monitoring & Alerting Guide - Email Marketing Engine

**Last Updated:** February 25, 2026
**Status:** ✅ Production Ready
**Version:** 1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Health Checks](#health-checks)
3. [Metrics Collection](#metrics-collection)
4. [Alerting System](#alerting-system)
5. [Sentry Integration](#sentry-integration)
6. [Dashboards](#dashboards)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Email Marketing Engine includes comprehensive monitoring and alerting to ensure:
- **System reliability** - Early detection of issues
- **Performance tracking** - Monitor key metrics
- **Error tracking** - Automatic error reporting
- **Proactive alerts** - Notifications before issues escalate

### Monitoring Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Health Checks│  │   Metrics    │  │    Alerts    │      │
│  │              │  │  Collection  │  │   Manager    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                           │                                  │
│         ┌─────────────────┴─────────────────┐               │
│         │                                     │               │
│    ┌────▼────┐                          ┌────▼────┐         │
│    │ Sentry  │                          │  Email  │         │
│    │  (Errors)│                         │  Slack  │         │
│    └─────────┘                          │PagerDuty│         │
│                                          └─────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Features

✅ **Multi-component health checks** (database, Redis, Listmonk, queue, metrics)
✅ **Real-time metrics collection** (emails, API, automation, queue)
✅ **Multi-channel alerting** (email, Slack, PagerDuty)
✅ **Sentry error tracking** (automatic error capture)
✅ **Prometheus metrics export** (for Grafana dashboards)
✅ **Kubernetes-style probes** (liveness, readiness)
✅ **Scheduled monitoring** (cron job)

---

## 🏥 Health Checks

### Components Monitored

The health check system monitors 5 critical components:

| Component | Check | Healthy Threshold | Degraded Threshold |
|-----------|-------|-------------------|-------------------|
| **Database** | Query response time | < 1000ms | 1000ms - 5000ms |
| **Redis** | Ping + read/write test | < 100ms | 100ms - 500ms |
| **Listmonk** | API health endpoint | < 500ms | 500ms - 2000ms |
| **Queue** | Stuck jobs detection | < 10 stuck jobs | 10-100 stuck jobs |
| **Metrics** | Failure rates, errors | Low errors | Elevated errors |

### Health Status Levels

```typescript
enum HealthStatus {
  HEALTHY = 'healthy',    // All systems operational
  DEGRADED = 'degraded',  // Some systems slow or minor issues
  UNHEALTHY = 'unhealthy' // Critical systems down
}
```

### Health Check API Endpoints

#### 1. Comprehensive Health Check

**Endpoint:** `GET /api/email-marketing/health`

Returns detailed health information for all components.

**Response (200 OK - Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-25T10:30:00Z",
  "components": {
    "database": {
      "status": "healthy",
      "message": "Database responding normally",
      "responseTime": 45,
      "metadata": {
        "connectionPool": "active"
      }
    },
    "redis": {
      "status": "healthy",
      "message": "Redis responding normally",
      "responseTime": 12,
      "metadata": {
        "connected": true
      }
    },
    "listmonk": {
      "status": "healthy",
      "message": "Listmonk responding normally",
      "responseTime": 120,
      "metadata": {
        "status": "ok"
      }
    },
    "queue": {
      "status": "healthy",
      "message": "Queue system healthy",
      "responseTime": 8,
      "metadata": {
        "totalKeys": 45,
        "stuckJobs": 0
      }
    },
    "metrics": {
      "status": "healthy",
      "message": "Metrics healthy",
      "responseTime": 156,
      "metadata": {
        "emailsSent24h": 1240,
        "activeSubscribers": 8543,
        "activeCampaigns": 3
      }
    }
  },
  "summary": {
    "totalChecks": 5,
    "healthyChecks": 5,
    "degradedChecks": 0,
    "unhealthyChecks": 0
  }
}
```

**Response (503 Service Unavailable - Unhealthy):**
```json
{
  "status": "unhealthy",
  "timestamp": "2026-02-25T10:30:00Z",
  "components": {
    "database": {
      "status": "unhealthy",
      "message": "Database error: Connection timeout",
      "responseTime": 5000
    },
    "redis": {
      "status": "healthy",
      "message": "Redis responding normally",
      "responseTime": 15
    },
    // ... other components
  },
  "summary": {
    "totalChecks": 5,
    "healthyChecks": 4,
    "degradedChecks": 0,
    "unhealthyChecks": 1
  }
}
```

#### 2. Readiness Probe (Kubernetes)

**Endpoint:** `GET /api/email-marketing/ready`

Checks if the service is ready to accept traffic (database and Redis accessible).

**Response (200 OK):**
```json
{
  "status": "ready"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "not ready"
}
```

**Use case:** Kubernetes readiness probe
```yaml
readinessProbe:
  httpGet:
    path: /api/email-marketing/ready
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10
```

#### 3. Liveness Probe (Kubernetes)

**Endpoint:** `GET /api/email-marketing/alive`

Minimal check to verify the service is alive (simple database query).

**Response (200 OK):**
```json
{
  "status": "alive"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "dead"
}
```

**Use case:** Kubernetes liveness probe
```yaml
livenessProbe:
  httpGet:
    path: /api/email-marketing/alive
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 30
```

### Usage in Code

```typescript
import { getHealthChecker } from '@/lib/email/monitoring/HealthChecker'

const healthChecker = getHealthChecker()

// Run all health checks
const health = await healthChecker.checkAll()

// Check individual components
const databaseHealth = await healthChecker.checkDatabase()
const redisHealth = await healthChecker.checkRedis()

// Quick checks for probes
const isReady = await healthChecker.isReady()
const isAlive = await healthChecker.isAlive()
```

---

## 📈 Metrics Collection

### Tracked Metrics

The metrics collector tracks 40+ metrics across 8 categories:

#### 1. Email Sending Metrics

- **emails_sent_total** - Total emails sent (counter)
- **emails_failed_total** - Total failed emails (counter)
- **emails_sent_24h** - Emails sent in last 24h
- **emails_failed_24h** - Failed emails in last 24h
- **emails_sent_per_minute** - Send rate

#### 2. Campaign Metrics

- **active_campaigns** - Number of active campaigns
- **scheduled_campaigns** - Scheduled campaigns
- **draft_campaigns** - Draft campaigns

#### 3. Subscriber Metrics

- **total_subscribers** - Total subscriber count
- **active_subscribers** - Active subscribers
- **subscribers_added_24h** - New subscribers (24h)
- **unsubscribes_24h** - Unsubscribes (24h)

#### 4. Automation Metrics

- **active_automation_rules** - Active rules
- **automation_executions_24h** - Executions (24h)
- **automation_errors_24h** - Errors (24h)
- **automation_duration** - Average execution time (histogram)

#### 5. Queue Metrics

- **queued_jobs** - Jobs waiting in queue
- **failed_jobs** - Failed jobs
- **completed_jobs_24h** - Completed jobs (24h)
- **job_duration** - Average job duration (histogram)

#### 6. API Metrics

- **api_requests_total** - Total API requests (counter)
- **api_errors_total** - Total API errors (counter)
- **api_requests_24h** - Requests (24h)
- **api_errors_24h** - Errors (24h)
- **api_rate_limit_hits_24h** - Rate limit hits
- **api_request_duration** - Request latency (histogram)

#### 7. System Metrics

- **memory_usage** - Heap memory usage
- **cpu_usage** - CPU usage percentage
- **database_connections** - Active DB connections
- **redis_connections** - Active Redis connections

#### 8. Error Metrics

- **critical_errors_24h** - Critical errors (24h)
- **warnings_24h** - Warnings (24h)

### Metrics API

#### Get Metrics (JSON Format)

**Endpoint:** `GET /api/email-marketing/metrics`
**Authentication:** Requires API key with `analytics:read` scope

**Request:**
```bash
curl -X GET "https://yourdomain.com/api/email-marketing/metrics" \
  -H "Authorization: Bearer sk_live_your_api_key"
```

**Response:**
```json
{
  "systemHealth": {
    "emailsSentTotal": 145230,
    "emailsSent24h": 1240,
    "emailsFailedTotal": 423,
    "emailsFailed24h": 12,
    "emailsSentPerMinute": 0.86,
    "activeCampaigns": 3,
    "scheduledCampaigns": 5,
    "draftCampaigns": 12,
    "totalSubscribers": 8543,
    "activeSubscribers": 8120,
    "subscribersAdded24h": 45,
    "unsubscribes24h": 3,
    "activeAutomationRules": 8,
    "automationExecutions24h": 234,
    "automationErrors24h": 2,
    "queuedJobs": 15,
    "failedJobs": 3,
    "completedJobs24h": 456,
    "averageJobDuration": 1234,
    "apiRequests24h": 3450,
    "apiErrors24h": 12,
    "apiRateLimitHits24h": 5,
    "averageApiLatency": 45,
    "databaseConnections": 10,
    "redisConnections": 5,
    "memoryUsage": 234567890,
    "cpuUsage": 12.5,
    "criticalErrors24h": 0,
    "warnings24h": 8
  },
  "metrics": [
    {
      "name": "emails_sent_total",
      "type": "counter",
      "value": 145230,
      "timestamp": "2026-02-25T10:30:00Z"
    },
    // ... more metrics
  ],
  "timestamp": "2026-02-25T10:30:00Z"
}
```

#### Get Metrics (Prometheus Format)

**Endpoint:** `GET /api/email-marketing/metrics?format=prometheus`
**Authentication:** Requires API key with `analytics:read` scope

**Request:**
```bash
curl -X GET "https://yourdomain.com/api/email-marketing/metrics?format=prometheus" \
  -H "Authorization: Bearer sk_live_your_api_key"
```

**Response (text/plain):**
```
# TYPE emails_sent_total counter
emails_sent_total{tenant="tenant_123"} 145230

# TYPE emails_failed_total counter
emails_failed_total{tenant="tenant_123",error_type="network"} 423

# TYPE api_requests_total counter
api_requests_total{endpoint="/subscribers",method="GET",status="200"} 3450

# TYPE api_request_duration histogram
api_request_duration{endpoint="/subscribers",method="GET"} 45

# TYPE automation_executions_total counter
automation_executions_total{rule="welcome_email",success="true"} 234
```

### Usage in Code

```typescript
import {
  getMetricsCollector,
  trackEmailSent,
  trackEmailFailed,
  trackApiRequest,
  trackAutomationExecution,
  trackJobCompletion,
} from '@/lib/email/monitoring/MetricsCollector'

// Track email sent
trackEmailSent('tenant_123', 'campaign_456')

// Track email failed
trackEmailFailed('tenant_123', 'network_error')

// Track API request
trackApiRequest('/api/v1/subscribers', 'GET', 200, 45)

// Track automation execution
trackAutomationExecution('rule_123', true, 1234)

// Track job completion
trackJobCompletion('email-marketing', 'send-campaign', true, 5000)

// Get system health
const collector = getMetricsCollector()
const health = await collector.getSystemHealth()
```

---

## 🚨 Alerting System

### Alert Types

The system can trigger 10 different types of alerts:

| Type | Severity | Description | Default Threshold |
|------|----------|-------------|-------------------|
| `SYSTEM_HEALTH` | CRITICAL/WARNING | Component unhealthy/degraded | Any unhealthy component |
| `HIGH_ERROR_RATE` | ERROR | High API error rate | > 10% error rate |
| `HIGH_FAILURE_RATE` | ERROR | High email failure rate | > 10% failure rate |
| `QUEUE_STUCK` | WARNING | Too many stuck jobs | > 50 stuck jobs |
| `DATABASE_SLOW` | WARNING | Database slow | > 1000ms query time |
| `REDIS_DOWN` | CRITICAL | Redis unavailable | Connection failed |
| `LISTMONK_DOWN` | CRITICAL | Listmonk unavailable | API failed |
| `RATE_LIMIT_ABUSE` | WARNING | High rate limit hits | > 100 hits/hour |
| `AUTOMATION_ERRORS` | WARNING | High automation errors | > 10 errors/hour |
| `MEMORY_HIGH` | WARNING | High memory usage | > 90% memory |

### Alert Severity Levels

```typescript
enum AlertSeverity {
  INFO = 'info',         // Informational
  WARNING = 'warning',   // Requires attention
  ERROR = 'error',       // Needs investigation
  CRITICAL = 'critical'  // Immediate action required
}
```

### Notification Channels

Alerts can be sent via multiple channels:

1. **Email** - For all severity levels
2. **Slack** - For WARNING, ERROR, CRITICAL
3. **PagerDuty** - For CRITICAL only (24/7 on-call)

### Alert Configuration

Configure alerting in environment variables:

```bash
# Alert recipients
ALERT_EMAILS=admin@yourdomain.com,ops@yourdomain.com

# Slack (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX

# PagerDuty (optional)
PAGERDUTY_API_KEY=your_pagerduty_routing_key

# Alert thresholds (optional - defaults shown)
EMAIL_FAILURE_RATE_THRESHOLD=10  # %
AUTOMATION_ERROR_THRESHOLD=10    # errors per hour
RATE_LIMIT_ABUSE_THRESHOLD=100   # hits per hour
MEMORY_USAGE_THRESHOLD=90        # %
```

### Example Alerts

#### Email Alert

**Subject:** [ERROR] High Email Failure Rate

**Body:**
```html
[ERROR] High Email Failure Rate

Alert Type: high_failure_rate
Time: 2026-02-25T10:30:00Z

Message:
Email failure rate is 15.2% (threshold: 10%)

Additional Details:
failureRate: 15.2%
emailsSent: 1240
emailsFailed: 189
```

#### Slack Alert

```
🔴 ERROR: High Email Failure Rate

Email failure rate is 15.2% (threshold: 10%)

failureRate: 15.2%
emailsSent: 1240
emailsFailed: 189

Email Marketing Engine • Feb 25, 10:30 AM
```

### Usage in Code

```typescript
import { getAlertManager, AlertSeverity, AlertType } from '@/lib/email/monitoring/AlertManager'

const alertManager = getAlertManager()

// Send custom alert
await alertManager.sendAlert({
  type: AlertType.HIGH_ERROR_RATE,
  severity: AlertSeverity.ERROR,
  title: 'High API Error Rate',
  message: 'API error rate is 15% (threshold: 10%)',
  metadata: {
    errorRate: '15%',
    requests: 1000,
    errors: 150,
  },
})

// Check health and auto-alert
const health = await healthChecker.checkAll()
await alertManager.checkHealthAndAlert(health)

// Check metrics and auto-alert
const metrics = await metricsCollector.getSystemHealth()
await alertManager.checkMetricsAndAlert(metrics)

// Get active alerts
const activeAlerts = alertManager.getActiveAlerts()

// Resolve alert
await alertManager.resolveAlert('alert_id')
```

---

## 🐛 Sentry Integration

### Setup

1. **Install Sentry SDK:**
```bash
npm install @sentry/nextjs
```

2. **Initialize Sentry** in `instrumentation.ts`:
```typescript
import { initSentry, getSentryConfig } from '@/lib/email/monitoring/SentryIntegration'

export function register() {
  initSentry(getSentryConfig())
}
```

3. **Add environment variables:**
```bash
# .env
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_TRACES_SAMPLE_RATE=0.1  # Sample 10% of transactions
SENTRY_PROFILES_SAMPLE_RATE=0.1
```

### Usage

#### Capture Errors

```typescript
import { captureError } from '@/lib/email/monitoring/SentryIntegration'

try {
  await sendCampaign(campaignId)
} catch (error) {
  captureError(error, {
    tags: {
      component: 'campaign-sender',
      campaignId: campaignId,
    },
    extra: {
      recipientCount: 1000,
      scheduledAt: new Date(),
    },
    user: {
      id: userId,
      tenant: tenantId,
    },
    level: 'error',
  })
  throw error
}
```

#### Add Breadcrumbs

```typescript
import { addBreadcrumb } from '@/lib/email/monitoring/SentryIntegration'

addBreadcrumb({
  category: 'email',
  message: 'Starting campaign send',
  level: 'info',
  data: {
    campaignId: '123',
    recipientCount: 1000,
  },
})
```

#### Performance Monitoring

```typescript
import { startTransaction } from '@/lib/email/monitoring/SentryIntegration'

const transaction = startTransaction({
  name: 'send-campaign',
  op: 'email.send',
  tags: { campaignId: '123' },
})

try {
  const child = transaction.startChild({
    op: 'email.prepare',
    description: 'Prepare recipient list',
  })

  await prepareRecipients()
  child.finish()

  await sendEmails()

  transaction.setStatus('ok')
} catch (error) {
  transaction.setStatus('error')
  throw error
} finally {
  transaction.finish()
}
```

#### Set User Context

```typescript
import { setUserContext, clearUserContext } from '@/lib/email/monitoring/SentryIntegration'

// On login
setUserContext({
  id: 'user_123',
  email: 'john@example.com',
  tenant: 'tenant_456',
})

// On logout
clearUserContext()
```

---

## 📊 Dashboards

### Prometheus + Grafana

**1. Configure Prometheus scraping:**

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'email-marketing-engine'
    scrape_interval: 30s
    metrics_path: '/api/email-marketing/metrics'
    params:
      format: ['prometheus']
    static_configs:
      - targets: ['yourdomain.com']
    authorization:
      type: Bearer
      credentials: 'sk_live_your_api_key'
```

**2. Import Grafana dashboard:**

Key metrics to visualize:
- Email send rate (emails/min)
- Email failure rate (%)
- API request rate (req/min)
- API latency (P50, P95, P99)
- Active subscribers trend
- Campaign performance
- Queue depth
- System resources (memory, CPU)

**3. Example Grafana queries:**

```promql
# Email send rate
rate(emails_sent_total[5m])

# Email failure rate
rate(emails_failed_total[5m]) / rate(emails_sent_total[5m]) * 100

# API request duration (P95)
histogram_quantile(0.95, rate(api_request_duration_bucket[5m]))

# Active campaigns
active_campaigns

# Queue depth
queued_jobs
```

### Scheduled Monitoring

**Run health checks every 5 minutes:**

```bash
# Crontab
*/5 * * * * cd /app && npx tsx src/scripts/cron/health-monitoring.ts >> /var/log/health-monitoring.log 2>&1
```

**Script output:**
```
═══════════════════════════════════════════════════════════════════════════════
🏥 HEALTH MONITORING - Starting checks...
═══════════════════════════════════════════════════════════════════════════════

[1/3] Running health checks...

Health Status: HEALTHY
Component Status:
  ✅ database        healthy    (45ms)
     Database responding normally
  ✅ redis           healthy    (12ms)
     Redis responding normally
  ✅ listmonk        healthy    (120ms)
     Listmonk responding normally
  ✅ queue           healthy    (8ms)
     Queue system healthy
  ✅ metrics         healthy    (156ms)
     Metrics healthy

Summary:
  Total checks: 5
  ✅ Healthy: 5
  ⚠️ Degraded: 0
  ❌ Unhealthy: 0

[2/3] Checking metrics...

Key Metrics (24h):
  Emails sent: 1240
  Emails failed: 12
  Failure rate: 0.97%
  Active subscribers: 8543
  Active campaigns: 3
  Automation executions: 234
  Automation errors: 2
  API requests: 3450
  API errors: 12
  Failed jobs: 3

[3/3] Checking alerts...

✅ No active alerts

═══════════════════════════════════════════════════════════════════════════════
✅ HEALTH MONITORING COMPLETE (1234ms)
═══════════════════════════════════════════════════════════════════════════════
```

---

## 🔧 Troubleshooting

### High Memory Usage Alert

**Symptom:** Alert "High Memory Usage" (> 90%)

**Diagnosis:**
```typescript
const metrics = await getMetricsCollector().getSystemHealth()
console.log('Memory usage:', metrics.memoryUsage)
console.log('Heap total:', process.memoryUsage().heapTotal)
```

**Solutions:**
1. Check for memory leaks in application code
2. Increase server memory allocation
3. Optimize database queries (reduce result set sizes)
4. Clear old data from Redis
5. Restart service if memory leak suspected

### High Email Failure Rate

**Symptom:** Alert "High Email Failure Rate" (> 10%)

**Diagnosis:**
1. Check Listmonk logs for errors
2. Check email events in database:
   ```typescript
   const failedEmails = await payload.find({
     collection: 'email-events',
     where: {
       and: [
         { type: { equals: 'failed' } },
         { createdAt: { greater_than: last24Hours } }
       ]
     }
   })
   ```
3. Check error types distribution

**Solutions:**
1. **Network errors**: Check Listmonk connectivity
2. **Validation errors**: Fix subscriber data quality
3. **Rate limiting**: Adjust send rate
4. **Server errors**: Check Listmonk server health

### Stuck Jobs in Queue

**Symptom:** Alert "Many Failed Jobs in Queue" (> 50)

**Diagnosis:**
```bash
# Check dead letter queue
npx tsx -e "
  import { getDeadLetterQueueManager } from '@/lib/queue/dead-letter-queue'
  const dlq = getDeadLetterQueueManager()
  const stats = await dlq.getStats()
  console.log(stats)
"
```

**Solutions:**
1. Review failed job errors
2. Manually retry retryable jobs:
   ```typescript
   await dlq.bulkRetryFailedJobs({ queue: 'email-marketing' }, 10)
   ```
3. Fix underlying issues (code bugs, external service issues)
4. Clear non-retryable jobs

### Component Unhealthy

**Symptom:** Alert "System Component(s) Unhealthy"

**Diagnosis:**
```bash
curl https://yourdomain.com/api/email-marketing/health
```

**Solutions by component:**

**Database unhealthy:**
- Check database server status
- Check connection pool
- Restart database if needed

**Redis unhealthy:**
- Check Redis server status
- Verify REDIS_URL environment variable
- Restart Redis if needed

**Listmonk unhealthy:**
- Check Listmonk server status
- Verify LISTMONK_URL environment variable
- Check network connectivity
- Restart Listmonk if needed

**Queue unhealthy:**
- Clear stuck jobs manually
- Check Redis (queue storage)
- Restart workers

---

## 📚 Related Documentation

- [Error Handling Guide](./ERROR_HANDLING_GUIDE.md)
- [API Key Management Guide](./API_KEY_MANAGEMENT_GUIDE.md)
- [Webhook Security Guide](./WEBHOOK_SECURITY_GUIDE.md)
- [Master Implementation Plan](./MASTER_IMPLEMENTATIEPLAN_v1.md)

---

**Questions?** Contact your system administrator or refer to the troubleshooting section above.
