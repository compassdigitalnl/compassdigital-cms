# Master Implementatieplan: Feature-Aware Field Gating

## Context

Wanneer een client `/admin/collections/products/create` opent, worden ALLE 90+ velden getoond — inclusief B2B-velden, volume pricing, group pricing, etc. — ongeacht welke features zijn ingeschakeld. Collection-level gating (hele collecties verbergen) werkt al, maar **field-level gating ontbreekt**. Dit plan lost dat op.

## Architectuurbeslissing: Server-Side Dynamic Field Inclusion

**Gekozen aanpak: Dynamisch fields opbouwen bij config-time (server-side)**

Waarom:
- `admin.condition` draait client-side in de browser — `process.env` is daar niet beschikbaar
- Het `features` object in `src/lib/features.ts` is al een statisch object met booleans, geëvalueerd bij server start
- Fields die niet in de config staan verschijnen niet in de admin UI en accepteren geen data
- Dit patroon wordt al gebruikt: `Users/index.ts` spreidt conditioneel velden (regels 290-308)

---

## Feature Hiërarchie (ter referentie)

```
shop (parent) → volumePricing, compareProducts, quickOrder, recentlyViewed, brands, productReviews
cart (parent) → miniCart, freeShippingBar
checkout (parent) → guestCheckout, invoices, orderTracking
myAccount (parent) → returns, recurringOrders, orderLists, addresses, accountInvoices, notifications
b2b (parent) → customerGroups, groupPricing, barcodeScanner
vendors (parent) → vendorReviews, workshops
subscriptions (standalone)
giftVouchers (standalone)
licenses (standalone)
loyalty (standalone)
blog, faq, testimonials, cases, partners, services, wishlists (standalone)
multiLanguage, aiContent, search, newsletter, authentication (standalone)
```

---

## Fase 0: Core Infrastructure — Helper Functions

**Nieuw bestand: `src/lib/featureFields.ts`**

Utility functies voor conditioneel opnemen van fields en tabs in collection configs:

```typescript
import { features } from './features'
import type { Field, Tab } from 'payload'

/**
 * Conditioneel een enkel veld opnemen op basis van een feature flag.
 * Retourneert het veld als de feature enabled is, anders een lege array.
 *
 * Gebruik (in een spread context):
 *   ...featureField('b2b', { name: 'minOrderQuantity', type: 'number', ... })
 */
export function featureField(
  featureKey: keyof typeof features,
  field: Field,
): Field[] {
  return features[featureKey] ? [field] : []
}

/**
 * Conditioneel meerdere velden opnemen op basis van een feature flag.
 * Retourneert de velden array als de feature enabled is, anders een lege array.
 */
export function featureFields(
  featureKey: keyof typeof features,
  fields: Field[],
): Field[] {
  return features[featureKey] ? fields : []
}

/**
 * Conditioneel een hele tab opnemen op basis van een feature flag.
 * Retourneert de tab in een array als enabled, anders een lege array.
 *
 * Gebruik:
 *   tabs: [
 *     basisInfoTab,
 *     ...featureTab('b2b', { label: 'B2B', fields: [...] }),
 *   ]
 */
export function featureTab(
  featureKey: keyof typeof features,
  tab: Tab,
): Tab[] {
  return features[featureKey] ? [tab] : []
}

/**
 * Sub-feature: vereist BEIDE parent EN child feature enabled.
 * Voor sub-features die alleen verschijnen wanneer beide flags aan staan.
 *
 * Gebruik:
 *   ...subFeatureFields('b2b', 'groupPricing', [groupPricesField])
 */
export function subFeatureFields(
  parentKey: keyof typeof features,
  childKey: keyof typeof features,
  fields: Field[],
): Field[] {
  return (features[parentKey] && features[childKey]) ? fields : []
}
```

