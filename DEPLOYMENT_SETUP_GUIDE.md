# 🚀 Compass Digital CMS - Complete Deployment Guide

**Repository:** https://github.com/compassdigitalnl/compassdigital-cms
**Target Domain:** cms.compassdigital.nl
**Platform Type:** Multi-Tenant SaaS with Auto-Provisioning
**Total Setup Time:** ~60 minutes

---

## 📋 QUICK OVERVIEW

Deze guide brengt je van code → production in 6 stappen:

1. ✅ **Git Repository** - DONE! Code staat op GitHub
2. ⏳ **Vercel Deployment** - Deploy naar cms.compassdigital.nl (10 min)
3. ⏳ **Railway Setup** - PostgreSQL + API key (15 min)
4. ⏳ **Vercel Token** - Voor client auto-provisioning (10 min)
5. ⏳ **Email & Security** - Resend + reCAPTCHA (20 min)
6. ⏳ **Test & Verify** - Maak eerste test client (10 min)

---

## 🎯 WAT JE NODIG HEBT

### Accounts (Gratis tiers beschikbaar):
- ✅ **GitHub** - Repo staat al klaar
- ⏳ **Vercel** - Voor platform deployment
- ⏳ **Railway** - Voor PostgreSQL databases
- ⏳ **Resend** (optioneel) - Voor emails
- ⏳ **Google reCAPTCHA** (optioneel) - Voor spam protection

### Access:
- ✅ **GitHub access** - compassdigitalnl/compassdigital-cms
- ⏳ **DNS access** - Voor cms.compassdigital.nl CNAME

---

## STEP 1: VERCEL DEPLOYMENT (10 min) ✨

### A) Import Project in Vercel

1. **Ga naar:** https://vercel.com/new
2. **Import Git Repository:**
   - Select: `compassdigitalnl/compassdigital-cms`
   - Framework: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables toevoegen:**

Klik op "Environment Variables" en voeg toe:

```bash
# ─── CORE (Minimaal vereist) ───────────────
PAYLOAD_SECRET=your-32-character-secret-here-generate-this
DATABASE_URL=file:./payload.db
NEXT_PUBLIC_SERVER_URL=https://cms.compassdigital.nl

# ─── Platform Configuration ────────────────
PLATFORM_DOMAIN=compassdigital.nl
PLATFORM_ADMIN_EMAIL=admin@compassdigital.nl
```

**Generate PAYLOAD_SECRET:**
```bash
# In terminal:
openssl rand -base64 32
# Of:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

4. **Deploy!**
   - Klik "Deploy"
   - Wacht ~3-5 minuten
   - Deployment succesvol? → Ga verder!

### B) Custom Domain Setup

1. **In Vercel Dashboard:**
   - Ga naar: Settings → Domains
   - Add domain: `cms.compassdigital.nl`
   - Copy de CNAME value (meestal: `cname.vercel-dns.com`)

2. **In je DNS Provider:**
   ```
   Type: CNAME
   Name: cms
   Value: cname.vercel-dns.com
   TTL: 3600 (of auto)
   ```

3. **Verify:**
   - Wacht 5-10 minuten
   - Check: https://cms.compassdigital.nl
   - Moet laden (zonder errors)

### C) SSL Certificate
- Vercel regelt dit automatisch
- Wacht ~5 minuten voor HTTPS actief is

---

## STEP 2: RAILWAY SETUP (15 min) 🚂

### A) Account + API Key

1. **Ga naar:** https://railway.app
2. **Sign up:** (Gratis $5/maand credit)
3. **Create API Token:**
   - Ga naar: https://railway.app/account/tokens
   - Naam: "Compass Digital CMS"
   - Copy token (begint met: `service_`)
   - **Bewaar deze!** Je hebt hem straks nodig

### B) Platform Database (Voor het CMS zelf)

1. **In Railway Dashboard:**
   - Klik "New Project"
   - Klik "Provision PostgreSQL"
   - Naam: `compass-cms-platform`

2. **Get Connection String:**
   - Klik op de database
   - Ga naar "Connect"
   - Copy "Postgres Connection URL"
   - Format: `postgresql://postgres:xxx@region.railway.app:5432/railway`

3. **Update Vercel Environment:**
   - Ga naar Vercel Dashboard
   - Settings → Environment Variables
   - **Update:**
     ```bash
     DATABASE_URL=postgresql://postgres:xxx@region.railway.app:5432/railway
     ```
   - Klik "Save"

4. **Redeploy Vercel:**
   - Ga naar Deployments tab
   - Klik "..." op laatste deployment
   - Klik "Redeploy"
   - Wacht 3-5 minuten

### C) Railway API Key (Voor Client Provisioning)

**In Vercel Dashboard → Environment Variables:**

