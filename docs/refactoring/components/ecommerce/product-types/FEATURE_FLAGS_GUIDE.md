# Product Types - Feature Flags Guide
**Date:** 1 Maart 2026

---

## 🎯 WAAROM FEATURE FLAGS?

**Probleem zonder flags:**
- Alle klanten krijgen code voor ALLE product types
- Bundle size ~500KB+ extra (onnnodig)
- Database tabellen voor features die niet gebruikt worden
- Complexiteit in admin panel voor simpele shops

**Oplossing met flags:**
- ✅ Klanten betalen/gebruiken alleen wat ze nodig hebben
- ✅ Kleinere bundle size (tot 70% minder code!)
- ✅ Database tabellen alleen voor actieve features
- ✅ Simpelere admin interface per klant
- ✅ Veiliger rollout (geleidelijk inschakelen)
- ✅ Eenvoudiger debuggen (uit/aan per feature)

---

## 🚩 FEATURE FLAGS OVERZICHT

### 1. Variable Products (ENABLE_VARIABLE_PRODUCTS)
**Bundle impact:** ~120KB
**Database impact:** 2 tabellen (`products_variant_options`, `products_variant_options_values`)
**Use case:** 80% van webshops (maten/kleuren)
**Default:** `true` (meest gebruikt)

**Bevat:**
- VP01-VP13: Alle variant selectie componenten
- Color swatches, size selectors, dropdowns, etc.
- Multi-variant selection (bulk ordering)

### 2. Personalization (ENABLE_PERSONALIZATION)
**Bundle impact:** ~80KB
**Database impact:** 1 tabel (`products_personalization_options`)
**Use case:** 20% van webshops (graveren, monogrammen)
**Default:** `false` (specialistisch)

**Bevat:**
- PP01-PP08: Personalisatie componenten
- Text input, font selector, color picker, image upload
- Live preview, character limits, production time calc

### 3. Configurator (ENABLE_CONFIGURATOR)
**Bundle impact:** ~150KB
**Database impact:** 2 tabellen (`products_configurator_steps`, `products_configurator_options`)
**Use case:** 10% van webshops (complex configuratie)
**Default:** `false` (zeer specialistisch)

**Bevat:**
- PC01-PC08: Configurator componenten
- Step wizard, option cards, navigation, validation
- Review step, summary panel

### 4. Subscription (ENABLE_SUBSCRIPTIONS)
**Bundle impact:** ~40KB
**Database impact:** 1 tabel (`products_subscription_options`)
**Use case:** 30% van webshops (abonnementen)
**Default:** `false`

**Bevat:**
- Subscription pricing table
- Frequency selector
- Benefits card

### 5. Bundle Products (ENABLE_BUNDLES)
**Bundle impact:** ~30KB
**Database impact:** Gebruikt bestaande `grouped` product type
**Use case:** 40% van webshops
**Default:** `false`

**Bevat:**
- Bundle product list
- Discount badge
- Savings calculator

### 6. Mix & Match (ENABLE_MIX_MATCH)
**Bundle impact:** ~60KB
**Database impact:** Gebruikt bestaande `mixAndMatch` product type + config
**Use case:** 15% van webshops
**Default:** `false`

**Bevat:**
- Box selector
- Product grid
- Summary card

---

## ⚙️ CONFIGURATIE

### Environment Variables

**File:** `.env`

```bash
# Product Types Feature Flags
# Zet op 'true' om feature in te schakelen, 'false' om uit te schakelen

# Variable Products (maten/kleuren) - AANBEVOLEN: true
ENABLE_VARIABLE_PRODUCTS=true

# Personalization (graveren, monogrammen) - Voor specialistische shops
ENABLE_PERSONALIZATION=false

# Configurator (complexe multi-step configuratie) - Voor advanced shops
ENABLE_CONFIGURATOR=false

# Subscriptions (abonnementen) - Voor recurring revenue models
ENABLE_SUBSCRIPTIONS=false

# Bundles (product bundels) - Voor bundel aanbiedingen
ENABLE_BUNDLES=false

# Mix & Match (build-your-own packs) - Voor mix & match boxes
ENABLE_MIX_MATCH=false
```

