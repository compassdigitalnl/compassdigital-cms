# CompassDigital - Branch-Based Pricing Plan

**Status:** Planning Phase
**Version:** 4.0 - Senior Herberekening
**Last Updated:** Maart 2026

---

## Filosofie

**Wij zijn GEEN Shopify.** Wij bieden een standaard multi-tenant Payload CMS platform MET maatwerk.

**Wat wij bieden dat Shopify/WordPress NIET biedt:**
- Volledig op maat ingericht platform (niet zelf klooien met plugins)
- Eigen email marketing suite (GrapesJS editor, automation, flows, deliverability)
- AI chatbot met RAG (kennisbank-gebaseerd, geen simpele FAQ bot)
- AI content generatie (SEO, vertalingen, afbeeldingen)
- Multi-tenant architectuur (schaalbaar, gedeeld platform)
- 70+ feature flags — per klant configureerbaar
- Managed service — wij doen alles

**Revenue model:**
1. **Maandelijkse licentie** — all-inclusive per branch, recurring
2. **Add-ons** — usage-based voor diensten met externe kosten (AI, email)
3. **Setup & inrichting** — eenmalig, hier zit de primaire marge
4. **Maatwerk uren** — ongoing development @ €100/uur

---

## Kostenanalyse (inkoop per tenant)

| Kostenpost | Per tenant/mo | Toelichting |
|------------|---------------|-------------|
| Railway PostgreSQL (shared) | ~€3-5 | Multi-tenant, gedeeld |
| Server/VPS (PM2, shared) | ~€5-10 | Multi-tenant, meerdere sites |
| Storage, CDN, SSL | ~€2-5 | Cloudflare, media opslag |
| Listmonk (self-hosted) | ~€1-2 | Eigen email platform |
| Meilisearch (self-hosted) | ~€1-2 | Eigen search engine |
| Redis (queue/cache) | ~€1-2 | BullMQ workers |
| **Totaal platform inkoop** | **~€13-26** | |

**Externe variabele kosten (apart doorberekend):**
| Service | Kosten | Doorberekening |
|---------|--------|---------------|
| Groq AI (chatbot) | Gratis tot 14.400 req/dag | Gedeeld over alle tenants |
| OpenAI GPT-4 (fallback) | ~$0.03/1K tokens | Bij complexe queries |
| Resend (transactioneel) | Gratis tot 100/dag | Per tenant basis |
| SMTP (bulk email) | ~€0.001-0.003/email | Volume-afhankelijk |

---

## All-Inclusive Branch Pakketten

### Basis

| Pakket | Maandelijks | Alles inbegrepen | Ideaal voor |
|--------|------------|------------------|-------------|
| **Website** | **€49/mo** | Platform CMS, Pages, Media, Users, Blog, FAQ, Testimonials, Cases, Partners, Forms, SEO, Meilisearch zoekfunctie, Cookie consent, Thema's | Bedrijfswebsites, portfolios |
| **Website + Branche** | **€79/mo** | Alles van Website + 1 industry branch (zie hieronder) | MKB met branche-specifieke features |

### Industry Branches (onderdeel van €79/mo)

| Branch | All-inclusive features |
|--------|----------------------|
| **Construction** | Services, Projecten, Reviews, Offerte-aanvragen, Portfolio, Stats |
| **Hospitality** | Behandelingen, Practitioners, Afspraken, Online booking |
| **Beauty & Wellness** | Services, Stylisten, Boekingen, Beschikbaarheid |
| **Horeca** | Menu's, Reserveringen, Evenementen |
| **Professional Services** | Diensten, Team, Consultaties, Casestudies |

---

### E-commerce

