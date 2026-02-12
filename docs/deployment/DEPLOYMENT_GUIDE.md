# Deployment Guide

Complete guide for deploying the SiteForge Business Website to production.

**Last updated:** 10 Februari 2026

---

## 🎯 Overview

This guide covers automated deployment using the built-in deployment script with:
- ✅ Pre-deploy validation (environment, TypeScript, build)
- ✅ Automated deployment to Vercel
- ✅ Health checks and verification
- ✅ Rollback capability
- ✅ Post-deploy monitoring

---

## 📋 Prerequisites

### 1. Production Environment

**Required:**
- PostgreSQL database (Railway/Supabase recommended)
- Vercel account (or alternative hosting)
- Domain name (optional but recommended)

**Recommended:**
- UptimeRobot account (monitoring)
- Sentry account (error tracking)
- Production API keys (OpenAI, Resend, reCAPTCHA, etc.)

### 2. Environment Variables

Create `.env.production` with production values:

```bash
# Core
PAYLOAD_SECRET="your-production-secret-min-32-chars"
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXT_PUBLIC_SERVER_URL="https://yourdomain.com"

# Email
RESEND_API_KEY="re_..."
CONTACT_EMAIL="contact@yourdomain.com"

# reCAPTCHA (Production keys)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-production-site-key"
RECAPTCHA_SECRET_KEY="your-production-secret-key"

# AI (Optional)
OPENAI_API_KEY="sk-..."

# Monitoring (Optional)
NEXT_PUBLIC_SENTRY_DSN="https://..."
NEXT_PUBLIC_GA_ID="G-..."

# Redis (Optional, for production scale)
REDIS_URL="redis://..."
```

### 3. Vercel Setup

**Install Vercel CLI:**
```bash
npm install -g vercel
```

**Login to Vercel:**
```bash
vercel login
```

**Link Project:**
```bash
vercel link
```

**Set Environment Variables:**
```bash
# Set all production environment variables in Vercel dashboard
# Or use CLI:
vercel env add PAYLOAD_SECRET production
vercel env add DATABASE_URL production
# ... repeat for all variables
```

---

## 🚀 Deployment Commands

### Quick Deploy

```bash
# Deploy to production (with full validation)
npm run deploy

# Deploy to staging
npm run deploy:staging

# Verify existing deployment
npm run deploy:verify
```

### Manual Steps

If you prefer manual deployment:

```bash
# 1. Validate everything first
npm run pre-build-check
npm run validate-env
npm run test

# 2. Build locally
npm run build

# 3. Deploy to Vercel
vercel --prod

# 4. Verify deployment
npm run deploy:verify
```

---

## 📊 Deployment Process

### Step 1: Pre-Deploy Validation

The script automatically checks:

**1. Environment Variables**
- ✅ All required variables present
- ✅ No test/dummy values in production
- ⚠️ Warns about SQLite (use PostgreSQL)

**2. Git Status**
- ✅ No uncommitted changes
- ✅ On main/master branch
- ✅ Clean working directory

**3. Dependencies**
- ✅ node_modules installed
- ✅ All packages up to date

**4. TypeScript**
- ✅ No compilation errors
- ✅ Type safety verified

**5. Linting**
- ✅ ESLint passes (warnings OK)

**6. Build Test**
- ✅ Production build succeeds
- ✅ No build errors

**If any check fails, deployment is aborted.**

### Step 2: Deployment

**Automated Process:**
1. Builds production bundle
2. Uploads to Vercel
3. Deploys to production/staging
4. Returns deployment URL

**Output:**
```bash
================================================================================
🚀 DEPLOYING TO PRODUCTION
================================================================================

Deploying to Vercel...
✓ Deployment successful
✓ Deployed to: https://yourdomain.com

================================================================================
```

### Step 3: Post-Deploy Verification

**Automated Health Checks:**

1. **Service Health**
   - Checks `/api/health` endpoint
   - Verifies database connectivity
   - Checks memory usage
   - Retries up to 3 times (30s timeout)

2. **Homepage Check**
   - Verifies homepage loads (200 status)
   - Checks accessibility

3. **API Check**
   - Tests OG image API
   - Verifies API endpoints working

**If verification fails:**
- Deployment marked as failed
- Consider rollback
- Check logs for errors

**Success Output:**
```bash
================================================================================
POST-DEPLOY VERIFICATION
================================================================================

✓ Service healthy! (latency: 45ms)
  Database: ok
  Memory: 12%
✓ Homepage accessible
✓ OG image API working

================================================================================
✓ DEPLOYMENT VERIFIED
================================================================================

🎉 DEPLOYMENT SUCCESSFUL!
URL: https://yourdomain.com
Time: 2026-02-10T15:00:00.000Z

Post-deploy checklist:
  [ ] Verify website in browser
  [ ] Check admin panel login
  [ ] Test contact form
  [ ] Verify UptimeRobot is monitoring
  [ ] Check error tracking (Sentry)
```

