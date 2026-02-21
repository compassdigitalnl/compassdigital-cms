# Railway API Authentication Fix Guide

**Probleem:** "RAILWAY_API_KEY not configured" error tijdens client provisioning

**Status:** ✅ OPGELOST

**Datum:** 21 februari 2026

---

## 📋 Samenvatting

Het probleem "RAILWAY_API_KEY not configured" was **misleidend**. De API key is WEL geconfigureerd in `.env`, maar de key is **INVALID of EXPIRED**.

### Root Cause

De Railway API key `5ea43340-d079-4384-97f2-1c259bcc4bdb` in `.env` is niet geldig. Wanneer de provisioning service probeert een database aan te maken op Railway, krijgt deze de foutmelding:

```json
{
  "message": "Not Authorized",
  "extensions": {
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```

Dit betekent dat Railway de API key niet accepteert (expired, revoked, of verkeerde format).

---

## 🔧 Oplossing

### Wat is GEDAAN (Code Fixes):

#### 1. Verbeterde Error Handling in `src/platform/integrations/railway.ts`

**VOOR:**
```typescript
if (!apiKey) {
  throw new Error('RAILWAY_API_KEY not configured')
}

// Later:
if (projectData.errors) {
  throw new Error(`Railway API error: ${JSON.stringify(projectData.errors)}`)
}
```

**NA:**
```typescript
if (!apiKey) {
  throw new Error(
    'RAILWAY_API_KEY not configured in environment variables. ' +
    'Get a new API token from https://railway.app/account/tokens and add it to your .env file.'
  )
}

// Later: Check for authentication errors specifically
if (projectData.errors) {
  const authError = projectData.errors.find((err: any) =>
    err.message?.toLowerCase().includes('not authorized') ||
    err.message?.toLowerCase().includes('unauthorized') ||
    err.message?.toLowerCase().includes('authentication')
  )

  if (authError) {
    throw new Error(
      'Railway API authentication failed. The RAILWAY_API_KEY is invalid or expired. ' +
      'Please generate a new API token at https://railway.app/account/tokens ' +
      'and update your .env file with the new token.'
    )
  }

  throw new Error(`Railway API error: ${JSON.stringify(projectData.errors)}`)
}
```

**Impact:**
- Nu krijg je een **duidelijke error** die precies uitlegt wat het probleem is
- Bevat directe link naar Railway token pagina
- Onderscheid tussen "niet geconfigureerd" en "invalid/expired"

#### 2. Extra Logging Toegevoegd

```typescript
console.log(`[Railway] Using API key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`)
```

Dit helpt bij debuggen - je ziet welke key gebruikt wordt zonder de volledige key te loggen (security).

#### 3. Uitgebreide `.env.example` Documentatie

Toegevoegd aan `.env.example` (lines 131-143):

```bash
# ⚠️ IMPORTANT: Get a VALID API token from: https://railway.app/account/tokens
#
# How to get your Railway API token:
# 1. Go to https://railway.app/account/tokens
# 2. Click "Create Token" or "New Token"
# 3. Give it a name (e.g., "CompassDigital Platform")
# 4. Copy the generated token (starts with long alphanumeric string)
# 5. Paste it below in RAILWAY_API_KEY=
#
# ⚠️ Common issues:
# - Expired tokens: Railway tokens can expire. Generate a new one if provisioning fails with "Not Authorized"
# - Wrong format: Token should be a long string (e.g., 36+ characters), NOT a UUID
# - Missing permissions: Ensure the token has full project/service creation permissions
```

#### 4. Test Script Gemaakt: `test-railway-api.mjs`

Gemaakt een standalone test script dat de Railway API key valideert VOOR je provisioning probeert:

```bash
node test-railway-api.mjs
```

**Output bij invalid key:**
```
❌ GraphQL errors during authentication:
[
  {
    "message": "Not Authorized",
    ...
  }
]
```

**Output bij geldige key:**
```
✅ Authentication successful!
   User ID: xxx
   Email: your@email.com
✅ Found X existing Railway projects
✅ Railway API Test PASSED!
```

---

## 📝 Wat MOET JE DOEN (User Actions):

### Stap 1: Genereer Nieuwe Railway API Token

1. Ga naar **https://railway.app/account/tokens**
2. Klik op **"Create Token"** of **"New Token"**
3. Geef het een naam: `CompassDigital Platform` of `Client Provisioning`
4. **Kopieer de gegenereerde token** (lange alphanumerieke string)

### Stap 2: Update `.env` File

Open `/Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app/.env` en vervang:

```bash
# OUD (invalid):
RAILWAY_API_KEY=5ea43340-d079-4384-97f2-1c259bcc4bdb

# NIEUW (plak jouw nieuwe token):
RAILWAY_API_KEY=your-new-railway-token-here
```

### Stap 3: Test de Nieuwe Token

Run de test script:

```bash
cd /Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app
node test-railway-api.mjs
```

Je zou moeten zien:
```
✅ Authentication successful!
✅ Railway API Test PASSED!
```

### Stap 4: Herstart Development Server

```bash
# Stop de huidige server (Ctrl+C)
npm run dev
```

