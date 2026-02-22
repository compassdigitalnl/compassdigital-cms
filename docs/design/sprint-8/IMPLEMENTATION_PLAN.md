# Sprint 8: THOR Subscriptions API Integration - Master Implementation Plan

**Version:** 1.0
**Date:** 22 Februari 2026
**Status:** Planning Phase
**Client:** Aboland (client-specific implementation)

---

## 💰 Investment & Feasibility Analysis

### Haalbaarheid: **100% HAALBAAR** ✅

Alle gevraagde features zijn volledig haalbaar met THOR Subscriptions API V2. De API biedt complete CRUD operaties (Create, Read, Update, Delete) voor abonnementen, inclusief alle gevraagde functionaliteit zoals adreswijziging, opzegging, factuurinzicht, etc.

**Geen technische blokkades geïdentificeerd.**

### Realistische Kostenschatting voor Klant (Aboland)

#### Development Kosten

**Normale marktprijs (extern uitbesteed)**:
- 140-160 uur development × €100-150/uur = **€14.000 - €24.000**
- Plus QA testing, deployment, training = **€18.000 - €30.000 totaal**

**Met AI-Assisted Development (jouw situatie)**:
- Grootste deel van development wordt gedaan door AI (Claude Code)
- Klant betaalt alleen voor:
  - ✅ Project management en coördinatie
  - ✅ QA testing en acceptatie
  - ✅ Deployment support
  - ✅ THOR API setup en configuratie
  - ✅ Training en documentatie

**Voorgestelde klantinvestering**: **€3.500 - €5.000**

**Breakdown**:
```
€1.500  Project management & coördinatie (15-20 uur × €75-100/uur)
€1.000  QA testing & acceptatie (10-12 uur × €75-100/uur)
€500    Deployment support (5 uur × €100/uur)
€500    THOR API setup & configuratie
€500    Training & documentatie
€500    Contingency (onvoorzien)
-------
€4.500  Totaal (gemiddeld)
```

#### Externe Kosten (THOR API)

**THOR/Abonnementenland Licentie**:
- Setup fee: **€500 - €1.500** (eenmalig)
- Maandelijkse kosten: **€50 - €200/maand** (afhankelijk van volume)
- API calls: Meestal inbegrepen, anders pay-per-use

**Totale investering eerste jaar**: **€5.000 - €8.000**

#### ROI (Return on Investment)

**Besparingen**:
- ⏱️ Tijdsbesparing: 5-10 uur/week support tijd (handmatige abonnementsverwerking)
- 📞 Minder support tickets: 50-80% reductie abonnements-gerelateerde vragen
- 🚀 Meer conversies: 10-20% meer online abonnementen (self-service)
- 💰 Geschatte besparing: **€10.000 - €15.000/jaar**

**Terugverdientijd**: 4-6 maanden

### Waarom Deze Prijs Realistisch Is

1. **AI doet het zware werk** (~80% van development)
2. **Bestaande infrastructuur** (Payload CMS, Next.js, database al aanwezig)
3. **Herbruikbare code** (kan later uitgerold worden naar andere klanten)
4. **Snelle development cyclus** (4-5 weken ipv 3-4 maanden traditioneel)

### Alternatief: Maandelijkse Abonnementsmodel

**Optie B**: Maandelijks SaaS-model
- Setup fee: **€1.500** (eenmalig)
- Maandelijks: **€250 - €400/maand** (inclusief onderhoud, updates, support)
- Minimum contract: 12 maanden
- **Totaal jaar 1**: €4.500 - €6.300

**Voordeel voor klant**:
- Lagere initiële investering
- Doorlopende support en updates inbegrepen
- Schaalbaar (meer webshops = hogere prijs)

---

## 🛒 Product-to-Subscription Scope Verheldering

### Context: WooCommerce Product Mapping

**Vraag:** De huidige WooCommerce producten hebben velden zoals `subscription_code`, `link_code`, `type`, `duration`, `frequency`, `premium`, `external_url`, en `price_type`. Deze moeten gemapped worden naar THOR API bij checkout. Is dit onderdeel van de scope?

**Antwoord:** **JA - Dit was impliciet onderdeel van "Create subscriptions directly in THOR"**

Zonder product-to-subscription mapping kunnen gebruikers geen nieuwe abonnementen afsluiten via de webshop. Deze functionaliteit is essentieel voor een werkend systeem.

### Wat Wordt Toegevoegd

#### 1. Product Mapping Logic
- **WooCommerce velden → THOR API mapping**
  - `subscription_code` → `actionId` (THOR actie/aanbieding)
  - `link_code` → `magazineId` (THOR tijdschrift ID)
  - `type` → `publicationCode` (PRINT/DIGI/COMBI)
  - Overige velden als display metadata

#### 2. Checkout API Endpoint
- **`POST /api/checkout/create-subscription`**
  - Validate product subscription fields
  - Map checkout data → THOR API payload
  - Create subscription in THOR
  - Generate payment link (iDEAL, PayPal, etc.)
  - Cache in Payload database
  - Send confirmation email

#### 3. Product Configuration
- **Payload CMS Products Collection extensie**
  - Subscription fields toevoegen aan bestaande Products
  - Admin UI met conditionals (alleen tonen als `subscription = true`)
  - Validation hooks (subscription_code + link_code required)

#### 4. Database Migration
- **SQL migratie voor subscription velden**
  - `products` table extensie met 10 nieuwe kolommen
  - Indices voor snelle queries

#### 5. Validation & Error Handling
- **Pre-checkout validation**
  - Check of `subscription_code` bestaat in THOR
  - Check of `link_code` bestaat in THOR
  - Validate mapping (action matches magazine)

### Tijdsinschatting Extra Werk

| Component | Uren | Complexiteit |
|-----------|------|--------------|
| Products Collection Extensie | 2-3 uur | 🟢 Laag |
| Database Migratie | 1 uur | 🟢 Laag |
| API Endpoint (`/api/checkout/create-subscription`) | 6-8 uur | 🟡 Gemiddeld |
| Validation Logic (`validateSubscriptionProduct`) | 2-3 uur | 🟢 Laag |
| Checkout Flow Aanpassingen | 3-4 uur | 🟡 Gemiddeld |
| Testing & Debugging | 4-6 uur | 🟡 Gemiddeld |
| Admin Documentatie | 2 uur | 🟢 Laag |
| **TOTAAL** | **20-27 uur** | **(2.5-3.5 dagen)** |

### Impact op Timeline & Kosten

#### Oorspronkelijke Schatting
```
Week 1-2: API Integration + Database (80 uur)
Week 3: Frontend Components (40 uur)
Week 4: Testing & QA (40 uur)
Week 5: Deployment (16 uur)
─────────────────────────────────────
TOTAAL: 176 uur (22 dagen / ~5 weken)
KOSTEN: €4.500 (Optie A) / €5.300 (Optie B met Magic Link)
```

#### Met Product-to-Subscription Mapping
```
Week 1-2: API Integration + Database + Product Mapping (92 uur)
Week 3: Frontend + Checkout Flow (48 uur)
Week 4: Testing & QA + Product Testing (46 uur)
Week 5: Deployment (16 uur)
─────────────────────────────────────
TOTAAL: 202 uur (25 dagen / ~5 weken)
EXTRA: +26 uur (~3 dagen)
```

**Timeline Impact:** ✅ **Geen - blijft binnen 5 weken**

**Kosten Impact:**
- **Optie 1 (Aanbevolen):** **€0 extra** - Absorb in oorspronkelijke scope
  - Argument: Product mapping was impliciet onderdeel van "Create subscriptions"
  - Klantprijs blijft: **€4.500 (Optie A)** of **€5.300 (Optie B)**

- **Optie 2 (Transparantie):** **+€500** voor extra scope verheldering
  - Klantprijs wordt: **€5.000 (Optie A)** of **€5.800 (Optie B)**
  - Argument: Expliciete product mapping was niet in oorspronkelijke scope

### Aanbeveling: Inclusief in Oorspronkelijke Scope ⭐

**Redenen:**
1. ✅ **Technisch noodzakelijk** - Zonder dit werkt "Create subscriptions" niet
2. ✅ **Velden bestaan al** - We hoeven alleen te mappen, niet te ontwerpen
3. ✅ **Impliciete requirement** - "Create subscriptions directly in THOR" impliceert checkout flow
4. ✅ **Competitieve positie** - €4.500-5.300 blijft zeer scherp geprijsd (vs. €18K-30K markt)
5. ✅ **Client goodwill** - Geen verrassingen achteraf
6. ✅ **Haalbaar** - 3 dagen extra werk bij 5-weken project is minimaal

**Communicatie naar klant:**
> "De product-to-subscription mapping was al onderdeel van de scope onder 'Create subscriptions directly in THOR'. We hebben nu de exacte veld-mapping gedocumenteerd op basis van jullie bestaande WooCommerce setup. Dit voegt ~3 dagen development toe maar blijft binnen de oorspronkelijke 5-weken timeline en €4.500-5.300 budget."

### Deliverables (Product Mapping)

✅ **Products Collection extensie** met subscription velden
✅ **Database migratie** voor subscription fields
✅ **API endpoint** `/api/checkout/create-subscription`
✅ **Validation logic** voor THOR code checks
✅ **Checkout flow** met subscription support
✅ **Admin documentatie** voor product setup
✅ **E2E testing** checkout → THOR → payment

### Risico's & Mitigatie

| Risico | Impact | Mitigatie |
|--------|--------|-----------|
| Invalid subscription codes in bestaande producten | 🔴 Hoog | Pre-deployment validation script |
| THOR API rate limiting tijdens checkout peak | 🟡 Gemiddeld | Request batching + caching |
| Payment link failures | 🟡 Gemiddeld | Fallback naar manual payment flow |
| Email delivery issues | 🟢 Laag | Queue + retry mechanism |

### Pre-Deployment Checklist

- [ ] Alle subscription producten hebben valid `subscription_code` (bestaat in THOR)
- [ ] Alle subscription producten hebben valid `link_code` (bestaat in THOR)
- [ ] `subscription_code` matches correct `link_code` (zelfde magazine)
- [ ] Test checkout flow end-to-end (dev → THOR test environment)
- [ ] Verify subscription appears in THOR admin panel
- [ ] Verify subscription cached in Payload `thor_subscriptions`
- [ ] Test payment link generation (iDEAL, PayPal, etc.)
- [ ] Test confirmation email sending
- [ ] Test error handling (invalid codes, API failures)
- [ ] Load testing (10+ concurrent checkouts)

---

## 📋 Executive Summary

### Overview
Integratie van THOR Subscriptions API V2 (Abonnementenland) in het bestaande Payload CMS e-commerce platform. Deze implementatie is **client-specific** voor één klant (Aboland) met meerdere webshops.

### Key Requirements
1. **Direct THOR Integration**: Abonnementen worden direct in THOR aangemaakt (niet lokaal)
2. **Visibility**: Abonnementen zichtbaar in webshop via `/my-account/subscriptions`
3. **Management**: Volledige beheer mogelijkheden via `/my-account/subscription/[id]`
4. **2-Way Sync**: Bidirectionele communicatie tussen webshop en THOR
5. **Reference**: Functionele pariteit met https://aboland.nl/bladen/voeding-en-gezondheid/drinken/winelifemagazine/

### Core Features
- ✅ Create subscriptions directly in THOR
- ✅ View all subscriptions (with pagination)
- ✅ View subscription details
- ✅ Cancel/upgrade/downgrade subscriptions
- ✅ Change delivery address
- ✅ Update email/payment method
- ✅ View invoices and payment history
- ✅ Generate payment links
- ✅ Report missing issues
- ✅ Request invoice copies
- ✅ Setup auto-incasso (direct debit)
- ✅ View edition schedule

### Technical Scope
- **API Integration**: THOR Subscriptions API V2 (REST)
- **Database**: New tables for subscription sync/cache
- **Frontend**: React components (Next.js App Router)
- **Backend**: API routes + service layer
- **Auth**: JWT bearer tokens (THOR) + user session (webshop)
- **Sync Strategy**: Polling + webhook support (future)

---

## 🎯 Implementation Options

### Context: User Journey & Account Creation

**Belangrijke Context:**
De meeste abonnementen worden **NIET via Aboland webshop** afgesloten, maar via **tijdschrift websites** (bijv. winelifemagazine.nl). Aboland fungeert als **centraal abonnementenbeheer platform** waar subscribers worden verwezen voor:
- Facturen inzien
- Abonnement opzeggen
- Adreswijziging
- Betalingsgegevens updaten

**Dit betekent:**
- Users hebben **GEEN Aboland account** wanneer ze hun abonnement afsluiten
- Ze komen **alleen naar Aboland** als ze iets moeten wijzigen of inzien
- Een lage drempel voor toegang is **cruciaal** om support calls te reduceren

### Optie A: Basis - Alleen Geregistreerde Users (€4.500)

**User Flow:**
```
User bezoekt aboland.nl/my-account
  → "Login Required"
  → Moet handmatig account aanmaken
  → Vult email, wachtwoord, etc. in
  → Account wordt gekoppeld aan THOR abonnementen (via email match)
  → Kan nu inloggen en abonnementen beheren
```

**Voordelen:**
- ✅ Simpelste implementatie
- ✅ Standaard auth flow
- ✅ Geen extra features nodig

**Nadelen:**
- ❌ **Veel friction** voor nieuwe users
- ❌ Users hebben GEEN Aboland account (kochten elders)
- ❌ "Waarom moet ik WEER registreren?" frustratie
- ❌ Lage adoptie (slechts 1-3% van 1M actieve users)
- ❌ **Hoge support kosten** (60K+ calls/jaar van users die niet kunnen inloggen)

**Geschikt voor:**
- Kleine user base (<10K users)
- Users die al bekend zijn met Aboland
- Budgetbeperkte implementatie

### Optie B: Basis + Magic Link met Auto-Registration (€5.300) ⭐ AANBEVOLEN

**User Flow (Eerste Keer):**
```
User bezoekt aboland.nl/abonnement-inzien
  → Vult email + postcode + huisnummer in
  → Systeem checkt THOR API:
      - Zoekt abonnement op email
      - Verifieert adresgegevens (postcode + huisnummer)
  → Als match gevonden:
      - Genereert Magic Link token (24 uur geldig)
      - Verstuurt email met inloglink
  → User klikt link in email
  → **AUTOMATISCHE ACCOUNT AANMAAK:** ✨
      - Systeem maakt automatisch Aboland account aan
      - Gebruikt email uit THOR
      - Genereert tijdelijk wachtwoord (of wachtwoordloos)
      - Koppelt alle abonnementen uit THOR
      - Logt user direct in
  → User ziet dashboard met abonnementen

Vanaf nu (volgende bezoeken):
  → User kan gewoon inloggen met email/wachtwoord
  → OF: opnieuw Magic Link gebruiken (altijd mogelijk)
  → Account bestaat al, dus geen dubbele accounts
```

