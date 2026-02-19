# 🔴 PLASTIMED ADMIN ISSUE - Root Cause Analysis

**Datum:** 19 Februari 2026
**Status:** CRITICAL BUG - Admin toont platform in plaats van tenant
**Symptoom:** `https://plastimed01.compassdigital.nl/admin` toont platform admin met "Welkom terug, Compass"

---

## 🔍 WAT GEBEURT ER NU?

### Huidige Situatie:
1. Gebruiker opent: `https://plastimed01.compassdigital.nl/admin`
2. Ziet: **PLATFORM ADMIN** (Compass Digital Platform)
   - "Welkom terug, Compass"
   - Platform Beheer collecties (Clients, Deployments, etc.)
   - ALLE platform collecties zichtbaar

### Verwachte Situatie:
1. Gebruiker opent: `https://plastimed01.compassdigital.nl/admin`
2. Zou moeten zien: **TENANT ADMIN** (Plastimed specifiek)
   - "Welkom terug, [Plastimed user]"
   - ALLEEN relevante collecties (Products, Orders, Pages, Blog)
   - GEEN platform collecties (Clients, Deployments, etc.)
   - VERBORGEN: Services, Cases (via disabledCollections)

---

## 🐛 ROOT CAUSE - Middleware Bug

### middleware.ts Analyse (Regel 213-263):

**PROBLEEM 1: Verkeerde tabel naam**

```typescript
// Regel 213-216: Middleware zoekt naar "tenants" tabel
const result = await client.query(
  'SELECT * FROM tenants WHERE subdomain = $1 AND status = $2',
  [subdomain, 'active']
)
```

**MAAR:**
- ❌ Database heeft GEEN `tenants` tabel
- ✅ Database heeft WEL `clients` tabel

**GEVOLG:**
```typescript
// Regel 241-248: Als tenants tabel niet bestaat
if (error?.code === '42P01') {
  console.log('[MIDDLEWARE] tenants table not found - client deployment DB detected')
  return CLIENT_DEPLOYMENT_DB
}
```

**Wat gebeurt er:**
1. Middleware detecteert subdomain: `plastimed01`
2. Probeert tenant op te halen uit `tenants` tabel
3. Tabel bestaat niet → Error 42P01 ("undefined_table")
4. Middleware DENKT: "Dit is een client deployment database, geen platform"
5. Middleware BYPASSED routing → Serve platform admin direct
6. **RESULTAAT:** Platform admin getoond in plaats van tenant admin

---

## 🏗️ ARCHITECTUUR MISMATCH

### Ontworpen Architectuur (Middleware Verwachting):

```
Database: Platform DB
└── tenants table
    ├── subdomain: "plastimed01"
    ├── database_url: "postgresql://..."
    ├── status: "active"
    └── type: "b2b"

Flow:
1. plastimed01.compassdigital.nl → Middleware
2. Extract subdomain: "plastimed01"
3. Query: SELECT * FROM tenants WHERE subdomain = 'plastimed01'
4. Find tenant → Inject headers (x-tenant-id, x-tenant-database-url)
5. Rewrite: /admin → /tenant/admin
6. Serve tenant-specific admin
```

### Huidige Architectuur (Wat er echt is):

```
Database: Platform DB
└── clients table (NOT tenants!)
    ├── domain: "plastimed01.compassdigital.nl" (full hostname!)
    ├── disabledCollections: ["services", "cases"]
    ├── status: "active"
    └── template: "b2b"

Flow:
1. plastimed01.compassdigital.nl → Middleware
2. Extract subdomain: "plastimed01"
3. Query: SELECT * FROM tenants... → ERROR (table doesn't exist)
4. Middleware bypasses routing (thinks it's client deployment)
5. Serve platform admin directly
6. ❌ WRONG: Shows platform admin instead of tenant
```

---

## 🔧 WAAROM WERKTE HIDECOLLECTIONS NIET?

HideCollections component is een **client-side CSS hack**:

```typescript
// HideCollections.tsx
fetch(`/api/platform/clients?where[domain][equals]=${fullHostname}`)
  .then(client => {
    const disabled = client.disabledCollections
    // Inject CSS to hide collections
  })
```

**WAAROM DIT FAALT:**
1. HideCollections draait in de browser
2. Maar de ADMIN UI wordt al server-side gerenderd
3. Middleware heeft GEEN tenant context geïnjecteerd
4. Admin UI denkt: "Dit is platform admin" → Toont ALLE collecties
5. HideCollections kan alleen CSS injecten, maar:
   - Collections zijn al gerenderd in DOM
   - Platform-specifieke UI is al geladen
   - User permissions zijn al afgehandeld

**CSS kan ALLEEN:**
- ✅ Collections verbergen in sidebar (display: none)

