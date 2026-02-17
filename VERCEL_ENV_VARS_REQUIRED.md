# 🔑 Required Environment Variables for Vercel (cms.compassdigital.nl)

## ⚡ KRITIEK (Platform werkt NIET zonder deze!)

### 1. Database
```bash
DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway
```
**Waarom:** Railway PostgreSQL - zonder dit geen data!

### 2. Payload Secret
```bash
PAYLOAD_SECRET=mygeneratedsecret
```
**Waarom:** Versleuteling van sessies, JWT tokens, cookies. KRITIEK voor security!

### 3. Server URLs
```bash
NEXT_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
PAYLOAD_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
```
**Waarom:** Platform moet weten op welke URL het draait (voor callbacks, webhooks, API calls)

---

## 🚀 PLOI INTEGRATION (Voor client deployments naar Ploi)

### 4. Ploi API Configuration
```bash
PLOI_API_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZDA0Y2NkMjc0OTBiYWQ5MDk3NGEyMDIyYTZmY2M5OWRmYzdjZGU1ZTk4MTUwOTdlNjg5ZTY4MTE1Nzk5MWM2NDc3MjlkOGVmYTUxZDhjMDMiLCJpYXQiOjE3NzAzMTM5NjUuNjIxMTM1LCJuYmYiOjE3NzAzMTM5NjUuNjIxMTM2LCJleHAiOjE4MzMzODU5NjUuNjE5MzUsInN1YiI6IjM2NjUxIiwic2NvcGVzIjpbInNlcnZlcnMtcmVhZCIsInNlcnZlcnMtY3JlYXRlIiwiZGF0YWJhc2UtcmVhZCIsImRhdGFiYXNlLWNyZWF0ZSIsInN5c3RlbS11c2Vycy1yZWFkIiwic3lzdGVtLXVzZXJzLWNyZWF0ZSIsInNpdGVzLWNyZWF0ZSIsInNpdGVzLWRlbGV0ZSIsInNzaC1rZXlzLXJlYWQiLCJzc2gta2V5cy1jcmVhdGUiLCJjZXJ0aWZpY2F0ZXMtcmVhZCIsImNlcnRpZmljYXRlcy1jcmVhdGUiXX0.Cx9OV8LR-zVgM5yIXCqLlp2tAnqzP8_uR8HLOF7KKWC65gdl28oHOuPbXb2SLz8buIVG3lJTW1bL5NkKLWs-tdAr4r5_R1yhpbW6q4LVJbxgQTl8qyCXDnJcrT0mHK2j3BsGEP9IqWKNqCU77wGY5niyYbVfkFALqKkxJaqmXMYDo7WPRUq-rUzxF52kjdER9eNcN3aL1zgdRD3dWyMgDLrrtdpkFW-R2xpgqqPXcvI9NgBGYws3mDZtagLBgM0N9nix4OKqtCGnZ_ZKPRCJFLFwDRV_felKpMsHUlFxuzHjCK_7Jkt935Ke-JubPRIWDYoc2STVSU1ULnbIidAvvG6rSpWfeYNiMq3XhQvZbQttRw2pW7kyzvEHScE2aagnsa_jFx7c2_VT50RJI3Az_NjX7vdpnXt7MSkF1556PXc7G9QKr13swC4244ocHqXUWoRWCzHwvPD-uW88HCBmTDkbeXNUr8CT6po5z4IhYbN90ZQDJLPbySXHhNS2zixnE2G7szlgFmHh8KJ0IAluka3Q2SWmTF9Uo--ARqMf14o04bmAA2YCTS7Bnf4S7_u5v0nP7sZF04oqM-wOI-MNd_nKrKIv9L2mDsg5z_rpleJ-ANDLd_rKZwRRpzRSuWDTqhlFq0Bqumf0j_6x7o8YX7jFGeyHWI9To_YjQinXsVU

PLOI_SERVER_ID=108942
```
**Waarom:** Zonder dit kan platform geen client sites deployen naar Ploi!

