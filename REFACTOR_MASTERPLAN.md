# 🏗️ REFACTOR MASTERPLAN - Architectuur Herstructurering

**Datum:** 24 Februari 2026
**Status:** 📋 Planning Fase
**Impact:** 🔴 Major - Volledige herstructurering

---

## 📊 Executive Summary

Complete herstructurering van de `/src/app` route structuur en `/src/branches` componenten architectuur ter voorbereiding op design conversie. Focus op:
- **Engelse naamgeving** (consistency)
- **WooCommerce-style routing** (SEO + UX)
- **Component ownership** (domain-driven design)
- **Template categorisatie** (scalability)
- **Toekomstbestendigheid** (maintainability)

**Key Decisions Made:**
- ✅ Producten & categorieën direct onder root (WooCommerce-style)
- ✅ [slug]/page.tsx prioriteit: Product → Category → CMS Page
- ✅ Templates naar branches met subdirectories (products/, cart/, checkout/, account/)
- ✅ Account uitgebreid met aparte routes (orders, addresses, settings)
- ✅ Legal pages via CMS (geen dedicated routes)
- ✅ Toast demo verwijderd

**Geschatte impact:** ~295 bestanden geraakt (routes, imports, components)
**Geschatte tijd:** 6-8 uur werk (inclusief testing)

---

## 🔍 Huidige Situatie - Problemen Geïdentificeerd

### ❌ Probleem 1: Gemengde Talen
```
src/app/
├── (beauty)/
│   ├── behandelingen/        ❌ Nederlands
│   ├── boeken/               ❌ Nederlands
│   └── salon/                ✅ Engels (eigenlijk Nederlands woord...)
├── (construction)/
│   ├── diensten/             ❌ Nederlands
│   ├── projecten/            ❌ Nederlands
│   └── offerte-aanvragen/    ❌ Nederlands
├── (horeca)/
│   ├── menukaart/            ❌ Nederlands
│   └── reserveren/           ❌ Nederlands
├── (shared)/
│   ├── algemene-voorwaarden/ ❌ Nederlands
│   └── verzending-retour/    ❌ Nederlands
```

### ❌ Probleem 2: Verkeerde Ownership (Shared vs Ecommerce)
```
src/app/(shared)/
├── find-order/          → Hoort bij (ecommerce) ✅
├── toast-demo/          → Demo, kan weg? ❓
├── account/             → Hoort bij (ecommerce) ✅
├── create-account/      → Hoort bij (ecommerce) ✅
├── forgot-password/     → Hoort bij (ecommerce) ✅
└── logout/              → Hoort bij (ecommerce) ✅
```

### ❌ Probleem 3: Verwarrende Route Structuur (Shop vs Products)
```
src/app/(ecommerce)/
├── shop/
│   ├── [slug]/           → Product detail pages
│   └── page.tsx          → Shop archive
└── (geen products/ route)

❓ Vraag: Moeten producten niet onder /products/[slug] ?
   Of moet shop/ hernoemd worden naar products/ ?
```

### ❌ Probleem 4: Inconsistente Branch Structuur
```
src/branches/shared/components/
├── shop/                → Hoort bij ecommerce branch ✅
├── forms/
│   ├── CheckoutForm/    → Hoort bij ecommerce ✅
│   ├── FindOrderForm/   → Hoort bij ecommerce ✅
│   └── AccountForm/     → Hoort bij ecommerce ✅
└── features/
    └── ecommerce/       → Al ecommerce-specifiek, maar zit in shared ❓
```

---

## ✅ NIEUWE ARCHITECTUUR - Target State

### 🎯 Design Principes

1. **Single Language Rule:** Alle routes Engels (user-facing URLs kunnen wel Nederlands via CMS slugs)
2. **Domain-Driven Ownership:** Componenten bij hun domein (ecommerce bij ecommerce, niet in shared)
3. **Clear Separation:** Shared = echt gedeeld, niet "nog geen plek voor gevonden"
4. **Logical Grouping:** Routes gegroepeerd op functie, niet willekeurig
5. **Future-Proof:** Ruimte voor groei (nieuwe branches, nieuwe features)

---

## 📁 NIEUWE STRUCTUUR - `/src/app`

### Route Group: `(beauty)` ✅
```
src/app/(beauty)/
├── treatments/           ← was: behandelingen/
├── booking/              ← was: boeken/
├── portfolio/            ✅ al Engels
└── salon/                ✅ behouden (hoewel technisch Nederlands...)
```

### Route Group: `(construction)` ✅
```
src/app/(construction)/
├── services/             ← was: diensten/
├── projects/             ← was: projecten/
└── quote-request/        ← was: offerte-aanvragen/
```

### Route Group: `(horeca)` ✅
```
src/app/(horeca)/
├── menu/                 ← was: menukaart/
├── reservations/         ← was: reserveren/
└── restaurant/           ✅ al Engels
```

