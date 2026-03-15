# Voorstel: Tennis-voordeel & Padel-voordeel — CompassDigital Platform

**Datum:** 4 maart 2026
**Klant:** Tennis-voordeel / Padel-voordeel
**Huidige platform:** 2x WooCommerce + WooMultistore + 30+ plugins + Klaviyo/Mailchimp
**Nieuw platform:** CompassDigital E-commerce Pro (Multi-Store) + Email Marketing Engine

---

## Huidige Situatie

Tennis-voordeel beheert **twee webshops**:
- **Tennis-voordeel.nl** — Hoofdwinkel met het volledige assortiment (tennis + padel + accessoires)
- **Padel-voordeel.nl** — Gefilterde winkel met alleen padel-artikelen

Beide shops draaien op WooCommerce, gekoppeld via **WooMultistore**. Daarnaast is er een uitgebreide plugin-stack:

### Core E-commerce & Checkout

| Plugin | Functie | Geschatte kosten |
|--------|---------|-----------------|
| WooCommerce | Webshop engine | Gratis (core) |
| Mollie Payments | Betalingen (iDEAL, CC, etc.) | Transactiekosten |
| Flux Checkout | Geoptimaliseerde multi-step checkout | ~€10/mo |
| WooCommerce Product Add-ons | Extra productopties bij bestelling | ~€8/mo |
| WooCommerce Tiered Price Table | Staffelkortingen / kwantumkorting | ~€5/mo |
| WooCommerce NL Postcode Checker | Postcode → straat/stad auto-fill | ~€5/mo |
| MyParcel | Verzendlabels & tracking | Gratis plugin |
| PDF Invoices & Packing Slips | Facturen & pakbonnen | Gratis/Pro ~€5/mo |
| PW WooCommerce Gift Cards | Cadeaubonnen verkoop | ~€5/mo |

### Product Presentatie & Filters

| Plugin | Functie | Geschatte kosten |
|--------|---------|-----------------|
| Brands for WooCommerce (BeRocket) | Merken/brands pagina's | ~€5/mo (paid) |
| Acowebs Product Labels | Product badges/labels | Gratis/Pro ~€4/mo |
| Swatchly | Variatie swatches (kleur, maat) | Gratis |
| Premmerce Product Filter (Premium) | Productfilters & facets | ~€8/mo |
| Smart Search and Product Filter (Searchanise) | Zoeken, previews, suggesties | ~€9-40/mo |

### Design & Content

| Plugin | Functie | Geschatte kosten |
|--------|---------|-----------------|
| Elementor + Elementor Pro | Pagebuilder | ~€8/mo |
| Advanced Custom Fields | Custom velden | Gratis/Pro ~€4/mo |
| Gravity Forms | Formulieren | ~€8/mo |
| Loco Translate | Vertalingen | Gratis |
| Permalink Manager Pro | Custom URL-structuur | ~€5/mo |

### Marketing & Analytics

| Plugin | Functie | Geschatte kosten |
|--------|---------|-----------------|
| Conversios.io | GA4, Google Ads, FB Pixel, TikTok, product feeds | Gratis/Pro ~€10/mo |
| Mailchimp for WooCommerce | Email marketing sync | Gratis plugin |
| **Klaviyo / Mailchimp** | **Email marketing platform** | **~€240/mo** |

### SEO & Performance

| Plugin | Functie | Geschatte kosten |
|--------|---------|-----------------|
| SmartCrawl | SEO tooling | Gratis/Pro |
| Smush | Afbeelding compressie | Gratis/Pro |
| Speed Optimizer (SiteGround) | Caching & performance | Incl. hosting |
| Security Optimizer (SiteGround) | Beveiliging | Incl. hosting |
| Akismet | Spam bescherming | Gratis/Pro ~€8/mo |

### Overig

| Plugin | Functie | Geschatte kosten |
|--------|---------|-----------------|
| WooMultistore | Multi-store beheer | ~€15/mo |
| WP Mail SMTP | Betrouwbare email verzending | Gratis/Pro |
| Better Search Replace | Database tool | Gratis |
| **Managed hosting (SiteGround)** | **Server & hosting (2 sites)** | **~€100/mo** |

