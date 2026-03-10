# Pricing Voorstel: Simplificatie naar 3 Tiers + Add-ons

**Datum:** 10 maart 2026
**Status:** Voorstel — ter bespreking

---

## Aanleiding

De huidige pricing heeft 8 licentieniveaus (€49-€179/mo) per branche. Dit leidt tot:
- Keuzestress bij prospects
- Complexe ENV-configuratie per deployment (70+ feature flags)
- Klanten die op lage tiers instappen en zelden upgraden
- Onduidelijkheid over wat wel/niet inbegrepen is

**Doel:** Versimpelen naar 3 herkenbare tiers waar features via de admin UI (e-commerce settings) aan/uit gezet worden, in plaats van per-deployment ENV variabelen.

---

## Nieuwe structuur: 3 Tiers

### Tier 1: Website — €79/mo

**Doelgroep:** Dienstverleners, bureaus, portfoliosites, publishers — geen webshop nodig.

**Inbegrepen:**
- Platform (Pages, Media, Users, Forms, Redirects)
- Blog & Content (Blog Posts, Categories, Cases, Testimonials, Partners, Services)
- Alle branche-templates (Construction, Hospitality, Beauty, Horeca, Experiences, Tourism, Real Estate, Professional Services)
- Publishing (Magazines, Editions, Digital Library, Paywall)
- SEO (meta tags, sitemap, robots.txt, canonical URLs)
- Meilisearch (zoekfunctionaliteit)
- Cookie consent & GDPR
- Themes & branding
- PWA (installeerbaar, offline fallback)

**Niet inbegrepen:** E-commerce functies (producten, cart, checkout, orders)

---

### Tier 2: B2C — €149/mo

**Doelgroep:** Webshops, online retailers, abonnementsplatformen, marktplaatsen.

**Inbegrepen — alles uit Website-tier plus:**

| Categorie | Features |
|-----------|----------|
| **Catalogus** | Products, Categories, Brands, Branches, Variable/Bundle/Configurator/Personalized products |
| **Winkelwagen** | Cart, Mini-cart, Free shipping bar |
| **Checkout** | Guest checkout, Invoices (PDF), Order tracking, Discount codes, Promotions |
| **Mijn Account** | Orders, Returns, Recurring Orders, Order Lists, Notifications, Addresses |
| **Reviews & Wishlists** | Product Reviews, Wishlists, Recently Viewed |
| **Loyalty** | Tiers, Points, Rewards, Transactions |
| **Subscriptions** | Subscription Plans, User Subscriptions, Payment Methods |
| **Cadeaubonnen** | Gift Vouchers |
| **Licenties** | Licenses, License Activations |
| **Marketplace** | Vendors, Vendor Reviews, Workshops |
| **A/B Testing** | A/B Tests, Results |
| **Betalingen** | Stripe, Mollie, MultiSafepay — geen transactiekosten van ons |

**Alle features individueel aan/uit te zetten via E-commerce Settings in /admin/.**

---

### Tier 3: B2B — €299/mo

**Doelgroep:** Groothandels, leveranciers, B2B platforms, multi-company omgevingen.

**Inbegrepen — alles uit B2C-tier plus:**

| Categorie | Features |
|-----------|----------|
| **Klantgroepen** | Customer Groups, Group Pricing, Volume Pricing |
| **Bedrijfsaccounts** | Company Accounts, Company Invites, Approval Workflow |
| **B2B Checkout** | Quote Requests, Budget Limits, Credit Limits, MOQ |
| **Efficiëntie** | Barcode Scanner, Quick Order (bulk op artikelnummer) |
| **Recurring** | Recurring Orders met planning |

---

## Add-ons (ongewijzigd — externe kosten)

### Email Marketing (eigen platform — Listmonk + GrapesJS)

| Tier | Subscribers | Emails/mo | Prijs |
|------|------------|-----------|-------|
| Starter | 1.000 | 5.000 | €29/mo |
| Groei | 5.000 | 30.000 | €79/mo |
| Pro | 10.000 | 100.000 | €149/mo |
| Business | 25.000 | 500.000 | €299/mo |
| Enterprise | Onbeperkt | Onbeperkt | Op maat |

Overschrijding: €0.40-€1.00 per 1.000 emails (afhankelijk van tier).

### AI Chatbot (RAG-based)

| Tier | Chats/mo | Prijs |
|------|---------|-------|
| Light | 1.000 | €39/mo |
| Standard | 5.000 | €79/mo |
| Pro | 20.000 | €149/mo |
| Enterprise | Onbeperkt | Op maat |

### AI Content Generatie

| Tier | Generaties/mo | Prijs |
|------|--------------|-------|
| Basis | 200 | €49/mo |
| Pro | 1.000 | €99/mo |
| Unlimited | Onbeperkt | €199/mo |

### Overige Add-ons

| Add-on | Prijs |
|--------|-------|
| Multilingual | €29/mo |
| SMS Notificaties | €19/mo (200 SMS incl., daarna €0.08/SMS) |

---

## Setup fees