### Route Group: `(hospitality)` ✅
```
src/app/(hospitality)/
├── treatments/           ← was: behandelingen/
├── contact/              ✅ al Engels
└── fysio/                ✅ behouden (merknaam)
```

### Route Group: `(content)` ✅
```
src/app/(content)/
├── blog/                 ✅
├── faq/                  ✅
├── knowledge-base/       ← was: kennisbank/
└── brands/               ← was: merken/
```

### Route Group: `(ecommerce)` 🔄 MAJOR CHANGES
```
src/app/(ecommerce)/
├── layout.tsx            ✅ behouden
│
├── shop/                 ✅ BEHOUDEN - Shop archive
│   └── page.tsx          → All products overview (/shop)
│
├── cart/                 ✅
├── checkout/             ✅
├── order/                ✅
│
├── account/              ← VERPLAATST van (shared)/ + UITGEBREID
│   ├── layout.tsx        → Shared account layout
│   ├── page.tsx          → Account dashboard
│   ├── orders/           → Order history
│   │   └── [id]/         → Order detail
│   ├── addresses/        → Address book
│   └── settings/         → Account settings
│       ├── profile/      → Profile settings
│       ├── password/     → Change password
│       └── notifications/ → Notification preferences
│
├── auth/                 ← NIEUW - Auth gegroepeerd
│   ├── login/            ← was: login/
│   ├── register/         ← was: register/
│   ├── forgot-password/  ← VERPLAATST van (shared)/
│   └── logout/           ← VERPLAATST van (shared)/
│
├── orders/               ← NIEUW - Order management gegroepeerd
│   └── find/             ← VERPLAATST van (shared)/find-order/
│
├── gift-vouchers/        ✅
├── vendors/              ✅
└── workshops/            ✅
```

**KRITIEK: Product & Category URLs direct onder root!**
```
# Product detail pages NIET onder /shop/ maar direct onder root:
/product-naam              → Product detail (via [slug]/page.tsx)
/another-product           → Product detail (via [slug]/page.tsx)

# Categories NIET onder /shop/ maar direct onder root (hierarchisch):
/category-name             → Category archive (via [slug]/page.tsx)
/parent-cat/child-cat      → Hierarchical categories (via [...path]/page.tsx)

# Shop archive blijft gewoon /shop:
/shop                      → All products overview
```

**Rationale WooCommerce-style Routing:**
- **SEO:** Korte product URLs (geen /shop/ of /products/ prefix)
- **Conflicts Prevention:** Product/category eerst checken in [slug], dan CMS pages
- **Hierarchical Categories:** Natuurlijke URL structuur voor categorieën
- **User Familiar:** Exacte WooCommerce UX (proven pattern)
- **Flexibiliteit:** CMS pages kunnen nog steeds custom slugs hebben

**BELANGRIJK - Prioriteit in `[slug]/page.tsx` wijzigt:**
```typescript
// OUDE VOLGORDE (FOUT):
1. Check CMS Pages
2. Check Products
3. Check Categories

// NIEUWE VOLGORDE (CORRECT):
1. Check Products     ← Hoogste prioriteit!
2. Check Categories
3. Check CMS Pages    ← Laagste prioriteit

// Voorkomt: CMS page "laptop" blokkeert product "laptop"
```

### Route Group: `(shared)` 🔄 OPGESCHOOND
```
src/app/(shared)/
├── layout.tsx            ✅
│
├── search/               ✅
├── overview/             ✅ (component showcase?)
├── setup/                ✅ (onboarding wizard?)
├── docs/                 ✅
│
├── dev/                  ✅ Development tools gegroepeerd
│   └── ai-playground/    ✅
│
└── next/                 ✅ (Next.js specific routes)
```

**Routes VERWIJDERD uit (shared):**
- `account/` → naar `(ecommerce)/account/`
- `create-account/` → naar `(ecommerce)/auth/register/`
- `find-order/` → naar `(ecommerce)/orders/find/`
- `forgot-password/` → naar `(ecommerce)/auth/forgot-password/`
- `logout/` → naar `(ecommerce)/auth/logout/`
- `toast-demo/` → VERWIJDERD (demo niet nodig)
- `algemene-voorwaarden/`, `privacy/`, `verzending-retour/` → VERWIJDERD (via CMS als normale pages)

**Legal Pages Handling:**
```
# Geen dedicated legal routes meer, alles via CMS:
/privacy              → CMS page (via [slug]/page.tsx)
/algemene-voorwaarden → CMS page (via [slug]/page.tsx)
/cookie-policy        → CMS page (via [slug]/page.tsx)

# Toekomstig: State-of-the-art LegalDocument block voor deze pages
```

### Route Group: `(platform)` ✅
```
src/app/(platform)/
├── platform/             ✅ Platform admin
└── site-generator/       ✅ Site wizard
```

### Route Group: `(payload)` ✅
```
src/app/(payload)/
├── admin/                ✅ Payload admin UI
└── api/                  ✅ Payload API routes
```