| Pakket | Maandelijks | Alles inbegrepen | Ideaal voor |
|--------|------------|------------------|-------------|
| **E-commerce B2C** | **€119/mo** | Alles van Website + Producten, Categorieën, Merken, Winkelwagen, Checkout, Orders, Facturen (PDF), Retouren, Klantaccounts, Reviews, Abonnementen, Loyaliteitsprogramma (tiers, punten, rewards), Cadeaubonnen, Variabele producten, Mix & Match, Voorraad, Kortingscodes, A/B testing, Stripe + MultiSafepay, Transactionele emails | Webshops, online winkels |
| **E-commerce B2B** | **€179/mo** | Alles van B2C + Klantgroepen, Groepsprijzen, Bestelhistorie, Herhalingsbestellingen, Offerte-aanvragen, Bestelformulieren, Barcode scanner, Licenties & activaties, MOQ, Volumekorting | Groothandels, B2B platformen |

### Publishing

| Pakket | Maandelijks | Alles inbegrepen | Ideaal voor |
|--------|------------|------------------|-------------|
| **Publishing** | **€99/mo** | Alles van Website + Tijdschriften, Edities, Auteurs, Kennisbank, Premium Content (Paywall), Abonnementen & Checkout, Digitale Bibliotheek (Flipbook viewer, watermark, leesvoortgang), Losse verkoop edities | Uitgevers, vakbladen, media |

### Geavanceerd

| Pakket | Maandelijks | Alles inbegrepen | Ideaal voor |
|--------|------------|------------------|-------------|
| **Real Estate** | **€99/mo** | Alles van Website + Woningen, Makelaars, Bezichtigingen, Wijken, Zoekfilters | Makelaars, vastgoed |
| **Tourism & Hotels** | **€119/mo** | Alles van Website + Accommodaties, Kamers, Boekingen, Activiteiten, Reviews | Hotels, vakantieparken |
| **Marketplace** | **€149/mo** | Alles van Website + Vendors, Producten, Reviews, Commissiesysteem (Stripe Connect + MSP), Workshops | Marktplaatsen |

### Multi-Branch Korting

| Combinatie | Korting |
|-----------|--------|
| 2 branches | 10% op totaal |
| 3+ branches | 15% op totaal |

---

## Add-ons (usage-based, externe kosten)

### Email Marketing (eigen platform)

Volledig eigen email marketing suite met GrapesJS visual editor, automation engine, flows, deliverability monitoring, en subscriber management. Vergelijkbaar met Brevo/Mailchimp — maar ingebouwd.

| Tier | Subscribers | Emails/mo | Maandelijks | Overage |
|------|-----------|-----------|------------|---------|
| **Starter** | 1.000 | 5.000 | **€29/mo** | €1,00/1.000 emails |
| **Groei** | 5.000 | 30.000 | **€79/mo** | €0,80/1.000 emails |
| **Pro** | 10.000 | 100.000 | **€149/mo** | €0,60/1.000 emails |
| **Business** | 25.000 | 500.000 | **€299/mo** | €0,40/1.000 emails |
| **Enterprise** | Onbeperkt | Onbeperkt | **Op maat** | Op maat |

Inclusief bij elke tier:
- Visuele email editor (drag & drop)
- Transactionele emails (order bevestiging, verzending, etc.)
- Subscriber beheer + lijsten + tags
- Analytics (opens, clicks, bounces)

Hogere tiers unlocken extra:
- **Groei+**: Automation rules, A/B testing
- **Pro+**: Automation flows, API access, dedicated IP warmup
- **Business+**: Alles + deliverability monitoring + DNS validatie

---

### AI Chatbot (RAG-gebaseerd)

Kennisbank-gebaseerde chatbot met Groq/OpenAI hybrid routing. Zoekt automatisch in producten, blog posts, FAQ's en pagina's. Inclusief guided conversation flows.

| Tier | Chats/mo | Maandelijks | Toelichting |
|------|---------|------------|-------------|
| **Light** | 1.000 | **€39/mo** | ~33 chats/dag, voldoende voor kleine sites |
| **Standard** | 5.000 | **€79/mo** | ~167 chats/dag, gemiddelde webshop |
| **Pro** | 20.000 | **€149/mo** | ~667 chats/dag, drukke sites |
| **Enterprise** | Onbeperkt | **Op maat** | High-volume, dedicated model config |

