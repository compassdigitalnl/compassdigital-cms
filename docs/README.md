# 📚 Documentation Index

Complete documentation for the Payload CMS AI Site Builder platform.

**Status:** ✅ Production Live - https://cms.compassdigital.nl/admin

---

## 🚀 Quick Start

**New to the project?** Start here:
1. [**Quick Setup Guide**](deployment/QUICK_SETUP_GUIDE.md) - Get started in 15 minutes
2. [**Development Workflow**](deployment/DEVELOPMENT_WORKFLOW.md) - Daily development process
3. [**Deployment Guide**](deployment/DEPLOYMENT_GUIDE.md) - Deploy to production

---

## 📁 Documentation Structure

### 🚀 Deployment & Workflows
**Location:** `docs/deployment/`

Essential guides for deployment, development workflow, and production setup.

- [**DEVELOPMENT_WORKFLOW.md**](deployment/DEVELOPMENT_WORKFLOW.md) - **⭐ START HERE!**
  - Daily development workflow
  - Making code changes
  - Database management
  - Deployment process
  - Environment variables
  - Creating admin users
  - Content management
  - Troubleshooting

- [**DEPLOYMENT_GUIDE.md**](deployment/DEPLOYMENT_GUIDE.md)
  - Automated deployment script
  - Vercel deployment
  - Health checks & verification
  - Rollback procedures
  - Emergency protocols

- [**PRE_BUILD_HOOKS_GUIDE.md**](deployment/PRE_BUILD_HOOKS_GUIDE.md)
  - Pre-build validation
  - Environment checks
  - TypeScript validation
  - ESLint checks
  - Automated error prevention

- [**QUICK_SETUP_GUIDE.md**](deployment/QUICK_SETUP_GUIDE.md)
  - Fast setup (15 min)
  - Essential configuration
  - First deployment

### 🌐 API Documentation
**Location:** `docs/api/`

Complete API reference and integration guides.

- [**API_DOCUMENTATION.md**](api/API_DOCUMENTATION.md)
  - Core API endpoints (health, OG, contact)
  - AI Content Generation (30+ endpoints)
  - AI SEO optimization
  - AI Content Analysis
  - AI Translation
  - Site Wizard
  - Payload CMS REST API
  - Authentication & rate limiting
  - Code examples (JS/Python/cURL)

### 📖 Setup Guides
**Location:** `docs/guides/`

Configuration guides for all platform features.

#### AI & Performance
- [**ai-setup-guide.md**](guides/ai-setup-guide.md)
  - OpenAI configuration
  - AI features setup
  - API key management
  - Model configuration

- [**ai-integration-examples.md**](guides/ai-integration-examples.md)
  - Code examples
  - Integration patterns
  - Best practices

- [**redis-setup.md**](guides/redis-setup.md)
  - Redis caching setup
  - Queue configuration
  - Performance optimization

#### Platform Configuration
- [**MULTI_TENANT_GUIDE.md**](guides/MULTI_TENANT_GUIDE.md)
  - Multi-tenancy setup
  - Subdomain routing
  - Tenant management
  - Database architecture

- [**environment-variables.md**](guides/environment-variables.md)
  - Complete environment variable reference
  - Local vs production configuration
  - Required vs optional variables
  - Security best practices

#### UI & Theming
- [**ADMIN_STYLING_GUIDE.md**](guides/ADMIN_STYLING_GUIDE.md)
  - Admin panel customization
  - CSS variables
  - Theme configuration
  - Component styling

- [**BLOCK_THEME_INTEGRATION.md**](guides/BLOCK_THEME_INTEGRATION.md)
  - Content block theming
  - Color schemes
  - Typography
  - Responsive design

- [**TEMPLATE_SYSTEM_INTEGRATION.md**](guides/TEMPLATE_SYSTEM_INTEGRATION.md)
  - Template system overview
  - Creating custom templates
  - Template variables
  - Advanced usage

---

## 🎯 Common Tasks

### Starting Development
```bash
# Start local development
redis-server  # In separate terminal
npm run dev

# Opens at http://localhost:3020
```

**Guide:** [Development Workflow](deployment/DEVELOPMENT_WORKFLOW.md)

### Deploying to Production
```bash
# Automatic deployment
git push origin main

# Vercel automatically builds and deploys (3-4 min)
# Production: https://cms.compassdigital.nl
```

**Guide:** [Deployment Guide](deployment/DEPLOYMENT_GUIDE.md)

### Adding AI Features
```bash
# Configure OpenAI API key in .env.local
OPENAI_API_KEY=sk-...

# AI endpoints available at:
# POST /api/ai/generate-content
# POST /api/ai/optimize-seo
# POST /api/ai/analyze-content
```

**Guide:** [AI Setup Guide](guides/ai-setup-guide.md)

### Managing Content
```bash
# Admin panel
https://cms.compassdigital.nl/admin

# Create pages, posts, products
# Upload media
# Manage users
```