**Gebruik in collection configs:**
```typescript
import { featureField, featureFields, featureTab, subFeatureFields } from '@/lib/featureFields'
import { features } from '@/lib/features'

// Enkel veld gaten:
fields: [
  ...featureField('brands', { name: 'brand', type: 'relationship', relationTo: 'brands' }),
]

// Meerdere velden gaten:
fields: [
  ...featureFields('b2b', [
    { name: 'minOrderQuantity', type: 'number' },
    { name: 'maxOrderQuantity', type: 'number' },
  ]),
]

// Hele tab gaten:
tabs: [
  basisInfoTab,
  ...featureTab('b2b', { label: 'B2B', fields: [...] }),
]

// Sub-feature (parent + child):
fields: [
  ...subFeatureFields('b2b', 'groupPricing', [groupPricesCollapsible]),
]
```

---

## Fase 1: Products Collection Field Gating (Hoogste Prioriteit)

**Bestand: `src/collections/Products.ts`**

### 1a. Tab 1 (Basis Info) — Gate `brand` veld
- Het `brand` relationship veld verwijst naar de `brands` collectie
- Wanneer `ENABLE_BRANDS=false` moet dit veld verborgen worden
- Het `manufacturer` veld in dezelfde row wordt dan 100% breed

**Wijziging:**
```typescript
// Brand & Manufacturer row
{
  type: 'row',
  fields: [
    ...featureField('brands', {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      label: 'Merk',
      admin: {
        width: features.brands ? '50%' : undefined,
        description: 'Bijv: Hartmann, BSN Medical, 3M',
      },
    }),
    {
      name: 'manufacturer',
      type: 'text',
      label: 'Fabrikant',
      admin: {
        width: features.brands ? '50%' : '100%',
        description: 'Als afwijkend van merk',
      },
    },
  ],
},
```

### 1b. Tab 2 (Prijzen) — Gate pricing secties
- **Klantengroep Prijzen (B2B)** collapsible → `subFeatureFields('b2b', 'groupPricing', [...])`
- **Staffelprijzen (Volume)** collapsible → `featureFields('volumePricing', [...])`

**Wijziging:** Wrap de bestaande collapsible fields:
```typescript
{
  label: 'Prijzen',
  fields: [
    // ... core price fields (price, salePrice, compareAtPrice, costPrice, msrp, taxClass) blijven ongewijzigd ...

    // Klantengroep Prijzen — gated by b2b + groupPricing
    ...subFeatureFields('b2b', 'groupPricing', [
      {
        type: 'collapsible',
        label: 'Klantengroep Prijzen (B2B)',
        admin: { initCollapsed: true },
        fields: [
          { name: 'groupPrices', type: 'array', /* bestaande definitie */ },
        ],
      },
    ]),

    // Staffelprijzen — gated by volumePricing
    ...featureFields('volumePricing', [
      {
        type: 'collapsible',
        label: 'Staffelprijzen (Volume)',
        admin: { initCollapsed: true },
        fields: [
          { name: 'volumePricing', type: 'array', /* bestaande definitie */ },
        ],
      },
    ]),
  ],
},
```

### 1c. Tab 7 (B2B) — Gate hele tab
- Alle 7 B2B velden (minOrderQuantity, maxOrderQuantity, orderMultiple, leadTime, customizable, quotationRequired, contractPricing) verbergen wanneer `ENABLE_B2B=false`

**Wijziging:**
```typescript
// In de tabs array:
tabs: [
  basisInfoTab,
  prijzenTab,
  voorraadTab,
  verzendingTab,
  mediaTab,
  gegroepeerdeProductenTab,
  // B2B tab — conditioneel
  ...featureTab('b2b', {
    label: 'B2B',
    description: 'B2B instellingen (MOQ, levertijd, offertes)',
    fields: [
      // ... alle bestaande B2B velden ...
    ],
  }),
  seoTab,
  specificatiesTab,
  gerelateerdTab,
]
```

### Mapping overzicht Products:

