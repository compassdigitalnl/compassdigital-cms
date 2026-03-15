# Voorstel: Aboland + Magvilla — Sityzr Platform

**Datum:** 14 maart 2026
**Van:** Compass Digital
**Aan:** Abonnementenland
**Versie:** 5.0 — Herzien op basis van Sityzr Pricing Model Q2 2026

---

## 1. Situatieschets

**Aboland.nl** — de primaire webshop voor Abonnementenland. Verkoopt abonnementen, losse tijdschriften en pakketten/bundels aan consumenten.

- E-commerce contacten: **18.359**
- Producten: abonnementen, losse tijdschriften, pakketten/bundels
- Rol: **Webshop** — eigen branding, eigen klanten, eigen checkout

**Magvilla** — zustersite. Eigen branding, eigen klanten. Producten worden gedeeld via de Multistore Hub.

- E-commerce contacten: **21.482**
- Producten: gesynchroniseerd vanuit Multistore Hub + eigen varianten
- Rol: **Webshop** — eigen tenant

**Multistore Hub** (`beheer.aboland.nl`) — een **dedicated admin-only site** (alleen `/admin`, geen frontend/website). Dit is het centrale beheerpunt waar producten worden aangemaakt, beheerd en gedistribueerd naar alle webshops. Alle orders van alle shops komen hier samen voor afhandeling (pick, pack, ship).

- Rol: **Centraal beheer** — master catalogus, product sync, orderdashboard, fulfillment
- Type: **Admin-only** — geen publieke website, alleen Payload admin panel
- Resources: lichtgewicht (geen SSR, geen frontend build, alleen API + admin)

**Aangesloten titels** (bijv. WINELIFE, Vrij Nederland, etc.) zijn **webshops of content-tenants**: uitgevers die hun eigen website en/of webshop krijgen. Producten worden vanuit de Hub gesynchroniseerd, orders gaan terug naar de Hub.

**Totaal e-mailvolume: ~200.000 - 300.000 emails/mo** (e-commerce + lifecycle)

**Subscriber base (Copernica):** ~1.000.000 profielen voor lifecycle mailing. Optioneel te migreren.

---

## 2. Principes

| Principe | Toelichting |
|----------|-------------|
| **Per-site facturatie** | Elke site = eigen tenant, eigen factuur, los verkoopbaar |
| **Sityzr standaardprijzen** | Platform pricing conform Sityzr Pricing Model Q2 2026 |
| **Email = volume-based** | Afrekenen op verzonden emails, niet op profielen of subscribers |
| **Multistore Hub = admin-only** | Dedicated beheerssite zonder frontend, puur voor centraal productbeheer en orderdashboard |
| **Modulaire add-ons** | Titels kiezen zelf welke functionaliteit ze nodig hebben |
| **Titels = klanten van de klant** | Aboland verkoopt platformlicenties door aan uitgevers |

---

## 3. Pricing basis: Sityzr Standaardprijzen

Dit voorstel is gebaseerd op het Sityzr Pricing Model Q2 2026. Aboland en Magvilla gebruiken de standaard Sityzr productlijnen en add-ons.

### Productlijnen (maandelijks)

| Tier | Prijs | Inbegrepen |
|------|-------|------------|
| Website Starter | €49/mo | 10 pagina's, CMS, SEO, SSL, hosting, backups |
| Website Pro | €149/mo | Onbeperkt pagina's, blog, formulieren, analytics, AI-content tools |
| Website Business | €299/mo | Multi-taal, dedicated manager, geavanceerde analytics |
| E-commerce Basic | €199/mo | Website Pro + productcatalogus (500), checkout, payments, klantaccounts |
| E-commerce Compleet | €399/mo | Onbeperkt producten, reviews, wishlists, promoties, variabele producten, cadeaubonnen |
| B2B Standaard | €599/mo | E-commerce Compleet + klantgroepen, staffelprijzen, snelbestelformulier, offertes |
| B2B Enterprise | €999/mo | + barcode scanner, goedkeuringsflows, ERP-koppeling, volledige API |

### Branch-modules (maandelijks, bovenop productlijn)

