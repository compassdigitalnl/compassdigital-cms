# Sidebar Reorganisatie - Payload CMS Admin

> **Status:** Voorstel - klaar voor implementatie
> **Datum:** 2026-02-25
> **Impact:** Alleen `admin.group` wijzigingen in ~30 collectie-bestanden + 2 globals. Geen functionele impact.

---

## Huidige Problemen

| Probleem | Detail |
|----------|--------|
| Te veel groepen | 19 sidebar-secties - overweldigend |
| Inconsistente taal | Mix NL/EN: `E-commerce`, `Subscriptions`, `Loyalty Program` vs `Formulieren`, `Instellingen` |
| Dubbele platform groepen | `Platform Beheer` EN `Platform Management` voor dezelfde branch |
| E-commerce te groot | 13 collecties in 1 groep - onvindbaar |
| Micro-groepen | `Gift Vouchers` (1), `Licenses` (2), `Security` (1), `Legal` (1), `Formulieren` (1) |
| Configuration vs Instellingen | Globals verdeeld over 3 groepen (Ontwerp, Instellingen, Configuration) |

---

## Huidige Sidebar Structuur (19 groepen)

### Globals

| Groep | Items |
|-------|-------|
| Ontwerp | Header, Footer, Theme |
| Instellingen | Settings |
| Configuration | MeilisearchSettings, ChatbotSettings |

### Collecties

| Groep | Collecties | Telling |
|-------|------------|---------|
| Systeem | Users | 1 |
| Website | Pages, Media, Blog Posts, Blog Categorieën, FAQs | 5 |
| Marketing | Cases, Testimonials, Partners, Services | 4 |
| E-commerce | Products, Product Categorieën, Brands, Customer Groups, Edition Notifications, Orders, Order Lists, Recurring Orders, Invoices, Returns, A/B Tests, A/B Test Results, Notifications*, Recently Viewed* | 14 |
| Subscriptions | Subscription Plans, User Subscriptions, Payment Methods | 3 |
| Loyalty Program | Loyalty Tiers, Loyalty Rewards, Loyalty Points, Loyalty Transactions, Loyalty Redemptions | 5 |
| Gift Vouchers | Gift Vouchers | 1 |
| Licenses | Licenses, License Activations | 2 |
| Marketplace | Vendors, Vendor Reviews, Workshops | 3 |
| Construction | Construction Services, Projects, Reviews, Quote Requests | 4 |
| Beauty | Beauty Services, Stylists, Beauty Bookings | 3 |
| Horeca | Menu Items, Reservations, Events | 3 |
| Hospitality | Treatments, Practitioners, Appointments | 3 |
| Email Marketing | 9 email marketing collecties | 9 |
| Platform Beheer | Clients, Deployments | 2 |
| Platform Management | Client Requests | 1 |
| Security | API Keys | 1 |
| Legal | Cookie Consents | 1 |
| Formulieren | Form Submissions | 1 |
| Ontwerp (collectie) | Themes | 1 |

_* = hidden collecties_

---

## Nieuwe Sidebar Structuur (16 groepen)

### Globals (bovenaan sidebar)

| Groep | Items | Wijziging |
|-------|-------|-----------|
| **Ontwerp** | Header, Footer, Theme | - |
| **Instellingen** | Settings, MeilisearchSettings, ChatbotSettings | MeilisearchSettings + ChatbotSettings verplaatst van `Configuration` |

### Collecties

| # | Groep | Collecties | Telling | Wijziging |
|---|-------|------------|---------|-----------|
| 1 | **Website** | Pages, Media, Blog Posts, Blog Categorieën, FAQs | 5 | - |
| 2 | **Marketing** | Cases, Testimonials, Partners, Services, A/B Tests, A/B Test Results | 6 | +A/B Tests (was E-commerce) |
| 3 | **Producten** | Products, Product Categorieën, Brands, Customer Groups, Edition Notifications, Gift Vouchers | 6 | Nieuw (split van E-commerce + Gift Vouchers) |
| 4 | **Bestellingen** | Orders, Order Lists, Recurring Orders, Invoices, Returns | 5 | Nieuw (split van E-commerce) |
| 5 | **Abonnementen** | Subscription Plans, User Subscriptions, Payment Methods, Licenses, License Activations | 5 | Merge van Subscriptions + Licenses |
| 6 | **Loyaliteit** | Loyalty Tiers, Loyalty Rewards, Loyalty Points, Loyalty Transactions, Loyalty Redemptions | 5 | Hernoemd van Loyalty Program |
| 7 | **Marketplace** | Vendors, Vendor Reviews, Workshops | 3 | - |
| 8 | **Bouw** | Construction Services, Construction Projects, Construction Reviews, Quote Requests | 4 | Hernoemd van Construction |
| 9 | **Beauty** | Beauty Services, Stylists, Beauty Bookings | 3 | - |
| 10 | **Horeca** | Menu Items, Reservations, Events | 3 | - |
| 11 | **Zorg** | Treatments, Practitioners, Appointments | 3 | Hernoemd van Hospitality |
| 12 | **E-mail Marketing** | Subscribers, Lists, Templates, API Keys, Campaigns, Rules, Flows, Instances, Events | 9 | Hernoemd (spatie + koppelteken) |
| 13 | **Platform** | Clients, Client Requests, Deployments | 3 | Merge van Platform Beheer + Platform Management |
| 14 | **Systeem** | Users, Themes, Form Submissions, Cookie Consents, API Keys, Notifications*, Recently Viewed* | 7 | Merge van Systeem + Formulieren + Security + Legal + Ontwerp(collectie) |

