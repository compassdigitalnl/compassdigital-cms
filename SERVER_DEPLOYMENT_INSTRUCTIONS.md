# 🚀 SERVER DEPLOYMENT INSTRUCTIONS

**Datum:** 24 Februari 2026
**Branch:** `refactor/architecture-2026`
**Status:** ✅ Klaar voor deployment
**Impact:** 🔴 Major - Complete architectuur herstructurering

---

## 📋 EXECUTIVE SUMMARY

Complete herstructurering van routes en componenten ter voorbereiding op design conversie:
- **Fase 3:** Ecommerce routes herstructurering + WooCommerce-style routing
- **Fase 4:** Component migratie van shared naar ecommerce
- **Fase 5:** Shared directory cleanup

**Key Changes:**
- 🔄 95 files changed
- 🆕 WooCommerce-style product URLs (`/product-naam` direct onder root)
- 📁 15+ componenten verplaatst naar ecommerce branch
- 🗑️ Duplicate routes & unused components verwijderd
- ✅ 3x build succesvol getest - 0 errors

---

## ⚠️ CRITICAL CHANGES - MUST KNOW

### 1. Route Changes (Breaking URLs!)

**Account Routes:**
```
VOOR: /my-account/*
NU:   /account/*
```
→ **Impact:** Bookmarks/external links naar `/my-account` werken niet meer
→ **Fix:** Redirects toevoegen (zie "Post-Deployment" sectie)

**Auth Routes:**
```
VOOR: /register, /login (verspreid)
NU:   /auth/register, /auth/login, /auth/forgot-password, /auth/logout
```
→ **Impact:** Auth links moeten ge-update worden
→ **Fix:** Alle links zijn al ge-update in codebase ✅

**Order Lookup:**
```
VOOR: /find-order
NU:   /orders/find
```

### 2. Product URLs (WooCommerce-style) 🔥 CRITICAL

**[slug]/page.tsx Prioriteit GEWIJZIGD:**
```typescript
VOOR: 1. CMS Pages → 2. Products → 3. Categories
NU:   1. Products → 2. Categories → 3. CMS Pages
```

**Product URLs nu direct onder root:**
```
VOOR: /shop/product-naam
NU:   /product-naam
```

**Rationale:** Voorkomt dat CMS page "laptop" product "laptop" blokkeert!

### 3. Component Locations Changed

**Van shared → ecommerce verplaatst:**
- `MiniCart` → `@/branches/ecommerce/components/ui/MiniCart`
- `StaffelCalculator` → `@/branches/ecommerce/components/ui/StaffelCalculator`
- `CheckoutForm` → `@/branches/ecommerce/components/forms/CheckoutForm`
- `LoginForm` → `@/branches/ecommerce/components/forms/LoginForm`
- `AccountForm` → `@/branches/ecommerce/components/forms/AccountForm`
- En 10+ andere componenten

→ **Impact:** Alle imports zijn al automatisch ge-update ✅

### 4. Templates Verplaatst

**ProductTemplates:**
```
VOOR: src/app/(ecommerce)/shop/[slug]/ProductTemplate1.tsx
NU:   src/branches/ecommerce/components/templates/products/ProductTemplate1/index.tsx
```

---

## 📦 DEPLOYMENT STEPS - EXACT INSTRUCTIONS

### Step 1: Pre-Deployment Checks (5 min)

```bash
# 1. Check huidige branch
git branch
# Expected: Should be on main or production branch

# 2. Check git status is clean
git status
# Expected: "nothing to commit, working tree clean"

# 3. Backup huidige state (optioneel maar aanbevolen)
git tag backup-pre-refactor-$(date +%Y%m%d-%H%M%S)
```

### Step 2: Pull Refactor Branch (2 min)

```bash
# 1. Fetch alle remote branches
git fetch origin

# 2. Checkout refactor branch
git checkout refactor/architecture-2026

# 3. Pull latest changes
git pull origin refactor/architecture-2026

# 4. Verify je bent op de juiste branch
git branch
# Expected: * refactor/architecture-2026
```

### Step 3: Install Dependencies (3 min)