### Totaal Huidige Kosten

```
Plugin licenties & tools:              ~€150-200/mo
Klaviyo / Mailchimp (email marketing): ~€240/mo
Hosting (SiteGround, 2 sites):         ~€100/mo
WooMultistore licentie:                ~€15/mo
Eigen onderhoud & updates:             onbetaalbaar
────────────────────────────────────────────────────
TOTAAL GESCHAT:                        €505-555/mo + eigen tijd
(waarvan €240/mo puur email marketing)
```

### Risico's Huidig Platform

- **30+ plugins PER SHOP** = continu risico op conflicten bij updates
- **WooMultistore** = fragiele koppeling tussen 2 shops, extra complexiteit bij updates
- **Dubbel onderhoud** = beide shops moeten apart geüpdatet en getest worden
- **Zoeken via Searchanise** = extern, beperkt configureerbaar
- **Performance via SiteGround caching** = beperkt, niet schaalbaar
- **Geen integratie** tussen tools (filters, zoeken, labels, brands zijn allemaal apart)
- **Plugin-afhankelijkheid** = als 1 plugin stopt → groot probleem
- **Security** = kwetsbaar door groot plugin-oppervlak (2x!)
- **Elementor lock-in** = moeilijk te migreren content

---

## CompassDigital Voorstel

### Eenmalige Setup: €6,500

| Onderdeel | Details |
|-----------|---------|
| **Multi-Store deployment** | **2 sites: Tennis-voordeel + Padel-voordeel, eigen domein, SSL, CDN** |
| **Product sync configuratie** | **Gedeeld productbeheer: alle producten in Tennis-voordeel, padel-subset automatisch in Padel-voordeel** |
| Data migratie | Producten, categorieën, merken, klantdata, orders overzetten |
| Design & huisstijl | Logo, kleuren, typografie, templates op maat (per shop) |
| E-commerce configuratie | Checkout, verzendkosten, BTW, email templates |
| Brands/merken | Merken-pagina's met logo's, filters op merk |
| Product labels & badges | "Nieuw", "Sale", "Populair" badges configuratie |
| Variatie swatches | Kleur- en maatselectie visueel weergeven |
| Staffelprijzen | Kwantumkorting per product(groep) |
| Gift Cards | Cadeaubonnen systeem inrichten |
| Productfilters & facets | Filters op merk, prijs, maat, kleur, categorie |
| Meilisearch | Snelle zoeken, autocomplete, previews, suggesties (per shop) |
| MyParcel integratie | Verzendlabels & tracking |
| Mollie Payments | iDEAL, creditcard, Bancontact, etc. |
| Email Marketing Engine | Listmonk + GrapesJS: nieuwsbrieven, automations, drag & drop templates (per shop) |
| Analytics & Tracking | GA4, conversion tracking, event tracking (per shop) |
| SEO migratie | 301 redirects, meta data, sitemap, JSON-LD schema's (per shop) |
| Training | 4 uur hands-on training voor team |

**Betaling:** 50% bij start, 50% bij oplevering
**Doorlooptijd:** 3-5 weken

---

### Hoe werkt Multi-Store in CompassDigital?

CompassDigital draait een **native multi-tenant architectuur**. Dit betekent:

1. **Tennis-voordeel.nl** = hoofdsite met het volledige assortiment (eigen database, eigen zoekindex)
2. **Padel-voordeel.nl** = tweede site met alleen padel-producten (eigen database, eigen zoekindex)
3. **Gedeelde codebase** = beide shops draaien op dezelfde platformversie, updates worden automatisch naar beide uitgerold
4. **Product sync** = producten die in Tennis-voordeel als "padel" zijn gecategoriseerd, worden automatisch gesynchroniseerd naar Padel-voordeel
5. **Eigen design per shop** = elke shop kan eigen huisstijl, logo en templates hebben

**Voordelen t.o.v. WooMultistore:**
- Geen fragiele plugin-koppeling — native multi-tenant
- Geen dubbel onderhoud — één update = beide shops bijgewerkt
- Eigen zoekindex per shop — Padel-voordeel toont alleen padel-resultaten
- Onafhankelijke checkout & betalingen per shop
- Schaalbaar — in de toekomst eenvoudig een derde shop toevoegen (bijv. Badminton-voordeel)