### Catch-All Routes ✅
```
src/app/
├── [slug]/               ✅ Catch-all voor CMS pages
│   ├── layout.tsx        ✅ (recent toegevoegd)
│   └── page.tsx          ✅
└── tenant/               ✅ Multi-tenant routing
    └── [[...path]]/
```

### API Routes ✅
```
src/app/api/
├── seed/                 ✅ (recent toegevoegd)
├── health/               ✅
├── og/                   ✅
├── contact/              ✅
├── ai/                   ✅
├── search/               ✅
├── meilisearch/          ✅
├── products/             ✅
├── stripe/               ✅
├── multisafepay/         ✅
├── platform/             ✅
└── ...                   (allemaal behouden)
```

---

## 📁 NIEUWE STRUCTUUR - `/src/branches`

### Branch: `shared` 🔄 OPGESCHOOND
```
src/branches/shared/
├── blocks/                           ✅ Behouden (echt gedeelde blocks)
│   ├── Hero/
│   ├── Content/
│   ├── CTA/
│   ├── FAQ/
│   ├── Team/
│   ├── Testimonials/
│   ├── ... (allemaal echt shared)
│
├── components/
│   ├── admin/                        ✅ Echt shared
│   ├── common/                       ✅ Echt shared (Logo, Media, RichText, etc.)
│   ├── layout/                       🔄 OPGESCHOOND
│   │   ├── header/                   ✅
│   │   ├── footer/                   ✅
│   │   ├── breadcrumbs/              ✅
│   │   ├── Grid/                     ✅
│   │   ├── LegalLayout/              ✅
│   │   └── search/                   ❌ VERWIJDEREN (dubbel met features/search)
│   ├── seo/                          ✅ Echt shared
│   ├── ui/                           🔄 OPGESCHOOND
│   │   ├── Toast/                    ✅ Echt shared
│   │   ├── MiniCart/                 ❌ → naar ecommerce/components/ui/
│   │   └── StaffelCalculator/        ❌ → naar ecommerce/components/ui/
│   ├── utilities/                    ✅ Echt shared
│   └── features/                     🔄 OPGESCHOOND
│       ├── ABTest/                   ✅ Shared
│       ├── ai/                       ✅ Shared
│       ├── analytics/                ✅ Shared
│       ├── chatbot/                  ✅ Shared
│       ├── newsletter/               ✅ Shared
│       ├── search/                   ✅ Shared
│       ├── blog/                     ✅ Shared (multi-branch)
│       ├── platform/                 ✅ Shared
│       ├── site-generator/           ✅ Shared
│       ├── account/                  ❌ → naar ecommerce/components/features/
│       └── ecommerce/                ❌ → naar ecommerce/components/features/
│
├── collections/                      ✅ Echt shared
│   ├── Pages/
│   ├── Media/
│   └── ...
│
└── forms/                            🔄 OPGESCHOOND
    ├── CheckoutForm/                 ❌ → naar ecommerce/components/forms/
    ├── FindOrderForm/                ❌ → naar ecommerce/components/forms/
    ├── AccountForm/                  ❌ → naar ecommerce/components/forms/
    ├── CreateAccountForm/            ❌ → naar ecommerce/components/forms/
    ├── ForgotPasswordForm/           ❌ → naar ecommerce/components/forms/
    └── LoginForm/                    ❌ → naar ecommerce/components/forms/
```

### Branch: `ecommerce` ✅ UITGEBREID
```
src/branches/ecommerce/
├── blocks/                           ✅ Ecommerce-specifieke blocks
│   ├── ProductGrid/
│   ├── CategoryGrid/
│   ├── ProductEmbed/
│   ├── QuickOrder/
│   └── ComparisonTable/
│
├── collections/                      ✅ Ecommerce collections
│   ├── Products.ts
│   ├── ProductCategories.ts
│   ├── Brands.ts
│   ├── Orders.ts
│   ├── Carts.ts
│   └── ...
│
├── components/                       ✅ UITGEBREID
│   ├── ui/                           ← NIEUW
│   │   ├── MiniCart/                 ← VERPLAATST van shared/
│   │   ├── StaffelCalculator/        ← VERPLAATST van shared/
│   │   ├── ProductCard/
│   │   ├── CategoryCard/
│   │   └── ...
│   ├── features/                     ← NIEUW
│   │   ├── account/                  ← VERPLAATST van shared/features/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── wishlist/
│   │   └── ...
│   ├── forms/                        ← NIEUW
│   │   ├── CheckoutForm/             ← VERPLAATST van shared/forms/
│   │   ├── FindOrderForm/            ← VERPLAATST van shared/forms/
│   │   ├── AccountForm/              ← VERPLAATST van shared/forms/
│   │   ├── CreateAccountForm/        ← VERPLAATST van shared/forms/
│   │   ├── ForgotPasswordForm/       ← VERPLAATST van shared/forms/
│   │   └── LoginForm/                ← VERPLAATST van shared/forms/
│   └── templates/                    ← NIEUW - GECATEGORISEERD
│       ├── products/                 ← Product templates
│       │   ├── ProductTemplate1/
│       │   ├── ProductTemplate2/
│       │   └── ProductTemplate3/
│       ├── cart/                     ← Cart templates
│       │   └── CartTemplate1/
│       ├── checkout/                 ← Checkout templates
│       │   └── CheckoutTemplate1/
│       └── account/                  ← Account templates
│           └── AccountTemplate1/
│
├── contexts/                         ✅
│   ├── CartContext.tsx
│   └── ...
│
├── hooks/                            ✅
│   └── notifyEditionSubscribers.ts
│
└── lib/                              ✅
    ├── calculateShipping.ts
    └── ...
```

