# Complete Deployment Instructions for Claude Server

**Project:** SiteForge - Payload 3.0 Multi-Tenant SaaS Platform
**Status:** 100% Production Ready - Vertical Slice Architecture Implemented
**Last Updated:** 2026-02-21
**Author:** Claude Code

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Environment Setup](#environment-setup)
4. [Database Setup & Migrations](#database-setup--migrations)
5. [Build & Development](#build--development)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

---

## 🚀 Quick Start

```bash
# 1. Clone and install dependencies
git clone <repository-url>
cd payload-app
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your credentials

# 3. Setup database (PostgreSQL recommended for production)
npm run payload migrate

# 4. Start development server
npm run dev
# Open http://localhost:3020

# 5. Access admin panel
# http://localhost:3020/admin
```

---

## 🏗️ Architecture Overview

### Vertical Slice Architecture

The project is organized into **vertical slices** (branches) by industry domain:

```
src/
├── branches/                    # Industry-specific feature branches
│   ├── ecommerce/              # E-commerce features
│   │   └── collections/        # Products, Orders, Cart, etc.
│   ├── content/                # Content management
│   │   └── collections/        # Blog, FAQ, Pages, etc.
│   ├── marketplace/            # Marketplace features (optional)
│   │   └── collections/        # Vendors, Listings, etc.
│   ├── shared/                 # Shared across all branches
│   │   └── collections/        # Users, Media, Settings, etc.
│   └── platform/               # Multi-tenant platform management
│       ├── collections/        # Clients, Deployments, etc.
│       └── index.ts            # Branch metadata
│
├── app/                        # Next.js App Router
│   ├── (ecommerce)/           # E-commerce routes
│   ├── (content)/             # Content routes
│   ├── (shared)/              # Auth, legal, account
│   ├── (platform)/            # Platform admin
│   ├── (payload)/             # CMS admin panel
│   ├── api/                   # API routes
│   └── [slug]/                # Dynamic pages
│
├── collections/               # DEPRECATED - Symlinks removed
│   └── [branch-name]/        # Collections moved to src/branches/
│
└── payload.config.ts          # Payload CMS configuration
```

### Key Changes (Feb 2026)

**✅ Completed Migration:**
- Collections moved from `src/collections/` → `src/branches/{branch}/collections/`
- Platform collections moved from `src/platform/collections/` → `src/branches/platform/collections/`
- App routes reorganized from `(app)/(frontend)` → `(ecommerce)/(content)/(shared)`
- All imports updated to absolute paths (`@/access/utilities`)
- All symlinks removed
- 106 files restructured, 100% build success

**Route Groups:**
- `(ecommerce)` - Shop, cart, checkout, my-account, vendors
- `(content)` - Blog, FAQ, brands
- `(shared)` - Auth, legal pages, account, search
- `(platform)` - Multi-tenant management
- `(payload)` - CMS admin panel

---

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env` file in the project root. Use `.env.example` as a template:

```bash
# === CORE CONFIGURATION ===
NODE_ENV=development
NEXT_PUBLIC_SERVER_URL=http://localhost:3020
PAYLOAD_SECRET=your-32-character-secret-key-here

# === DATABASE ===
# Development (SQLite)
DATABASE_URL=file:./payload.db

# Production (PostgreSQL - REQUIRED for production!)
# DATABASE_URL=postgresql://user:password@host:5432/database

# === AUTHENTICATION ===
JWT_SECRET=your-jwt-secret-key-here
SESSION_SECRET=your-session-secret-key

# === OPENAI (Required for AI features) ===
OPENAI_API_KEY=sk-your-openai-api-key

# === EMAIL (Resend) ===
RESEND_API_KEY=re_your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# === RECAPTCHA ===
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key

# === STRIPE (Optional - for payments) ===
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# === ANALYTICS (Optional) ===
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# === REDIS (Optional - for caching) ===
REDIS_URL=redis://localhost:6379

# === PLOI (Platform deployment) ===
PLOI_API_TOKEN=your-ploi-api-token
PLOI_SERVER_ID=your-server-id

# === RAILWAY (Alternative deployment) ===
RAILWAY_API_TOKEN=your-railway-token
```

### Validate Environment

```bash
# Check if all required variables are set
npm run validate-env

# Expected output:
# ✓ All required environment variables are set
# ✓ Database connection successful
# ✓ OpenAI API key valid
```

---

## 💾 Database Setup & Migrations

### Development (SQLite)

SQLite is used by default for development. No additional setup needed:

```bash
# Create database and run migrations
npm run dev
# Database auto-creates at ./payload.db

# Or manually run migrations
npm run payload migrate
```

### Production (PostgreSQL)

**⚠️ IMPORTANT:** PostgreSQL is **REQUIRED** for production deployments.

#### Option 1: Railway (Recommended)

```bash
# 1. Create Railway account: https://railway.app
# 2. Create new project → Add PostgreSQL
# 3. Copy DATABASE_URL from Railway dashboard
# 4. Update .env:
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway

# 5. Run migrations
npm run payload migrate

# 6. Verify connection
npm run payload migrate:status
```

#### Option 2: Supabase

```bash
# 1. Create Supabase account: https://supabase.com
# 2. Create new project
# 3. Go to Settings → Database → Connection string
# 4. Copy "Connection string" (Transaction mode)
# 5. Update .env:
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# 6. Run migrations
npm run payload migrate
```

#### Option 3: Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql@15  # macOS
# or download from https://postgresql.org/download/

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb siteforge_production

# Update .env
DATABASE_URL=postgresql://localhost:5432/siteforge_production

# Run migrations
npm run payload migrate
```

### Database Migration Commands

```bash
# Show migration status
npm run payload migrate:status

# Run pending migrations
npm run payload migrate

# Create new migration
npm run payload migrate:create

# Rollback last migration (CAUTION!)
npm run payload migrate:down

# Fresh migration (DANGER - drops all data!)
npm run payload migrate:fresh
```

### Multi-Tenant Database Strategy

For the **platform** (cms.compassdigital.nl), each client gets their own database:

```bash
# Platform database (main)
DATABASE_URL=postgresql://user:pass@host:5432/platform_main

# Client databases (provisioned automatically)
# client_plastimed01, client_acme_corp, etc.

# See: src/lib/provisioning/ProvisioningService.ts
```

**Automatic provisioning** creates:
1. Database: `client_{slug}`
2. Payload instance on subdomain
3. Runs migrations
4. Seeds initial data

---

## 🔨 Build & Development

### Development Server

```bash
# Start dev server (port 3020)
npm run dev

# With custom port
PORT=3000 npm run dev

# With verbose logging
DEBUG=* npm run dev
```

**Dev Server URLs:**
- Frontend: http://localhost:3020
- Admin Panel: http://localhost:3020/admin
- Platform Admin: http://localhost:3020/platform
- API Health: http://localhost:3020/api/health
- GraphQL Playground: http://localhost:3020/api/graphql-playground

### Production Build

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Pre-build validation (RECOMMENDED!)
npm run validate-env

# Build for production
npm run build

# Start production server
npm run start
```

### Build Verification Checklist

Before deploying, ensure:

```bash
# ✅ 1. Environment validation passes
npm run validate-env

# ✅ 2. TypeScript compiles without errors
npm run typecheck

# ✅ 3. Linting passes
npm run lint

# ✅ 4. Build succeeds
npm run build

# ✅ 5. Migrations applied
npm run payload migrate:status

# ✅ 6. Health check responds
curl http://localhost:3020/api/health
# Expected: {"status":"healthy","database":"connected"}
```

---

## 🧪 Testing

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all tests
npm run test:e2e

# Run specific test file
npm run test:e2e tests/e2e/frontend.e2e.spec.ts

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Generate test report
npm run test:e2e:report
```

**Test Coverage:**
- ✅ API endpoints (health, OG, contact)
- ✅ Frontend (pages, navigation, forms, mobile)
- ✅ Admin panel (dashboard, collections)
- ✅ Cross-browser (Chrome, Firefox, Safari, Mobile)

**Test Files:**
- `tests/e2e/api.e2e.spec.ts` - API tests (13 tests)
- `tests/e2e/frontend.e2e.spec.ts` - Frontend tests (15 tests)
- `tests/e2e/admin.e2e.spec.ts` - Admin tests (5 tests)

### Integration Tests

```bash
# Run integration tests (when added)
npm run test

# Run with coverage
npm run test:coverage
```

### Manual Testing Checklist

```bash
# 1. Homepage loads
curl -I http://localhost:3020
# Expected: 200 OK

# 2. Admin panel accessible
curl -I http://localhost:3020/admin
# Expected: 200 OK

# 3. API health check
curl http://localhost:3020/api/health
# Expected: {"status":"healthy"}

# 4. GraphQL API
curl http://localhost:3020/api/graphql -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"{ Products(limit: 1) { docs { id title } } }"}'
# Expected: JSON with products

# 5. OG image generation
curl -I "http://localhost:3020/api/og?title=Test"
# Expected: 200 OK, Content-Type: image/png
```

---

## 🚀 Production Deployment

### Deployment Options

#### Option 1: Vercel (Recommended for Frontend)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Add environment variables
vercel env add PAYLOAD_SECRET
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_SERVER_URL
# ... add all variables from .env

# 5. Deploy to staging
vercel

# 6. Deploy to production
vercel --prod
```

**Vercel Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "env": {
    "PAYLOAD_SECRET": "@payload-secret",
    "DATABASE_URL": "@database-url"
  }
}
```

#### Option 2: Railway (Full-Stack)

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Link to GitHub (automatic deployments)
railway up

# 5. Add environment variables (Railway dashboard)
# Project → Variables → Add all from .env

# 6. Deploy
railway up
```

#### Option 3: Ploi (VPS)

The platform uses **Ploi** for client deployments:

```bash
# Automatic provisioning via Platform Admin
# See: src/lib/ploi/PloiService.ts

# Manual deployment:
# 1. Setup Ploi account
# 2. Connect server
# 3. Create site
# 4. Deploy via Git push
```

### Automated Deployment Script

```bash
# Pre-deploy validation + Vercel deployment
npm run deploy

# Deploy to staging
npm run deploy:staging

# Verify deployment
npm run deploy:verify
```

**See:** `src/scripts/deploy.ts` for complete deployment automation.

### Post-Deployment Checklist

```bash
# ✅ 1. Health check
curl https://yourdomain.com/api/health

# ✅ 2. Admin panel loads
curl -I https://yourdomain.com/admin

# ✅ 3. Database connected
# Check logs for "Database connected successfully"

# ✅ 4. Environment variables set
# Verify in hosting provider dashboard

# ✅ 5. Migrations applied
# Check production logs

# ✅ 6. HTTPS enabled
curl -I https://yourdomain.com
# Expected: 200 OK, not 301 redirect

# ✅ 7. DNS configured
nslookup yourdomain.com

# ✅ 8. SSL certificate valid
curl -v https://yourdomain.com 2>&1 | grep "SSL certificate verify"
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Fails - Module Not Found

```bash
# Symptom
Module not found: Can't resolve '@/access/utilities'

# Solution
# Check tsconfig.json has correct path mappings
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# Clear Next.js cache
rm -rf .next
npm run build
```

#### 2. Database Connection Failed

```bash
# Symptom
Error: Database connection failed

# Solution 1: Check DATABASE_URL format
# PostgreSQL: postgresql://user:pass@host:5432/db
# SQLite: file:./payload.db

# Solution 2: Test connection manually
npm run payload migrate:status

# Solution 3: Check firewall/network
psql $DATABASE_URL -c "SELECT 1;"
```

#### 3. Port Already in Use

```bash
# Symptom
Error: Port 3020 already in use

# Solution
lsof -ti:3020 | xargs kill -9
npm run dev
```

#### 4. Payload Admin 404

```bash
# Symptom
Admin panel returns 404 at /admin

# Solution
# Check payload.config.ts routes.admin
export default buildConfig({
  routes: {
    admin: '/admin',
  },
})

# Rebuild
npm run build
```

#### 5. Migration Errors

```bash
# Symptom
Error: Migration "xxx" failed

# Solution 1: Check migration status
npm run payload migrate:status

# Solution 2: Rollback and retry
npm run payload migrate:down
npm run payload migrate

# Solution 3: Fresh migration (DANGER - loses data!)
# Backup first!
npm run payload migrate:fresh
```

#### 6. TypeScript Errors After Restructure

```bash
# Symptom
Cannot find module '@/collections/Products'

# Solution
# Update imports to use new branch structure
# Old: import { Products } from '@/collections/Products'
# New: import { Products } from '@/branches/ecommerce/collections/Products'

# Or update payload.config.ts to re-export
```

#### 7. CSS Import Errors

```bash
# Symptom
Module not found: Can't resolve '../../styles/theme-utilities.css'

# Solution
# Check relative paths after route reorganization
# src/app/globals.css should import:
@import '../styles/theme-utilities.css';
# Not: ../../styles/theme-utilities.css
```

### Debug Commands

```bash
# Check environment
npm run validate-env

# Check database
npm run payload migrate:status

# Check build
npm run typecheck
npm run lint
npm run build

# Check server
npm run dev
curl http://localhost:3020/api/health

# Check logs
# Development
npm run dev 2>&1 | tee dev.log

# Production (Vercel)
vercel logs

# Production (Railway)
railway logs
```

---

## 🛠️ Maintenance

### Regular Maintenance Tasks

#### Weekly
```bash
# Update dependencies
npm update

# Security audit
npm audit
npm audit fix

# Run tests
npm run test:e2e

# Check logs
# Review error logs, performance metrics
```

#### Monthly
```bash
# Update major dependencies
npm outdated
npm update --save

# Database cleanup
# Check for orphaned records, optimize

# Review monitoring
# UptimeRobot, Sentry, analytics
```

#### Quarterly
```bash
# Major version updates
npm outdated
# Review breaking changes, test thoroughly

# Security hardening review
# docs/SECURITY_HARDENING_GUIDE.md

# Performance optimization
# Review build size, page load times
```

### Backup Strategy

#### Database Backups

```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20260221.sql

# Automated backups (Railway)
# Automatic daily backups included

# Automated backups (Supabase)
# Automatic daily backups included
```

#### Code Backups

```bash
# Git backup
git push origin main

# Tag releases
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### Monitoring Setup

#### UptimeRobot (Recommended)

```bash
# 1. Create free account: https://uptimerobot.com
# 2. Add HTTP(s) monitor:
#    - URL: https://yourdomain.com
#    - Interval: 5 minutes
# 3. Add HTTP(s) monitor (API):
#    - URL: https://yourdomain.com/api/health
#    - Interval: 5 minutes
#    - Alert threshold: 2 failures
# 4. Configure alerts (email, Slack, etc.)
```

**See:** `docs/UPTIME_MONITORING_GUIDE.md` for complete setup.

#### Sentry (Error Tracking)

```bash
# 1. Create Sentry account: https://sentry.io
# 2. Create new project (Next.js)
# 3. Copy DSN
# 4. Add to .env:
NEXT_PUBLIC_SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz

# 5. Sentry auto-configured via sentry.client.config.ts
```

### Performance Optimization

```bash
# Analyze bundle size
npm run build
# Check .next/analyze/

# Optimize images
# Use Next.js Image component
import Image from 'next/image'

# Enable caching (Redis)
REDIS_URL=redis://localhost:6379

# CDN setup (Vercel/Cloudflare)
# Automatic with Vercel
```

---

## 📚 Additional Documentation

### Core Guides
- `docs/DATABASE_MIGRATION_GUIDE.md` - PostgreSQL setup
- `docs/DEPLOYMENT_GUIDE.md` - Complete deployment guide (800+ lines)
- `docs/SECURITY_HARDENING_GUIDE.md` - Security checklist
- `docs/API_DOCUMENTATION.md` - Complete API reference (1000+ lines)
- `docs/PLAYWRIGHT_TESTING_GUIDE.md` - Testing guide (800+ lines)
- `docs/UPTIME_MONITORING_GUIDE.md` - Monitoring setup (25KB)

### Feature Guides
- `docs/JSON-LD_SCHEMAS_GUIDE.md` - SEO schemas (400+ lines)
- `docs/RECAPTCHA_SETUP_GUIDE.md` - Spam protection
- `docs/PRE_BUILD_HOOKS_GUIDE.md` - Build validation

### Project Status
- `PROJECT_STATUS.md` - Current implementation status
- `CHANGELOG.md` - Version history
- `.env.example` - Environment template with docs

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm run start                  # Start production server

# Database
npm run payload migrate        # Run migrations
npm run payload migrate:status # Check status

# Validation
npm run validate-env          # Check environment
npm run typecheck             # TypeScript check
npm run lint                  # ESLint check

# Testing
npm run test:e2e              # Run E2E tests

# Deployment
npm run deploy                # Deploy to production
npm run deploy:verify         # Verify deployment
```

### Important URLs

```bash
# Development
http://localhost:3020                    # Frontend
http://localhost:3020/admin              # CMS Admin
http://localhost:3020/platform           # Platform Admin
http://localhost:3020/api/health         # Health Check
http://localhost:3020/api/graphql        # GraphQL API
```

### Project Structure

```
payload-app/
├── src/
│   ├── branches/              # Vertical slices
│   │   ├── ecommerce/
│   │   ├── content/
│   │   ├── marketplace/
│   │   ├── shared/
│   │   └── platform/
│   ├── app/                   # Next.js routes
│   │   ├── (ecommerce)/
│   │   ├── (content)/
│   │   ├── (shared)/
│   │   ├── (platform)/
│   │   └── (payload)/
│   ├── lib/                   # Utilities
│   ├── components/            # React components
│   └── payload.config.ts      # Payload config
├── docs/                      # Documentation
├── tests/                     # E2E tests
├── .env                       # Environment (local)
├── .env.example               # Environment template
└── package.json               # Dependencies
```

---

## ✅ Final Checklist for Claude Server

Before starting work:

- [ ] Read this entire document
- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Copy `.env.example` to `.env`
- [ ] Add required environment variables
- [ ] Setup PostgreSQL database (production)
- [ ] Run migrations (`npm run payload migrate`)
- [ ] Validate environment (`npm run validate-env`)
- [ ] Run build (`npm run build`)
- [ ] Start dev server (`npm run dev`)
- [ ] Access admin panel (http://localhost:3020/admin)
- [ ] Run tests (`npm run test:e2e`)
- [ ] Review additional documentation in `docs/`

---

## 🆘 Support & Contact

**Documentation:** See `docs/` folder for detailed guides
**Issues:** Create GitHub issue with reproduction steps
**Architecture Questions:** Review vertical slice structure in this document
**Deployment Issues:** Check `docs/DEPLOYMENT_GUIDE.md`

---

**Last Updated:** 2026-02-21
**Version:** 1.0.0 (Post Vertical Slice Migration)
**Status:** ✅ 100% Production Ready

---

Generated with Claude Code