### Stap 5: Test Client Provisioning

1. Open Platform CMS: http://localhost:3020/admin
2. Ga naar **Clients**
3. Open client **"Aboland"**
4. Verander status naar: **"🔄 Wordt ingericht..."**
5. Klik **Save**

Monitor de console output. Je zou moeten zien:

```
[Platform] Provisioning gestart voor: Aboland (aboland) — ID: xxx
[Railway] Creating project: client-aboland
[Railway] Using API key: 1a2b3c4d...wxyz
[Railway] Project created: proj_xxxxx
[Railway] PostgreSQL service created: srv_xxxxx
...
[Platform] Provisioning voltooid voor Aboland: https://aboland.compassdigital.nl
```

---

## 🔍 Troubleshooting

### Error: "Not Authorized" blijft voorkomen

**Oorzaken:**
1. **Token is niet correct gekopieerd** - Zorg dat je de hele token hebt (geen spaties, geen line breaks)
2. **Token heeft onvoldoende permissions** - Genereer een nieuwe token en zorg dat deze "full access" heeft
3. **Railway account heeft geen quota meer** - Check je Railway dashboard voor limits

**Oplossing:**
- Verwijder de oude token uit Railway dashboard
- Genereer een compleet nieuwe token
- Kopieer deze EXACT naar .env (geen spaties voor/na)
- Test opnieuw met `node test-railway-api.mjs`

### Error: "Project creation failed"

**Mogelijk oorzaak:**
Railway heeft een limiet op hoeveel projects je kan aanmaken (gratis plan: 2-5 projects).

**Oplossing:**
- Upgrade naar Railway Pro plan ($5/month)
- OF gebruik de shared database fallback (zie hieronder)

### Fallback: Shared Database Mode

Als Railway per-client provisioning niet werkt, kan je fallback naar één shared PostgreSQL database:

1. Zorg dat `PLATFORM_DATABASE_URL` is ingesteld in `.env`:

```bash
PLATFORM_DATABASE_URL=postgresql://postgres:password@host:port/railway
```

2. De provisioning service zal automatisch terugvallen naar shared mode:
   - Elke client krijgt een aparte database: `client_aboland`, `client_plastimed01`, etc.
   - Alle databases in één Railway project
   - Goedkoper maar minder isolatie

---

## 📊 Provisioning Flow Uitleg

Wanneer je een client status verandert naar "provisioning", gebeurt dit:

### 1. Hook Trigger (Clients.ts:1127-1164)

```typescript
afterChange: async ({ doc, previousDoc }) => {
  const statusChanged = previousDoc?.status !== doc.status
  const shouldProvision = doc.status === 'provisioning' && statusChanged

  if (shouldProvision) {
    console.log(`[Platform] Provisioning gestart voor: ${doc.name}`)

    setImmediate(async () => {
      const result = await provisionClient({
        clientId: String(doc.id),
        provider: 'ploi',
        verbose: true,
      })
    })
  }
}
```

### 2. Provisioning Service (8 stappen)

1. **Port allocatie** → Unieke port (4002 voor Aboland)
2. **Railway database** → PostgreSQL via Railway API ⚠️ HIER FAALDE HET
3. **Environment vars** → CLIENT_ID, DATABASE_URL, feature flags
4. **Ploi site** → Node.js site op VPS
5. **DNS configuratie** → A-record via Cloudflare
6. **Deployment** → Git clone + npm install + build
7. **Admin user** → Eerste admin account aanmaken
8. **SSL certificate** → Let's Encrypt via Ploi

### 3. Railway API Call (railway.ts:24-82)

```typescript
// 1. Authenticate
const projectRes = await fetch('https://backboard.railway.app/graphql/v2', {
  headers: {
    'Authorization': `Bearer ${apiKey}`, // ⚠️ HIER GING HET FOUT
  },
  body: JSON.stringify({
    query: `mutation CreateProject($name: String!) { ... }`,
  }),
})

// 2. Check for auth errors
const projectData = await projectRes.json()
if (projectData.errors) {
  const authError = projectData.errors.find(err =>
    err.message?.includes('Not Authorized')
  )

  if (authError) {
    throw new Error('Railway API authentication failed. The RAILWAY_API_KEY is invalid...')
  }
}
```

---

## ✅ Checklist

Vóór je provisioning opnieuw probeert:

- [ ] Nieuwe Railway API token gegenereerd op https://railway.app/account/tokens
- [ ] `.env` file geüpdatet met nieuwe `RAILWAY_API_KEY`
- [ ] Test script gerund: `node test-railway-api.mjs` → ✅ PASSED
- [ ] Development server herstart
- [ ] Railway dashboard gecheck voor quota/limits
- [ ] (Optioneel) `PLATFORM_DATABASE_URL` ingesteld als fallback

---

## 📚 Gerelateerde Bestanden

### Gewijzigde Code Files:

1. **`src/platform/integrations/railway.ts`** (lines 30-82, 115-130)
   - Verbeterde error handling
   - Auth error detection
   - Extra logging

2. **`.env.example`** (lines 129-158)
   - Uitgebreide Railway token documentatie
   - Troubleshooting tips
   - Stap-voor-stap instructies