| Module | Prijs |
|--------|-------|
| Publishing & Media | +€99/mo |
| Beauty & Wellness | +€69/mo |
| Horeca & Restaurant | +€69/mo |
| Bouw & Constructie | +€69/mo |
| Zorg & Gezondheid | +€99/mo |
| Vastgoed & Makelaardij | +€99/mo |
| Ervaringen & Events | +€69/mo |
| Prof. Dienstverlening | +€49/mo |

### Platform Add-ons (maandelijks)

| Add-on | Prijs |
|--------|-------|
| Meilisearch (Geavanceerd Zoeken) | +€49/mo |
| AI Chatbot | +€79/mo |
| E-mail Marketing | +€99/mo (5K contacten, 25K emails) |
| E-mail Marketing Pro | +€199/mo (25K contacten, 100K emails) |
| Social Media Publishing | +€69/mo |
| Social Media Publishing Pro | +€129/mo |
| Multi-taal | +€49/mo |
| Push Notificaties (PWA) | +€39/mo |
| Advertenties | +€69/mo (Google Ad Manager, ad zones, display & native ads, rapportage) |
| Advertenties Pro | +€129/mo (+ programmatic/header bidding, yield optimization, video ads, revenue dashboard) |

---

## 4. Email Marketing — Volume-based Pricing

Afwijkend van standaard Sityzr pricing vanwege het hoge emailvolume van Aboland. Pricing puur op **verzonden emails per maand**. Onbeperkt subscribers/contacten.

### E-commerce Email (per site)

| Staffel | Emails/mo | Prijs | Overschrijding |
|---------|-----------|-------|----------------|
| Starter | 5.000 | €29/mo | €1,00 / 1K emails |
| Groei | 30.000 | €79/mo | €0,80 / 1K emails |
| Pro | 100.000 | €149/mo | €0,60 / 1K emails |
| Business | 500.000 | €299/mo | €0,40 / 1K emails |
| Enterprise | Op maat | Op maat | Op maat |

**Inbegrepen:** GrapesJS editor, automation flows, RFM segmentatie, A/B testing, analytics, Listmonk engine (self-hosted). Onbeperkt contacten.

### Subscriber Lifecycle Email (Copernica-vervanging)

| Staffel | Emails/mo | Prijs | Overschrijding |
|---------|-----------|-------|----------------|
| 100K | 100.000 | €99/mo | €0,50 / 1K emails |
| 250K | 250.000 | €199/mo | €0,40 / 1K emails |
| 500K | 500.000 | €349/mo | €0,30 / 1K emails |
| 1M | 1.000.000 | €599/mo | €0,25 / 1K emails |

SMTP (Amazon SES): ~€0,10 per 1.000 emails (doorberekend).

---

## 5. Multistore Hub — Admin-only Beheersite

De Multistore Hub (`beheer.aboland.nl`) is een **dedicated admin-only site**: alleen het Payload admin panel, geen publieke website. Dit is het centrale beheerpunt van het hele ecosysteem.

### Waarom een aparte site?

| Voordeel | Toelichting |
|----------|-------------|
| **Scheiding van concerns** | Beheer en webshop zijn volledig gescheiden — geen frontend code, geen theme, geen SEO nodig |
| **Lichtgewicht** | Geen SSR, geen Next.js frontend build. Alleen API endpoints + admin panel. Minder resources, sneller |
| **Eenvoudig beheer** | Aboland-team logt in op `beheer.aboland.nl/admin` voor alle multistore-taken — los van de webshops |
| **Schaalbaar** | Nieuwe webshops toevoegen zonder impact op het beheersysteem |
| **Veilig** | Geen publiek toegankelijk oppervlak — alleen authenticated admin users |

### Hub Functionaliteit

| Functie | Omschrijving |
|---------|-------------|
| Master Catalogus | Alle producten (abonnementen, losse nummers, pakketten) worden hier aangemaakt en beheerd |
| Product Distributie | Selecteer per product welke webshops het product ontvangen (checkbox per tenant, bulk acties) |
| Centraal Orderdashboard | Alle orders van alle webshops in één overzicht, met filter per tenant |
| Fulfillment Workflow | Pick → Pack → Ship vanuit de Hub, ongeacht via welke shop de order binnenkwam |
| Status Sync | Orderstatus-updates worden automatisch teruggesynchroniseerd naar de webshop |
| Inventory Management | Centrale voorraad, real-time sync naar webshops, auto de-list bij uitverkocht |
| Per-tenant Prijsoverschrijving | Optioneel: andere verkoopprijs per webshop (bijv. WINELIFE-korting) |
| Reconciliation | Omzet per webshop, commissie-berekening, maandelijkse afrekenrapportage (PDF) |