| Type | Eenmalig |
|------|----------|
| Website (nieuw) | €1.500 - €3.000 |
| B2C (nieuw) | €2.500 - €5.000 |
| B2B (nieuw) | €5.000 - €8.000 |
| Migratie WordPress (klein) | €800 - €1.500 |
| Migratie WordPress (groot) | €2.000 - €4.000 |
| Migratie WooCommerce (klein) | €1.500 - €2.500 |
| Migratie WooCommerce (groot) | €3.000 - €6.000 |
| Migratie Shopify | €1.200 - €2.500 |
| Migratie Custom/CSV | €500 - €3.000 |

### Maatwerk

| Blok | Uurtarief | Korting |
|------|----------|--------|
| Standaard | €100/uur | — |
| 10 uur | €95/uur | 5% |
| 20 uur | €90/uur | 10% |
| 40 uur | €85/uur | 15% |

---

## Managed Services (optioneel)

| Service | Prijs | Details |
|---------|-------|---------|
| Content Management | €149/mo | 4 uur/maand content updates |
| Priority Support | €99/mo | 4 uur response, Slack/WhatsApp |
| Monthly Optimization | €199/mo | SEO audit, performance review |

---

## Vergelijking met concurrenten

### vs Shopify

| | Shopify | CompassDigital |
|---|---|---|
| B2C basis | €79/mo + apps (€150-400 totaal) | €149/mo all-in |
| B2B | €2.300/mo (Plus) | €299/mo |
| Transactiekosten | 0.5-2% | €0 |
| Email marketing | Extern (Klaviyo €100-400/mo) | Add-on €29-€299/mo |
| Maatwerk | Beperkt (Liquid templates) | Volledig (React/Next.js) |

### vs WooCommerce + Plugin stack

| | WooCommerce | CompassDigital |
|---|---|---|
| Hosting | €30-100/mo | Inbegrepen |
| Plugins (30+) | €150-200/mo | €0 (alles ingebouwd) |
| Email (Mailchimp/Klaviyo) | €100-240/mo | Add-on €29-€299/mo |
| Onderhoud | Zelf (of €100+/mo) | Inbegrepen |
| Updates & security | Zelf | Inbegrepen |
| **Totaal** | **€380-640/mo** | **€149-€299/mo** |

---

## Voorbeeldklanten (nieuw model)

### 1. Kapper / Beauty salon (Website)
```
Setup:        €2.000
Maandelijks:  €79/mo
Jaar 1:       €2.948
Jaar 2+:      €948/jaar
```

### 2. Online webshop B2C
```
Setup:        €4.000
Maandelijks:  €178/mo (€149 B2C + €29 Email Starter)
Jaar 1:       €6.136
Jaar 2+:      €2.136/jaar
```

### 3. B2C + Chatbot + Email marketing
```
Setup:        €4.500
Maandelijks:  €307/mo (€149 B2C + €79 Email Groei + €79 Chatbot Standard)
Jaar 1:       €8.184
Jaar 2+:      €3.684/jaar
```

### 4. B2B Groothandel
```
Setup:        €7.000
Maandelijks:  €407/mo (€299 B2B + €79 Email Groei + €29 Multilingual)
Jaar 1:       €11.884
Jaar 2+:      €4.884/jaar
```

### 5. B2B Enterprise (alles aan)
```
Setup:        €8.000 + 40 uur maatwerk (€3.400)
Maandelijks:  €874/mo (€299 B2B + €149 Email Pro + €149 Chatbot Pro + €99 AI Pro + €29 Multi + €99 Support + €199 Optimalisatie - 15% korting = -€139)
Jaar 1:       €21.888
Jaar 2+:      €10.488/jaar
```

---

## Technische implicatie

### Huidige situatie (complex)
- 70+ ENV variabelen per deployment (`ENABLE_WISHLISTS=true`, `ENABLE_PRODUCT_REVIEWS=false`, etc.)
- Feature flags geëvalueerd bij server start → vereist rebuild/restart bij wijziging
- `shouldHideCollection()` leest ENV → statisch

### Nieuwe situatie (simpel)
- 1 ENV variabele: `LICENSE_TIER=website|b2c|b2b`
- Tier bepaalt welke collecties beschikbaar zijn (plafond)
- Individuele features aan/uit via E-commerce Settings in /admin/ (database)
- Sidebar reageert dynamisch op DB-toggles (al geïmplementeerd)
- Geen rebuild nodig bij feature wijziging

### Implementatiestappen
1. ~~HideCollections component leest e-commerce settings toggles~~ (done)
2. Uitbreiden e-commerce settings met alle feature toggles (niet alleen reviews/wishlists/orderlists)
3. `LICENSE_TIER` ENV introduceren die het plafond bepaalt
4. Bestaande 70+ ENV flags deprecaten
5. Provisioning script aanpassen (alleen tier + add-ons instellen)

---

## Open vragen

1. **Website-tier nodig?** Of alleen B2C en B2B? (Website = €79 is een lage instap maar genereert minder omzet)
2. **Bestaande klanten migreren?** Klanten op €49/mo gaan naar €79 of €149 — communicatiestrategie nodig
3. **Jaarcontracten?** Bijv. 10% korting bij jaarlijkse betaling (€149 → €134/mo)
4. **Multi-store korting?** Bijv. 2e shop -25%, 3e shop -40%
5. **Non-profit/startup korting?** Bijv. eerste 6 maanden -50%
