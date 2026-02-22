# Headless CMS Architectuur & THOR Integration

**Date:** 22 Februari 2026
**Vraag:** Is het niet het voordeel van Payload dat CMS losstaat van frontend?

---

## 🎯 Het Antwoord

**JA, Payload is headless!**
**MAAR:** We gebruiken Payload hier NIET als content store voor subscriptions.

---

## 📚 Wat Is Headless CMS?

### Traditioneel CMS (Coupled)

```
┌─────────────────────────────────────┐
│         WordPress / Drupal          │
│                                     │
│  ┌──────────┐      ┌─────────────┐ │
│  │ Content  │  ←→  │  Templates  │ │
│  │ Database │      │  (PHP/HTML) │ │
│  └──────────┘      └─────────────┘ │
│                                     │
│  Frontend = Gekoppeld aan backend   │
└─────────────────────────────────────┘

Nadelen:
- Frontend = gekoppeld aan CMS
- Kan niet los vervangen
- Één tech stack (PHP voor alles)
```

### Headless CMS (Decoupled)

```
┌──────────────────────┐
│   Headless CMS       │
│   (Payload, Strapi)  │
│                      │
│   ┌──────────┐       │
│   │ Content  │       │
│   │ Database │       │
│   └──────────┘       │
│         ↓            │
│   REST/GraphQL API   │
└──────────────────────┘
         ↓ ↓ ↓
    ┌────┴─┴────┐
    ↓    ↓      ↓
┌────────┐ ┌────────┐ ┌────────┐
│ Next.js│ │ Mobile │ │ Widget │
│ Website│ │  App   │ │  Embed │
└────────┘ └────────┘ └────────┘

Voordelen:
- Frontend = losgekoppeld
- Meerdere frontends mogelijk
- API-first architectuur
```

---

## 🏗️ Onze Architectuur (3-Tier)

### Tier 1: THOR (Content Source)

```
┌──────────────────────────────┐
│     THOR (Abonnementenland)  │
│     Source of Truth          │
│                              │
│  - 500K subscribers          │
│  - Subscriptions             │
│  - Invoices                  │
│  - Magazines                 │
│                              │
│  REST API V2                 │
└──────────────────────────────┘
```

**THOR = De eigenlijke "headless CMS" voor subscription content!**

### Tier 2: Payload CMS (Middleware/Cache)

```
┌──────────────────────────────┐
│      Payload CMS             │
│      (Middleware Layer)      │
│                              │
│  ┌────────────────────────┐  │
│  │ Users (auth)           │  │
│  │ Pages (website content)│  │
│  │ Blog Posts             │  │
│  │ Products               │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ thor_subscriptions     │  │  ← CACHE van THOR
│  │ thor_invoices          │  │  ← CACHE van THOR
│  └────────────────────────┘  │
│                              │
│  REST API                    │
└──────────────────────────────┘
```

**Payload = Auth + Cache, NIET content source voor subscriptions**