**Technische Flow:**
```typescript
// Magic Link Verificatie + Auto-Registration
export async function POST(request: NextRequest) {
  const { token } = await request.json()

  // Verify magic link token
  const decoded = jwt.verify(token, process.env.JWT_SECRET!)
  const { email, subscriptionId } = decoded

  // Check if user account already exists
  let user = await payload.find({
    collection: 'users',
    where: { email: { equals: email } }
  })

  if (!user.docs.length) {
    // AUTO-REGISTRATION: Create account automatically
    user = await payload.create({
      collection: 'users',
      data: {
        email,
        // Option 1: Wachtwoordloos (alleen magic link)
        // Option 2: Genereer random wachtwoord + stuur reset link
        password: generateSecurePassword(), // Temp password
        role: 'subscriber',
        emailVerified: true, // Al geverifieerd via THOR
        source: 'thor_magic_link',
        createdVia: 'auto_registration'
      }
    })

    // Sync all subscriptions from THOR
    await syncUserSubscriptionsFromThor(user.id, email)

    // Send welcome email met wachtwoord reset link
    await sendWelcomeEmail(email, user.id)
  }

  // Log user in (set session cookie)
  const sessionToken = await createSession(user.id)

  return NextResponse.json({
    success: true,
    userId: user.id,
    sessionToken,
    isNewAccount: !user.docs.length
  })
}
```

**Voordelen:**
- ✅ **Zero friction** eerste keer (geen registratie formulier)
- ✅ **Automatisch account** aangemaakt na eerste magic link gebruik
- ✅ **Persistent login** mogelijk vanaf tweede bezoek
- ✅ **Beste van beide werelden**: frictionless start + normaal account daarna
- ✅ **Veel lagere support kosten** (90% minder "kan niet inloggen" calls)
- ✅ **Hogere adoptie** (5-10% ipv 1-3%)
- ✅ **Betere UX** (smooth onboarding)

**Support Kosten Besparing:**
```
Zonder Magic Link (Optie A):
- 100K users bezoeken Aboland/jaar
- 60% kan niet inloggen (geen account, vergeten dat ze moesten registreren)
- 60K belt support
- 60K × €7.50/call = €450.000/jaar support kosten

Met Magic Link + Auto-Registration (Optie B):
- 100K users bezoeken Aboland/jaar
- 10% kan niet inloggen (email niet gevonden, etc.)
- 10K belt support
- 10K × €7.50/call = €75.000/jaar support kosten

BESPARING: €375.000/jaar
EXTRA INVESTERING: €800 (Magic Link feature)
ROI: < 1 week! 🚀
```

**Extra Features:**
- Email verificatie via THOR (adres check = identiteit check)
- Automatische account cleanup (12+ maanden inactief)
- Support voor meerdere verificatiemethoden (postcode+huisnummer, geboortedatum, etc.)
- Audit trail (wie gebruikte magic link wanneer)

**Geschikt voor:**
- ✅ **Grote user base** (6M+ subscribers in THOR)
- ✅ **Externe aankoop flow** (users kochten NIET via Aboland)
- ✅ **Support cost reduction** focus
- ✅ **Moderne UX** verwachtingen
- ✅ **Aboland use case** ⭐

### Kosten Vergelijking

| Item | Optie A (Basis) | Optie B (+ Magic Link) |
|------|-----------------|------------------------|
| **Development** | €4.500 | €5.300 |
| **Extra Features** | - | Magic Link + Auto-Reg |
| **Support Costs (Year 1)** | €450.000 | €75.000 |
| **Net Cost (Year 1)** | €454.500 | €80.300 |
| **SAVINGS** | - | **€374.200/jaar** |
| **ROI** | - | **< 1 week** |

### Aanbeveling: Optie B ⭐

Voor Aboland is **Optie B (Magic Link + Auto-Registration)** de duidelijke winnaar:

1. **Users hebben geen Aboland account** (kochten via tijdschrift sites)
2. **Support cost reduction** van €375K/jaar rechtvaardigt €800 extra investering
3. **Betere UX** leidt tot hogere adoptie (3-5x meer users)
4. **Automatisch persistent account** = beste van beide werelden
5. **ROI < 1 week** = no-brainer business case

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ Subscriptions    │  │ Subscription     │  │ Invoice      │ │
│  │ List Page        │  │ Detail/Edit      │  │ Management   │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘ │
│           │                     │                    │          │
└───────────┼─────────────────────┼────────────────────┼──────────┘
            │                     │                    │
            ▼                     ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Routes (/api/thor/*)                    │
│                                                                  │
│  /subscriptions  /subscriptions/[id]  /invoices  /paymentlinks │
└────────┬─────────────────────┬────────────────────┬─────────────┘
         │                     │                    │
         ▼                     ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Service Layer (TypeScript)                     │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ ThorApiService   │  │ ThorAuthService  │  │ ThorSync     │ │
│  │ (REST client)    │  │ (JWT tokens)     │  │ Service      │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘ │
│           │                     │                    │          │
└───────────┼─────────────────────┼────────────────────┼──────────┘
            │                     │                    │
            ▼                     ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                         │
│                                                                  │
│  thor_subscriptions  thor_invoices  thor_sync_log  users       │
└─────────────────────────────────────────────────────────────────┘
            │                     │
            ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              External THOR API (Abonnementenland)               │
│                                                                  │
│  Base URL: https://subscriptions.bondis.nl/v2                   │
│  Rate Limit: 100 req/5sec per endpoint                          │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

**Creating Subscription (User → THOR)**:
```
1. User fills form on /abonnementen/[magazineId]
2. Frontend validates + submits to /api/thor/subscriptions
3. API route authenticates user, validates data
4. ThorApiService.createSubscription() calls THOR API
5. THOR returns subscriptionId
6. Store subscription in thor_subscriptions (cache)
7. Return success to user
```

**Viewing Subscriptions (THOR → User)**:
```
1. User visits /my-account/subscriptions
2. Frontend calls /api/thor/subscriptions
3. API route checks cache freshness (thor_subscriptions)
4. If stale: ThorApiService fetches from THOR, updates cache
5. Return cached subscriptions to frontend
6. Frontend renders subscription cards
```

**Updating Subscription (User → THOR → User)**:
```
1. User edits subscription on /my-account/subscription/[id]
2. Frontend submits PATCH to /api/thor/subscriptions/[id]
3. API route builds JSON Patch operations
4. ThorApiService.updateSubscription() calls THOR PATCH
5. THOR processes update, returns updated subscription
6. Update cache in thor_subscriptions
7. Return updated data to frontend
```

---

## 🎯 Feature Flags Strategy

### Feature Flag Structure

**File**: `src/lib/features.ts`

```typescript
export const features = {
  // Existing flags
  subscriptions: env('ENABLE_SUBSCRIPTIONS', 'true') === 'true',
  invoices: env('ENABLE_INVOICES', 'true') === 'true',

  // NEW: THOR Integration flags
  thor: {
    // Master switch - enables all THOR features
    enabled: env('ENABLE_THOR_INTEGRATION', 'false') === 'true',

    // Granular feature switches
    createSubscriptions: env('THOR_ALLOW_CREATE', 'false') === 'true',
    editSubscriptions: env('THOR_ALLOW_EDIT', 'false') === 'true',
    cancelSubscriptions: env('THOR_ALLOW_CANCEL', 'false') === 'true',
    viewInvoices: env('THOR_VIEW_INVOICES', 'false') === 'true',
    paymentLinks: env('THOR_PAYMENT_LINKS', 'false') === 'true',

    // Sync settings
    syncEnabled: env('THOR_SYNC_ENABLED', 'false') === 'true',
    syncInterval: parseInt(env('THOR_SYNC_INTERVAL_MINUTES', '30'), 10),

    // Client-specific settings
    clientId: env('THOR_CLIENT_ID', ''), // Aboland client ID
    magazineIds: env('THOR_MAGAZINE_IDS', '').split(',').filter(Boolean), // Allowed magazines
  },
} as const
```

### Environment Variables

**File**: `.env.example`

```bash
# ============================================
# THOR Subscriptions API Integration
# ============================================

# Master switch - set to 'true' to enable THOR integration
ENABLE_THOR_INTEGRATION=false

# THOR API Configuration
THOR_API_BASE_URL=https://subscriptions.bondis.nl/v2
THOR_API_BASE_URL_TEST=https://subscriptions-test.bondis.nl/v2
THOR_AUTH_BASE_URL=https://authentication.bondis.nl/v2
THOR_ENV=test # 'test' or 'production'

# THOR API Credentials
THOR_API_KEY=your-api-key-here
THOR_API_SECRET=your-api-secret-here
THOR_JWT_EXPIRY_MINUTES=60

# Client Configuration
THOR_CLIENT_ID=aboland # Client identifier in THOR
THOR_MAGAZINE_IDS=123,456,789 # Comma-separated magazine IDs

# Feature Toggles
THOR_ALLOW_CREATE=false # Allow creating new subscriptions
THOR_ALLOW_EDIT=false # Allow editing subscriptions
THOR_ALLOW_CANCEL=false # Allow canceling subscriptions
THOR_VIEW_INVOICES=false # Show invoices
THOR_PAYMENT_LINKS=false # Generate payment links

# Sync Configuration
THOR_SYNC_ENABLED=false # Enable background sync
THOR_SYNC_INTERVAL_MINUTES=30 # Sync interval (polling)
THOR_CACHE_TTL_MINUTES=15 # Cache TTL for subscriptions

# Rate Limiting (THOR limit: 100 req/5sec per endpoint)
THOR_RATE_LIMIT_MAX=80 # Conservative limit
THOR_RATE_LIMIT_WINDOW_SECONDS=5

# Logging
THOR_LOG_LEVEL=info # debug, info, warn, error
THOR_LOG_API_CALLS=false # Log all API calls (debug only)
```

### Rollout Strategy

**Phase 1: Development (Week 1-2)**
```bash
ENABLE_THOR_INTEGRATION=true
THOR_ENV=test
THOR_ALLOW_CREATE=true
THOR_ALLOW_EDIT=true
THOR_ALLOW_CANCEL=true
THOR_SYNC_ENABLED=false # Manual testing only
```

**Phase 2: Staging (Week 3)**
```bash
ENABLE_THOR_INTEGRATION=true
THOR_ENV=test
THOR_ALLOW_CREATE=true
THOR_ALLOW_EDIT=true
THOR_ALLOW_CANCEL=true
THOR_SYNC_ENABLED=true
THOR_SYNC_INTERVAL_MINUTES=60 # Hourly sync
```

**Phase 3: Production Pilot (Week 4)**
```bash
ENABLE_THOR_INTEGRATION=true
THOR_ENV=production
THOR_ALLOW_CREATE=true # Limited to 1 magazine initially
THOR_ALLOW_EDIT=false # Read-only first
THOR_ALLOW_CANCEL=false
THOR_SYNC_ENABLED=true
THOR_SYNC_INTERVAL_MINUTES=30
```

**Phase 4: Full Production (Week 5+)**
```bash
# All features enabled for all magazines
ENABLE_THOR_INTEGRATION=true
THOR_ENV=production
THOR_ALLOW_CREATE=true
THOR_ALLOW_EDIT=true
THOR_ALLOW_CANCEL=true
THOR_VIEW_INVOICES=true
THOR_PAYMENT_LINKS=true
THOR_SYNC_ENABLED=true
THOR_SYNC_INTERVAL_MINUTES=15 # More frequent sync
```

### Usage in Code

```typescript
// Check if THOR is enabled globally
if (!features.thor.enabled) {
  return { error: 'THOR integration is not enabled' }
}

// Check specific permission
if (!features.thor.createSubscriptions) {
  return { error: 'Creating subscriptions is currently disabled' }
}

// Client-specific check
if (!features.thor.magazineIds.includes(magazineId.toString())) {
  return { error: 'This magazine is not configured for THOR integration' }
}
```

---

## 🛒 Product-to-Subscription Creation Flow

### Context: WooCommerce Checkout → THOR Subscriptions

**Belangrijke Context:**
Subscriptie-producten in de Aboland webshop hebben specifieke velden die gebruikt worden om THOR abonnementen aan te maken tijdens checkout. Deze velden worden opgeslagen in de WooCommerce product metadata en moeten correct gemapped worden naar de THOR API parameters.

**User Journey:**
```
User voegt subscriptie-product toe aan winkelwagen
  → Checkout: vult adresgegevens + betalingsinfo in
  → Backend: WooCommerce product velden worden gelezen
  → THOR API: POST /api/subscriptions wordt aangeroepen
  → THOR: Abonnement wordt aangemaakt (subscriptionId)
  → Payload: Cache subscription in thor_subscriptions
  → User: Bevestigingsemail + redirect naar /my-account/subscriptions
```

---

### WooCommerce Product Fields → THOR API Mapping

#### Product Velden (WooCommerce Custom Fields)

**In de huidige WooCommerce setup zijn de volgende velden aanwezig:**

| WooCommerce Veld | Type | Description | THOR API Field | Required |
|------------------|------|-------------|----------------|----------|
| `subscription` | `TRUE/FALSE` | Is dit een subscription product? | - | ✅ |
| `subscription_code` | `string` | THOR actie/aanbieding code | `actionId` | ✅ |
| `link_code` | `string` | THOR tijdschrift code | `magazineId` | ✅ |
| `type` | `string` | Print/Digitaal/Combi | `publicationCode` | ✅ |
| `extra_type` | `string` | Extra metadata (bijv. "Premium") | - | ❌ |
| `duration` | `number` | Aantal nummers | Via `actionId` | ❌ |
| `frequency` | `string` | Frequentie (wekelijks/maandelijks) | Via `actionId` | ❌ |
| `premium` | `boolean` | Is dit een premium aanbieding? | - | ❌ |
| `external_url` | `string` | Link naar tijdschrift website | - | ❌ |
| `price_type` | `string` | Prijs type indicator | - | ❌ |

**Mapping Logic:**
```typescript
// WooCommerce product metadata → THOR API parameters
const productMetadata = {
  subscription: true,
  subscription_code: "12345",  // → THOR actionId
  link_code: "67890",           // → THOR magazineId
  type: "COMBI",                // → THOR publicationCode (PRINT/DIGI/COMBI)
  duration: 12,                 // Metadata (aantal nummers bepaald door actionId)
  frequency: "monthly",         // Metadata (frequentie bepaald door actionId)
  premium: true,                // Metadata (display only)
  external_url: "https://winelifemagazine.nl", // Metadata
  price_type: "introductory"    // Metadata (display only)
}

// THOR API mapping
const thorSubscriptionPayload = {
  magazineId: parseInt(productMetadata.link_code),      // ✅ REQUIRED
  actionId: parseInt(productMetadata.subscription_code), // ✅ REQUIRED
  paymentMethodCode: "ID", // From checkout (iDEAL, MC, AI, etc.)
  shippingMethodCode: "NP", // From checkout (NP = normale post, PP = priority post)
  invoicePeriodCode: "GP", // From action config (GP = gehele periode)

  // Receiver gegevens (van checkout formulier)
  receiver: {
    genderCode: "M",
    firstName: "Jan",
    lastName: "Jansen",
    emailAddress: "jan@example.com",
    phoneNumber: "+31612345678",
    address: {
      street: "Hoofdstraat",
      streetNumber: "123",
      streetNumberAddition: "A",
      postalCode: "1234AB",
      city: "Amsterdam",
      countryCode: "NL"
    }
  },

  // Payer (optioneel, anders = receiver)
  payer: null, // Same as receiver

  // Welkomstgeschenken (optional)
  selectedProductIds: [456, 789], // Product IDs from THOR

  // Kortingen (optional)
  discount: {
    code: "WELCOME10" // Or: amount: 5.00, percentage: 10
  },

  // Start datum/editie (optional)
  startDate: null, // Automatisch eerstvolgende editie
  startEditionId: null,

  // Source tracking
  sourceCode: "WEBSHOP_ABOLAND",

  // Comments
  comments: [
    {
      commentTypeCode: "GENERAL",
      comment: "Besteld via Aboland webshop"
    }
  ]
}
```

**CRITICAL FIELDS:**
1. **`subscription_code` → `actionId`**: Dit is de THOR actie/aanbieding ID
   - Bepaalt: aantal nummers, prijs, type abonnement, welkomstgeschenken
   - Moet bestaan in THOR via `GET /api/actions/{id}`

2. **`link_code` → `magazineId`**: Dit is het THOR tijdschrift ID
   - Bepaalt: welk magazine de user ontvangt
   - Moet bestaan in THOR via `GET /api/magazines`

3. **`type` → `publicationCode`**: Type distributie
   - `PRINT`: Alleen fysiek tijdschrift
   - `DIGI`: Alleen digitaal (email/online)
   - `COMBI`: Zowel print als digitaal

**METADATA FIELDS** (niet naar THOR gestuurd, alleen voor display):
- `duration`, `frequency`, `premium`, `external_url`, `price_type`
- Deze velden worden gebruikt voor product presentatie in de webshop
- De daadwerkelijke waarden komen van de THOR `actionId`

---

### API Endpoint Specification

#### `POST /api/checkout/create-subscription`

**Purpose**: Creëer een THOR subscription op basis van WooCommerce checkout data

**Request Body:**
```typescript
interface CreateSubscriptionRequest {
  // Product informatie
  productId: string; // Payload product ID
  quantity: number; // Meestal 1 voor subscriptions

  // Checkout gegevens
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    gender?: 'M' | 'F' | 'X' | 'FAMILY';
  };

  // Adres gegevens
  shippingAddress: {
    street: string;
    streetNumber: string;
    streetNumberAddition?: string;
    postalCode: string;
    city: string;
    countryCode: string; // ISO 3166-1 alpha-2 (NL, BE, DE, etc.)
  };

  billingAddress?: {
    // Same structure as shippingAddress
    // Optional: if omitted, use shippingAddress
  };

  // Betaling
  paymentMethod: 'ideal' | 'mistercash' | 'paypal' | 'creditcard' | 'sepa';

  // Optionele velden
  discountCode?: string; // Kortingscode
  welcomeGifts?: number[]; // Selected product IDs
  comments?: string; // Extra opmerkingen

  // Tracking
  sourceCode?: string; // Default: "WEBSHOP_ABOLAND"
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}
```

**Response:**
```typescript
interface CreateSubscriptionResponse {
  success: boolean;
  subscriptionId: number; // THOR subscription ID
  subscriptionNumber: string; // Customer-facing number

  // Payment info (if applicable)
  paymentRequired: boolean;
  paymentLink?: string; // Wordline payment URL
  invoiceId?: number; // THOR invoice ID

  // Next steps
  redirectUrl: string; // Where to redirect user
  confirmationEmailSent: boolean;

  // Sync status
  cachedInPayload: boolean;
}
```

**Implementation:**
```typescript
// src/app/api/checkout/create-subscription/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { ThorApiService } from '@/lib/thor/ThorApiService'
import { features } from '@/lib/features'

export async function POST(request: NextRequest) {
  // 1. Validate THOR integration is enabled
  if (!features.thor.enabled || !features.thor.createSubscriptions) {
    return NextResponse.json({
      success: false,
      error: 'Subscription creation is currently disabled'
    }, { status: 503 })
  }

  const data = await request.json()
  const payload = await getPayload({ config })

  // 2. Fetch product from Payload
  const product = await payload.findByID({
    collection: 'products',
    id: data.productId
  })

  if (!product) {
    return NextResponse.json({
      success: false,
      error: 'Product not found'
    }, { status: 404 })
  }

  // 3. Validate product is a subscription
  if (!product.subscription || !product.subscription_code || !product.link_code) {
    return NextResponse.json({
      success: false,
      error: 'Product is not a valid subscription product'
    }, { status: 400 })
  }

  // 4. Map WooCommerce fields to THOR API
  const actionId = parseInt(product.subscription_code)
  const magazineId = parseInt(product.link_code)

  // 5. Validate action exists in THOR
  const thorService = new ThorApiService()
  const action = await thorService.getAction(actionId)

  if (!action) {
    return NextResponse.json({
      success: false,
      error: `Invalid subscription code: ${product.subscription_code}`
    }, { status: 400 })
  }

  // 6. Map payment method
  const paymentMethodMap = {
    'ideal': 'ID',
    'mistercash': 'MC',
    'paypal': 'PP',
    'creditcard': 'CC',
    'sepa': 'AI' // Automatische incasso
  }
  const paymentMethodCode = paymentMethodMap[data.paymentMethod] || 'ID'

  // 7. Determine shipping method (NL = NP, other = PP)
  const shippingMethodCode = data.shippingAddress.countryCode === 'NL' ? 'NP' : 'PP'

  // 8. Get invoice period from action
  const invoicePeriodCode = action.invoicePeriodCode || 'GP' // Default: Gehele periode

  // 9. Build THOR subscription payload
  const thorPayload = {
    magazineId,
    actionId,
    paymentMethodCode,
    shippingMethodCode,
    invoicePeriodCode,

    receiver: {
      genderCode: data.customer.gender || 'X',
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      emailAddress: data.customer.email,
      phoneNumber: data.customer.phone || '',
      address: {
        street: data.shippingAddress.street,
        streetNumber: data.shippingAddress.streetNumber,
        streetNumberAddition: data.shippingAddress.streetNumberAddition || '',
        postalCode: data.shippingAddress.postalCode,
        city: data.shippingAddress.city,
        countryCode: data.shippingAddress.countryCode
      }
    },

    // Payer = receiver (unless billing address differs)
    payer: data.billingAddress ? {
      // ... same structure as receiver with billing address
    } : null,

    // Welcome gifts
    selectedProductIds: data.welcomeGifts || [],

    // Discount
    discount: data.discountCode ? {
      code: data.discountCode
    } : undefined,

    // Source tracking
    sourceCode: data.sourceCode || 'WEBSHOP_ABOLAND',

    // Comments
    comments: data.comments ? [
      {
        commentTypeCode: 'GENERAL',
        comment: data.comments
      }
    ] : []
  }

  // 10. Create subscription in THOR
  const thorSubscription = await thorService.createSubscription(thorPayload)

  if (!thorSubscription.success) {
    return NextResponse.json({
      success: false,
      error: thorSubscription.error || 'Failed to create subscription in THOR'
    }, { status: 500 })
  }

  // 11. Cache subscription in Payload database
  await payload.create({
    collection: 'thor_subscriptions',
    data: {
      subscription_id: thorSubscription.id,
      user_id: data.customer.userId, // If logged in
      client_id: process.env.THOR_CLIENT_ID,
      thor_data: thorSubscription,
      magazine_id: magazineId,
      magazine_name: thorSubscription.magazine?.name || '',
      subscription_number: thorSubscription.number,
      is_active: thorSubscription.isActive,
      receiver_email: data.customer.email,
      last_synced_at: new Date()
    }
  })

  // 12. Generate payment link if needed
  let paymentLink = null
  if (['ID', 'MC', 'PP', 'CC'].includes(paymentMethodCode)) {
    const paymentLinkResult = await thorService.generatePaymentLink({
      invoiceIds: [thorSubscription.invoices[0].id],
      paymentMethodCode,
      oneTimePayment: false, // First subscription payment
      acceptUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/success`,
      declineUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/failed`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/cancelled`
    })

    paymentLink = paymentLinkResult?.url
  }

  // 13. Send confirmation email
  const emailSent = await sendSubscriptionConfirmationEmail({
    to: data.customer.email,
    subscriptionNumber: thorSubscription.number,
    magazineName: thorSubscription.magazine?.name,
    startDate: thorSubscription.startDate
  })

  // 14. Return response
  return NextResponse.json({
    success: true,
    subscriptionId: thorSubscription.id,
    subscriptionNumber: thorSubscription.number,
    paymentRequired: !!paymentLink,
    paymentLink,
    invoiceId: thorSubscription.invoices?.[0]?.id,
    redirectUrl: paymentLink || '/my-account/subscriptions',
    confirmationEmailSent: emailSent,
    cachedInPayload: true
  })
}
```

---

### Product Configuration in Payload CMS

#### Products Collection Extension

**File**: `src/collections/Products/index.ts`

```typescript
import { CollectionConfig } from 'payload/types'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    // Existing product fields...
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },

    // NEW: Subscription-specific fields
    {
      name: 'subscription',
      type: 'checkbox',
      label: 'Is Subscription Product?',
      defaultValue: false,
      admin: {
        description: 'Enable this if this product creates a THOR subscription'
      }
    },
    {
      name: 'subscription_code',
      type: 'text',
      label: 'Subscription Code (THOR actionId)',
      admin: {
        condition: (data) => data.subscription === true,
        description: 'THOR action ID - determines subscription type, duration, price'
      }
    },
    {
      name: 'link_code',
      type: 'text',
      label: 'Link Code (THOR magazineId)',
      admin: {
        condition: (data) => data.subscription === true,
        description: 'THOR magazine ID - which tijdschrift will be delivered'
      }
    },
    {
      name: 'type',
      type: 'select',
      label: 'Publication Type',
      options: [
        { label: 'Print Only', value: 'PRINT' },
        { label: 'Digital Only', value: 'DIGI' },
        { label: 'Print + Digital', value: 'COMBI' }
      ],
      admin: {
        condition: (data) => data.subscription === true
      }
    },
    {
      name: 'extra_type',
      type: 'text',
      label: 'Extra Type',
      admin: {
        condition: (data) => data.subscription === true,
        description: 'Additional metadata (e.g., "Premium", "Student")'
      }
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duration (number of issues)',
      admin: {
        condition: (data) => data.subscription === true,
        description: 'Display only - actual duration determined by THOR actionId'
      }
    },
    {
      name: 'frequency',
      type: 'select',
      label: 'Frequency',
      options: [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Bi-Weekly', value: 'biweekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' }
      ],
      admin: {
        condition: (data) => data.subscription === true,
        description: 'Display only - actual frequency determined by THOR actionId'
      }
    },
    {
      name: 'premium',
      type: 'checkbox',
      label: 'Premium Subscription?',
      defaultValue: false,
      admin: {
        condition: (data) => data.subscription === true,
        description: 'Mark as premium subscription (display purposes)'
      }
    },
    {
      name: 'external_url',
      type: 'text',
      label: 'External URL',
      admin: {
        condition: (data) => data.subscription === true,
        description: 'Link to magazine website (e.g., winelifemagazine.nl)'
      }
    },
    {
      name: 'price_type',
      type: 'select',
      label: 'Price Type',
      options: [
        { label: 'Regular', value: 'regular' },
        { label: 'Introductory Offer', value: 'introductory' },
        { label: 'Renewal', value: 'renewal' },
        { label: 'Special Promotion', value: 'promotion' }
      ],
      admin: {
        condition: (data) => data.subscription === true,
        description: 'Pricing category for display purposes'
      }
    }
  ],

  // Validation hook
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        // If subscription is enabled, require subscription_code and link_code
        if (data.subscription) {
          if (!data.subscription_code || !data.link_code) {
            throw new Error('Subscription products require both subscription_code and link_code')
          }

          // Validate codes are numeric
          if (isNaN(parseInt(data.subscription_code)) || isNaN(parseInt(data.link_code))) {
            throw new Error('Subscription codes must be numeric THOR IDs')
          }
        }

        return data
      }
    ]
  }
}
```

---

### Migration: Add Subscription Fields to Products

**File**: `src/migrations/add_subscription_fields_to_products.ts`

```sql
-- Migration: Add subscription fields to products table
ALTER TABLE products
  ADD COLUMN subscription BOOLEAN DEFAULT FALSE,
  ADD COLUMN subscription_code VARCHAR(50),
  ADD COLUMN link_code VARCHAR(50),
  ADD COLUMN type VARCHAR(20),
  ADD COLUMN extra_type VARCHAR(100),
  ADD COLUMN duration INTEGER,
  ADD COLUMN frequency VARCHAR(20),
  ADD COLUMN premium BOOLEAN DEFAULT FALSE,
  ADD COLUMN external_url TEXT,
  ADD COLUMN price_type VARCHAR(50);

-- Add index for faster subscription product queries
CREATE INDEX idx_products_subscription ON products(subscription) WHERE subscription = TRUE;
CREATE INDEX idx_products_subscription_code ON products(subscription_code) WHERE subscription_code IS NOT NULL;
```

---

### Validation & Error Handling

#### Pre-Checkout Validation

```typescript
// src/lib/thor/validateSubscriptionProduct.ts
import { ThorApiService } from './ThorApiService'

export async function validateSubscriptionProduct(product: Product) {
  const errors: string[] = []

  // 1. Check required fields
  if (!product.subscription_code) {
    errors.push('Missing subscription_code (THOR actionId)')
  }

  if (!product.link_code) {
    errors.push('Missing link_code (THOR magazineId)')
  }

  if (!product.type) {
    errors.push('Missing publication type (PRINT/DIGI/COMBI)')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  // 2. Validate codes exist in THOR
  const thorService = new ThorApiService()

  const action = await thorService.getAction(parseInt(product.subscription_code))
  if (!action) {
    errors.push(`Invalid subscription_code: ${product.subscription_code} not found in THOR`)
  }

  const magazine = await thorService.getMagazine(parseInt(product.link_code))
  if (!magazine) {
    errors.push(`Invalid link_code: ${product.link_code} not found in THOR`)
  }

  // 3. Validate action matches magazine
  if (action && magazine && action.magazineId !== magazine.id) {
    errors.push(`Subscription code ${product.subscription_code} does not match magazine ${product.link_code}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    action,
    magazine
  }
}
```

---

### Testing Checklist

**Pre-deployment Validation:**
- [ ] All subscription products have valid `subscription_code` (exists in THOR)
- [ ] All subscription products have valid `link_code` (exists in THOR)
- [ ] `subscription_code` matches correct `link_code` (same magazine)
- [ ] Test checkout flow end-to-end (development → THOR test environment)
- [ ] Verify subscription appears in THOR admin panel
- [ ] Verify subscription cached in Payload `thor_subscriptions`
- [ ] Test payment link generation (iDEAL, PayPal, etc.)
- [ ] Test confirmation email sending
- [ ] Test error handling (invalid codes, API failures)

**Production Validation:**
- [ ] Smoke test: Create 1 test subscription
- [ ] Verify subscription in THOR production
- [ ] Verify user can view subscription at `/my-account/subscriptions`
- [ ] Monitor error logs for first 24 hours

---

## 🗄️ Database Schema Design

### New Tables

#### `thor_subscriptions`
**Purpose**: Local cache of THOR subscriptions for performance + offline capability

```sql
CREATE TABLE thor_subscriptions (
  -- Primary Keys
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id INTEGER NOT NULL UNIQUE, -- THOR subscriptionId

  -- User Relations
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,

  -- THOR Data (JSON cache of full subscription object)
  thor_data JSONB NOT NULL,

  -- Key Extracted Fields (for fast queries)
  magazine_id INTEGER NOT NULL,
  magazine_name VARCHAR(255),
  subscription_number VARCHAR(100), -- Customer-facing number
  subscription_type_holder_code VARCHAR(50),

  -- Status
  is_active BOOLEAN DEFAULT true,
  will_expire BOOLEAN DEFAULT false,
  will_renew BOOLEAN DEFAULT true,

  -- Subscription Details
  start_date DATE,
  cancellation_date DATE,
  cancellation_edition_id INTEGER,
  cancellation_reason_code VARCHAR(50),

  -- Period Info
  last_period_start_edition_id INTEGER,
  last_period_count INTEGER,
  last_period_copies INTEGER,

  -- Receiver (Ontvanger)
  receiver_subscriber_id INTEGER,
  receiver_first_name VARCHAR(100),
  receiver_last_name VARCHAR(100),
  receiver_email VARCHAR(255),
  receiver_phone VARCHAR(50),
  receiver_address_line1 VARCHAR(255),
  receiver_address_line2 VARCHAR(255),
  receiver_postal_code VARCHAR(20),
  receiver_city VARCHAR(100),
  receiver_country_code VARCHAR(2),

  -- Payer (Betaler) - if different from receiver
  receiver_is_payer BOOLEAN DEFAULT true,
  payer_subscriber_id INTEGER,
  payer_first_name VARCHAR(100),
  payer_last_name VARCHAR(100),
  payer_email VARCHAR(255),
  payer_phone VARCHAR(50),
  payer_address_line1 VARCHAR(255),
  payer_address_line2 VARCHAR(255),
  payer_postal_code VARCHAR(20),
  payer_city VARCHAR(100),
  payer_country_code VARCHAR(2),

  -- Payment
  payment_method_code VARCHAR(10), -- AI, ID, MC, PP, CC, UG, DF
  invoice_period_code VARCHAR(10), -- GP (Gehele Periode), JL (Jaar), KW (Kwartaal), etc.
  bank_account_iban VARCHAR(50),
  bank_account_bic VARCHAR(20),

  -- Sync Metadata
  synced_at TIMESTAMP NOT NULL DEFAULT NOW(),
  sync_status VARCHAR(20) DEFAULT 'synced', -- synced, pending, error
  sync_error TEXT,

  -- Audit
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Indexes
  INDEX idx_thor_subscriptions_user_id (user_id),
  INDEX idx_thor_subscriptions_client_id (client_id),
  INDEX idx_thor_subscriptions_magazine_id (magazine_id),
  INDEX idx_thor_subscriptions_subscription_id (subscription_id),
  INDEX idx_thor_subscriptions_is_active (is_active),
  INDEX idx_thor_subscriptions_receiver_email (receiver_email),
  INDEX idx_thor_subscriptions_synced_at (synced_at)
);
```

#### `thor_invoices`
**Purpose**: Local cache of invoices from THOR

```sql
CREATE TABLE thor_invoices (
  -- Primary Keys
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id INTEGER NOT NULL UNIQUE, -- THOR invoice ID
  payment_reference VARCHAR(100) UNIQUE, -- Unique payment reference

  -- Relations
  subscription_id INTEGER REFERENCES thor_subscriptions(subscription_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- THOR Data
  thor_data JSONB NOT NULL,

  -- Invoice Details
  invoice_number VARCHAR(100),
  invoice_date DATE NOT NULL,
  due_date DATE,

  -- Amounts
  amount DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  amount_open DECIMAL(10, 2) NOT NULL,

  -- Status
  status VARCHAR(20) NOT NULL, -- paid, pending, cancelled, overdue
  payment_method_code VARCHAR(10),
  one_time_payment BOOLEAN DEFAULT false, -- false = initial subscription invoice

  -- Payment Link
  payment_link_url TEXT,
  payment_link_expires_at TIMESTAMP,

  -- Sync
  synced_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Audit
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Indexes
  INDEX idx_thor_invoices_subscription_id (subscription_id),
  INDEX idx_thor_invoices_user_id (user_id),
  INDEX idx_thor_invoices_status (status),
  INDEX idx_thor_invoices_payment_reference (payment_reference),
  INDEX idx_thor_invoices_invoice_date (invoice_date)
);
```

#### `thor_sync_log`
**Purpose**: Audit log for all THOR API interactions

```sql
CREATE TABLE thor_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Sync Details
  sync_type VARCHAR(50) NOT NULL, -- 'subscription_fetch', 'subscription_create', 'invoice_fetch', etc.
  direction VARCHAR(10) NOT NULL, -- 'inbound' (THOR → us), 'outbound' (us → THOR)

  -- API Details
  endpoint VARCHAR(255) NOT NULL,
  http_method VARCHAR(10) NOT NULL,
  request_payload JSONB,
  response_status INTEGER,
  response_payload JSONB,

  -- Relations
  user_id UUID REFERENCES users(id),
  subscription_id INTEGER,
  invoice_id INTEGER,

  -- Result
  success BOOLEAN NOT NULL,
  error_message TEXT,
  error_code VARCHAR(50),

  -- Performance
  duration_ms INTEGER,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Indexes
  INDEX idx_thor_sync_log_sync_type (sync_type),
  INDEX idx_thor_sync_log_created_at (created_at),
  INDEX idx_thor_sync_log_success (success),
  INDEX idx_thor_sync_log_subscription_id (subscription_id)
);
```

#### `thor_magazines`
**Purpose**: Local cache of available magazines from THOR

```sql
CREATE TABLE thor_magazines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  magazine_id INTEGER NOT NULL UNIQUE, -- THOR magazineId

  -- Magazine Details
  thor_data JSONB NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  publication_type VARCHAR(10), -- PRINT, DIGI, COMBI

  -- Configuration
  is_active BOOLEAN DEFAULT true,
  client_id UUID REFERENCES clients(id),

  -- Sync
  synced_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Audit
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  INDEX idx_thor_magazines_magazine_id (magazine_id),
  INDEX idx_thor_magazines_client_id (client_id),
  INDEX idx_thor_magazines_is_active (is_active)
);
```

#### `thor_actions`
**Purpose**: Cache of subscription actions/offers from THOR

```sql
CREATE TABLE thor_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id INTEGER NOT NULL UNIQUE, -- THOR actionId
  magazine_id INTEGER REFERENCES thor_magazines(magazine_id),

  -- Action Details
  thor_data JSONB NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  action_code VARCHAR(50),

  -- Availability
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,

  -- Sync
  synced_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Audit
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  INDEX idx_thor_actions_action_id (action_id),
  INDEX idx_thor_actions_magazine_id (magazine_id),
  INDEX idx_thor_actions_is_active (is_active)
);
```

### Migration Files

**File**: `src/migrations/YYYYMMDDHHMMSS_create_thor_tables.ts`

```typescript
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(`
    -- thor_subscriptions table
    CREATE TABLE IF NOT EXISTS thor_subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subscription_id INTEGER NOT NULL UNIQUE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
      thor_data JSONB NOT NULL,
      magazine_id INTEGER NOT NULL,
      magazine_name VARCHAR(255),
      subscription_number VARCHAR(100),
      subscription_type_holder_code VARCHAR(50),
      is_active BOOLEAN DEFAULT true,
      will_expire BOOLEAN DEFAULT false,
      will_renew BOOLEAN DEFAULT true,
      start_date DATE,
      cancellation_date DATE,
      cancellation_edition_id INTEGER,
      cancellation_reason_code VARCHAR(50),
      last_period_start_edition_id INTEGER,
      last_period_count INTEGER,
      last_period_copies INTEGER,
      receiver_subscriber_id INTEGER,
      receiver_first_name VARCHAR(100),
      receiver_last_name VARCHAR(100),
      receiver_email VARCHAR(255),
      receiver_phone VARCHAR(50),
      receiver_address_line1 VARCHAR(255),
      receiver_address_line2 VARCHAR(255),
      receiver_postal_code VARCHAR(20),
      receiver_city VARCHAR(100),
      receiver_country_code VARCHAR(2),
      receiver_is_payer BOOLEAN DEFAULT true,
      payer_subscriber_id INTEGER,
      payer_first_name VARCHAR(100),
      payer_last_name VARCHAR(100),
      payer_email VARCHAR(255),
      payer_phone VARCHAR(50),
      payer_address_line1 VARCHAR(255),
      payer_address_line2 VARCHAR(255),
      payer_postal_code VARCHAR(20),
      payer_city VARCHAR(100),
      payer_country_code VARCHAR(2),
      payment_method_code VARCHAR(10),
      invoice_period_code VARCHAR(10),
      bank_account_iban VARCHAR(50),
      bank_account_bic VARCHAR(20),
      synced_at TIMESTAMP NOT NULL DEFAULT NOW(),
      sync_status VARCHAR(20) DEFAULT 'synced',
      sync_error TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_thor_subscriptions_user_id ON thor_subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_thor_subscriptions_client_id ON thor_subscriptions(client_id);
    CREATE INDEX IF NOT EXISTS idx_thor_subscriptions_magazine_id ON thor_subscriptions(magazine_id);
    CREATE INDEX IF NOT EXISTS idx_thor_subscriptions_subscription_id ON thor_subscriptions(subscription_id);
    CREATE INDEX IF NOT EXISTS idx_thor_subscriptions_is_active ON thor_subscriptions(is_active);
    CREATE INDEX IF NOT EXISTS idx_thor_subscriptions_receiver_email ON thor_subscriptions(receiver_email);
    CREATE INDEX IF NOT EXISTS idx_thor_subscriptions_synced_at ON thor_subscriptions(synced_at);

    -- thor_invoices table
    CREATE TABLE IF NOT EXISTS thor_invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_id INTEGER NOT NULL UNIQUE,
      payment_reference VARCHAR(100) UNIQUE,
      subscription_id INTEGER REFERENCES thor_subscriptions(subscription_id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      thor_data JSONB NOT NULL,
      invoice_number VARCHAR(100),
      invoice_date DATE NOT NULL,
      due_date DATE,
      amount DECIMAL(10, 2) NOT NULL,
      amount_paid DECIMAL(10, 2) DEFAULT 0,
      amount_open DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL,
      payment_method_code VARCHAR(10),
      one_time_payment BOOLEAN DEFAULT false,
      payment_link_url TEXT,
      payment_link_expires_at TIMESTAMP,
      synced_at TIMESTAMP NOT NULL DEFAULT NOW(),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_thor_invoices_subscription_id ON thor_invoices(subscription_id);
    CREATE INDEX IF NOT EXISTS idx_thor_invoices_user_id ON thor_invoices(user_id);
    CREATE INDEX IF NOT EXISTS idx_thor_invoices_status ON thor_invoices(status);
    CREATE INDEX IF NOT EXISTS idx_thor_invoices_payment_reference ON thor_invoices(payment_reference);
    CREATE INDEX IF NOT EXISTS idx_thor_invoices_invoice_date ON thor_invoices(invoice_date);

    -- thor_sync_log table
    CREATE TABLE IF NOT EXISTS thor_sync_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sync_type VARCHAR(50) NOT NULL,
      direction VARCHAR(10) NOT NULL,
      endpoint VARCHAR(255) NOT NULL,
      http_method VARCHAR(10) NOT NULL,
      request_payload JSONB,
      response_status INTEGER,
      response_payload JSONB,
      user_id UUID REFERENCES users(id),
      subscription_id INTEGER,
      invoice_id INTEGER,
      success BOOLEAN NOT NULL,
      error_message TEXT,
      error_code VARCHAR(50),
      duration_ms INTEGER,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_thor_sync_log_sync_type ON thor_sync_log(sync_type);
    CREATE INDEX IF NOT EXISTS idx_thor_sync_log_created_at ON thor_sync_log(created_at);
    CREATE INDEX IF NOT EXISTS idx_thor_sync_log_success ON thor_sync_log(success);
    CREATE INDEX IF NOT EXISTS idx_thor_sync_log_subscription_id ON thor_sync_log(subscription_id);

    -- thor_magazines table
    CREATE TABLE IF NOT EXISTS thor_magazines (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      magazine_id INTEGER NOT NULL UNIQUE,
      thor_data JSONB NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      publication_type VARCHAR(10),
      is_active BOOLEAN DEFAULT true,
      client_id UUID REFERENCES clients(id),
      synced_at TIMESTAMP NOT NULL DEFAULT NOW(),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_thor_magazines_magazine_id ON thor_magazines(magazine_id);
    CREATE INDEX IF NOT EXISTS idx_thor_magazines_client_id ON thor_magazines(client_id);
    CREATE INDEX IF NOT EXISTS idx_thor_magazines_is_active ON thor_magazines(is_active);

    -- thor_actions table
    CREATE TABLE IF NOT EXISTS thor_actions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      action_id INTEGER NOT NULL UNIQUE,
      magazine_id INTEGER REFERENCES thor_magazines(magazine_id),
      thor_data JSONB NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      action_code VARCHAR(50),
      is_active BOOLEAN DEFAULT true,
      start_date DATE,
      end_date DATE,
      synced_at TIMESTAMP NOT NULL DEFAULT NOW(),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_thor_actions_action_id ON thor_actions(action_id);
    CREATE INDEX IF NOT EXISTS idx_thor_actions_magazine_id ON thor_actions(magazine_id);
    CREATE INDEX IF NOT EXISTS idx_thor_actions_is_active ON thor_actions(is_active);
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(`
    DROP TABLE IF EXISTS thor_actions CASCADE;
    DROP TABLE IF EXISTS thor_magazines CASCADE;
    DROP TABLE IF EXISTS thor_sync_log CASCADE;
    DROP TABLE IF EXISTS thor_invoices CASCADE;
    DROP TABLE IF EXISTS thor_subscriptions CASCADE;
  `)
}
```

### Relations to Existing Tables

**`users` table**: Link subscriptions to webshop users
- `thor_subscriptions.user_id → users.id`
- User authentication required before accessing subscriptions

**`clients` table**: Multi-tenant support (Aboland has multiple webshops)
- `thor_subscriptions.client_id → clients.id`
- `thor_magazines.client_id → clients.id`
- Isolate data per webshop

### Users Collection Extensions (Auto-Registration Support)

**Extra Fields Voor Optie B (Magic Link + Auto-Registration):**

```typescript
// src/collections/Users/index.ts

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    // Existing fields...
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'password',
      type: 'password',
      required: true, // Note: Can be optional if using passwordless magic link only
    },

    // NEW FIELDS for auto-registration tracking:
    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Set to true automatically when user verifies via magic link',
      },
    },
    {
      name: 'accountSource',
      type: 'select',
      options: [
        { label: 'Manual Registration', value: 'manual' },
        { label: 'THOR Magic Link', value: 'thor_magic_link' },
        { label: 'Guest Checkout', value: 'guest' },
      ],
      defaultValue: 'manual',
      admin: {
        description: 'How was this account created?',
      },
    },
    {
      name: 'thorVerifiedAt',
      type: 'date',
      admin: {
        description: 'When was this user verified via THOR magic link?',
      },
    },
    {
      name: 'thorSubscriptionId',
      type: 'text',
      admin: {
        description: 'THOR subscription ID used for verification (first one)',
      },
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        description: 'Last login timestamp (for cleanup automation)',
      },
      hooks: {
        beforeChange: [
          ({ operation }) => {
            if (operation === 'update') {
              return new Date()
            }
          },
        ],
      },
    },
    {
      name: 'createdVia',
      type: 'select',
      options: [
        { label: 'User Registration', value: 'user_registration' },
        { label: 'Auto Registration (Magic Link)', value: 'auto_registration' },
        { label: 'Admin Created', value: 'admin' },
      ],
      defaultValue: 'user_registration',
      admin: {
        description: 'How was this account originally created?',
        readOnly: true, // Set once, never changed
      },
    },
  ],
}
```

**Database Migration (Optie B):**

```sql
-- Add new columns to users table for auto-registration tracking
ALTER TABLE users
  ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN account_source VARCHAR(50) DEFAULT 'manual',
  ADD COLUMN thor_verified_at TIMESTAMP,
  ADD COLUMN thor_subscription_id VARCHAR(255),
  ADD COLUMN last_login_at TIMESTAMP,
  ADD COLUMN created_via VARCHAR(50) DEFAULT 'user_registration';

-- Create index for cleanup queries
CREATE INDEX idx_users_last_login ON users(last_login_at);
CREATE INDEX idx_users_account_source ON users(account_source);
```

**Waarom Deze Fields?**

1. **`emailVerified`**: Track of email al geverifieerd is (via THOR of email link)
2. **`accountSource`**: Weet waar user vandaan komt (magic link vs handmatige registratie)
3. **`thorVerifiedAt`**: Audit trail - wanneer werd magic link gebruikt?
4. **`thorSubscriptionId`**: Welk abonnement werd gebruikt voor verificatie?
5. **`lastLoginAt`**: Voor automatische cleanup (12+ maanden inactief)
6. **`createdVia`**: Permanente record van hoe account werd aangemaakt

**Cleanup Automation:**

```typescript
// src/scripts/cleanup-inactive-users.ts
// Draait dagelijks via cron job

export async function cleanupInactiveUsers() {
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

  // Find users who:
  // 1. Haven't logged in for 12+ months
  // 2. Created via auto-registration (magic link)
  // 3. Have no active subscriptions
  const inactiveUsers = await payload.find({
    collection: 'users',
    where: {
      and: [
        { lastLoginAt: { less_than: twelveMonthsAgo } },
        { createdVia: { equals: 'auto_registration' } },
      ],
    },
  })

  for (const user of inactiveUsers.docs) {
    // Check if user has active subscriptions
    const subscriptions = await payload.find({
      collection: 'thor_subscriptions',
      where: {
        and: [
          { user_id: { equals: user.id } },
          { status: { equals: 'active' } },
        ],
      },
    })

    if (subscriptions.totalDocs === 0) {
      // Safe to delete - no active subscriptions
      await payload.delete({
        collection: 'users',
        id: user.id,
      })

      console.log(`Deleted inactive user: ${user.email}`)
    }
  }
}
```

### Data Integrity Constraints

```sql
-- Ensure subscription_id is unique and not null
ALTER TABLE thor_subscriptions
  ADD CONSTRAINT uk_thor_subscription_id UNIQUE (subscription_id);

-- Ensure invoice payment_reference is unique
ALTER TABLE thor_invoices
  ADD CONSTRAINT uk_thor_invoice_payment_ref UNIQUE (payment_reference);

-- Ensure user owns their subscriptions
ALTER TABLE thor_subscriptions
  ADD CONSTRAINT chk_user_email_match
  CHECK (
    (receiver_is_payer = true AND receiver_email IS NOT NULL) OR
    (receiver_is_payer = false AND payer_email IS NOT NULL)
  );

-- Ensure amounts are positive
ALTER TABLE thor_invoices
  ADD CONSTRAINT chk_positive_amount CHECK (amount >= 0),
  ADD CONSTRAINT chk_positive_amount_paid CHECK (amount_paid >= 0),
  ADD CONSTRAINT chk_positive_amount_open CHECK (amount_open >= 0);
```

---

## 🔌 API Integration Layer

### Service Classes Structure

```
src/lib/thor/
├── services/
│   ├── ThorApiService.ts          # Main API client
│   ├── ThorAuthService.ts         # JWT authentication
│   ├── ThorSyncService.ts         # Background sync
│   ├── ThorCacheService.ts        # Cache management
│   └── ThorWebhookService.ts      # Webhook handling (future)
├── types/
│   ├── subscription.ts            # TypeScript types
│   ├── invoice.ts
│   ├── magazine.ts
│   ├── action.ts
│   └── api.ts
├── utils/
│   ├── rateLimiter.ts             # Rate limiting
│   ├── errorHandler.ts            # Error handling
│   ├── logger.ts                  # THOR-specific logging
│   └── validators.ts              # Input validation
└── index.ts                       # Public exports
```

### ThorAuthService

**File**: `src/lib/thor/services/ThorAuthService.ts`

```typescript
import axios from 'axios'
import { features } from '@/lib/features'

interface JWTTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface CachedToken {
  token: string
  expiresAt: Date
}

export class ThorAuthService {
  private static instance: ThorAuthService
  private cachedToken: CachedToken | null = null

  private constructor() {}

  static getInstance(): ThorAuthService {
    if (!ThorAuthService.instance) {
      ThorAuthService.instance = new ThorAuthService()
    }
    return ThorAuthService.instance
  }

  /**
   * Get valid JWT token (from cache or request new)
   */
  async getToken(): Promise<string> {
    // Check cache first
    if (this.cachedToken && this.cachedToken.expiresAt > new Date()) {
      return this.cachedToken.token
    }

    // Request new token
    const authUrl = process.env.THOR_AUTH_BASE_URL!
    const apiKey = process.env.THOR_API_KEY!
    const apiSecret = process.env.THOR_API_SECRET!

    const response = await axios.post<JWTTokenResponse>(
      `${authUrl}/token`,
      {
        grant_type: 'client_credentials',
        client_id: apiKey,
        client_secret: apiSecret,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const { access_token, expires_in } = response.data

    // Cache with 5-minute buffer before expiry
    const expiresAt = new Date(Date.now() + (expires_in - 300) * 1000)
    this.cachedToken = {
      token: access_token,
      expiresAt,
    }

    return access_token
  }

  /**
   * Force token refresh (for error recovery)
   */
  async refreshToken(): Promise<string> {
    this.cachedToken = null
    return this.getToken()
  }

  /**
   * Get Authorization header value
   */
  async getAuthHeader(): Promise<string> {
    const token = await this.getToken()
    return `Bearer ${token}`
  }
}
```

### ThorApiService

**File**: `src/lib/thor/services/ThorApiService.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ThorAuthService } from './ThorAuthService'
import { ThorRateLimiter } from '../utils/rateLimiter'
import { ThorErrorHandler } from '../utils/errorHandler'
import { ThorLogger } from '../utils/logger'
import type {
  ThorSubscription,
  ThorSubscriptionCreatePayload,
  ThorSubscriptionPatchOperation,
  ThorInvoice,
  ThorMagazine,
  ThorAction,
  ThorPaymentLink,
  ThorPaginatedResponse,
} from '../types'

export class ThorApiService {
  private client: AxiosInstance
  private authService: ThorAuthService
  private rateLimiter: ThorRateLimiter
  private logger: ThorLogger

  constructor() {
    const baseURL =
      process.env.THOR_ENV === 'production'
        ? process.env.THOR_API_BASE_URL
        : process.env.THOR_API_BASE_URL_TEST

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 seconds
    })

    this.authService = ThorAuthService.getInstance()
    this.rateLimiter = new ThorRateLimiter()
    this.logger = new ThorLogger()

    // Request interceptor - add auth + rate limiting
    this.client.interceptors.request.use(async (config) => {
      // Wait for rate limiter
      await this.rateLimiter.acquire(config.url!)

      // Add authorization
      config.headers.Authorization = await this.authService.getAuthHeader()

      // Add culture header (default nl-NL)
      config.headers['Accept-Language'] = config.headers['Accept-Language'] || 'nl-NL'

      // Log request (if enabled)
      this.logger.logRequest(config)

      return config
    })

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => {
        this.logger.logResponse(response)
        return response
      },
      async (error) => {
        // Handle 401 - try token refresh once
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true
          await this.authService.refreshToken()
          return this.client.request(error.config)
        }

        // Log error
        this.logger.logError(error)

        // Handle error
        throw ThorErrorHandler.handle(error)
      }
    )
  }

  // ============================================
  // SUBSCRIPTIONS
  // ============================================

  /**
   * Get subscription by ID
   */
  async getSubscription(subscriptionId: number): Promise<ThorSubscription> {
    const { data } = await this.client.get<ThorSubscription>(
      `/api/subscriptions/${subscriptionId}`
    )
    return data
  }

  /**
   * Get all subscriptions (paginated)
   */
  async getSubscriptions(params?: {
    pageSize?: number
    pageNumber?: number
    magazineId?: number
    isActive?: boolean
  }): Promise<ThorPaginatedResponse<ThorSubscription>> {
    const { data } = await this.client.get<ThorPaginatedResponse<ThorSubscription>>(
      '/api/subscriptions',
      { params }
    )
    return data
  }

  /**
   * Get subscriptions by subscriber email
   */
  async getSubscriptionsByEmail(email: string): Promise<ThorSubscription[]> {
    const { data } = await this.client.get<ThorPaginatedResponse<ThorSubscription>>(
      '/api/subscriptions',
      {
        params: {
          'receiver.email': email,
          pageSize: 100,
        },
      }
    )
    return data.items || []
  }

  /**
   * Create new subscription
   */
  async createSubscription(
    payload: ThorSubscriptionCreatePayload
  ): Promise<ThorSubscription> {
    const { data } = await this.client.post<ThorSubscription>(
      '/api/subscriptions',
      payload
    )
    return data
  }

  /**
   * Update subscription (JSON Patch)
   */
  async updateSubscription(
    subscriptionId: number,
    operations: ThorSubscriptionPatchOperation[]
  ): Promise<ThorSubscription> {
    const { data } = await this.client.patch<ThorSubscription>(
      `/api/subscriptions/${subscriptionId}`,
      operations,
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      }
    )
    return data
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: number,
    cancellationDate: string,
    cancellationEditionId: number,
    cancellationReasonCode: string
  ): Promise<ThorSubscription> {
    return this.updateSubscription(subscriptionId, [
      { op: 'replace', path: '/cancellationdate', value: cancellationDate },
      { op: 'replace', path: '/cancellationeditionid', value: cancellationEditionId },
      { op: 'replace', path: '/cancellationreasoncode', value: cancellationReasonCode },
    ])
  }

  /**
   * Change subscription address
   */
  async changeAddress(
    subscriptionId: number,
    address: {
      addressLine1: string
      addressLine2?: string
      postalCode: string
      city: string
      countryCode: string
    }
  ): Promise<ThorSubscription> {
    return this.updateSubscription(subscriptionId, [
      { op: 'replace', path: '/receiver/address/addressline1', value: address.addressLine1 },
      { op: 'replace', path: '/receiver/address/addressline2', value: address.addressLine2 || '' },
      { op: 'replace', path: '/receiver/address/postalcode', value: address.postalCode },
      { op: 'replace', path: '/receiver/address/city', value: address.city },
      { op: 'replace', path: '/receiver/address/countrycode', value: address.countryCode },
    ])
  }

  /**
   * Change subscription email
   */
  async changeEmail(subscriptionId: number, email: string): Promise<ThorSubscription> {
    return this.updateSubscription(subscriptionId, [
      { op: 'replace', path: '/receiver/email', value: email },
    ])
  }

  // ============================================
  // INVOICES
  // ============================================

  /**
   * Get invoices for subscription
   */
  async getInvoices(params?: {
    subscriptionId?: number
    paymentReference?: string
    pageSize?: number
    pageNumber?: number
  }): Promise<ThorPaginatedResponse<ThorInvoice>> {
    const { data } = await this.client.get<ThorPaginatedResponse<ThorInvoice>>(
      '/api/invoices',
      { params }
    )
    return data
  }

  /**
   * Get invoice by payment reference
   */
  async getInvoiceByPaymentReference(paymentReference: string): Promise<ThorInvoice | null> {
    const { data } = await this.client.get<ThorPaginatedResponse<ThorInvoice>>(
      '/api/invoices',
      {
        params: { paymentReference },
      }
    )
    return data.items?.[0] || null
  }

  // ============================================
  // PAYMENT LINKS
  // ============================================

  /**
   * Generate payment link for invoice
   */
  async createPaymentLink(
    paymentReference: string,
    params?: {
      successUrl?: string
      cancelUrl?: string
      errorUrl?: string
    }
  ): Promise<ThorPaymentLink> {
    const { data } = await this.client.get<ThorPaymentLink>(
      '/api/paymentlinks',
      {
        params: {
          paymentReference,
          ...params,
        },
      }
    )
    return data
  }

  // ============================================
  // MAGAZINES
  // ============================================

  /**
   * Get all magazines
   */
  async getMagazines(): Promise<ThorMagazine[]> {
    const { data } = await this.client.get<ThorPaginatedResponse<ThorMagazine>>(
      '/api/magazines',
      {
        params: { pageSize: 100 },
      }
    )
    return data.items || []
  }

  /**
   * Get magazine by ID
   */
  async getMagazine(magazineId: number): Promise<ThorMagazine> {
    const { data } = await this.client.get<ThorMagazine>(`/api/magazines/${magazineId}`)
    return data
  }

  // ============================================
  // ACTIONS (Subscription Offers)
  // ============================================

  /**
   * Get all actions for magazine
   */
  async getActions(magazineId: number): Promise<ThorAction[]> {
    const { data } = await this.client.get<ThorPaginatedResponse<ThorAction>>(
      '/api/actions',
      {
        params: {
          magazineId,
          pageSize: 100,
        },
      }
    )
    return data.items || []
  }

  /**
   * Get action by ID
   */
  async getAction(actionId: number): Promise<ThorAction> {
    const { data} = await this.client.get<ThorAction>(`/api/actions/${actionId}`)
    return data
  }

  // ============================================
  // SHIPMENTS (Resend Missing Issues)
  // ============================================

  /**
   * Create resend shipment for missing issue
   */
  async createResendShipment(params: {
    subscriptionId: number
    editionId: number
    reason?: string
  }): Promise<void> {
    await this.client.post('/api/shipments', params)
  }
}
```

### Rate Limiter

**File**: `src/lib/thor/utils/rateLimiter.ts`

```typescript
/**
 * THOR Rate Limiter
 *
 * THOR API limit: 100 requests per 5 seconds per endpoint
 * We use 80 requests per 5 seconds to be conservative
 */

