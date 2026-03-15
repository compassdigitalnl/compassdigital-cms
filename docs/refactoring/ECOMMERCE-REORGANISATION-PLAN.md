# Ecommerce Branch Reorganisatie: B2B / B2C / Shared

> Status: UITGEVOERD (2026-03-09) — Reorganisatie compleet. Alle feature-fasen (1-3) geimplementeerd.
> Datum: 2026-03-07 (bijgewerkt: 2026-03-09)
> Zie ook: [OPENSTAANDE-PUNTEN.md](./OPENSTAANDE-PUNTEN.md) voor de volledige roadmap
> Scope: `src/branches/ecommerce/`

---

## 1. Huidige Situatie

Alles staat plat in `src/branches/ecommerce/` zonder onderscheid tussen B2B- en B2C-functionaliteit:

```
ecommerce/
  blocks/         (7 files)    — CMS blocks
  collections/    (53 files)   — Payload collections
  components/     (565 files)  — UI componenten
  contexts/       (2 files)    — React contexts
  hooks/          (5 files)    — Custom hooks
  lib/            (14 files)   — Utilities
  templates/      (58 files)   — Page templates
```

**Totaal: ~704 bestanden**

---

## 2. Doelstructuur

```
ecommerce/
  shared/                        ← Gedeelde code (beide modellen)
    blocks/
    collections/
    components/
    contexts/
    hooks/
    lib/
    templates/
  b2b/                           ← B2B-specifieke code
    components/
    templates/
    collections/
    blocks/
  b2c/                           ← B2C-specifieke code
    components/
    templates/
    collections/
```

---

## 3. Classificatie per Directory

### 3.1 Components (565 bestanden)

#### SHARED (behouden in `ecommerce/shared/components/`)

| Directory | Files | Reden |
|-----------|-------|-------|
| `checkout/` | 37 | Checkout flow is universeel (AddressForm, CheckoutAuthPanel, PaymentMethodCard, CheckoutProgressStepper, ShippingMethodCard, CheckoutSummary, etc.) |
| `cart/` | 9 | Winkelwagen is universeel (CartLineItemCompact, CrossSellSection, PaymentMethodBadges) |
| `products/` | 51 | Productweergave is universeel (ProductCard, ProductGallery, ProductBadges, ProductMeta, ProductTabs, StockIndicator, BackInStockNotifier, ProductActions, StickyAddToCartBar, ProductCompareBar, ProductSpecsTable) |
| `product-types/` | 120 | Producttype-varianten (bookable, bundle, configurator, mix-match, personalized, subscription, variable) — worden conditioneel geladen op basis van producttype, niet B2B/B2C |
| `shop/` | 26 | Shopfunctionaliteit (FilterSidebar, SortDropdown, CategoryHero, SubcategoryChips, SearchQueryHeader, RecentlyViewed) |
| `orders/` | 28 | Orderbevestiging componenten (SuccessHero, OrderDetailsCard, OrderTimeline, etc.) |
| `auth/` | 33 | Authenticatie is universeel (LoginForm, RegisterForm, OAuthButtons, TrustBadges, etc.) **Uitgezonderd: B2BNotice, KvkLookup → B2B** |
| `ui/` | 26 | Gedeelde UI (AddToCartToast, CartLineItem, CouponInput, FreeShippingProgress, LucideIcon, MiniCart, MiniCartFlyout, OrderSummary) |
| `account/dashboard/` | ~15 | Dashboard is universeel |
| `account/orders/` | ~20 | Orderoverzicht is universeel |
| `account/addresses/` | ~10 | Adressen beheren is universeel |
| `account/settings/` | ~8 | Instellingen is universeel |
| `account/invoices/` | ~12 | Facturen is universeel |
| `account/retour/` | ~10 | Retouren is universeel |
| `account/subscriptions/` | ~10 | Abonnementen is universeel |
| `account/ui/` | ~8 | Gedeelde account UI componenten |

**Totaal shared components: ~423 bestanden**

#### B2B (verplaatsen naar `ecommerce/b2b/components/`)