| Veld/Sectie | Feature Flag | Tab | Actie |
|---|---|---|---|
| `brand` relationship | `brands` | Tab 1 (Basis) | `...featureField('brands', ...)` |
| `groupPrices` collapsible | `b2b` + `groupPricing` | Tab 2 (Prijzen) | `...subFeatureFields(...)` |
| `volumePricing` collapsible | `volumePricing` | Tab 2 (Prijzen) | `...featureFields(...)` |
| Hele B2B tab (7 velden) | `b2b` | Tab 7 | `...featureTab('b2b', ...)` |

---

## Fase 2: Fix Collection-Level Gating (25 collecties)

Veel collecties gebruiken `shouldHideOnPlatform()` (verbergt alleen op platform CMS) terwijl ze `shouldHideCollection('featureKey')` moeten gebruiken (verbergt OOK op client wanneer feature uit staat).

**Belangrijk:** `shouldHideCollection()` doet BEIDE:
1. Verbergt op Platform CMS (altijd)
2. Verbergt op client deployment wanneer feature uit staat

### Te wijzigen collecties:

| Bestand | Huidige code | Wijzig naar |
|---|---|---|
| `src/collections/Products.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('shop')` |
| `src/collections/shop/ProductCategories.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('shop')` |
| `src/collections/BlogPosts.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('blog')` |
| `src/collections/BlogCategories.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('blog')` |
| `src/collections/FAQs.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('faq')` |
| `src/collections/Testimonials.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('testimonials')` |
| `src/collections/Cases.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('cases')` |
| `src/collections/Orders.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('checkout')` |
| `src/collections/Invoices.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('invoices')` |
| `src/collections/Returns.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('returns')` |
| `src/collections/RecurringOrders.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('recurringOrders')` |
| `src/collections/OrderLists.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('orderLists')` |
| `src/collections/RecentlyViewed.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('recentlyViewed')` |
| `src/collections/shop/CustomerGroups.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('customerGroups')` |
| `src/collections/SubscriptionPlans.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('subscriptions')` |
| `src/collections/UserSubscriptions.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('subscriptions')` |
| `src/collections/PaymentMethods.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('subscriptions')` |
| `src/collections/GiftVouchers.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('giftVouchers')` |
| `src/collections/Licenses.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('licenses')` |
| `src/collections/LicenseActivations.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('licenses')` |
| `src/collections/LoyaltyTiers.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('loyalty')` |
| `src/collections/LoyaltyRewards.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('loyalty')` |
| `src/collections/LoyaltyPoints.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('loyalty')` |
| `src/collections/LoyaltyTransactions.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('loyalty')` |
| `src/collections/LoyaltyRedemptions.ts` | `shouldHideOnPlatform()` | `shouldHideCollection('loyalty')` |

**Al correct** (geen wijziging nodig): Brands, Vendors, VendorReviews, Workshops, Services, Partners

**Per bestand ook de import wijzigen:**
```typescript
// Van:
import { shouldHideOnPlatform } from '@/lib/shouldHideCollection'
// Naar:
import { shouldHideCollection } from '@/lib/shouldHideCollection'
```

---

## Fase 3: Cross-Collection Field Gating

### 3a. Users Collection (`src/collections/Users/index.ts`)

| Veld | Feature | Reden |
|---|---|---|
| `accountType` select (B2B optie) | `b2b` | B2B account type alleen bij B2B enabled |
| `company` group (KVK, BTW, invoice email, etc.) | `b2b` | Bedrijfsgegevens alleen bij B2B |
| `favorites` array | `wishlists` | Favorieten alleen bij wishlists |

**Wijziging:** Gebruik het bestaande spread-patroon dat al in dit bestand voorkomt (regels 290-308):
```typescript
// accountType — alleen B2B optie tonen wanneer b2b enabled
...featureFields('b2b', [{
  name: 'accountType',
  type: 'select',
  options: [
    { label: 'Particulier', value: 'individual' },
    { label: 'B2B Zakelijk', value: 'b2b' },
  ],
}]),

// company group — alleen bij B2B
...featureFields('b2b', [{
  name: 'company',
  type: 'group',
  // ... bestaande company velden ...
}]),

// favorites — alleen bij wishlists
...featureFields('wishlists', [{
  name: 'favorites',
  type: 'array',
  // ... bestaande favorites definitie ...
}]),
```

