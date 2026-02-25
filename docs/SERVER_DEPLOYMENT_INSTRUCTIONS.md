# 🚀 Server Deployment Instructions - Fase 8 Complete

**Datum:** 25 Februari 2026
**Status:** ✅ Production Ready - Fase 8 Complete (100%)
**Git Commit:** `2201e40` - feat: Complete Fase 8 - Production-Ready Email Marketing Engine

---

## 📋 Quick Overview

**Wat is er nieuw in deze push:**
- ✅ Load Testing (3 k6 scripts + guide)
- ✅ Security Audit (3 test suites + audit script + guide)
- ✅ Monitoring & Alerting (health endpoints + Sentry + guide)
- ✅ Comprehensive Documentation (5 nieuwe guides, 8000+ lines)
- ✅ Production scripts (health monitoring, security audit)

**Total Changes:**
- 21 files changed
- 8,651 insertions
- ~9,600 lines production code
- ~13,000 lines documentation

---

## 🔄 STAP 1: Pull Laatste Code van Git

```bash
# SSH naar je server
ssh user@your-server.com

# Navigeer naar project directory
cd /path/to/payload-app

# Stash eventuele lokale wijzigingen (als nodig)
git stash

# Haal laatste code op
git fetch origin main
git pull origin main

# Controleer dat je op de juiste commit zit
git log -1 --oneline
# Verwacht: 2201e40 feat: Complete Fase 8 - Production-Ready Email Marketing Engine
```

**Verifieer dat je de nieuwe bestanden hebt:**
```bash
ls -la docs/mail-engine/
# Moet bevatten:
# - DEPLOYMENT_GUIDE.md
# - ERROR_HANDLING_GUIDE.md
# - LOAD_TESTING_GUIDE.md
# - MONITORING_AND_ALERTING_GUIDE.md
# - OPERATIONS_RUNBOOK.md
# - SECURITY_AUDIT_GUIDE.md

ls -la tests/load/
# Moet bevatten:
# - subscribers.test.js
# - health-endpoints.test.js
# - webhooks.test.js

ls -la tests/security/
# Moet bevatten:
# - sql-injection.test.ts
# - xss.test.ts
# - csrf.test.ts
```

---

## 📦 STAP 2: Dependencies Installeren

```bash
# Installeer nieuwe dependencies (als er nieuwe zijn)
npm install
# Of met pnpm:
pnpm install

# Controleer of alle scripts beschikbaar zijn
npm run | grep test:security
npm run | grep test:load
npm run | grep security:audit
```

**Nieuwe NPM scripts die nu beschikbaar zijn:**
```json
{
  "test:security": "All security tests",
  "test:security:sql": "SQL injection tests",
  "test:security:xss": "XSS tests",
  "test:security:csrf": "CSRF tests",
  "security:audit": "Complete security audit",
  "test:load": "All load tests",
  "test:load:subscribers": "Subscribers load test",
  "test:load:health": "Health endpoints load test",
  "test:load:webhooks": "Webhooks load test"
}
```

---

## 🔧 STAP 3: Environment Variables Setup

**Controleer of je de volgende environment variables hebt:**

```bash
# Bekijk je huidige .env
cat .env

# Of check welke missing zijn
npm run validate-env
```

**Required voor Production:**
```bash
# Core
PAYLOAD_SECRET=<strong-secret-32-chars>
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com

# Redis (for rate limiting)
REDIS_URL=redis://default:password@redis-host:6379

# Listmonk (for email sending)
LISTMONK_API_URL=https://listmonk.yourdomain.com
LISTMONK_API_KEY=<your-listmonk-api-key>

# Webhook Security
WEBHOOK_SIGNING_SECRET=<strong-secret-32-chars>

# Monitoring (optional maar aanbevolen)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

**Genereer sterke secrets:**
```bash
# Voor PAYLOAD_SECRET en WEBHOOK_SIGNING_SECRET
openssl rand -base64 32
```

---

## 🗄️ STAP 4: Database Migration

**Draai alle pending migrations:**
```bash
# Check welke migrations er pending zijn
npx payload migrate:status