_* = hidden collecties_

---

## Migratietabel per Collectie

Elke rij = 1 bestandswijziging (`admin.group`).

### Globals

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `src/globals/Settings.ts` | `Instellingen` | `Instellingen` |
| `src/globals/Theme.ts` | `Ontwerp` | `Ontwerp` |
| `src/globals/Header.ts` | `Ontwerp` | `Ontwerp` |
| `src/globals/Footer.ts` | `Ontwerp` | `Ontwerp` |
| `src/globals/MeilisearchSettings.ts` | `Configuration` | **`Instellingen`** |
| `src/globals/ChatbotSettings.ts` | `Configuration` | **`Instellingen`** |

### Shared Branch

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/shared/collections/Users.ts` | `Systeem` | `Systeem` |
| `branches/shared/collections/Pages/index.ts` | `Website` | `Website` |
| `branches/shared/collections/Media.ts` | `Website` | `Website` |
| `branches/shared/collections/Partners.ts` | `Marketing` | `Marketing` |
| `branches/shared/collections/ServicesCollection.ts` | `Marketing` | `Marketing` |
| `branches/shared/collections/Notifications.ts` | `E-commerce` | **`Systeem`** |
| `branches/shared/collections/Themes/index.ts` | `Ontwerp` | **`Systeem`** |

### Ecommerce Branch - Producten

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/ecommerce/collections/Products.ts` | `E-commerce` | **`Producten`** |
| `branches/ecommerce/collections/ProductCategories.ts` | `E-commerce` | **`Producten`** |
| `branches/ecommerce/collections/Brands.ts` | `E-commerce` | **`Producten`** |
| `branches/ecommerce/collections/CustomerGroups.ts` | `E-commerce` | **`Producten`** |
| `branches/ecommerce/collections/EditionNotifications.ts` | `E-commerce` | **`Producten`** |
| `branches/ecommerce/collections/GiftVouchers.ts` | `Gift Vouchers` | **`Producten`** |

### Ecommerce Branch - Bestellingen

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/ecommerce/collections/Orders.ts` | `E-commerce` | **`Bestellingen`** |
| `branches/ecommerce/collections/OrderLists.ts` | `E-commerce` | **`Bestellingen`** |
| `branches/ecommerce/collections/RecurringOrders.ts` | `E-commerce` | **`Bestellingen`** |
| `branches/ecommerce/collections/Invoices.ts` | `E-commerce` | **`Bestellingen`** |
| `branches/ecommerce/collections/Returns.ts` | `E-commerce` | **`Bestellingen`** |

### Ecommerce Branch - Abonnementen

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/ecommerce/collections/SubscriptionPlans.ts` | `Subscriptions` | **`Abonnementen`** |
| `branches/ecommerce/collections/UserSubscriptions.ts` | `Subscriptions` | **`Abonnementen`** |
| `branches/ecommerce/collections/PaymentMethods.ts` | `Subscriptions` | **`Abonnementen`** |
| `branches/ecommerce/collections/Licenses.ts` | `Licenses` | **`Abonnementen`** |
| `branches/ecommerce/collections/LicenseActivations.ts` | `Licenses` | **`Abonnementen`** |

