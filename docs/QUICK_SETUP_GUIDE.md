# 🚀 Quick Setup Guide - Production Deployment

**Tijd nodig:** 30-60 minuten
**Moeilijkheid:** Gemakkelijk (volledig geautomatiseerd)

---

## 📋 Overzicht

Deze guide helpt je om het AI SiteBuilder platform volledig production-ready te maken. We hebben **automatische setup scripts** gemaakt die je stap-voor-stap door het proces leiden!

### Wat wordt ingesteld:

1. ✅ **Environment Configuratie** - PAYLOAD_SECRET, SERVER_URL, SITE_NAME
2. ✅ **Database Setup** - PostgreSQL (Railway/Supabase/Neon)
3. ✅ **API Keys** - Google Analytics, Sentry, reCAPTCHA, Resend
4. ✅ **GitHub Actions** - CI/CD workflow secrets
5. ✅ **Monitoring** - UptimeRobot (optioneel)

---

## 🧙‍♂️ OPTIE 1: Interactive Setup Wizard (AANBEVOLEN!)

De **setup wizard** is een interactieve CLI tool die je door het hele proces leidt:

```bash
npm run setup
```

### Wat doet de wizard:

**STEP 1: Environment Configuratie** (2 min)
- ✅ Genereert automatisch PAYLOAD_SECRET (32-char secure random)
- ✅ Vraagt je productie URL
- ✅ Vraagt site naam
- ✅ Update .env file automatisch

**STEP 2: Database Setup** (15 min)
- ✅ Kiest provider (Railway/Supabase/Neon)
- ✅ Toont exacte stappen voor je gekozen provider
- ✅ Opent juiste URL in browser
- ✅ Valideert DATABASE_URL format
- ✅ Update .env automatisch

**STEP 3: API Keys** (30 min)
- ✅ Google Analytics - Toont setup URL en instructies
- ✅ Sentry - Toont setup URL en instructies
- ✅ reCAPTCHA - Upgrade van test naar productie keys
- ✅ Resend Email - Optionele setup
- ✅ Je kunt alles skippen en later instellen!

**STEP 4: GitHub Actions** (15 min)
- ✅ Toont welke secrets je nodig hebt
- ✅ Geeft exacte GitHub URL voor je repo
- ✅ Lijst met alle vereiste + optionele secrets

**STEP 5: Monitoring** (15 min - Optioneel)
- ✅ UptimeRobot setup instructies
- ✅ Monitor configuratie voor health endpoint

**Final Checks:**
- ✅ Verifieert alle verplichte configuraties
- ✅ Toont overzicht: passed/failed/optional
- ✅ Geeft next steps (build, test, deploy)

---

## 🔍 OPTIE 2: Verificatie Script

Controleer of je setup compleet is:

```bash
npm run verify-setup
```

### Output voorbeeld:

```
📁 FILE CHECKS
✓ package.json - Found
✓ next.config.ts - Found
✓ payload.config.ts - Found
✓ tsconfig.json - Found
✓ .env - Found

✅ REQUIRED CONFIGURATION
✓ PAYLOAD_SECRET - vR3k9mP1... (32 chars)
✓ DATABASE_URL - postgresql://user:pass@host...
✓ NEXT_PUBLIC_SERVER_URL - https://mijnsite.com
✓ SITE_NAME - Mijn Geweldige Site

⚙️  OPTIONAL CONFIGURATION
✓ Google Analytics - G-XXXXXXXXXX
✓ Sentry Error Tracking - Configured
⚠ reCAPTCHA (Production) - Using test keys
⚠ Resend Email - Not configured
⚠ OpenAI API - Not configured

📊 SUMMARY
✓ 5/5 files found
✓ 4/4 required checks passed (100%)
○ 2/5 optional configured (40%)

✅ PRODUCTION READY!

Next steps:
  1. Run build:      npm run build
  2. Run tests:      npm run test
  3. Deploy:         npm run deploy
```

---

## 🛠️ OPTIE 3: Handmatige Setup

Wil je alles zelf doen? Volg deze stappen:

### 1. Environment Variables (.env)

```bash
# Core (VERPLICHT!)
PAYLOAD_SECRET="genereer-32-karakter-random-string"
DATABASE_URL="postgresql://user:pass@host:5432/database"
NEXT_PUBLIC_SERVER_URL="https://jouwdomain.com"
SITE_NAME="Jouw Site Naam"

# Analytics (optioneel)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_SENTRY_DSN="https://xxx@sentry.io/xxx"

# Security (aanbevolen)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Lxxx..."
RECAPTCHA_SECRET_KEY="6Lxxx..."

# Email (optioneel)
RESEND_API_KEY="re_xxx..."

# AI (optioneel)
OPENAI_API_KEY="sk-xxx..."
```

### 2. Database Setup

#### Option A: Railway (Makkelijkst - $5/maand)

1. Ga naar https://railway.app
2. Maak account of log in
3. Klik "New Project" → "Provision PostgreSQL"
4. Klik database → "Connect" tab
5. Kopieer "Postgres Connection URL"
6. Plak in .env als DATABASE_URL

#### Option B: Supabase (Gratis tier!)

1. Ga naar https://supabase.com
2. Maak account of log in
3. Klik "New Project"
4. Vul project naam + wachtwoord in
5. Wacht ~2 min tot database klaar is
6. Settings → Database
7. Kopieer "Connection string" (Connection pooling)
8. Vervang [YOUR-PASSWORD] met je wachtwoord
9. Plak in .env als DATABASE_URL