```bash
# 1. Clean install (aanbevolen voor major changes)
rm -rf node_modules package-lock.json
npm install

# OF gewoon update (sneller):
npm install

# 2. Verify geen errors in dependencies
npm list --depth=0
```

### Step 4: Build Test (2 min)

```bash
# 1. Run production build
npm run build

# Expected output:
# - ✓ Compiled successfully
# - 0 errors
# - Route list showing /account/*, /auth/*, etc.

# 2. Als build FAALT:
#    - Check error messages
#    - Verify node_modules installed correctly
#    - Check .env file is present and correct
```

### Step 5: Database Migrations (1 min)

```bash
# Check of er nieuwe migraties zijn
npx payload migrate:status

# Als er pending migrations zijn:
npx payload migrate

# Expected: "All migrations up to date" of "Successfully ran X migrations"
```

### Step 6: Start Server (1 min)

```bash
# Development mode (voor testing):
npm run dev

# OF Production mode:
npm run build
npm run start

# Verify server starts zonder errors
# Expected: Server running on http://localhost:3020
```

### Step 7: Verification Tests (10 min)

**Test deze routes handmatig:**

1. **Account Routes:**
   - Visit: `http://localhost:3020/account`
   - Should show: Account dashboard
   - Test: `/account/orders`, `/account/addresses`, `/account/settings`

2. **Auth Routes:**
   - Visit: `http://localhost:3020/auth/login`
   - Should show: Login form
   - Test: `/auth/register`, `/auth/forgot-password`

3. **Product URLs (CRITICAL!):**
   - Visit any product (bijv: `http://localhost:3020/laptop`)
   - Should show: Product detail page (NOT 404, NOT CMS page!)
   - Verify: Product loads BEFORE CMS page with same slug

4. **Shop Archive:**
   - Visit: `http://localhost:3020/shop`
   - Should show: All products overview

5. **Order Lookup:**
   - Visit: `http://localhost:3020/orders/find`
   - Should show: Find order form

**Expected Results:**
- ✅ All routes load without 404 errors
- ✅ Product pages prioritized over CMS pages
- ✅ Account dashboard shows user info (if logged in)
- ✅ No console errors in browser

### Step 8: Merge to Main/Production (5 min)

**ONLY if all tests pass!**

```bash
# 1. Switch to main branch
git checkout main

# 2. Merge refactor branch
git merge refactor/architecture-2026

# 3. Push to production
git push origin main

# 4. Tag release
git tag v2.0.0-refactor-complete
git push origin v2.0.0-refactor-complete
```

### Step 9: Restart Production Server

```bash
# If using PM2:
pm2 restart payload-app

# If using systemd:
sudo systemctl restart payload-app

# If using Docker:
docker-compose restart

# Verify server restarted successfully
pm2 status
# OR
sudo systemctl status payload-app
```

---

## 🔧 POST-DEPLOYMENT ACTIONS

### 1. Add Redirects (CRITICAL for SEO!)

**Add these redirects to prevent 404s:**

```typescript
// In next.config.js or middleware.ts:

const redirects = [
  // Account redirects
  {
    source: '/my-account/:path*',
    destination: '/account/:path*',
    permanent: true, // 301 redirect
  },

  // Auth redirects
  {
    source: '/register',
    destination: '/auth/register',
    permanent: true,
  },
  {
    source: '/login',
    destination: '/auth/login',
    permanent: true,
  },
  {
    source: '/forgot-password',
    destination: '/auth/forgot-password',
    permanent: true,
  },

  // Order redirects
  {
    source: '/find-order',
    destination: '/orders/find',
    permanent: true,
  },
]
```

**Implementation:**

```bash
# Edit next.config.js
nano next.config.js

# Add redirects array to module.exports:
module.exports = {
  // ... existing config
  async redirects() {
    return [
      // ... paste redirects from above
    ]
  },
}

# Save and restart server
pm2 restart payload-app
```

### 2. Update Google Search Console (for SEO)

1. Login to Google Search Console
2. Go to: **URL Inspection Tool**
3. Submit new URLs for indexing:
   - `/account`
   - `/auth/login`
   - `/auth/register`
   - `/orders/find`
4. Request re-crawl for changed URLs

### 3. Update External Links (if any)

