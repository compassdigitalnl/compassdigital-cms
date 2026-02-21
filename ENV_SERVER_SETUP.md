# 🔐 Server .env Setup Guide

**Voor:** Production deployment op server (Platform CMS)

---

## 📋 Samenvatting

**Je lokale `.env` is GROTENDEELS goed**, maar er zijn **kritieke verschillen** voor production:

| Categorie | Lokaal | Server | Actie |
|-----------|--------|--------|-------|
| **Database** | SQLite | PostgreSQL | ✅ Klaar (PLATFORM_DATABASE_URL) |
| **URLs** | localhost:3020 | cms.compassdigital.nl | 🔴 MOET WIJZIGEN |
| **Node ENV** | development | production | 🔴 MOET WIJZIGEN |
| **Secrets** | Dev keys | Prod keys | ⚠️ SOMMIGE WIJZIGEN |
| **API Keys** | Test/Live mixed | Live only | ⚠️ SOMMIGE WIJZIGEN |

---

## 🎯 Quick Answer

**Moet je de `.env` exact zo op de server zetten?**

**NEE** - gebruik `.env.server` template die ik heb gemaakt met deze wijzigingen:

### 🔴 MOET WIJZIGEN (Kritiek!)

```bash
# 1. Database - ✅ AL GOED (PLATFORM_DATABASE_URL is set)
DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway

# 2. URLs - 🔴 WIJZIG van localhost naar productie domain
PAYLOAD_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
NEXT_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
NEXT_PUBLIC_FRONTEND_URL=https://cms.compassdigital.nl

# 3. Node Environment - 🔴 WIJZIG naar production
NODE_ENV=production

# 4. Payload Secret - 🔴 GENEREER NIEUWE (security!)
PAYLOAD_SECRET=$(openssl rand -base64 32)
```

### ⚠️ MOET TOEVOEGEN (Ontbreekt nu)

```bash
# 5. Resend Email - GET KEY van https://resend.com/api-keys
RESEND_API_KEY=re_YOUR_KEY

# 6. Google Analytics - GET van https://analytics.google.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 7. Sentry Error Tracking - GET van https://sentry.io
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=compassdigital
SENTRY_PROJECT=platform-cms

# 8. REAL reCAPTCHA Keys - GET van https://www.google.com/recaptcha/admin
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc_YOUR_REAL_SITE_KEY
RECAPTCHA_SECRET_KEY=6Lc_YOUR_REAL_SECRET_KEY

# 9. LIVE Stripe Keys - GET van https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
STRIPE_WEBHOOKS_SIGNING_SECRET=whsec_YOUR_SECRET
```

### ✅ MAG BLIJVEN (Al production-ready)

```bash
# 10. OpenAI API Key - ✅ LIVE KEY (al goed!)
OPENAI_API_KEY=sk-proj-YeY4Mvg...

# 11. Ploi API Token - ✅ LIVE KEY (al goed!)
PLOI_API_TOKEN="eyJ0eXAiOiJKV1QiLCJhbGc..."
PLOI_SERVER_ID="108942"

# 12. Cloudflare - ✅ LIVE TOKENS (al goed!)
CLOUDFLARE_API_TOKEN="OWl3-GXM2o..."
CLOUDFLARE_ZONE_ID="11d1bcef..."

# 13. Railway - ✅ Al geconfigureerd
PLATFORM_DATABASE_URL=postgresql://...
RAILWAY_USE_SHARED_DATABASE=true
RAILWAY_API_KEY="3071c738..."

# 14. Feature Flags - ✅ Blijven zoals ze zijn
ENABLE_SHOP=true
ENABLE_PLATFORM=true
# etc...
```

---

## 📝 Stap-voor-Stap Server Setup

### STAP 1: Kopieer Template naar Server

```bash
# Op server (via SSH of Ploi file manager):
cd /path/to/your/app
cp env.production.template .env
```

### STAP 2: Wijzig Kritieke Variabelen

Open `.env` op de server en wijzig:

```bash
# 2a. Database (✅ al goed, maar verifieer)
DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway

# 2b. URLs - WIJZIG naar productie
PAYLOAD_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
NEXT_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
NEXT_PUBLIC_FRONTEND_URL=https://cms.compassdigital.nl

# 2c. Node Environment
NODE_ENV=production

# 2d. Genereer NIEUWE Payload Secret
# Run op server:
openssl rand -base64 32
# Kopieer output naar:
PAYLOAD_SECRET=<output_hier>
```

### STAP 3: Voeg Production Keys Toe

**3a. Resend Email (Optioneel maar aanbevolen)**

1. Ga naar https://resend.com/api-keys
2. Klik "Create API Key"
3. Kopieer key
4. Voeg toe aan `.env`:
   ```bash
   RESEND_API_KEY=re_abc123xyz
   CONTACT_EMAIL=info@compassdigital.nl
   FROM_EMAIL=noreply@compassdigital.nl
   ```

**3b. Google Analytics (Optioneel)**

1. Ga naar https://analytics.google.com
2. Create property voor cms.compassdigital.nl
3. Kopieer Measurement ID (G-XXXXXXXXXX)
4. Voeg toe aan `.env`:
   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

