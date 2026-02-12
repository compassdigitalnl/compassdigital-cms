# Plastimed.nl — Redesign Voorstel

## Van WordPress/WooCommerce naar Payload CMS

---

## 1. Analyse Huidige Website

### Wat is Plastimed?
Plastimed is sinds 1994 actief als B2B-leverancier van professionele medische producten aan Nederlandse zorginstellingen. Het assortiment bevat ruim 4.000+ producten verdeeld over 10 hoofdcategorieën, van diagnostiek en EHBO tot instrumentarium en verbruiksmateriaal. Ze werken met A-merken als Medline, Hartmann en BSN.

### Huidige problemen

**Visueel & Design**
- Gedateerd, generiek WooCommerce-design dat niet past bij een professionele medische groothandel
- Geen visuele hiërarchie — alles ziet er hetzelfde uit, niets springt eruit
- Logo en branding voelen amateuristisch; geen premium uitstraling die vertrouwen wekt
- Geen consistente kleurstrategie of typografie
- Geen sfeerbeelden of lifestyle-fotografie die de doelgroep aanspreekt

**UX & Navigatie**
- Overweldigend mega-menu met 10 hoofdcategorieën en 80+ subcategorieën — zonder visuele ondersteuning
- Geen intelligente zoekfunctie (autocomplete, filters, suggesties)
- Geen quick-order functionaliteit voor terugkerende klanten
- Bestellijsten (favorietenlijsten) bestaan maar zijn slecht vindbaar
- Mobile experience is waarschijnlijk ondermaats door de complexe menustructuur

**Content & SEO**
- Categorieteksten zijn keyword-stuffed en onnatuurlijk
- Geen blog, kennisbank of productgidsen
- Geen structured data / rich snippets
- Meta-informatie lijkt generiek en niet geoptimaliseerd per pagina

**Conversie & Vertrouwen**
- Reviews/testimonials zijn aanwezig (Trustindex/Google) maar niet prominent geplaatst
- Geen zichtbare certificeringen, keurmerken of compliance-badges
- USP's (gratis verzending, scherpe prijzen) worden niet visueel sterk gecommuniceerd
- Geen live chat of directe ondersteuning zichtbaar

**Technisch**
- WordPress/WooCommerce met 4.000+ producten is zwaar en traag
- Geen headless architectuur — beperkte schaalbaarheid
- CloudFront CDN is positief, maar overall performance kan veel beter

---

## 2. Redesign Strategie

### Design Filosofie
**"Klinisch Vertrouwen meets Moderne Eenvoud"**

De nieuwe Plastimed moet de rust en precisie van een medische omgeving uitstralen, gecombineerd met de efficiëntie van een moderne B2B-webshop. Denk aan: de strakke lijnen van een operatiekamer, de heldere kleuren van medische apparatuur, en de snelheid die zorgprofessionals nodig hebben.

### Kleurenpalet

| Kleur | Hex | Toepassing |
|-------|-----|------------|
| **Deep Navy** | `#0A1628` | Primaire achtergrond, headers, vertrouwen |
| **Medical Teal** | `#00897B` | CTA's, accenten, categorie-highlights |
| **Clean White** | `#FAFBFC` | Content-achtergrond, ademruimte |
| **Soft Grey** | `#E8ECF1` | Secties, cards, dividers |
| **Signal Green** | `#00C853` | Beschikbaarheid, succes-states |
| **Warm Coral** | `#FF6B6B` | Aanbiedingen, urgentie |

### Typografie

| Gebruik | Font | Gewicht |
|---------|------|---------|
| **Koppen** | Plus Jakarta Sans | Bold (700) |
| **Subkoppen** | Plus Jakarta Sans | Semi-Bold (600) |
| **Body** | DM Sans | Regular (400) |
| **UI/Labels** | DM Sans | Medium (500) |
| **Prijzen/Data** | JetBrains Mono | Medium (500) |

### Design Principes

1. **Vertrouwen door structuur** — Strakke grid-layouts, consistent spacing, medische precisie
2. **Snelheid boven alles** — Quick-order flows, sticky zoekbalk, one-click herbestelling
3. **Professioneel maar warm** — Niet koud-klinisch, wél betrouwbaar en toegankelijk
4. **Data-gedreven** — Toon voorraadstatus, levertijden, certificeringen prominent

---

## 3. Pagina-structuur & Wireframes

### 3.1 Homepage

