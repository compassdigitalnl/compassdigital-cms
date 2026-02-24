# 🚀 Server Deployment Playbook

**Complete productie deployment instructies voor Claude Server**

---

## 📋 Quick Reference

| Task | Command | Time |
|------|---------|------|
| Deploy single site | `bash scripts/deployment/safe-deploy.sh <site_dir> <db_name> <pm2_name>` | ~2-3 min |
| Deploy all sites | `bash scripts/deployment/deploy-all.sh` | ~4-5 min |
| Backup database | `node scripts/database/backup-db.mjs <db_name> [label]` | ~5-10 sec |
| Restore database | `node scripts/database/restore-db.mjs <backup_file> <db_name>` | ~10-30 sec |
| Check migrations | `node scripts/database/check-migrations.mjs <db_name>` | ~1 sec |

---

## 🎯 Part 1: Git Pull & Migration Setup

### Step 1: Navigate to Project

```bash
cd /home/ploi/cms.compassdigital.nl
```

### Step 2: Check Current State

```bash
# Check git status
git status

# Check current branch
git branch

# Check remote
git remote -v
```

**Expected Output:**
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

### Step 3: Fetch Latest Changes

```bash
# Fetch all remote changes
git fetch origin

# Show what will be pulled
git log HEAD..origin/main --oneline

# Show changed files
git diff HEAD origin/main --name-only
```

### Step 4: Check for New Migrations

```bash
# List migration files that will be added
git diff HEAD origin/main --name-only | grep "src/migrations"
```

**If new migrations exist:**
```
src/migrations/20260224_add_sprint10_blocks.ts
src/migrations/20260224_add_sprint10_blocks.json
```

### Step 5: Pull Changes

```bash
git pull origin main
```

**Expected Output:**
```
Updating abc1234..def5678
Fast-forward
 src/branches/shared/blocks/CallToAction/config.ts | 105 ++++++
 src/branches/shared/blocks/Services/Component.tsx | 135 +++++++
 ... (file list)
 N files changed, M insertions(+), K deletions(-)
```

---

## 🗄️ Part 2: Database Migrations

### Pre-Migration Checklist

```bash
# 1. Check database connection
psql postgresql://user:pass@host:port/database -c "SELECT 1"

# 2. Check Payload migration status
cd /home/ploi/cms.compassdigital.nl
npx payload migrate:status

# 3. Create backup
node scripts/database/backup-db.mjs client_<name> pre-migration-sprint10
```

### Migration Safety Check

```bash
# Run safety validator
node scripts/database/check-migrations.mjs client_<name>
```

**Exit codes:**
- `0` = **SAFE** - Migrations can run
- `1` = **DANGER** - Data exists without migration history (SKIP migrations!)
- `2` = **EMPTY** - New database, safe to migrate

**If exit code = 1 (DANGER):**
```bash
echo "⚠️ DANGER: Data exists without migration history!"
echo "Manual intervention required. DO NOT run migrations."
echo "Contact developer for manual schema alignment."
exit 1
```

**If exit code = 0 or 2 (SAFE):**
```bash
echo "✓ Safe to proceed with migrations"
```

### Run Migrations

```bash
cd /home/ploi/cms.compassdigital.nl

# Run migrations (auto-confirm prompts with 'yes')
yes | NODE_OPTIONS="--max-old-space-size=2048 --no-deprecation" npx payload migrate
```

**Expected Output:**
```
✓ Database migrations/20260224_add_sprint10_blocks.ts - UP
✓ All migrations complete
```

**If migrations fail:**
```bash
# 1. Check error logs
tail -50 /home/ploi/cms.compassdigital.nl/.next/standalone/logs/migrate.log

# 2. Restore backup
node scripts/database/restore-db.mjs \
    /home/ploi/backups/client_<name>-TIMESTAMP-pre-migration-sprint10.sql \
    client_<name>

# 3. Restart PM2
pm2 restart cms-compassdigital

# 4. Verify restoration
curl http://localhost:3020/api/health
```

---

## 📦 Part 3: Dependencies & Build

### Step 1: Update Dependencies

```bash
cd /home/ploi/cms.compassdigital.nl

# Install new/updated packages
npm install --legacy-peer-deps
```

**Expected Output:**
```
added 5 packages, removed 2 packages, changed 8 packages in 45s
```

### Step 2: TypeScript Check (Optional but Recommended)

```bash
# Quick TypeScript validation
npx tsc --noEmit --skipLibCheck
```

**If errors occur:**
```
src/some-file.ts:123:45 - error TS2322: Type 'X' is not assignable to type 'Y'
```

**Action:** Report to developer - DO NOT proceed with build if TypeScript errors exist.

### Step 3: Build Application

```bash
cd /home/ploi/cms.compassdigital.nl

# Build with increased memory (CMS builds are large)
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

**Expected Output (last lines):**
```
Route (app)                              Size
┌ ○ /                                    142 kB
├ ○ /admin                               234 kB
...
○  (Static)  prerendered as static content
✓ Compiled successfully in 53.2s
```

**Build time:** ~1-2 minutes for CMS

**If build fails:**
```bash
# Check error message
tail -100 /home/ploi/cms.compassdigital.nl/.next/trace

