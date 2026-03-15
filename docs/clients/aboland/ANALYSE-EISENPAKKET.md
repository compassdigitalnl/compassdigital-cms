# Diepte-analyse: Eisenpakket Aboland vs. Huidige Codebase

**Datum:** 2026-03-13
**Geanalyseerd door:** Claude Code + Compass Digital

---

## Leeswijzer

| Symbool | Betekenis |
|---------|-----------|
| ✅ AANWEZIG | Volledig beschikbaar in de huidige codebase |
| 🔶 GEDEELTELIJK | Fundament aanwezig, uitbreiding nodig |
| 🚧 IN ONTWERP | Design/plan klaar, development moet nog starten |
| ❌ NIEUW WERK | Moet volledig ontwikkeld worden |

**Structuur:** Dit document is opgedeeld in drie delen:
1. **Deel A** — Platform features (publishing branche must-haves, herbruikbaar voor alle uitgevers)
2. **Deel B** — Klant-specifiek (alleen Aboland, offerte-onderdelen)
3. **Deel C** — Offerte-overzicht

---

# DEEL A: Platform — Publishing Branche Must-Haves

> Features die **elke uitgever/publishing klant** nodig heeft. Dit zijn platforminvesteringen die herbruikbaar zijn voor alle toekomstige publishing-klanten.

---

## A1. Paywall & Content Gating

### Status: ✅ AANWEZIG

**Volledig aanwezig:**
- `BlogPosts` collection met `contentAccess` group (`accessLevel: free|premium`)
- `previewLength` veld (aantal woorden zichtbaar voor paywall)
- `lockMessage` veld (custom paywall tekst per artikel)
- `checkContentAccess()` utility — server-side access check op subscription status
- `useContentAccess()` hook — client-side access check
- `PaywallOverlay` component — gradient overlay met lock icon, upgrade CTA, benefits
- `PremiumBadge` component
- `BlogPostWithPaywall` wrapper component
- Access denial reasons: `not_logged_in`, `no_subscription`, `subscription_inactive`, `plan_no_premium_access`

**Artikelstructuur (ingekort vs. volledig):** Al opgelost — `excerpt` + `previewLength` + automatische paywall truncatie dekt dit volledig. Redacteuren hoeven geen twee versies te onderhouden.

### Nog uit te breiden (platform):
- **Metered paywall** (X gratis artikelen/maand per gebruiker) → ~4-6 uur

---

## A2. Artikelen Lezen

### Status: ✅ AANWEZIG

- 3 blog templates (Enterprise met sidebar+TOC, Minimal centered, Premium wide)
- Responsief design (telefoon, tablet, desktop)
- Leestijd berekening
- Share buttons (LinkedIn, Email, Link, Print)
- Author box, related articles/products
- Automatische Table of Contents
- FAQ schema voor SEO
- Meilisearch indexering (afterChange hook)

---

## A3. Magazine/Editie Systeem

### Status: 🚧 IN ONTWERP

**Aanwezig (componenten):**
- `Magazines` collection
- `MagazineDetailTemplate1` + `MagazineArchiveTemplate1`
- `MagazineIssueGrid`, `MagazineCard`, `MagazineHero`
- `FeaturedMagazines`, `MagazineSubscriptionCTA`
- `MagazineStory`, `MagazineTestimonial`, `MagazineUSPCards`

**Designs klaar** (`docs/design/publishing/`):
- Digitale bibliotheek preview
- Kennisbank/paywall designs

### Nog te ontwikkelen (platform):
- Digitale reader voor volledige edities (PDF/flipbook viewer) → ~16-24 uur
- Per-uitgever filtering van edities → ~4-6 uur

---

## A4. Zoekfunctie (per uitgever)

### Status: ✅ AANWEZIG

- Meilisearch integratie (`src/features/search/lib/meilisearch/`)
- Full-text search met highlighting
- Hybrid search met embeddings (vector search)
- "Did You Mean" suggesties
- Search analytics logging
- InstantSearch React component
- Filter op tags, categorieën, content type

---

## A5. Content Archief

### Status: ✅ AANWEZIG

- BlogPosts collection met categorieën, tags, full-text zoek
- Meilisearch indexering (afterChange hook op BlogPosts)
- Magazine archive template
- Knowledge base component met filters
- Doorzoekbaar op tags, auteur, categorie