### Tier 3: Next.js Frontend(s)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Website    │  │  Admin Panel │  │ Mobile App   │
│   (Next.js)  │  │  (Next.js)   │  │ (React Native│
└──────────────┘  └──────────────┘  └──────────────┘
       ↓                 ↓                   ↓
       └─────────────────┴───────────────────┘
                         ↓
              ┌──────────────────┐
              │   Payload API    │
              │  /api/thor/*     │
              └──────────────────┘
                         ↓
              ┌──────────────────┐
              │    THOR API      │
              └──────────────────┘
```

**Frontend = Volledig headless! Kan vervangen worden.**

---

## 🤔 Waarom Delen Payload en Next.js Database?

### Dit Is Normaal in Payload Setup

**Standaard Payload + Next.js Architectuur:**

```typescript
// payload.config.ts
export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  collections: [
    Users,      // User accounts
    Pages,      // Website content
    Media,      // Uploads
    // etc.
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
})

// next.config.js
module.exports = {
  // Next.js en Payload draaien in dezelfde app
  // Delen dezelfde database
}
```

**Waarom?**

1. **Performance**: Geen extra netwerk hop (directe DB access)
2. **Simplicity**: Één database = makkelijker te beheren
3. **Transactions**: Cross-table queries mogelijk
4. **Cost**: Één database instance ipv twee

**Dit is het AANBEVOLEN pattern voor Payload!**

---

## 💡 Alternatieve Architectuur: Aparte Payload Instance

### Optie: Dedicated Subscription Service

```
┌──────────────────────┐
│  Main Website        │
│  (Payload + Next.js) │
│                      │
│  - Pages             │
│  - Blog              │
│  - Products          │
└──────────────────────┘
         ↓ API
┌──────────────────────┐
│  Subscription Service│
│  (Aparte Payload)    │
│                      │
│  - Users (subs only) │
│  - Subscriptions     │
│  - Invoices          │
└──────────────────────┘
         ↓ API
┌──────────────────────┐
│      THOR API        │
└──────────────────────┘
```

**Wanneer Zinvol?**

✅ **JA, als:**
- Subscription service wordt gebruikt door meerdere websites
- Separate team werkt aan subscription platform
- Compliance/security: subscription data moet geïsoleerd zijn
- Verschillende schaalbaarheid requirements

❌ **NEE, als:**
- Single website/client (Aboland)
- Subscriptions zijn deel van webshop UX
- Team is klein (zelfde developers)
- **Extra complexiteit niet waard**

**Voor Aboland: NIET nodig** ✋

---

## 🎯 Waarom Onze Architectuur Toch Headless Is

### 1. THOR = Headless Content Source

```
THOR API (headless)
    ↓
Payload (middleware/cache)
    ↓
Next.js (frontend)

Je kunt frontend vervangen:
THOR API
    ↓
Payload (middleware/cache)
    ↓
React Native App  ✅
    ↓
Vue.js Website    ✅
    ↓
Flutter App       ✅
```

**Frontend is vervangbaar = headless** ✅

### 2. Payload API = Headless

```
Payload REST API
    ↓ ↓ ↓
Next.js   Mobile   Widget
Website   App      Embed
```

**Payload serveert via API, niet gekoppeld aan één frontend** ✅

### 3. THOR Data Blijft in THOR

```
THOR (source of truth)
    ↑
    ↑ On-demand API calls
    ↑
Payload (cache)

Payload slaat NIET permanent op:
- Subscription details komen van THOR
- Cache kan verwijderd worden
- Rebuild cache = fetch from THOR
```

**Data blijft in originele CMS (THOR) = headless** ✅

---

## 📊 Database Schema: Shared vs. Separate

### Onze Keuze: Shared Database

```sql
-- Één PostgreSQL database

-- Payload core tables:
users                    -- User accounts (auth)
pages                    -- Website content
media                    -- Uploads
blog_posts              -- Blog content
products                -- E-commerce products

-- THOR cache tables:
thor_subscriptions      -- Cache van THOR subscriptions
thor_invoices           -- Cache van THOR invoices
thor_sync_log           -- Sync audit trail

-- Relations:
thor_subscriptions.user_id → users.id
```

**Voordelen:**
- ✅ Directe queries mogelijk (`JOIN users ↔ thor_subscriptions`)
- ✅ Transacties over tables (`BEGIN ... COMMIT`)
- ✅ Eén backup/restore flow
- ✅ Lagere kosten (1 database instance)
- ✅ Simpeler deployment

**Nadelen:**
- ⚠️ THOR data en website data in zelfde DB (maar beide zijn cache!)

### Alternatief: Separate Databases

```sql
-- Database 1: Website
users
pages
media
blog_posts
products

-- Database 2: Subscriptions
users (duplicate!)
thor_subscriptions
thor_invoices
thor_sync_log
```

**Voordelen:**
- ✅ Isolatie (subscription DB apart)
- ✅ Kunnen verschillend schalen

**Nadelen:**
- ❌ Dubbele users tabel (data duplicatie)
- ❌ Geen `JOIN` mogelijk tussen databases
- ❌ Complexer deployment (2 databases)
- ❌ Hogere kosten (2 instances)
- ❌ Niet nodig voor single client

**Voor Aboland: Overkill** ❌

---

## 🔄 Data Flow: Content vs. Subscriptions

### Website Content (Echt Headless CMS)

```
Editor schrijft blog post in Payload
    ↓
Opgeslagen in Payload database (source of truth)
    ↓
Payload API serveert content
    ↓
Next.js rendert blog post
```

**Payload = Content source** ✅

### Subscription Data (THOR Headless, Payload Cache)

```
Subscription data leeft in THOR (source of truth)
    ↓
Payload haalt data op via THOR API
    ↓
Payload cached in thor_subscriptions (performance)
    ↓
Payload API serveert cached data
    ↓
Next.js rendert subscriptions
```

**THOR = Content source, Payload = Cache** ✅

---

## 💡 De Kern: Payload Heeft Twee Rollen

### Rol 1: Traditional CMS (voor website content)

```
┌─────────────────────────┐
│    Payload CMS          │
│                         │
│  Content Collections:   │
│  - Pages (headless)     │
│  - Blog Posts           │
│  - Products             │
│  - Media                │
│                         │
│  API → Frontend         │
└─────────────────────────┘
```

**Hier is Payload de source of truth** ✅

### Rol 2: Middleware/Cache (voor THOR subscriptions)

```
┌─────────────────────────┐
│    Payload CMS          │
│                         │
│  Cache Collections:     │
│  - thor_subscriptions   │
│  - thor_invoices        │
│                         │
│  API Proxy → THOR       │
└─────────────────────────┘
         ↕
┌─────────────────────────┐
│      THOR API           │
│  (Echte source)         │
└─────────────────────────┘
```

**Hier is THOR de source of truth** ✅

---

## 🎯 Waarom Dit De Beste Architectuur Is

### 1. Leverage Bestaande Infrastructuur

```
✅ Payload al aanwezig (voor website)
✅ Database al aanwezig (PostgreSQL)
✅ Next.js frontend al gebouwd
✅ Auth system al werkend

→ Hergebruik alles voor subscriptions!
→ Geen nieuwe infrastructuur nodig
```

### 2. Optimal Performance

```
User opent /my-account/subscriptions
    ↓
Next.js → Payload API (localhost, ~5ms)
    ↓
Payload → Database query (localhost, ~10ms)
    ↓
Return cached data
    ↓
Total: ~20ms ✅ FAST

vs. Aparte service:

Next.js → Subscription Service (network, ~50ms)
    ↓
Service → Database query (~10ms)
    ↓
Return data
    ↓
Total: ~70ms (3.5x slower)
```

### 3. Simpler Architecture

```
Onze setup:
1 Database
1 Payload instance
1 Next.js app
= 3 components

Separate service:
2 Databases
2 Payload instances
1 Next.js app
= 5 components (67% meer!)
```

### 4. Lower Costs

```
Onze setup:
Database: €20-50/maand
Hosting: €50/maand
Total: €70/maand

Separate service:
Database 1: €20/maand
Database 2: €20/maand
Hosting 1: €50/maand
Hosting 2: €50/maand
Total: €140/maand (2x duurder!)
```

---

## 🔮 Toekomstige Scalability

### Als Aboland Later Wil Schalen

**Scenario: 10 webshops willen subscription service gebruiken**

```
Current architecture:
┌──────────┐
│ Webshop 1│ → Payload (shared) → THOR
└──────────┘

Toekomst (microservice):
┌──────────┐
│ Webshop 1│ ↘
│ Webshop 2│  → Subscription Service → THOR
│ Webshop 3│ ↗
└──────────┘
```

**Dan kunnen we refactoren:**

1. Extract subscription logic naar aparte service
2. Alle webshops gebruiken die service
3. Maar START niet zo (YAGNI - You Ain't Gonna Need It)

**Voor nu: 1 webshop = monolith is perfect** ✅

---

## ✅ Conclusie

### Vraag: "Is het niet het voordeel van Payload dat CMS losstaat van frontend?"

**Antwoord:**

1. **JA, Payload is headless** ✅
   - API-first
   - Frontend agnostic
   - Kan gebruikt worden door Next.js, React Native, Vue, etc.

2. **Payload en Next.js delen database** ✅
   - Dit is NORMAAL in Payload setup
   - Aanbevolen architectuur
   - Optimaal voor performance en kosten

3. **THOR is de eigenlijke content source** ✅
   - THOR = Headless CMS voor subscriptions
   - Payload = Middleware/cache layer
   - Subscriptions blijven in THOR

4. **Frontend blijft vervangbaar** ✅
   - Next.js kan vervangen worden
   - Payload API blijft werken
   - THOR API blijft beschikbaar

### De Architectuur IS Headless:

```
THOR (headless subscription CMS)
    ↓
Payload (headless content CMS + cache)
    ↓
Next.js (vervangbare frontend)
```

**Alles is headless, maar efficient georganiseerd!** 🎯

---

## 🎓 Key Takeaways

1. **Headless ≠ Separate databases**
   - Headless = API-first, frontend agnostic
   - Databases kunnen gedeeld worden voor performance

2. **Payload heeft twee rollen**
   - CMS voor website content (source of truth)
   - Cache/middleware voor THOR subscriptions

3. **THOR is de source of truth voor subscriptions**
   - Niet Payload
   - Payload is alleen cache voor UX

4. **Shared database is best practice**
   - Voor single-tenant setup (1 klant)
   - Optimal performance
   - Lower costs
   - Simpeler architectuur

5. **Start simpel, schaal later**
   - Begin met monolith (Payload + Next.js)
   - Extract naar microservices als écht nodig
   - YAGNI principle

---

**Laatst bijgewerkt:** 22 Februari 2026