# Common issues:
# 1. Out of memory - increase NODE_OPTIONS memory
# 2. Missing dependencies - run npm install again
# 3. TypeScript errors - fix code first
```

---

## 🔄 Part 4: PM2 Restart & Verification

### Step 1: Restart PM2 Process

```bash
# Restart CMS process
pm2 restart cms-compassdigital --update-env
```

**Expected Output:**
```
[PM2] Applying action restartProcessId on app [cms-compassdigital](ids: [ 0 ])
[PM2] [cms-compassdigital](0) ✓
```

### Step 2: Wait for Startup

```bash
# Wait 10 seconds for app to boot
sleep 10

# Watch logs in real-time
pm2 logs cms-compassdigital --lines 20
```

**Expected log output:**
```
info: Payload initialized
info: Next.js started on port 3020
info: Database connected
```

### Step 3: Health Check

```bash
# Check health endpoint
curl -s http://localhost:3020/api/health | jq .
```

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-24T19:00:00.000Z",
  "checks": {
    "database": {
      "status": "connected",
      "latency": 12
    },
    "memory": {
      "used": 487,
      "total": 2048,
      "percentage": 23
    }
  }
}
```

### Step 4: Quick Smoke Tests

```bash
# 1. Homepage
curl -s -o /dev/null -w "%{http_code}" http://localhost:3020/
# Expected: 200

# 2. Admin panel
curl -s -o /dev/null -w "%{http_code}" http://localhost:3020/admin/
# Expected: 200

# 3. API endpoint
curl -s -o /dev/null -w "%{http_code}" http://localhost:3020/api/og?title=Test
# Expected: 200

# 4. Payload API
curl -s http://localhost:3020/api/globals/settings | jq '.siteName'
# Expected: "CompassDigital Platform"
```

### Step 5: PM2 Status Check

```bash
pm2 list
```

**Expected:**
```
┌─────┬──────────────────────┬─────────┬─────────┬─────────┬──────────┬────────┐
│ id  │ name                 │ mode    │ ↺      │ status  │ cpu      │ memory │
├─────┼──────────────────────┼─────────┼─────────┼─────────┼──────────┼────────┤
│ 0   │ cms-compassdigital   │ fork    │ 15      │ online  │ 0.3%     │ 487 MB │
└─────┴──────────────────────┴─────────┴─────────┴─────────┴──────────┴────────┘
```

**Status should be:** `online`

---

## ✅ Part 5: Post-Deployment Verification

### Checklist

- [ ] Git pull successful
- [ ] Migrations ran without errors
- [ ] Build completed successfully
- [ ] PM2 process restarted
- [ ] Health check returns `200`
- [ ] Admin panel accessible
- [ ] Homepage loads
- [ ] API endpoints working
- [ ] No errors in PM2 logs
- [ ] Database backup created

### Verification Commands

```bash
# Full verification script
cd /home/ploi/cms.compassdigital.nl

echo "=== Git Status ==="
git log -1 --oneline

echo "=== PM2 Status ==="
pm2 list | grep cms-compassdigital

echo "=== Health Check ==="
curl -s http://localhost:3020/api/health | jq '.status'

echo "=== Recent Logs ==="
pm2 logs cms-compassdigital --lines 5 --nostream

echo "=== Database Check ==="
psql $DATABASE_URL -c "SELECT COUNT(*) FROM pages" 2>/dev/null || echo "DB OK"

echo "=== Build Check ==="
ls -lh .next/standalone/server.js
```

### Post-Deployment Backup

```bash
# Create post-deployment backup
node scripts/database/backup-db.mjs client_cms post-deployment-sprint10
```

---

## 🚨 Part 6: Rollback Procedures

### If Something Goes Wrong

#### Scenario 1: Build Failed

```bash
# 1. Check error
npm run build 2>&1 | tail -50

# 2. Revert to previous commit
git log --oneline | head -5  # Find last good commit
git reset --hard <previous_commit_hash>

# 3. Rebuild
npm run build

# 4. Restart
pm2 restart cms-compassdigital
```

#### Scenario 2: Migrations Failed

```bash
# 1. Restore backup
node scripts/database/restore-db.mjs \
    /home/ploi/backups/client_cms-TIMESTAMP-pre-migration-sprint10.sql \
    client_cms

# 2. Revert code
git reset --hard <previous_commit_hash>

# 3. Rebuild & restart
npm run build
pm2 restart cms-compassdigital

# 4. Verify
curl http://localhost:3020/api/health
```

#### Scenario 3: Site Down After Deployment

```bash
# 1. Check PM2 logs
pm2 logs cms-compassdigital --lines 100

# 2. Restart PM2
pm2 restart cms-compassdigital

# 3. If still down, restore database
node scripts/database/restore-db.mjs <latest_backup> client_cms

# 4. Revert code
git reset --hard <previous_commit_hash>

# 5. Rebuild
npm run build && pm2 restart cms-compassdigital
```