**File:** `.env.example`

```bash
# Product Types Feature Flags
ENABLE_VARIABLE_PRODUCTS=true
ENABLE_PERSONALIZATION=false
ENABLE_CONFIGURATOR=false
ENABLE_SUBSCRIPTIONS=false
ENABLE_BUNDLES=false
ENABLE_MIX_MATCH=false
```

---

## 💻 CODE IMPLEMENTATIE

### 1. Feature Flag Utility

**File:** `src/branches/ecommerce/lib/product-types/featureFlags.ts`

```typescript
/**
 * Product Types Feature Flags
 * Centralized feature flag management
 */

export const PRODUCT_TYPE_FLAGS = {
  VARIABLE_PRODUCTS: process.env.ENABLE_VARIABLE_PRODUCTS === 'true',
  PERSONALIZATION: process.env.ENABLE_PERSONALIZATION === 'true',
  CONFIGURATOR: process.env.ENABLE_CONFIGURATOR === 'true',
  SUBSCRIPTIONS: process.env.ENABLE_SUBSCRIPTIONS === 'true',
  BUNDLES: process.env.ENABLE_BUNDLES === 'true',
  MIX_MATCH: process.env.ENABLE_MIX_MATCH === 'true',
} as const

export function isFeatureEnabled(feature: keyof typeof PRODUCT_TYPE_FLAGS): boolean {
  return PRODUCT_TYPE_FLAGS[feature]
}

export function getEnabledFeatures(): string[] {
  return Object.entries(PRODUCT_TYPE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([feature, _]) => feature)
}

// Helper for React components
export function useProductTypeFeature(feature: keyof typeof PRODUCT_TYPE_FLAGS): boolean {
  return PRODUCT_TYPE_FLAGS[feature]
}
```

### 2. Database Schema (Conditional Fields)

**File:** `packages/modules/catalog/collections/Products.ts`

**Voorbeeld - Variant Options Tab:**

```typescript
{
  type: 'tabs',
  tabs: [
    // ... other tabs ...

    // CONDITIONALLY INCLUDE VARIANTS TAB
    ...(process.env.ENABLE_VARIABLE_PRODUCTS === 'true'
      ? [
          {
            label: 'Varianten',
            description: 'Product varianten zoals maat, kleur (8 velden)',
            fields: [
              // ... variant fields ...
            ],
          },
        ]
      : []),

    // CONDITIONALLY INCLUDE PERSONALIZATION TAB
    ...(process.env.ENABLE_PERSONALIZATION === 'true'
      ? [
          {
            label: 'Personalisatie',
            description: 'Personalisatie opties (graveren, monogrammen, etc.)',
            fields: [
              // ... personalization fields ...
            ],
          },
        ]
      : []),

    // CONDITIONALLY INCLUDE CONFIGURATOR TAB
    ...(process.env.ENABLE_CONFIGURATOR === 'true'
      ? [
          {
            label: 'Configurator',
            description: 'Multi-step product configuratie',
            fields: [
              // ... configurator fields ...
            ],
          },
        ]
      : []),
  ],
},
```

### 3. Component Conditional Loading

**Voorbeeld - Variable Products:**

```typescript
'use client'

import dynamic from 'next/dynamic'
import { PRODUCT_TYPE_FLAGS } from '@/branches/ecommerce/lib/product-types/featureFlags'
import type { Product } from '@/payload-types'

// Lazy load components only if feature enabled
const VariantColorSwatches = PRODUCT_TYPE_FLAGS.VARIABLE_PRODUCTS
  ? dynamic(() => import('@/branches/ecommerce/components/product-types/variable/VariantColorSwatches'))
  : null

const VariantSizeSelector = PRODUCT_TYPE_FLAGS.VARIABLE_PRODUCTS
  ? dynamic(() => import('@/branches/ecommerce/components/product-types/variable/VariantSizeSelector'))
  : null

interface ProductPageProps {
  product: Product
}

export default function ProductPage({ product }: ProductPageProps) {
  // Check if product has variants
  const hasVariants = product.hasVariants && PRODUCT_TYPE_FLAGS.VARIABLE_PRODUCTS

  return (
    <div>
      {/* Product details */}

      {/* Conditionally render variant selector */}
      {hasVariants && VariantColorSwatches && (
        <VariantColorSwatches
          product={product}
          option={product.variantOptions?.[0]}
          // ... props
        />
      )}
    </div>
  )
}
```