**3c. Sentry Error Tracking (Aanbevolen!)**

1. Ga naar https://sentry.io
2. Create project "platform-cms"
3. Kopieer DSN
4. Voeg toe aan `.env`:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_ORG=compassdigital
   SENTRY_PROJECT=platform-cms
   ```

**3d. Real reCAPTCHA Keys (KRITIEK!)**

1. Ga naar https://www.google.com/recaptcha/admin/create
2. Choose reCAPTCHA v3
3. Add domains:
   - `cms.compassdigital.nl`
   - `*.compassdigital.nl` (voor client sites)
4. Kopieer site key en secret key
5. Voeg toe aan `.env`:
   ```bash
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc_your_real_site_key
   RECAPTCHA_SECRET_KEY=6Lc_your_real_secret_key
   ```

**3e. Live Stripe Keys (Als je e-commerce gebruikt)**

1. Ga naar https://dashboard.stripe.com/apikeys
2. Switch naar "Live mode" (toggle rechtsboven)
3. Kopieer:
   - Publishable key (pk_live_...)
   - Secret key (sk_live_...)
4. Voor webhook secret:
   - Ga naar Developers → Webhooks
   - Add endpoint: `https://cms.compassdigital.nl/api/stripe/webhooks`
   - Select events: `checkout.session.completed`, `customer.subscription.*`
   - Kopieer Signing secret (whsec_...)
5. Voeg toe aan `.env`:
   ```bash
   STRIPE_SECRET_KEY=sk_live_YOUR_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
   STRIPE_WEBHOOKS_SIGNING_SECRET=whsec_YOUR_SECRET
   ```

### STAP 4: Verify Configuration

**Op de server, run:**

```bash
# Check of alle kritieke vars zijn gezet
node -e "
const required = [
  'DATABASE_URL',
  'PAYLOAD_SECRET',
  'PAYLOAD_PUBLIC_SERVER_URL',
  'NODE_ENV'
];
required.forEach(key => {
  if (!process.env[key]) console.error('❌ Missing:', key);
  else console.log('✅', key);
});
"
```

**Expected output:**

```
✅ DATABASE_URL
✅ PAYLOAD_SECRET
✅ PAYLOAD_PUBLIC_SERVER_URL
✅ NODE_ENV
```

### STAP 5: Test de Server

```bash
# Start de applicatie
npm run start

# Of als je PM2 gebruikt:
pm2 start ecosystem.config.js
pm2 logs

# Check health endpoint
curl https://cms.compassdigital.nl/api/health

# Expected response:
# {"status":"healthy","database":"connected","timestamp":"..."}
```

---

## ⚠️ Security Checklist

**Voordat je live gaat:**

- [ ] `.env` file heeft **chmod 600** permissions (alleen jij kan lezen)
- [ ] `.env` is **NIET in Git** (check `.gitignore`)
- [ ] `PAYLOAD_SECRET` is **nieuw gegenereerd** (niet "mygeneratedsecret")
- [ ] `NODE_ENV=production` is gezet
- [ ] `DATABASE_URL` wijst naar PostgreSQL (niet SQLite!)
- [ ] URLs zijn **https://cms.compassdigital.nl** (niet localhost)
- [ ] reCAPTCHA keys zijn **REAL** (niet test keys!)
- [ ] Stripe keys zijn **LIVE** (niet test keys, als je e-commerce gebruikt)

---

## 📊 Verschil Lokaal vs Server

| Variabele | Lokaal (.env) | Server (.env.server) |
|-----------|---------------|----------------------|
| `DATABASE_URL` | `file:./payload.db` | `postgresql://...` |
| `NODE_ENV` | `development` | `production` |
| `PAYLOAD_PUBLIC_SERVER_URL` | `http://localhost:3020` | `https://cms.compassdigital.nl` |
| `NEXT_PUBLIC_SERVER_URL` | `http://localhost:3020` | `https://cms.compassdigital.nl` |
| `PAYLOAD_SECRET` | `mygeneratedsecret` | **NIEUWE SECRET!** |
| `RECAPTCHA_*` | Test keys (6LeIxAc...) | **REAL KEYS!** |
| `STRIPE_*` | `sk_test_...` | `sk_live_...` (optioneel) |
| `RESEND_API_KEY` | (empty) | **REAL KEY!** (optioneel) |
| `NEXT_PUBLIC_GA_ID` | (empty) | `G-XXX` (optioneel) |
| `NEXT_PUBLIC_SENTRY_DSN` | (empty) | **REAL DSN!** (optioneel) |

**Blijven hetzelfde:**
- OpenAI API key ✅ (al live)
- Ploi tokens ✅ (al live)
- Cloudflare tokens ✅ (al live)
- Railway database URL ✅ (al live)
- Feature flags ✅
- AI configuratie ✅

---

## 🚀 Quick Deploy Commands

**Voor Ploi deployment:**

