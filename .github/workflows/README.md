# GitHub Actions Workflows

Complete CI/CD automation for SiteForge - ensuring quality, security, and reliable deployments!

**Last updated:** 10 February 2026

---

## 📋 Overview

This directory contains 3 automated workflows:

1. **CI Pipeline** (`ci.yml`) - Runs on every push/PR
2. **Deployment** (`deploy.yml`) - Automated production & staging deployments  
3. **Scheduled Checks** (`scheduled.yml`) - Daily security audits & health checks

---

## 🔄 CI Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**

### 1. Validate (5-10 min)
- ✅ Environment variables validation
- ✅ Dependencies check
- ✅ npm audit

### 2. Lint (2-5 min)
- ✅ ESLint code quality checks
- ✅ Code formatting validation (Prettier)

### 3. TypeCheck (2-5 min)
- ✅ TypeScript compilation check
- ✅ Payload type generation

### 4. Build (5-10 min)
- ✅ Pre-build validation hooks
- ✅ Next.js production build
- ✅ Build artifacts upload

### 5. Test (10-15 min)
- ✅ Integration tests (Vitest)
- ✅ E2E tests (Playwright)
- ✅ Test report upload

### 6. Security (2-5 min)
- ✅ npm audit for vulnerabilities
- ✅ Security report generation

### Total Duration: ~25-50 minutes

**Required GitHub Secrets:**
```bash
PAYLOAD_SECRET          # Payload CMS secret key
DATABASE_URL            # PostgreSQL connection string
NEXT_PUBLIC_SERVER_URL  # Production URL
OPENAI_API_KEY          # OpenAI API key (optional)
```

---

## 🚀 Deployment (`deploy.yml`)

**Triggers:**
- Automatic: Push to `main` branch → Production
- Manual: Workflow dispatch (staging/production choice)

**Jobs:**

### Deploy to Production
**When:** Push to `main`
- ✅ Vercel CLI deployment
- ✅ Production environment variables
- ✅ Health check verification
- ✅ Deployment URL output

### Deploy to Staging
**When:** Manual workflow dispatch
- ✅ Preview deployment
- ✅ Staging environment variables
- ✅ Health check (non-blocking)

### Notifications
- ✅ Deployment status summary
- ✅ Success/failure notifications
- ⚠️ Optional: Slack integration (add webhook)

**Required GitHub Secrets:**
```bash
VERCEL_TOKEN            # Vercel deployment token
VERCEL_ORG_ID          # Vercel organization ID
VERCEL_PROJECT_ID      # Vercel project ID
```

**Setup Instructions:**