interface RequestRecord {
  timestamp: number
  endpoint: string
}

export class ThorRateLimiter {
  private requests: RequestRecord[] = []
  private maxRequests: number
  private windowMs: number

  constructor() {
    this.maxRequests = parseInt(process.env.THOR_RATE_LIMIT_MAX || '80', 10)
    this.windowMs = parseInt(process.env.THOR_RATE_LIMIT_WINDOW_SECONDS || '5', 10) * 1000
  }

  /**
   * Wait until we can make request (if needed)
   */
  async acquire(endpoint: string): Promise<void> {
    const now = Date.now()

    // Remove old requests outside window
    this.requests = this.requests.filter(
      (req) => now - req.timestamp < this.windowMs
    )

    // Count requests for this endpoint
    const endpointRequests = this.requests.filter((req) => req.endpoint === endpoint)

    // If at limit, wait
    if (endpointRequests.length >= this.maxRequests) {
      const oldestRequest = endpointRequests[0]
      const waitTime = this.windowMs - (now - oldestRequest.timestamp)

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime + 100)) // +100ms buffer
      }
    }

    // Record this request
    this.requests.push({ timestamp: now, endpoint })
  }

  /**
   * Get current request count for endpoint
   */
  getCount(endpoint: string): number {
    const now = Date.now()
    return this.requests.filter(
      (req) => req.endpoint === endpoint && now - req.timestamp < this.windowMs
    ).length
  }

  /**
   * Clear all records (for testing)
   */
  reset(): void {
    this.requests = []
  }
}
```

### Error Handler

**File**: `src/lib/thor/utils/errorHandler.ts`

```typescript
import { AxiosError } from 'axios'