### 3b. Orders Collection (`src/collections/Orders.ts`)

| Veld | Feature | Reden |
|---|---|---|
| `invoicePDF`, `invoiceNumber` | `invoices` | Factuur velden alleen bij invoices enabled |
| `trackingCode`, `trackingUrl` | `orderTracking` | Tracking velden alleen bij order tracking |
| Timeline array | `orderTracking` | Tracking timeline |

### 3c. BlogPosts Collection (`src/collections/BlogPosts.ts`)

| Veld | Feature | Reden |
|---|---|---|
| `relatedProducts` relationship | `shop` | Product referenties alleen bij shop enabled |

### 3d. Notifications Collection (`src/collections/Notifications.ts`)

| Veld | Feature | Reden |
|---|---|---|
| `relatedInvoice` | `invoices` | Factuur referentie |
| `relatedRecurringOrder` | `recurringOrders` | Herhaalde bestelling referentie |
| `relatedReturn` | `returns` | Retour referentie |
| Type opties (invoice_available, etc.) | `invoices` | Filter select opties |
| Type opties (recurring_order_*) | `recurringOrders` | Filter select opties |
| Type opties (return_*) | `returns` | Filter select opties |

---

## Fase 4: Globals Field Gating

### 4a. Settings Global (`src/globals/Settings.ts`)

**Template selectors (Tab 5) — conditioneel per feature:**

| Template selector | Feature | Actie |
|---|---|---|
| `defaultProductTemplate` | `shop` | `...featureField('shop', ...)` |
| `defaultBlogTemplate` | `blog` | `...featureField('blog', ...)` |
| `defaultShopArchiveTemplate` | `shop` | `...featureField('shop', ...)` |
| `defaultCartTemplate` | `cart` | `...featureField('cart', ...)` |
| `defaultCheckoutTemplate` | `checkout` | `...featureField('checkout', ...)` |
| `defaultMyAccountTemplate` | `myAccount` | `...featureField('myAccount', ...)` |

**Hele tabs gaten:**

| Tab | Feature | Actie |
|---|---|---|
| E-commerce tab | `shop` | `...featureTab('shop', ...)` |
| B2B Instellingen tab | `b2b` | `...featureTab('b2b', ...)` |

**Functies tab — individuele toggles gaten:**

| Toggle | Feature | Reden |
|---|---|---|
| `enableQuickOrder` | `shop` | Shop sub-feature |
| `enableOrderLists` | `myAccount` | Account sub-feature |
| `enableReviews` | `shop` | Shop sub-feature |
| `enableWishlist` | `wishlists` | Wishlists feature |
| `enableStockNotifications` | `shop` | Shop feature |

### 4b. Header Global (`src/globals/Header.ts`)

| Veld | Feature | Reden |
|---|---|---|
| `showWishlist` checkbox | `wishlists` | Wishlist icoon in header |
| `showCart` checkbox | `cart` | Winkelwagen icoon in header |
| `showAccount` checkbox | `authentication` | Account icoon in header |
| `enableSearch` checkbox | `search` | Zoekbalk in header |

---

## Fase 5: Template Adaptaties

**Aanbeveling: Templates hoeven NIET gefilterd te worden.**

Templates checken intern het `features` object bij render-time om secties te tonen/verbergen. Alle templates blijven beschikbaar in de selector. Dit is de eenvoudigste en meest flexibele aanpak.

---

## Implementatievolgorde & Commits

```
Fase 0 (featureFields.ts)  ─┐
                             ├──> Commit 1: "feat: feature-aware field gating infrastructure + Products + collection gating"
Fase 1 (Products)  ──────────┤
Fase 2 (Collection gating)  ─┘

Fase 3 (Cross-collection)  ──┐
                              ├──> Commit 2: "feat: feature-aware field gating for Users, Orders, Notifications + Globals"
Fase 4 (Globals)  ────────────┘

Fase 5 (Templates)  ──────────> Optioneel / Later
```

