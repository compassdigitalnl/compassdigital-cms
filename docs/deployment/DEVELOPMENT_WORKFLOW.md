# 🚀 Development Workflow Guide

**Status:** ✅ Production Live
**Production URL:** https://cms.compassdigital.nl/admin
**Database:** Railway PostgreSQL (shinkansen.proxy.rlwy.net:29352)

---

## 📋 Table of Contents

1. [Daily Development Workflow](#daily-development-workflow)
2. [Making Code Changes](#making-code-changes)
3. [Database Management](#database-management)
4. [Deployment Process](#deployment-process)
5. [Environment Variables](#environment-variables)
6. [Creating Admin Users](#creating-admin-users)
7. [Content Management](#content-management)
8. [Troubleshooting](#troubleshooting)

---

## 🔄 Daily Development Workflow

### Starting Development

```bash
# 1. Navigate to project directory
cd /Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app

# 2. Make sure Redis is running (for caching, AI features)
redis-server
# Or if using Homebrew:
brew services start redis

# 3. Start development server
npm run dev

# 4. Open browser
# Local: http://localhost:3020
# Admin: http://localhost:3020/admin
```

**Important:** Your local development now uses **Railway PostgreSQL**, not SQLite!
- ✅ Changes you make locally are in the SAME database as production
- ⚠️ Be careful! Local edits affect production data
- 💡 Consider setting up a separate staging database later

### Working with Git

```bash
# Pull latest changes
git pull origin main

# Create feature branch (recommended)
git checkout -b feature/my-new-feature

# Make your changes...

# Stage and commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/my-new-feature

# Create Pull Request on GitHub
# Or merge to main:
git checkout main
git merge feature/my-new-feature
git push origin main
```

**What happens when you push to main:**
1. GitHub triggers Vercel deployment
2. Vercel builds your app (2-3 minutes)
3. Vercel deploys to production
4. https://cms.compassdigital.nl automatically updates
5. Database schema auto-syncs if needed

---

## 🛠️ Making Code Changes

### 1. Frontend Changes (Components, Pages, Styling)

**Files you'll typically edit:**
- `src/app/` - Next.js app routes
- `src/components/` - React components
- `src/blocks/` - Payload CMS blocks
- `src/app/globals.css` - Global styles

**Workflow:**
```bash
# 1. Edit files
# 2. Check in browser (hot reload automatic)
# 3. Test thoroughly
# 4. Commit and push

git add src/app/...
git commit -m "Update homepage layout"
git push origin main
```

**Deployment:** Automatic via Vercel (2-3 min)

### 2. Backend Changes (API, Collections, Blocks)

**Files you'll typically edit:**
- `src/payload.config.ts` - Payload configuration
- `src/collections/` - Data models (Pages, Posts, Products, etc.)
- `src/app/api/` - API routes
- `src/lib/` - Utilities, helpers

**Workflow:**
```bash
# 1. Edit files
# 2. Restart dev server (Ctrl+C, then npm run dev)
# 3. Test API endpoints
# 4. Test admin panel changes
# 5. Commit and push

git add src/collections/...
git commit -m "Add new field to Products collection"
git push origin main
```

**Important:** Database schema changes auto-migrate!
- Payload detects schema changes
- Creates/modifies tables automatically
- Works both locally and in production

### 3. Adding New Dependencies

```bash
# Install package
npm install some-package

# This updates package.json and package-lock.json
# Commit both files:
git add package.json package-lock.json
git commit -m "Add some-package dependency"
git push origin main
```

**Vercel will automatically install new dependencies during build.**

### 4. Environment Variable Changes

**Local (.env.local):**
```bash
# Edit .env.local
nano .env.local

# Add new variable
NEW_VARIABLE=value

# Restart dev server
npm run dev
```

**Production (Vercel):**
1. Go to https://vercel.com/your-project/settings/environment-variables
2. Add new variable
3. **Important:** Redeploy for changes to take effect!
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## 💾 Database Management

### Current Setup

- **Database:** Railway PostgreSQL
- **Host:** shinkansen.proxy.rlwy.net:29352
- **Connection String:** In `.env.local` and Vercel environment variables
- **Schema:** Managed by Payload CMS (auto-sync)

### Schema Changes

**Payload automatically handles schema changes!**

**Example: Adding a field to a collection**

```typescript
// src/collections/Products.ts
export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    // Add new field:
    {
      name: 'sku',
      type: 'text',
      required: false,
    },
  ],
}
```

**What happens:**
1. Save file
2. Restart dev server: `npm run dev`
3. Payload detects schema change
4. Automatically adds `sku` column to `products` table
5. Done! No manual migration needed

**In production:**
1. Push to GitHub
2. Vercel deploys
3. First request to admin panel triggers schema sync
4. Database updated automatically

### Viewing Database

**Option 1: Railway Dashboard**
1. Go to https://railway.app
2. Select your project
3. Click "Database" tab
4. Use built-in query editor

**Option 2: psql CLI**
```bash
PGPASSWORD="eBTNOrSGwkADvgAVJKyQtllGSjugdtrN" psql \
  -h shinkansen.proxy.rlwy.net \
  -p 29352 \
  -U postgres \
  -d railway

# Now you're in PostgreSQL CLI
\dt                    # List all tables
SELECT * FROM users;   # Query users
\q                     # Quit
```

**Option 3: TablePlus / Postico**
- Download TablePlus (https://tableplus.com)
- Create new PostgreSQL connection:
  - Host: shinkansen.proxy.rlwy.net
  - Port: 29352
  - User: postgres
  - Password: eBTNOrSGwkADvgAVJKyQtllGSjugdtrN
  - Database: railway
  - SSL: Enable

### Resetting Database (⚠️ DANGER!)

**Only do this if you need to start completely fresh!**

```bash
# This deletes ALL data!
node reset-database.mjs

# Then restart dev to recreate schema:
npm run dev
```

---

## 🚀 Deployment Process

### Automatic Deployment (Recommended)

**Push to main branch triggers automatic deployment:**

```bash
git push origin main
```

**What happens:**
1. ⏰ GitHub triggers Vercel webhook (instant)
2. 🔨 Vercel builds project (2-3 minutes)
3. ✅ Vercel runs checks (TypeScript, ESLint)
4. 🚀 Vercel deploys to production (30 seconds)
5. 🌐 https://cms.compassdigital.nl updates (instant)

**Total time:** ~3-4 minutes

### Manual Deployment

**Option 1: Vercel CLI**
```bash
# Install Vercel CLI (one time)
npm install -g vercel

# Login (one time)
vercel login

# Deploy
vercel --prod
```

**Option 2: Vercel Dashboard**
1. Go to https://vercel.com/your-project
2. Click "Deployments"
3. Click "..." on latest deployment
4. Click "Redeploy"

### Checking Deployment Status

**Option 1: Vercel Dashboard**
- https://vercel.com/your-project/deployments
- Shows build logs, errors, status

**Option 2: Command Line**
```bash
# Check if site is up
curl -I https://cms.compassdigital.nl/api/health

# Should return:
HTTP/2 200
```

**Option 3: Browser**
- https://cms.compassdigital.nl/admin
- Should load without errors

### Rollback (if deployment fails)

**Option 1: Vercel Dashboard**
1. Go to Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

**Option 2: Git Revert**
```bash
# Revert last commit
git revert HEAD
git push origin main

# Vercel automatically deploys the revert
```

---

## 🔐 Environment Variables

### Local Development (.env.local)

**File:** `/Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app/.env.local`

**Critical variables:**
```bash
# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway

# Payload CMS
PAYLOAD_SECRET=your-secret-key-here

# URLs
NEXT_PUBLIC_SERVER_URL=http://localhost:3020
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3020

# AI (OpenAI)
OPENAI_API_KEY=sk-proj-...

# Redis (local)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**After changing .env.local:**
```bash
# Restart dev server
npm run dev
```

### Production (Vercel)

**Location:** https://vercel.com/your-project/settings/environment-variables

**Critical variables:**
```bash
# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway
PLATFORM_DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway

# Payload CMS
PAYLOAD_SECRET=mygeneratedsecret

# URLs
NEXT_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
PAYLOAD_PUBLIC_SERVER_URL=https://cms.compassdigital.nl

# AI (OpenAI)
OPENAI_API_KEY=sk-proj-...

# Redis (optional - for production caching)
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

**After changing Vercel environment variables:**
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait 3-4 minutes

### Adding New Variables

**1. Local:**
```bash
# Edit .env.local
echo "NEW_VAR=value" >> .env.local

# Restart
npm run dev
```

**2. Production:**
```bash
# Option A: Vercel Dashboard
# 1. Go to Settings → Environment Variables
# 2. Add "NEW_VAR" with value
# 3. Select "Production"
# 4. Click Save
# 5. Redeploy

# Option B: Vercel CLI
vercel env add NEW_VAR production
# Enter value when prompted
```

---

## 👤 Creating Admin Users

### First Admin User (Production)

**⚠️ Important:** Create this ASAP to secure your production admin panel!

**Option 1: Via Admin Panel (Easiest)**
1. Go to https://cms.compassdigital.nl/admin
2. Click "Create your first user"
3. Fill in:
   - Email: your@email.com
   - Password: Strong password (min 8 chars)
   - Confirm password
4. Click "Create Account"
5. ✅ You're logged in!

**Option 2: Via Script**
```bash
# Create script: create-admin.ts
npm run tsx src/scripts/create-admin.ts

# Or manually via psql:
PGPASSWORD="..." psql -h shinkansen.proxy.rlwy.net -p 29352 -U postgres -d railway

INSERT INTO platform_admins (email, password, ...) VALUES (...);
```

### Additional Users

**After first admin exists:**

1. Log in to https://cms.compassdigital.nl/admin
2. Go to "Platform Admins" collection
3. Click "Create New"
4. Fill in email and password
5. Click "Save"

### User Roles

**Platform Admins:**
- Full access to admin panel
- Can create/edit/delete all content
- Manage other users
- Configure settings

**Regular Users (if enabled):**
- Limited access
- Can only edit their own content
- Cannot access settings

---

## 📝 Content Management

### Creating Pages

1. Go to https://cms.compassdigital.nl/admin
2. Click "Pages" in sidebar
3. Click "Create New"
4. Fill in:
   - Title: "About Us"
   - Slug: "about-us" (auto-generated)
   - Layout: Add blocks (Hero, Content, Features, etc.)
5. Click "Save"
6. Click "Publish"
7. View at: https://cms.compassdigital.nl/about-us

### Creating Blog Posts

1. Go to "Blog Posts"
2. Click "Create New"
3. Fill in:
   - Title
   - Slug (auto-generated)
   - Author
   - Published Date
   - Content (rich text)
   - Featured Image
4. Click "Save" and "Publish"
5. View at: https://cms.compassdigital.nl/blog/your-slug

### Uploading Media

1. Go to "Media"
2. Click "Upload"
3. Select images/files
4. Automatically optimized and stored
5. Use in pages/posts via media picker

### Managing Products (if enabled)

1. Go to "Products"
2. Click "Create New"
3. Fill in:
   - Name
   - Description
   - Price
   - Images
   - Variants (if applicable)
4. Click "Save" and "Publish"

---

## 🐛 Troubleshooting

### Issue: "Application error: a server-side exception has occurred"

**Cause:** Missing environment variables or database connection failed

**Fix:**
```bash
# 1. Check Vercel environment variables
# Go to https://vercel.com/your-project/settings/environment-variables
# Ensure DATABASE_URL is set

# 2. Check Vercel logs
# Go to Deployments → Click latest → Runtime Logs
# Look for specific error

# 3. Test database connection
PGPASSWORD="..." psql -h shinkansen.proxy.rlwy.net -p 29352 -U postgres -d railway
# If this fails, Railway database might be down
```

### Issue: "Relation does not exist" error

**Cause:** Database schema not synced

**Fix:**
```bash
# 1. Access admin panel
# Go to https://cms.compassdigital.nl/admin
# First request triggers schema sync automatically

# 2. If that doesn't work, reset database:
node reset-database.mjs
npm run dev
# Let it complete schema sync
```

### Issue: Local changes don't appear in production

**Cause:** Forgot to push to GitHub

**Fix:**
```bash
# Check git status
git status

# Commit and push
git add .
git commit -m "My changes"
git push origin main
```

### Issue: Production shows old version

**Cause:** Deployment failed or cached

**Fix:**
```bash
# 1. Force redeploy
# Go to Vercel → Deployments → Redeploy

# 2. Clear browser cache
# Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# 3. Check deployment status
curl -I https://cms.compassdigital.nl/api/health
```

### Issue: Database connection timeout

**Cause:** Railway database unreachable or credentials wrong

**Fix:**
```bash
# 1. Check Railway dashboard
# Go to https://railway.app
# Ensure database is running

# 2. Verify credentials
# Compare .env.local with Railway dashboard

# 3. Test connection
PGPASSWORD="..." psql -h shinkansen.proxy.rlwy.net -p 29352 -U postgres -d railway
```

### Issue: Redis errors (caching/AI features not working)

**Cause:** Redis not running locally

**Fix:**
```bash
# Start Redis
redis-server

# Or with Homebrew:
brew services start redis

# Verify it's running
redis-cli ping
# Should return: PONG
```

---

## 📚 Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server (local)

# Testing
npm run validate-env     # Check environment variables
npm run lint            # Run ESLint

# Database
node reset-database.mjs  # ⚠️ Reset database (deletes all data!)

# Git
git status              # Check changes
git add .               # Stage all changes
git commit -m "msg"     # Commit
git push origin main    # Deploy to production (via Vercel)
```

### Important URLs

```bash
# Local Development
http://localhost:3020              # Frontend
http://localhost:3020/admin        # Admin panel
http://localhost:3020/api/health   # Health check

# Production
https://cms.compassdigital.nl              # Frontend
https://cms.compassdigital.nl/admin        # Admin panel
https://cms.compassdigital.nl/api/health   # Health check

# Services
https://vercel.com/your-project            # Vercel dashboard
https://railway.app                        # Railway dashboard
https://github.com/your-repo               # GitHub repository
```

### File Locations

```bash
# Configuration
.env.local                      # Local environment variables
src/payload.config.ts          # Payload CMS configuration
next.config.mjs                # Next.js configuration

# Collections (data models)
src/collections/Pages.ts       # Pages collection
src/collections/Posts.ts       # Blog posts
src/collections/Products.ts    # Products
src/collections/Media.ts       # Media library

# API Routes
src/app/api/                   # API endpoints
src/app/api/health/route.ts    # Health check

# Frontend
src/app/(app)/                 # Public pages
src/app/(payload)/             # Admin panel
src/blocks/                    # Content blocks
src/components/                # React components

# Scripts
src/scripts/                   # Utility scripts
reset-database.mjs             # Database reset
```

---

## 🎯 Best Practices

### 1. Always Test Locally First

```bash
# Before pushing to production:
npm run dev
# Test all changes thoroughly
# Check console for errors
# Test in different browsers
```

### 2. Use Feature Branches for Big Changes

```bash
# Don't work directly on main for complex features
git checkout -b feature/new-checkout-flow
# Make changes
# Test thoroughly
git push origin feature/new-checkout-flow
# Create Pull Request on GitHub
# Review → Merge to main
```

### 3. Monitor Vercel Deployments

- Always check Vercel dashboard after pushing
- Look for build errors
- Check runtime logs if issues occur
- Test production URL after deployment

### 4. Backup Database Regularly

```bash
# Export database (via Railway dashboard)
# Or use pg_dump:
PGPASSWORD="..." pg_dump \
  -h shinkansen.proxy.rlwy.net \
  -p 29352 \
  -U postgres \
  -d railway \
  > backup-$(date +%Y%m%d).sql
```

### 5. Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Test thoroughly
npm run build
npm run dev

# Commit
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main
```

---

## 🎓 Learning Resources

### Payload CMS
- Docs: https://payloadcms.com/docs
- Discord: https://discord.com/invite/payload
- GitHub: https://github.com/payloadcms/payload

### Next.js
- Docs: https://nextjs.org/docs
- Learn: https://nextjs.org/learn

### Vercel
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

### Railway
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

---

## ✅ Workflow Checklist

**Daily Development:**
- [ ] Start Redis: `redis-server`
- [ ] Start dev server: `npm run dev`
- [ ] Make changes
- [ ] Test locally
- [ ] Commit: `git commit -m "..."`
- [ ] Push: `git push origin main`
- [ ] Check Vercel deployment
- [ ] Test production URL

**Adding New Feature:**
- [ ] Create branch: `git checkout -b feature/...`
- [ ] Make changes
- [ ] Test thoroughly
- [ ] Push branch
- [ ] Create Pull Request
- [ ] Review and merge
- [ ] Delete branch

**Deployment:**
- [ ] Changes tested locally
- [ ] Committed to Git
- [ ] Pushed to GitHub
- [ ] Vercel build succeeded
- [ ] Production URL tested
- [ ] No errors in logs

---

**Last Updated:** February 12, 2026
**Status:** ✅ Production Live
**Version:** 1.0.0