### 4. Bundle Optimization (Code Splitting)

**File:** `src/branches/ecommerce/components/product-types/index.ts`

```typescript
/**
 * Product Types - Conditional Exports
 * Only include enabled features
 */

import { PRODUCT_TYPE_FLAGS } from '@/branches/ecommerce/lib/product-types/featureFlags'

// Shared components (always included)
export * from './shared'

// Conditionally export feature modules
if (PRODUCT_TYPE_FLAGS.VARIABLE_PRODUCTS) {
  export * from './variable'
}

if (PRODUCT_TYPE_FLAGS.PERSONALIZATION) {
  export * from './personalized'
}

if (PRODUCT_TYPE_FLAGS.CONFIGURATOR) {
  export * from './configurator'
}

if (PRODUCT_TYPE_FLAGS.SUBSCRIPTIONS) {
  export * from './subscription'
}

if (PRODUCT_TYPE_FLAGS.BUNDLES) {
  export * from './bundle'
}

if (PRODUCT_TYPE_FLAGS.MIX_MATCH) {
  export * from './mix-match'
}
```

---

## 📊 BUNDLE SIZE IMPACT

### Zonder Feature Flags (All Enabled)
```
product-types.js: 480 KB (140 KB gzipped)
└── variable: 210 KB
└── personalization: 80 KB
└── configurator: 150 KB
└── subscription: 40 KB
```

### Met Feature Flags (Only Variable Enabled)
```
product-types.js: 210 KB (62 KB gzipped)
└── variable: 210 KB

SAVINGS: 270 KB (-56%)! 🎉
```

### Klant-specifieke Configuraties

**Kleine Webshop (T-shirts):**
```bash
ENABLE_VARIABLE_PRODUCTS=true   # Maten/kleuren
# Rest: false
Bundle size: 210 KB
```

**Medium Webshop (Gepersonaliseerde Gifts):**
```bash
ENABLE_VARIABLE_PRODUCTS=true   # Maten/kleuren
ENABLE_PERSONALIZATION=true     # Graveren
# Rest: false
Bundle size: 290 KB
```