```
┌─────────────────────────────────────────────────────────────┐
│  TOPBAR: Gratis verzending €150+ │ Klantenservice │ Login   │
├─────────────────────────────────────────────────────────────┤
│  LOGO          │  🔍 ZOEKBALK (prominent)  │ ♡  🛒  👤     │
├─────────────────────────────────────────────────────────────┤
│  NAVIGATIE: Categorieën met iconen + mega-menu              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HERO SECTIE                                                │
│  ┌──────────────────────┬──────────────────────────────┐    │
│  │ "Uw partner in       │                              │    │
│  │  medische supplies   │   [Sfeerbeeld: moderne       │    │
│  │  sinds 1994"         │    medische praktijk]         │    │
│  │                      │                              │    │
│  │ [Bekijk assortiment] │                              │    │
│  │ [Klant worden]       │                              │    │
│  └──────────────────────┴──────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TRUST BAR                                                  │
│  ┌────────┬────────┬────────┬────────┬────────┐             │
│  │ 30 jaar│ 4000+  │ Gratis │ Veilig │ A-merk │             │
│  │ ervari.│ product│ >€150  │ betalen│ garantie│            │
│  └────────┴────────┴────────┴────────┴────────┘             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CATEGORIEËN (visueel grid met iconen + afbeeldingen)       │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐       │
│  │ 🩺      │ 🏥      │ 💉      │ 🔬      │ 🧪      │       │
│  │Diagnost.│  EHBO   │Injectie │Instrum. │ Lab     │       │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┤       │
│  │ 🏗️      │ 🩹      │ 📦      │ 🧴      │ ⭐      │       │
│  │Praktijk │Verband  │Verbruik │Verzorg. │Populair │       │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  POPULAIRE PRODUCTEN (carousel)                             │
│  ┌──────┬──────┬──────┬──────┐                              │
│  │[img] │[img] │[img] │[img] │  ← →                        │
│  │Naam  │Naam  │Naam  │Naam  │                              │
│  │€xx   │€xx   │€xx   │€xx   │                              │
│  │[+🛒] │[+🛒] │[+🛒] │[+🛒] │                              │
│  └──────┴──────┴──────┴──────┘                              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MERKEN BANNER                                              │
│  Medline │ Hartmann │ BSN │ 3M │ BD │ Clinhand │ Parker    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  WAAROM PLASTIMED?                                          │
│  ┌──────────────────┬──────────────────┐                    │
│  │ Infographic:     │ Voordelen:       │                    │
│  │ Bestelproces     │ • Persoonlijk    │                    │
│  │ visualisatie     │ • Snel geleverd  │                    │
│  │                  │ • Deskundig      │                    │
│  └──────────────────┴──────────────────┘                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  REVIEWS & TESTIMONIALS (Google Reviews integratie)         │
│  ★★★★★ 4.8/5 — "Netjes, goed verpakt, snelle levering"     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FOOTER                                                     │
│  Over Plastimed │ Klantenservice │ Veelgestelde vragen      │
│  Contactgegevens │ Betaalmethoden │ Certificeringen         │
│  Nieuwsbrief aanmelding │ Social media │ Sitemap            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Categoriepagina (PLP)

```
┌─────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Diagnostiek > Bloeddrukmeters           │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  FILTERS   │  TOOLBAR                                       │
│            │  Resultaten (47) │ Sorteer ▾ │ Grid/Lijst     │
│  Merk      │────────────────────────────────────────────────│
│  □ Hartmann│  ┌──────┬──────┬──────┐                       │
│  □ BSN     │  │[img] │[img] │[img] │                       │
│  □ 3M      │  │Naam  │Naam  │Naam  │                       │
│            │  │★★★★☆ │★★★★★ │★★★★☆ │                       │
│  Prijs     │  │€xx   │€xx   │€xx   │                       │
│  €0 - €500 │  │Op voorraad│Bestel│Op voorraad│              │
│  ━━━━●━━━━ │  │[+🛒] │[+🛒] │[+🛒] │                       │
│            │  └──────┴──────┴──────┘                       │
│  Op voorr. │                                                │
│  ○ Ja      │  ┌──────┬──────┬──────┐                       │
│  ○ Alles   │  │[img] │[img] │[img] │                       │
│            │  │...   │...   │...   │                       │
│            │  └──────┴──────┴──────┘                       │
│            │                                                │
│            │  PAGINERING: ‹ 1 2 3 4 ... 8 ›                │
│            │                                                │
└────────────┴────────────────────────────────────────────────┘
```

### 3.3 Productpagina (PDP)

```
┌─────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Diagnostiek > Bloeddrukmeters > [Naam]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┬──────────────────────────────┐    │
│  │                      │ MERK: Hartmann               │    │
│  │  [PRODUCTFOTO]       │ Productitel                   │    │
│  │  [gallery thumbnails]│ Art.nr: XXXX                  │    │
│  │                      │ ★★★★☆ (12 reviews)           │    │
│  │                      │                              │    │
│  │                      │ €XX,XX  (excl. BTW)          │    │
│  │                      │ ✓ Op voorraad                │    │
│  │                      │ 📦 Morgen in huis            │    │
│  │                      │                              │    │
│  │                      │ Aantal: [- 1 +]              │    │
│  │                      │ [██ IN WINKELWAGEN ██]        │    │
│  │                      │ [♡ Toevoegen aan lijst]       │    │
│  │                      │                              │    │
│  │                      │ ✓ Gratis verzending >€150    │    │
│  │                      │ ✓ 30 dagen retour            │    │
│  │                      │ ✓ Veilig betalen             │    │
│  └──────────────────────┴──────────────────────────────┘    │
│                                                             │
│  TABS: Omschrijving │ Specificaties │ Downloads │ Reviews   │
│  ──────────────────────────────────────────────────────     │
│  [Tab content: uitgebreide productinformatie]               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  GERELATEERDE PRODUCTEN                                     │
│  ┌──────┬──────┬──────┬──────┐                              │
│  │[img] │[img] │[img] │[img] │                              │
│  └──────┴──────┴──────┴──────┘                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Nieuwe Functionaliteiten