| Directory | Files | Reden |
|-----------|-------|-------|
| `quick-order/` | 16 | Snel bestellen met CSV upload — puur B2B |
| `quote/` | 13 | Offerte-aanvraag flow — puur B2B |
| `registration/` | 19 | B2B registratie (BranchSelector, KVK, etc.) |
| `auth/B2BNotice/` | 2 | B2B-specifieke login melding |
| `auth/KvkLookup/` | 2 | KVK zoeken — puur B2B |
| `account/order-lists/` | ~15 | Bestellijsten (herhaald bestellen) — B2B feature |
| `account/quotes/` | ~24 | Offertes beheren (QuoteCard, QuoteDetailHeader, QuoteProductsDetail, QuoteActions, QuoteContactInfo, QuoteForm, QuoteProductTable, QuoteSteps) — B2B feature |
| `account/recurring-orders/` | ~10 | Terugkerende bestellingen — B2B feature |
| `account/licenses/` | ~8 | Licenties beheren — B2B feature |
| `products/StaffelCalculator/` | 3 | Staffelprijzen calculator — B2B feature |
| `products/StaffelHintBanner/` | 3 | Staffelprijs hint — B2B feature |
| `shop/BulkActionBar/` | 2 | Bulk selectie/bestellen — B2B feature |

**Totaal B2B components: ~101 bestanden**

#### B2C (verplaatsen naar `ecommerce/b2c/components/`)

| Directory | Files | Reden |
|-----------|-------|-------|
| `account/favorites/` | ~12 | Favorieten/wishlist — B2C feature |
| `account/gift-cards/` | ~10 | Cadeaubonnen — B2C feature |
| `account/loyalty/` | ~15 | Loyaliteitsprogramma — B2C feature |
| `products/PromoCard/` | 3 | Promotie kaarten — B2C feature |
| `products/ReviewWidget/` | 3 | Product reviews — B2C feature |
| `products/QuickViewModal/` | 3 | Quick view popup — B2C feature |

**Totaal B2C components: ~46 bestanden**

---

### 3.2 Templates (58 bestanden)

#### SHARED

| Directory | Files | Importeurs |
|-----------|-------|-----------|
| `templates/checkout/` | 3 | `app/(ecommerce)/checkout/page.tsx` |
| `templates/cart/` | 3 | `app/(ecommerce)/cart/CartPageClient.tsx` |
| `templates/products/` | 5 | `app/(ecommerce)/[...slug]/page.tsx` |
| `templates/shop/` | 1 | `app/(ecommerce)/shop/page.tsx` |
| `templates/orders/` | 1 | `app/(ecommerce)/order/[id]/OrderConfirmation.tsx` |
| `templates/auth/` | 5 | `app/(ecommerce)/auth/login/page.tsx` |
| `templates/login-register/` | 8 | `app/(ecommerce)/inloggen/page.tsx`, `klant-worden/page.tsx` |
| `templates/account/` → **deels** | ~20 | Account pages — dashboard, orders, addresses, settings, invoices, retour, subscriptions |

#### B2B (verplaatsen naar `ecommerce/b2b/templates/`)

| Template | Files | Reden |
|----------|-------|-------|
| `account/OrderListsTemplate/` | 2 | Bestellijsten — B2B |
| `account/OrderListDetailTemplate/` | 2 | Bestellijst detail — B2B |
| `account/QuotesTemplate/` | 2 | Offerte aanvragen — B2B |
| `account/QuotesListTemplate/` | 2 | Offertes overzicht — B2B |
| `account/QuoteDetailTemplate/` | 2 | Offerte detail — B2B |
| `account/RecurringOrdersTemplate/` | 2 | Terugkerende bestellingen — B2B |
| `account/LicensesTemplate/` | 2 | Licenties — B2B |

#### B2C (verplaatsen naar `ecommerce/b2c/templates/`)

| Template | Files | Reden |
|----------|-------|-------|
| `account/FavoritesTemplate/` | 2 | Favorieten — B2C |
| `account/GiftCardsTemplate/` | 2 | Cadeaubonnen — B2C |
| `account/LoyaltyTemplate/` | 2 | Loyaliteit — B2C |

---

### 3.3 Blocks (7 bestanden)

| Block | Files | Classificatie | Reden |
|-------|-------|--------------|-------|
| `CategoryGrid/` | 2 | **Shared** | Categorieën tonen is universeel |
| `ProductGrid/` | 2 | **Shared** | Product grid is universeel |
| `ProductEmbed/` | 1 | **Shared** | Product embed in blog is universeel |
| `ComparisonTable/` | 1 | **Shared** | Vergelijkingstabel is universeel |
| `QuickOrder/` | 1 | **B2B** | Snel bestellen block |