### Maandelijkse kosten Multistore Hub

| Component | Staffel | Maandelijks |
|-----------|---------|-------------|
| Multistore Hub (admin-only) | Starter — tot 5 webshops | €79/mo |
| **Totaal Hub** | | **€79/mo** |

> **Inbegrepen in Multistore Hub:** hosting, SSL, dagelijkse backups, admin panel, master catalogus, product sync engine, centraal orderdashboard, inventory management, reconciliation. Geen frontend-kosten.

> **Opschaling:** Pro (tot 25 webshops) = €149/mo | Business (tot 100) = €249/mo | Enterprise = op maat.

### Setup Multistore Hub

> **Multistore is een standaard platformfeature van Sityzr.** Provisioning van de Hub-instance (server, DNS, SSL, database) is inbegrepen — geen eenmalige implementatiekosten.

---

## 6. Aboland.nl — Webshop

Aboland is de primaire webshop. Verkoopt abonnementen, losse nummers en pakketten aan consumenten. Producten worden gesynchroniseerd vanuit de Multistore Hub. Orders gaan terug naar de Hub voor fulfillment.

### Maandelijkse kosten Aboland

| Component | Sityzr tier | Maandelijks |
|-----------|-------------|-------------|
| E-commerce Compleet | Onbeperkt producten, alle features | €399/mo |
| Publishing & Media module | Digitale magazines, paywall, bibliotheek | €99/mo |
| E-mail Marketing | Pro — 100K emails/mo (volume-based) | €149/mo |
| AI Chatbot | Tot 1.000 gesprekken/mo | €79/mo |
| **Totaal Aboland** | | **€726/mo** |

> **AI-content tools** zijn inbegrepen in E-commerce Compleet (geen extra kosten).

> **Email:** Volume-based staffel i.p.v. standaard Sityzr add-on vanwege hoog volume. Overschrijding: €0,60/1K.

### Setup & Migratie (eenmalig)

| Onderdeel | Prijs |
|-----------|-------|
| Server provisioning + DNS + SSL | €250 |
| Theme & branding (huisstijl) | €350 |
| Categorie-structuur & navigatie | €200 |
| Payment gateway (Stripe/MultiSafepay) | €150 |
| Email setup (Listmonk + SMTP + templates) | €200 |
| Admin training (2 uur) | €200 |
| **Subtotaal setup** | **€1.350** |

**WooCommerce → Payload Migratie:**

| Onderdeel | Prijs |
|-----------|-------|
| Abonnementsproducten (plans + varianten) | €500 |
| Losse tijdschriften (single issues, edities/jaargangen) | €400 |
| Pakketten & bundels (samenstellingen) | €350 |
| Productafbeeldingen (bulk migratie) | €250 |
| Categorie/tag mapping | €200 |
| Klantaccounts + adressen + orderhistorie | €350 |
| THOR abonnements-mapping | €300 |
| **Subtotaal migratie** | **€2.350** |

**Redirectplan (SEO-behoud):**

| Onderdeel | Prijs |
|-----------|-------|
| URL-mapping document (oud → nieuw) | €350 |
| 301 redirects implementatie | €100 |
| Post-launch 404 monitoring (2 weken) | €100 |
| **Subtotaal redirects** | **€550** |

**Totaal eenmalig Aboland: €4.250**

---

## 7. Magvilla — Webshop

Magvilla is een zusterwebshop. Producten worden gesynchroniseerd vanuit de Multistore Hub. Orders gaan terug naar de Hub voor fulfillment. Magvilla heeft eigen branding, eigen klanten en eigen email marketing.

### Maandelijkse kosten Magvilla

| Component | Sityzr tier | Maandelijks |
|-----------|-------------|-------------|
| E-commerce Compleet | Onbeperkt producten, alle features | €399/mo |
| E-mail Marketing | Pro — 100K emails/mo (volume-based) | €149/mo |
| AI Chatbot | Tot 1.000 gesprekken/mo | €79/mo |
| **Totaal Magvilla** | | **€627/mo** |

> Magvilla hoeft geen Multistore add-on — die zit in de Multistore Hub.