**Enterprise Webshop (Auto's configureren):**
```bash
ENABLE_VARIABLE_PRODUCTS=true
ENABLE_CONFIGURATOR=true
ENABLE_SUBSCRIPTIONS=true
Bundle size: 400 KB
```

---

## 🔒 SECURITY & VALIDATION

### Server-side Validation

**File:** `src/app/api/products/route.ts`

```typescript
import { PRODUCT_TYPE_FLAGS } from '@/branches/ecommerce/lib/product-types/featureFlags'

export async function POST(req: Request) {
  const data = await req.json()

  // Validate feature is enabled
  if (data.variantOptions && !PRODUCT_TYPE_FLAGS.VARIABLE_PRODUCTS) {
    return Response.json(
      { error: 'Variable products feature is not enabled' },
      { status: 403 }
    )
  }

  if (data.personalizationOptions && !PRODUCT_TYPE_FLAGS.PERSONALIZATION) {
    return Response.json(
      { error: 'Personalization feature is not enabled' },
      { status: 403 }
    )
  }

  // ... rest of API logic
}
```

---

## 📋 DEPLOYMENT CHECKLIST

### Voor Database Migraties

**KRITIEK:** Feature flags moeten ENABLED zijn bij migratie generatie!

```bash
# 1. Zet flags AAN in .env voor features die je wilt
echo "ENABLE_VARIABLE_PRODUCTS=true" >> .env
echo "ENABLE_PERSONALIZATION=true" >> .env

# 2. Genereer migratie (Payload leest .env!)
npx payload migrate:create product_types_enhancement

# 3. Verifieer dat migratie de juiste tabellen bevat
cat src/migrations/[timestamp]_product_types_enhancement.ts

# 4. Deploy naar productie
git add .env src/migrations/
git commit -m "feat: Add product types with feature flags"
git push
```

### Per Klant Configuratie

**1. Standaard Setup (80% van klanten):**
```bash
ENABLE_VARIABLE_PRODUCTS=true
# Rest: false
```

**2. Upgrade Klant:**
```bash
# Enable extra feature
ENABLE_PERSONALIZATION=true

# Run migrations (auto-creates tables)
npx payload migrate

# Rebuild frontend
npm run build

# Restart
pm2 restart app
```

---

## 🎯 BEST PRACTICES

### 1. Default Features
**Regel:** Variable Products = `true` by default (meest gebruikt)
**Regel:** Andere features = `false` by default (opt-in)

### 2. Documentation per Klant
**Voeg toe aan klant README:**
```markdown
## Enabled Product Types
- ✅ Variable Products (maten/kleuren)
- ❌ Personalization (disabled)
- ❌ Configurator (disabled)

To enable more features, contact support.
```

### 3. Admin Panel UI
**Toon alleen enabled features in admin:**
```typescript
// In Products.ts
{
  name: 'productType',
  type: 'select',
  options: [
    { label: 'Eenvoudig', value: 'simple' },
    ...(PRODUCT_TYPE_FLAGS.VARIABLE_PRODUCTS
      ? [{ label: 'Variabel', value: 'variable' }]
      : []),
    ...(PRODUCT_TYPE_FLAGS.SUBSCRIPTIONS
      ? [{ label: 'Abonnement', value: 'subscription' }]
      : []),
    // etc.
  ],
}
```

### 4. Error Messages
**Vriendelijke errors voor disabled features:**
```typescript
if (!PRODUCT_TYPE_FLAGS.PERSONALIZATION) {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
      <p className="text-yellow-800">
        Personalisatie is niet ingeschakeld voor deze webshop.
        Neem contact op met support voor meer informatie.
      </p>
    </div>
  )
}
```

---

## 🧪 TESTING

### Test met Feature Flags

```bash
# Test met alle features enabled
ENABLE_VARIABLE_PRODUCTS=true \
ENABLE_PERSONALIZATION=true \
ENABLE_CONFIGURATOR=true \
npm run build

# Test met alleen variable products
ENABLE_VARIABLE_PRODUCTS=true \
npm run build

# Test met alle features disabled
npm run build
```

### Verifieer Bundle Size

```bash
# Build met flags
npm run build

# Check bundle size
ls -lh .next/static/chunks/ | grep product-types

# Verwacht:
# - All enabled: ~480KB
# - Only variable: ~210KB
# - All disabled: ~0KB (niet in bundle)
```

---

## 📞 SUPPORT

**Klant wil feature enablen:**
1. Update `.env` met nieuwe flag
2. Run migrations: `npx payload migrate`
3. Rebuild: `npm run build`
4. Restart: `pm2 restart`
5. Test in admin panel
6. Document in klant README

**Klant wil feature disablen:**
1. Update `.env` (zet op `false`)
2. **WAARSCHUWING:** Data blijft in database!
3. Rebuild: `npm run build`
4. Restart: `pm2 restart`
5. Feature is nu hidden in UI

---

## ✅ SUMMARY

**Feature flags zijn ESSENTIEEL voor:**
- ✅ Kleinere bundle sizes (tot 70% besparing)
- ✅ Klant-specifieke configuraties
- ✅ Geleidelijke rollout
- ✅ Betere performance
- ✅ Simpelere admin interface per klant

**Implementatie stappen:**
1. Voeg environment variables toe
2. Maak `featureFlags.ts` utility
3. Conditional database fields
4. Conditional component loading
5. Bundle optimization
6. Test alle combinaties

**Aanbevolen defaults:**
- `ENABLE_VARIABLE_PRODUCTS=true` (80% klanten)
- Rest: `false` (opt-in per klant)

**READY TO IMPLEMENT! 🚀**