**CSS kan NIET:**
- ❌ User greeting veranderen ("Welkom terug, Compass" → "Welkom, Plastimed")
- ❌ Platform collecties uit DOM verwijderen (ze blijven in DOM, alleen onzichtbaar)
- ❌ Tenant-specifieke permissions toepassen
- ❌ Tenant-specifieke data filteren

---

## 🎯 OPLOSSINGEN

### Optie 1: Fix Middleware - Gebruik `clients` Tabel ✅ RECOMMENDED

**Voordeel:**
- Minimale wijziging
- Gebruikt bestaande database structuur
- Multi-tenant routing werkt

**Wijziging:**
```typescript
// middleware.ts regel 213-216
// VOOR:
const result = await client.query(
  'SELECT * FROM tenants WHERE subdomain = $1 AND status = $2',
  [subdomain, 'active']
)

// NA:
const result = await client.query(
  'SELECT * FROM clients WHERE domain = $1 AND status = $2',
  [subdomain, 'active']  // Try subdomain first
)

// If not found, try full hostname:
if (result.rows.length === 0) {
  result = await client.query(
    'SELECT * FROM clients WHERE domain = $1 AND status = $2',
    [`${subdomain}.compassdigital.nl`, 'active']
  )
}
```

**Gevolg:**
- Middleware vindt client in database
- Injects tenant headers
- Rewrites naar `/tenant/admin`
- Toont tenant-specific admin UI

**Nadeel:**
- Moet nog steeds `/tenant/[[...path]]` route implementeren (zie optie 1b)

---

### Optie 1b: Implementeer `/tenant/[[...path]]` Route

**Benodigde file:**
```
src/app/tenant/[[...path]]/page.tsx
```

**Functie:**
- Read `x-tenant-id` header (geïnjecteerd door middleware)
- Connect to tenant-specific database
- Render Payload admin met tenant context
- Filter collections based on disabledCollections

---

### Optie 2: Separate Deployment per Tenant ⚠️ COMPLEX

**Architectuur:**
```
Platform: cms.compassdigital.nl
├── PORT: 4000
├── DATABASE: postgresql://.../railway (platform DB)
└── Admin: Platform beheer (Clients, Deployments)

Tenant 1: plastimed01.compassdigital.nl
├── PORT: 4001 (separate PM2 process!)
├── DATABASE: postgresql://.../plastimed01 (tenant DB)
├── ENV: CLIENT_ID=plastimed01, DISABLED_COLLECTIONS=services,cases
└── Admin: Tenant admin (only tenant collections)

Tenant 2: bakkerij.compassdigital.nl
├── PORT: 4002
├── DATABASE: postgresql://.../bakkerij
└── Admin: Tenant admin
```

**Voordeel:**
- Complete isolatie per tenant
- Geen middleware routing nodig
- True multi-tenancy

**Nadeel:**
- Complexe deployment (1 PM2 process per tenant)
- Database per tenant (cost)
- Nginx/reverse proxy configuratie nodig

---

### Optie 3: Rename `clients` → `tenants` ⚠️ MIGRATION

**Wijziging:**
```sql
ALTER TABLE clients RENAME TO tenants;
ALTER TABLE clients RENAME COLUMN domain TO subdomain;
```

**Voordeel:**
- Middleware werkt zonder wijziging

**Nadeel:**
- Database migratie nodig
- Breaking change (alle code die `clients` gebruikt)
- Domain format change (subdomain vs full hostname)

---

## 💡 AANBEVOLEN OPLOSSING

**Combinatie van Optie 1 + 1b:**

1. **Fix middleware.ts** - Query `clients` table
2. **Implementeer `/tenant/[[...path]]` route** - Tenant-specific admin
3. **Update HideCollections** - Server-side filtering

**Stappen:**
1. ✅ Update middleware query (clients tabel)
2. ✅ Implement tenant route handler
3. ✅ Test plastimed01 admin
4. ✅ Verify collections hidden
5. ✅ Deploy to production

**Geschatte tijd:** 2-3 uur implementatie + testing

---

## 🚨 WAAROM DIT ZO LANG DUURDE

**Verkeerde aannames:**
1. ❌ "HideCollections kan collections verbergen" → Werkt alleen client-side CSS
2. ❌ "Middleware gebruikt clients tabel" → Gebruikt tenants tabel die niet bestaat
3. ❌ "Domain validatie was het probleem" → Symptoom, niet de root cause
4. ❌ "Database update lost het op" → disabledCollections werkt, maar admin toont platform

**Echte probleem:**
- Middleware query faalt → Bypass routing → Platform admin getoond

---

## ✅ VOLGENDE STAPPEN

**GEEN CODE CHANGES** tot gebruiker akkoord geeft met oplossing!

**Keuze aan gebruiker:**
- Optie 1 (Recommended): Fix middleware + implementeer tenant route (2-3 uur)
- Optie 2: Separate deployments (complex, 1+ dag)
- Optie 3: Database rename (breaking change, risky)

**Gebruiker beslissing nodig!**