**Template Categorisatie Benefits:**
- **Overzichtelijk:** Templates gegroepeerd per functie
- **Schaalbaar:** Makkelijk nieuwe templates toevoegen per categorie
- **Maintainable:** Duidelijk welke template bij welke feature hoort
- **Flexibel:** Nieuwe categorieën toevoegen (bijv. `templates/wishlist/`)

### Andere Branches ✅ Lichte wijzigingen
```
src/branches/beauty/
├── collections/          ✅
└── (componenten toevoegen indien nodig)

src/branches/construction/
├── blocks/               ✅
├── collections/          ✅
└── components/           ✅

src/branches/content/
├── collections/          ✅
├── components/           ✅
├── hooks/                ✅
├── lib/                  ✅
└── utils/                ✅

src/branches/horeca/
├── collections/          ✅
└── (componenten toevoegen indien nodig)

src/branches/hospitality/
├── collections/          ✅
└── (componenten toevoegen indien nodig)

src/branches/marketplace/
├── collections/          ✅
├── components/           ✅
└── lib/                  ✅

src/branches/platform/
├── api/                  ✅
├── collections/          ✅
├── components/           ✅
├── integrations/         ✅
└── services/             ✅
```

---

## ✅ BESLISPUNTEN - AFGEROND

### 1. **Routing Strategie** ✅ DECIDED
**Beslissing:** WooCommerce-style - Producten & categorieën direct onder root

```
/shop                    → Shop archive (alle producten)
/product-naam            → Product detail (direct onder root!)
/category-naam           → Category archive (direct onder root!)
/category/subcategory    → Hierarchische categories

# Geen /shop/ of /products/ in product URLs!
# Wel een /shop pagina als centrale product archive
```

**Prioriteit in `[slug]/page.tsx` (KRITIEKE WIJZIGING):**
```typescript
// NIEUW: Product eerst, dan category, dan CMS page
1. Try Product (hoogste prioriteit - SEO!)
2. Try Category
3. Try CMS Page (laagste prioriteit)

// NIET meer: CMS page eerst (risico op conflicts!)
```

**Rationale:**
- Betere SEO (korte product URLs)
- Voorkomt conflicts (CMS page "laptop" zou product "laptop" blokkeren)
- WooCommerce-style (proven UX)
- Hierarchische categories voor structuur

---

### 2. **Toast Demo Route** ✅ DECIDED
**Beslissing:** Verwijderen

```
(shared)/toast-demo/  → VERWIJDEREN (demo, niet nodig)
```

**Alternatief:** Er komt een productie-ready Toast component in `shared/components/ui/Toast/`

---

### 3. **Legal Pages** ✅ DECIDED
**Beslissing:** Gewoon CMS pages via [slug] - geen speciale routes

```
/privacy                → CMS page (via [slug])
/algemene-voorwaarden   → CMS page (via [slug])
/cookie-policy          → CMS page (via [slug])

# Geen dedicated routes, geen groepering
# Flexibel via CMS slug management
```

**Toekomstig:** State-of-the-art Legal Block systeem (aparte implementatie)
- Legal Document block met TOC, search, versioning
- Zie separate implementatie plan

---

### 4. **Template Structuur** ✅ DECIDED
**Beslissing:** Ja, verplaats naar branches met subdirectory categorisatie

```
src/branches/ecommerce/components/templates/
├── products/                    ← Product templates
│   ├── ProductTemplate1/
│   ├── ProductTemplate2/
│   └── ProductTemplate3/
├── cart/                        ← Cart templates
│   └── CartTemplate1/
├── checkout/                    ← Checkout templates
│   └── CheckoutTemplate1/
└── account/                     ← Account templates
    └── AccountTemplate1/
```

**Voordeel:**
- Nette categorisatie
- Schaalbaar voor nieuwe templates
- Cleaner app/ directory
- Herbruikbaar over branches

---

### 5. **Account Subpages** ✅ DECIDED
**Beslissing:** Uitgebreid met aparte routes

```
(ecommerce)/account/
├── layout.tsx         → Shared account layout
├── page.tsx           → Account dashboard
├── orders/            → Order history
│   └── [id]/          → Order detail
├── addresses/         → Address book
├── settings/          → Account settings
│   ├── profile/       → Profile settings
│   ├── password/      → Change password
│   └── notifications/ → Notification preferences
└── wishlist/          → Saved items (als feature enabled)
```