---

### Maandelijks: €728/mo all-inclusive (E-commerce Pro + Multi-Store + Email Marketing)

| Inclusief | Vervangt |
|-----------|----------|
| **2x Enterprise hosting (CDN, SSL, backups)** | **SiteGround hosting (2 sites)** |
| **Multi-Store platform (2 shops)** | **WooMultistore** |
| **Product sync (Tennis → Padel)** | **Handmatige sync / WooMultistore** |
| **Email Marketing Engine (Listmonk + GrapesJS)** | **Klaviyo / Mailchimp (€240/mo)** |
| Native performance optimalisatie | Speed Optimizer / SiteGround caching |
| Meilisearch (zoeken, filters, autocomplete) | Searchanise + Premmerce Filter |
| Brands/merken systeem | Brands for WooCommerce (BeRocket) |
| Product labels & badges | Acowebs Product Labels |
| Variatie swatches | Swatchly |
| Staffelprijzen / kwantumkorting | WooCommerce Tiered Price Table |
| Product add-ons & opties | WooCommerce Product Add-ons |
| Gift Cards systeem | PW WooCommerce Gift Cards |
| Geoptimaliseerde checkout | Flux Checkout |
| SEO analyzer & JSON-LD schema's | SmartCrawl |
| Afbeelding optimalisatie | Smush |
| Drag & drop pagebuilder | Elementor + Elementor Pro |
| Formulieren builder | Gravity Forms |
| Custom velden & content types | Advanced Custom Fields |
| URL-beheer & redirects | Permalink Manager Pro |
| Postcode validatie | WooCommerce NL Postcode Checker |
| Import/export tools | Better Search Replace / WP Export |
| PDF facturen & pakbonnen | PDF Invoices & Packing Slips |
| Email verzending (SMTP) | WP Mail SMTP |
| Spam bescherming | Akismet |
| Security patches (automatisch) | Security Optimizer |
| Platform updates & nieuwe features | — |
| Email support (response binnen 24u) | — |
| 99.5% uptime SLA | — |

**Email Marketing Engine** (€179/mo, inbegrepen bij €728/mo):
- Nieuwsbrieven ontwerpen met drag & drop editor (GrapesJS)
- Subscriber management, lijsten, segmentatie
- Automations (welkom-serie, abandoned cart, win-back)
- Verzending via Listmonk (25.000 contacten)
- Per shop eigen templates, lijsten en campagnes
- Vervangt Klaviyo/Mailchimp volledig — besparing €61/mo

---

### Optionele Add-ons

| Add-on | Prijs |
|--------|-------|
| Priority Support (4u response, WhatsApp) | €149/mo |
| Content Management (4u/mo updates) | €199/mo |
| Maandelijkse SEO & performance audit | €249/mo |
| Extra shop toevoegen (bijv. Badminton-voordeel) | €100/mo + €800 setup |
| Extra development uren | €125/uur (4u blokken) |

---

## Investering Overzicht

### Jaar 1

```
Setup (eenmalig, 2 shops):              €6,500
Maandelijks (12 × €728):                €8,736
─────────────────────────────────────────────────
TOTAAL JAAR 1:                          €15,236
```

### Jaar 2+

```
Maandelijks (12 × €728):                €8,736
─────────────────────────────────────────────────
TOTAAL PER JAAR:                         €8,736
```

### 3-Jaars Overzicht

```
Jaar 1:                                 €15,236
Jaar 2:                                  €8,736
Jaar 3:                                  €8,736
─────────────────────────────────────────────────
TOTAAL 3 JAAR:                          €32,708
Gemiddeld per maand:                       €908
```

**Ter vergelijking — huidige kosten over 3 jaar:**
```
Huidig (3 × 12 × €530 gemiddeld):      €19,080
  (incl. plugins, hosting, Klaviyo)
+ eigen onderhoud (3 × 12 × 6u × €50): €10,800
─────────────────────────────────────────────────
WERKELIJKE KOSTEN 3 JAAR:              ~€29,880
```