### Ecommerce Branch - Loyaliteit

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/ecommerce/collections/LoyaltyTiers.ts` | `Loyalty Program` | **`Loyaliteit`** |
| `branches/ecommerce/collections/LoyaltyRewards.ts` | `Loyalty Program` | **`Loyaliteit`** |
| `branches/ecommerce/collections/LoyaltyPoints.ts` | `Loyalty Program` | **`Loyaliteit`** |
| `branches/ecommerce/collections/LoyaltyTransactions.ts` | `Loyalty Program` | **`Loyaliteit`** |
| `branches/ecommerce/collections/LoyaltyRedemptions.ts` | `Loyalty Program` | **`Loyaliteit`** |

### Ecommerce Branch - Marketing (verplaatst)

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/ecommerce/collections/ABTests.ts` | `E-commerce` | **`Marketing`** |
| `branches/ecommerce/collections/ABTestResults.ts` | `E-commerce` | **`Marketing`** |

### Ecommerce Branch - Systeem (hidden, verplaatst)

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/ecommerce/collections/RecentlyViewed.ts` | `E-commerce` | **`Systeem`** |

### Content Branch

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/content/collections/BlogPosts.ts` | `Website` | `Website` |
| `branches/content/collections/BlogCategories.ts` | `Website` | `Website` |
| `branches/content/collections/FAQs.ts` | `Website` | `Website` |
| `branches/content/collections/Cases.ts` | `Marketing` | `Marketing` |
| `branches/content/collections/Testimonials.ts` | `Marketing` | `Marketing` |

### Construction Branch

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/construction/collections/ConstructionServices.ts` | `Construction` | **`Bouw`** |
| `branches/construction/collections/ConstructionProjects.ts` | `Construction` | **`Bouw`** |
| `branches/construction/collections/ConstructionReviews.ts` | `Construction` | **`Bouw`** |
| `branches/construction/collections/QuoteRequests.ts` | `Construction` | **`Bouw`** |

### Hospitality Branch

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/hospitality/collections/Treatments.ts` | `Hospitality` | **`Zorg`** |
| `branches/hospitality/collections/Practitioners.ts` | `Hospitality` | **`Zorg`** |
| `branches/hospitality/collections/Appointments.ts` | `Hospitality` | **`Zorg`** |

### Email Marketing Branch

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| Alle 9 email marketing collecties | `Email Marketing` | **`E-mail Marketing`** |

### Platform Branch

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| `branches/platform/collections/Clients.ts` | `Platform Beheer` | **`Platform`** |
| `branches/platform/collections/ClientRequests.ts` | `Platform Management` | **`Platform`** |
| `branches/platform/collections/Deployments.ts` | `Platform Beheer` | **`Platform`** |

### Overige (merge naar Systeem)

| Bestand | Huidige group | Nieuwe group |
|---------|---------------|--------------|
| Form Submissions (formBuilderPlugin) | `Formulieren` | **`Systeem`** |
| Cookie Consents | `Legal` | **`Systeem`** |
| API Keys | `Security` | **`Systeem`** |

---

## Typische Client Views

### E-commerce klant (bijv. Aboland01)

```
Ontwerp            → Header, Footer, Theme
Instellingen       → Settings

Website            → Pages, Media, Blog Posts, Blog Categorieën, FAQs
Marketing          → Cases, Testimonials, Partners, Services
Producten          → Products, Categorieën, Brands, Customer Groups
Bestellingen       → Orders, Invoices, Returns
Systeem            → Users
```

### Bouwbedrijf klant (bijv. Construction01)

```
Ontwerp            → Header, Footer, Theme
Instellingen       → Settings

Website            → Pages, Media, FAQs
Marketing          → Cases, Testimonials, Services
Bouw               → Diensten, Projecten, Reviews, Offertes
Systeem            → Users
```

### Beauty salon klant (bijv. Beauty01)

```
Ontwerp            → Header, Footer, Theme
Instellingen       → Settings

Website            → Pages, Media
Marketing          → Testimonials
Beauty             → Services, Stylists, Bookings
Systeem            → Users
```

### Horeca klant (bijv. Horeca01)

```
Ontwerp            → Header, Footer, Theme
Instellingen       → Settings

Website            → Pages, Media, Blog Posts, FAQs
Marketing          → Testimonials, Partners
Horeca             → Menu Items, Reservations, Events
Systeem            → Users
```

---

## Samenvatting Wijzigingen

| Metric | Oud | Nieuw |
|--------|-----|-------|
| Aantal sidebar groepen (globals) | 3 | 2 |
| Aantal sidebar groepen (collecties) | 16+ | 14 |
| Grootste groep | E-commerce (14) | E-mail Marketing (9) |
| Kleinste groep | 6x met 1 item | Marketplace (3) |
| Taalconsistentie | NL + EN mix | 100% Nederlands |
| Bestanden te wijzigen | - | ~35 collecties + 2 globals |
| Functionele impact | - | Geen (alleen sidebar labels) |