**Kostenonderbouwing:**
- 95% van queries → Groq (gratis, 14.400 req/dag)
- 5% complexe queries → OpenAI GPT-4 (~€0,03/query)
- 5.000 chats/mo = 250 GPT-4 queries = ~€7,50 API kosten
- Marge bij €79/mo = ~€71,50 (90%)
- Bij 20.000 chats/mo = 1.000 GPT-4 queries = ~€30 API kosten
- Marge bij €149/mo = ~€119 (80%)

Inclusief bij elke tier:
- RAG integratie (zoekt in je kennisbank)
- Guided conversation flows
- Customizable UI (positie, kleuren, avatar)
- Rate limiting & content moderatie
- Source attribution (bronvermelding)

---

### AI Content Generatie

Content generator, SEO optimizer, vertaler. Gebruikt Groq + OpenAI.

| Tier | Generaties/mo | Maandelijks |
|------|--------------|------------|
| **Basis** | 200 | **€49/mo** |
| **Pro** | 1.000 | **€99/mo** |
| **Unlimited** | Onbeperkt | **€199/mo** |

Inclusief:
- Blog post generatie
- Productbeschrijvingen
- Meta tags & SEO analyse
- Readability scoring
- Content vertaling (meerdere talen)

> **Roadmap:** AI beeldgeneratie (DALL-E 3) wordt later als aparte feature toegevoegd. Zie `docs/roadmap/ai/DALL-E-IMAGE-GENERATION.md`.

---

### Overige Add-ons

| Add-on | Maandelijks | Toelichting |
|--------|------------|-------------|
| **Meertaligheid** | **€29/mo** | Content vertaling (AI), taalswitch, gelokaliseerde URLs |
| **SMS Notificaties** | **€19/mo** | 200 SMS/mo inclusief, daarna €0,08/SMS |

---

## Setup & Inrichting (eenmalig)

| Setup type | Eenmalig | Doorlooptijd |
|-----------|----------|-------------|
| **Website** | €1.500 - €2.500 | 1-2 weken |
| **Website + Branche** | €2.500 - €4.000 | 2-3 weken |
| **E-commerce B2C** | €3.500 - €5.500 | 2-3 weken |
| **E-commerce B2B** | €5.000 - €7.500 | 3-4 weken |
| **Publishing** | €3.500 - €5.500 | 2-4 weken |
| **Multi-Branch** | €6.000 - €10.000 | 3-5 weken |

### Migratie (optioneel)

| Van | Prijs |
|-----|-------|
| WordPress (klein) | €800 - €1.500 |
| WordPress (groot) | €2.000 - €4.000 |
| WooCommerce (klein) | €1.500 - €2.500 |
| WooCommerce (groot) | €3.000 - €6.000 |
| Shopify | €1.200 - €2.500 |
| Custom / CSV | €500 - €3.000 |

---

## Maatwerk Development

| Blok | Per uur | Korting |
|------|---------|--------|
| Standaard | €100/uur | — |
| 10 uur | €95/uur | 5% |
| 20 uur | €90/uur | 10% |
| 40 uur | €85/uur | 15% |

---

## Managed Service (optioneel)

| Service | Maandelijks |
|---------|------------|
| Content Beheer (4u/mo) | €149/mo |
| Priority Support (4u SLA) | €99/mo |
| Maandelijkse Optimalisatie | €199/mo |

---

## Klantvoorbeelden

### 1. Kleine Dienstverlener

```
SETUP:   Website + Branche:           €3.000
         WordPress migratie:           €1.000
         ─────────────────────────────────────
         TOTAAL EENMALIG:              €4.000

LICENTIE: Website + Branche:           €79/mo

JAAR 1:   €4.000 + €948             = €4.948
JAAR 2+:                               €948/jaar
```

---

### 2. Online Webshop (B2C)

```
SETUP:   E-commerce B2C:              €4.500
         WooCommerce migratie:         €2.000
         ─────────────────────────────────────
         TOTAAL EENMALIG:              €6.500

LICENTIE: E-commerce B2C:             €119/mo
          Email Marketing (Starter):    €29/mo
          ─────────────────────────────────────
          TOTAAL MAANDELIJKS:          €148/mo

JAAR 1:   €6.500 + €1.776           = €8.276
JAAR 2+:                             €1.776/jaar
```

