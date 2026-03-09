# Codebase Inconsistentie-Audit

> Datum: 2026-03-09
> Scope: `src/branches/` (ecommerce als referentie)
> Status: Fase 1 (KRITIEK) afgerond op 2026-03-09

---

## Inhoudsopgave

1. [KRITIEK — Security / Functioneel risico](#1-kritiek--security--functioneel-risico)
2. [HOOG — Architecturele inconsistenties](#2-hoog--architecturele-inconsistenties)
3. [MEDIUM — Code-kwaliteit](#3-medium--code-kwaliteit)
4. [LAAG — Nice to fix](#4-laag--nice-to-fix)
5. [Aanbevolen Prioriteit](#5-aanbevolen-prioriteit)

---

## 1. KRITIEK — Security / Functioneel risico

### 1.1 ~~Ontbrekende Access Control (4 collections)~~ OPGELOST

~~Deze collections hebben **geen** `access` property — standaard open voor iedereen:~~

| Collection | Bestand | Status |
|---|---|---|
| `approval-requests` | `src/branches/ecommerce/b2b/collections/approvals/ApprovalRequests.ts` | FIXED |
| `company-accounts` | `src/branches/ecommerce/b2b/collections/company/CompanyAccounts.ts` | FIXED |
| `company-invites` | `src/branches/ecommerce/b2b/collections/company/CompanyInvites.ts` | FIXED |
| `quotes` | `src/branches/ecommerce/b2b/collections/orders/Quotes.ts` | Was al OK (had al access) |

**Fix:** Toevoegen van standaard access pattern:

```typescript
access: {
  read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  delete: ({ req: { user } }) => checkRole(['admin'], user),
}
```

### 1.2 ~~Te ruime delete-permissies (5 collections)~~ OPGELOST

~~Editors kunnen verwijderen waar alleen admins dat zouden moeten:~~

| Collection | Bestand | Status |
|---|---|---|
| `pages` | `src/branches/shared/collections/Pages/index.ts` | FIXED → `checkRole(['admin'])` |
| `blog-posts` | `src/branches/publishing/collections/BlogPosts.ts` | FIXED → `checkRole(['admin'])` |
| `cases` | `src/branches/shared/collections/Cases.ts` | FIXED → `checkRole(['admin'])` |
| `faqs` | `src/branches/shared/collections/FAQs.ts` | FIXED → `checkRole(['admin'])` |
| `testimonials` | `src/branches/shared/collections/Testimonials.ts` | FIXED → `checkRole(['admin'])` |

---

## 2. HOOG — Architecturele inconsistenties

### 2.1 Slug-naamgeving — 3 conventies door elkaar

**Huidige situatie:**

| Conventie | Aantal | Voorbeeld slugs |
|---|---|---|
| **kebab-case** | 58 | `product-categories`, `construction-services`, `blog-posts`, `approval-requests` |
| **camelCase** | 16 | `beautyServices`, `beautyBookings`, `menuItems`, `orderLists` |
| **lowercase (geen separator)** | 1 | `vendorreviews` |

**Collections met verkeerde conventie (moeten kebab-case zijn):**

| Huidig (camelCase) | Moet zijn (kebab-case) | Bestand |
|---|---|---|
| `beautyServices` | `beauty-services` | `src/branches/beauty/collections/BeautyServices.ts` |
| `beautyBookings` | `beauty-bookings` | `src/branches/beauty/collections/BeautyBookings.ts` |
| `stylists` | OK (single word) | `src/branches/beauty/collections/Stylists.ts` |
| `menuItems` | `menu-items` | `src/branches/horeca/collections/MenuItems.ts` |
| `orderLists` | `order-lists` | `src/branches/ecommerce/b2b/collections/orders/OrderLists.ts` |
| `vendorreviews` | `vendor-reviews` | `src/branches/marketplace/collections/VendorReviews.ts` |

**Blocks met inconsistente slugs:**

| Huidig | Moet zijn | Bestand |
|---|---|---|
| `calltoaction` | `call-to-action` | `src/branches/shared/blocks/CallToAction/config.ts` |
| `comparisontable` | `comparison-table` | `src/branches/ecommerce/shared/blocks/ComparisonTable.ts` |
| `productembed` | `product-embed` | `src/branches/ecommerce/shared/blocks/ProductEmbed.ts` |
| `twoColumn` | `two-column` | `src/branches/shared/blocks/TwoColumn/config.ts` |
| `contactForm` | `contact-form` | `src/branches/shared/blocks/ContactFormBlock/config.ts` |
| `mediaBlock` | `media-block` | `src/branches/shared/blocks/MediaBlock/config.ts` |
| `imageGallery` | `image-gallery` | `src/branches/shared/blocks/ImageGallery/config.ts` |
| `logoBar` | `logo-bar` | `src/branches/shared/blocks/LogoBar/config.ts` |
| `formBlock` | `form-block` | `src/branches/shared/blocks/Form/config.ts` |
| `categoryGrid` | `category-grid` | `src/branches/ecommerce/shared/blocks/CategoryGrid.ts` |
| `productGrid` | `product-grid` | `src/branches/ecommerce/shared/blocks/ProductGrid.ts` |
| `quickOrder` | `quick-order` | `src/branches/ecommerce/shared/blocks/QuickOrder.ts` |
| `blog-preview` | OK (already kebab) | `src/branches/shared/blocks/BlogPreview/config.ts` |

> **Let op:** Slug-wijzigingen vereisen database-migraties (blocks slaan slug op in `blockType` kolom).
> Wijzig slugs alleen samen met een migratie-script.

### 2.2 Admin Group naamgeving — Mix Nederlands/Engels

| Nederlands | Engels |
|---|---|
| Systeem | E-commerce |
| Website | Marketing |
| Bestellingen | B2B |
| Klanten | Beauty |
| Abonnementen | Marketplace |
| Loyaliteit | Publishing |
| Bouw | |
| Zorg | |
| Producten | |

**Aanbeveling:** Standaardiseer naar Nederlands (consistent met UI taal):

| Huidig (Engels) | Voorstel (Nederlands) |
|---|---|
| E-commerce | Webshop |
| Marketing | Marketing (OK, leenwoord) |
| B2B | Zakelijk |
| Beauty | Salon |
| Marketplace | Marktplaats |
| Publishing | Publicaties |

### 2.3 Ontbrekende branchMetadata — Horeca

`src/branches/horeca/` heeft **geen** `index.ts` met branchMetadata.
Alle andere 7 branches (beauty, construction, ecommerce, hospitality, marketplace, publishing, shared) hebben dit wel.

**Fix:** Maak `src/branches/horeca/index.ts` aan met:

```typescript
export { default as Events } from './collections/Events'
export { default as Reservations } from './collections/Reservations'
export { default as MenuItems } from './collections/MenuItems'

export const branchMetadata = {
  name: 'horeca',
  displayName: 'Horeca',
  description: 'Template voor restaurants, cafes en eetgelegenheden',
  collections: ['events', 'reservations', 'menuItems'],
  featureFlag: 'ENABLE_HORECA',
  category: 'Industry-Specific',
  version: '1.0.0',
}
```

### 2.4 Versioning/Drafts inconsistentie

Slechts 4 van 60+ collections hebben versioning:

| Collection | maxPerDoc | autosave interval |
|---|---|---|
| `pages` | 10 | default |
| `blog-posts` | 10 | default |
| `beauty-services` | 50 | 100ms |
| `stylists` | 50 | 100ms |

**Ontbreekt bij (zou het wel moeten hebben):**

- `products` — Belangrijkste content type, geen drafts
- `cases` — Publiceerbare content
- `vendors` — Complexe profielen
- `construction-projects` — Portfolio content
- `brands` — Publiceerbare content
- `events` — Publiceerbare content

---

## 3. MEDIUM — Code-kwaliteit

### 3.1 Styling — 5 aanpakken door elkaar

| Aanpak | Waar | Aantal bestanden |
|---|---|---|
| **Tailwind utility classes** | Meeste ecommerce components | ~300+ |
| **Inline `style={{}}`** | Verspreid door hele codebase | 190 bestanden (1414 instances) |
| **BEM + custom CSS** | ProductCard, CrossSellSection, CartLineItemCompact | 6 bestanden |
| **SCSS modules** | Construction branch | 4 bestanden |
| **Gemixed (Tailwind + inline op zelfde element)** | RecentlyViewed, CreateLabelButton, PriceRangeSlider | ~20 bestanden |

**Ergste bestanden (inline + Tailwind mixed):**

| Bestand | Probleem |
|---|---|
| `ecommerce/shared/components/shop/RecentlyViewed/RecentlyViewed.tsx` | 5+ inline style blocks gemixed met Tailwind |
| `ecommerce/shared/components/admin/OrderShipping/CreateLabelButton.tsx` | Hardcoded hex colors (`#059669`, `#0a1628`) in inline styles |
| `ecommerce/shared/components/shop/FilterSidebar/PriceRangeSlider.tsx` | Dynamische positioning + lange Tailwind classes gemixed |

**Standaard zou moeten zijn:**

- Tailwind voor alles (mobile-first: base + `md:` / `lg:`)
- CSS custom properties voor theming via `[var(--color)]` syntax in Tailwind
- Inline styles ALLEEN voor runtime-dynamische waarden (bijv. `left: ${percent}%`)

### 3.2 Slug-generatie — 3 methoden

| Methode | Gebruikt door |
|---|---|
| `autoGenerateSlug` (from `title`) | BlogPosts, Cases |
| `autoGenerateSlugFromName` (from `name`) | ConstructionProjects, Brands, Branches |
| Inline `beforeChange` hook (eigen logica) | BlogCategories, Products |

**Aanbeveling:** Consolideer naar 1 functie die configurable is:

```typescript
autoGenerateSlug({ sourceField: 'title' | 'name' })
```

### 3.3 Component-structuur inconsistenties

| Patroon | Aantal | Waar |
|---|---|---|
| **Standaard** (`ComponentName/Component.tsx` + `types.ts` + `index.ts`) | ~315 | Meeste ecommerce |
| **Alleen `index.tsx`** (geen `Component.tsx` wrapper) | ~14 | Construction, Publishing |
| **Los bestand** (geen eigen directory) | 3 | Ecommerce shared root |

**Losse bestanden die in directory moeten:**

- `src/branches/ecommerce/shared/components/VariantSelector.tsx`
- `src/branches/ecommerce/shared/components/SubscriptionPricingTable.tsx`
- `src/branches/ecommerce/shared/components/RelatedProductsSection.tsx`

### 3.4 Ontbrekende `types.ts` — 69 components

Per categorie:

| Groep | Aantal | Locatie |
|---|---|---|
| Product-types: variable | 15 | `ecommerce/shared/components/product-types/variable/` |
| Product-types: bookable | 7 | `ecommerce/shared/components/product-types/bookable/` |
| Product-types: configurator | 7 | `ecommerce/shared/components/product-types/configurator/` |
| Product-types: mix-match | 7 | `ecommerce/shared/components/product-types/mix-match/` |
| Product-types: personalized | 7 | `ecommerce/shared/components/product-types/personalized/` |
| Product-types: bundle | 6 | `ecommerce/shared/components/product-types/bundle/` |
| Product-types: subscription | 5 | `ecommerce/shared/components/product-types/subscription/` |
| Auth components | 13 | `ecommerce/shared/components/auth/` |
| Overig | 2 | SubcategoryChips, QuickAddToCart |

### 3.5 Import paden — Diepe relative imports

6 bestanden gebruiken `../../../hooks/usePriceMode` in plaats van `@/branches/ecommerce/shared/hooks/usePriceMode`:

- `ecommerce/shared/components/cart/CartLineItemCompact/Component.tsx`
- `ecommerce/shared/components/products/ProductActions/Component.tsx`
- `ecommerce/shared/components/products/ProductCard/Component.tsx`
- `ecommerce/shared/components/products/ProductMeta/Component.tsx`
- `ecommerce/shared/components/ui/OrderSummary/Component.tsx`
- `ecommerce/b2b/components/quick-order/QuickOrderRow/Component.tsx`

### 3.6 `any` type gebruik — 50+ instances

| Bestand | Instances | Aard |
|---|---|---|
| `ecommerce/shared/components/VariantSelector.tsx` | 17 | Props, product casting, option types |
| `ecommerce/shared/lib/stock/reservations.ts` | 14 | Error handling, DB query results |
| `ecommerce/shared/components/orders/NextStepsCTA/Component.tsx` | 2 | Button props |
| Diverse shop components | ~17 | Icon casting (`as any`) |

### 3.7 Onvolledige barrel exports

`ecommerce/shared/components/shop/index.ts` exporteert maar 3 van 8+ componenten:

```
Wel:   CategoryHero, SubcategoryChips, SearchQueryHeader
Mist:  FilterSidebar, SortDropdown, PromotionBanner, BundleDeal, RecentlyViewed
```

---

## 4. LAAG — Nice to fix

### 4.1 SEO auto-fill hooks ontbreken

Alleen BlogPosts en Cases hebben `autoFillSEO`. Mist bij content die SEO nodig heeft:

- Pages
- Products
- Brands
- Branches
- Vendors
- Services
- ConstructionProjects
- Events

### 4.2 Meilisearch indexing inconsistentie

Slechts 3 collections geindexeerd:

| Collection | Status |
|---|---|
| Products | Geindexeerd |
| BlogPosts | Geindexeerd |
| Pages | Geindexeerd |
| Vendors | **Niet geindexeerd** |
| Cases | **Niet geindexeerd** |
| BeautyServices | **Niet geindexeerd** |
| ConstructionProjects | **Niet geindexeerd** |
| Events | **Niet geindexeerd** |

### 4.3 Revalidation hooks ontbreken

Alleen Pages implementeert ISR revalidation hooks (`revalidateOnChange`/`revalidateOnDelete`). Mist bij:

- BlogPosts
- Cases
- Products
- Product Categories
- Vendors

---

## 5. Aanbevolen Prioriteit

### Fase 1 — Nu (security)

- [ ] Access control toevoegen aan 4 B2B collections
- [ ] Delete permissies beperken tot admin-only (5 collections)

### Fase 2 — Korte termijn (architectuur)

- [ ] Slug conventie standaardiseren naar kebab-case (+ migraties)
- [ ] Admin groups standaardiseren (Nederlands)
- [ ] Horeca branch index.ts toevoegen
- [ ] Versioning toevoegen aan Products, Cases, Vendors

### Fase 3 — Geleidelijk (code-kwaliteit)

- [ ] Inline styles migreren naar Tailwind (190 bestanden)
- [ ] types.ts toevoegen aan 69 components
- [ ] Relative imports vervangen door @/ alias (6 bestanden)
- [ ] `any` types vervangen door proper types (50+ instances)
- [ ] Slug-generatie consolideren naar 1 configureerbare functie
- [ ] Barrel exports completeren

### Fase 4 — Bij aanraking (nice to have)

- [ ] autoFillSEO hook toevoegen aan content collections
- [ ] Meilisearch indexing uitbreiden
- [ ] ISR revalidation hooks toevoegen
- [ ] Component structuur normaliseren (3 losse bestanden → directory)