# Draai alle migrations
npx payload migrate

# Verifieer dat alle tabellen bestaan
# Voor PostgreSQL:
psql $DATABASE_URL -c "\dt"
# Moet o.a. bevatten:
# - email_subscribers
# - email_campaigns
# - email_lists
# - email_templates
# - email_events
# - email_api_keys
# - email_queue_jobs
```

**Als er fouten zijn:**
```bash
# Check de migration files
ls -la src/migrations/

# Draai specifieke migration (vervang met je filename)
npx payload migrate --file src/migrations/20260224_XXXXXX_your_migration.ts
```

---

## 🏗️ STAP 5: Build de Applicatie

```bash
# Clean build
rm -rf .next

# Build (zonder pre-build check als die problemen geeft)
npm run build

# Of met pre-build validation:
npm run pre-build-check && npm run build
```

**Verwacht output:**
- ✅ TypeScript compilation successful
- ✅ Next.js build successful
- ✅ Payload types generated
- ✅ No build errors

**Als er TypeScript errors zijn:**
```bash
# Check specifieke errors
npm run validate-email-types

# Fix dan de fouten en build opnieuw
```

---

## 🧪 STAP 6: Run Tests (Optioneel maar Aanbevolen)

### Security Tests
```bash
# Run alle security tests (vereist Jest setup)
npm run test:security

# Of individueel
npm run test:security:sql
npm run test:security:xss
npm run test:security:csrf

# Run security audit
npm run security:audit
```

**Verwacht resultaat:**
- ✅ All tests pass (groen)
- ✅ No critical security issues
- ✅ Audit report saved to `security-audit-report.json`

### Load Tests (Vereist k6)
```bash
# Installeer k6 (als nog niet geïnstalleerd)
# macOS:
brew install k6
# Linux:
sudo apt-get install k6

# Run load tests (tegen lokale server of staging)
BASE_URL=http://localhost:3020 npm run test:load

# Of individueel
k6 run tests/load/subscribers.test.js
k6 run tests/load/health-endpoints.test.js
k6 run tests/load/webhooks.test.js
```

---

## 🚀 STAP 7: Start/Restart de Server

### Met PM2 (Aanbevolen voor Productie)

```bash
# Als PM2 nog niet geïnstalleerd
npm install -g pm2

# Start (eerste keer)
npm run pm2:start

# Of restart (als al draait)
npm run pm2:restart

# Check status
npm run pm2:status

# Bekijk logs
npm run pm2:logs

# Save PM2 configuratie (voor auto-restart bij reboot)
pm2 save
pm2 startup  # Volg de instructies
```

**PM2 Commands Reference:**
```bash
pm2 list              # Alle processen
pm2 logs payload-app  # Live logs
pm2 stop payload-app  # Stop applicatie
pm2 restart payload-app  # Restart applicatie
pm2 delete payload-app   # Verwijder van PM2
```

### Met Systemd (Alternatief)

Als je systemd gebruikt:
```bash
sudo systemctl restart payload-app
sudo systemctl status payload-app
sudo journalctl -u payload-app -f  # Live logs
```

### Direct (Development/Testing)

```bash
# Development mode
npm run dev

# Production mode (direct)
npm run start
```

---

## ✅ STAP 8: Verificatie & Health Checks

### 1. Check dat de applicatie draait

```bash
# Check of de poort luistert (3020 of 3000)
netstat -tulpn | grep :3020

# Of met lsof
lsof -i :3020

# Check PM2 status
pm2 list
```

### 2. Test Health Endpoints

```bash
# Health check
curl http://localhost:3020/api/email-marketing/health | jq

# Verwacht output:
# {
#   "status": "healthy",
#   "components": {
#     "database": { "status": "healthy", ... },
#     "redis": { "status": "healthy", ... },
#     "listmonk": { "status": "healthy", ... },
#     ...
#   }
# }

