# Sprint 9: Server Deployment Instructies

**Sprint:** 9 - E-commerce Cart & Checkout
**Deploy Date:** 22 Februari 2026
**Server:** Production (Ploi/VPS)

---

## 📋 Pre-Deployment Checklist

### 1. Verify Local Build ✅

```bash
# Run BEFORE deploying to server
npm run build
npm run typecheck

# Both commands must succeed without errors
```

**Expected Output:**
- Build: ✓ Compiled successfully
- Typecheck: No TypeScript errors

---

## 🚀 Server Deployment Steps

### Step 1: Pull Latest Code

```bash
# SSH into production server
ssh user@your-server.com

# Navigate to project directory
cd /path/to/payload-app

# Pull latest changes from GitHub
git pull origin main

# Verify you're on the latest commit
git log --oneline -3
# Should show:
# 36c9072 feat: Add A/B testing feature toggle and dependencies
# bc2ce22 feat: Add useABTest React hook for A/B testing
# 2609f90 feat: Sprint 9 - Complete E-commerce Cart & Checkout Flow
```

---

### Step 2: Install Dependencies

```bash
# Install new packages (uuid for A/B testing)
npm install

# This will install:
# - uuid: ^13.0.0
# - @types/uuid: ^10.0.0
```

**Important:** Verify that `uuid` package is installed correctly:
```bash
npm list uuid
# Should show: uuid@13.0.0
```

---

### Step 3: Run Database Migrations ⚠️ CRITICAL

```bash
# IMPORTANT: Backup database first!
# For PostgreSQL:
pg_dump -h your-db-host -U your-db-user -d your-db-name > backup-$(date +%Y%m%d).sql

# Run pending migrations
npx cross-env NODE_OPTIONS="--no-deprecation" payload migrate

# Expected output:
# ✓ Migration: 20260222_215225_add_ab_testing_collections
# ✓ Migration: 20260222_215445_update_settings_ecommerce_fields
```

**Migrations Applied:**

**Migration 1:** `add_ab_testing_collections`
- Creates table: `ab_tests`
- Creates table: `ab_tests_variants`
- Creates table: `ab_test_results`
- Adds indexes for performance

**Migration 2:** `update_settings_ecommerce_fields`
- Updates `settings` table
- Adds column: `enable_guest_checkout`
- Adds column: `require_b2b_approval`
- Updates `default_cart_template` options

**Verify Migrations:**
```bash
# Check that tables exist (PostgreSQL)
psql -h your-db-host -U your-db-user -d your-db-name -c "\dt ab_*"

# Should show:
# ab_tests
# ab_tests_variants
# ab_test_results
```

---

### Step 4: Environment Variables (Optional)

```bash
# Edit .env file
nano .env
```

**New Environment Variables (OPTIONAL):**

```bash
# A/B Testing Configuration
ENABLE_AB_TESTING=true                    # Enable A/B testing feature
AB_TEST_SESSION_DURATION=2592000000      # 30 days in milliseconds (default)

# Guest Checkout
ENABLE_GUEST_CHECKOUT=true               # Allow checkout without account
```

**Default Values:**
- If not set, A/B testing is **enabled** by default (new feature)
- Session duration defaults to 30 days
- Guest checkout can be toggled per-client in Settings

---

### Step 5: Build Production Bundle

```bash
# Build Next.js production bundle
npm run build

# This compiles:
# - All new cart templates (CartTemplate1, CartTemplate2)
# - Checkout flow (CheckoutTemplate2)
# - Login/Register (AuthTemplate)
# - A/B testing logic
# - Theme CSS variables
```

**Expected Output:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (150/150)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
├ ○ /                                    5.2 kB         120 kB
├ ○ /cart                                8.3 kB         135 kB  ← NEW
├ ○ /checkout                           12.1 kB         145 kB  ← NEW
├ ○ /login                              10.5 kB         138 kB  ← NEW
└ ○ /register                           10.5 kB         138 kB  ← NEW
```

**Build Time:** ~2-3 minutes (depending on server)

---

### Step 6: Restart Application

```bash
# If using PM2:
pm2 restart payload-app

# If using systemd:
sudo systemctl restart payload-app

# If using Ploi (via deploy script):
# Ploi will automatically restart after successful build
```

**Verify Restart:**
```bash
# Check application status
pm2 status
# OR
sudo systemctl status payload-app

# Should show: online/active (running)
```

---

### Step 7: Health Check Verification

```bash
# Test that application started successfully
curl https://your-domain.com/api/health