```bash
# 1. SSH naar server
ssh user@your-server-ip

# 2. Ga naar app directory
cd /home/ploi/cms.compassdigital.nl

# 3. Kopieer .env.server naar .env
cp .env.server .env

# 4. Edit .env (gebruik nano of vim)
nano .env

# 5. Wijzig:
# - DATABASE_URL (✅ al goed)
# - PAYLOAD_PUBLIC_SERVER_URL → https://cms.compassdigital.nl
# - NEXT_PUBLIC_SERVER_URL → https://cms.compassdigital.nl
# - NODE_ENV → production
# - PAYLOAD_SECRET → (genereer nieuwe: openssl rand -base64 32)
# - Add RESEND_API_KEY, NEXT_PUBLIC_GA_ID, etc. (optioneel)
# - Add REAL reCAPTCHA keys (kritiek!)
# - Add LIVE Stripe keys (als e-commerce)

# 6. Save en exit (Ctrl+X, Y, Enter)

# 7. Set correct permissions
chmod 600 .env

# 8. Restart app
pm2 restart all
# Of
npm run start

# 9. Verify
curl https://cms.compassdigital.nl/api/health
```

---

## 🎓 Waarom Deze Verschillen?

### Database: SQLite → PostgreSQL

**Lokaal:**
```bash
DATABASE_URL=file:./payload.db  # Makkelijk voor development
```

**Server:**
```bash
DATABASE_URL=postgresql://...   # Production-ready, multi-client support
```

**Waarom:** SQLite is file-based en niet geschikt voor production. PostgreSQL is robuust en schaalt goed.

### URLs: localhost → productie domain

**Lokaal:**
```bash
NEXT_PUBLIC_SERVER_URL=http://localhost:3020
```

**Server:**
```bash
NEXT_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
```

**Waarom:** Frontend code gebruikt deze URL voor API calls. Moet wijzen naar productie domain.

### Secrets: Dev → Production

**Lokaal:**
```bash
PAYLOAD_SECRET=mygeneratedsecret  # Bekend dev secret
RECAPTCHA_SECRET_KEY=6LeIxAc...   # Google test key
```

**Server:**
```bash
PAYLOAD_SECRET=<RANDOM_32_BYTES>  # Unieke secret
RECAPTCHA_SECRET_KEY=6Lc_REAL...  # Echte key
```

**Waarom:** Dev secrets zijn publiek bekend. Production secrets moeten uniek en geheim zijn.

---

## ✅ Checklist: Klaar voor Deployment?

### Environment File
- [ ] `.env.server` template gekopieerd naar server
- [ ] Hernoemd naar `.env`
- [ ] `DATABASE_URL` = PostgreSQL (niet SQLite!)
- [ ] URLs wijzen naar `https://cms.compassdigital.nl`
- [ ] `NODE_ENV=production`
- [ ] `PAYLOAD_SECRET` is nieuwe random secret
- [ ] File permissions: `chmod 600 .env`

### Production Keys (Kritiek!)
- [ ] reCAPTCHA: REAL keys (niet 6LeIxAc... test keys!)

### Production Keys (Optioneel maar aanbevolen)
- [ ] Resend: Email API key
- [ ] Google Analytics: GA4 Measurement ID
- [ ] Sentry: Error tracking DSN
- [ ] Stripe: Live keys (als e-commerce)

### Verification
- [ ] `npm run build` succesvol
- [ ] `npm run start` start zonder errors
- [ ] `curl https://cms.compassdigital.nl/api/health` returns healthy
- [ ] Admin panel bereikbaar: https://cms.compassdigital.nl/admin
- [ ] Login werkt

---

## 💡 Pro Tips

1. **Use Environment Secrets Manager**
   - Ploi heeft een "Environment" sectie waar je vars kan opslaan
   - Veiliger dan plain `.env` file
   - Auto-reloads bij wijzigingen

2. **Backup je .env**
   ```bash
   # Op server
   cp .env .env.backup
   chmod 600 .env.backup
   ```

3. **Monitor je logs**
   ```bash
   # PM2 logs
   pm2 logs

   # Zoek naar errors met .env
   pm2 logs | grep "env"
   ```

4. **Test eerst in staging**
   - Maak een staging environment (staging.compassdigital.nl)
   - Test alle .env wijzigingen daar eerst
   - Dan pas naar production

---

## 📞 Troubleshooting

**Error: "DATABASE_URL not configured"**
- Check of `.env` file bestaat op server
- Verify `DATABASE_URL` is set (niet commented out)
- Check file permissions: `ls -la .env`

**Error: "fetch failed" bij API calls**
- Check of `NEXT_PUBLIC_SERVER_URL` klopt
- Moet zijn: `https://cms.compassdigital.nl` (HTTPS!)
- Niet: `http://localhost:3020`

**reCAPTCHA fails met "Invalid site key"**
- Je gebruikt nog test keys (6LeIxAc...)
- Genereer echte keys op https://www.google.com/recaptcha/admin
- Add domain: `cms.compassdigital.nl`

**Emails worden niet verstuurd**
- Check of `RESEND_API_KEY` is gezet
- Verify key is valid op https://resend.com
- Check logs: `pm2 logs | grep resend`

---

**Ready to deploy! 🚀**

Gebruik `.env.server` als template en pas de gemarkeerde variabelen aan voor je server deployment.