# Readiness probe
curl http://localhost:3020/api/email-marketing/ready
# Verwacht: 200 OK

# Liveness probe
curl http://localhost:3020/api/email-marketing/alive
# Verwacht: 200 OK

# Metrics endpoint (vereist API key)
curl http://localhost:3020/api/email-marketing/metrics \
  -H "Authorization: Bearer YOUR_API_KEY" | jq
```

### 3. Test API Endpoints

```bash
# Test subscribers endpoint (vereist API key)
curl http://localhost:3020/api/v1/email-marketing/subscribers \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"

# Verwacht: 200 OK met lijst van subscribers (of lege array)
```

### 4. Check Logs

```bash
# PM2 logs
pm2 logs payload-app --lines 100

# Check for errors
pm2 logs payload-app --err

# Systemd logs (als je systemd gebruikt)
sudo journalctl -u payload-app -n 100

# Next.js logs
tail -f .next/trace
```

---

## 🔒 STAP 9: Security Hardening (Production)

### 1. Run Security Audit

```bash
npm run security:audit

# Check de output voor critical issues
# Report wordt opgeslagen in: security-audit-report.json
```

### 2. Firewall Setup

```bash
# Allow alleen noodzakelijke poorten
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 22/tcp    # SSH
sudo ufw enable

# Block directe toegang tot applicatie poort (alleen via reverse proxy)
# Applicatie draait op localhost:3020
```

### 3. Reverse Proxy Setup (Nginx/Apache)

**Nginx configuratie voorbeeld:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect naar HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL certificaten
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3020;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL/TLS Certificaten

```bash
# Installeer Certbot (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx

# Verkrijg certificaat
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is standaard geconfigureerd
# Test renewal:
sudo certbot renew --dry-run
```

---

## 📊 STAP 10: Monitoring Setup

### 1. Setup UptimeRobot (Gratis)

1. Ga naar https://uptimerobot.com
2. Maak account aan
3. Add Monitor:
   - Type: HTTP(S)
   - URL: https://yourdomain.com/api/email-marketing/health
   - Interval: 5 minutes
4. Setup alerts (email, SMS, Slack)

### 2. Setup Sentry (Error Tracking)

```bash
# Al geconfigureerd in code, alleen environment variable nodig:
export NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project

# Rebuild en restart
npm run build
pm2 restart payload-app
```

### 3. Setup Cron Jobs

```bash
# Edit crontab
crontab -e

# Add health monitoring (elk uur)
0 * * * * cd /path/to/payload-app && NODE_OPTIONS="--no-deprecation --import=tsx/esm" npx tsx src/scripts/cron/health-monitoring.ts >> /var/log/payload-health.log 2>&1

# Add email reconciliation (elke 6 uur)
0 */6 * * * cd /path/to/payload-app && NODE_OPTIONS="--no-deprecation --import=tsx/esm" npx tsx src/scripts/cron/email-reconciliation.ts >> /var/log/payload-reconciliation.log 2>&1
```

### 4. Log Rotation

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/payload-app

# Add:
/var/log/payload-*.log {
    daily
    missingok
    rotate 90
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## 🆘 STAP 11: Troubleshooting

### Applicatie start niet

```bash
# Check PM2 logs
pm2 logs payload-app --err

# Common issues:
# 1. Port already in use
sudo lsof -i :3020
# Kill het proces of wijzig poort in .env

# 2. Database connection failed
# Controleer DATABASE_URL
# Test handmatig:
psql $DATABASE_URL -c "SELECT 1"

# 3. Missing dependencies
rm -rf node_modules
npm install
```

### Build Errors

```bash
# Clear all caches
rm -rf .next
rm -rf node_modules
npm install
npm run build

# TypeScript errors
npm run validate-email-types
# Fix fouten en rebuild
```

### Health Check Fails

```bash
# Check welk component faalt
curl http://localhost:3020/api/email-marketing/health | jq

# Database issues
# - Check DATABASE_URL
# - Check database is running
# - Run migrations: npx payload migrate