---

## 🔄 Rollback Procedure

If deployment fails or issues are discovered:

### Automatic Rollback (Vercel)

```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Manual Rollback

1. **Via Vercel Dashboard:**
   - Go to Deployments tab
   - Find last working deployment
   - Click "Promote to Production"

2. **Via Git:**
   ```bash
   # Revert to previous commit
   git revert HEAD
   git push origin main

   # Or reset to specific commit
   git reset --hard <commit-hash>
   git push --force origin main
   ```

3. **Emergency Rollback:**
   ```bash
   # Deploy previous git commit
   git checkout HEAD~1
   npm run deploy
   git checkout main
   ```

---

## 🔍 Troubleshooting

### Deployment Fails - Pre-Deploy Checks

**Problem:** TypeScript errors

**Solution:**
```bash
# Check errors
npx tsc --noEmit

# Fix errors in code
# Or add type ignores if unavoidable
// @ts-ignore

# Re-run deployment
npm run deploy
```

**Problem:** Build fails

**Solution:**
```bash
# Test build locally
npm run build

# Check build logs for errors
# Fix errors and retry

# Common issues:
# - Missing environment variables
# - Import errors
# - Type errors
```

**Problem:** Environment variables missing

**Solution:**
```bash
# Check which variables are required
npm run validate-env

# Set missing variables
echo "MISSING_VAR=value" >> .env.production

# Or set in Vercel dashboard
vercel env add MISSING_VAR production
```

### Deployment Fails - Vercel

**Problem:** Vercel authentication failed

**Solution:**
```bash
# Re-login to Vercel
vercel login

# Or set token manually
export VERCEL_TOKEN="your-token"
```

**Problem:** Build fails on Vercel

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Check Node.js version matches local
4. Verify all dependencies in package.json

**Problem:** Deployment timeout

**Solution:**
```bash
# Increase timeout in vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxDuration": 60
      }
    }
  ]
}
```

### Post-Deploy Issues

**Problem:** Health check fails

**Solution:**
```bash
# Check manually
curl https://yourdomain.com/api/health

# Common causes:
# - Database not accessible
# - Wrong DATABASE_URL
# - Firewall blocking connections

# Fix database connection
# Update DATABASE_URL in Vercel
vercel env add DATABASE_URL production

# Redeploy
npm run deploy
```

**Problem:** 500 errors on homepage

**Solution:**
1. Check Vercel logs: `vercel logs`
2. Check Sentry for errors
3. Verify database migrations ran
4. Check environment variables
5. Look for missing API keys

**Problem:** Admin panel not accessible

**Solution:**
```bash
# Verify admin route is not blocked
# Check /admin route exists
# Verify PAYLOAD_SECRET is set
# Check database connection

# Test admin login locally first
npm run dev
# Visit http://localhost:3020/admin
```

---

## 📈 Post-Deployment

### Immediate Actions (Within 5 minutes)

**1. Verify Core Functionality:**
```bash
# Homepage loads
curl -I https://yourdomain.com

# Health check OK
curl https://yourdomain.com/api/health

# Admin panel accessible
open https://yourdomain.com/admin
```

**2. Test Critical Features:**
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Content displays correctly

**3. Check Monitoring:**
- [ ] UptimeRobot is monitoring
- [ ] Sentry receiving events
- [ ] Google Analytics tracking (if enabled)

### Within 1 Hour

**1. Performance Check:**
```bash
# Run Lighthouse audit
npx lighthouse https://yourdomain.com --view

# Expected scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 95+
```

**2. SEO Verification:**
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify sitemap: `https://yourdomain.com/sitemap.xml`
- [ ] Check robots.txt: `https://yourdomain.com/robots.txt`
- [ ] Submit sitemap to Google Search Console

**3. Security Check:**
- [ ] SSL certificate valid
- [ ] Security headers present
- [ ] No console errors
- [ ] reCAPTCHA working on contact form

### Within 24 Hours

**1. Monitor Metrics:**
- Check error rates in Sentry
- Review performance metrics
- Monitor uptime (should be 100%)
- Check page load times

**2. User Testing:**
- Test on different devices
- Test on different browsers
- Have team members verify functionality

**3. Backup Verification:**
- Verify database backups are running
- Test backup restoration process
- Document backup schedule

---

## 🔧 Configuration

### Custom Deployment Script

Modify `src/scripts/deploy.ts` to customize:

**Change Timeouts:**
```typescript
const CONFIG = {
  healthcheck: {
    timeout: 60000,    // Increase to 60s
    retries: 5,        // More retries
    retryDelay: 10000, // Wait longer between retries
  },
}
```