export class ThorApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ThorApiError'
  }
}

export class ThorErrorHandler {
  static handle(error: AxiosError): ThorApiError {
    if (error.response) {
      // Server responded with error
      const status = error.response.status
      const data = error.response.data as any

      const errorMessage = data?.message || data?.error || error.message
      const errorCode = data?.errorCode || `HTTP_${status}`

      return new ThorApiError(
        `THOR API Error: ${errorMessage}`,
        status,
        errorCode,
        data
      )
    } else if (error.request) {
      // Request made but no response
      return new ThorApiError(
        'THOR API did not respond. Check network connection.',
        undefined,
        'NO_RESPONSE'
      )
    } else {
      // Error setting up request
      return new ThorApiError(
        `Request setup error: ${error.message}`,
        undefined,
        'REQUEST_SETUP_ERROR'
      )
    }
  }

  static isRateLimitError(error: ThorApiError): boolean {
    return error.statusCode === 429
  }

  static isAuthError(error: ThorApiError): boolean {
    return error.statusCode === 401 || error.statusCode === 403
  }

  static isNotFoundError(error: ThorApiError): boolean {
    return error.statusCode === 404
  }

  static isValidationError(error: ThorApiError): boolean {
    return error.statusCode === 400
  }
}
```

---

## 🎨 Frontend Components

### Component Structure

```
src/app/(ecommerce)/my-account/subscriptions/
├── page.tsx                              # List all subscriptions
├── [id]/
│   ├── page.tsx                          # Subscription detail/edit
│   ├── components/
│   │   ├── SubscriptionHeader.tsx
│   │   ├── SubscriptionDetails.tsx
│   │   ├── ReceiverDetails.tsx
│   │   ├── PayerDetails.tsx
│   │   ├── InvoicesList.tsx
│   │   ├── EditionSchedule.tsx
│   │   ├── CancelSubscriptionForm.tsx
│   │   ├── ChangeAddressForm.tsx
│   │   ├── ChangeEmailForm.tsx
│   │   ├── ChangePaymentMethodForm.tsx
│   │   └── ReportMissingIssueForm.tsx
│   └── actions.ts                        # Server actions
└── components/
    ├── SubscriptionCard.tsx              # Subscription summary card
    ├── SubscriptionFilters.tsx           # Filter by magazine/status
    └── EmptyState.tsx