# Redis issues
# - Check REDIS_URL
# - Check Redis is running:
redis-cli -u $REDIS_URL ping

# Listmonk issues
# - Check LISTMONK_API_URL en LISTMONK_API_KEY
# - Test handmatig:
curl $LISTMONK_API_URL/api/health
```

### Performance Issues

```bash
# Run load tests om bottlenecks te vinden
npm run test:load

# Check resource usage
htop
# of
pm2 monit

# Check database slow queries
# PostgreSQL:
psql $DATABASE_URL -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10"

# Check Redis memory
redis-cli -u $REDIS_URL INFO memory
```

---

## 📚 STAP 12: Lees de Documentatie

**Alle nieuwe guides zijn beschikbaar in `docs/mail-engine/`:**

1. **DEPLOYMENT_GUIDE.md** (1500+ lines)
   - Complete deployment procedures
   - Platform-specific guides (Vercel, Docker, VPS)
   - Rollback procedures

2. **MONITORING_AND_ALERTING_GUIDE.md** (1000+ lines)
   - Health checks configuratie
   - Metrics collection
   - Alert setup (Email, Slack, PagerDuty)
   - Sentry integration
   - Prometheus/Grafana setup

3. **SECURITY_AUDIT_GUIDE.md** (2500+ lines)
   - Security testing procedures
   - OWASP Top 10 coverage
   - Remediation procedures
   - Compliance requirements (GDPR, PCI DSS, SOC 2)

4. **LOAD_TESTING_GUIDE.md** (1500+ lines)
   - k6 setup en usage
   - Performance benchmarks
   - Optimization recommendations

5. **ERROR_HANDLING_GUIDE.md** (1200+ lines)
   - Error types en retry strategies
   - Dead letter queue
   - Exponential backoff

6. **OPERATIONS_RUNBOOK.md** (1500+ lines)
   - Daily operations
   - Incident response (P1-P4)
   - Maintenance procedures
   - Emergency contacts

**Read deze guides voor complete instructies!**

---

## ✅ Production Readiness Checklist

Voor je live gaat, controleer:

- [ ] **Code**
  - [ ] Latest code pulled from git (commit `2201e40`)
  - [ ] Dependencies installed
  - [ ] Build successful
  - [ ] All tests passing

- [ ] **Environment**
  - [ ] All required env vars set
  - [ ] Secrets are strong (32+ chars)
  - [ ] Database URL uses SSL
  - [ ] Redis configured

- [ ] **Database**
  - [ ] All migrations run
  - [ ] Database backup configured
  - [ ] Connection pooling setup

- [ ] **Security**
  - [ ] Security audit passes
  - [ ] HTTPS enforced
  - [ ] Firewall configured
  - [ ] Rate limiting active

- [ ] **Monitoring**
  - [ ] Health checks working
  - [ ] Sentry configured
  - [ ] UptimeRobot setup
  - [ ] Cron jobs configured
  - [ ] Log rotation setup

- [ ] **Performance**
  - [ ] Load tests passed
  - [ ] Redis cache working
  - [ ] CDN configured (if applicable)

- [ ] **Documentation**
  - [ ] Team trained on operations runbook
  - [ ] Incident response procedures known
  - [ ] Emergency contacts updated

---

## 🎉 Je bent klaar!

**Fase 8 is 100% compleet en production-ready!**

### Quick Commands Reference

```bash
# Deployment
git pull origin main
npm install
npx payload migrate
npm run build
pm2 restart payload-app

# Health Check
curl http://localhost:3020/api/email-marketing/health

# Security
npm run security:audit

# Load Testing
npm run test:load

# Monitoring
pm2 logs payload-app
pm2 monit
```

### Support

- **Guides:** `docs/mail-engine/`
- **Issues:** Check logs first, then consult OPERATIONS_RUNBOOK.md
- **Emergency:** Follow incident response procedures in OPERATIONS_RUNBOOK.md

---

**Laatste Update:** 25 Februari 2026
**Status:** ✅ Production Ready
**Git Commit:** `2201e40`