1. **Get Vercel Token:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login and get token
   vercel login
   vercel whoami
   ```
   
   Go to: https://vercel.com/account/tokens → Create new token

2. **Get Vercel IDs:**
   ```bash
   # Link project
   vercel link
   
   # Get IDs from .vercel/project.json
   cat .vercel/project.json
   ```

3. **Add to GitHub Secrets:**
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

---

## 📅 Scheduled Checks (`scheduled.yml`)

**Triggers:**
- Daily at 2:00 AM UTC
- Manual workflow dispatch

**Jobs:**

### 1. Security Audit (5-10 min)
- ✅ npm audit for vulnerabilities
- ✅ Critical/high severity alerts
- ✅ Audit report artifacts (90 days retention)

### 2. Dependency Check (2-5 min)
- ✅ Check for outdated packages
- ✅ Version comparison report
- ✅ Update recommendations

### 3. Health Check (1-2 min)
- ✅ Production endpoint health
- ✅ Response time monitoring
- ✅ Alerts for slow responses (>3s)

### 4. Build Health (5-10 min)
- ✅ TypeScript compilation verification
- ✅ Test build process
- ✅ Early detection of build issues

### 5. License Check (2-5 min)
- ✅ Dependency license scanning
- ✅ Compliance verification
- ✅ License report artifacts

### Total Duration: ~15-32 minutes (daily)

**Configuration:**

Update production URL in `scheduled.yml`:
```yaml
PRODUCTION_URL: "https://yourdomain.com"
```

---

## 🔧 Setup Guide

### 1. Enable GitHub Actions

Workflows are automatically enabled when pushed to GitHub.

### 2. Configure Secrets

Required secrets in GitHub repository settings:

**Core Secrets:**
```bash
PAYLOAD_SECRET              # Min 32 characters
DATABASE_URL                # PostgreSQL connection string
NEXT_PUBLIC_SERVER_URL      # https://yourdomain.com
```

**Deployment Secrets:**
```bash
VERCEL_TOKEN               # From vercel.com/account/tokens
VERCEL_ORG_ID             # From .vercel/project.json
VERCEL_PROJECT_ID         # From .vercel/project.json
```

**Optional Secrets:**
```bash
OPENAI_API_KEY            # For AI features
RESEND_API_KEY            # For email
CONTACT_EMAIL             # Contact form recipient
FROM_EMAIL                # Email sender
NEXT_PUBLIC_RECAPTCHA_SITE_KEY   # Spam protection
RECAPTCHA_SECRET_KEY      # Server-side verification
NEXT_PUBLIC_GA_ID         # Google Analytics
NEXT_PUBLIC_SENTRY_DSN    # Error tracking
```

### 3. Configure Environments

**Production Environment:**
- Go to: Repository → Settings → Environments
- Create environment: `production`
- Add protection rules:
  - ✅ Required reviewers (optional)
  - ✅ Wait timer (optional)
  - ✅ Deployment branches: `main` only

**Staging Environment:**
- Create environment: `staging`
- Less restrictive rules for faster iteration

---

## 📊 Workflow Status Badges

Add to your README.md:

```markdown
[![CI Pipeline](https://github.com/yourusername/yourrepo/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/yourrepo/actions/workflows/ci.yml)

[![Deploy](https://github.com/yourusername/yourrepo/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/yourrepo/actions/workflows/deploy.yml)

[![Scheduled Checks](https://github.com/yourusername/yourrepo/actions/workflows/scheduled.yml/badge.svg)](https://github.com/yourusername/yourrepo/actions/workflows/scheduled.yml)
```

---

## 🐛 Troubleshooting

### CI Pipeline Failures

**Build Fails:**
- Check environment variables are set correctly
- Verify DATABASE_URL is accessible from GitHub Actions
- Review build logs for specific errors

**Tests Fail:**
- Playwright: Ensure browsers are installed (`npx playwright install`)
- Server timeout: Increase wait time in workflow
- Database: Check test database connection

**TypeScript Errors:**
- Run `npm run generate:types` locally
- Commit generated types if needed
- Check for missing type definitions

### Deployment Failures

**Vercel Deployment Fails:**
- Verify VERCEL_TOKEN is valid
- Check VERCEL_ORG_ID and VERCEL_PROJECT_ID
- Ensure project is linked: `vercel link`

**Health Check Fails:**
- Verify `/api/health` endpoint exists
- Check production URL is correct
- Allow more time for deployment (increase sleep)

### Scheduled Check Failures

**Health Check Fails:**
- Update production URL in `scheduled.yml`
- Verify production is actually running
- Check DNS/SSL configuration

**Security Audit Fails:**
- Review npm audit output
- Address critical vulnerabilities first
- Update `audit-level` threshold if needed

---

## 📈 Performance & Costs

### GitHub Actions Minutes

**Free tier:** 2,000 minutes/month (public repos = unlimited)

**Estimated usage:**
- CI Pipeline: ~40 min/run × 10 runs/day = 400 min/day
- Deployment: ~5 min/run × 3 deploys/day = 15 min/day
- Scheduled: ~25 min/run × 1 run/day = 25 min/day

**Total:** ~440 minutes/day = ~13,200 min/month

**Optimization tips:**
- Use caching for dependencies (already enabled)
- Skip tests on documentation-only changes
- Run scheduled checks less frequently

---

## 🔒 Security Best Practices

✅ **Never commit secrets** - Use GitHub Secrets only
✅ **Limit secret access** - Use environment-specific secrets
✅ **Audit workflow changes** - Review PRs that modify workflows
✅ **Use dependabot** - Auto-update GitHub Actions versions
✅ **Principle of least privilege** - Grant minimal permissions

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [npm audit Documentation](https://docs.npmjs.com/cli/v9/commands/npm-audit)

---

## 🎯 Next Steps

1. ✅ Workflows created
2. ⏳ Configure GitHub Secrets
3. ⏳ Setup Vercel integration
4. ⏳ Configure production environment
5. ⏳ Test workflows with push to develop
6. ⏳ Monitor first production deployment

---

**Created:** 10 February 2026  
**Status:** ✅ Ready for use