**CompassDigital bespaart:**
- €61/mo op email marketing (€179 vs €240 Klaviyo)
- 4-8 uur/mo aan eigen onderhoud (= €0 bij CompassDigital)
- Nul plugin-risico, nul update-stress

---

## Vergelijking: Huidig vs. CompassDigital

### Kosten Vergelijking

| | **WooCommerce (nu)** | **CompassDigital** |
|---|---|---|
| **Hosting (2 sites)** | €100/mo (SiteGround) | Inclusief |
| **Plugin licenties** | ~€150-200/mo (30+ plugins) | Inclusief |
| **WooMultistore** | ~€15/mo | Inclusief (native multi-store) |
| **Email Marketing** | ~€240/mo (Klaviyo/Mailchimp) | €179/mo (Listmonk + GrapesJS, inbegrepen) |
| **Platform fee** | — | €728/mo all-inclusive (2 shops) |
| **Onderhoud eigen tijd** | 4-8 uur/mo (onbetaalbaar) | 0 uur (managed) |
| **Totaal** | €505-555/mo + eigen tijd | €728/mo all-inclusive |

### Feature Vergelijking

| Functie | **WooCommerce (nu)** | **CompassDigital** |
|---------|---|---|
| **Multi-Store** | WooMultistore (fragiel, apart plugin) | Native multi-tenant (2 shops incl.) |
| **Aantal plugins** | 30+ per shop (conflictrisico) | 0 (alles ingebouwd) |
| **Performance** | SiteGround caching (beperkt) | Native Next.js (razendsnel) |
| **Zoekfunctie** | Searchanise (extern, betaald) | Meilisearch (ingebouwd, per shop) |
| **Productfilters** | Premmerce (apart, betaald) | Native faceted filters |
| **Product sync** | WooMultistore (handmatig/fragiel) | Automatische sync Tennis → Padel |
| **Merken/Brands** | BeRocket plugin (apart) | Native brands systeem |
| **Product labels** | Acowebs plugin (apart) | Native label/badge systeem |
| **Staffelprijzen** | Tiered Price Table plugin | Native pricing tiers |
| **Gift Cards** | PW Gift Cards (apart) | Native gift card systeem |
| **Checkout** | Flux Checkout (apart, betaald) | Native geoptimaliseerde checkout |
| **SEO** | SmartCrawl (apart) | Native SEO analyzer + JSON-LD |
| **Pagebuilder** | Elementor Pro (apart, betaald) | Native block builder |
| **Formulieren** | Gravity Forms (apart, betaald) | Native formulieren builder |
| **Updates & onderhoud** | Zelf doen (2x! voor beide shops) | Automatisch (beide shops managed) |
| **Security** | Zelf bijhouden (2x 30 plugins!) | Automatische patches |
| **Support** | Zelf uitzoeken | Dedicated support team |
| **Schaalbaarheid** | Beperkt (3e shop = nóg meer plugins) | Eenvoudig shop toevoegen |
| **Toekomstbestendig** | WordPress lifecycle risico | Modern Next.js + Payload CMS |

### Plugin-voor-Plugin Mapping

| Huidige Plugin | CompassDigital Equivalent | Status |
|----------------|--------------------------|--------|
| WooCommerce | E-commerce engine | Ingebouwd |
| Elementor + Pro | Block builder / Page builder | Ingebouwd |
| Advanced Custom Fields | Payload CMS custom fields | Ingebouwd |
| Gravity Forms | Formulieren builder | Ingebouwd |
| Mollie Payments | Mollie integratie | Ingebouwd |
| Flux Checkout | Checkout flow | Ingebouwd |
| Brands for WooCommerce | Brands collectie | Ingebouwd |
| Acowebs Product Labels | Product badges/labels | Ingebouwd |
| Swatchly | Variatie swatches | Ingebouwd |
| WooCommerce Tiered Price Table | Staffelprijzen engine | Ingebouwd |
| WooCommerce Product Add-ons | Product opties | Ingebouwd |
| PW Gift Cards | Gift Cards systeem | Ingebouwd |
| Premmerce Product Filter | Faceted search & filters | Ingebouwd |
| Smart Search (Searchanise) | Meilisearch | Ingebouwd |
| SmartCrawl | SEO analyzer | Ingebouwd |
| Smush | Image optimization | Ingebouwd |
| Speed Optimizer | Next.js SSR/SSG | Ingebouwd |
| Security Optimizer | Automatische patches | Ingebouwd |
| Permalink Manager Pro | URL routing | Ingebouwd |
| WooCommerce NL Postcode Checker | Postcode validatie | Ingebouwd |
| PDF Invoices & Packing Slips | PDF generator | Ingebouwd |
| Loco Translate | Multi-language engine | Ingebouwd |
| MyParcel | MyParcel API-koppeling | Ingebouwd |
| Conversios.io | Analytics & tracking | Ingebouwd |
| WP Mail SMTP | Email service | Ingebouwd |
| Akismet | Spam filter | Ingebouwd |
| Better Search Replace | Niet nodig (geen WP DB) | N.v.t. |
| WooMultistore | Native multi-tenant (2 shops) | Ingebouwd |
| **Mailchimp / Klaviyo** | **Email Marketing Engine (Listmonk + GrapesJS)** | **Ingebouwd** |