Add nieuwe variable:
```bash
RAILWAY_API_KEY=service_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Gebruik:** Dit zorgt ervoor dat voor elke nieuwe client automatisch een PostgreSQL database wordt aangemaakt.

---

## STEP 3: VERCEL TOKEN (10 min) 🔑

Voor **automatische client deployments** heb je een Vercel API token nodig.

### A) Create Vercel Token

1. **Ga naar:** https://vercel.com/account/tokens
2. **Create Token:**
   - Name: `Compass CMS - Client Provisioning`
   - Scope: **Full Account**
   - Expiration: Never (of 1 jaar)
3. **Copy token** (begint met: `vercel_`)
4. **Bewaar deze!**

### B) Team ID (Optioneel - voor team accounts)

Als je een **Vercel Team** gebruikt:
1. Ga naar: https://vercel.com/[jouw-team]/settings
2. Copy "Team ID" uit de URL of settings
3. Format: `team_xxxxx`

### C) GitHub Repo voor Clients

Je hebt een **template repository** nodig voor client sites:

**Optie 1: Gebruik deze repo als template**
```bash
# In Vercel environment variables:
GITHUB_REPO=compassdigitalnl/compassdigital-cms
```

**Optie 2: Maak een aparte client template (Aanbevolen)**
1. Create new repo: `compassdigitalnl/client-template`
2. Push een basis Next.js + Payload setup
3. Use: `GITHUB_REPO=compassdigitalnl/client-template`

### D) Update Vercel Environment

**Add to Vercel:**
```bash
# Required:
VERCEL_TOKEN=vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=compassdigitalnl/compassdigital-cms

# Optional (if using team):
VERCEL_TEAM_ID=team_xxxxx
```

---

## STEP 4: EMAIL & SECURITY (20 min) 📧🔒

### A) Resend Setup (Email Notifications)

**1. Create Account:**
- Ga naar: https://resend.com
- Sign up (Gratis: 100 emails/dag)

**2. Verify Domain:**
- Ga naar: Domains → Add Domain
- Domain: `compassdigital.nl`
- Add DNS records (SPF, DKIM, DMARC)
- Wait for verification (~10 min)

**3. Create API Key:**
- Ga naar: API Keys → Create
- Name: "Compass CMS Platform"
- Copy key (begint met: `re_`)

**4. Update Vercel:**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=platform@compassdigital.nl
```

**Emails die worden verstuurd:**
- Welcome emails naar nieuwe clients (met admin credentials)
- Alert emails bij critical issues

### B) reCAPTCHA Setup (Spam Protection)

**1. Create Keys:**
- Ga naar: https://www.google.com/recaptcha/admin
- Register new site:
  - Label: "Compass Digital CMS"
  - Type: **reCAPTCHA v3**
  - Domains:
    - `cms.compassdigital.nl`
    - `localhost` (voor development)

**2. Copy Keys:**
- Site Key (public): `6Lxxxxxx...`
- Secret Key (private): `6Lxxxxxx...`

**3. Update Vercel:**
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### C) Google Analytics (Optioneel)

**1. Create GA4 Property:**
- Ga naar: https://analytics.google.com
- Create property: "Compass Digital CMS"
- Copy Measurement ID (format: `G-XXXXXXXXXX`)

**2. Update Vercel:**
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### D) Cron Secret (Voor Health Checks)

**1. Generate Secret:**
```bash
# In terminal:
openssl rand -hex 32
```

**2. Update Vercel:**
```bash
CRON_SECRET=your-generated-hex-secret-here
```

**Gebruik:** Beveiligt de `/api/platform/cron/health-checks` endpoint.

---

## STEP 5: COMPLETE ENVIRONMENT VARIABLES ✅

**Hier is de COMPLETE lijst voor Vercel:**

```bash
# ─── Core (Required) ────────────────────────
PAYLOAD_SECRET=your-32-character-secret
DATABASE_URL=postgresql://postgres:xxx@railway.app:5432/railway
NEXT_PUBLIC_SERVER_URL=https://cms.compassdigital.nl

# ─── Platform Configuration ─────────────────
PLATFORM_DOMAIN=compassdigital.nl
PLATFORM_ADMIN_EMAIL=admin@compassdigital.nl

# ─── Railway (Database Provisioning) ────────
RAILWAY_API_KEY=service_xxxxxxxxxxxxxxxxxxxxx

# ─── Vercel (Client Deployment) ─────────────
VERCEL_TOKEN=vercel_xxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=compassdigitalnl/compassdigital-cms
# VERCEL_TEAM_ID=team_xxxxx (optional)

# ─── Resend (Email Notifications) ───────────
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=platform@compassdigital.nl

# ─── Security & Monitoring ──────────────────
CRON_SECRET=your-hex-secret-for-cron
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lxxxxxxxxxxxxx

# ─── Optional ───────────────────────────────
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
OPENAI_API_KEY=sk-proj-xxxxxx (if using AI features)
```