#### Option C: Neon (Gratis tier!)

1. Ga naar https://neon.tech
2. Maak account of log in
3. Klik "Create a project"
4. Klik op project → "Connection string"
5. Kopieer PostgreSQL connection string
6. Plak in .env als DATABASE_URL

### 3. API Keys Configuratie

#### Google Analytics (GA4)

1. Ga naar https://analytics.google.com
2. Admin → Data Streams
3. Selecteer je stream
4. Kopieer "Measurement ID" (G-XXXXXXXXXX)
5. Voeg toe aan .env als NEXT_PUBLIC_GA_ID

#### Sentry Error Tracking

1. Ga naar https://sentry.io
2. Maak gratis account
3. Create new project (Next.js)
4. Kopieer DSN
5. Voeg toe aan .env als NEXT_PUBLIC_SENTRY_DSN

#### reCAPTCHA v3 (Productie Keys)

1. Ga naar https://www.google.com/recaptcha/admin
2. Klik "Register new site"
3. reCAPTCHA type: v3
4. Domains: jouwdomain.com
5. Kopieer Site Key → NEXT_PUBLIC_RECAPTCHA_SITE_KEY
6. Kopieer Secret Key → RECAPTCHA_SECRET_KEY

#### Resend Email (Optioneel)

1. Ga naar https://resend.com
2. Maak account
3. API Keys → Create API Key
4. Kopieer key (re_xxx...)
5. Voeg toe aan .env als RESEND_API_KEY

### 4. GitHub Actions Secrets

Ga naar je GitHub repo → Settings → Secrets and variables → Actions

**Vereiste secrets:**
```
PAYLOAD_SECRET          = (je .env waarde)
DATABASE_URL            = (je PostgreSQL URL)
NEXT_PUBLIC_SERVER_URL  = (je productie URL)
```

**Voor Vercel deployment:**
```
VERCEL_TOKEN            = (https://vercel.com/account/tokens)
VERCEL_ORG_ID           = (vercel.json of dashboard)
VERCEL_PROJECT_ID       = (vercel.json of dashboard)
```

**Optionele secrets:**
```
OPENAI_API_KEY
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_SENTRY_DSN
RECAPTCHA_SECRET_KEY
RESEND_API_KEY
```

### 5. UptimeRobot Monitoring (Optioneel)

1. Ga naar https://uptimerobot.com
2. Maak gratis account (50 monitors)
3. Add New Monitor:
   - Type: HTTP(s)
   - URL: https://jouwdomain.com/api/health
   - Name: Site Health Check
   - Interval: 5 minutes
4. Add tweede monitor:
   - URL: https://jouwdomain.com
   - Name: Homepage
5. Alert Contacts → Voeg email toe

---

## ✅ Verificatie Checklist

Na setup, controleer:

```bash
# 1. Environment check
npm run verify-setup

# 2. Build test
npm run build

# 3. Linting
npm run lint

# 4. Tests draaien
npm run test

# 5. Start production server locally
npm run start
```

Als alles groen is: **PRODUCTION READY!** 🎉

---

## 🚀 Deployment

### Vercel (Aanbevolen)

```bash
# Automated deployment script
npm run deploy

# Of staging environment
npm run deploy:staging

# Verify deployment
npm run deploy:verify
```

### Handmatig via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### GitHub Actions (Automatic)

Push naar `main` branch = automatic production deployment!
Push naar `develop` branch = staging deployment

---

## 🐛 Troubleshooting

### Database connection fails

```bash
# Test connection string format
node -e "console.log(new URL(process.env.DATABASE_URL))"

# Should output valid URL object
```

**Fix:** Controleer dat DATABASE_URL begint met `postgresql://` of `postgres://`

### Build fails

```bash
# Check TypeScript errors
npm run build

# Check env variables
npm run validate-env
```

### Tests fail

```bash
# Run with UI for debugging
npm run test:ui

# Check logs
npm run test 2>&1 | tee test.log
```

### Environment variables not loading

**Fix:** Zorg dat .env in project root staat, niet in subdirectory

```bash
# Should be here:
/payload-app/.env

# NOT here:
/payload-app/src/.env
```

---

## 📚 Hulp & Documentatie

- **Setup Wizard:** `npm run setup`
- **Verify Setup:** `npm run verify-setup`
- **Environment Validation:** `npm run validate-env`
- **Deploy Guide:** `docs/DEPLOYMENT_GUIDE.md`
- **Database Guide:** `docs/DATABASE_MIGRATION_GUIDE.md`
- **Security Guide:** `docs/SECURITY_HARDENING_GUIDE.md`

---

## 💡 Tips

1. **Gebruik de wizard!** Het is véél sneller dan handmatig
2. **Test local first** - Run `npm run start` voor productie test
3. **Enable monitoring** - UptimeRobot is gratis en waardevol
4. **Backup je .env** - Sla een veilige kopie op
5. **Enable Sentry** - Catch errors in productie
6. **Setup GitHub Actions** - Automated testing & deployment

---

## 🎯 Next Steps

Na succesvolle setup:

1. ✅ **Content toevoegen** - Login admin panel (`/admin`)
2. ✅ **SEO optimaliseren** - Vul meta tags in per pagina
3. ✅ **Performance testen** - Google PageSpeed Insights
4. ✅ **Security audit** - `npm audit` + security headers check
5. ✅ **Monitoring checken** - Verify UptimeRobot alerts werken

---

**Veel succes met je deployment!** 🚀

Voor vragen of problemen, check de docs of open een issue.