### Setup & Migratie (eenmalig)

| Onderdeel | Prijs |
|-----------|-------|
| Server provisioning | €250 |
| Theme & branding (eigen huisstijl) | €350 |
| Productmigratie (hergebruik scripts van Aboland) | €750 |
| Klantaccounts + orderhistorie | €250 |
| Redirectplan (hergebruik patronen) | €300 |
| Admin training | €150 |
| **Totaal eenmalig Magvilla** | **€2.050** |

---

## 8. Multistore — Technisch Overzicht

### Architectuur

```
┌──────────────────────────────────────────────────────┐
│  MULTISTORE HUB — beheer.aboland.nl                  │
│  Admin-only site (geen frontend, alleen /admin)      │
│                                                      │
│  ┌─────────────────┐    ┌──────────────────────────┐ │
│  │ Master Catalogus│    │ Centraal Order Dashboard │ │
│  │                 │    │                          │ │
│  │ • Abonnementen  │    │ • Alle orders (alle      │ │
│  │ • Losse nummers │    │   webshops)              │ │
│  │ • Pakketten     │    │ • Pick → Pack → Ship     │ │
│  │ • Varianten     │    │ • Status sync terug      │ │
│  │                 │    │ • Per-tenant rapportage   │ │
│  └────────┬────────┘    └───────────▲──────────────┘ │
│           │ product sync            │ order sync     │
└───────────┼─────────────────────────┼────────────────┘
            │                         │
   ┌────────┴────────┬────────┬───────┴──────┐
   ▼                 ▼        ▼              ▼
┌─────────┐   ┌─────────┐ ┌─────────┐ ┌─────────┐
│ABOLAND  │   │MAGVILLA │ │WINELIFE │ │TITEL B  │
│(webshop)│   │(webshop)│ │(webshop)│ │(webshop)│
│         │   │         │ │         │ │         │
│ Eigen   │   │ Eigen   │ │ Eigen   │ │ Eigen   │
│ branding│   │ branding│ │ branding│ │ branding│
│ Eigen   │   │ Eigen   │ │ Eigen   │ │ Eigen   │
│ klanten │   │ klanten │ │ klanten │ │ klanten │
│         │   │         │ │         │ │         │
│ Orders→ │   │ Orders→ │ │ Orders→ │ │ Orders→ │
│ Hub     │   │ Hub     │ │ Hub     │ │ Hub     │
└─────────┘   └─────────┘ └─────────┘ └─────────┘
```

### Hoe het werkt

**1. Producten aanmaken (Multistore Hub)**
Aboland logt in op `beheer.aboland.nl/admin` en maakt producten aan in de master catalogus. Per product selecteert men welke webshops het product ontvangen.

**2. Automatische sync (Hub → webshops)**
Product verschijnt op de geselecteerde webshops — inclusief prijs, voorraad, beschrijving en afbeeldingen.

**3. Klant bestelt (webshop)**
De klant bezoekt bijv. de WINELIFE-webshop, ziet de producten, en plaatst een bestelling.

**4. Order sync (webshop → Hub)**
De order wordt doorgestuurd naar het centraal orderdashboard in de Hub.

**5. Fulfillment (Hub)**
Aboland handelt de bestelling af: pick → pack → ship. Status sync terug naar webshop.

**6. Reconciliation (maandelijks)**
Per webshop: omzet, commissie-berekening, afrekenrapportage. Exporteerbaar als PDF.

### Multistore Hub Staffels

| Staffel | Webshops | Prijs | Inbegrepen |
|---------|----------|-------|------------|
| Starter | tot 5 | €79/mo | Hosting, admin, catalogus, orderdashboard, sync, inventory |
| Pro | tot 25 | €149/mo | + geavanceerde rapportage, bulk import/export |
| Business | tot 100 | €249/mo | + API toegang, webhooks, white-label |
| Enterprise | Onbeperkt | Op maat | Op maat |

### Implementatie

> **Multistore is een standaard platformfeature.** Product sync, order aggregation, inventory management, admin dashboards en fulfillment workflows zijn ingebouwd in het Sityzr platform. Geen eenmalige implementatiekosten — alleen de maandelijkse Hub-licentie (zie §5).

---

## 9. Uitgeverslicenties — Aangesloten Titels