---

### 3.4 Collections (53 bestanden)

| Collection | Files | Classificatie | Reden |
|------------|-------|--------------|-------|
| `products/` | 21 | **Shared** | Producten zijn universeel |
| `catalog/` | 5 | **Shared** | Categorieën/merken |
| `orders/` | 6 | **Shared** | Bestellingen |
| `checkout/` | 2 | **Shared** | Checkout flow |
| `customers/` | 1 | **Shared** | Klanten |
| `marketing/` | 5 | **Shared** | Kortingscodes, banners |
| `shipping/` | 2 | **Shared** | Verzending |
| `ecommerce-settings/` | 1 | **Shared** | Shop instellingen |
| `subscriptions/` | 3 | **Shared** | Abonnementen |
| `loyalty/` | 5 | **B2C** | Loyaliteitsprogramma |
| `licenses/` | 2 | **B2B** | Licenties |

---

### 3.5 Contexts, Hooks, Lib

| Item | Classificatie | Reden |
|------|--------------|-------|
| `contexts/CartContext.tsx` | **Shared** | Winkelwagen is universeel |
| `contexts/AccountTemplateContext.tsx` | **Shared** | Account layout is universeel |
| `hooks/useEcommerceSettings.ts` | **Shared** | Settings hook |
| `hooks/usePriceMode.ts` | **Shared** | Prijsweergave (incl/excl BTW) — beide modellen |
| `hooks/useProductFilters.ts` | **Shared** | Shopfilters |
| `hooks/useShopSearch.ts` | **Shared** | Zoeken |
| `hooks/notifyEditionSubscribers.ts` | **Shared** | Notificaties |
| `lib/*` | **Shared** | Alle utilities (pricing, stock, shop, etc.) |

---

## 4. Resulterende Mappenstructuur

```
src/branches/ecommerce/
├── shared/
│   ├── blocks/
│   │   ├── CategoryGrid/
│   │   ├── ComparisonTable/
│   │   ├── ProductEmbed/
│   │   └── ProductGrid/
│   ├── collections/
│   │   ├── catalog/
│   │   ├── checkout/
│   │   ├── customers/
│   │   ├── ecommerce-settings/
│   │   ├── marketing/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── shipping/
│   │   └── subscriptions/
│   ├── components/
│   │   ├── account/
│   │   │   ├── addresses/
│   │   │   ├── dashboard/
│   │   │   ├── invoices/
│   │   │   ├── orders/
│   │   │   ├── retour/
│   │   │   ├── settings/
│   │   │   ├── subscriptions/
│   │   │   └── ui/
│   │   ├── auth/           (zonder B2BNotice, KvkLookup)
│   │   ├── cart/
│   │   ├── checkout/       (zonder PONumberInput → B2B)
│   │   ├── orders/
│   │   ├── products/       (zonder Staffel*, PromoCard, ReviewWidget, QuickViewModal)
│   │   ├── product-types/
│   │   ├── shop/           (zonder BulkActionBar)
│   │   └── ui/
│   ├── contexts/
│   │   ├── AccountTemplateContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/
│   │   ├── notifyEditionSubscribers.ts
│   │   ├── useEcommerceSettings.ts
│   │   ├── usePriceMode.ts
│   │   ├── useProductFilters.ts
│   │   └── useShopSearch.ts
│   ├── lib/
│   │   ├── pricing/
│   │   ├── product-types/
│   │   ├── shop/
│   │   ├── stock/
│   │   └── *.ts
│   └── templates/
│       ├── account/
│       │   └── AccountTemplate1/
│       │       ├── AddressesTemplate/
│       │       ├── DashboardTemplate/
│       │       ├── InvoicesTemplate/
│       │       ├── OrderDetailTemplate/
│       │       ├── OrdersTemplate/
│       │       ├── RetourTemplate/
│       │       ├── SettingsTemplate/
│       │       └── SubscriptionsTemplate/
│       ├── auth/
│       ├── cart/
│       ├── checkout/
│       ├── login-register/
│       ├── orders/
│       ├── products/
│       └── shop/
│
├── b2b/
│   ├── blocks/
│   │   └── QuickOrder/
│   ├── collections/
│   │   └── licenses/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── B2BNotice/
│   │   │   └── KvkLookup/
│   │   ├── checkout/
│   │   │   └── PONumberInput/
│   │   ├── account/
│   │   │   ├── licenses/
│   │   │   ├── order-lists/
│   │   │   ├── quotes/
│   │   │   └── recurring-orders/
│   │   ├── products/
│   │   │   ├── StaffelCalculator/
│   │   │   └── StaffelHintBanner/
│   │   ├── quick-order/
│   │   ├── quote/
│   │   ├── registration/
│   │   └── shop/
│   │       └── BulkActionBar/
│   └── templates/
│       └── account/
│           └── AccountTemplate1/
│               ├── LicensesTemplate/
│               ├── OrderListDetailTemplate/
│               ├── OrderListsTemplate/
│               ├── QuotesTemplate/
│               └── RecurringOrdersTemplate/
│
└── b2c/
    ├── collections/
    │   └── loyalty/
    ├── components/
    │   ├── account/
    │   │   ├── favorites/
    │   │   ├── gift-cards/
    │   │   └── loyalty/
    │   └── products/
    │       ├── PromoCard/
    │       ├── QuickViewModal/
    │       └── ReviewWidget/
    └── templates/
        └── account/
            └── AccountTemplate1/
                ├── FavoritesTemplate/
                ├── GiftCardsTemplate/
                └── LoyaltyTemplate/
```