---

## Waarom Overstappen?

1. **2 shops, 1 platform** — Tennis-voordeel én Padel-voordeel vanuit één beheeromgeving, geen WooMultistore nodig
2. **30+ plugins → 0 plugins** — Geen plugin-conflicten, geen update-stress, geen licentie-chaos
3. **Razendsnel** — Next.js met server-side rendering, geen externe caching nodig
4. **Alles geïntegreerd** — Zoeken, filters, brands, labels, staffelprijzen, email marketing: één geheel
5. **Email marketing ingebouwd** — Nieuwsbrieven, automations, templates — geen Klaviyo/Mailchimp meer nodig (besparing €61/mo)
6. **Veiliger** — Geen 60+ plugin-aanvalsoppervlakken (30 per shop!), automatische patches
7. **Geen onderhoud** — Wij regelen alle updates voor beide shops, jij focust op verkopen
8. **Toekomstbestendig** — Modern platform, eenvoudig een 3e shop toevoegen (bijv. Badminton-voordeel)
9. **Slimme product sync** — Producten beheren in Tennis-voordeel, padel-artikelen verschijnen automatisch in Padel-voordeel

---

## Aandachtspunten

### Email Marketing Engine (vervangt Klaviyo/Mailchimp)
Tennis-voordeel gebruikt Klaviyo en/of Mailchimp voor email marketing (~€240/mo). CompassDigital vervangt dit volledig met de **native Email Marketing Engine**:
- **Listmonk** als verzendplatform (25.000 contacten, onbeperkt versturen)
- **GrapesJS** drag & drop email template editor (net als Mailchimp)
- Subscriber management, lijsten en segmentatie per shop
- Automations: welkom-serie, abandoned cart, win-back campagnes
- Per shop eigen templates, lijsten en campagnes (Tennis-voordeel apart van Padel-voordeel)
- **Besparing: €61/mo** (€179 vs €240 Klaviyo/Mailchimp)

### Multi-Store: Tennis-voordeel + Padel-voordeel
De twee webshops worden als volgt ingericht:
- **Tennis-voordeel.nl** = hoofdsite, hier worden ALLE producten beheerd
- **Padel-voordeel.nl** = gefilterde site, toont automatisch alleen producten met categorie "Padel"
- Producten hoeven maar **één keer** ingevoerd te worden
- Voorraad, prijzen en productinfo zijn altijd synchroon
- Elke shop heeft een eigen design, eigen domein en eigen zoekindex
- In de toekomst kan eenvoudig een 3e shop worden toegevoegd (bijv. Badminton-voordeel) voor €100/mo + €800 setup

---

## Contractvoorwaarden

```
Setup fee:            €6,500 (50% vooraf, 50% bij oplevering)
Maandelijkse fee:     €728/mo (jaarcontract, maandelijks betalen)
Inclusief:            2 webshops + Email Marketing Engine
Minimum looptijd:     12 maanden
Opzegtermijn:         3 maanden
Development uren:     €125/uur (vooraf offerte, achteraf factuur)
```

---

**CompassDigital** — Twee shops, één platform, email marketing inbegrepen, nul plugin-chaos.