---

## Belangrijke Edge Cases

1. **Bestaande data behouden**: Uitgeschakelde feature-velden worden alleen verborgen in de UI. Data blijft in de database. Bij herinschakeling verschijnt alles weer. Geen migratie nodig.

2. **API access**: Velden die niet in de config staan zijn ook niet via REST/GraphQL API beschikbaar. Frontend code moet ook features checken.

3. **Row layout aanpassing**: Bij het weglaten van een veld uit een `type: 'row'`, moeten de resterende velden hun breedtes aanpassen (bijv. manufacturer gaat van 50% naar 100% wanneer brand wegvalt).

4. **Features object is statisch**: Het wordt eenmalig geëvalueerd bij server start vanuit ENV vars. Wijzigingen in ENV vereisen een server restart (dit is bestaand gedrag).

5. **NIET `admin.condition` gebruiken voor feature gating**: `admin.condition` draait client-side en heeft geen toegang tot `process.env`. Gebruik het alleen voor data-afhankelijke condities (toon veld X wanneer veld Y waarde Z heeft), niet voor feature flags.

6. **TypeScript types**: Wanneer features uit staan, worden de gegenereerde `payload-types.ts` types anders per deployment. Dit is acceptabel omdat elke deployment zijn eigen build heeft.

---

## Verificatie & Testing

Test met verschillende ENV combinaties:

| Test Scenario | ENV Settings | Verwacht Resultaat |
|---|---|---|
| Alles aan (default) | Alle features enabled | Alle 10 product tabs, alle velden zichtbaar |
| Shop only, geen B2B | `ENABLE_B2B=false` | Product: geen B2B tab, geen groupPrices, geen MOQ velden |
| Geen volume pricing | `ENABLE_VOLUME_PRICING=false` | Product: geen staffelprijzen in Prijzen tab |
| Geen brands | `ENABLE_BRANDS=false` | Product: geen brand veld, Brands collectie verborgen |
| Content-only site | `ENABLE_SHOP=false` | Geen Products, Orders, ProductCategories, etc. |
| Minimale setup | Meerdere features uit | Alleen enabled velden/tabs zichtbaar |

**Per fase verifiëren:**
1. Start CMS met relevante ENV vars op `false`
2. Navigeer naar `/admin/collections/products/create` en check:
   - Uitgeschakelde feature tabs zijn niet zichtbaar
   - Uitgeschakelde feature velden zijn niet zichtbaar
   - Core velden (title, slug, price, stock) zijn altijd zichtbaar
   - Geen console errors of layout breaks
3. Maak een product aan en verifieer dat opgeslagen data geen disabled feature velden bevat
4. Check dat het platform CMS (`cms.compassdigital.nl`) niet beïnvloed wordt

---

## Referentie: Bestaande Bestanden

| Bestand | Rol |
|---|---|
| `src/lib/features.ts` | Core feature systeem: interface, helpers, env mapping, `features` object |
| `src/lib/featureGuard.ts` | Route protectie: `requireFeature()`, parent-child checks |
| `src/lib/shouldHideCollection.ts` | Collectie zichtbaarheid: `shouldHideCollection()`, `shouldHideOnPlatform()` |
| `src/lib/featureFields.ts` | **NIEUW** — Field-level gating helpers |
| `src/platform/collections/Clients.ts` | Client feature toggles UI (checkboxes in Platform CMS) |
| `src/collections/Products.ts` | Products collectie (90+ velden, 10 tabs) |
| `src/collections/Users/index.ts` | Users collectie (heeft al conditioneel spread patroon) |
| `src/globals/Settings.ts` | Settings global (templates, e-commerce, B2B tabs) |
| `src/globals/Header.ts` | Header global (wishlist, cart, account, search toggles) |