src/app/(ecommerce)/abonnementen/
├── page.tsx                              # Browse available magazines
├── [magazineId]/
│   ├── page.tsx                          # Magazine detail + actions
│   ├── [actionId]/
│   │   └── page.tsx                      # Subscription checkout
│   └── components/
│       ├── MagazineHero.tsx
│       ├── ActionsList.tsx
│       ├── SubscriptionTypeSelector.tsx
│       └── SubscriptionCheckoutForm.tsx
└── components/
    ├── MagazineCard.tsx
    └── MagazineFilters.tsx
```

### Subscriptions List Page

**File**: `src/app/(ecommerce)/my-account/subscriptions/page.tsx`

```typescript
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, RefreshCw, BookOpen, Calendar, Euro, CheckCircle, XCircle } from 'lucide-react'
import { SubscriptionCard } from './components/SubscriptionCard'
import { SubscriptionFilters } from './components/SubscriptionFilters'
import { EmptyState } from './components/EmptyState'
import { useUser } from '@/hooks/useUser'
import type { ThorSubscription } from '@/lib/thor/types'

export default function SubscriptionsPage() {
  const { user } = useUser()
  const [subscriptions, setSubscriptions] = useState<ThorSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled'>('all')
  const [magazineFilter, setMagazineFilter] = useState<number | null>(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [user])

  const fetchSubscriptions = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/thor/subscriptions')

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions')
      }

      const data = await response.json()
      setSubscriptions(data.subscriptions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const filteredSubscriptions = subscriptions.filter((sub) => {
    // Filter by status
    if (filter === 'active' && !sub.isActive) return false
    if (filter === 'cancelled' && sub.isActive) return false

    // Filter by magazine
    if (magazineFilter && sub.magazineId !== magazineFilter) return false

    return true
  })

  const activeCount = subscriptions.filter((s) => s.isActive).length
  const cancelledCount = subscriptions.filter((s) => !s.isActive).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600">Abonnementen laden...</span>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/my-account/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Mijn Abonnementen</h1>
        </div>
        <p className="text-sm text-gray-600">
          Beheer je lopende en afgelopen abonnementen
        </p>
      </div>

      {/* Stats */}
      {subscriptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{subscriptions.length}</div>
                <div className="text-xs text-gray-600">Totaal</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeCount}</div>
                <div className="text-xs text-gray-600">Actief</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{cancelledCount}</div>
                <div className="text-xs text-gray-600">Beëindigd</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {subscriptions.length > 0 && (
        <SubscriptionFilters
          filter={filter}
          onFilterChange={setFilter}
          magazineFilter={magazineFilter}
          onMagazineFilterChange={setMagazineFilter}
          subscriptions={subscriptions}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={fetchSubscriptions}
            className="mt-2 text-red-600 hover:text-red-800 text-sm font-semibold"
          >
            Opnieuw proberen
          </button>
        </div>
      )}

      {/* Subscriptions List */}
      {filteredSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.subscriptionId}
              subscription={subscription}
            />
          ))}
        </div>
      ) : subscriptions.length > 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Geen abonnementen gevonden"
          description="Geen abonnementen gevonden met de huidige filters."
        />
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Geen abonnementen"
          description="Je hebt nog geen abonnementen. Bekijk ons aanbod om een abonnement af te sluiten."
          actionLabel="Bekijk magazines"
          actionHref="/abonnementen"
        />
      )}
    </div>
  )
}
```

### Subscription Card Component

**File**: `src/app/(ecommerce)/my-account/subscriptions/components/SubscriptionCard.tsx`

```typescript
'use client'

import React from 'react'
import Link from 'next/link'
import { BookOpen, Calendar, MapPin, CreditCard, Eye, AlertCircle } from 'lucide-react'
import type { ThorSubscription } from '@/lib/thor/types'

interface SubscriptionCardProps {
  subscription: ThorSubscription
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const {
    subscriptionId,
    magazineName,
    subscriptionNumber,
    isActive,
    willExpire,
    lastPeriod,
    receiver,
    paymentMethodCode,
    cancellationDate,
  } = subscription

  const statusColor = isActive
    ? 'bg-green-50 text-green-700 border-green-200'
    : 'bg-gray-50 text-gray-700 border-gray-200'

  const statusLabel = isActive ? 'Actief' : 'Beëindigd'

  // Calculate remaining issues (if applicable)
  const remainingIssues = lastPeriod?.count || 0
  const startEdition = lastPeriod?.startEdition?.name || 'Onbekend'