# Expected response:
{
  "status": "ok",
  "uptime": 123.45,
  "database": "connected",
  "timestamp": "2026-02-22T22:00:00.000Z"
}
```

**Additional Checks:**
```bash
# 1. Admin Panel
curl -I https://your-domain.com/admin
# Should return: HTTP/2 200

# 2. Cart Page
curl -I https://your-domain.com/cart
# Should return: HTTP/2 200

# 3. Login Page
curl -I https://your-domain.com/login
# Should return: HTTP/2 200

# 4. Checkout Page
curl -I https://your-domain.com/checkout
# Should return: HTTP/2 200
```

---

## 🧪 Post-Deployment Testing

### 1. Database Verification

```sql
-- Connect to database
psql -h your-db-host -U your-db-user -d your-db-name

-- Check A/B testing tables exist
SELECT COUNT(*) FROM ab_tests;
-- Expected: 0 (no tests created yet)

SELECT COUNT(*) FROM ab_test_results;
-- Expected: 0 (no results yet)

-- Check Settings global updated
SELECT default_cart_template, enable_guest_checkout, require_b2b_approval
FROM settings
LIMIT 1;
-- Expected: default values (template1, false, true)
```

---

### 2. Frontend Verification

**Test Cart Page:**
1. Visit: `https://your-domain.com/cart`
2. Verify: Page loads without errors
3. Check: Console shows A/B test assignment (if test is running)
4. Verify: Cart template renders correctly

**Test Login Page:**
1. Visit: `https://your-domain.com/login`
2. Verify: 3 tabs visible (Login | Register | Guest)
3. Click each tab, verify forms load
4. Check: Password strength indicator works

**Test Checkout:**
1. Add items to cart
2. Click "Afrekenen"
3. Verify: CheckoutSteps indicator shows (step 1→2→3→4)
4. Complete Step 2 (login or guest)
5. Select payment method (Step 3)
6. Verify: Order confirmation (Step 4)

---

### 3. A/B Testing Verification

**Create Test A/B Test:**
1. Login to admin: `https://your-domain.com/admin`
2. Navigate: E-commerce → A/B Tests
3. Create New:
   - Name: "Cart Template Test"
   - Target Page: cart
   - Status: running
   - Variants:
     - template1 (50%)
     - template2 (50%)
4. Save test

**Test Variant Assignment:**
```bash
# Visit cart page in incognito
curl -v https://your-domain.com/cart 2>&1 | grep -i "set-cookie"
# Should set: ab_session_id cookie

# Check variant assignment
curl -X POST https://your-domain.com/api/ab-test/assign \
  -H "Content-Type: application/json" \
  -d '{"testId": "YOUR_TEST_ID", "targetPage": "cart"}'

# Expected response:
{
  "variant": "template1",  // or "template2"
  "sessionId": "uuid-here"
}
```

**Verify Database Tracking:**
```sql
-- Check A/B test results created
SELECT * FROM ab_test_results
ORDER BY created_at DESC
LIMIT 5;

-- Should show new records with:
-- - test_id
-- - variant (template1 or template2)
-- - session_id
-- - converted = false (initially)
```

---

### 4. Theme Variables Verification

**Test Multi-Tenant Themes:**

**Option 1: Plastimed (Teal Theme)**
```bash
# Update layout to set data-client
# In src/app/(ecommerce)/layout.tsx:
<body data-client="plastimed">

# Rebuild and restart
npm run build && pm2 restart payload-app
```

**Option 2: Aboland (Blue Theme)**
```bash
# Update layout to set data-client
<body data-client="aboland">

# Rebuild and restart
npm run build && pm2 restart payload-app
```

**Verify Colors:**
- Visit any page
- Open DevTools → Inspect element
- Check `computed` CSS variables:
  - `--color-primary` should match client theme
  - Plastimed: `#00897b` (teal)
  - Aboland: `#1e40af` (blue)

---

## 🔧 Troubleshooting

### Issue 1: Migration Fails

**Error:** `Migration already applied`
```bash
# Check migration status
npx payload migrate:status

# If needed, rollback last migration
npx payload migrate:down

# Then re-run
npx payload migrate
```

---

### Issue 2: Build Fails

**Error:** `Module not found: uuid`
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Retry build
npm run build
```

---

### Issue 3: Cart Page 404

**Error:** `Page not found: /cart`

**Cause:** Route not generated during build

**Fix:**
```bash
# Check that file exists
ls -la src/app/\(ecommerce\)/cart/page.tsx

# If exists, rebuild
npm run build

# Check build output for /cart route
```

---

### Issue 4: A/B Test Not Assigning Variant

**Error:** No variant assigned, default template always shown

**Debug:**
```bash
# 1. Check test exists and is running
curl https://your-domain.com/api/ab-test/assign \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"targetPage": "cart"}'