Elke titel is een **klant van Aboland** die via het Sityzr platform een eigen online aanwezigheid krijgt met abonnementenbeheer, gekoppeld aan de Multistore Hub en THOR.

### Het model

1. **Aboland** betaalt ons de **wholesale prijs** per titel (bundel + eventuele overschrijding)
2. **Aboland** verkoopt door aan titels met **eigen marge** (retail adviesprijs)
3. **Elke titel** krijgt: eigen website, eigen branding, THOR-koppeling, producten uit de Hub
4. **Volume-korting** beloont Aboland voor het aansluiten van meer titels

### Bundels (wholesale — wat Aboland aan ons betaalt)

#### Titel Light — €45/mo

Geen eigen website. Titelpagina op Aboland.nl portaal.

| Feature | |
|---------|---|
| Titelpagina op Aboland portaal | Content, edities, productlinks |
| THOR koppeling | Abonnementen sync, subscriber status |
| Email via Aboland-flows | Bevestigingen, renewals, winbacks |
| Abonnees | Tot **2.500** actieve abonnees |

#### Titel Starter — €149/mo

Eigen website met abonnementsverkoop via de Multistore Hub.

| Feature | |
|---------|---|
| Eigen website | CMS, page builder, branding, SEO, SSL, hosting, backups |
| E-commerce | Producten via Multistore Hub (abonnementen, losse nummers, pakketten) |
| THOR koppeling | Abonnementen sync, renewal flows, subscriber status, churn alerts |
| Email marketing | 10K emails/mo — transactioneel + campagnes |
| PWA & GDPR | Responsive design, cookie consent, privacy |
| Abonnees | Tot **5.000** actieve abonnees |

#### Titel Compleet — €249/mo

Volledig digitaal uitgeversplatform met content, paywall en marketing.

| Feature | |
|---------|---|
| Alles uit Starter | Website, e-commerce, THOR, email |
| Publishing module | Artikelen, digitale edities, paywall, metered access, auteursbeheer |
| Email marketing uitgebreid | 50K emails/mo — segmentatie, A/B testing, automation flows |
| Search (Meilisearch) | Full-text zoeken in artikelen, edities, producten |
| Analytics dashboard | Lezersgedrag, conversie, subscriber churn, CLV |
| Abonnees | Tot **15.000** actieve abonnees |

#### Titel Pro — €349/mo

Alles-in-één voor grote uitgevers met hoog volume.

| Feature | |
|---------|---|
| Alles uit Compleet | Publishing, search, analytics, 15K abonnees |
| AI Chatbot | Klantenservice, abonnement-vragen, lead-capture |
| Social media publishing | Auto-post nieuwe edities en artikelen |
| Email Pro | 150K emails/mo — geavanceerde flows, dedicated sending |
| Priority support | 4 uur response SLA |
| Abonnees | Tot **50.000** actieve abonnees |

### Abonnees overschrijding

Als een titel meer actieve abonnees heeft dan de bundel toelaat:

| Optie | Toelichting |
|-------|-------------|
| **Upgrade** | Naar de eerstvolgende bundel (aanbevolen) |
| **Overschrijdingstoeslag** | €2/mo per 100 extra abonnees |

### Volume-korting (op wholesale prijs)

| Aantal titels | Korting |
|---------------|--------|
| 1-4 titels | — |
| 5-9 titels | 10% |
| 10-19 titels | 15% |
| 20+ titels | 20% |

### Aboland verkoopadvies (wat Aboland kan rekenen aan titels)

| Bundel | Wholesale (ons) | Retail advies | Marge voor Aboland |
|--------|----------------|---------------|-------------------|
| **Light** | €45/mo | €69-79/mo | €24-34/mo (53-76%) |
| **Starter** | €149/mo | €229-249/mo | €80-100/mo (54-67%) |
| **Compleet** | €249/mo | €399-449/mo | €150-200/mo (60-80%) |
| **Pro** | €349/mo | €549-599/mo | €200-250/mo (57-72%) |

> **Aboland verdient op drie niveaus:**
> 1. **Platformlicentie-marge** — €80-250/mo per titel (zie retail advies)
> 2. **Productverkoop-omzet** — abonnementen/nummers verkocht via titel-webshops, fulfillment via Hub
> 3. **Netflix cross-access** — €24,99/mo cross-access abonnement, 50/50 verdeling op leesgedrag