Check en update externe links naar:
- `/my-account` → `/account`
- `/register` → `/auth/register`
- `/find-order` → `/orders/find`

**Locations to check:**
- Email templates
- External documentation
- Third-party integrations
- Marketing materials

---

## 🚨 ROLLBACK PROCEDURE (Als iets fout gaat)

### Quick Rollback (2 min)

```bash
# 1. Switch terug naar main
git checkout main

# 2. Hard reset naar vorige commit
git reset --hard HEAD~1

# 3. Force push (ONLY in emergency!)
git push origin main --force

# 4. Restart server
pm2 restart payload-app
```

### Safe Rollback (5 min)

```bash
# 1. Create revert commit (beter voor git history)
git checkout main
git revert HEAD

# 2. Push revert
git push origin main

# 3. Restart server
pm2 restart payload-app
```

### Rollback to Backup Tag

```bash
# 1. List backup tags
git tag | grep backup

# 2. Checkout backup tag
git checkout backup-pre-refactor-YYYYMMDD-HHMMSS

# 3. Create new branch from backup
git checkout -b rollback-branch

# 4. Push en deploy rollback branch
git push origin rollback-branch

# 5. Restart server met rollback code
pm2 restart payload-app
```

---

## 📊 VERIFICATION CHECKLIST

**Before marking deployment as complete, verify:**

- [ ] **Build succeeds:** `npm run build` completes without errors
- [ ] **Server starts:** No crashes on startup
- [ ] **Account routes work:** `/account`, `/account/orders`, `/account/settings`
- [ ] **Auth routes work:** `/auth/login`, `/auth/register`, `/auth/forgot-password`
- [ ] **Product URLs prioritized:** Product pages load before CMS pages with same slug
- [ ] **Shop archive works:** `/shop` shows all products
- [ ] **Order lookup works:** `/orders/find` shows find order form
- [ ] **Redirects configured:** Old URLs redirect to new URLs (301)
- [ ] **No 404 errors:** All expected routes return 200 status
- [ ] **No console errors:** Browser console clean on all pages
- [ ] **Database OK:** Migrations ran successfully
- [ ] **Performance OK:** Page load times acceptable (<3s)

**Optional but recommended:**
- [ ] Google Search Console updated
- [ ] External links updated
- [ ] Monitoring alerts configured
- [ ] Backup created
- [ ] Team notified of changes

---

## 📝 WHAT CHANGED - DETAILED BREAKDOWN

### Routes Changed

**Ecommerce Routes:**
```
my-account/              → account/               (hernoemd)
register/                → auth/register/         (verplaatst + hernoemd)
login/                   → auth/login/            (al bestaand)
forgot-password/         → auth/forgot-password/  (verplaatst)
logout/                  → auth/logout/           (verplaatst)
find-order/              → orders/find/           (verplaatst)
```

**Deleted Routes (nu via CMS):**
```
(shared)/toast-demo/              → VERWIJDERD (demo)
(shared)/algemene-voorwaarden/    → VERWIJDERD (via CMS als /privacy, etc.)
(shared)/privacy/                 → VERWIJDERD (via CMS)
(shared)/verzending-retour/       → VERWIJDERD (via CMS)
```

**Deleted Routes (duplicates):**
```
(shared)/account/                 → VERWIJDERD (basic versie)
(shared)/(account)/               → VERWIJDERD (route group leeg)
(ecommerce)/register/             → VERWIJDERD (dubbel met auth/register)
```

### Components Moved

**UI Components (shared → ecommerce):**
- `components/ui/MiniCart/`
- `components/ui/StaffelCalculator/`

**Feature Components (shared → ecommerce):**
- `components/features/account/`
- `components/features/ecommerce/`

**Form Components (shared → ecommerce):**
- `components/forms/CheckoutForm/`
- `components/forms/FindOrderForm/`
- `components/forms/AccountForm/`
- `components/forms/CreateAccountForm/`
- `components/forms/ForgotPasswordForm/`
- `components/forms/LoginForm/`

**Shop Component (shared → ecommerce):**
- `components/shop/`