# 2. Check database
psql -c "SELECT * FROM ab_tests WHERE status = 'running' AND target_page = 'cart';"

# 3. Check browser console
# Should see: "A/B Test assigned: template1" or similar
```

---

### Issue 5: Theme Colors Not Changing

**Error:** Colors stay default, data-client not working

**Debug:**
```bash
# 1. Check globals.css loaded
curl https://your-domain.com/_next/static/css/app/*.css | grep "data-client"

# 2. Verify body attribute in browser
# DevTools → Elements → <body>
# Should have: data-client="plastimed" or "aboland"

# 3. Check CSS variable
# DevTools → Computed → Filter: "--color-primary"
```

---

## 📊 Monitoring

### What to Monitor After Deploy

**1. Error Tracking:**
```bash
# Check server logs for errors
pm2 logs payload-app --lines 100

# Look for:
# - Migration errors
# - Database connection issues
# - A/B test assignment failures
```

**2. Performance:**
```bash
# Monitor page load times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com/cart

# Expected:
# - Time to first byte: <500ms
# - Total time: <2s
```

**3. Database Performance:**
```sql
-- Check A/B test query performance
EXPLAIN ANALYZE
SELECT * FROM ab_test_results
WHERE test_id = 1 AND session_id = 'uuid-here';

-- Should use index, execution time <10ms
```

**4. A/B Test Metrics:**
```sql
-- Daily report: Variant performance
SELECT
  variant,
  COUNT(*) as participants,
  SUM(CASE WHEN converted THEN 1 ELSE 0 END) as conversions,
  ROUND(100.0 * SUM(CASE WHEN converted THEN 1 ELSE 0 END) / COUNT(*), 2) as conversion_rate
FROM ab_test_results
WHERE test_id = YOUR_TEST_ID
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY variant;
```

---

## 🎯 Success Criteria

Deployment is successful when:

- ✅ All migrations applied without errors
- ✅ Application restarted successfully
- ✅ `/cart` page loads correctly
- ✅ `/login` page shows 3 tabs
- ✅ `/checkout` page shows 4-step flow
- ✅ A/B test can be created in admin
- ✅ Variant assignment works
- ✅ Theme variables apply correctly
- ✅ No errors in server logs
- ✅ Database queries perform well (<10ms for indexed lookups)

---

## 📝 Rollback Procedure (Emergency)

If deployment fails and you need to rollback:

```bash
# 1. Rollback Git
git log --oneline -5  # Find previous commit
git reset --hard PREVIOUS_COMMIT_HASH

# 2. Rollback Migrations
npx payload migrate:down  # Run twice (2 migrations)

# 3. Reinstall dependencies
npm ci  # Use exact versions from package-lock

# 4. Rebuild
npm run build

# 5. Restart
pm2 restart payload-app

# 6. Restore database backup (if needed)
psql -h host -U user -d dbname < backup-20260222.sql
```

---

## 📞 Support

**Issues During Deployment?**

1. **Check Logs:**
   - Application: `pm2 logs payload-app`
   - Database: Check PostgreSQL logs
   - Build: `npm run build` output

2. **Review Documentation:**
   - `IMPLEMENTATION_PLAN.md` - Technical architecture
   - `THEME_VARIABLES_GUIDE.md` - Theme system
   - `SPRINT_9_COMPLETION_REPORT.md` - Feature overview

3. **Common Fixes:**
   - Clear cache: `rm -rf .next`
   - Reinstall: `rm -rf node_modules && npm ci`
   - Hard restart: `pm2 restart payload-app --update-env`

---

## ✅ Deployment Checklist Summary

```
Pre-Deployment:
[ ] npm run build (locally)
[ ] npm run typecheck (locally)
[ ] Backup database

Deployment:
[ ] SSH into server
[ ] git pull origin main
[ ] npm install
[ ] Backup database (again!)
[ ] npx payload migrate
[ ] npm run build
[ ] pm2 restart payload-app

Verification:
[ ] Health check (curl /api/health)
[ ] Cart page loads
[ ] Login page loads (3 tabs)
[ ] Checkout page loads (4 steps)
[ ] A/B test can be created
[ ] Theme variables work
[ ] No errors in logs

Monitoring:
[ ] Check error logs (24h)
[ ] Monitor performance (48h)
[ ] Track A/B test metrics (ongoing)
```

---

**Deployment Duration:** ~15-20 minutes
**Risk Level:** Medium (database migrations + new features)
**Rollback Time:** ~5-10 minutes

🚀 **Ready to deploy!**