### 4.1 Quick-Order Systeem
Een apart bestelformulier voor ervaren klanten die op artikelnummer willen bestellen. Plak een lijst met artikelnummers + aantallen en voeg alles in één keer toe aan de winkelwagen. Dit is essentieel voor B2B-klanten die bulk-bestellingen plaatsen.

### 4.2 Intelligente Zoekfunctie
Zoekbalk met autocomplete, productafbeeldingen in suggesties, categoriefiltering, en foutcorrectie. Zoekresultaten tonen direct prijs en beschikbaarheid. Integratie met Algolia of Meilisearch via Payload CMS.

### 4.3 Bestellijsten 2.0
Meerdere lijsten per klant (bijv. "Wekelijkse bestelling", "OK-materiaal", "Praktijk A"). Mogelijkheid om hele lijsten in één klik aan de winkelwagen toe te voegen. Deelbaar met collega's binnen dezelfde organisatie.

### 4.4 Klantportaal
Dashboard met bestelhistorie, facturen (PDF download), herbestelling met één klik, en verbruiksanalyse. Toon grafieken van bestelpatronen en suggereer herbestellingen op basis van verbruik.

### 4.5 Kennisbank & Blog
Productgidsen, vergelijkingsartikelen, en how-to content. Niet alleen goed voor SEO maar ook voor het positioneren van Plastimed als thought leader in de medische supply-markt.

### 4.6 Live Chat & WhatsApp
Directe communicatiekanalen voor productadvies en bestelopvolging. WhatsApp Business integratie voor de Nederlandse markt.

---

## 5. Technische Architectuur (Payload CMS)

### Stack