### Voorbeelden

**WINELIFE** (groot magazine + webshop + marketing)
→ **Titel Compleet** (€249/mo) — Aboland rekent €399/mo → **€150/mo marge** + productverkopen

**Niche-blad** (klein magazine, alleen online content)
→ **Titel Starter** (€149/mo) — Aboland rekent €229/mo → **€80/mo marge**

**Legacy-titel** (geen eigen site, alleen abonnementen via Aboland)
→ **Titel Light** (€45/mo) — Aboland rekent €69/mo → **€24/mo marge**

### Revenue projectie (wat wij ontvangen)

Mix: 15% Light, 40% Starter, 35% Compleet, 10% Pro
Gemiddeld per titel: ~€188/mo

| Scenario | Bruto | Na korting | Per jaar |
|----------|-------|------------|----------|
| 5 titels | €942/mo | €942/mo (—) | €11.304 |
| 10 titels | €1.884/mo | €1.696/mo (10%) | €20.352 |
| 25 titels | €4.710/mo | €4.004/mo (15%) | €48.048 |
| 50 titels | €9.420/mo | €7.536/mo (20%) | €90.432 |

> Dit is de omzet die **wij** ontvangen. Aboland zet hier een opslag op + verdient aan productverkopen via de multistore.

### Vergelijking met markt

Wat een titel nu betaalt als ze het zelf regelen:

| Component | Zelf (DIY) | Via Aboland (retail) |
|-----------|------------|---------------------|
| Website + CMS + hosting | €20-50/mo | Inbegrepen |
| Email marketing | €50-200/mo | Inbegrepen |
| Abonnementenbeheer (custom/THOR) | €100-300/mo | THOR inbegrepen |
| Digitale publishing + paywall | €50-200/mo | Inbegrepen (Compleet+) |
| Payment gateway | €50/mo | Inbegrepen |
| **Totaal** | **€270-800/mo** | **€229-599/mo** |

> De bundels zijn 15-70% goedkoper dan zelf bouwen, met als extra voordeel: kant-en-klare integratie met de Aboland Multistore Hub en THOR.

---

## 10. Social Media Publishing Add-on

Cross-platform social media management, geïntegreerd in het CMS.

### Features

- **Cross-platform posting** — Instagram, Facebook, LinkedIn, X/Twitter, TikTok, Pinterest
- **Content calendar** — Visuele planner met drag & drop
- **Auto-scheduling** — AI-optimized timing per platform
- **Blog → Social** — Automatisch social posts genereren van blogartikelen
- **Product → Social** — Productlancering auto-posten naar alle kanalen
- **Analytics** — Engagement, bereik, groei per platform
- **Approval workflow** — Review & goedkeuring door redactie

### Staffels

| Staffel | Kanalen | Posts/mo | Prijs |
|---------|---------|---------|-------|
| Starter | 3 | 30 | €19/mo |
| Pro | 10 | 100 | €49/mo |
| Business | 25 | 500 | €99/mo |
| Enterprise | Onbeperkt | Onbeperkt | Op maat |

> **Advies Aboland:** Pro (€49/mo) — 10 kanalen dekken Instagram + Facebook + LinkedIn + X voor Aboland + Magvilla.

---

## 11. Advertenties Add-on (Google Ad Manager)

Monetiseer verkeer via advertentieruimte. Volledig geïntegreerd in het CMS — ad zones beheren, rapportage bekijken en opbrengsten volgen, alles vanuit het admin panel. **Geen implementatiekosten** — dit is een standaard platformfeature.

### Hoe het werkt

1. **Ad zones definiëren** — Kies waar advertenties verschijnen (header, sidebar, in-article, footer, interstitial)
2. **Google Ad Manager koppeling** — Automatische sync met GAM voor programmatic, direct deals en eigen campagnes
3. **CMS-integratie** — Redactie kan per pagina/artikel ad zones in/uitschakelen, eigen campagnes promoten
4. **Rapportage** — Impressies, clicks, CTR, revenue per zone, per pagina, per periode — direct in het dashboard

### Staffels