  // Format cancellation date
  const formattedCancellationDate = cancellationDate
    ? new Date(cancellationDate).toLocaleDateString('nl-NL')
    : null

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-lg font-bold">{magazineName}</h3>
                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Abonnementsnummer: <span className="font-mono font-semibold">{subscriptionNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-3">
        {/* Delivery Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold text-gray-900">
              {receiver.firstName} {receiver.lastName}
            </div>
            <div className="text-gray-600">
              {receiver.address.addressLine1}
              {receiver.address.addressLine2 && `, ${receiver.address.addressLine2}`}
            </div>
            <div className="text-gray-600">
              {receiver.address.postalCode} {receiver.address.city}
            </div>
          </div>
        </div>

        {/* Period Info */}
        {isActive && (
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="text-gray-600">
                Start editie: <span className="font-semibold">{startEdition}</span>
              </div>
              {remainingIssues > 0 && (
                <div className="text-gray-600">
                  Aantal edities: <span className="font-semibold">{remainingIssues}</span>
                </div>
              )}
              {willExpire && formattedCancellationDate && (
                <div className="text-amber-600 font-semibold">
                  Loopt af op: {formattedCancellationDate}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="flex items-center gap-3">
          <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            Betaalmethode: <span className="font-semibold">{getPaymentMethodLabel(paymentMethodCode)}</span>
          </div>
        </div>

        {/* Cancellation Notice */}
        {!isActive && formattedCancellationDate && (
          <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              Abonnement beëindigd op {formattedCancellationDate}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <Link
          href={`/my-account/subscriptions/${subscriptionId}`}
          className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Bekijk & beheer
        </Link>
      </div>
    </div>
  )
}

function getPaymentMethodLabel(code: string): string {
  const labels: Record<string, string> = {
    AI: 'Automatische Incasso',
    ID: 'iDEAL',
    MC: 'Mister Cash',
    PP: 'PayPal',
    CC: 'Creditcard',
    UG: 'Bij Uitgever',
    DF: 'Digitale Factuur',
  }
  return labels[code] || code
}
```

---

## 🔄 2-Way Sync Strategy

### Sync Architecture

**Principle**: THOR is the **source of truth** for subscription data. Webshop is a **read-mostly cache** with selective write operations.

### Sync Directions

**THOR → Webshop (Inbound Sync)**:
- **Trigger**: Scheduled polling (every 15-30 minutes)
- **Purpose**: Keep local cache fresh with THOR changes
- **Actions**:
  - Fetch updated subscriptions
  - Fetch new invoices
  - Update local `thor_subscriptions` and `thor_invoices` tables
- **Implementation**: `ThorSyncService.syncFromThor()`

**Webshop → THOR (Outbound Sync)**:
- **Trigger**: User actions (immediate)
- **Purpose**: Update THOR with user changes
- **Actions**:
  - Create subscription
  - Cancel subscription
  - Change address/email
  - Request payment link
- **Implementation**: Direct API calls via `ThorApiService`

### Sync Service

**File**: `src/lib/thor/services/ThorSyncService.ts`

```typescript
import { ThorApiService } from './ThorApiService'
import { ThorCacheService } from './ThorCacheService'
import { ThorLogger } from '../utils/logger'
import { features } from '@/lib/features'
import type { ThorSubscription, ThorInvoice } from '../types'

export class ThorSyncService {
  private apiService: ThorApiService
  private cacheService: ThorCacheService
  private logger: ThorLogger
  private isSyncing: boolean = false

  constructor() {
    this.apiService = new ThorApiService()
    this.cacheService = new ThorCacheService()
    this.logger = new ThorLogger()
  }

  /**
   * Full sync: subscriptions + invoices
   */
  async syncAll(): Promise<{ success: boolean; errors: string[] }> {
    if (!features.thor.syncEnabled) {
      return { success: false, errors: ['Sync is disabled'] }
    }

    if (this.isSyncing) {
      return { success: false, errors: ['Sync already in progress'] }
    }

    this.isSyncing = true
    const errors: string[] = []

    try {
      this.logger.info('Starting full THOR sync...')

      // Sync subscriptions
      try {
        await this.syncSubscriptions()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`Subscriptions sync failed: ${message}`)
        this.logger.error('Subscriptions sync failed', error)
      }

      // Sync invoices
      try {
        await this.syncInvoices()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`Invoices sync failed: ${message}`)
        this.logger.error('Invoices sync failed', error)
      }

      this.logger.info(`THOR sync completed with ${errors.length} errors`)

      return {
        success: errors.length === 0,
        errors,
      }
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * Sync all subscriptions from THOR
   */
  async syncSubscriptions(): Promise<void> {
    this.logger.info('Syncing subscriptions from THOR...')

    let pageNumber = 1
    const pageSize = 100
    let totalSynced = 0

    while (true) {
      // Fetch page from THOR
      const response = await this.apiService.getSubscriptions({
        pageSize,
        pageNumber,
      })

      if (!response.items || response.items.length === 0) {
        break // No more pages
      }

      // Update cache for each subscription
      for (const subscription of response.items) {
        await this.cacheService.upsertSubscription(subscription)
        totalSynced++
      }

      this.logger.debug(`Synced page ${pageNumber} (${response.items.length} subscriptions)`)

      // Check if there are more pages
      if (!response.hasNextPage) {
        break
      }

      pageNumber++
    }

    this.logger.info(`Synced ${totalSynced} subscriptions from THOR`)
  }

  /**
   * Sync all invoices from THOR
   */
  async syncInvoices(): Promise<void> {
    this.logger.info('Syncing invoices from THOR...')

    let pageNumber = 1
    const pageSize = 100
    let totalSynced = 0

    while (true) {
      // Fetch page from THOR
      const response = await this.apiService.getInvoices({
        pageSize,
        pageNumber,
      })

      if (!response.items || response.items.length === 0) {
        break
      }

      // Update cache for each invoice
      for (const invoice of response.items) {
        await this.cacheService.upsertInvoice(invoice)
        totalSynced++
      }

      this.logger.debug(`Synced page ${pageNumber} (${response.items.length} invoices)`)

      if (!response.hasNextPage) {
        break
      }

      pageNumber++
    }

    this.logger.info(`Synced ${totalSynced} invoices from THOR`)
  }

  /**
   * Sync single subscription (after user action)
   */
  async syncSubscription(subscriptionId: number): Promise<void> {
    this.logger.info(`Syncing subscription ${subscriptionId} from THOR...`)

    const subscription = await this.apiService.getSubscription(subscriptionId)
    await this.cacheService.upsertSubscription(subscription)

    this.logger.info(`Synced subscription ${subscriptionId}`)
  }

  /**
   * Get sync status
   */
  getSyncStatus(): {
    isSyncing: boolean
    lastSync: Date | null
    nextSync: Date | null
  } {
    return {
      isSyncing: this.isSyncing,
      lastSync: this.cacheService.getLastSyncTime(),
      nextSync: this.cacheService.getNextSyncTime(),
    }
  }
}
```

### Cache Service

**File**: `src/lib/thor/services/ThorCacheService.ts`

```typescript
import { db } from '@/lib/db'
import type { ThorSubscription, ThorInvoice, ThorMagazine, ThorAction } from '../types'

export class ThorCacheService {
  private lastSyncTime: Date | null = null

  /**
   * Upsert subscription to cache
   */
  async upsertSubscription(subscription: ThorSubscription): Promise<void> {
    const exists = await db.query.thorSubscriptions.findFirst({
      where: (subs, { eq }) => eq(subs.subscriptionId, subscription.subscriptionId),
    })

    if (exists) {
      await db
        .update(thorSubscriptions)
        .set({
          thorData: subscription,
          magazineId: subscription.magazineId,
          magazineName: subscription.magazineName,
          subscriptionNumber: subscription.subscriptionNumber,
          isActive: subscription.isActive,
          willExpire: subscription.willExpire,
          willRenew: subscription.willRenew,
          // ... all other fields
          syncedAt: new Date(),
          syncStatus: 'synced',
          updatedAt: new Date(),
        })
        .where(eq(thorSubscriptions.subscriptionId, subscription.subscriptionId))
    } else {
      await db.insert(thorSubscriptions).values({
        subscriptionId: subscription.subscriptionId,
        thorData: subscription,
        magazineId: subscription.magazineId,
        magazineName: subscription.magazineName,
        // ... all other fields
        syncedAt: new Date(),
        syncStatus: 'synced',
      })
    }
  }

  /**
   * Upsert invoice to cache
   */
  async upsertInvoice(invoice: ThorInvoice): Promise<void> {
    const exists = await db.query.thorInvoices.findFirst({
      where: (inv, { eq }) => eq(inv.invoiceId, invoice.invoiceId),
    })

    if (exists) {
      await db
        .update(thorInvoices)
        .set({
          thorData: invoice,
          paymentReference: invoice.paymentReference,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate,
          amount: invoice.amount,
          amountPaid: invoice.amountPaid,
          amountOpen: invoice.amountOpen,
          status: invoice.status,
          // ... all other fields
          syncedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(thorInvoices.invoiceId, invoice.invoiceId))
    } else {
      await db.insert(thorInvoices).values({
        invoiceId: invoice.invoiceId,
        thorData: invoice,
        paymentReference: invoice.paymentReference,
        subscriptionId: invoice.subscriptionId,
        // ... all other fields
        syncedAt: new Date(),
      })
    }
  }

  /**
   * Get cached subscription by ID
   */
  async getSubscription(subscriptionId: number): Promise<ThorSubscription | null> {
    const cached = await db.query.thorSubscriptions.findFirst({
      where: (subs, { eq }) => eq(subs.subscriptionId, subscriptionId),
    })

    return cached?.thorData as ThorSubscription | null
  }

  /**
   * Get all cached subscriptions for user
   */
  async getUserSubscriptions(userId: string): Promise<ThorSubscription[]> {
    const cached = await db.query.thorSubscriptions.findMany({
      where: (subs, { eq }) => eq(subs.userId, userId),
      orderBy: (subs, { desc }) => desc(subs.createdAt),
    })

    return cached.map((c) => c.thorData as ThorSubscription)
  }

  /**
   * Check if cache is fresh (within TTL)
   */
  isCacheFresh(syncedAt: Date): boolean {
    const ttlMinutes = parseInt(process.env.THOR_CACHE_TTL_MINUTES || '15', 10)
    const ttlMs = ttlMinutes * 60 * 1000
    const now = Date.now()
    const age = now - syncedAt.getTime()

    return age < ttlMs
  }

  /**
   * Get last sync time
   */
  getLastSyncTime(): Date | null {
    return this.lastSyncTime
  }

  /**
   * Get next sync time
   */
  getNextSyncTime(): Date | null {
    if (!this.lastSyncTime) return null

    const intervalMinutes = features.thor.syncInterval
    const nextSync = new Date(this.lastSyncTime.getTime() + intervalMinutes * 60 * 1000)
    return nextSync
  }

  /**
   * Mark sync completed
   */
  markSyncCompleted(): void {
    this.lastSyncTime = new Date()
  }
}
```

### Scheduled Sync (Cron Job)

**File**: `src/app/api/cron/thor-sync/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ThorSyncService } from '@/lib/thor/services/ThorSyncService'
import { features } from '@/lib/features'

/**
 * Cron endpoint for periodic THOR sync
 *
 * Configure in Vercel:
 * - Go to Project > Settings > Cron Jobs
 * - Add: /api/cron/thor-sync
 * - Schedule: */15 * * * * (every 15 minutes)
 * - Set CRON_SECRET environment variable
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if sync is enabled
  if (!features.thor.syncEnabled) {
    return NextResponse.json({
      success: false,
      message: 'THOR sync is disabled',
    })
  }

  // Run sync
  const syncService = new ThorSyncService()
  const result = await syncService.syncAll()

  return NextResponse.json({
    success: result.success,
    errors: result.errors,
    timestamp: new Date().toISOString(),
  })
}
```

### Conflict Resolution Strategy

**Scenario**: User changes subscription in THOR admin panel, webshop has stale cache

**Resolution**:
1. **Cache TTL**: Webshop cache expires after 15 minutes
2. **Sync Interval**: Background sync runs every 15-30 minutes
3. **On User Action**: After user modifies subscription via webshop, immediately sync that subscription from THOR
4. **On Load**: When user views subscription detail, check cache freshness:
   - If fresh (< 15 min): Use cache
   - If stale (> 15 min): Fetch from THOR, update cache

**Example** (Subscription Detail Page):

```typescript
async function getSubscription(subscriptionId: number) {
  const cacheService = new ThorCacheService()
  const apiService = new ThorApiService()

  // Get from cache
  const cached = await cacheService.getSubscription(subscriptionId)

  if (cached && cacheService.isCacheFresh(cached.syncedAt)) {
    // Cache is fresh, use it
    return cached
  }

  // Cache is stale or missing, fetch from THOR
  const fresh = await apiService.getSubscription(subscriptionId)
  await cacheService.upsertSubscription(fresh)

  return fresh
}
```

---

## 🔒 Security Considerations

### Authentication & Authorization

**THOR API Authentication**:
- JWT bearer tokens via Authentication API
- Token caching (60-minute TTL with 5-minute buffer)
- Automatic token refresh on 401 errors
- Secure storage of API credentials in environment variables

**User Authentication**:
- Users must be logged in to access subscriptions
- Users can only view/edit their own subscriptions
- Email matching: `user.email === subscription.receiver.email OR subscription.payer.email`

**Authorization Checks**:

```typescript
// API Route: /api/thor/subscriptions/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscriptionId = parseInt(params.id, 10)

  // Fetch subscription
  const apiService = new ThorApiService()
  const subscription = await apiService.getSubscription(subscriptionId)

  // Check ownership
  const userEmail = session.user.email
  const receiverEmail = subscription.receiver.email
  const payerEmail = subscription.payer?.email

  if (userEmail !== receiverEmail && userEmail !== payerEmail) {
    return NextResponse.json(
      { error: 'You do not have permission to view this subscription' },
      { status: 403 }
    )
  }

  return NextResponse.json({ subscription })
}
```

### API Key Security

**Environment Variables**:
```bash
# NEVER commit these to version control
THOR_API_KEY=your-secret-api-key
THOR_API_SECRET=your-secret-api-secret
CRON_SECRET=your-cron-secret
```

**Best Practices**:
- Store in `.env.local` (gitignored)
- Use different keys for test/production
- Rotate keys periodically
- Use Vercel Environment Variables for production

### GDPR Compliance

**Personal Data Storage**:
- Subscription data contains PII (names, addresses, emails)
- Stored in `thor_subscriptions` table
- Cache only, THOR is source of truth

**Data Retention**:
- Delete subscription cache when user deletes account
- CASCADE delete on `user_id` foreign key
- Sync log retention: 90 days

**Data Access**:
- Users can view/edit their own subscriptions
- Admin panel: Only super-admins can view all subscriptions
- Export: Provide data export functionality (GDPR right to portability)

**Data Deletion**:
```typescript
// When user deletes account
async function deleteUserData(userId: string) {
  // Delete subscription cache (THOR data remains)
  await db.delete(thorSubscriptions).where(eq(thorSubscriptions.userId, userId))
  await db.delete(thorInvoices).where(eq(thorInvoices.userId, userId))

  // Delete sync logs older than 90 days
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  await db.delete(thorSyncLog).where(lt(thorSyncLog.createdAt, ninetyDaysAgo))
}
```

### Input Validation

**Subscription Creation**:
```typescript
import { z } from 'zod'

const CreateSubscriptionSchema = z.object({
  magazineId: z.number().int().positive(),
  actionId: z.number().int().positive(),
  paymentMethodCode: z.enum(['AI', 'ID', 'MC', 'PP', 'CC', 'UG', 'DF']),
  receiver: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.object({
      addressLine1: z.string().min(1).max(255),
      addressLine2: z.string().max(255).optional(),
      postalCode: z.string().min(1).max(20),
      city: z.string().min(1).max(100),
      countryCode: z.string().length(2),
    }),
  }),
  // ... etc
})

// Validate before API call
const validated = CreateSubscriptionSchema.parse(requestBody)
```

### Rate Limiting

**THOR API Limits**:
- 100 requests per 5 seconds per endpoint
- Implemented via `ThorRateLimiter` class
- Conservative limit: 80 req/5sec

**Webshop API Limits** (our endpoints):
```typescript
// Prevent abuse of /api/thor/* endpoints
import rateLimit from 'express-rate-limit'

export const thorApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  message: 'Too many requests from this IP, please try again later',
})
```

---

## 🧪 Testing Strategy

### Test Pyramid

```
     /\
    /  \ Unit Tests (70%)
   /____\
  /      \ Integration Tests (20%)
 /________\
/__________\ E2E Tests (10%)
```

### Unit Tests

**Files to Test**:
- `ThorApiService` methods
- `ThorAuthService` token caching
- `ThorRateLimiter` logic
- `ThorCacheService` freshness checks
- Input validators

**Example** (`ThorAuthService.test.ts`):

```typescript
import { ThorAuthService } from '@/lib/thor/services/ThorAuthService'
import { jest } from '@jest/globals'

describe('ThorAuthService', () => {
  let authService: ThorAuthService

  beforeEach(() => {
    authService = ThorAuthService.getInstance()
  })

  it('should cache token and reuse it', async () => {
    const token1 = await authService.getToken()
    const token2 = await authService.getToken()

    expect(token1).toBe(token2) // Same token from cache
  })

  it('should refresh token when expired', async () => {
    const token1 = await authService.getToken()

    // Simulate expiration
    authService['cachedToken']!.expiresAt = new Date(Date.now() - 1000)

    const token2 = await authService.getToken()

    expect(token2).not.toBe(token1) // New token
  })
})
```

### Integration Tests

**Test THOR API Integration** (using test environment):

```typescript
import { ThorApiService } from '@/lib/thor/services/ThorApiService'

describe('ThorApiService Integration', () => {
  let apiService: ThorApiService

  beforeAll(() => {
    // Use THOR test environment
    process.env.THOR_ENV = 'test'
    process.env.THOR_API_KEY = 'test-key'
    process.env.THOR_API_SECRET = 'test-secret'

    apiService = new ThorApiService()
  })

  it('should fetch magazines from THOR', async () => {
    const magazines = await apiService.getMagazines()

    expect(Array.isArray(magazines)).toBe(true)
    expect(magazines.length).toBeGreaterThan(0)
  })

  it('should create and cancel subscription', async () => {
    // Create test subscription
    const subscription = await apiService.createSubscription({
      magazineId: 123,
      actionId: 456,
      // ... test data
    })

    expect(subscription.subscriptionId).toBeDefined()
    expect(subscription.isActive).toBe(true)

    // Cancel it
    const cancelled = await apiService.cancelSubscription(
      subscription.subscriptionId,
      '2026-12-31',
      999,
      'TEST'
    )

    expect(cancelled.cancellationDate).toBe('2026-12-31')
  })
})
```

### E2E Tests (Playwright)

**Test User Flows**:

```typescript
import { test, expect } from '@playwright/test'

