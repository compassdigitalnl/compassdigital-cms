# Codebase Inconsistentie-Audit

> Datum: 2026-03-10 (herzien)
> Scope: Volledige codebase — `src/branches/`, `src/features/`, `src/globals/`
> Status: Fase 1 (KRITIEK) + DB-fixes afgerond

---

## Inhoudsopgave

1. [KRITIEK — Security / DB-integriteit](#1-kritiek--security--db-integriteit)
2. [HOOG — Architecturele inconsistenties](#2-hoog--architecturele-inconsistenties)
3. [MEDIUM — Code-kwaliteit](#3-medium--code-kwaliteit)
4. [LAAG — Nice to fix](#4-laag--nice-to-fix)
5. [Aanbevolen Prioriteit](#5-aanbevolen-prioriteit)

---

## Totaaloverzicht collections

| Branch | Aantal | Alle kebab-case? | Alle access? | Alle delete=admin? |
|--------|--------|------------------|--------------|---------------------|
| shared | 13 | Ja | Ja | 9/13 (Media, Partners, Services: editor delete) |
| ecommerce | 35 | Nee (`orderLists`) | Ja | 30/35 |
| publishing | 1 | Ja | Ja | Ja |
| beauty | 3 | Nee (`beautyBookings`, `beautyServices`) | Ja | Ja |
| construction | 4 | Ja | Ja | Ja |
| horeca | 3 | Nee (`menuItems`) | Ja | Ja |
| hospitality | 3 | Ja | Ja | Ja |
| marketplace | 3 | Ja | Ja | Ja |
| email-marketing | 10 | Ja | Ja | Ja |
| features (pwa/platform) | 2 | Ja | Ja | Ja |
| **Totaal** | **~77** | | | |

---

## 1. KRITIEK — Security / DB-integriteit

### 1.1 ~~Ontbrekende Access Control~~ OPGELOST (2026-03-09)

Alle 77 collections hebben nu access control. Gefixt:
- `approval-requests`, `company-accounts`, `company-invites`

### 1.2 ~~Te ruime delete-permissies~~ OPGELOST (2026-03-09)

Gefixt naar admin-only: `pages`, `blog-posts`, `cases`, `faqs`, `testimonials`

### 1.3 ~~Ontbrekende DB-kolommen~~ OPGELOST (2026-03-10)

Migraties maakten tabellen aan maar vergaten `payload_locked_documents_rels` kolommen:
- `promotions_id`, `email_segments_id`, `push_subscriptions_id` — toegevoegd aan alle 7 DBs + migraties gefixt
- `users_company_approval_roles` subtabel — aangemaakt in alle 7 DBs + migratie gefixt
- `settings.pwa_install_prompt` / `pwa_push_notifications` — migratie aangemaakt

### 1.4 Delete nog steeds open voor editors (3 collections)

| Collection | Bestand | Huidig | Aanbeveling |
|---|---|---|---|
| `media` | `src/branches/shared/collections/Media.ts` | editor kan deleten | OK (media is disposable) |
| `partners` | `src/branches/shared/collections/Partners.ts` | editor kan deleten | Overweeg admin-only |
| `services` | `src/branches/shared/collections/ServicesCollection.ts` | editor kan deleten | Overweeg admin-only |

---

## 2. HOOG — Architecturele inconsistenties

### 2.1 Collection slug-naamgeving — 4 collections nog camelCase

| Huidig (camelCase) | Moet zijn (kebab-case) | Bestand |
|---|---|---|
| `beautyBookings` | `beauty-bookings` | `src/branches/beauty/collections/BeautyBookings.ts` |
| `beautyServices` | `beauty-services` | `src/branches/beauty/collections/BeautyServices.ts` |
| `menuItems` | `menu-items` | `src/branches/horeca/collections/MenuItems.ts` |
| `orderLists` | `order-lists` | `src/branches/ecommerce/b2b/collections/orders/OrderLists.ts` |

> **Let op:** Slug-wijzigingen vereisen database-migraties (tabelnamen, FK-kolommen, payload_locked_documents_rels).

### 2.2 Block slug-naamgeving — 12 blocks inconsistent

| Huidig | Moet zijn | Bestand |
|---|---|---|
| `calltoaction` | `call-to-action` | `shared/blocks/CallToAction/config.ts` |
| `contactForm` | `contact-form` | `shared/blocks/ContactFormBlock/config.ts` |
| `formBlock` | `form-block` | `shared/blocks/Form/config.ts` |
| `imageGallery` | `image-gallery` | `shared/blocks/ImageGallery/config.ts` |
| `infoBox` | `info-box` | `shared/blocks/InfoBox/config.ts` |
| `logoBar` | `logo-bar` | `shared/blocks/LogoBar/config.ts` |
| `mediaBlock` | `media-block` | `shared/blocks/MediaBlock/config.ts` |
| `twocolumn` | `two-column` | `shared/blocks/TwoColumn/config.ts` |
| `categoryGrid` | `category-grid` | `ecommerce/shared/blocks/CategoryGrid.ts` |
| `productGrid` | `product-grid` | `ecommerce/shared/blocks/ProductGrid.ts` |
| `comparisontable` | `comparison-table` | `ecommerce/shared/blocks/ComparisonTable.ts` |
| `productembed` | `product-embed` | `ecommerce/shared/blocks/ProductEmbed.ts` |
| `quickOrder` | `quick-order` | `ecommerce/b2b/blocks/QuickOrder.ts` |

> **Let op:** Block slugs staan opgeslagen in `blockType` kolom in de DB. Wijzig alleen met migratie-script.

### 2.3 Admin Group naamgeving — Mix Nederlands/Engels

| Nederlands | Engels | Features |
|---|---|---|
| Systeem | E-commerce | E-mail Marketing |
| Website | Marketing | |
| Bestellingen | B2B | |
| Klanten | Beauty | |
| Abonnementen | Marketplace | |
| Loyaliteit | Publishing | |
| Bouw | Horeca | |
| Zorg | Platform | |
| Producten | | |
| Instellingen | | |
| Ontwerp | | |

**Aanbeveling:** Standaardiseer naar Nederlands:

| Huidig (Engels) | Voorstel (Nederlands) |
|---|---|
| E-commerce | Webshop |
| Marketing | Marketing (OK, leenwoord) |
| B2B | Zakelijk |
| Beauty | Salon |
| Marketplace | Marktplaats |
| Publishing | Publicaties |
| Horeca | Horeca (OK) |
| Platform | Platform (OK) |
| E-mail Marketing | E-mail Marketing (OK) |

### 2.4 Ontbrekende branchMetadata — Horeca

`src/branches/horeca/` heeft **geen** `index.ts` met branchMetadata.
Alle andere 7 branches hebben dit wel.

### 2.5 Versioning/Drafts inconsistentie

8 collections hebben versioning:

| Collection | maxPerDoc | autosave |
|---|---|---|
| `pages` | 10 | default |
| `blog-posts` | 10 | default |
| `beauty-services` | 50 | 100ms |
| `stylists` | 50 | 100ms |
| `menu-items` | 50 | 375ms |
| `events` | 50 | 375ms |
| `treatments` | 50 | 100ms |
| `practitioners` | 50 | 100ms |

**Ontbreekt bij (publiceerbare content):**

- `products` — Belangrijkste content type
- `cases` — Portfolio content
- `vendors` — Complexe profielen
- `construction-projects` — Portfolio content
- `brands` — Publiceerbare content

### 2.6 Merged/verwijderde collections — Opruimen

Deze collections zijn gemerged maar config-bestanden bestaan nog:

| Oud | Gemerged naar | Status config |
|---|---|---|
| `customers` | `users` | Verwijderd |
| `company-accounts` | `users` (companyOwner) | **Config bestaat nog** |
| `discount-codes` | `promotions` | Verwijderd |
| `loyalty-points` | `users` tabel | Verwijderd |
| `loyalty-redemptions` | `loyalty-transactions` | Verwijderd |
| `forms` | — | Verwijderd |
| `redirects` | — | Verwijderd |

> `company-accounts` config bestaat nog in `src/branches/ecommerce/b2b/collections/company/CompanyAccounts.ts` — controleer of dit nog actief geladen wordt of dode code is.

---

## 3. MEDIUM — Code-kwaliteit

### 3.1 Styling — 5 aanpakken door elkaar

| Aanpak | Waar | Omvang |
|---|---|---|
| **Tailwind utility classes** | Meeste ecommerce components | ~300+ bestanden |
| **Inline `style={{}}`** | Verspreid door hele codebase | 190 bestanden (1414 instances) |
| **BEM + custom CSS** | ProductCard, CrossSellSection, CartLineItemCompact | 6 bestanden |
| **SCSS modules** | Construction branch | 4 bestanden |
| **Gemixed (Tailwind + inline)** | RecentlyViewed, CreateLabelButton, PriceRangeSlider | ~20 bestanden |

**Standaard:** Tailwind voor alles. Inline styles ALLEEN voor runtime-dynamische waarden.

### 3.2 Slug-generatie — 3 methoden

| Methode | Gebruikt door |
|---|---|
| `autoGenerateSlug` (from `title`) | BlogPosts, Cases |
| `autoGenerateSlugFromName` (from `name`) | 12 collections (Brands, Branches, ConstructionProjects, etc.) |
| Inline `beforeChange` hook | BlogCategories, Products |

**Aanbeveling:** Consolideer naar 1 configureerbare functie.

### 3.3 Component-structuur inconsistenties

| Patroon | Aantal | Waar |
|---|---|---|
| **Standaard** (`ComponentName/Component.tsx` + `types.ts` + `index.ts`) | ~315 | Meeste ecommerce |
| **Alleen `index.tsx`** | ~14 | Construction, Publishing |
| **Los bestand** (geen eigen directory) | 3 | Ecommerce shared root |

### 3.4 Ontbrekende `types.ts` — 69 components

Voornamelijk in `ecommerce/shared/components/product-types/` (54) en `auth/` (13).

### 3.5 Import paden — Diepe relative imports

6 bestanden gebruiken `../../../hooks/usePriceMode` i.p.v. `@/branches/ecommerce/shared/hooks/usePriceMode`.

### 3.6 `any` type gebruik — 50+ instances

Zwaarst: `VariantSelector.tsx` (17x), `reservations.ts` (14x).

### 3.7 Onvolledige barrel exports

`ecommerce/shared/components/shop/index.ts` exporteert 3 van 8+ componenten.

---

## 4. LAAG — Nice to fix

### 4.1 SEO auto-fill hooks

Slechts 4 collections hebben `autoFillSEO`: BlogPosts, Cases, Testimonials, FAQs.
Ontbreekt bij: Pages, Products, Brands, Branches, Vendors, ConstructionProjects, Events.

### 4.2 Meilisearch indexing

Slechts 3 collections geindexeerd: Products, BlogPosts, Pages.
Niet geindexeerd: Vendors, Cases, BeautyServices, ConstructionProjects, Events.

### 4.3 ISR Revalidation hooks

Alleen Pages heeft `revalidatePath` hooks. Ontbreekt bij: BlogPosts, Products, Cases, ProductCategories, Vendors.

---

## 5. Aanbevolen Prioriteit

### Fase 1 — KRITIEK: AFGEROND
- [x] Access control op alle collections
- [x] Delete admin-only op content collections
- [x] Ontbrekende DB-kolommen/tabellen gefixt

### Fase 2 — Korte termijn (architectuur)
- [ ] **2.6** Dode code opruimen (company-accounts config check)
- [ ] **2.4** Horeca branch `index.ts` toevoegen
- [ ] **2.5** Versioning toevoegen aan Products, Cases, Vendors
- [ ] **2.3** Admin groups standaardiseren (Nederlands)
- [ ] **2.1** Collection slugs standaardiseren (4 collections, vereist migraties)
- [ ] **2.2** Block slugs standaardiseren (12 blocks, vereist migraties)

### Fase 3 — Geleidelijk (code-kwaliteit)
- [ ] **3.1** Inline styles migreren naar Tailwind (190 bestanden)
- [ ] **3.4** types.ts toevoegen aan 69 components
- [ ] **3.5** Relative imports → `@/` alias (6 bestanden)
- [ ] **3.6** `any` types vervangen (50+ instances)
- [ ] **3.2** Slug-generatie consolideren
- [ ] **3.7** Barrel exports completeren

### Fase 4 — Bij aanraking (nice to have)
- [ ] **4.1** autoFillSEO hook uitbreiden (7 collections)
- [ ] **4.2** Meilisearch indexing uitbreiden (5 collections)
- [ ] **4.3** ISR revalidation hooks toevoegen (5 collections)
- [ ] **3.3** Component structuur normaliseren