| Tier | Prijs | Pageviews/mo | Inclusief |
|------|-------|-------------|-----------|
| **Advertenties** | €69/mo | Tot 100K | Google Ad Manager integratie, ad zones beheer, display & native ads, basis rapportage |
| **Advertenties Pro** | €129/mo | Onbeperkt | + Programmatic (header bidding), yield optimization, A/B testing ad placements, video ads, revenue dashboard |

### Voor aangesloten titels (wholesale)

| Tier | Wholesale | Retail advies | Marge |
|------|-----------|---------------|-------|
| Advertenties | €39/mo | €69/mo | €30 (77%) |
| Advertenties Pro | €69/mo | €129/mo | €60 (87%) |

> **Waarom dit interessant is voor uitgevers:** Tijdschrift-websites genereren veel traffic (artikelen, edities, content). Advertentie-inkomsten zijn een **extra revenue stream** bovenop abonnementsverkoop. Bij 100K pageviews/mo en een gemiddelde RPM van €5-15 verdient een titel €500-1.500/mo aan ads — ruim meer dan de add-on kost.

---

## 12. Optioneel: Copernica-vervanging

### Optie A: Copernica vervangen (aanbevolen)

Dedicated Listmonk instance voor lifecycle emails. Pricing op email-volume.

| Component | Specificatie | Maandelijks |
|-----------|-------------|-------------|
| Subscriber Lifecycle Email | 500K staffel | €349/mo |
| SMTP (Amazon SES) | ~200-300K emails/mo | ~€25/mo |
| **Totaal lifecycle email** | | **~€374/mo** |

**Huidige Copernica-kosten:** €3.000 - €5.000/mo
**Besparing:** €2.600 - €4.600/mo

**Eenmalige migratie: €3.250**

| Onderdeel | Prijs |
|-----------|-------|
| Dedicated Listmonk server + PostgreSQL | €500 |
| THOR → Listmonk profiel sync worker | €750 |
| Template migratie (Copernica → GrapesJS) | €750 |
| Data migratie (~1M profielen) | €500 |
| Flow-migratie (automatische triggers) | €500 |
| Testing + QA | €250 |

### Optie B: Copernica behouden

Geen migratie. Copernica-kosten blijven (~€3.000-5.000/mo). E-commerce emails via ons.

---

## 13. Klant-specifiek Maatwerk (eenmalig)

### THOR API Integratie — €4.500

- Bidirectionele THOR API koppeling
- Checkout flow + payment links
- Subscription management (upgrade/downgrade)
- Mijn Abonnementen pagina
- THOR-based paywall + metered access
- Accounts registreren in THOR
- Email segmentatie op THOR-data

### Centraal Portaal (Netflix-model) — €2.000

- Cross-tenant search (alle uitgevers)
- Content aggregatie (alle artikelen/edities centraal)
- Centraal serviceportaal

### Verrekensleutel & Rapportage — €1.250

- Leesregistratie per user, per artikel, per uitgever
- Financieel rapportage-engine (50/50 verdeling)
- Uitgever-dashboard

---

## 14. Totaaloverzicht

### Maandelijkse kosten (per site, los gefactureerd)

| Site | Rol | Platform | Publishing | Email | Chat | Totaal |
|------|-----|----------|------------|-------|------|--------|
| **Multistore Hub** | Admin-only beheer | — | — | — | — | **€79/mo** |
| **Aboland** | Webshop | €399 | €99 | €149 | €79 | **€726/mo** |
| **Magvilla** | Webshop | €399 | — | €149 | €79 | **€627/mo** |
| **Subtotaal** | | | | | | **€1.432/mo** |

### Met Copernica-vervanging (Optie A)

| Component | Maandelijks |
|-----------|-------------|
| Multistore Hub — admin-only beheersite | €79/mo |
| Aboland — webshop | €726/mo |
| Magvilla — webshop | €627/mo |
| Subscriber Lifecycle (500K emails, dedicated) | ~€374/mo |
| **Totaal Optie A** | **~€1.806/mo** |

### Zonder Copernica-vervanging (Optie B)

| Component | Maandelijks |
|-----------|-------------|
| Multistore Hub — admin-only beheersite | €79/mo |
| Aboland — webshop | €726/mo |
| Magvilla — webshop | €627/mo |
| Copernica (extern) | €3.000-5.000/mo |
| **Totaal Optie B** | **€4.432-6.432/mo** |

### Eenmalige kosten

