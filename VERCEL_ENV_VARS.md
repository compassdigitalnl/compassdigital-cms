# 🚀 VERCEL ENVIRONMENT VARIABLES - MUST CONFIGURE!

## ⚠️ CRITICAL - Required for /admin to work

Ga naar: https://vercel.com/dashboard → Project → Settings → Environment Variables

### 1. PAYLOAD_SECRET (REQUIRED!)
```
Name:  PAYLOAD_SECRET
Value: mygeneratedsecret
Environments: Production, Preview, Development
```
**Waarom:** Voor JWT tokens, encryption, session management
**Impact:** Admin panel kan niet starten zonder deze!

---

### 2. DATABASE_URL (REQUIRED!)
```
Name:  DATABASE_URL
Value: postgresql://user:password@host:port/database
Environments: Production, Preview, Development
```
**Waarom:** Verbinding met je Railway PostgreSQL database
**Impact:** Zonder deze kan Payload geen data opslaan/ophalen!
**Get your value from:** Railway Dashboard → Database → Connection String

---

### 3. NEXT_PUBLIC_SERVER_URL (REQUIRED!)
```
Name:  NEXT_PUBLIC_SERVER_URL
Value: https://compassdigital-4w4rf618j-compass-digital-50e6916c.vercel.app
Environments: Production, Preview, Development
```
**Update deze naar je ECHTE Vercel URL!**
**Waarom:** Frontend gebruikt deze voor API calls
**Impact:** Routes en links werken niet zonder!

---

### 4. PAYLOAD_PUBLIC_SERVER_URL (REQUIRED!)
```
Name:  PAYLOAD_PUBLIC_SERVER_URL
Value: https://compassdigital-4w4rf618j-compass-digital-50e6916c.vercel.app
Environments: Production, Preview, Development
```
**Update deze naar je ECHTE Vercel URL!**
**Waarom:** Payload admin panel gebruikt deze voor asset loading
**Impact:** Admin assets laden niet, panel crasht!

---

## ✅ RECOMMENDED - Voor production features

### 5. OPENAI_API_KEY (Optional - AI features)
```
Name:  OPENAI_API_KEY
Value: sk-proj-YOUR_OPENAI_API_KEY_HERE
Environments: Production, Preview
```
**Get from:** https://platform.openai.com/api-keys

### 6. NEXT_PUBLIC_RECAPTCHA_SITE_KEY (Optional - Spam protection)
```
Name:  NEXT_PUBLIC_RECAPTCHA_SITE_KEY
Value: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
Environments: Production, Preview, Development
```

### 7. RECAPTCHA_SECRET_KEY (Optional - Spam protection)
```
Name:  RECAPTCHA_SECRET_KEY
Value: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
Environments: Production, Preview, Development
```

---

## 🎯 HOE TE CONFIGUREREN IN VERCEL

### Via Dashboard (Makkelijkst):
1. Ga naar: https://vercel.com/dashboard
2. Klik op je project: `compassdigital-cms`
3. Ga naar: Settings → Environment Variables
4. Klik: "Add New"
5. Vul in:
   - Key: PAYLOAD_SECRET
   - Value: mygeneratedsecret
   - Select environments: Production, Preview, Development
6. Klik "Save"
7. Herhaal voor alle andere variables

### Via Vercel CLI (Sneller):
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add PAYLOAD_SECRET production
# → Enter: mygeneratedsecret

vercel env add DATABASE_URL production
# → Enter: postgresql://user:password@host:port/database (from Railway)

vercel env add NEXT_PUBLIC_SERVER_URL production
# → Enter: https://your-domain.vercel.app

vercel env add PAYLOAD_PUBLIC_SERVER_URL production
# → Enter: https://your-domain.vercel.app
```

---

## 🔄 NA CONFIGURATIE

### 1. Redeploy (REQUIRED!)
Environment variables worden alleen actief na een nieuwe deployment:

```bash
# Optie A: Via Dashboard
Ga naar Deployments → Klik op "..." → Redeploy

# Optie B: Via CLI
vercel --prod

# Optie C: Push naar Git (auto-deploys)
git commit --allow-empty -m "Trigger redeploy"
git push
```

### 2. Test /admin
```
https://your-domain.vercel.app/admin

Verwacht: Payload login scherm
Als het werkt: Inloggen met je admin user
Als het NIET werkt: Check Vercel logs (zie hieronder)
```

---

## 🔍 HOE LOGS BEKIJKEN IN VERCEL

### Via Dashboard:
1. Ga naar: https://vercel.com/dashboard
2. Klik op je project
3. Klik op "Deployments"
4. Klik op laatste deployment
5. Klik op "Functions" tab
6. Scroll naar beneden → Zie error logs

### Via CLI:
```bash
# Realtime logs
vercel logs --follow

# Last 100 logs
vercel logs

# Filter op errors
vercel logs --filter error
```

---

## 🚨 COMMON ERRORS & FIXES

### Error: "Cannot connect to database"
**Fix:** Check DATABASE_URL in Vercel env vars
```bash
vercel env ls
# → Check if DATABASE_URL exists
```

### Error: "PAYLOAD_SECRET is required"
**Fix:** Add PAYLOAD_SECRET to Vercel
```bash
vercel env add PAYLOAD_SECRET production
```

### Error: "Invalid server URL"
**Fix:** Update NEXT_PUBLIC_SERVER_URL to match Vercel domain
```
Was: http://localhost:3020
Should be: https://your-domain.vercel.app
```

### Error: "Module not found" or build failures
**Fix:** Check if dependencies are in package.json (not devDependencies)
```bash
# Check your package.json - move these to "dependencies" if needed:
- @payloadcms/db-postgres
- @payloadcms/richtext-lexical
- payload
```

---

## ✅ VERIFICATION CHECKLIST

Na configuratie, check deze URLs:

- [ ] `https://your-domain.vercel.app` → Homepage loads
- [ ] `https://your-domain.vercel.app/admin` → Admin login screen
- [ ] `https://your-domain.vercel.app/api/health` → Returns 200 OK
- [ ] Vercel logs → No errors
- [ ] Database → Can login to admin

---

## 📚 EXTRA INFO

### Waarom NEXT_PUBLIC_* prefix?
Variables met `NEXT_PUBLIC_` worden embedded in de browser bundle (client-side).
Variables zonder deze prefix zijn alleen server-side beschikbaar.

**Examples:**
```typescript
// Client-side (browser) - needs NEXT_PUBLIC_
console.log(process.env.NEXT_PUBLIC_SERVER_URL) // ✅ Works

// Server-side only
console.log(process.env.DATABASE_URL) // ✅ Works (server)
console.log(process.env.DATABASE_URL) // ❌ Undefined (browser)
```

### Vercel Build Process
```
1. Git Push → Triggers Vercel build
2. Vercel clones repo
3. Installs dependencies (npm install)
4. Runs build (npm run build)
5. Reads environment variables from dashboard
6. Deploys to edge network
7. /admin route becomes a serverless function
```

---

**Last updated:** February 12, 2026
**Status:** Ready to configure! 🚀