**Rationale:**
- Betere UX (dedicated pages)
- Betere SEO (deep linking)
- Professionele account ervaring
- Makkelijker te onderhouden

---

## 📋 IMPLEMENTATIE PLAN

### Fase 1: Voorbereiding (30 min)
- [ ] Review van dit plan en beslissingen nemen op beslispunten
- [ ] Backup maken van huidige state
- [ ] Git branch aanmaken: `refactor/architecture-2026`
- [ ] TypeScript paths updaten in `tsconfig.json` indien nodig

### Fase 2: Route Hernoemen - Nederlands → Engels (1 uur)
**Volgorde: Van klein naar groot**

1. **Beauty Routes**
   - [ ] `behandelingen/` → `treatments/`
   - [ ] `boeken/` → `booking/`

2. **Construction Routes**
   - [ ] `diensten/` → `services/`
   - [ ] `projecten/` → `projects/`
   - [ ] `offerte-aanvragen/` → `quote-request/`

3. **Horeca Routes**
   - [ ] `menukaart/` → `menu/`
   - [ ] `reserveren/` → `reservations/`

4. **Hospitality Routes**
   - [ ] `behandelingen/` → `treatments/`

5. **Content Routes**
   - [ ] `kennisbank/` → `knowledge-base/`
   - [ ] `merken/` → `brands/`

6. **Shared Routes**
   - [ ] `algemene-voorwaarden/` → `legal/terms/` (of laten vervallen)
   - [ ] `verzending-retour/` → `legal/shipping/` (of laten vervallen)

**Per route:**
1. Hernoem directory
2. Update imports in layout files
3. Update links in components/blocks
4. Test route werkt
5. Commit: `refactor(routes): rename [old] to [new] for English consistency`

### Fase 3: Ecommerce Herstructurering (2 uur)

#### 3A: Routes verplaatsen van (shared) naar (ecommerce)
- [ ] `(shared)/account/` → `(ecommerce)/account/`
- [ ] `(shared)/create-account/` → `(ecommerce)/auth/register/`
- [ ] `(shared)/find-order/` → `(ecommerce)/orders/find/`
- [ ] `(shared)/forgot-password/` → `(ecommerce)/auth/forgot-password/`
- [ ] `(shared)/logout/` → `(ecommerce)/auth/logout/`

#### 3B: Account Subpages Uitbreiden (NIEUWE STRUCTUUR)
- [ ] `(ecommerce)/account/layout.tsx` - Shared layout
- [ ] `(ecommerce)/account/page.tsx` - Dashboard
- [ ] `(ecommerce)/account/orders/` - Order history
- [ ] `(ecommerce)/account/orders/[id]/` - Order detail
- [ ] `(ecommerce)/account/addresses/` - Address book
- [ ] `(ecommerce)/account/settings/` - Settings directory
- [ ] `(ecommerce)/account/settings/profile/` - Profile settings
- [ ] `(ecommerce)/account/settings/password/` - Change password
- [ ] `(ecommerce)/account/settings/notifications/` - Notification prefs

#### 3C: Auth Groeperen
- [ ] Nieuwe directory: `(ecommerce)/auth/`
- [ ] Verplaats login, register, forgot-password, logout
- [ ] Shared layout voor auth pages

#### 3D: **KRITIEK - [slug]/page.tsx Prioriteit Wijzigen**
```typescript
// src/app/[slug]/page.tsx - PRIORITEIT VOLGORDE WIJZIGEN

// OUDE VOLGORDE (VERWIJDEREN):
1. Try CMS Page first
2. Try Product
3. Try Category

// NIEUWE VOLGORDE (IMPLEMENTEREN):
1. Try Product first     ← HOOGSTE PRIORITEIT
2. Try Category
3. Try CMS Page          ← LAAGSTE PRIORITEIT
```

**Rationale:** Voorkomt conflicts waar CMS page "laptop" product "laptop" blokkeert

#### 3E: WooCommerce-style Routing Implementeren
- [ ] **Verwijder** `(ecommerce)/shop/[slug]/` directory (product templates gaan naar branches!)
- [ ] **Behoud** `(ecommerce)/shop/page.tsx` (shop archive)
- [ ] Update `[slug]/page.tsx` met nieuwe prioriteit (3D)
- [ ] Test product URLs werken direct onder root: `/product-naam`
- [ ] Test category URLs werken direct onder root: `/category-naam`
- [ ] Update alle product/category links in components (verwijder /shop/ prefix)
- [ ] Update breadcrumbs voor nieuwe URL structuur

### Fase 4: Branches - Components Verplaatsen (1.5 uur)

#### 4A: Van shared naar ecommerce - UI Components
- [ ] `shared/components/ui/MiniCart/` → `ecommerce/components/ui/MiniCart/`
- [ ] `shared/components/ui/StaffelCalculator/` → `ecommerce/components/ui/StaffelCalculator/`
- [ ] Update imports overal