**Add Custom Checks:**
```typescript
async function runCustomCheck(): Promise<boolean> {
  // Your custom validation
  log('Running custom check...', 'info')

  // Check something specific to your project
  const result = await yourCustomCheck()

  if (result) {
    log('Custom check passed', 'success')
    return true
  } else {
    log('Custom check failed', 'error')
    return false
  }
}

// Add to validation
async function runPreDeployChecks(): Promise<boolean> {
  // ... existing checks

  // Add custom check
  log('Running custom validation...', 'info')
  const customPassed = await runCustomCheck()
  if (!customPassed) allPassed = false

  // ... rest of checks
}
```

**Skip Certain Checks:**
```typescript
// Comment out checks you want to skip
async function runPreDeployChecks(): Promise<boolean> {
  // ... other checks

  // Skip linting check
  // log('Running ESLint...', 'info')
  // try {
  //   execCommand('npm run lint', true)
  //   log('Linting passed', 'success')
  // } catch (error) {
  //   log('Linting errors detected', 'warning')
  // }

  // ... rest of checks
}
```

### CI/CD Integration

The deployment script works seamlessly with GitHub Actions:

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Deploy to production
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
        run: npm run deploy
```

---

## 📚 Best Practices

### DO:

✅ **Always run pre-deploy checks**
```bash
npm run pre-build-check
npm run validate-env
npm run test
```

✅ **Test locally before deploying**
```bash
npm run build
npm run start
# Verify everything works
```

✅ **Deploy during low-traffic hours**
- Best time: Late evening or early morning
- Avoid peak business hours

✅ **Monitor deployment**
- Watch Vercel logs in real-time
- Check health endpoint immediately
- Verify critical features

✅ **Have rollback plan ready**
- Know how to rollback quickly
- Keep previous deployment URL handy
- Test rollback procedure beforehand

✅ **Communicate with team**
- Notify team before deployment
- Share deployment status
- Report any issues immediately

### DON'T:

❌ **Don't deploy with uncommitted changes**
```bash
# Always commit first
git status
git add .
git commit -m "Feature XYZ"
git push
```

❌ **Don't skip validation**
```bash
# Never do this:
vercel --prod --yes

# Always use deployment script:
npm run deploy
```

❌ **Don't deploy without testing**
```bash
# Always test first:
npm run build  # Must succeed
npm run test   # Must pass
npm run start  # Verify works
```

❌ **Don't ignore warnings**
- Fix warnings before deploying
- Warnings become errors in production
- Address all linting issues

❌ **Don't deploy on Friday**
- Avoid Friday deployments
- Issues may not be caught until Monday
- Deploy early in the week instead

---

## 🎯 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrated to latest schema
- [ ] All code committed and pushed
- [ ] On main/master branch
- [ ] No uncommitted changes
- [ ] Team notified of deployment
- [ ] Low-traffic time selected

### During Deployment

- [ ] Deployment script running
- [ ] Pre-deploy checks passed
- [ ] Build succeeded
- [ ] Upload completed
- [ ] Health checks passed
- [ ] Verification succeeded

### Post-Deployment

- [ ] Homepage loads correctly
- [ ] Admin panel accessible
- [ ] Contact form works
- [ ] API endpoints responding
- [ ] No console errors
- [ ] UptimeRobot monitoring
- [ ] Sentry tracking errors
- [ ] Lighthouse score acceptable (90+)
- [ ] SEO verified (Rich Results Test)
- [ ] Team notified of success
- [ ] Deployment documented

---

## 🚨 Emergency Procedures

### Site is Down

**1. Check Status:**
```bash
# Health check
curl https://yourdomain.com/api/health

# Check Vercel status
vercel ls
```

**2. Quick Fixes:**
```bash
# Restart deployment
vercel --prod

# Or rollback immediately
vercel rollback [previous-url]
```

**3. If still down:**
- Check Vercel status page
- Review error logs
- Contact Vercel support
- Put up maintenance page

### Database Issues

**1. Check Connection:**
```bash
# Test DATABASE_URL locally
psql $DATABASE_URL
```

**2. Common Fixes:**
- Verify DATABASE_URL in Vercel
- Check database server status
- Verify firewall allows connections
- Check connection pool limits

**3. Temporary Fix:**
```bash
# Switch to read-only mode
# Or use backup database
```

### Performance Issues

**1. Check Metrics:**
- Vercel Analytics dashboard
- Check response times
- Monitor memory usage

**2. Quick Fixes:**
- Enable caching
- Reduce bundle size
- Optimize images
- Add CDN

---

## 📞 Support

### Resources

- **Documentation:** `/docs`
- **Vercel Docs:** https://vercel.com/docs
- **Payload Docs:** https://payloadcms.com/docs

### Getting Help

1. Check deployment logs: `vercel logs`
2. Check health endpoint: `/api/health`
3. Review error tracking (Sentry)
4. Consult documentation
5. Contact support team

---

**🎉 Ready to deploy! Follow this guide for smooth deployments.**

**Last updated:** 10 Februari 2026