---

### 3. B2B Groothandel (bijv. Plastimed)

```
SETUP:   E-commerce B2B:              €6.500
         Migratie + data import:       €3.500
         Maatwerk (20u @ €90):         €1.800
         ─────────────────────────────────────
         TOTAAL EENMALIG:             €11.800

LICENTIE: E-commerce B2B:             €179/mo
          Email Marketing (Groei):      €79/mo
          AI Chatbot (Standard):        €79/mo
          Meertaligheid:                €29/mo
          Priority Support:             €99/mo
          ─────────────────────────────────────
          TOTAAL MAANDELIJKS:          €465/mo

JAAR 1:  €11.800 + €5.580           = €17.380
JAAR 2+:                              €5.580/jaar
```

---

### 4. Vakbladuitgever (Publishing)

```
SETUP:   Publishing:                   €4.500
         ─────────────────────────────────────
         TOTAAL EENMALIG:              €4.500

LICENTIE: Publishing:                  €99/mo
          Email Marketing (Starter):    €29/mo
          ─────────────────────────────────────
          TOTAAL MAANDELIJKS:          €128/mo

JAAR 1:   €4.500 + €1.536           = €6.036
JAAR 2+:                             €1.536/jaar
```

---

### 5. Vakbladuitgever + Webshop + AI

```
SETUP:   Publishing + E-commerce:      €6.500
         Content + product import:      €2.000
         ─────────────────────────────────────
         TOTAAL EENMALIG:              €8.500

LICENTIE: Publishing:                  €99/mo
          E-commerce B2C:              €119/mo
          10% multi-branch korting:    -€22/mo
          Email Marketing (Groei):      €79/mo
          AI Chatbot (Standard):        €79/mo
          AI Content (Basis):           €49/mo
          ─────────────────────────────────────
          TOTAAL MAANDELIJKS:          €403/mo

JAAR 1:   €8.500 + €4.836           = €13.336
JAAR 2+:                              €4.836/jaar
```

---

### 6. Enterprise Marketplace

```
SETUP:   Marketplace:                  €8.000
         Maatwerk (40u @ €85):         €3.400
         ─────────────────────────────────────
         TOTAAL EENMALIG:             €11.400

LICENTIE: Marketplace:                €149/mo
          Email Marketing (Pro):       €149/mo
          AI Chatbot (Pro):            €149/mo
          AI Content (Pro):             €99/mo
          Meertaligheid:                €29/mo
          Priority Support:             €99/mo
          Maandelijkse Optimalisatie:  €199/mo
          ─────────────────────────────────────
          TOTAAL MAANDELIJKS:          €873/mo

JAAR 1:  €11.400 + €10.476          = €21.876
JAAR 2+:                             €10.476/jaar
```

---

## Concurrentiepositie

### vs Shopify (€21-299/mo + transactiekosten)
- Shopify = self-service, templates, plugins nodig
- Shopify + apps + transactiekosten = al snel €150-400/mo
- **Wij: €119/mo all-in + geen transactiekosten + volledig op maat**
- Onze email marketing vervangt Mailchimp/Brevo (€30-100/mo besparing)
- Onze chatbot vervangt Intercom/Zendesk (€50-200/mo besparing)

### vs Brevo/Mailchimp + Intercom + Shopify apart
| Dienst apart | Kosten/mo | Bij ons |
|-------------|-----------|---------|
| Shopify Advanced | €299 | — |
| Brevo (10K subs) | €65 | — |
| Intercom (chatbot) | €74 | — |
| Meilisearch Cloud | €29 | — |
| **Totaal apart** | **€467/mo** | — |
| **Bij ons (E-commerce + Email Groei + Chatbot)** | — | **€277/mo** |

**Besparing: €190/mo = €2.280/jaar**