---

## 5. Import-paden Wijzigingen

### Patroon
Alle imports veranderen van:
```
@/branches/ecommerce/components/X  →  @/branches/ecommerce/shared/components/X
@/branches/ecommerce/templates/X   →  @/branches/ecommerce/shared/templates/X
@/branches/ecommerce/contexts/X    →  @/branches/ecommerce/shared/contexts/X
@/branches/ecommerce/hooks/X       →  @/branches/ecommerce/shared/hooks/X
@/branches/ecommerce/lib/X         →  @/branches/ecommerce/shared/lib/X
@/branches/ecommerce/blocks/X      →  @/branches/ecommerce/shared/blocks/X
@/branches/ecommerce/collections/X →  @/branches/ecommerce/shared/collections/X
```

B2B-specifiek:
```
@/branches/ecommerce/components/quick-order/X   →  @/branches/ecommerce/b2b/components/quick-order/X
@/branches/ecommerce/components/quote/X          →  @/branches/ecommerce/b2b/components/quote/X
@/branches/ecommerce/components/registration/X   →  @/branches/ecommerce/b2b/components/registration/X
@/branches/ecommerce/blocks/QuickOrder           →  @/branches/ecommerce/b2b/blocks/QuickOrder
```

B2C-specifiek:
```
@/branches/ecommerce/components/account/favorites/X  →  @/branches/ecommerce/b2c/components/account/favorites/X
@/branches/ecommerce/components/account/loyalty/X     →  @/branches/ecommerce/b2c/components/account/loyalty/X
@/branches/ecommerce/collections/loyalty              →  @/branches/ecommerce/b2c/collections/loyalty
```

### Geschatte Impact

| Wat | Aantal bestanden dat wijzigt |
|-----|------------------------------|
| Interne ecommerce imports (shared ↔ shared) | ~200+ |
| App page imports | ~35 |
| Andere branches (shared/, publishing/) | ~10 |
| payload.config.ts | 1 |
| config-generator.ts | 1 |
| **Totaal geraakt** | **~250+ bestanden** |

---

## 6. Uitvoeringsplan

### Fase 1: Shared verplaatsen (grootste deel)
1. Maak `ecommerce/shared/` directory
2. `git mv` alle shared directories
3. Bulk sed alle imports: `@/branches/ecommerce/` → `@/branches/ecommerce/shared/`
4. Fix specifieke imports die naar B2B/B2C moeten
5. **Build test**

### Fase 2: B2B verplaatsen
1. Maak `ecommerce/b2b/` directory
2. `git mv` B2B-specifieke directories
3. Update alle imports die naar B2B wijzen
4. **Build test**