### Environment Variables Checklist:

- [ ] PAYLOAD_SECRET (generated)
- [ ] DATABASE_URL (Railway PostgreSQL)
- [ ] NEXT_PUBLIC_SERVER_URL (cms.compassdigital.nl)
- [ ] PLATFORM_DOMAIN (compassdigital.nl)
- [ ] PLATFORM_ADMIN_EMAIL (your email)
- [ ] RAILWAY_API_KEY (Railway token)
- [ ] VERCEL_TOKEN (Vercel API token)
- [ ] GITHUB_REPO (template repo)
- [ ] RESEND_API_KEY (Resend token)
- [ ] RESEND_FROM_EMAIL (verified sender)
- [ ] CRON_SECRET (generated hex)
- [ ] reCAPTCHA keys (both site + secret)

---

## STEP 6: REDEPLOY & TEST (10 min) 🧪

### A) Trigger Redeploy

1. **Vercel Dashboard:**
   - Ga naar Deployments
   - Klik laatste deployment → "..." → "Redeploy"
   - ✅ Ensure "Use existing Build Cache" is **OFF**
   - Click "Redeploy"

2. **Wait:**
   - Deployment duurt ~3-5 minuten
   - Check logs voor errors
   - Wacht tot "✓ Deployment completed"

### B) Create First Admin User

1. **Open:** https://cms.compassdigital.nl/admin
2. **Create Account:**
   - Email: `admin@compassdigital.nl`
   - Password: [strong password]
   - Name: "Platform Admin"
3. **Login** met nieuwe credentials

### C) Access Platform Admin

1. **Open:** https://cms.compassdigital.nl/platform
2. **Verify:**
   - ✅ Dashboard loads
   - ✅ Stats show 0 clients
   - ✅ No errors in console

### D) Create Test Client

**Important:** Dit test de VOLLEDIGE provisioning flow!

1. **In Platform Admin:**
   - Click "Add New Client"

2. **Fill in:**
   ```
   Client Name: Test Client
   Domain: test-client
   Contact Email: test@compassdigital.nl
   Template: E-commerce Store
   ```

3. **Click:** "Create & Deploy"

4. **Wait:** 3-5 minuten (watch the UI for progress)

5. **Expected Results:**
   - ✅ Railway: Nieuwe database created
   - ✅ Vercel: Nieuwe project "test-client"
   - ✅ Email: Welcome email sent (check inbox)
   - ✅ Platform: Client shows in list
   - ✅ Status: "Active"

### E) Verify Client

1. **Check Railway:**
   - https://railway.app
   - See new project: "test-client"
   - Database created

2. **Check Vercel:**
   - https://vercel.com/dashboard
   - See new project: "test-client"
   - Deployment in progress

3. **Check Email:**
   - Open: test@compassdigital.nl
   - Welcome email with:
     - Admin URL
     - Login credentials
     - Getting started info

4. **Check Health:**
   - https://cms.compassdigital.nl/platform/monitoring
   - Client should show "Healthy" after ~5 min

---

## 🎉 SUCCESS CRITERIA

### Platform Checks:
- ✅ https://cms.compassdigital.nl loads
- ✅ Admin panel accessible: /admin
- ✅ Platform admin accessible: /platform
- ✅ No console errors
- ✅ SSL certificate valid (HTTPS)

### Provisioning Checks:
- ✅ Test client created successfully
- ✅ Railway database provisioned
- ✅ Vercel deployment triggered
- ✅ Welcome email received
- ✅ Client appears in list
- ✅ Health monitoring active

### API Checks:
```bash
# Health check:
curl https://cms.compassdigital.nl/api/health
# Expected: {"status":"ok","database":"connected",...}

# OG Image generator:
curl https://cms.compassdigital.nl/api/og?title=Test
# Expected: PNG image

# Platform stats:
curl https://cms.compassdigital.nl/api/platform/stats
# Expected: {"totalClients":1,"activeClients":1,...}
```

---

## 🔧 TROUBLESHOOTING

### Issue: Deployment fails

**Check:**
1. All environment variables set?
2. `npm run build` succeeds locally?
3. Check Vercel logs for specific error

**Fix:**
```bash
# Test locally:
npm run build
npm run start

# If works locally but fails on Vercel:
# - Check Node.js version (should be 18.x)
# - Clear Vercel build cache
# - Redeploy
```

### Issue: Database connection fails

**Check:**
1. DATABASE_URL correct format?
2. Railway database active?
3. Network accessible?