| Onderdeel | Optie A | Optie B |
|-----------|---------|---------|
| Setup Aboland (webshop) | €1.350 | €1.350 |
| WooCommerce migratie | €2.350 | €2.350 |
| Redirectplan Aboland | €550 | €550 |
| Setup Magvilla (webshop, incl. migratie + redirects) | €2.050 | €2.050 |
| THOR API integratie | €4.500 | €4.500 |
| Copernica → Listmonk migratie | €3.250 | — |
| Centraal portaal (Netflix-model) | €2.000 | €2.000 |
| Verrekensleutel & rapportage | €1.250 | €1.250 |
| **Totaal eenmalig** | **€17.300** | **€14.050** |

### Jaar 1 vergelijking

| | Optie A | Optie B |
|---|---------|---------|
| Eenmalig | €17.300 | €14.050 |
| Maandelijks (×12) | €21.672 | ~€65.184 |
| **Totaal jaar 1** | **€38.972** | **~€79.234** |
| **Besparing Optie A** | | **~€40.262/jaar** |

### Jaar 2+ (alleen maandelijks)

| | Optie A | Optie B |
|---|---------|---------|
| Per jaar | €21.672 | ~€65.184 |
| **Besparing Optie A per jaar** | | **~€43.512** |

### Totaalplaatje met titels (projectie)

| | Maandelijks |
|---|---|
| Multistore Hub | €79 |
| Aboland (webshop) | €726 |
| Magvilla (webshop) | €627 |
| Lifecycle (optie A) | €374 |
| 10 titels (mix, na 10% korting) | €1.696 |
| **Totaal ecosysteem** | **€3.502/mo** |

> Plus: Aboland verdient mee via productverkopen, licentie-opslag en Netflix-inkomsten.

### Marktprijs vergelijking

| | Marktprijs | Compass Digital (Optie A) | Besparing |
|---|---|---|---|
| Eenmalig (development) | €50.000 - €80.000 | €17.300 | 65-78% |
| Maandelijks (Hub + 2 webshops + email + lifecycle) | €5.000 - €8.000/mo | ~€1.806/mo | 64-77% |
| Per aangesloten titel (bundel) | €270 - €800/mo (DIY) | €149 - €349/mo (wholesale) | 45-81% |

---

## 15. Fasering

| Fase | Wat | Wanneer | Investering |
|------|-----|---------|-------------|
| **Fase 1** | Setup Aboland (webshop) + WooCommerce migratie + THOR API + redirects | Week 1-6 | €8.750 |
| **Fase 2** | Setup Magvilla (webshop) + migratie + redirects | Week 7-9 | €2.050 |
| **Fase 3** | Multistore Hub provisioning (standaard platformfeature) | Week 8-9 | Inbegrepen |
| **Fase 4** | Copernica → Listmonk migratie (indien Optie A) | Week 10-14 | €3.250 |
| **Fase 5** | Centraal portaal + verrekensleutel (zodra 3+ titels) | Week 14-18 | €3.250 |

---

## 16. Wat is inbegrepen (geen extra kosten)

In elke tier, bij elke site:

| Feature | Status |
|---------|--------|
| Multi-tenant architectuur | Klaar |
| Responsive design (mobile-first) | Klaar |
| PWA (installeerbaar, offline fallback) | Klaar |
| Automatische backups (dagelijks) | Klaar |
| SSL certificaten (Let's Encrypt) | Klaar |
| Safe deploy (zero-downtime) | Klaar |
| SEO (meta, schema, OG tags, sitemap) | Klaar |
| Cookie consent & GDPR | Klaar |
| Unified accounts (profiel, adressen, voorkeuren) | Klaar |
| Analytics (RFM, CLV, tracking) | Klaar |

---

## 17. Maatwerk Uurtarieven

| Blok | Uurtarief | Korting |
|------|----------|--------|
| Standaard | €100/uur | — |
| 10 uur | €95/uur | 5% |
| 20 uur | €90/uur | 10% |
| 40 uur | €85/uur | 15% |

---

## 18. Managed Services (optioneel)

| Service | Prijs | Details |
|---------|-------|---------|
| Content Management | €149/mo | 4 uur/maand content updates |
| Priority Support | €99/mo | 4 uur response, Slack/WhatsApp |
| Monthly Optimization | €199/mo | SEO audit, performance review |