---

## A6. Abonnementen & Subscription Management

### Status: ✅ AANWEZIG

- `SubscriptionPlans` collection (tiers, billing intervals, features, trial days)
- `UserSubscriptions` collection (status: active/trialing/paused/cancelled/expired, auto-renewal)
- `SubscriptionPricingTemplate1` + `SubscriptionCheckoutTemplate1`
- Stripe payment processing
- Plan-level feature flags (`allowsPremiumContent`)

---

## A7. E-mail Marketing & Automations

### Status: ✅ AANWEZIG (basis) / 🔶 Subscription-triggers uitbreiden

**Volledig aanwezig:**
- `EmailCampaigns`, `FlowInstances`, `EmailLists`, `EmailTemplates`, `EmailEvents`
- GrapesJS visuele email editor met e-commerce blocks
- Automation engine met conditional logic, triggers, flow builder
- Listmonk integratie (sync, execution, webhooks)
- Predefined flows: Review Request, Abandoned Cart, Welcome, Post-Purchase, Win-Back, Re-engagement
- Rate limiting, retry logic, warmup manager

### Nog uit te breiden (platform):
- Subscription-specifieke triggers (aflopend, afgelopen, upsell) → ~6-8 uur
- Content-notificatie bij nieuwe publicatie → ~4-6 uur
- Ingekorte artikelen als email trigger → ~2-3 uur

---

## A8. Accounts & Gebruikersbeheer

### Status: ✅ AANWEZIG

**Volledig aanwezig:**
- Unified `Users` collection (tabs: Algemeen, Klantgegevens, Bedrijf, Adressen, Voorkeuren, Statistieken, Beveiliging)
- Account types: individual, B2C, B2B
- JWT authenticatie + Google OAuth + email verificatie
- `Wishlists` collection (favorieten/opslaan)
- Favorites API endpoint

### Nog uit te breiden (platform):
- Per-user leesgeschiedenis → ~6-8 uur
- Notificatie-voorkeuren UI → ~4-6 uur

---

## A9. Content Import

### Status: 🔶 GEDEELTELIJK

**Aanwezig:**
- Seed systeem met templates
- AI-powered content generatie (`src/features/ai/`)
- Payload REST API (artikelen aanmaken via API)

### Nog te ontwikkelen (platform):
- Import endpoint voor extern formaat (XML/CSV/JSON) → ~8-12 uur
- Geautomatiseerde import pipeline (cron-based) → ~4-6 uur

---

## A10. Voorleesfunctie (Text-to-Speech)

### Status: ❌ NIEUW WERK

- Opties: Web Speech API (gratis, beperkt) of externe TTS service (ElevenLabs, Google Cloud TTS)
- ~8-12 uur voor basisimplementatie

---

## A11. Social Media Publishing

### Status: 🚧 IN ONTWERP

**Aanwezig:**
- Share buttons op artikelen (LinkedIn, Email, Link, Print)

**Designs klaar** (`docs/design/publishing/`)

### Nog te ontwikkelen (platform):
- Automatische social media posting → ~16-24 uur
- Post scheduling → ~4-6 uur
- Social media API koppelingen → ~12-16 uur per platform

---

## A12. Advertenties

### Status: 🔶 GEDEELTELIJK

**Aanwezig:**
- Banner block in Layout Builder
- Per-tenant configuratie via feature flags

**Aanbeveling: NIET custom bouwen.** Gebruik Google Ad Manager (gratis) of AdManager360.
- Ad rotatie, scheduling, targeting, analytics, programmatic → doet Ad Manager al
- Uitgevers kennen dit al (industrie-standaard)
- Wij bouwen alleen de **ad slot componenten** in het platform

### Nog te ontwikkelen (platform):
- Ad zone/slot component voor Layout Builder (laadt externe ad tags) → ~2-4 uur
- Per-tenant ad configuratie (eigen Ad Manager account ID) → ~2-3 uur

---

## A13. AI Chatbot

### Status: 🔶 GEDEELTELIJK

**Aanwezig:**
- AI feature module (`src/features/ai/`)
- RAG chatbot service + OpenAI embeddings
- Content generator

### Nog te ontwikkelen (platform):
- Front-end chatbot widget → ~8-12 uur
- Content-aanbevelingen engine → ~8-12 uur