**Guide:** [Development Workflow - Content Management](deployment/DEVELOPMENT_WORKFLOW.md#content-management)

### Setting Up Multi-Tenancy
```bash
# Each subdomain gets its own site:
# tenant1.yourdomain.com
# tenant2.yourdomain.com

# Central platform admin:
# platform.yourdomain.com/admin
```

**Guide:** [Multi-Tenant Guide](guides/MULTI_TENANT_GUIDE.md)

---

## 🎓 Documentation by Use Case

### "I'm new to this project"
1. [Quick Setup Guide](deployment/QUICK_SETUP_GUIDE.md)
2. [Development Workflow](deployment/DEVELOPMENT_WORKFLOW.md)
3. [Environment Variables](guides/environment-variables.md)

### "I want to deploy to production"
1. [Deployment Guide](deployment/DEPLOYMENT_GUIDE.md)
2. [Pre-Build Hooks](deployment/PRE_BUILD_HOOKS_GUIDE.md)
3. [Development Workflow - Deployment](deployment/DEVELOPMENT_WORKFLOW.md#deployment-process)

### "I want to add AI features"
1. [AI Setup Guide](guides/ai-setup-guide.md)
2. [AI Integration Examples](guides/ai-integration-examples.md)
3. [API Documentation - AI](api/API_DOCUMENTATION.md)

### "I want to customize the admin panel"
1. [Admin Styling Guide](guides/ADMIN_STYLING_GUIDE.md)
2. [Block Theme Integration](guides/BLOCK_THEME_INTEGRATION.md)
3. [Template System](guides/TEMPLATE_SYSTEM_INTEGRATION.md)

### "I want to build a multi-tenant platform"
1. [Multi-Tenant Guide](guides/MULTI_TENANT_GUIDE.md)
2. [Development Workflow](deployment/DEVELOPMENT_WORKFLOW.md)
3. [Environment Variables](guides/environment-variables.md)

### "I need API documentation"
1. [API Documentation](api/API_DOCUMENTATION.md)
2. [AI Integration Examples](guides/ai-integration-examples.md)

---

## 🔍 Quick Reference

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
```

### Essential Commands
```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run validate-env     # Check environment variables

# Git & Deployment
git push origin main     # Auto-deploy to production (via Vercel)

# Database
node reset-database.mjs  # ⚠️ Reset database (deletes all data!)
```

### Key Files
```bash
.env.local                      # Local environment variables
src/payload.config.ts          # Payload CMS configuration
src/collections/               # Data models (Pages, Posts, etc.)
src/app/api/                   # API routes
```

---

## 🔄 Workflow Overview

### Development Cycle
```
1. Make code changes
   ↓
2. Test locally (npm run dev)
   ↓
3. Commit & push (git push origin main)
   ↓
4. Vercel auto-deploys (3-4 min)
   ↓
5. Test production (https://cms.compassdigital.nl)
```

### Database Flow
```
Local Dev → Railway PostgreSQL ← Production
           (Shared Database!)

⚠️ Changes in local dev affect production!
```

---

## 📊 Platform Features

### ✅ Core Features
- **Payload CMS 3.0** - Headless CMS
- **Next.js 15** - React framework
- **PostgreSQL** - Railway database
- **Vercel** - Hosting & deployment
- **Redis** - Caching & queues

### ✅ AI Features
- Content generation (GPT-4)
- SEO optimization
- Content analysis
- Translation
- Image generation (DALL-E 3)

### ✅ Advanced Features
- Multi-tenancy
- E-commerce (Stripe)
- Blog system
- Contact forms
- Media library
- User authentication
- Role-based access control

---

## 🐛 Troubleshooting

### Common Issues
- [Deployment errors](deployment/DEVELOPMENT_WORKFLOW.md#troubleshooting)
- [Database connection issues](deployment/DEVELOPMENT_WORKFLOW.md#issue-database-connection-timeout)
- [Environment variable problems](deployment/DEVELOPMENT_WORKFLOW.md#issue-application-error-a-server-side-exception-has-occurred)
- [Redis errors](deployment/DEVELOPMENT_WORKFLOW.md#issue-redis-errors-cachingai-features-not-working)

### Getting Help
1. Check [Development Workflow - Troubleshooting](deployment/DEVELOPMENT_WORKFLOW.md#troubleshooting)
2. Review [Deployment Guide - Emergency Procedures](deployment/DEPLOYMENT_GUIDE.md)
3. Check Vercel logs: https://vercel.com/your-project/deployments
4. Check Railway logs: https://railway.app

---

## 📝 Additional Documentation

### Legacy & Archive
**Location:** `docs/` (root)

Older documentation and reference materials:
- `WIZARD-*.md` - Site wizard development docs
- `PLATFORM-*.md` - Platform architecture docs
- `phase-*.md` - Development phase documentation
- `MODULE-*.md` - Module implementation status
- `IMPLEMENTATION_*.md` - Implementation notes

These are kept for reference but may be outdated.

---

## 🎯 Next Steps

**After reading this:**
1. ✅ Read [Development Workflow](deployment/DEVELOPMENT_WORKFLOW.md)
2. ✅ Setup your environment (see [Environment Variables](guides/environment-variables.md))
3. ✅ Start developing! (`npm run dev`)
4. ✅ Deploy to production (`git push origin main`)

---

**Last Updated:** February 12, 2026
**Status:** ✅ Production Live
**Production URL:** https://cms.compassdigital.nl/admin