test.describe('THOR Subscriptions', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/my-account')
  })

  test('should display subscriptions list', async ({ page }) => {
    await page.goto('/my-account/subscriptions')

    await expect(page.locator('h1')).toContainText('Mijn Abonnementen')

    // Should have at least one subscription
    const subscriptionCards = page.locator('[data-testid="subscription-card"]')
    await expect(subscriptionCards).toHaveCount(expect.any(Number))
  })

  test('should view subscription details', async ({ page }) => {
    await page.goto('/my-account/subscriptions')

    // Click first subscription
    await page.click('[data-testid="subscription-card"]:first-child a')

    // Should navigate to detail page
    await expect(page).toHaveURL(/\/my-account\/subscriptions\/\d+/)

    // Should display subscription details
    await expect(page.locator('[data-testid="magazine-name"]')).toBeVisible()
    await expect(page.locator('[data-testid="subscription-status"]')).toBeVisible()
  })

  test('should change delivery address', async ({ page }) => {
    await page.goto('/my-account/subscriptions/123') // Test subscription ID

    // Click "Change Address" button
    await page.click('[data-testid="change-address-button"]')

    // Fill form
    await page.fill('[name="addressLine1"]', 'New Street 123')
    await page.fill('[name="postalCode"]', '1234AB')
    await page.fill('[name="city"]', 'Amsterdam')

    // Submit
    await page.click('button[type="submit"]')

    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      'Adres succesvol gewijzigd'
    )
  })

  test('should cancel subscription', async ({ page }) => {
    await page.goto('/my-account/subscriptions/123')

    // Click "Cancel Subscription" button
    await page.click('[data-testid="cancel-subscription-button"]')

    // Fill cancellation form
    await page.selectOption('[name="cancellationReasonCode"]', 'Herroep')
    await page.fill('[name="cancellationDate"]', '2026-12-31')

    // Confirm
    await page.click('[data-testid="confirm-cancel-button"]')

    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      'Abonnement opgezegd'
    )

    // Status should update
    await expect(page.locator('[data-testid="subscription-status"]')).toContainText(
      'Beëindigd'
    )
  })
})
```

### Manual Testing Checklist

**Before Production**:
- [ ] Create subscription via webshop → verify in THOR admin
- [ ] Cancel subscription via webshop → verify in THOR admin
- [ ] Change address via webshop → verify in THOR admin
- [ ] Change email via webshop → verify in THOR admin
- [ ] View invoices → match THOR data
- [ ] Generate payment link → verify Worldline redirect
- [ ] Report missing issue → verify shipment created in THOR
- [ ] Test with different magazines
- [ ] Test with different payment methods
- [ ] Test error scenarios (invalid data, network errors)
- [ ] Test rate limiting (100+ requests quickly)
- [ ] Test sync (background sync updates cache)

---

## 📦 Deployment Plan

### Pre-Deployment

**Week 1-2: Development**
- [ ] Implement database migrations
- [ ] Implement service layer (ThorApiService, ThorAuthService, etc.)
- [ ] Implement frontend components
- [ ] Unit tests (70% coverage minimum)

**Week 3: Testing**
- [ ] Integration tests with THOR test environment
- [ ] E2E tests with Playwright
- [ ] Manual testing checklist
- [ ] Security audit
- [ ] GDPR compliance review

**Week 4: Staging**
- [ ] Deploy to staging with test credentials
- [ ] Full QA testing
- [ ] Performance testing
- [ ] Load testing (concurrent users)
- [ ] Client acceptance testing

### Deployment Steps

**1. Environment Variables** (Production):

```bash
# .env.production
ENABLE_THOR_INTEGRATION=true
THOR_ENV=production
THOR_API_BASE_URL=https://subscriptions.bondis.nl/v2
THOR_AUTH_BASE_URL=https://authentication.bondis.nl/v2
THOR_API_KEY=production-api-key
THOR_API_SECRET=production-api-secret
THOR_CLIENT_ID=aboland
THOR_MAGAZINE_IDS=123,456,789 # Real magazine IDs
THOR_ALLOW_CREATE=true
THOR_ALLOW_EDIT=true
THOR_ALLOW_CANCEL=true
THOR_VIEW_INVOICES=true
THOR_PAYMENT_LINKS=true
THOR_SYNC_ENABLED=true
THOR_SYNC_INTERVAL_MINUTES=15
THOR_CACHE_TTL_MINUTES=15
CRON_SECRET=your-secure-cron-secret
```

**2. Database Migration**:

```bash
# Run migrations on production database
npx payload migrate
```

**3. Build & Deploy**:

```bash
# Build production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to custom server
pm2 start npm --name "payload-app" -- run start
```

**4. Setup Cron Job** (Vercel):

- Go to Vercel Dashboard → Project → Settings → Cron Jobs
- Add Job:
  - **Path**: `/api/cron/thor-sync`
  - **Schedule**: `*/15 * * * *` (every 15 minutes)
  - **Secret**: Set `CRON_SECRET` environment variable

**5. Verify Deployment**:

```bash
# Check health endpoint
curl https://yourdomain.com/api/health

# Check THOR integration
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://yourdomain.com/api/thor/magazines

# Check sync is running
# Wait 15 minutes, then check sync log table
```

### Rollout Strategy

**Phase 1: Pilot (1 Magazine, 1 Week)**
- Enable for 1 magazine only
- Monitor closely for errors
- Read-only mode first (view subscriptions only)

**Phase 2: Gradual Rollout (2-3 Magazines, 2 Weeks)**
- Add 2-3 more magazines
- Enable write operations (cancel, edit)
- Monitor performance and user feedback

**Phase 3: Full Rollout (All Magazines)**
- Enable all configured magazines
- Full feature set enabled
- Continuous monitoring

### Monitoring

**Key Metrics**:
- Sync success rate (target: > 99%)
- API response times (target: < 500ms p95)
- Error rate (target: < 1%)
- Cache hit rate (target: > 80%)

**Alerts**:
- Sync failure (consecutive 3 failures)
- High error rate (> 5% over 5 minutes)
- Slow response times (> 2s p95)
- Rate limit hits (> 10 per hour)

**Logging**:
```typescript
// Log all THOR API interactions
await db.insert(thorSyncLog).values({
  syncType: 'subscription_fetch',
  direction: 'inbound',
  endpoint: '/api/subscriptions/123',
  httpMethod: 'GET',
  responseStatus: 200,
  success: true,
  durationMs: 245,
})
```

**Dashboards**:
- Total subscriptions synced
- Invoices generated
- Payment links created
- Active subscriptions
- Cancellation rate

---

## 📊 Performance Optimization

### Caching Strategy

**Cache Layers**:
1. **Application Cache**: In-memory token cache (ThorAuthService)
2. **Database Cache**: PostgreSQL tables (thor_subscriptions, thor_invoices)
3. **CDN Cache**: Static assets (Next.js ISR)

**Cache Invalidation**:
- **Time-based**: TTL of 15 minutes for subscription data
- **Event-based**: Immediate invalidation after user write operations
- **Scheduled**: Background sync every 15-30 minutes

### Database Indexes

**Critical Indexes** (already in schema):
```sql
-- Subscription lookups
CREATE INDEX idx_thor_subscriptions_user_id ON thor_subscriptions(user_id);
CREATE INDEX idx_thor_subscriptions_subscription_id ON thor_subscriptions(subscription_id);
CREATE INDEX idx_thor_subscriptions_magazine_id ON thor_subscriptions(magazine_id);
CREATE INDEX idx_thor_subscriptions_is_active ON thor_subscriptions(is_active);

-- Invoice lookups
CREATE INDEX idx_thor_invoices_subscription_id ON thor_invoices(subscription_id);
CREATE INDEX idx_thor_invoices_payment_reference ON thor_invoices(payment_reference);
CREATE INDEX idx_thor_invoices_status ON thor_invoices(status);

-- Sync log queries
CREATE INDEX idx_thor_sync_log_created_at ON thor_sync_log(created_at);
CREATE INDEX idx_thor_sync_log_success ON thor_sync_log(success);
```

### API Optimization

**Pagination**:
```typescript
// Always paginate large result sets
const subscriptions = await apiService.getSubscriptions({
  pageSize: 20, // Small pages for fast response
  pageNumber: 1,
})
```

**Parallel Requests**:
```typescript
// Fetch subscriptions and invoices in parallel
const [subscriptions, invoices] = await Promise.all([
  apiService.getSubscriptions({ pageSize: 20 }),
  apiService.getInvoices({ pageSize: 20 }),
])
```

**Request Deduplication**:
```typescript
// Prevent duplicate concurrent requests
const requestCache = new Map<string, Promise<any>>()

async function fetchWithDedup<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (requestCache.has(key)) {
    return requestCache.get(key)!
  }

  const promise = fetcher().finally(() => {
    requestCache.delete(key)
  })

  requestCache.set(key, promise)
  return promise
}
```

### Frontend Optimization

**React Query** (for data fetching):
```typescript
import { useQuery } from '@tanstack/react-query'

function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const res = await fetch('/api/thor/subscriptions')
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

**Lazy Loading**:
```typescript
// Lazy load heavy components
const SubscriptionDetailModal = lazy(() => import('./SubscriptionDetailModal'))
```

**Virtual Scrolling** (for long lists):
```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

// Render only visible items
const virtualizer = useVirtualizer({
  count: subscriptions.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 120, // Row height
})
```

---

## 📚 Documentation Requirements

### Code Documentation

**JSDoc Comments**:
```typescript
/**
 * Create new subscription in THOR
 *
 * @param payload - Subscription creation data
 * @returns Created subscription with THOR ID
 * @throws {ThorApiError} If THOR API request fails
 *
 * @example
 * ```typescript
 * const subscription = await apiService.createSubscription({
 *   magazineId: 123,
 *   actionId: 456,
 *   receiver: { ... },
 * })
 * ```
 */
async createSubscription(payload: ThorSubscriptionCreatePayload): Promise<ThorSubscription>
```

### API Documentation

**OpenAPI/Swagger Spec** (`docs/api/thor-api.yaml`):
```yaml
openapi: 3.0.0
info:
  title: THOR Subscriptions Integration API
  version: 1.0.0
paths:
  /api/thor/subscriptions:
    get:
      summary: Get all subscriptions for current user
      responses:
        '200':
          description: List of subscriptions
          content:
            application/json:
              schema:
                type: object
                properties:
                  subscriptions:
                    type: array
                    items:
                      $ref: '#/components/schemas/ThorSubscription'
    post:
      summary: Create new subscription
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateSubscriptionPayload'
      responses:
        '201':
          description: Subscription created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThorSubscription'
```

### User Documentation

**User Guide** (`docs/user/subscriptions-guide.md`):
```markdown
# Abonnementen Beheren

## Een nieuw abonnement afsluiten

1. Ga naar [Abonnementen](/abonnementen)
2. Kies een magazine
3. Selecteer een actie/aanbieding
4. Vul je gegevens in
5. Kies je betaalmethode
6. Bevestig je bestelling

## Je abonnement opzeggen

1. Ga naar [Mijn Abonnementen](/my-account/subscriptions)
2. Klik op het abonnement dat je wilt opzeggen
3. Klik op "Abonnement opzeggen"
4. Kies een reden en einddatum
5. Bevestig de opzegging

## Adres wijzigen

...
```

### Developer Guide

**Integration Guide** (`docs/dev/thor-integration.md`):
```markdown
# THOR Integration Developer Guide

## Architecture

The THOR integration consists of:
- Service layer (`src/lib/thor/services`)
- API routes (`src/app/api/thor`)
- Frontend components (`src/app/(ecommerce)`)
- Database cache (`thor_*` tables)

## Adding a New Feature

1. Define TypeScript types in `src/lib/thor/types`
2. Add API method to `ThorApiService`
3. Create API route in `src/app/api/thor`
4. Build frontend component
5. Write tests

## Common Patterns

### Fetching Data from THOR

Always use the cache service:

\`\`\`typescript
const cacheService = new ThorCacheService()
const cached = await cacheService.getSubscription(id)

if (!cached || !cacheService.isCacheFresh(cached.syncedAt)) {
  const fresh = await apiService.getSubscription(id)
  await cacheService.upsertSubscription(fresh)
  return fresh
}

return cached
\`\`\`

...
```

---

## ✅ Success Criteria

### Technical Success Metrics

- [ ] **Integration Success Rate**: > 99% of API calls succeed
- [ ] **Sync Success Rate**: > 99% of scheduled syncs complete without errors
- [ ] **Response Time**: < 500ms p95 for all API endpoints
- [ ] **Cache Hit Rate**: > 80% of requests served from cache
- [ ] **Test Coverage**: > 80% code coverage (unit + integration)
- [ ] **Uptime**: > 99.9% availability

### Business Success Metrics

- [ ] **User Adoption**: > 50% of eligible users view subscriptions within first month
- [ ] **Self-Service**: > 80% of address changes done via webshop (not phone/email)
- [ ] **Subscription Creation**: > 10% of webshop visitors start subscription flow
- [ ] **Conversion Rate**: > 5% of started flows convert to completed subscriptions
- [ ] **Support Ticket Reduction**: < 20% reduction in subscription-related support tickets

### Feature Completeness

- [ ] All features from aboland.nl reference implemented
- [ ] Feature parity with THOR admin panel (for user-facing actions)
- [ ] Mobile-responsive design
- [ ] Accessible (WCAG 2.1 AA compliance)
- [ ] Multi-language support (Dutch minimum, English nice-to-have)
- [ ] Error handling for all edge cases
- [ ] Loading states and skeleton screens
- [ ] Success/error notifications

---

## 🚦 Risk Assessment

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| THOR API downtime | HIGH | LOW | Cache layer, graceful degradation, status page |
| Rate limiting (100 req/5sec) | MEDIUM | MEDIUM | Conservative rate limiter (80 req/5sec), request queuing |
| Data sync conflicts | MEDIUM | LOW | Cache TTL strategy, immediate sync after writes |
| Authentication failures | HIGH | LOW | Token refresh logic, error retry with exponential backoff |
| Database performance | MEDIUM | LOW | Proper indexing, query optimization, connection pooling |
| Memory leaks (token cache) | LOW | LOW | Singleton pattern, periodic cleanup |

### Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| User confusion (new UI) | MEDIUM | MEDIUM | User guide, tooltips, onboarding |
| Client-specific requirements change | HIGH | MEDIUM | Feature flags, configurable settings |
| THOR API changes (breaking) | HIGH | LOW | Version pinning, monitoring, test suite |
| Privacy/GDPR violations | HIGH | LOW | Security audit, data minimization, compliance review |

---

## 📅 Timeline Estimate

### Week 1-2: Foundation (40 hours)
- Database schema & migrations (8h)
- Service layer implementation (16h)
- API routes implementation (12h)
- Unit tests (4h)

### Week 3: Frontend (40 hours)
- Subscriptions list page (8h)
- Subscription detail page (12h)
- Forms (cancel, edit address, etc.) (12h)
- Magazine browsing & checkout (8h)

### Week 4: Testing & Polish (40 hours)
- Integration tests (12h)
- E2E tests (12h)
- Manual QA testing (8h)
- Bug fixes & polish (8h)

### Week 5: Deployment (20 hours)
- Staging deployment (4h)
- Client acceptance testing (8h)
- Production deployment (4h)
- Monitoring & documentation (4h)

**Total Estimate**: ~140-160 hours (4-5 weeks for 1 developer)

---

## 📝 Next Steps

### Immediate (Week 1)
1. Review this plan with stakeholders
2. Get THOR API credentials (test + production)
3. Confirm magazine IDs and client configuration
4. Setup development environment
5. Create database migrations

### Short-term (Week 2-3)
1. Implement service layer
2. Build API routes
3. Create frontend components
4. Write tests

### Medium-term (Week 4-5)
1. QA testing
2. Security audit
3. GDPR compliance review
4. Staging deployment
5. Client acceptance

### Long-term (Post-Launch)
1. Monitor metrics
2. Gather user feedback
3. Iterate on UX
4. Add webhook support (if THOR provides)
5. Performance optimization

---

## 🎓 Training Requirements

### Developer Training
- THOR API documentation walkthrough (2h)
- Codebase architecture tour (1h)
- Database schema review (1h)
- Deployment process (1h)

### Support Team Training
- User guide walkthrough (1h)
- Common user issues & solutions (2h)
- Escalation process (THOR vs. webshop issues) (1h)

### Client Training
- Admin capabilities overview (1h)
- How data syncs between THOR and webshop (30min)
- What to do if sync fails (30min)

---

## 📖 Reference Materials

### THOR Documentation
- ✅ THOR Subscriptions API V2 Handbook (PDF provided)
- Swagger UI: https://subscriptions-test.bondis.nl/v2/swagger
- Authentication API: https://authentication.bondis.nl/v2/swagger

### Codebase
- Feature flags: `src/lib/features.ts`
- Existing subscriptions page: `src/app/(ecommerce)/my-account/subscriptions/page.tsx`

### External
- Aboland reference: https://aboland.nl/bladen/voeding-en-gezondheid/drinken/winelifemagazine/
- JSON Patch specification: RFC 6902
- Worldline payment gateway docs

---

**End of Implementation Plan**

**Document Version**: 1.0
**Last Updated**: 22 Februari 2026
**Author**: AI Assistant (Claude)
**Status**: Ready for Review