---

## A14. Multi-tenant Architectuur

### Status: ✅ AANWEZIG

- Aparte database per tenant
- Tenant context utilities (`getTenantContext.ts`)
- Feature flags per client (`features.ts`)
- Collection visibility control
- Provisioning systeem
- 10 actieve tenants draaien nu al

---

## Samenvatting Platform Must-Haves

| # | Feature | Status | Resterend werk |
|---|---------|--------|----------------|
| A1 | Paywall & content gating | ✅ | Metered paywall: ~4-6 uur |
| A2 | Artikelen lezen | ✅ | — |
| A3 | Magazine/editie systeem | 🚧 | ~20-30 uur |
| A4 | Zoekfunctie | ✅ | — |
| A5 | Content archief | ✅ | — |
| A6 | Subscriptions | ✅ | — |
| A7 | Email automations | ✅ | Subscription triggers: ~12-17 uur |
| A8 | Accounts | ✅ | Leeshistorie + notificaties: ~10-14 uur |
| A9 | Content import | 🔶 | ~12-18 uur |
| A10 | Voorleesfunctie | ❌ | ~8-12 uur |
| A11 | Social media publishing | 🚧 | ~32-46 uur |
| A12 | Advertenties (ad slots + externe ad manager) | 🔶 | ~4-7 uur |
| A13 | AI Chatbot | 🔶 | ~16-24 uur |
| A14 | Multi-tenant | ✅ | — |
| | **Totaal platform-werk** | | **~119-174 uur** |

> Dit is platformontwikkeling die **alle** publishing-klanten ten goede komt — niet alleen Aboland.

---

# DEEL B: Klant-specifiek — Alleen Aboland

> Features die uniek zijn voor het Aboland-businessmodel. Dit is **maatwerk** waarvoor een offerte nodig is.

---

## B1. THOR API Integratie

### Status: 🚧 IN ONTWERP — Offerte-onderdeel

Er is een **volledig uitgewerkt implementatieplan** (`docs/design/sprint-8/IMPLEMENTATION_PLAN.md`) inclusief technische architectuur, pricing, en tijdlijn.

**Wat al IS in de codebase (patronen):**
- API-integratiepatroon (Stripe, MultiSafepay, Listmonk, KVK, Postcode) → THOR volgt hetzelfde patroon
- Webhook handling met signature verification (Listmonk patroon herbruikbaar)
- Server-side payment processing

**Wat specifiek voor THOR ontwikkeld moet worden:**

| Onderdeel | Ontwikkeltijd | Klanturen |
|-----------|---------------|-----------|
| THOR API Service class + client | ~16 uur | 3-4 uur review/test |
| Bidirectionele sync (create/read/update) | ~24 uur | 4-6 uur test |
| Checkout flow + payment links | ~16 uur | 3-4 uur test |
| Product-to-subscription mapping | ~12 uur | 2-3 uur config |
| Upgrade/downgrade flow → THOR | ~16 uur | 3-4 uur test |
| "Mijn abonnementen" account pagina | ~12 uur | 2-3 uur test |
| Webhook endpoint + sync | ~8 uur | 2 uur test |
| THOR-based paywall check | ~4 uur | 1 uur test |
| Tier mapping (Gratis/Premium/Fysiek/Compleet) | ~4 uur | 1 uur config |
| Accounts registreren in THOR | ~6 uur | 1-2 uur test |
| THOR-data segmentatie voor email | ~8 uur | 2 uur test |
| Database migraties | ~4 uur | 1 uur deploy |
| Testing + edge cases | ~16 uur | 4-6 uur QA |
| **Totaal** | **~146 uur** | **~29-40 uur** |

---

## B2. Aboland.nl Centraal Portaal (Netflix-model)

### Status: 🔶 GEDEELTELIJK

Dit is het unieke Aboland-businessmodel: één centraal platform over alle uitgevers heen.

**Wat al IS (multi-tenant basis):**
- Aparte database per tenant/uitgever
- Meilisearch per tenant
- Tenant context utilities
- Provisioning systeem

**Wat specifiek voor Aboland ontwikkeld moet worden:**