### Fase 3: B2C verplaatsen
1. Maak `ecommerce/b2c/` directory
2. `git mv` B2C-specifieke directories
3. Update alle imports die naar B2C wijzen
4. **Build test**

### Fase 4: Opruimen & Deploy
1. Verifieer lege directories
2. Commit
3. Deploy naar alle sites
4. Verify

---

## 7. Risico-analyse

| Risico | Impact | Mitigatie |
|--------|--------|----------|
| Verkeerde import-paden | Build failure op alle sites | Per fase builden, niet alles tegelijk |
| Circulaire dependencies | Build failure | B2B/B2C mogen importeren uit shared, NOOIT andersom |
| Vergeten imports | Runtime crash | Grep verificatie na elke fase |
| payload.config.ts broken | CMS start niet | Handmatig verifiëren na collection moves |
| Deploy failure | Sites offline | Safe-deploy rollback |

### Dependency Regel
```
b2b/  →  kan importeren uit  →  shared/
b2c/  →  kan importeren uit  →  shared/
shared/  →  mag NOOIT importeren uit  →  b2b/ of b2c/
b2b/  →  mag NOOIT importeren uit  →  b2c/  (en vice versa)
```

---

## 8. Beslispunten

### Vraag 1: `checkout/PONumberInput` — B2B of Shared?
PONumberInput wordt alleen bij `paymentMethod === 'invoice'` getoond. Invoice-betaling is typisch B2B, maar de component kan ook in een B2C checkout verschijnen als de shop dit toestaat. **Voorstel: B2B** (kan altijd lazy-imported worden vanuit shared checkout als nodig).

### Vraag 2: `auth/B2BNotice` en `auth/KvkLookup` — los trekken uit auth/?
Deze zitten nu in `components/auth/` maar zijn B2B-specifiek. **Voorstel: verplaats naar `b2b/components/auth/`**. De shared auth-componenten importeren ze conditioneel.

### Vraag 3: `product-types/` — B2B of Shared?
Product types (bookable, bundle, configurator, variable, etc.) worden conditioneel geladen op basis van het producttype in de CMS, niet op basis van B2B/B2C. Een B2C-shop kan ook bundels of variable producten hebben. **Voorstel: Shared.**

### Vraag 4: `CrossSellSection` — B2C of Shared?
Cross-selling wordt typisch als B2C-feature gezien, maar kan ook in B2B nuttig zijn ("klanten kochten ook"). **Voorstel: Shared** (laat het in cart/).

### Vraag 5: `marketing/GiftVouchers` — B2C of Shared?
GiftVouchers collectie in `collections/marketing/` is B2C-specifiek (cadeaubonnen). **Voorstel: verplaats naar `b2c/collections/marketing/`.**

### Vraag 6: `account/dashboard/OrderListsWidget` — B2B of Shared?
Het dashboard bevat een OrderListsWidget dat B2B-specifiek is, maar het dashboard zelf is shared. **Voorstel: houd dashboard in shared, laat OrderListsWidget conditioneel renderen op basis van feature flags.** Geen verplaatsing nodig.

### Vraag 7: `account/settings/CompanyForm` — B2B of Shared?
CompanyForm (KVK, BTW, bedrijfsnaam) is B2B-specifiek maar leeft in het shared settings template. **Voorstel: houd in shared, wordt conditioneel getoond.** Geen verplaatsing nodig.

### Vraag 8: `collections/orders/` bevat B2B-collections
De `orders/` collection directory bevat naast `Orders.ts` en `Invoices.ts` (shared) ook: `Quotes.ts`, `OrderLists.ts`, `RecurringOrders.ts` (B2B). **Voorstel: verplaats deze 3 naar `b2b/collections/orders/`.**

### Vraag 9: Wanneer uitvoeren?
Dit raakt 250+ bestanden en kost ~2-3 uur. Na uitvoering moeten ALLE sites opnieuw gebuild/deployed worden. **Voorstel: plan een moment buiten piekuren.**

---

## 9. Collections Detail — Orders Directory Opsplitsing

De `collections/orders/` directory bevat een mix van shared en B2B:

