# 🚀 Deployment Guide - Email Marketing Engine

**Last Updated:** February 25, 2026
**Status:** ✅ Production Ready
**Version:** 1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Database Migration](#database-migration)
5. [Deployment Steps](#deployment-steps)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide covers deploying the Email Marketing Engine to production, including all required services and configurations.

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Production Stack                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │  PostgreSQL  │  │    Redis     │      │
│  │   (App)      │  │  (Database)  │  │   (Queue)    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                           │                                  │
│         ┌─────────────────┴─────────────────┐               │
│         │                                     │               │
│    ┌────▼────┐                          ┌────▼────┐         │
│    │Listmonk │                          │ Resend  │         │
│    │(Emails) │                          │ (SMTP)  │         │
│    └─────────┘                          └─────────┘         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Targets

This guide supports deployment to:
- **Vercel** (recommended for Next.js)
- **Docker** (for self-hosting)
- **VPS** (DigitalOcean, Linode, etc.)
- **Kubernetes** (for enterprise)

---

## ✅ Prerequisites

### Required Services

Before deployment, ensure you have:

1. **✅ PostgreSQL Database** (Production-ready)
   - Recommended: Railway, Supabase, AWS RDS
   - Minimum: PostgreSQL 14+
   - Storage: 10GB+ recommended
   - Backups: Daily automated backups enabled

2. **✅ Redis Instance** (For queues and caching)
   - Recommended: Upstash, Redis Cloud, AWS ElastiCache
   - Minimum: Redis 6+
   - Memory: 512MB+ recommended
   - Persistence: AOF enabled

3. **✅ Listmonk Instance** (Email sending)
   - Self-hosted or managed
   - Version: 2.4.0+
   - SMTP configured
   - API accessible

4. **✅ Domain & DNS** (For email marketing)
   - Custom domain configured
   - SPF, DKIM, DMARC records set
   - SSL certificate (Let's Encrypt recommended)

### Optional Services

5. **Resend Account** (Transactional emails - Optional)
   - API key obtained
   - Domain verified
   - Sending limits confirmed

6. **Sentry Account** (Error tracking - Optional)
   - Project created
   - DSN obtained
   - Alerts configured

7. **Monitoring** (Uptime & metrics - Optional)
   - UptimeRobot account
   - Prometheus/Grafana setup
   - Health check endpoints configured

### Local Setup

Ensure you have:
```bash
Node.js 18+ installed
npm or pnpm installed
Git installed
Database migration tool (Payload CLI)
```

---

## 🔧 Environment Setup

### 1. Create Production Environment File

Create `.env.production`:

```bash
# ═══════════════════════════════════════════════════════════
# 🔐 CORE CONFIGURATION
# ═══════════════════════════════════════════════════════════

# Payload Secret (REQUIRED)
# Generate: openssl rand -hex 32
PAYLOAD_SECRET=your_64_character_hex_secret_here

# Server URL (REQUIRED)
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com

# Node Environment
NODE_ENV=production

# ═══════════════════════════════════════════════════════════
# 🗄️ DATABASE (REQUIRED)
# ═══════════════════════════════════════════════════════════

# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Pool settings (optional)
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ═══════════════════════════════════════════════════════════
# 📮 REDIS (REQUIRED for queues)
# ═══════════════════════════════════════════════════════════

REDIS_URL=redis://:password@host:6379

# ═══════════════════════════════════════════════════════════
# 📧 LISTMONK (REQUIRED for email marketing)
# ═══════════════════════════════════════════════════════════

LISTMONK_URL=https://listmonk.yourdomain.com
LISTMONK_USERNAME=admin
LISTMONK_PASSWORD=your_listmonk_password

# ═══════════════════════════════════════════════════════════
# 🔑 API KEYS & AUTHENTICATION
# ═══════════════════════════════════════════════════════════

# Webhook signing secret (REQUIRED for webhooks)
# Generate: openssl rand -hex 32
WEBHOOK_SIGNING_SECRET=your_webhook_signing_secret_here

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=sk-...

# Resend (Optional - for transactional emails)
RESEND_API_KEY=re_...

# ═══════════════════════════════════════════════════════════
# 🔒 SECURITY
# ═══════════════════════════════════════════════════════════

# reCAPTCHA v3 (Production keys)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
RECAPTCHA_SECRET_KEY=6Lc...

# ═══════════════════════════════════════════════════════════
# 📊 MONITORING & ANALYTICS
# ═══════════════════════════════════════════════════════════

# Sentry (Error tracking)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Alert emails (comma-separated)
ALERT_EMAILS=admin@yourdomain.com,ops@yourdomain.com

# Slack webhook (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# PagerDuty (Optional - for critical alerts)
PAGERDUTY_API_KEY=your_pagerduty_routing_key

# ═══════════════════════════════════════════════════════════
# ⚙️ FEATURE FLAGS
# ═══════════════════════════════════════════════════════════

# Email Marketing Features
ENABLE_EMAIL_CAMPAIGNS=true
ENABLE_EMAIL_AUTOMATION=true
ENABLE_EMAIL_TEMPLATES=true
ENABLE_EMAIL_ANALYTICS=true

# ═══════════════════════════════════════════════════════════
# 🔧 APPLICATION SETTINGS
# ═══════════════════════════════════════════════════════════

# Company info
COMPANY_NAME=Your Company
SITE_NAME=Your Site
CONTACT_EMAIL=contact@yourdomain.com

# Timezone
TZ=Europe/Amsterdam

# Log level
LOG_LEVEL=info
```

### 2. Validate Environment

```bash
# Validate all required environment variables
npm run validate-env

# Expected output:
# ✅ All required environment variables are set
```

---

## 🗄️ Database Migration

### Step 1: Backup Current Database (if upgrading)

```bash
# PostgreSQL backup
pg_dump -h host -U user -d dbname -f backup_$(date +%Y%m%d_%H%M%S).sql

# Or use managed backup tools (Railway, Supabase)
```

### Step 2: Run Migrations

```bash
# Run all pending migrations
npx payload migrate

# Expected output:
# ✅ Ran migration: 20260224_233259_email_api_keys_collection
# ✅ All migrations complete
```

### Step 3: Verify Schema

```bash
# Connect to database and verify tables exist
psql $DATABASE_URL -c "\dt"

# Expected tables:
# - payload_preferences
# - payload_migrations
# - clients (tenants)
# - pages
# - posts
# - media
# - users
# - email_subscribers
# - email_lists
# - email_campaigns
# - email_templates
# - email_automation_rules
# - email_automation_executions
# - email_events
# - email_api_keys
```

---

## 🚀 Deployment Steps

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Link Project

```bash
vercel link
```

#### Step 4: Set Environment Variables

```bash
# Add all environment variables from .env.production
vercel env add PAYLOAD_SECRET production
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
# ... repeat for all variables
```

Or via Vercel Dashboard:
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add all variables from `.env.production`
4. Set scope to "Production"

#### Step 5: Deploy

```bash
# Deploy to production
vercel --prod

# Expected output:
# ✅ Deployment complete
# 🔗 https://yourdomain.com
```

#### Step 6: Configure Custom Domain

```bash
# Add custom domain
vercel domains add yourdomain.com

# Expected output:
# ✅ Domain added. Configure DNS:
#    A    @ 76.76.21.21
#    CNAME www cname.vercel-dns.com
```

---

### Option 2: Docker Deployment

#### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Step 2: Build Docker Image

```bash
docker build -t email-marketing-engine .
```

#### Step 3: Run Container

```bash
docker run -d \
  --name email-marketing-engine \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  email-marketing-engine
```

#### Step 4: Verify Container

```bash
docker logs email-marketing-engine
docker ps | grep email-marketing-engine
curl http://localhost:3000/api/health
```

---

### Option 3: VPS Deployment (PM2)

#### Step 1: Install Dependencies

```bash
# On server
sudo apt update
sudo apt install -y nodejs npm postgresql-client redis-tools

# Install PM2
sudo npm install -g pm2
```

#### Step 2: Clone Repository

```bash
cd /var/www
git clone https://github.com/yourorg/email-marketing-engine.git
cd email-marketing-engine
```

#### Step 3: Install & Build

```bash
npm ci
npm run build
```

#### Step 4: Setup PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'email-marketing-engine',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
}
```

#### Step 5: Start Application

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Step 6: Setup Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Step 7: Setup SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ✅ Post-Deployment Verification

### 1. Health Checks

```bash
# Check overall health
curl https://yourdomain.com/api/email-marketing/health

# Expected: {"status":"healthy","timestamp":"..."}

# Check readiness
curl https://yourdomain.com/api/email-marketing/ready

# Check liveness
curl https://yourdomain.com/api/email-marketing/alive
```

### 2. Database Connectivity

```bash
# Verify database connection
psql $DATABASE_URL -c "SELECT COUNT(*) FROM payload_migrations"

# Expected: Number of migrations run
```

### 3. Redis Connectivity

```bash
# Verify Redis connection
redis-cli -u $REDIS_URL ping

# Expected: PONG
```

### 4. Listmonk API

```bash
# Verify Listmonk API
curl -u "$LISTMONK_USERNAME:$LISTMONK_PASSWORD" \
  "$LISTMONK_URL/api/health"

# Expected: {"status":"ok"}
```

### 5. Test Email Sending

```bash
# Send test campaign (via admin panel)
# Or use API:
curl -X POST "https://yourdomain.com/api/v1/email-marketing/subscribers" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "status": "subscribed"
  }'

# Expected: {"success":true,"data":{...}}
```

### 6. Monitor Logs

```bash
# Vercel
vercel logs --follow

# Docker
docker logs -f email-marketing-engine

# PM2
pm2 logs email-marketing-engine
```

### 7. Performance Test

```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com/api/health

# curl-format.txt:
# time_namelookup:  %{time_namelookup}\n
# time_connect:  %{time_connect}\n
# time_total:  %{time_total}\n

# Expected: < 200ms total time
```

---

## 🔄 Rollback Procedures

### Vercel Rollback

```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>

# Or via dashboard:
# 1. Go to deployments
# 2. Click "..." on previous deployment
# 3. Click "Promote to Production"
```

### Docker Rollback

```bash
# Stop current container
docker stop email-marketing-engine
docker rm email-marketing-engine

# Pull previous image
docker pull email-marketing-engine:previous-tag

# Start with previous image
docker run -d \
  --name email-marketing-engine \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  email-marketing-engine:previous-tag
```

### PM2 Rollback

```bash
# Stop application
pm2 stop email-marketing-engine

# Revert to previous git commit
git revert HEAD
# Or: git checkout previous-commit-hash

# Rebuild
npm ci
npm run build

# Restart
pm2 restart email-marketing-engine
```

### Database Rollback

```bash
# Restore from backup
pg_restore -h host -U user -d dbname backup_file.sql

# Or run reverse migration
npx payload migrate:down

# WARNING: This may cause data loss!
```

---

## 🔧 Troubleshooting

### Issue 1: Health Check Returns 503

**Symptom:**
```bash
curl https://yourdomain.com/api/email-marketing/health
# {"status":"unhealthy","components":{...}}
```

**Diagnosis:**
```bash
# Check which component is unhealthy
curl https://yourdomain.com/api/email-marketing/health | jq '.components'
```

**Solutions:**
- **Database unhealthy**: Check DATABASE_URL, verify connection
- **Redis unhealthy**: Check REDIS_URL, verify Redis server is running
- **Listmonk unhealthy**: Check LISTMONK_URL, verify credentials

---

### Issue 2: Database Migration Fails

**Symptom:**
```bash
npx payload migrate
# Error: Cannot connect to database
```

**Solutions:**
1. Check DATABASE_URL format:
   ```bash
   # Correct format:
   postgresql://user:password@host:5432/dbname?sslmode=require
   ```

2. Verify database exists:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

3. Check firewall/security groups allow connection

---

### Issue 3: High Memory Usage

**Symptom:**
```bash
pm2 status
# memory: 1.5GB (increasing)
```

**Solutions:**
1. Check for memory leaks in logs
2. Restart application:
   ```bash
   pm2 restart email-marketing-engine
   ```
3. Increase max_memory_restart in PM2 config
4. Scale horizontally (add more instances)

---

### Issue 4: Emails Not Sending

**Diagnosis:**
1. Check Listmonk connectivity:
   ```bash
   curl -u "$LISTMONK_USERNAME:$LISTMONK_PASSWORD" \
     "$LISTMONK_URL/api/health"
   ```

2. Check email events:
   ```sql
   SELECT * FROM email_events
   WHERE type = 'failed'
   ORDER BY created_at DESC
   LIMIT 10;
   ```

3. Check Listmonk logs

**Solutions:**
- Verify SMTP configuration in Listmonk
- Check SPF/DKIM/DMARC records
- Check Listmonk queue status

---

## 📚 Related Documentation

- [Operations Runbook](./OPERATIONS_RUNBOOK.md)
- [Monitoring & Alerting Guide](./MONITORING_AND_ALERTING_GUIDE.md)
- [Error Handling Guide](./ERROR_HANDLING_GUIDE.md)
- [Master Implementation Plan](./MASTER_IMPLEMENTATIEPLAN_v1.md)

---

**Need help?** Contact your DevOps team or refer to the troubleshooting section above.