**Templates Moved:**
```
app/(ecommerce)/shop/[slug]/ProductTemplate1.tsx
  → branches/ecommerce/components/templates/products/ProductTemplate1/index.tsx

app/(ecommerce)/shop/[slug]/ProductTemplate2.tsx
  → branches/ecommerce/components/templates/products/ProductTemplate2/index.tsx

app/(ecommerce)/shop/[slug]/ProductTemplate3.tsx
  → branches/ecommerce/components/templates/products/ProductTemplate3/index.tsx
```

### Files Statistics

```
95 files changed
337 insertions(+)
4764 deletions(-)

Breakdown:
- 8 routes moved/renamed
- 15+ components migrated
- 200+ imports auto-updated
- 6 directories deleted
- 1 empty directory removed
- 5 unused components removed
```

---

## 🔍 TROUBLESHOOTING

### Problem: Build fails with "Module not found"

**Possible causes:**
1. node_modules not installed correctly
2. Import path not updated correctly

**Fix:**
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problem: Route returns 404

**Possible causes:**
1. Server not restarted after deployment
2. Next.js build cache issue

**Fix:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
pm2 restart payload-app
```

### Problem: "Cannot find module '@/branches/shared/components/ui/MiniCart'"

**Cause:** Import not updated from shared to ecommerce

**Fix:**
```bash
# Search for old imports
grep -r "@/branches/shared/components/ui/MiniCart" src/

# Should return 0 results. If not, update manually to:
# @/branches/ecommerce/components/ui/MiniCart
```

### Problem: Product page shows CMS page instead

**Cause:** [slug]/page.tsx prioriteit nog niet correct

**Fix:**
```bash
# Check src/app/[slug]/page.tsx
# Verify order is: 1. Products, 2. Categories, 3. CMS Pages
# If not, re-pull branch:
git checkout refactor/architecture-2026
git pull origin refactor/architecture-2026
```

### Problem: Redirects not working

**Cause:** next.config.js not updated or server not restarted

**Fix:**
```bash
# Check next.config.js has redirects array
cat next.config.js | grep -A 5 "redirects"

# If missing, add redirects (see Post-Deployment section)
# Then restart:
pm2 restart payload-app
```

---

## 📞 SUPPORT & CONTACT

**If deployment fails or issues occur:**

1. **Check logs:**
   ```bash
   # PM2 logs
   pm2 logs payload-app --lines 100

   # System logs
   journalctl -u payload-app -n 100
   ```

2. **Check build output:**
   ```bash
   npm run build 2>&1 | tee build.log
   # Send build.log for analysis
   ```

3. **Create GitHub issue:**
   - Repository: `ai-sitebuilder/payload-app`
   - Label: `deployment`, `refactor`
   - Include: Error logs, steps taken, environment info

4. **Emergency rollback:**
   - See "ROLLBACK PROCEDURE" section above
   - Document what went wrong for future reference

---

## 📚 ADDITIONAL RESOURCES

**Documentation:**
- Complete refactor details: `REFACTOR_MASTERPLAN.md`
- Architecture decisions: See commit message in git log
- Component locations: See "WHAT CHANGED" section above

**Testing:**
- Build test results: 3x successful
- Route verification: See "Step 7: Verification Tests"
- Manual testing checklist: See "VERIFICATION CHECKLIST"

**Key Files to Review:**
- `src/app/[slug]/page.tsx` - Product/CMS/Category prioriteit
- `src/app/(ecommerce)/layout.tsx` - Ecommerce route group
- `src/branches/ecommerce/components/` - Component locations
- `next.config.js` - Redirects configuration (post-deployment)

---

## ✅ DEPLOYMENT SIGN-OFF

**Before closing this deployment:**

- [ ] All verification tests passed
- [ ] Server running stable for 30+ minutes
- [ ] No error logs in PM2/systemd
- [ ] Redirects configured and tested
- [ ] External links updated (if any)
- [ ] Team notified of deployment
- [ ] Backup tag created
- [ ] Documentation updated
- [ ] Google Search Console updated (optional)

**Deployed by:** _________________
**Date:** _________________
**Time:** _________________
**Server:** _________________

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

---

**🎉 END OF DEPLOYMENT INSTRUCTIONS**

**For questions or issues, refer to REFACTOR_MASTERPLAN.md or create a GitHub issue.**

Generated with Claude Code on 24 February 2026