### vs Webbureau
- Webbureau: €10.000-25.000 setup + €300-500/mo onderhoud
- Wij: €3.500-7.500 setup + €119-465/mo all-in
- **40-60% goedkoper in jaar 1**

---

## Pricing Overzicht (snelreferentie)

```
LICENTIES (maandelijks, all-inclusive per branch):
┌───────────────────────────┬──────────┐
│ Website (+ Blog, SEO, etc)│   €49/mo │
│ Website + Branche         │   €79/mo │
│ Publishing                │   €99/mo │
│ Real Estate               │   €99/mo │
│ E-commerce B2C            │  €119/mo │
│ Tourism & Hotels          │  €119/mo │
│ Marketplace               │  €149/mo │
│ E-commerce B2B            │  €179/mo │
└───────────────────────────┴──────────┘

EMAIL MARKETING (eigen platform, usage-based):
┌───────────────────────────┬──────────┐
│ Starter (1K subs, 5K/mo)  │   €29/mo │
│ Groei (5K subs, 30K/mo)   │   €79/mo │
│ Pro (10K subs, 100K/mo)   │  €149/mo │
│ Business (25K subs, 500K) │  €299/mo │
└───────────────────────────┴──────────┘

AI CHATBOT (RAG, usage-based):
┌───────────────────────────┬──────────┐
│ Light (1.000 chats/mo)    │   €39/mo │
│ Standard (5.000 chats/mo) │   €79/mo │
│ Pro (20.000 chats/mo)     │  €149/mo │
└───────────────────────────┴──────────┘

AI CONTENT GENERATIE:
┌───────────────────────────┬──────────┐
│ Basis (200 generaties/mo) │   €49/mo │
│ Pro (1.000 generaties/mo) │   €99/mo │
│ Unlimited                 │  €199/mo │
└───────────────────────────┴──────────┘

OVERIGE ADD-ONS:
┌───────────────────────────┬──────────┐
│ Meertaligheid             │   €29/mo │
│ SMS Notificaties          │   €19/mo │
└───────────────────────────┴──────────┘

SETUP (eenmalig):
┌───────────────────────────┬──────────────────┐
│ Website                   │ €1.500 - €2.500  │
│ Website + Branche         │ €2.500 - €4.000  │
│ E-commerce B2C            │ €3.500 - €5.500  │
│ Publishing                │ €3.500 - €5.500  │
│ E-commerce B2B            │ €5.000 - €7.500  │
│ Multi-Branch              │ €6.000 - €10.000 │
└───────────────────────────┴──────────────────┘

MAATWERK:
┌───────────────────────────┬──────────┐
│ Standaard                 │ €100/uur │
│ 10-uren blok              │  €95/uur │
│ 20-uren blok              │  €90/uur │
│ 40-uren blok              │  €85/uur │
└───────────────────────────┴──────────┘
```

---

## Feature Flags (technisch)

