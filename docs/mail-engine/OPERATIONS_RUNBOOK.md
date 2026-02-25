# 📖 Operations Runbook - Email Marketing Engine

**Last Updated:** February 25, 2026
**Status:** ✅ Production Ready
**Version:** 1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Daily Operations](#daily-operations)
3. [Common Tasks](#common-tasks)
4. [Incident Response](#incident-response)
5. [Maintenance Windows](#maintenance-windows)
6. [Escalation Procedures](#escalation-procedures)
7. [Emergency Contacts](#emergency-contacts)

---

## 🎯 Overview

This runbook provides step-by-step procedures for operating and maintaining the Email Marketing Engine in production.

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│              Email Marketing Engine Stack                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Application:  Next.js 15 + Payload CMS 3.0                 │
│  Database:     PostgreSQL 14+                                │
│  Queue:        BullMQ + Redis                                │
│  Email:        Listmonk 2.4+                                │
│  Monitoring:   Sentry + Custom Health Checks                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Metrics to Monitor

- **Email delivery rate**: Should be > 98%
- **API error rate**: Should be < 2%
- **Response time (P95)**: Should be < 500ms
- **Queue depth**: Should be < 1000 jobs
- **Failed jobs (DLQ)**: Should be < 100

---

## 📅 Daily Operations

### Morning Checklist (08:00 - 09:00)

**Priority: HIGH**

```bash
# 1. Check system health
curl https://yourdomain.com/api/email-marketing/health

# Expected: {"status":"healthy"}
# If unhealthy: Follow incident response procedure
```

```bash
# 2. Review overnight metrics
curl https://yourdomain.com/api/email-marketing/metrics \
  -H "Authorization: Bearer $API_KEY" | jq '.systemHealth'

# Check:
# - emailsSent24h > 0
# - emailsFailed24h / emailsSent24h < 0.02 (2%)
# - automationErrors24h < 10
# - failedJobs < 100
```

```bash
# 3. Check alert inbox
# Review any alerts sent to ALERT_EMAILS
# Common alerts:
# - High failure rate
# - System component unhealthy
# - High DLQ count
```

```bash
# 4. Review application logs
# Vercel:
vercel logs --since 24h | grep ERROR

# PM2:
pm2 logs email-marketing-engine --lines 100 | grep ERROR

# Docker:
docker logs email-marketing-engine --since 24h | grep ERROR

# Look for patterns or recurring errors
```

```bash
# 5. Check dead letter queue
npx tsx -e "
  import { getDeadLetterQueueManager } from '@/lib/queue/dead-letter-queue'
  const dlq = getDeadLetterQueueManager()
  const stats = await dlq.getStats()
  console.log('DLQ Stats:', stats)
"

# If total > 100: Investigate and bulk retry if safe
```

### Evening Checklist (17:00 - 18:00)

**Priority: MEDIUM**

```bash
# 1. Review daily statistics
# Check dashboard for:
# - Total emails sent today
# - Top campaigns by engagement
# - New subscribers
# - Unsubscribe rate

# 2. Backup verification
# Verify automated database backup completed
pg_dump --version  # Check backup script logs

# 3. Check scheduled campaigns
# Verify campaigns scheduled for tomorrow are ready

# 4. Update on-call status
# Ensure on-call engineer is assigned for tonight
```

---

## 🔧 Common Tasks

### Task 1: Add New API Key for Client

**When:** Client requests API access

**Steps:**

1. **Login to admin panel**
   ```
   https://yourdomain.com/admin
   ```

2. **Navigate to Email API Keys collection**
   ```
   Collections → Email Marketing → Email API Keys → Create New
   ```

3. **Fill in details:**
   ```
   Name: Client Name - Production
   Environment: live
   Tenant: [Select client's tenant]
   Scopes: [Select required scopes]
   Status: active
   Rate Limits:
     - Per minute: 60
     - Per hour: 1000
     - Per day: 10000
   ```

4. **Save and copy API key**
   ```
   ⚠️ IMPORTANT: API key is shown ONLY ONCE!
   Copy: sk_live_xxxxxxxxxxxxx
   ```

5. **Send key to client securely**
   ```
   Use encrypted channel (1Password, encrypted email, etc.)
   Include API documentation link
   ```

6. **Verify key works**
   ```bash
   curl -X GET "https://yourdomain.com/api/v1/email-marketing/subscribers" \
     -H "Authorization: Bearer sk_live_xxxxxxxxxxxxx"
   ```

**Expected result:** `{"success":true,"data":[...]}`

---

### Task 2: Investigate High Email Failure Rate

**When:** Alert "High Email Failure Rate" received

**Steps:**

1. **Get failure statistics**
   ```sql
   SELECT
     type,
     COUNT(*) as count,
     metadata->>'error' as error_message
   FROM email_events
   WHERE type = 'failed'
     AND created_at > NOW() - INTERVAL '24 hours'
   GROUP BY type, metadata->>'error'
   ORDER BY count DESC
   LIMIT 10;
   ```

2. **Identify error patterns**
   - **Network errors**: Check Listmonk connectivity
   - **Validation errors**: Check subscriber data quality
   - **Rate limit errors**: Check Listmonk rate limits
   - **SMTP errors**: Check SMTP configuration

3. **Check Listmonk health**
   ```bash
   curl -u "$LISTMONK_USERNAME:$LISTMONK_PASSWORD" \
     "$LISTMONK_URL/api/health"
   ```

4. **Review Listmonk logs**
   ```bash
   # If self-hosted
   docker logs listmonk --tail 100
   ```

5. **Take corrective action**
   - Network issues: Verify connectivity, restart Listmonk
   - Validation issues: Clean up subscriber list
   - SMTP issues: Verify SMTP credentials
   - Rate limits: Reduce send rate

6. **Monitor recovery**
   ```bash
   # Check failure rate every 15 minutes
   watch -n 900 'curl https://yourdomain.com/api/email-marketing/metrics | jq ".systemHealth.emailsFailed24h"'
   ```

---

### Task 3: Clear Stuck Jobs from Queue

**When:** Alert "Many Failed Jobs in Queue" received

**Steps:**

1. **Get DLQ statistics**
   ```typescript
   import { getDeadLetterQueueManager } from '@/lib/queue/dead-letter-queue'

   const dlq = getDeadLetterQueueManager()
   const stats = await dlq.getStats()
   console.log('Total failed jobs:', stats.total)
   console.log('By queue:', stats.byQueue)
   console.log('By error type:', stats.byErrorType)
   ```

2. **Review failed jobs**
   ```typescript
   const failedJobs = await dlq.getFailedJobs({ queue: 'email-marketing' }, 20)

   for (const job of failedJobs) {
     console.log(`Job ${job.jobId}:`)
     console.log(`  Name: ${job.jobName}`)
     console.log(`  Error: ${job.error.message}`)
     console.log(`  Retryable: ${job.retryable}`)
     console.log(`  Attempts: ${job.attempts}`)
   }
   ```

3. **Determine action**
   - **Network errors (retryable)**: Bulk retry
   - **Validation errors (not retryable)**: Fix data, manual retry
   - **Unknown errors**: Investigate root cause

4. **Bulk retry (if safe)**
   ```typescript
   // Retry up to 50 retryable jobs
   await dlq.bulkRetryFailedJobs(
     { queue: 'email-marketing', retryable: true },
     50
   )
   ```

5. **Monitor results**
   ```bash
   # Wait 5 minutes, check DLQ again
   sleep 300
   npx tsx -e "..." # Run step 1 again
   ```

6. **Clean up old entries (if needed)**
   ```typescript
   // Delete jobs older than 30 days
   await dlq.cleanupOldEntries(30)
   ```

---

### Task 4: Scale Up for High Traffic

**When:** Expecting high traffic (e.g., Black Friday campaign)

**Vercel:**

```bash
# Vercel auto-scales, but verify:
vercel inspect <deployment-url>

# Check function concurrency limits
# Contact Vercel support if needed
```

**Docker:**

```bash
# Scale to 4 replicas
docker service scale email-marketing-engine=4

# Verify
docker service ps email-marketing-engine
```

**PM2:**

```bash
# Scale to 8 instances
pm2 scale email-marketing-engine 8

# Verify
pm2 status
```

**Database:**

```bash
# Increase connection pool
# Update DATABASE_POOL_MAX=20 in environment
# Restart application
```

**Redis:**

```bash
# Monitor Redis memory
redis-cli INFO memory

# If needed, upgrade Redis instance
# (via hosting provider dashboard)
```

---

### Task 5: Database Maintenance

**When:** Monthly (first Sunday, 02:00 AM)

**Steps:**

1. **Announce maintenance window**
   ```
   Send email to stakeholders 48 hours before:
   "Database maintenance scheduled for [DATE] 02:00-04:00 AM.
   System will remain available with potential slight slowdown."
   ```

2. **Backup database**
   ```bash
   pg_dump -h host -U user -d dbname -f backup_$(date +%Y%m%d_%H%M%S).sql

   # Verify backup
   ls -lh backup_*.sql
   ```

3. **Run VACUUM ANALYZE**
   ```sql
   VACUUM ANALYZE;
   ```

4. **Check for bloated tables**
   ```sql
   SELECT
     schemaname,
     tablename,
     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
     n_live_tup,
     n_dead_tup
   FROM pg_stat_user_tables
   WHERE n_dead_tup > 1000
   ORDER BY n_dead_tup DESC
   LIMIT 10;
   ```

5. **Check index health**
   ```sql
   SELECT
     schemaname,
     tablename,
     indexname,
     pg_size_pretty(pg_relation_size(indexrelid)) as size,
     idx_scan,
     idx_tup_read
   FROM pg_stat_user_indexes
   WHERE idx_scan < 100
   ORDER BY pg_relation_size(indexrelid) DESC
   LIMIT 10;
   ```

6. **Clean up old data (if needed)**
   ```sql
   -- Delete email events older than 90 days
   DELETE FROM email_events
   WHERE created_at < NOW() - INTERVAL '90 days';

   -- Verify
   SELECT COUNT(*) FROM email_events;
   ```

7. **Verify system health**
   ```bash
   curl https://yourdomain.com/api/email-marketing/health
   ```

---

## 🚨 Incident Response

### Incident Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| **P1 - Critical** | Complete system outage | 15 min | Database down, app unreachable |
| **P2 - High** | Major feature broken | 1 hour | Emails not sending, API errors |
| **P3 - Medium** | Minor feature issue | 4 hours | Slow performance, partial degradation |
| **P4 - Low** | Cosmetic or minor bug | 24 hours | UI glitch, documentation error |

---

### P1 - Critical Incident Procedure

**Examples:**
- Application completely down (500 errors)
- Database unreachable
- Redis down (queues not working)

**Response:**

```bash
# STEP 1: Assess (5 minutes)
# Check all health endpoints
curl https://yourdomain.com/api/email-marketing/health
curl https://yourdomain.com/api/email-marketing/alive

# Check external services
psql $DATABASE_URL -c "SELECT 1"  # Database
redis-cli -u $REDIS_URL ping      # Redis
curl $LISTMONK_URL/api/health     # Listmonk
```

```bash
# STEP 2: Notify (immediately)
# Send alert to:
# - DevOps team (Slack, PagerDuty)
# - Stakeholders (email)
# - Status page (if applicable)

# Template:
# "INCIDENT: Email Marketing Engine is DOWN
#  Status: Investigating
#  Impact: All email functionality unavailable
#  ETA: Unknown - investigating
#  Updates: Every 15 minutes"
```

```bash
# STEP 3: Diagnose (10 minutes)
# Check recent deployments
vercel ls  # Vercel
git log -5 # Git commits
pm2 logs --lines 200  # PM2

# Check resource usage
# - CPU
# - Memory
# - Disk space
# - Network

# Check external service status
# - Database provider status page
# - Redis provider status page
# - Listmonk status
```

```bash
# STEP 4: Mitigate (immediate)
# If recent deployment caused it:
vercel rollback  # Vercel
pm2 restart      # PM2
docker restart   # Docker

# If database issue:
# - Check connection limits
# - Restart database (last resort)

# If Redis issue:
# - Check memory usage
# - Flush cache if needed: redis-cli FLUSHDB
# - Restart Redis (last resort)
```

```bash
# STEP 5: Recover (15-30 minutes)
# Verify health
curl https://yourdomain.com/api/email-marketing/health

# Test functionality
curl -X POST "$URL/api/v1/email-marketing/subscribers" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"email":"test@example.com",...}'

# Monitor for 15 minutes
watch -n 60 'curl -s $URL/api/email-marketing/health | jq .status'
```

```bash
# STEP 6: Communicate (ongoing)
# Send update:
# "RESOLVED: Email Marketing Engine is OPERATIONAL
#  Root cause: [Brief description]
#  Resolution: [Actions taken]
#  Duration: XX minutes
#  Next steps: Post-mortem within 24 hours"
```

---

### P2 - High Severity Incident Procedure

**Examples:**
- High email failure rate (> 20%)
- API errors (> 10%)
- Slow performance (P95 > 2s)

**Response:**

```bash
# STEP 1: Assess (15 minutes)
# Get metrics
curl $URL/api/email-marketing/metrics | jq '.systemHealth'

# Check component health
curl $URL/api/email-marketing/health | jq '.components'

# Review recent changes
git log --since="24 hours ago"
```

```bash
# STEP 2: Notify stakeholders (30 minutes)
# Send email to team:
# "INCIDENT P2: [Description]
#  Impact: [Affected functionality]
#  ETA: Investigating - update in 1 hour"
```

```bash
# STEP 3: Investigate (1 hour)
# Check error logs
# Check DLQ
# Check external services
# Identify root cause
```

```bash
# STEP 4: Fix (2-4 hours)
# Apply fix
# Deploy if needed
# Monitor for improvement
```

```bash
# STEP 5: Verify & Communicate
# Verify metrics improved
# Send resolution email
# Schedule post-mortem if needed
```

---

## 🔧 Maintenance Windows

### Scheduled Maintenance

**Monthly Maintenance: First Sunday, 02:00-04:00 AM**

**Procedures:**
1. Database maintenance (see Task 5)
2. Update dependencies
3. Review and clean up old data
4. Performance testing

**Communication:**
- Announce 48 hours in advance
- Send reminder 24 hours before
- Update status page during maintenance
- Send completion notice after

---

### Emergency Maintenance

**When:** Critical security patch or urgent fix needed

**Procedure:**

1. **Assess urgency (15 minutes)**
   - Is it truly urgent?
   - Can it wait for scheduled maintenance?
   - What's the risk of not patching?

2. **Approve (30 minutes)**
   - Get approval from stakeholders
   - Document reason for emergency

3. **Announce (immediate)**
   ```
   "URGENT MAINTENANCE: Starting in 2 hours
    Reason: [Security patch / Critical bug fix]
    Duration: Estimated 30 minutes
    Impact: [Brief description]
    Window: [Start time] - [End time]"
   ```

4. **Execute (per deployment guide)**
   - Backup first
   - Apply patch
   - Test thoroughly
   - Monitor closely

5. **Communicate completion**
   ```
   "MAINTENANCE COMPLETE
    Duration: XX minutes
    Changes: [Brief description]
    Status: All systems operational
    Next steps: [Any follow-up needed]"
   ```

---

## 📞 Escalation Procedures

### Escalation Matrix

| Issue Type | First Contact | Escalate To | Escalate After |
|-----------|---------------|-------------|----------------|
| Application down | On-call engineer | DevOps lead | 30 minutes |
| Database issue | DBA | Database vendor support | 1 hour |
| Email delivery | Email admin | Listmonk support | 2 hours |
| Security incident | Security lead | CISO | Immediately |
| Data loss | On-call engineer | CTO | Immediately |

---

### Escalation Steps

**Level 1: On-Call Engineer (0-30 minutes)**
- Initial response
- Basic troubleshooting
- Check logs, metrics, health

**Level 2: Team Lead (30-60 minutes)**
- Advanced troubleshooting
- Coordination with external vendors
- Decision on rollback vs. fix forward

**Level 3: Management (1+ hours)**
- Stakeholder communication
- Resource allocation
- Vendor escalation
- Business impact decisions

---

## 📱 Emergency Contacts

### Internal Team

| Role | Name | Phone | Email | Availability |
|------|------|-------|-------|--------------|
| On-Call Engineer | [Rotating] | +31 6 XXXX XXXX | oncall@company.com | 24/7 |
| DevOps Lead | [Name] | +31 6 XXXX XXXX | devops@company.com | Business hours |
| DBA | [Name] | +31 6 XXXX XXXX | dba@company.com | Business hours |
| Security Lead | [Name] | +31 6 XXXX XXXX | security@company.com | 24/7 |
| CTO | [Name] | +31 6 XXXX XXXX | cto@company.com | On-call |

### External Vendors

| Service | Support Contact | SLA | Priority Channel |
|---------|----------------|-----|------------------|
| Database (Railway) | support@railway.app | 1 hour | Priority ticket |
| Redis (Upstash) | support@upstash.com | 4 hours | Email |
| Listmonk | self-hosted | N/A | GitHub issues |
| Sentry | support@sentry.io | 24 hours | Email |
| Vercel | vercel.com/support | 1 hour (Pro) | Dashboard |

---

## 📚 Related Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Monitoring & Alerting Guide](./MONITORING_AND_ALERTING_GUIDE.md)
- [Error Handling Guide](./ERROR_HANDLING_GUIDE.md)
- [Webhook Security Guide](./WEBHOOK_SECURITY_GUIDE.md)
- [Master Implementation Plan](./MASTER_IMPLEMENTATIEPLAN_v1.md)

---

**On-Call Hotline:** +31 20 XXX XXXX
**Incident Slack Channel:** #incidents
**Status Page:** status.yourdomain.com
