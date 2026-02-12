# 🚀 VERCEL QUICK START - FIX "/admin" ERROR

**Problem:** `MIDDLEWARE_INVOCATION_FAILED` + "Site Not Found"
**Cause:** Missing environment variables in Vercel
**Fix Time:** 5 minutes

---

## ⚡ QUICK FIX (5 MINUTEN)

### Stap 1: Open Vercel Dashboard
```
https://vercel.com/compass-digital-50e6916c/compassdigital-cms/settings/environment-variables
```

### Stap 2: Voeg deze 4 CRITICAL variables toe:

| Variable Name | Value | Waarom Critical |
|--------------|--------|-----------------|
| `DATABASE_URL` | `postgresql://user:password@host:port/database` | **Middleware crasht zonder!** ← Get from Railway |
| `PLATFORM_DATABASE_URL` | Same as DATABASE_URL | Fallback voor multi-tenant |
| `PAYLOAD_SECRET` | Generate: `openssl rand -base64 32` | **Admin panel kan niet starten** |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-domain.vercel.app` | Voor asset loading |

**Voor alle 4:** Select **Production, Preview, Development**

### Stap 3: Redeploy
```bash
# Optie A: In Vercel Dashboard
Go to Deployments → Click "..." → Redeploy

# Optie B: Via git push
git commit --allow-empty -m "Trigger redeploy with env vars"
git push
```

### Stap 4: Test
```
✅ https://cms.compassdigital.nl/admin
   → Should show Payload login screen

❌ DON'T USE preview URLs like:
   compassdigital-xxx-compass-digital.vercel.app
   → These are treated as tenant subdomains!
```

---

## 🎯 WAAROM DIT GEBEURT

### Je Middleware (src/middleware.ts):

```typescript
// Regel 185-191: Database connectie
const client = new Client({
  connectionString: process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect() // ← CRASHT als env vars ontbreken!
```

**Als DATABASE_URL ontbreekt:**
1. Middleware kan geen database connectie maken
2. `await client.connect()` throws error
3. Hele request crasht → `MIDDLEWARE_INVOCATION_FAILED`

### Preview URLs worden gezien als Tenant Subdomains:

```typescript
// Regel 242-270: Subdomain detection
const subdomain = extractSubdomain(hostname)

if (subdomain) {
  // compassdigital-i7eoku9sx-... wordt gezien als tenant!
  const tenant = await getTenant(subdomain)

  if (!tenant) {
    // "Site Not Found" error!
    return new NextResponse(`Subdomain "${subdomain}" does not exist`, { status: 404 })
  }
}
```

**Vercel preview URLs bevatten hyphens:**
- `compassdigital-abc123-compass-digital.vercel.app`
- Wordt gedetecteerd als subdomain: `compassdigital-abc123-compass-digital`
- Middleware zoekt tenant in database
- Niet gevonden → "Site Not Found"

---

## 📊 URLS UITGELEGD

### ✅ GEBRUIK DEZE:

```
Production:  https://cms.compassdigital.nl
             └─ Custom domain, werkt correct!

Root Vercel: https://compassdigital-cms.vercel.app (als dit je root deployment is)
             └─ Geen subdomain, wordt gezien als platform
```

### ❌ GEBRUIK DEZE NIET:

```
Preview:     https://compassdigital-abc-compass-digital.vercel.app
             └─ Wordt gezien als tenant subdomain!

Branch:      https://compassdigital-xyz-compass-digital.vercel.app
             └─ Wordt gezien als tenant subdomain!
```

**Waarom?**
- Vercel preview URLs hebben formaat: `[project]-[hash]-[team].vercel.app`
- Je middleware denkt dat `[project]-[hash]-[team]` een tenant subdomain is!

---

## 🔧 PERMANENTE FIX (Optioneel)

### Optie A: Verbeter Error Handling in Middleware

Update `src/middleware.ts` regel 185-222:

```typescript
// Get tenant from database (with caching)
async function getTenant(subdomain: string): Promise<any | null> {
  const cacheKey = `tenant:${subdomain}`
  const cached = tenantCache.get(cacheKey)

  if (cached && Date.now() < cached.expiresAt) {
    return cached.data
  }

  // ✅ ADD: Skip if no database configured
  if (!process.env.DATABASE_URL && !process.env.PLATFORM_DATABASE_URL) {
    console.warn('[MIDDLEWARE] No database URL configured, skipping tenant lookup')
    return null
  }

  const client = new Client({
    connectionString: process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()

    const result = await client.query(
      'SELECT * FROM tenants WHERE subdomain = $1 AND status = $2',
      [subdomain, 'active']
    )

    // ... rest stays same
  } catch (error) {
    console.error('Error fetching tenant:', error)
    // ✅ ADD: Return null instead of crashing
    return null
  } finally {
    try {
      await client.end()
    } catch (err) {
      // Ignore connection close errors
    }
  }
}
```

### Optie B: Skip Middleware for Vercel Preview URLs

Update `src/middleware.ts` regel 145-172:

```typescript
function extractSubdomain(hostname: string): string | null {
  // Development: localhost
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return null
  }

  // ✅ ADD: Skip Vercel preview URLs
  if (hostname.includes('vercel.app') && !hostname.startsWith('cms.')) {
    // This is a Vercel preview URL, not a tenant subdomain
    return null
  }

  // Split hostname
  const parts = hostname.split('.')

  // Need at least 3 parts for subdomain
  if (parts.length < 3) {
    return null
  }

  const subdomain = parts[0]

  // Skip www and platform subdomains
  if (subdomain === 'www' || subdomain === 'cms') {
    return null
  }

  return subdomain
}
```

---

## 🎯 SAMENVATTING

### Huidige Situatie:
- ❌ Preview URLs crashen (gezien als tenant subdomains)
- ❌ Middleware crasht zonder DATABASE_URL
- ❌ /admin geeft 500 error

### Na Environment Variables Toevoegen:
- ✅ https://cms.compassdigital.nl/admin werkt!
- ✅ Database connectie succesvol
- ✅ Middleware draait zonder errors

### IMPORTANT:
**Gebruik ALLEEN je production URL: `https://cms.compassdigital.nl`**

Preview URLs werken pas na:
1. Environment variables zijn ingesteld ✓
2. Middleware is aangepast (optie A of B hierboven)

---

## 🚨 CHECKLIST

Before testing:
- [ ] Added `DATABASE_URL` to Vercel env vars
- [ ] Added `PLATFORM_DATABASE_URL` to Vercel env vars
- [ ] Added `PAYLOAD_SECRET` to Vercel env vars
- [ ] Added `NEXT_PUBLIC_SERVER_URL` to Vercel env vars
- [ ] Selected "Production, Preview, Development" for all
- [ ] Clicked "Save" for each variable
- [ ] Triggered redeploy

After setup:
- [ ] Test: `https://cms.compassdigital.nl`
- [ ] Test: `https://cms.compassdigital.nl/admin`
- [ ] Test: `https://cms.compassdigital.nl/api/health`
- [ ] Check Vercel logs for errors

---

**Next Step:** Go to Vercel Dashboard and add those 4 environment variables! 🚀

**Last Updated:** February 12, 2026