**Fix:**
```bash
# Test connection:
psql postgresql://postgres:xxx@railway.app:5432/railway

# If fails:
# - Verify Railway database is running
# - Check DATABASE_URL has no typos
# - Ensure no firewall blocking
```

### Issue: Client provisioning fails

**Check:**
1. RAILWAY_API_KEY set?
2. VERCEL_TOKEN set?
3. GITHUB_REPO accessible?

**Logs:**
```bash
# Check Vercel Function logs:
# Vercel Dashboard → Functions → platform/clients

# Common errors:
# - "RAILWAY_API_KEY not configured" → Add key
# - "VERCEL_TOKEN invalid" → Regenerate token
# - "GitHub repo not found" → Check GITHUB_REPO value
```

### Issue: Emails not sending

**Check:**
1. RESEND_API_KEY set?
2. Domain verified in Resend?
3. FROM email correct?

**Fix:**
- Resend dashboard → Check domain verification status
- Test API key: https://resend.com/docs
- Check Resend logs for delivery status

### Issue: Health checks not running

**Vercel Cron only works in PRODUCTION:**
- Not in development
- Not in preview deployments
- Only on main branch production deployment

**Manual trigger:**
```bash
curl -X GET https://cms.compassdigital.nl/api/platform/cron/health-checks \
  -H "Authorization: Bearer your-CRON_SECRET"
```

---

## 📊 MONITORING & MAINTENANCE

### Daily Checks:
- Health monitoring dashboard: https://cms.compassdigital.nl/platform/monitoring
- Check for failed deployments
- Monitor Railway database usage
- Check Vercel function logs

### Weekly Checks:
- Review client health trends
- Check Railway credits remaining
- Verify email delivery rates
- Review Vercel bandwidth usage

### Monthly Checks:
- Database backups
- Update dependencies: `npm audit`
- Review security logs
- Check Vercel analytics

---

## 🚀 NEXT STEPS

### Immediate:
- [ ] Test complete provisioning flow
- [ ] Create real first client
- [ ] Setup monitoring alerts
- [ ] Document internal procedures

### Short Term (Week 1):
- [ ] Add platform-admin role to Users collection
- [ ] Enable strict role-based access
- [ ] Setup backup strategy
- [ ] Create client onboarding docs

### Long Term:
- [ ] Custom domains for clients
- [ ] Billing integration (Stripe)
- [ ] Client self-service portal
- [ ] Automated backups
- [ ] Multi-region deployment

---

## 📚 ADDITIONAL DOCUMENTATION

**In `docs/` folder:**
- `IMPLEMENTATION_COMPLETE.md` - Complete implementation details
- `PLATFORM_AUTHENTICATION.md` - Auth setup guide
- `TEMPLATE_SYSTEM_INTEGRATION.md` - Template system docs
- `MULTI_TENANT_GUIDE.md` - Architecture overview
- `DATABASE_MIGRATION_GUIDE.md` - PostgreSQL migration
- `UPTIME_MONITORING_GUIDE.md` - Monitoring setup

**Quick Commands:**
```bash
# Check environment locally:
npm run validate-env

# Build locally:
npm run build

# Start dev server:
npm run dev

# Manual health check:
curl https://cms.compassdigital.nl/api/health
```

---

## ✨ SUPPORT & HELP

**Common Questions:**

**Q: Can I use SQLite instead of PostgreSQL?**
A: For local development yes (`DATABASE_URL=file:./payload.db`). For production, PostgreSQL strongly recommended.

**Q: Do I need all the optional services?**
A: No. Minimum required:
- Vercel (for hosting)
- Railway (for databases)
Optional: Resend, reCAPTCHA, Google Analytics

**Q: Can I host on other platforms?**
A: Platform: Yes (any Node.js host). But client auto-provisioning is built for Vercel. You'd need to adapt `src/platform/integrations/vercel.ts` for other platforms.

**Q: How much does this cost per month?**
- **Vercel:** Free tier (then ~$20/month Pro)
- **Railway:** $5/month per database (~$5 per client)
- **Resend:** Free tier (100 emails/day)
- **Total:** ~$20 + ($5 × aantal clients)

**Q: How do I add a new template?**
A: See `docs/TEMPLATE_SYSTEM_INTEGRATION.md` - Add to `src/templates/index.ts`

---

## 🎊 YOU'RE READY!

Als je alle stappen hebt gevolgd:
- ✅ Platform is live op cms.compassdigital.nl
- ✅ Auto-provisioning werkt
- ✅ Email notifications actief
- ✅ Health monitoring draait
- ✅ Ready voor eerste echte client!

**Test het uit:** Maak je eerste client en zie de magie gebeuren! 🚀

---

**Questions?** Check de docs of code comments!
**Happy Multi-Tenanting!** 🎉