#### 4B: Van shared naar ecommerce - Features
- [ ] `shared/components/features/account/` → `ecommerce/components/features/account/`
- [ ] `shared/components/features/ecommerce/` → `ecommerce/components/features/`
- [ ] Update imports

#### 4C: Van shared naar ecommerce - Forms
- [ ] `shared/components/forms/CheckoutForm/` → `ecommerce/components/forms/CheckoutForm/`
- [ ] `shared/components/forms/FindOrderForm/` → `ecommerce/components/forms/FindOrderForm/`
- [ ] `shared/components/forms/AccountForm/` → `ecommerce/components/forms/AccountForm/`
- [ ] `shared/components/forms/CreateAccountForm/` → `ecommerce/components/forms/CreateAccountForm/`
- [ ] `shared/components/forms/ForgotPasswordForm/` → `ecommerce/components/forms/ForgotPasswordForm/`
- [ ] `shared/components/forms/LoginForm/` → `ecommerce/components/forms/LoginForm/`
- [ ] Update imports

#### 4D: Templates Verplaatsen + Categoriseren
- [ ] Nieuwe directories: `ecommerce/components/templates/products/`, `/cart/`, `/checkout/`, `/account/`
- [ ] Verplaats ProductTemplate1/2/3 naar `templates/products/`
- [ ] Verplaats eventuele cart templates naar `templates/cart/`
- [ ] Verplaats checkout templates naar `templates/checkout/`
- [ ] Verplaats account templates naar `templates/account/`
- [ ] Update alle imports in `[slug]/page.tsx` en andere route files
- [ ] Test dat alle templates correct worden geladen

### Fase 5: Shared Opschonen (30 min)
- [ ] Verwijder lege directories uit `shared/components/`
- [ ] Verwijder `shared/components/layout/search/` (dubbel met features/search)
- [ ] Verwijder `shared/components/shop/` (moet bij ecommerce)
- [ ] **Verwijder** `(shared)/toast-demo/` directory (demo niet nodig)
- [ ] **Verwijder** `(shared)/algemene-voorwaarden/` (via CMS)
- [ ] **Verwijder** `(shared)/verzending-retour/` (via CMS)
- [ ] Verwijder andere ecommerce-specifieke componenten uit shared
- [ ] Valideer dat shared alleen echt gedeelde componenten bevat

### Fase 6: Testing & Validation (1 uur)
- [ ] TypeScript compile check: `npm run typecheck`
- [ ] Linting check: `npm run lint`
- [ ] Build check: `npm run build`
- [ ] Test alle routes manueel:
  - [ ] Homepage
  - [ ] Product pages
  - [ ] Category pages
  - [ ] Cart/Checkout
  - [ ] Account pages
  - [ ] Auth flows
  - [ ] Content pages (blog, FAQ)
  - [ ] Branch-specific pages (beauty, construction, etc.)
- [ ] Test alle belangrijke user flows
- [ ] Visuele check op 3 browsers (Chrome, Firefox, Safari)

### Fase 7: Documentation & Cleanup (30 min)
- [ ] Update README.md met nieuwe structuur
- [ ] Update route documentatie
- [ ] Update component documentatie
- [ ] Verwijder oude redirects (indien van toepassing)
- [ ] Cleanup oude comments die verwijzen naar oude locaties

### Fase 8: Deployment (15 min)
- [ ] Final review
- [ ] Merge naar main
- [ ] Deploy naar staging
- [ ] Smoke tests op staging
- [ ] Deploy naar production
- [ ] Monitor errors (Sentry, logs)

---

## 🔄 MIGRATION HELPERS

### Script 1: Bulk Route Rename
```bash
#!/bin/bash
# rename-routes.sh

declare -A ROUTE_MAP=(
    ["behandelingen"]="treatments"
    ["boeken"]="booking"
    ["diensten"]="services"
    ["projecten"]="projects"
    ["offerte-aanvragen"]="quote-request"
    ["menukaart"]="menu"
    ["reserveren"]="reservations"
    ["kennisbank"]="knowledge-base"
    ["merken"]="brands"
)

for OLD in "${!ROUTE_MAP[@]}"; do
    NEW="${ROUTE_MAP[$OLD]}"
    echo "Renaming $OLD to $NEW..."

    # Find and rename directories
    find src/app -type d -name "$OLD" -exec bash -c '
        DIR="$1"
        NEW="$2"
        NEWDIR="${DIR%/*}/$NEW"
        echo "  $DIR -> $NEWDIR"
        mv "$DIR" "$NEWDIR"
    ' _ {} "$NEW" \;
done
```