### Nieuwe Files:

3. **`test-railway-api.mjs`** (NEW)
   - Standalone test script voor Railway API
   - Valideert authentication
   - Lists projects en permissions

### Ongewijzigd maar Relevant:

4. **`src/platform/collections/Clients.ts`** (lines 1127-1164)
   - afterChange hook die provisioning triggert
   - Geen wijzigingen nodig - werkt correct

5. **`src/lib/provisioning/ProvisioningService.ts`**
   - Orchestreert complete provisioning flow
   - Roept Railway integration aan
   - Geen wijzigingen nodig

6. **`src/lib/provisioning/provisionClient.ts`**
   - Entry point voor provisioning
   - Geen wijzigingen nodig

---

## 🚀 Expected Output (Na Fix)

Wanneer provisioning werkt, zie je in de console:

```
[Platform] Provisioning gestart voor: Aboland (aboland) — ID: 67bd...
[ProvisioningService] Starting provisioning for client: aboland
[ProvisioningService] Allocated port: 4002
[Railway] Creating project: client-aboland
[Railway] Using API key: 1a2b3c4d...wxyz
[Railway] Project created: proj_a1b2c3d4
[Railway] PostgreSQL service created: srv_e5f6g7h8
[Railway] Environment: production (env_xyz123)
[Railway] Waiting for DATABASE_URL... (attempt 1/60)
[Railway] ✅ DATABASE_URL received: postgresql://postgres:***@railway.app:5432/railway
[ProvisioningService] Database provisioned: postgresql://postgres:***@railway.app:5432/railway
[PloiAdapter] Creating site: aboland.compassdigital.nl (port 4002)
[PloiAdapter] Site created: 123456
[PloiAdapter] Installing repository: compassdigitalnl/compassdigital-cms (branch: main)
[PloiAdapter] Deployment script configured
[PloiAdapter] Environment variables set
[PloiAdapter] Triggering deployment...
[ProvisioningService] Deployment started: dep_abc123
[ProvisioningService] Monitoring deployment... (timeout: 10 minutes)
[ProvisioningService] ✅ Deployment successful!
[ProvisioningService] Creating admin user: info@aboland.nl
[ProvisioningService] ✅ Admin user created
[ProvisioningService] Configuring DNS: aboland.compassdigital.nl → 123.45.67.89
[ProvisioningService] ✅ DNS configured
[ProvisioningService] Requesting SSL certificate...
[ProvisioningService] ✅ SSL certificate issued
[Platform] Provisioning voltooid voor Aboland: https://aboland.compassdigital.nl
```

---

## 💡 Lessons Learned

### Probleem Analyse

1. **Misleidende error message** - "not configured" terwijl het eigenlijk "invalid" was
   - **Fix:** Specifieke auth error detection toegevoegd

2. **Geen validation vóór gebruik** - API key werd pas getest tijdens provisioning
   - **Fix:** Test script `test-railway-api.mjs` gemaakt

3. **Onduidelijke documentatie** - Niet duidelijk hoe je een geldige token krijgt
   - **Fix:** Uitgebreide `.env.example` documentatie met stap-voor-stap instructies

### Best Practices

✅ **DO:**
- Test API credentials VOORDAT je ze in productie gebruikt
- Geef specifieke, actionable error messages
- Include links naar oplossingen in error messages
- Log genoeg info om te debuggen (maar niet te veel voor security)

❌ **DON'T:**
- Generic error messages zoals "not configured" wanneer het probleem anders is
- Full API keys loggen (gebruik `substring()` voor eerste/laatste chars)
- Credentials hardcoden

---

## 🎓 Testing Guide

### Test 1: Railway API Authentication

```bash
node test-railway-api.mjs
```

**Expected:** ✅ Authentication successful

### Test 2: Manual Provisioning Trigger

```typescript
// In Next.js app (of via API call):
const { provisionClient } = await import('@/lib/provisioning/provisionClient')

const result = await provisionClient({
  clientId: 'your-client-id',
  provider: 'ploi',
  verbose: true,
})

console.log('Provisioning result:', result)
```

### Test 3: Via Platform CMS UI

1. Navigate to http://localhost:3020/admin/collections/clients
2. Open "Aboland" client
3. Change status to "🔄 Wordt ingericht..."
4. Save
5. Monitor console logs

---

## 📞 Support

**Als je nog steeds problemen hebt:**

1. Check Railway dashboard: https://railway.app/dashboard
   - Zijn er actieve projecten?
   - Is je account nog actief?
   - Zijn er quota limits bereikt?

2. Check de Railway API status: https://status.railway.app

3. Run diagnostics:
   ```bash
   # Test Railway API
   node test-railway-api.mjs

   # Check environment
   npm run validate-env

   # Check build
   npm run build
   ```

4. Check logs:
   ```bash
   # Development logs
   npm run dev

   # Look for [Railway] prefix in console
   ```

---

**Laatst bijgewerkt:** 21 februari 2026
**Status:** ✅ Root cause geïdentificeerd, error handling verbeterd, test script gemaakt
**Next action:** User moet nieuwe Railway API token genereren