```typescript
// Platform Base (altijd aan)
ENABLE_PAGES=true
ENABLE_MEDIA=true
ENABLE_USERS=true
ENABLE_FORMS=true
ENABLE_BLOG=true
ENABLE_FAQ=true
ENABLE_TESTIMONIALS=true
ENABLE_CASES=true
ENABLE_PARTNERS=true
ENABLE_SEO=true
ENABLE_SEARCH=true              // Meilisearch (inbegrepen)
ENABLE_COOKIE_CONSENT=true
ENABLE_THEMES=true

// Industry Branches (all-inclusive)
ENABLE_CONSTRUCTION=true
ENABLE_HOSPITALITY=true
ENABLE_BEAUTY=true
ENABLE_HORECA=true
ENABLE_SERVICES=true
ENABLE_REAL_ESTATE=true
ENABLE_TOURISM=true

// E-commerce (all-inclusive)
ENABLE_SHOP=true                // B2C: producten, orders, checkout, etc.
ENABLE_SUBSCRIPTIONS=true       // Inbegrepen bij E-commerce
ENABLE_LOYALTY=true             // Inbegrepen bij E-commerce
ENABLE_GIFT_VOUCHERS=true       // Inbegrepen bij E-commerce
ENABLE_VARIABLE_PRODUCTS=true   // Inbegrepen bij E-commerce
ENABLE_MIX_AND_MATCH=true       // Inbegrepen bij E-commerce
ENABLE_AB_TESTING=true          // Inbegrepen bij E-commerce
ENABLE_B2B=true                 // B2B tier: + klantgroepen, quotes, etc.
ENABLE_LICENSES=true            // Inbegrepen bij B2B
ENABLE_RECURRING_ORDERS=true    // Inbegrepen bij B2B

// Publishing (all-inclusive)
ENABLE_PUBLISHING=true          // Tijdschriften, edities, paywall, bibliotheek
ENABLE_MAGAZINES=true
ENABLE_PAYWALL=true
ENABLE_DIGITAL_LIBRARY=true

// Marketplace (all-inclusive)
ENABLE_VENDORS=true
ENABLE_VENDOR_REVIEWS=true
ENABLE_WORKSHOPS=true

// Add-ons (usage-based, apart)
ENABLE_EMAIL_MARKETING=true     // Email marketing suite
ENABLE_EMAIL_CAMPAIGNS=true
ENABLE_EMAIL_AUTOMATION=true
ENABLE_EMAIL_FLOWS=true
ENABLE_EMAIL_GRAPES_EDITOR=true
ENABLE_EMAIL_DELIVERABILITY=true

ENABLE_CHATBOT=true             // AI chatbot

ENABLE_AI_CONTENT=true          // AI content generatie

ENABLE_MULTI_LANGUAGE=true      // Meertaligheid
ENABLE_SMS=true                 // SMS notificaties
```

---

## Revenue Projecties

### Conservatief (Jaar 1) — 6 klanten

```
SETUP REVENUE:
  2x Website + Branche (€3.500):      €7.000
  3x E-commerce B2C (€5.000):        €15.000
  1x Publishing (€4.500):             €4.500
  ────────────────────────────────────────────
  TOTAAL SETUP:                       €26.500

MAATWERK:
  ~10 uur/maand × €100:              €12.000/jaar

RECURRING (MRR opbouw gedurende jaar):
  2x Website + Branche (€79):          €158/mo
  3x E-com + Email (€148):            €444/mo
  1x Publishing + Email (€128):        €128/mo
  ────────────────────────────────────────────
  MRR eind jaar 1:                     €730/mo
  Gewogen ARR (geleidelijke opbouw):  ~€5.500

JAAR 1 TOTAAL: €26.500 + €12.000 + €5.500 = ~€44.000
```

### Optimistisch (Jaar 1) — 12 klanten

```
SETUP REVENUE:
  3x Website + Branche (€3.500):      €10.500
  5x E-commerce (€5.000):             €25.000
  2x Publishing (€4.500):              €9.000
  2x E-commerce B2B (€6.500):         €13.000
  ────────────────────────────────────────────
  TOTAAL SETUP:                       €57.500

MAATWERK:
  ~25 uur/maand × €100:              €30.000/jaar

RECURRING (MRR opbouw):
  MRR eind jaar 1:                   €2.100/mo
  Gewogen ARR:                      ~€16.000

JAAR 1 TOTAAL: €57.500 + €30.000 + €16.000 = ~€103.500
```

### 5-Jaar Projectie (Optimistisch)

| Jaar | Klanten | MRR (eind) | ARR | Setup | Maatwerk | Totaal |
|------|---------|-----------|-----|-------|----------|--------|
| 1 | 12 | €2.100 | €16.000 | €57.500 | €30.000 | €103.500 |
| 2 | 22 | €3.800 | €40.000 | €50.000 | €40.000 | €130.000 |
| 3 | 35 | €6.000 | €65.000 | €60.000 | €55.000 | €180.000 |
| 4 | 50 | €8.500 | €95.000 | €65.000 | €65.000 | €225.000 |
| 5 | 65 | €11.000 | €125.000 | €55.000 | €75.000 | €255.000 |

**Cumulatief na 5 jaar: ~€893.500**

---

**End of Document**