### Script 2: Update Import Paths
```bash
#!/bin/bash
# update-imports.sh

# Update alle imports van oude naar nieuwe paden
# Voorbeeld: @/branches/shared/components/ui/MiniCart -> @/branches/ecommerce/components/ui/MiniCart

declare -A IMPORT_MAP=(
    ["@/branches/shared/components/ui/MiniCart"]="@/branches/ecommerce/components/ui/MiniCart"
    ["@/branches/shared/components/ui/StaffelCalculator"]="@/branches/ecommerce/components/ui/StaffelCalculator"
    # ... meer mappings
)

for OLD in "${!IMPORT_MAP[@]}"; do
    NEW="${IMPORT_MAP[$OLD]}"
    echo "Updating imports: $OLD -> $NEW"

    # Find en replace in alle TypeScript/TSX bestanden
    find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|$OLD|$NEW|g" {} +
done
```

### Script 3: Find Broken Imports
```typescript
// scripts/find-broken-imports.ts
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const srcDir = path.join(process.cwd(), 'src')

function findAllImports(dir: string): string[] {
  const imports: string[] = []
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      imports.push(...findAllImports(fullPath))
    } else if (file.name.match(/\.(ts|tsx)$/)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      const importMatches = content.matchAll(/from ['"](.+?)['"]/g)
      for (const match of importMatches) {
        if (match[1].startsWith('@/') || match[1].startsWith('.')) {
          imports.push(`${fullPath}: ${match[1]}`)
        }
      }
    }
  }

  return imports
}

console.log('Analyzing imports...')
const allImports = findAllImports(srcDir)
console.log(`Found ${allImports.length} imports`)

// Check welke bestanden niet bestaan
const brokenImports = allImports.filter(imp => {
  const [file, importPath] = imp.split(': ')
  // ... validatie logica
  return false // placeholder
})

console.log(`Broken imports: ${brokenImports.length}`)
brokenImports.forEach(imp => console.log(`  ❌ ${imp}`))
```

---

## 📊 IMPACT ANALYSIS

### Files Affected (schatting)
```
Route Renames:           ~15 directories, ~30 files
Ecommerce Restructure:   ~40 files moved
Branch Component Moves:  ~25 components
Import Updates:          ~200+ files
Total:                   ~295 files touched
```

### Breaking Changes
- ✅ **URLs:** Alle herbenoemde routes zijn breaking changes voor externe links
- ✅ **Imports:** Alle verplaatste componenten breken bestaande imports
- ⚠️ **Database:** Geen impact (CMS slugs blijven zelfde)
- ⚠️ **API:** Geen impact (API routes ongewijzigd)

### Mitigation Strategy
1. **Redirects:** Implementeer 301 redirects voor alle oude URLs
2. **Aliases:** Tijdelijk import aliases behouden (deprecated warnings)
3. **Gradual Migration:** Niet alles in 1 commit, maar per fase
4. **Testing:** Uitgebreide tests voor elke fase
5. **Rollback Plan:** Git branch behouden voor 1 week voor eventuele rollback

---

## 🎯 SUCCESS CRITERIA

### Must Have ✅
- [ ] Alle routes zijn Engels benoemd
- [ ] Alle ecommerce routes zijn gegroepeerd onder (ecommerce)
- [ ] Shared bevat alleen echt gedeelde componenten
- [ ] Zero TypeScript errors
- [ ] Zero broken imports
- [ ] Alle kritieke user flows werken
- [ ] Build succesvol
- [ ] Tests slagen

### Should Have ⭐
- [ ] Redirects geïmplementeerd voor oude URLs
- [ ] Documentation bijgewerkt
- [ ] Components logisch gegroepeerd per domein
- [ ] Deprecated imports hebben warnings
- [ ] Migration scripts beschikbaar voor teams

### Nice to Have 💎
- [ ] Component templates verplaatst naar branches
- [ ] Legal routes gegroepeerd
- [ ] Dev tools gegroepeerd onder /dev
- [ ] Automated migration scripts
- [ ] Before/after architecture diagram

---

## 🚨 RISK ANALYSIS

### High Risk 🔴
1. **Broken Production:** Verkeerde redirects → 404 errors
   - **Mitigation:** Staged rollout, canary deployment
2. **Import Hell:** Circulaire dependencies na verplaatsing
   - **Mitigation:** Dependency analysis vooraf, gradual migration

### Medium Risk 🟡
1. **SEO Impact:** URL changes kunnen rankings beïnvloeden
   - **Mitigation:** 301 redirects, Google Search Console notificatie
2. **User Confusion:** Gewijzigde URLs in bookmarks
   - **Mitigation:** Redirects blijven minimaal 6 maanden actief

### Low Risk 🟢
1. **Performance:** Geen impact verwacht
2. **Security:** Geen impact verwacht
3. **Data Loss:** Geen risico (alleen code restructure)

---

## 📝 POST-REFACTOR TODOS

### Immediate (week 1)
- [ ] Monitor error rates (Sentry)
- [ ] Check SEO metrics (Search Console)
- [ ] User feedback verzamelen
- [ ] Performance metrics vergelijken

### Short-term (week 2-4)
- [ ] Deprecated imports verwijderen
- [ ] Migration guides schrijven voor developers
- [ ] Component library documentatie updaten
- [ ] Video walkthrough maken van nieuwe structuur