### 5. Deployment Configuration
```bash
DEFAULT_DEPLOYMENT_PROVIDER=ploi
PLATFORM_BASE_URL=compassdigital.nl
```
**Waarom:**
- DEFAULT_DEPLOYMENT_PROVIDER: Welke provider te gebruiken (ploi of vercel)
- PLATFORM_BASE_URL: Voor client subdomains (client1.compassdigital.nl)

---

## 🎨 BELANGRIJK (Platform werkt wel, maar features missen)

### 6. AI Features (OpenAI)
```bash
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
```
**Waarom:** AI content generation, SEO optimization, etc.
**Zonder:** AI features werken niet (rest van platform werkt wel)

---

## 📧 OPTIONEEL (Nice to have)

### 7. Email (Resend)
```bash
RESEND_API_KEY=re_xxx
CONTACT_EMAIL=info@compassdigital.nl
FROM_EMAIL=noreply@compassdigital.nl
```
**Waarom:** Voor contact forms, notificaties
**Zonder:** Emails werken niet (rest van platform werkt)

### 8. Analytics (Google Analytics)
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
**Waarom:** Analytics tracking
**Zonder:** Geen analytics (rest van platform werkt)

### 9. Error Tracking (Sentry)
```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```
**Waarom:** Error monitoring
**Zonder:** Geen error tracking (rest van platform werkt)

### 10. Spam Protection (reCAPTCHA)
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```
**Waarom:** Contact form spam protection
**Zonder:** Meer spam mogelijk (rest van platform werkt)

**NOTE:** Dit zijn Google's test keys - vervangen in productie!

---

## ❌ NIET NODIG op Vercel

Deze staan in je .env maar zijn **NIET nodig** op Vercel:

```bash
# Redis (gebruikt Vercel's eigen caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Stripe (tenzij je payments gebruikt)
STRIPE_SECRET_KEY=sk_test_
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_

# Vercel Deployment (alleen als je Vercel gebruikt als deployment target voor clients)
VERCEL_API_TOKEN=
VERCEL_ORG_ID=
VERCEL_TEAM_ID=
```

---

## 📋 COMPLETE CHECKLIST VOOR VERCEL

### Minimaal Vereist (Platform werkt):
- [x] `DATABASE_URL`
- [x] `PAYLOAD_SECRET`
- [x] `NEXT_PUBLIC_SERVER_URL`
- [x] `PAYLOAD_PUBLIC_SERVER_URL`

### Voor Ploi Client Deployments:
- [ ] `PLOI_API_TOKEN`
- [ ] `PLOI_SERVER_ID`
- [ ] `DEFAULT_DEPLOYMENT_PROVIDER`
- [ ] `PLATFORM_BASE_URL`

### Voor AI Features:
- [ ] `OPENAI_API_KEY`

### Voor Production (Optioneel):
- [ ] `RESEND_API_KEY` + email vars
- [ ] `NEXT_PUBLIC_GA_ID`
- [ ] `NEXT_PUBLIC_SENTRY_DSN` + Sentry vars
- [ ] Real `RECAPTCHA` keys (niet test keys)

---

## 🎯 QUICK COPY-PASTE voor Vercel

```bash
# ========================================
# KRITIEK - Platform werkt niet zonder!
# ========================================

DATABASE_URL=postgresql://postgres:eBTNOrSGwkADvgAVJKyQtllGSjugdtrN@shinkansen.proxy.rlwy.net:29352/railway
PAYLOAD_SECRET=mygeneratedsecret
NEXT_PUBLIC_SERVER_URL=https://cms.compassdigital.nl
PAYLOAD_PUBLIC_SERVER_URL=https://cms.compassdigital.nl

# ========================================
# PLOI - Client deployments
# ========================================