| Collection | Classificatie | Reden |
|------------|--------------|-------|
| `Orders.ts` | **Shared** | Bestellingen |
| `Invoices.ts` | **Shared** | Facturen |
| `Returns.ts` | **Shared** | Retouren |
| `Quotes.ts` | **B2B** | Offertes — verplaatsen naar `b2b/collections/` |
| `OrderLists.ts` | **B2B** | Bestellijsten — verplaatsen naar `b2b/collections/` |
| `RecurringOrders.ts` | **B2B** | Terugkerende bestellingen — verplaatsen naar `b2b/collections/` |

---

## 10. Samenvatting

| Categorie | Bestanden | % van totaal |
|-----------|-----------|-------------|
| **Shared** | ~557 | 79% |
| **B2B** | ~101 | 14% |
| **B2C** | ~46 | 7% |
| **Totaal** | ~704 | 100% |

De reorganisatie maakt duidelijk welke features B2B- of B2C-specifiek zijn en voorkomt dat B2C-klanten B2B-code laden (en vice versa). Het stelt ook in de toekomst in staat om B2B- of B2C-features selectief aan/uit te zetten per site.

---

## 11. Gap Analysis — Ontbrekende Features

### 11.1 Ontbrekend in B2B

| Feature | Prioriteit | Status | Toelichting |
|---------|-----------|--------|-------------|
| **Multi-user bedrijfsaccounts** | Hoog | Ontbreekt | B2B-klanten willen meerdere gebruikers per bedrijf (inkoper, manager, financieel). Nu is het 1 user = 1 account. Geen `CompanyAccount` collectie, geen user-rollen binnen een bedrijf. |
| **Goedkeuringsworkflow** | Hoog | Ontbreekt | Manager moet bestelling goedkeuren voordat deze geplaatst wordt. Essentieel voor B2B met budgetlimieten. Benodigde componenten: `ApprovalQueue`, `ApprovalRequestCard`, `ApprovalModal`. |
| **Budgetlimieten / Bestedingslimiet** | Middel | Ontbreekt | Per gebruiker of per bedrijf een maximumbedrag per maand/kwartaal. Hangt samen met goedkeuringsworkflow. |
| **Klantspecifieke prijzen** | Hoog | Klaar | `calculatePrice.ts` engine met group pricing + volume pricing. `CustomerGroups` collectie gekoppeld aan `Product.groupPrices[]` array. `usePriceMode` hook voor B2B/B2C display. Staffelprijzen met `StaffelCalculator` component. |
| **Kredietlimiet** | Middel | Ontbreekt | B2B-klanten bestellen vaak op rekening met een kredietlimiet. Geen limietcheck bij checkout. Nodig: veld op `Customers`, check in `checkout/create-order`. |
| **Offerte → Order conversie** | Hoog | Klaar | Offertes lijst (`/account/quotes`), detail met accepteren/afwijzen (`/account/quotes/[id]`), API routes voor accept/reject, auto-conversie naar order. Admin vult stuksprijzen + totaalprijs in, klant accepteert digitaal. |
| **"Opnieuw bestellen" knop** | Laag | Klaar | `handleReorder()` in order detail, buttons in OrderDetailHeader + OrderSummaryCard. Gebruikt `CartContext.addGroupedItems()` met toast bevestiging. |
| **Punchout / EDI** | Laag | Ontbreekt | Integratie met ERP-systemen via Punchout (cXML/OCI) of EDI. Enterprise feature, niet urgent voor MKB-klanten. |

### 11.2 Ontbrekend in B2C

| Feature | Prioriteit | Status | Toelichting |
|---------|-----------|--------|-------------|
| **Abandoned cart (verlaten winkelwagen)** | Hoog | Klaar | Cron job `/api/cron/detect-abandoned-carts` detecteert inactieve carts, markeert als 'abandoned', en vuurt `cart.abandoned` event af door automation engine. Togglebaar via E-commerce Settings → Abandoned Cart. Timeout configureerbaar (1-168 uur). |
| **Product Q&A** | Middel | Ontbreekt | Klanten kunnen vragen stellen bij een product (apart van reviews). Nodig: `ProductQuestions` collectie, `QuestionForm` + `QuestionList` componenten. |
| **Social sharing knoppen** | Laag | Ontbreekt | Deel-knoppen op productpagina (WhatsApp, Facebook, e-mail, link kopieren). Eenvoudig component, ~1 bestand. |
| **Maattabel / Size guide** | Middel | Ontbreekt | Relevant voor fashion/beauty branches. Nodig: `SizeGuide` component + veld op productcollectie (rich text of tabel). |
| **Flash sales / countdown timer** | Middel | Ontbreekt | Tijdelijke acties met afteller. `DiscountCodes` collectie bestaat maar heeft geen start/einddatum met visuele countdown. Nodig: `FlashSaleBanner` component, datumvelden op `DiscountCodes`. |
| **Wachtlijst (waitlist)** | Laag | Deels | `BackInStockNotifier` component bestaat voor UI, maar er is geen server-side `Waitlist` collectie of e-mail notificatie bij voorraad-update. |
| **Cadeauverpakking optie** | Laag | Ontbreekt | "Als cadeau inpakken" checkbox bij checkout met optioneel bericht. Nodig: veld in checkout flow + order collectie. |
| **Referral programma** | Laag | Deels | `ReferralSection` component bestaat in loyalty, maar er is geen backend (referral codes genereren, tracking, beloning uitkeren). |