| Component | Technologie |
|-----------|-------------|
| **CMS** | Payload CMS 3.x (Next.js native) |
| **Frontend** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS 4 + CSS Modules voor componenten |
| **Database** | PostgreSQL (via Payload's DB adapter) |
| **Zoeken** | Meilisearch (self-hosted) of Algolia |
| **Betalingen** | Mollie (NL-geoptimaliseerd: iDEAL, op rekening) |
| **Email** | Resend + React Email templates |
| **Hosting** | Hetzner VPS + Coolify (of Vercel) |
| **CDN/Media** | Cloudflare R2 + Image Optimization |
| **Analytics** | Plausible (privacy-first, AVG-compliant) |

### Payload CMS Collections

```
Collections:
├── Products
│   ├── title, slug, sku
│   ├── description (richText)
│   ├── price, compareAtPrice
│   ├── images[] (media)
│   ├── category (relationship → Categories)
│   ├── brand (relationship → Brands)
│   ├── specifications (array of key-value)
│   ├── downloads[] (media: PDF datasheets)
│   ├── stock (number)
│   ├── variants[] (group: size, color, etc.)
│   └── seo (group: metaTitle, metaDescription, ogImage)
│
├── Categories
│   ├── title, slug, icon
│   ├── parent (self-referencing relationship)
│   ├── description (richText)
│   ├── image (media)
│   └── seo
│
├── Brands
│   ├── title, slug, logo
│   └── description
│
├── Orders
│   ├── orderNumber, status
│   ├── customer (relationship → Users)
│   ├── items[] (product, quantity, price)
│   ├── shipping, billing addresses
│   ├── paymentMethod, paymentStatus
│   └── invoicePDF (media)
│
├── Users (Customers)
│   ├── email, company, kvkNumber
│   ├── addresses[]
│   ├── orderLists[] (named favorites lists)
│   └── role (B2B, admin, staff)
│
├── Pages (CMS-managed)
│   ├── title, slug
│   ├── layout[] (blocks: hero, grid, text, CTA, etc.)
│   └── seo
│
├── Posts (Blog/Kennisbank)
│   ├── title, slug, excerpt
│   ├── content (richText)
│   ├── category, tags
│   ├── author
│   └── seo
│
└── Media
    ├── Standard Payload media collection
    └── Cloudflare R2 storage adapter
```

### Key Integraties

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Payload CMS │────▶│  Next.js 15  │────▶│  Cloudflare  │
│  (Backend)   │     │  (Frontend)  │     │  (CDN/Media) │
└──────┬───────┘     └──────┬───────┘     └──────────────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│  PostgreSQL  │     │  Meilisearch │
│  (Database)  │     │  (Search)    │
└──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│   Mollie     │     │   Resend     │
│  (Payments)  │     │  (Email)     │
└──────────────┘     └──────────────┘
```

---

## 6. SEO & Performance Strategie

### Technical SEO
- Server-side rendering (SSR) via Next.js voor optimale crawlbaarheid
- Structured data (JSON-LD) voor producten, reviews, organisatie, breadcrumbs en FAQ
- Automatische sitemap.xml en robots.txt generatie
- Canonical URLs en hreflang-tags
- Core Web Vitals optimalisatie: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Content SEO
- Unieke, waardevolle categorieteksten (niet keyword-stuffed)
- Productbeschrijvingen met medische precisie en zoekintentie
- Kennisbank met long-tail content (bijv. "Welke stethoscoop voor huisarts?")
- FAQ-secties per categorie met structured data

### Migratie SEO
- 301-redirects voor alle bestaande URL's
- URL-structuur behouden waar mogelijk
- Google Search Console monitoring tijdens en na migratie
- Gefaseerde migratie met soft-launch periode

---

## 7. Fasering & Planning

### Fase 1 — Fundament (6-8 weken)
- Payload CMS opzet met alle collections
- Design system bouwen (componenten bibliotheek)
- Homepage, categorie- en productpagina's
- Basis zoekfunctionaliteit
- Product data-migratie (WooCommerce → Payload)

### Fase 2 — E-commerce Core (4-6 weken)
- Winkelwagen en checkout flow
- Mollie betalingsintegratie
- Klantregistratie en login
- Bestellijsten functionaliteit
- Order management

### Fase 3 — Optimalisatie (3-4 weken)
- Geavanceerde zoekfunctie (Meilisearch/Algolia)
- Quick-order systeem
- Klantportaal met bestelhistorie
- Performance optimalisatie
- SEO audit en fine-tuning

### Fase 4 — Groei (doorlopend)
- Kennisbank / blog lancering
- Live chat / WhatsApp integratie
- A/B testing setup
- Verbruiksanalyse dashboard voor klanten
- Eventuele ERP-koppeling

---

## 8. Verwachte Resultaten

| Metric | Huidig (geschat) | Na redesign |
|--------|-------------------|-------------|
| Laadtijd homepage | 4-6 sec | < 1.5 sec |
| Bounce rate | ~55% | < 35% |
| Conversieratio | ~1.5% | 3-4% |
| Gemiddelde sessieduur | 2 min | 4+ min |
| Organisch verkeer | Baseline | +40-60% (6 maanden) |
| Herbestellingen | Handmatig | Geautomatiseerd |
| Lighthouse score | ~50-60 | 95+ |

---

*Document opgesteld als redesign-voorstel voor de migratie van plastimed.nl van WordPress/WooCommerce naar Payload CMS.*