PLOI_API_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZDA0Y2NkMjc0OTBiYWQ5MDk3NGEyMDIyYTZmY2M5OWRmYzdjZGU1ZTk4MTUwOTdlNjg5ZTY4MTE1Nzk5MWM2NDc3MjlkOGVmYTUxZDhjMDMiLCJpYXQiOjE3NzAzMTM5NjUuNjIxMTM1LCJuYmYiOjE3NzAzMTM5NjUuNjIxMTM2LCJleHAiOjE4MzMzODU5NjUuNjE5MzUsInN1YiI6IjM2NjUxIiwic2NvcGVzIjpbInNlcnZlcnMtcmVhZCIsInNlcnZlcnMtY3JlYXRlIiwiZGF0YWJhc2UtcmVhZCIsImRhdGFiYXNlLWNyZWF0ZSIsInN5c3RlbS11c2Vycy1yZWFkIiwic3lzdGVtLXVzZXJzLWNyZWF0ZSIsInNpdGVzLWNyZWF0ZSIsInNpdGVzLWRlbGV0ZSIsInNzaC1rZXlzLXJlYWQiLCJzc2gta2V5cy1jcmVhdGUiLCJjZXJ0aWZpY2F0ZXMtcmVhZCIsImNlcnRpZmljYXRlcy1jcmVhdGUiXX0.Cx9OV8LR-zVgM5yIXCqLlp2tAnqzP8_uR8HLOF7KKWC65gdl28oHOuPbXb2SLz8buIVG3lJTW1bL5NkKLWs-tdAr4r5_R1yhpbW6q4LVJbxgQTl8qyCXDnJcrT0mHK2j3BsGEP9IqWKNqCU77wGY5niyYbVfkFALqKkxJaqmXMYDo7WPRUq-rUzxF52kjdER9eNcN3aL1zgdRD3dWyMgDLrrtdpkFW-R2xpgqqPXcvI9NgBGYws3mDZtagLBgM0N9nix4OKqtCGnZ_ZKPRCJFLFwDRV_felKpMsHUlFxuzHjCK_7Jkt935Ke-JubPRIWDYoc2STVSU1ULnbIidAvvG6rSpWfeYNiMq3XhQvZbQttRw2pW7kyzvEHScE2aagnsa_jFx7c2_VT50RJI3Az_NjX7vdpnXt7MSkF1556PXc7G9QKr13swC4244ocHqXUWoRWCzHwvPD-uW88HCBmTDkbeXNUr8CT6po5z4IhYbN90ZQDJLPbySXHhNS2zixnE2G7szlgFmHh8KJ0IAluka3Q2SWmTF9Uo--ARqMf14o04bmAA2YCTS7Bnf4S7_u5v0nP7sZF04oqM-wOI-MNd_nKrKIv9L2mDsg5z_rpleJ-ANDLd_rKZwRRpzRSuWDTqhlFq0Bqumf0j_6x7o8YX7jFGeyHWI9To_YjQinXsVU
PLOI_SERVER_ID=108942
DEFAULT_DEPLOYMENT_PROVIDER=ploi
PLATFORM_BASE_URL=compassdigital.nl

# ========================================
# AI Features
# ========================================

OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
```

---

## 📝 Hoe toevoegen in Vercel:

1. **Go to:** https://vercel.com/compassdigitalnl/your-project/settings/environment-variables

2. **Voor elke variable:**
   - Click **"Add New"**
   - Name: `DATABASE_URL` (bijvoorbeeld)
   - Value: `postgresql://postgres:...` (paste waarde)
   - Environment: Select **ALL** (Production, Preview, Development)
   - Click **Save**

3. **Herhaal voor alle variables hierboven**

4. **Redeploy:**
   - Go to: **Deployments** tab
   - Click **"..."** → **"Redeploy"**

---

## ✅ Verification

Na deployment check:
```bash
# Check if platform loads:
curl https://cms.compassdigital.nl

# Check if admin works:
curl https://cms.compassdigital.nl/admin

# Check if API works:
curl https://cms.compassdigital.nl/api/health
```

---

**🎯 TL;DR:**

**Minimaal (4 vars):** DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL, PAYLOAD_PUBLIC_SERVER_URL

**Voor Ploi (+4 vars):** PLOI_API_TOKEN, PLOI_SERVER_ID, DEFAULT_DEPLOYMENT_PROVIDER, PLATFORM_BASE_URL

**Voor AI (+1 var):** OPENAI_API_KEY

**Totaal voor volledige functionaliteit: 9 environment variables**