---

## 📊 Part 7: Multi-Site Deployment

### Deploy All Client Sites

```bash
# Deploy all tenant sites in parallel
bash scripts/deployment/deploy-all.sh
```

**This script handles:**
1. Git pull for all sites (sequential)
2. npm install for all sites (sequential)
3. Database backups (sequential)
4. Migration safety checks (sequential)
5. Next.js builds (parallel, 3 at a time) ⚡
6. PM2 restarts (sequential)
7. Success/failure reporting

**Performance:**
- Sequential (old): ~10 minutes (7 sites × 80 sec)
- Parallel (new): ~4-5 minutes

**Sites included:**
- plastimed01.compassdigital.nl
- aboland01.compassdigital.nl
- beauty01.compassdigital.nl
- construction01.compassdigital.nl
- content01.compassdigital.nl
- horeca01.compassdigital.nl
- hospitality01.compassdigital.nl

### Deploy Single Client Site

```bash
# Safe deployment for one site
bash scripts/deployment/safe-deploy.sh \
    /home/ploi/plastimed01.compassdigital.nl \
    client_plastimed01 \
    plastimed01-cms
```

---

## 🔍 Part 8: Troubleshooting

### Common Issues

#### Issue: "Migration failed: relation already exists"

**Cause:** Migration already ran, or schema manually modified

**Solution:**
```bash
# Check migration status
npx payload migrate:status

# If migration shows as pending but table exists:
# Mark migration as complete manually (consult developer)
```

#### Issue: "Build failed: JavaScript heap out of memory"

**Solution:**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Issue: "PM2 process keeps restarting"

**Check:**
```bash
# View crash logs
pm2 logs cms-compassdigital --err --lines 50

# Common causes:
# 1. Database connection failed - check DATABASE_URL
# 2. Missing environment variable - check .env
# 3. Port already in use - check PORT
```

#### Issue: "Health check returns 500"

**Diagnose:**
```bash
# Check database connection
curl http://localhost:3020/api/health

# Check logs
pm2 logs cms-compassdigital --lines 50

# Test database directly
psql $DATABASE_URL -c "SELECT 1"
```

---

## 📝 Part 9: Maintenance Tasks

### Daily Backups

```bash
# Backup all databases
bash scripts/database/backup-all.sh
```

**Scheduled via cron (already configured):**
```cron
0 2 * * * /home/ploi/scripts/database/backup-all.sh
```

### Cleanup Old Backups

```bash
# Keep only last 30 days
find /home/ploi/backups -name "*.sql" -mtime +30 -delete
```

### Update Dependencies

```bash
# Check for updates (monthly)
npm outdated

# Update patch versions only (safe)
npm update

# Rebuild & restart
npm run build && pm2 restart cms-compassdigital
```

---

## 🎓 Part 10: Best Practices

### Pre-Deployment

1. **Always check git diff** before pulling
2. **Always backup** before migrations
3. **Always validate** migration safety
4. **Always test build** locally first (if possible)

### During Deployment

1. **Monitor logs** during PM2 restart
2. **Wait 10-15 seconds** for full startup
3. **Run health checks** immediately after
4. **Don't skip steps** - each is critical

### Post-Deployment

1. **Verify all endpoints** work
2. **Check PM2 logs** for errors
3. **Create post-deployment backup**
4. **Update deployment log** (optional but recommended)

### Emergency Procedures

1. **Don't panic** - backups exist
2. **Check logs first** - understand the problem
3. **Restore backup** if needed - it's quick
4. **Revert code** if migrations failed
5. **Contact developer** if unsure

---

## 📞 Support & Contact

### Logs Location

```
PM2 logs: ~/.pm2/logs/
Backups: /home/ploi/backups/
Build logs: /home/ploi/<domain>/.next/
Migration logs: /home/ploi/<domain>/migrations.log
```

### Quick Commands Cheat Sheet

```bash
# Status
pm2 status
pm2 logs <name> --lines 50

# Restart
pm2 restart <name>
pm2 reload <name>  # Zero-downtime restart

# Stop/Start
pm2 stop <name>
pm2 start <name>

# Monitoring
pm2 monit

# Save PM2 state
pm2 save

# List backups
ls -lht /home/ploi/backups/ | head -10
```

---

## ✨ Summary

This playbook covers:
- ✅ Complete Git pull procedure
- ✅ Safe database migration workflow
- ✅ Build & deployment steps
- ✅ PM2 management
- ✅ Health checks & verification
- ✅ Rollback procedures
- ✅ Multi-site deployment
- ✅ Troubleshooting guide
- ✅ Maintenance tasks
- ✅ Best practices

**Total deployment time:** ~2-5 minutes
**Rollback time:** ~1-2 minutes
**Zero-downtime:** ✓ (using PM2 reload)

---

**Generated:** 2026-02-24
**Version:** 1.0
**Last Updated:** Sprint 10 deployment