| Onderdeel | Ontwikkeltijd | Klanturen |
|-----------|---------------|-----------|
| Cross-tenant search federation | ~12-16 uur | 3-4 uur test |
| Cross-tenant content aggregatie | ~20-30 uur | 4-6 uur test |
| Centraal serviceportaal | ~16-20 uur | 3-4 uur test |
| Per-titel bediening vanuit Aboland.nl | ~8-12 uur | 2-3 uur config |
| **Totaal** | **~56-78 uur** | **~12-17 uur** |

---

## B3. Verrekensleutel & Uitgever-rapportage

### Status: ❌ NIEUW WERK

Het 50/50 verrekenmodel is uniek voor het Aboland Netflix-model.

**Wat al IS (fundament):**
- `viewCount` op BlogPosts
- Tracking API (`/api/track/`)
- Customer insights (RFM analyse, CLV berekening)

**Wat specifiek voor Aboland ontwikkeld moet worden:**

| Onderdeel | Ontwikkeltijd | Klanturen |
|-----------|---------------|-----------|
| Per-user, per-artikel, per-uitgever leesregistratie | ~12-16 uur | 3-4 uur test |
| Financieel rapportage-engine (50/50 verdeling) | ~8-12 uur | 3-4 uur validatie |
| Dashboard voor uitgevers (leesstatistieken) | ~12-16 uur | 3-4 uur test |
| **Totaal** | **~32-44 uur** | **~9-12 uur** |

---

## Samenvatting Klant-specifiek

| # | Feature | Ontwikkeltijd | Klanturen | Prijs |
|---|---------|---------------|-----------|-------|
| B1 | THOR API integratie | ~146 uur | ~29-40 uur | €3.500 - €5.000 |
| B2 | Centraal portaal (Netflix) | ~56-78 uur | ~12-17 uur | €1.500 - €2.500 |
| B3 | Verrekensleutel & rapportage | ~32-44 uur | ~9-12 uur | €1.000 - €1.500 |
| | **Totaal klant-specifiek** | **~234-268 uur** | **~50-69 uur** | **€6.000 - €9.000** |

---

# DEEL C: Offerte-overzicht

## Wat Aboland al gratis "meelift" op het platform

Deze features hoeft Aboland **NIET** apart te betalen — ze zijn al onderdeel van het CMS:

1. **Multi-tenant architectuur** — klaar
2. **Paywall systeem** (free/premium + preview) — klaar
3. **Meilisearch full-text zoeken** — klaar
4. **Email marketing + automations** (basis) — klaar
5. **Blog/artikel reading omgeving** (3 templates) — klaar
6. **Magazine componenten** (hero, cards, grid, archive) — klaar
7. **Subscription plans + user subscriptions** — klaar
8. **Unified accounts met tabs** — klaar
9. **Favorieten/wishlists** — klaar
10. **AI chatbot fundament** (RAG service) — klaar
11. **Analytics fundament** (RFM, CLV, tracking API) — klaar
12. **Advertentie banners** (basis) — klaar

## Wat platform-ontwikkeling is (NIET doorberekend aan Aboland)

Features die we sowieso bouwen voor de publishing branche:
- Metered paywall, magazine reader, social publishing, ad systeem, TTS, chatbot widget, content import, subscription email triggers, leesgeschiedenis

**Totaal: ~137-199 uur** — platforminvestering

## Offerte klant-specifiek werk

| Offerte-lijn | Prijs |
|--------------|-------|
| **B1: THOR API integratie** | €3.500 - €5.000 |
| **B2: Centraal portaal (Netflix-model)** | €1.500 - €2.500 |
| **B3: Verrekensleutel & rapportage** | €1.000 - €1.500 |
| **Totaal** | **€6.000 - €9.000** |
| Combi-korting (~10%) | **€5.500 - €8.000** |

**Normale marktprijs (zonder AI):** €25.000 - €45.000
**Met AI-assisted development:** €5.500 - €8.000 (78-82% besparing)

### Fasering (aanbevolen)

| Fase | Wat | Wanneer | Prijs |
|------|-----|---------|-------|
| **Fase 1** | THOR API integratie | Week 1-5 | €3.500 - €5.000 |
| **Fase 2** | Centraal portaal + verrekensleutel | Week 6-10 | €2.500 - €3.500 |

> Fase 1 levert direct waarde: abonnementen online, self-service, minder support.
> Fase 2 kan starten zodra er meerdere uitgevers op het platform zitten.