### Long-term (maand 2+)
- [ ] Redirects naar permanent maken (na SEO validatie)
- [ ] Oude code cleanup
- [ ] Architecture Decision Records (ADR) schrijven
- [ ] Best practices guide updaten

---

## 📚 APPENDIX

### A. Huidige Problemen Samenvatting
1. Gemengde talen (NL/EN) in routes
2. Verkeerde ownership (shared vs domein-specifiek)
3. Onduidelijke route structuur (shop vs products)
4. Componenten op verkeerde plek (shared terwijl ecommerce-specifiek)

### B. Design Principes (herhaling)
1. **English Only:** Consistency in codebase
2. **Domain Ownership:** Components bij hun feature domain
3. **Logical Grouping:** Gerelateerde routes bij elkaar
4. **Scalability:** Ruimte voor groei en nieuwe features

### C. Naming Conventions
- **Routes:** kebab-case, enkelvoud voor detail, meervoud voor lijsten
- **Components:** PascalCase
- **Directories:** kebab-case
- **Branches:** enkelvoud (ecommerce, niet ecommerces)

### D. Quick Reference - Voor/Na

**Routes:**
```
VOOR                                    NA
────────────────────────────────────────────────────────────────
(beauty)/behandelingen/          →      (beauty)/treatments/
(construction)/diensten/         →      (construction)/services/
(ecommerce)/shop/[slug]/         →      VERWIJDERD (producten via [slug])
(shared)/account/                →      (ecommerce)/account/
(shared)/create-account/         →      (ecommerce)/auth/register/
(shared)/forgot-password/        →      (ecommerce)/auth/forgot-password/
(shared)/logout/                 →      (ecommerce)/auth/logout/
(shared)/find-order/             →      (ecommerce)/orders/find/
(shared)/toast-demo/             →      VERWIJDERD
(shared)/algemene-voorwaarden/   →      VERWIJDERD (via CMS: /privacy, etc.)
```

**URLs (WooCommerce-style):**
```
VOOR                                    NA
────────────────────────────────────────────────────────────────
/shop/product-naam               →      /product-naam (direct onder root!)
/shop/category-naam              →      /category-naam (direct onder root!)
/shop                            →      /shop (behouden als archive)
```

**Components:**
```
VOOR                                    NA
────────────────────────────────────────────────────────────────
shared/components/ui/MiniCart    →      ecommerce/components/ui/MiniCart
shared/components/forms/         →      ecommerce/components/forms/
app/(ecommerce)/shop/[slug]/
  ProductTemplate1.tsx           →      ecommerce/components/templates/
                                         products/ProductTemplate1/
```

**[slug]/page.tsx Prioriteit:**
```
VOOR                                    NA
────────────────────────────────────────────────────────────────
1. CMS Pages                     →      1. Products (hoogst!)
2. Products                      →      2. Categories
3. Categories                    →      3. CMS Pages (laagst)
```

---

## ✅ APPROVAL & SIGN-OFF

**Opgesteld door:** Claude (AI Assistant)
**Datum:** 24 Februari 2026
**Versie:** 2.0 (Updated met alle beslissingen)

**Beslispunten Status:**
- ✅ **Beslispunt 1 (Routing):** WooCommerce-style - producten direct onder root
- ✅ **Beslispunt 2 (Toast Demo):** Verwijderen
- ✅ **Beslispunt 3 (Legal Pages):** Via CMS (geen dedicated routes)
- ✅ **Beslispunt 4 (Templates):** Naar branches met subdirectories
- ✅ **Beslispunt 5 (Account):** Uitgebreid met aparte routes

**Akkoord:**
- ✅ **Mark (Lead Developer)** - Alle beslispunten afgerond
- [ ] **Review & Start Implementatie** - Klaar om te beginnen

**Critical Changes:**
⚠️ **Breaking URL Changes:**
- `/shop/product-naam` → `/product-naam`
- `/shop/category-naam` → `/category-naam`
- Redirects nodig voor SEO!

⚠️ **Priority Change in [slug]/page.tsx:**
- Products EERST checken (hoogste prioriteit)
- Dan categories
- Dan CMS pages (laagste prioriteit)

**Notes:**
Plan is volledig up-to-date met alle beslissingen. Klaar voor implementatie!

---

**EINDE MASTERPLAN**

**Geschatte totale tijd:** 6-8 uur (inclusief testing en validation)

**Breakdown:**
- Fase 1 (Prep): 30 min
- Fase 2 (Route renames): 1 uur
- Fase 3 (Ecommerce): 2 uur ⚠️ Kritiek ([slug]/page.tsx prioriteit!)
- Fase 4 (Branches): 1.5 uur
- Fase 5 (Cleanup): 30 min
- Fase 6 (Testing): 1 uur
- Fase 7 (Docs): 30 min
- Fase 8 (Deploy): 15 min

Voor vragen of onduidelijkheden, raadpleeg dit document of vraag om toelichting.