### 11.3 Ontbrekend in beide modellen (Shared)

| Feature | Prioriteit | Status | Toelichting |
|---------|-----------|--------|-------------|
| **PDF factuur generatie** | Hoog | Klaar | `@react-pdf/renderer` geinstalleerd, `InvoiceDocument.tsx` template, `/api/account/invoices/[id]/pdf` endpoint. Auto-generatie bij betaling via `orderStatusHook`. PDF als e-mailbijlage togglebaar. |
| **Transactionele e-mails** | Hoog | Klaar | `orderStatusHook.ts` triggert e-mails bij statuswijziging (paid/shipped/delivered/cancelled/refunded). `sendOrderCancellation()` + `sendRefundConfirmation()` toegevoegd aan EmailService. |
| **Publieke order tracking** | Middel | Klaar | `/track` pagina + `/api/track` API. Zoeken op ordernummer+email, rate limited, privacy-safe (geen prijzen, beperkt adres). |
| **Verzendstatus webhook** | Middel | Klaar | Carrier webhook `/api/webhooks/carrier` ontvangt T&T updates van Sendcloud en MyParcel. Auto-update order status + timeline. HMAC signature verificatie. Togglebaar via E-commerce Settings → Carrier Integratie. |
| **Multi-currency** | Laag | Ontbreekt | Alles is EUR. Geen valuta-selectie of -conversie. Relevant als het platform internationaal wordt. |
| **Multi-language producten** | Laag | Ontbreekt | Product content is single-language. Payload CMS ondersteunt localization maar het is niet geconfigureerd op de producten-collectie. |
| **Voorraad per locatie** | Middel | Ontbreekt | `Branches` collectie bestaat, maar voorraad is niet per vestiging bijgehouden. Relevant voor multi-branch B2B. |
| **Retourlabel generatie** | Middel | Ontbreekt | Retour-flow bestaat (formulier + status), maar er is geen automatische retourlabel-generatie (PostNL/DHL API). |

---

## 12. Prioritering Gap Features bij Reorganisatie

Bij de B2B/B2C reorganisatie is het slim om alvast **placeholder directories** aan te maken voor de hoog-prioriteit features die er nog niet zijn. Dit voorkomt dat ze later op de verkeerde plek worden gebouwd.

### Aan te maken placeholder directories (leeg, met README):

```
ecommerce/b2b/
  components/
    approval-workflow/          ← Goedkeuringsflow (toekomstig)
    company-accounts/           ← Multi-user bedrijfsaccounts (toekomstig)
  collections/
    company-accounts/           ← CompanyAccount collectie (toekomstig)

ecommerce/b2c/
  components/
    product-qa/                 ← Product Q&A (toekomstig)

ecommerce/shared/
  components/
    pdf/                        ← PDF factuur generatie (KLAAR — InvoiceDocument.tsx)
    email-templates/            ← Transactionele e-mail templates (KLAAR — in EmailService.ts)
    tracking/                   ← Publieke order tracking (KLAAR — /track + /api/track)
    carrier-integration/        ← Carrier webhook handler (KLAAR — /api/webhooks/carrier)
  cron/
    detect-abandoned-carts/     ← Abandoned cart detectie (KLAAR — /api/cron/detect-abandoned-carts)
```

Dit maakt de roadmap zichtbaar in de mappenstructuur zelf.
