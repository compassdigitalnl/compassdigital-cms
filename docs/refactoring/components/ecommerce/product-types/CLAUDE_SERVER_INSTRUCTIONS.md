# Product Types - Claude Server Implementation Instructions
**Date:** 1 Maart 2026
**Status:** 📋 READY FOR IMPLEMENTATION

---

## 🎯 MISSION

Implementeer 35+ product type componenten in de juiste mappenstructuur met **0,0 gaps**:
- ✅ Zero TypeScript errors
- ✅ Zero build errors
- ✅ Database migraties compleet
- ✅ Admin panel werkend
- ✅ Frontend rendering correct
- ✅ Mobile responsive

---

## 📋 STAP-VOOR-STAP IMPLEMENTATIE

### FASE 1: FOUNDATION (VERPLICHT - 2-3 uur)

#### Stap 1.1: Maak Folder Structuur (10 min)

**Commando's (kopieer & plak exact!):**

```bash
# Navigeer naar project root
cd /Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app

# Maak product-types hoofdfolder
mkdir -p src/branches/ecommerce/components/product-types

# Maak subfolders voor elk product type
mkdir -p src/branches/ecommerce/components/product-types/shared
mkdir -p src/branches/ecommerce/components/product-types/variable
mkdir -p src/branches/ecommerce/components/product-types/personalized
mkdir -p src/branches/ecommerce/components/product-types/configurator
mkdir -p src/branches/ecommerce/components/product-types/bundle
mkdir -p src/branches/ecommerce/components/product-types/mix-match
mkdir -p src/branches/ecommerce/components/product-types/subscription

# Maak lib folder voor types
mkdir -p src/branches/ecommerce/lib/product-types

# Verifieer structuur
tree src/branches/ecommerce/components/product-types -L 1
```

**Verwachte output:**
```
src/branches/ecommerce/components/product-types
├── bundle
├── configurator
├── mix-match
├── personalized
├── shared
├── subscription
└── variable
```

**✅ CHECKPOINT:** Alle 7 folders bestaan? JA → Ga verder. NEE → Herhaal commando's.

---

#### Stap 1.2: Maak TypeScript Types (30 min)

**File 1:** `src/branches/ecommerce/lib/product-types/types.ts`

**KOPIEER EXACT DEZE CODE:**

```typescript
/**
 * Product Types - Shared TypeScript Types
 * For all product type components (Variable, Personalized, Configurator, etc.)
 */

import type { Product, Media } from '@/payload-types'

// ============================================
// SHARED TYPES
// ============================================

export interface BaseProductTypeProps {
  product: Product
  className?: string
}

// ============================================
// VARIABLE PRODUCTS (VP01-VP13)
// ============================================

export type VariantDisplayType =
  | 'colorSwatch'   // VP01
  | 'sizeRadio'     // VP02
  | 'dropdown'      // VP03
  | 'imageRadio'    // VP04
  | 'checkbox'      // VP05

export interface VariantValue {
  /** Weergavenaam (bijv. "Midnight Black", "Maat 42") */
  label: string
  /** Interne waarde (bijv. "black", "42") */
  value: string
  /** Extra kosten voor deze optie (bijv. +10 voor premium materiaal) */
  priceModifier?: number | null
  /** Beschikbare voorraad voor deze variant */
  stock?: number | null
  /** Hex kleurcode (alleen voor colorSwatch) */
  colorHex?: string | null
  /** Afbeelding (alleen voor imageRadio) */
  image?: Media | string | number | null
  /** Is deze optie disabled? */
  disabled?: boolean
}

export interface VariantOption {
  /** bijv. "Kleur", "Maat", "Zooltype", "Materiaal" */
  optionName: string
  /** Hoe de optie wordt weergegeven */
  displayType: VariantDisplayType
  /** De beschikbare keuzes voor deze optie */
  values: VariantValue[]
  /** Is deze optie verplicht? */
  required?: boolean
}

export interface VariantSelection {
  [optionName: string]: VariantValue
}

// VP01: Color Swatches
export interface VariantColorSwatchesProps extends BaseProductTypeProps {
  option: VariantOption
  selectedValue?: VariantValue | null
  onSelect: (value: VariantValue) => void
}

// VP02: Size Selector
export interface VariantSizeSelectorProps extends BaseProductTypeProps {
  option: VariantOption
  selectedValue?: VariantValue | null
  onSelect: (value: VariantValue) => void
  sizeGuideUrl?: string
}

// VP03: Dropdown Selector
export interface VariantDropdownSelectorProps extends BaseProductTypeProps {
  option: VariantOption
  selectedValue?: VariantValue | null
  onSelect: (value: VariantValue) => void
  placeholder?: string
}

// VP04: Image Radio
export interface VariantImageRadioProps extends BaseProductTypeProps {
  option: VariantOption
  selectedValue?: VariantValue | null
  onSelect: (value: VariantValue) => void
}

// VP05: Checkbox Addons
export interface VariantCheckboxAddonsProps extends BaseProductTypeProps {
  option: VariantOption
  selectedValues: VariantValue[]
  onSelect: (values: VariantValue[]) => void
}

// VP08: Card Compact (Multi-select)
export interface VariantCardCompactProps {
  variant: ProductVariant
  selected: boolean
  quantity: number
  onToggle: (variantId: string) => void
  onQuantityChange: (variantId: string, quantity: number) => void
}

export interface ProductVariant {
  id: string
  sku: string
  name: string
  price: number
  compareAtPrice?: number
  stock: number
  image?: Media | string | number | null
  attributes: { [key: string]: string }
}

// VP09-VP13: Multi-variant containers
export type VariantViewMode = 'grid' | 'list'

export interface VariantSelectionState {
  [variantId: string]: {
    selected: boolean
    quantity: number
  }
}

// ============================================
// PERSONALIZATION (PP01-PP08)
// ============================================

export type PersonalizationFieldType =
  | 'text'      // PP01
  | 'font'      // PP02
  | 'color'     // PP03
  | 'image'     // PP04

export interface PersonalizationOption {
  /** Veldnaam (bijv. "engraving_text", "monogram") */
  fieldName: string
  /** Type personalisatie */
  fieldType: PersonalizationFieldType
  /** Label voor de gebruiker */
  label: string
  /** Is dit veld verplicht? */
  required: boolean
  /** Maximum aantal karakters (voor text) */
  maxLength?: number
  /** Extra kosten voor personalisatie */
  priceModifier?: number
  /** Extra productietijd in dagen */
  productionTimeAdded?: number
  /** Helptext voor gebruiker */
  helpText?: string
}

export interface PersonalizationValue {
  fieldName: string
  value: string | File | null
}

// PP01: Text Input
export interface PersonalizationTextInputProps {
  option: PersonalizationOption
  value: string
  onChange: (value: string) => void
  error?: string
}

// PP02: Font Selector
export interface PersonalizationFontSelectorProps {
  option: PersonalizationOption
  value: string
  onChange: (font: string) => void
  availableFonts: FontOption[]
}

export interface FontOption {
  name: string
  value: string
  preview: string
}

// PP03: Color Picker
export interface PersonalizationColorPickerProps {
  option: PersonalizationOption
  value: string
  onChange: (color: string) => void
  availableColors?: string[]
}

// PP04: Image Upload
export interface PersonalizationImageUploadProps {
  option: PersonalizationOption
  value: File | null
  onChange: (file: File | null) => void
  error?: string
}

// PP05: Live Preview
export interface PersonalizationLivePreviewProps extends BaseProductTypeProps {
  personalizationValues: PersonalizationValue[]
}

// ============================================
// CONFIGURATOR (PC01-PC08)
// ============================================

export interface ConfiguratorStep {
  stepNumber: number
  title: string
  description?: string
  options: ConfiguratorOption[]
  required: boolean
}

export interface ConfiguratorOption {
  id: string
  name: string
  price: number
  image?: Media | string | number | null
  description?: string
  recommended?: boolean
}

export interface ConfiguratorSelection {
  [stepNumber: number]: ConfiguratorOption | null
}

// PC01: Step Indicator
export interface ConfiguratorStepIndicatorProps {
  steps: ConfiguratorStep[]
  currentStep: number
  completedSteps: number[]
  onStepClick?: (stepNumber: number) => void
}

// PC02: Step Card
export interface ConfiguratorStepCardProps {
  step: ConfiguratorStep
  selectedOption: ConfiguratorOption | null
  onSelectOption: (option: ConfiguratorOption) => void
}

// PC03: Option Card
export interface ConfiguratorOptionCardProps {
  option: ConfiguratorOption
  selected: boolean
  onClick: () => void
}

// PC08: Summary (already exists)
export interface ConfiguratorSummaryProps {
  selection: ConfiguratorSelection
  totalPrice: number
  onEdit: (stepNumber: number) => void
  onClear: () => void
}

// ============================================
// SUBSCRIPTION (Existing)
// ============================================

export interface SubscriptionFrequency {
  interval: 'day' | 'week' | 'month' | 'year'
  intervalCount: number
  discount?: number
  label: string
}

export interface SubscriptionPricingTableProps extends BaseProductTypeProps {
  frequencies: SubscriptionFrequency[]
  selectedFrequency: SubscriptionFrequency | null
  onSelectFrequency: (frequency: SubscriptionFrequency) => void
}

// ============================================
// BUNDLE / MIX-MATCH
// ============================================

export interface BundleProduct {
  id: string
  name: string
  price: number
  quantity: number
  image?: Media | string | number | null
}

export interface BundleProps extends BaseProductTypeProps {
  products: BundleProduct[]
  discount: number
}

export interface MixMatchConfig {
  boxSize: number
  boxName: string
  availableProducts: Product[]
  minItems: number
  maxItems: number
}

export interface MixMatchSelection {
  [productId: string]: number
}
```

**File 2:** `src/branches/ecommerce/lib/product-types/index.ts`

```typescript
/**
 * Product Types - Main Export
 */

export * from './types'

export const PRODUCT_TYPES = {
  SIMPLE: 'simple',
  VARIABLE: 'variable',
  GROUPED: 'grouped',
  MIX_MATCH: 'mixAndMatch',
  SUBSCRIPTION: 'subscription',
} as const

export type ProductTypeValue = typeof PRODUCT_TYPES[keyof typeof PRODUCT_TYPES]
```

**✅ CHECKPOINT:**
```bash
# Test dat types compilen
npx tsc --noEmit src/branches/ecommerce/lib/product-types/types.ts
```
**Verwacht:** "No errors" → Ga verder

---

#### Stap 1.3: Database Migration - Voorbereiding (30 min)

**LET OP: Volg exact deze volgorde!**

**1. Zet feature flags AAN:**

```bash
# Voeg toe aan .env (OF update bestaande waardes):
echo "ENABLE_VARIABLE_PRODUCTS=true" >> .env
echo "ENABLE_PERSONALIZATION=true" >> .env
echo "ENABLE_CONFIGURATOR=true" >> .env
echo "ENABLE_SUBSCRIPTIONS=true" >> .env
```

**2. Update Products Collection:**

File: `packages/modules/catalog/collections/Products.ts`

**Zoek de "VARIANTS" tab (regel ~880) en VOEG TOE na `combinations` field:**

```typescript
// VOEG TOE NA `combinations` FIELD:
{
  name: 'variantOptions',
  type: 'array',
  label: 'Variant Opties (Nieuw Schema)',
  admin: {
    description: 'Nieuw schema voor variant opties met display types en images',
    condition: (data) => data.hasVariants,
  },
  fields: [
    {
      name: 'optionName',
      type: 'text',
      required: true,
      label: 'Optie Naam',
      admin: {
        description: 'bijv. "Kleur", "Maat", "Zooltype", "Materiaal"',
      },
    },
    {
      name: 'displayType',
      type: 'select',
      required: true,
      label: 'Weergave Type',
      options: [
        { label: 'Kleurstalen (Color Swatches)', value: 'colorSwatch' },
        { label: 'Maat knoppen (Size Radio)', value: 'sizeRadio' },
        { label: 'Dropdown', value: 'dropdown' },
        { label: 'Afbeelding keuze (Image Radio)', value: 'imageRadio' },
        { label: 'Checkboxen (Multi-select)', value: 'checkbox' },
      ],
      admin: {
        description: 'Hoe de optie wordt weergegeven in de product configurator',
      },
    },
    {
      name: 'required',
      type: 'checkbox',
      label: 'Verplicht',
      defaultValue: true,
    },
    {
      name: 'values',
      type: 'array',
      required: true,
      label: 'Waardes',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            description: 'Weergavenaam (bijv. "Midnight Black", "Maat 42")',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Waarde',
          admin: {
            description: 'Interne waarde (bijv. "black", "42")',
          },
        },
        {
          name: 'priceModifier',
          type: 'number',
          label: 'Prijs Modifier',
          admin: {
            description: 'Extra kosten voor deze optie (bijv. +10 voor premium materiaal)',
            step: 0.01,
          },
        },
        {
          name: 'stock',
          type: 'number',
          label: 'Voorraad',
          admin: {
            description: 'Beschikbare voorraad voor deze variant',
          },
        },
        {
          name: 'colorHex',
          type: 'text',
          label: 'Kleurcode (Hex)',
          admin: {
            description: 'Alleen voor colorSwatch type (bijv. #FF5733)',
            condition: (data, siblingData, { optionName }) => {
              // Access parent's displayType
              return siblingData?.displayType === 'colorSwatch'
            },
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Afbeelding',
          admin: {
            description: 'Alleen voor imageRadio type',
          },
        },
        {
          name: 'disabled',
          type: 'checkbox',
          label: 'Uitgeschakeld',
          defaultValue: false,
        },
      ],
    },
  ],
},
```

**3. Voeg Personalization Fields toe:**

**Zoek de einde van de VARIANTS tab en VOEG TOE als NIEUWE TAB:**

```typescript
// NIEUWE TAB TOEVOEGEN NA VARIANTS TAB:
{
  label: 'Personalisatie',
  description: 'Personalisatie opties (graveren, monogrammen, etc.)',
  fields: [
    {
      name: 'allowPersonalization',
      type: 'checkbox',
      label: 'Personalisatie Toestaan',
      defaultValue: false,
      admin: {
        description: 'Sta klanten toe om dit product te personaliseren',
      },
    },
    {
      name: 'personalizationOptions',
      type: 'array',
      label: 'Personalisatie Opties',
      admin: {
        condition: (data) => data.allowPersonalization,
      },
      fields: [
        {
          name: 'fieldName',
          type: 'text',
          required: true,
          label: 'Veldnaam',
          admin: {
            description: 'Interne naam (bijv. "engraving_text", "monogram")',
          },
        },
        {
          name: 'fieldType',
          type: 'select',
          required: true,
          label: 'Type',
          options: [
            { label: 'Tekst Invoer', value: 'text' },
            { label: 'Lettertype Keuze', value: 'font' },
            { label: 'Kleur Keuze', value: 'color' },
            { label: 'Afbeelding Upload', value: 'image' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            description: 'Label voor de gebruiker',
          },
        },
        {
          name: 'required',
          type: 'checkbox',
          label: 'Verplicht',
          defaultValue: false,
        },
        {
          name: 'maxLength',
          type: 'number',
          label: 'Max Lengte',
          admin: {
            description: 'Maximum aantal karakters (alleen voor text type)',
            condition: (data, siblingData) => siblingData?.fieldType === 'text',
          },
        },
        {
          name: 'priceModifier',
          type: 'number',
          label: 'Prijs Modifier',
          admin: {
            description: 'Extra kosten voor personalisatie',
            step: 0.01,
          },
        },
        {
          name: 'productionTimeAdded',
          type: 'number',
          label: 'Extra Productietijd (dagen)',
          admin: {
            description: 'Extra dagen verwerkingstijd voor personalisatie',
          },
        },
        {
          name: 'helpText',
          type: 'textarea',
          label: 'Helptext',
        },
      ],
    },
  ],
},
```

**4. Voeg Configurator Fields toe:**

```typescript
// NIEUWE TAB TOEVOEGEN NA PERSONALISATIE TAB:
{
  label: 'Configurator',
  description: 'Multi-step product configuratie',
  fields: [
    {
      name: 'hasConfigurator',
      type: 'checkbox',
      label: 'Product Configurator Inschakelen',
      defaultValue: false,
      admin: {
        description: 'Voor complexe producten met multi-step configuratie',
      },
    },
    {
      name: 'configuratorSteps',
      type: 'array',
      label: 'Configuratie Stappen',
      admin: {
        condition: (data) => data.hasConfigurator,
      },
      fields: [
        {
          name: 'stepNumber',
          type: 'number',
          required: true,
          label: 'Stap Nummer',
          admin: {
            description: 'Volgorde van de stap (1, 2, 3...)',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titel',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Beschrijving',
        },
        {
          name: 'required',
          type: 'checkbox',
          label: 'Verplicht',
          defaultValue: true,
        },
        {
          name: 'options',
          type: 'array',
          required: true,
          label: 'Opties',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Naam',
            },
            {
              name: 'price',
              type: 'number',
              required: true,
              label: 'Prijs',
              admin: {
                step: 0.01,
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Afbeelding',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beschrijving',
            },
            {
              name: 'recommended',
              type: 'checkbox',
              label: 'Aanbevolen',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'configuratorSettings',
      type: 'group',
      label: 'Configurator Instellingen',
      admin: {
        condition: (data) => data.hasConfigurator,
      },
      fields: [
        {
          name: 'showConfigSummary',
          type: 'checkbox',
          label: 'Toon Configuratie Overzicht',
          defaultValue: true,
        },
        {
          name: 'showPriceBreakdown',
          type: 'checkbox',
          label: 'Toon Prijsopbouw',
          defaultValue: true,
        },
      ],
    },
  ],
},
```

**5. Update ProductType enum:**

**Zoek het `productType` field (regel ~520) en UPDATE options:**

```typescript
{
  name: 'productType',
  type: 'select',
  required: true,
  label: 'Product Type',
  defaultValue: 'simple',
  options: [
    { label: 'Eenvoudig Product', value: 'simple' },
    { label: 'Variabel Product (maten/kleuren)', value: 'variable' },
    { label: 'Gegroepeerd Product (bundel)', value: 'grouped' },
    { label: 'Mix & Match', value: 'mixAndMatch' },
    { label: 'Abonnement', value: 'subscription' },  // ✨ NIEUW!
  ],
  admin: {
    description: 'Kies het type product',
  },
},
```

**✅ CHECKPOINT:**
```bash
# Test dat Products.ts geen syntax errors heeft
npx tsc --noEmit packages/modules/catalog/collections/Products.ts
```
**Verwacht:** "No errors" → Ga verder

---

#### Stap 1.4: Genereer Database Migratie (20 min)

**Commando's:**

```bash
# 1. Genereer migratie
npx payload migrate:create product_types_enhancement

# 2. De migratie file is nu aangemaakt in src/migrations/
# Zoek het nieuwste bestand (hoogste timestamp)
ls -lt src/migrations/ | head -5

# 3. Open het bestand en VERIFIEER:
# - Import moet zijn: @payloadcms/db-postgres (NIET sqlite!)
# - Moet db.execute() gebruiken (NIET db.run())
# - SQL moet double quotes " hebben (NIET backticks `)

# 4. Als Payload GEEN tabellen auto-creëert, voeg handmatig toe:
# (Normaal gesproken doet Payload dit automatisch, maar check altijd!)
```

**KRITIEK - Verifieer Migration File:**

Open `src/migrations/[timestamp]_product_types_enhancement.ts` en check:

```typescript
// ✅ CORRECT:
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Payload auto-creates tables - meestal is dit leeg OK!
  // OF bevat ALTER TABLE statements als Payload detecteert wijzigingen
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Rollback logic (optional)
}
```

```typescript
// ❌ FOUT (SQLite syntax):
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-sqlite'  // ❌
await db.run(sql`...`)  // ❌
CREATE TABLE \`users\`  // ❌ backticks
```

**✅ CHECKPOINT:**
```bash
# Test migratie (dry-run - doet niets, alleen check syntax)
npx payload migrate:status
```
**Verwacht:** Toont pending migration → Ga verder

---

#### Stap 1.5: Index Files voor Export (10 min)

**File 1:** `src/branches/ecommerce/components/product-types/index.ts`

```typescript
/**
 * Product Types Components - Main Export
 */

// Shared
export * from './shared'

// Variable Products
export * from './variable'

// Personalization
export * from './personalized'

// Configurator
export * from './configurator'

// Bundle
export * from './bundle'

// Mix & Match
export * from './mix-match'

// Subscription
export * from './subscription'

// Types
export * from '@/branches/ecommerce/lib/product-types'
```

**File 2-8:** Maak placeholder index files voor elke subfolder:

```bash
# Voor elke folder, maak een index.ts:
for dir in shared variable personalized configurator bundle mix-match subscription; do
  echo "// $dir components - to be implemented" > src/branches/ecommerce/components/product-types/$dir/index.ts
done
```

**✅ CHECKPOINT:** Alle index.ts files bestaan? → Ga verder

---

### FASE 2: VARIABLE PRODUCTS (VP01-VP13) (12-16 uur)

**Prioriteit:** 🔴 CRITICAL (Meest gebruikt!)

Voor ELKE component hieronder, volg EXACT dit proces:

#### Template voor ELKE Component

**1. Maak Component Folder:**
```bash
mkdir -p src/branches/ecommerce/components/product-types/variable/[ComponentName]
cd src/branches/ecommerce/components/product-types/variable/[ComponentName]
```

**2. Maak deze 3 bestanden:**
- `Component.tsx` - De React component
- `types.ts` - Component-specific types (if needed)
- `index.ts` - Export

**3. Template Component.tsx:**
```typescript
'use client'

import React from 'react'
import type { [ComponentName]Props } from '@/branches/ecommerce/lib/product-types'

export const [ComponentName]: React.FC<[ComponentName]Props> = ({
  // props here
}) => {
  // Implementation

  return (
    <div className="[component-class-name]">
      {/* Component UI */}
    </div>
  )
}
```

**4. Template index.ts:**
```typescript
export { [ComponentName] } from './Component'
export type { [ComponentName]Props } from '@/branches/ecommerce/lib/product-types'
```

**5. Update parent index:**
```typescript
// In src/branches/ecommerce/components/product-types/variable/index.ts
export * from './[ComponentName]'
```

**6. TEST CHECKLIST (VERPLICHT!):**
```bash
# 1. TypeScript check
npx tsc --noEmit src/branches/ecommerce/components/product-types/variable/[ComponentName]/Component.tsx

# 2. Build check
npm run build

# 3. Import test
echo "import { [ComponentName] } from '@/branches/ecommerce/components/product-types/variable/[ComponentName]'" > /tmp/test.tsx
npx tsc --noEmit /tmp/test.tsx

# 4. Als ALLE checks slagen → Component is DONE!
```

---

#### VP01: VariantColorSwatches (2-3 uur)

**Source:** `/docs/refactoring/components/ecommerce/product-types/variable/vp01-variant-color-swatches.html`

**Specificatie:**
- Display: Grid van kleurcirkels met hex kleuren
- Functionaliteit: Klik om te selecteren, disabled states, out-of-stock indicator
- Props: `VariantColorSwatchesProps` (zie types.ts)
- Features:
  - Color preview cirkels (40x40px)
  - Geselecteerde state (border ring)
  - Disabled state (opacity 50%, cursor not-allowed)
  - Stock indicator (badge "Uitverkocht")
  - Price modifier display (+€10)
  - Tooltip met kleur naam

**Implementation Steps:**

1. **Extract HTML/CSS van prototype:**
```bash
# Open vp01-variant-color-swatches.html
# Kopieer de relevante HTML structuur
# Convert naar JSX syntax
```

2. **Create Component:**
```bash
mkdir -p src/branches/ecommerce/components/product-types/variable/VariantColorSwatches
```

3. **Write Component.tsx:**
```typescript
'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'
import type { VariantColorSwatchesProps } from '@/branches/ecommerce/lib/product-types'

export const VariantColorSwatches: React.FC<VariantColorSwatchesProps> = ({
  option,
  selectedValue,
  onSelect,
  product,
  className = '',
}) => {
  const [hoveredValue, setHoveredValue] = useState<string | null>(null)

  if (option.displayType !== 'colorSwatch') {
    console.warn('VariantColorSwatches: displayType moet "colorSwatch" zijn')
    return null
  }

  return (
    <div className={`variant-color-swatches ${className}`}>
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        {option.optionName}
        {option.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Color Grid */}
      <div className="flex flex-wrap gap-3">
        {option.values.map((value) => {
          const isSelected = selectedValue?.value === value.value
          const isDisabled = value.disabled || (value.stock !== null && value.stock <= 0)
          const showPriceModifier = value.priceModifier && value.priceModifier !== 0

          return (
            <div
              key={value.value}
              className="relative group"
              onMouseEnter={() => setHoveredValue(value.value)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {/* Color Swatch Button */}
              <button
                type="button"
                onClick={() => !isDisabled && onSelect(value)}
                disabled={isDisabled}
                className={`
                  relative w-12 h-12 rounded-full border-2 transition-all duration-200
                  ${isSelected ? 'border-blue-600 ring-4 ring-blue-100' : 'border-gray-300'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
                `}
                style={{ backgroundColor: value.colorHex || '#cccccc' }}
                aria-label={`${value.label}${isDisabled ? ' (uitverkocht)' : ''}`}
                aria-pressed={isSelected}
              >
                {/* Checkmark when selected */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full p-1">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                )}

                {/* Out of stock badge */}
                {isDisabled && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    ×
                  </div>
                )}
              </button>

              {/* Tooltip on hover */}
              {hoveredValue === value.value && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 pointer-events-none">
                  <div className="font-semibold">{value.label}</div>
                  {showPriceModifier && (
                    <div className="text-gray-300">
                      {value.priceModifier > 0 ? '+' : ''}€{value.priceModifier.toFixed(2)}
                    </div>
                  )}
                  {value.stock !== null && value.stock > 0 && (
                    <div className="text-gray-400 text-[10px]">
                      {value.stock} op voorraad
                    </div>
                  )}
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected Value Display */}
      {selectedValue && (
        <div className="mt-3 text-sm text-gray-600">
          Geselecteerd: <span className="font-semibold text-gray-900">{selectedValue.label}</span>
          {selectedValue.priceModifier && selectedValue.priceModifier !== 0 && (
            <span className="ml-2 text-blue-600 font-semibold">
              {selectedValue.priceModifier > 0 ? '+' : ''}€{selectedValue.priceModifier.toFixed(2)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
```

4. **Create index.ts:**
```typescript
export { VariantColorSwatches } from './Component'
export type { VariantColorSwatchesProps } from '@/branches/ecommerce/lib/product-types'
```

5. **Update variable/index.ts:**
```typescript
export * from './VariantColorSwatches'
```

6. **RUN TEST CHECKLIST:**
```bash
npx tsc --noEmit src/branches/ecommerce/components/product-types/variable/VariantColorSwatches/Component.tsx
npm run build
```

**✅ CHECKPOINT:**
- TypeScript errors: 0
- Build errors: 0
- Component renders in Storybook/test page
→ VP01 DONE!

---

#### VP02-VP13: Herhaal Template

Voor ELKE resterende component (VP02-VP13):
1. Volg exact dezelfde stappen als VP01
2. Gebruik de HTML prototype als basis
3. Convert naar React/TypeScript
4. Run test checklist
5. Pas na alle checks → mark as DONE

**VP02-VP05 specificaties:**
- VP02: Size buttons (XS/S/M/L/XL grid)
- VP03: Dropdown select (Material/Finish options)
- VP04: Image-based radio (Clickable images)
- VP05: Checkbox addons (Multi-select extras)

**VP08-VP13 specificaties:**
- VP08: Compact card for grid (Checkbox + qty stepper)
- VP09: Row layout (Horizontal variant display)
- VP10: Sticky sidebar (Selected items summary)
- VP11: Toolbar (Grid/list toggle + bulk actions)
- VP12: Grid container (Responsive grid wrapper)
- VP13: List container (List view wrapper)

---

### FASE 3: PERSONALIZATION (PP02-PP08) (6-8 uur)

**Note:** PP01 is already done.

Voor ELKE component, volg Template (zie VP01).

**PP02-PP08 specificaties:**
- PP02: Font selector dropdown with previews
- PP03: Color picker (hex input + swatches)
- PP04: Image upload (drag-drop, validation)
- PP05: Live preview (complex - 3D rendering)
- PP06: Summary card (all personalization choices)
- PP07: Character limit indicator (visual counter)
- PP08: Production time indicator (delivery date calc)

---

### FASE 4: CONFIGURATOR (PC01-PC07) (10-12 uur)

**Note:** PC08 is already done.

**PC01-PC07 specificaties:**
- PC01: Step indicator (progress bar, clickable steps)
- PC02: Step card (title, options, nav buttons)
- PC03: Option card (image, price, radio select)
- PC04: Option grid (responsive grid wrapper)
- PC05: Navigation bar (prev/next buttons)
- PC06: Validation (error messages, blocking)
- PC07: Review step (final summary, edit links)

---

### FASE 5: BUNDLE / MIX-MATCH / SUBSCRIPTION (8-10 uur)

**Bundle:**
- BundleProductList
- BundleDiscountBadge
- BundleSavingsCalculator

**Mix-Match:**
- MixMatchBoxSelector
- MixMatchProductGrid
- MixMatchSummary

**Subscription:**
- Move existing SubscriptionPricingTable
- Add SubscriptionFrequencySelector
- Add SubscriptionBenefitsCard

---

## ✅ FINAL VALIDATION CHECKLIST

**Voor deployment, ALLE checks moeten PASS zijn:**

### TypeScript
```bash
npx tsc --noEmit
# Verwacht: "No errors"
```

### Build
```bash
npm run build
# Verwacht: Build succeeds, no errors
```

### Database
```bash
# Run migrations
npx payload migrate

# Verify tables exist
# (Connect to DB and check schema)
```

### Admin Panel
```bash
npm run dev
# Open http://localhost:3020/admin
# Create test product with:
# - Variable options
# - Personalization options
# - Configurator steps
# Save successfully
```

### Frontend
```bash
# Visit product page
# Verify all variant selectors render
# Verify personalization forms render
# Verify configurator steps render
# Add to cart works
```

### Mobile
```bash
# Test on Chrome DevTools mobile emulator
# All components responsive
# Touch interactions work
```

### Performance
```bash
# Check bundle size
npm run build
# Check build output - no huge chunks

# Test page load time
# < 3 seconds on 3G
```

---

## 🚨 IF ERRORS OCCUR

### TypeScript Error
```bash
# 1. Read error message carefully
# 2. Check imports are correct
# 3. Verify types exist in lib/product-types/types.ts
# 4. Check spelling of type names
# 5. Re-run: npx tsc --noEmit [file]
```

### Build Error
```bash
# 1. Check for syntax errors
# 2. Verify all imports resolve
# 3. Check for circular dependencies
# 4. Clear cache: rm -rf .next node_modules/.cache
# 5. Rebuild: npm run build
```

### Database Migration Error
```bash
# 1. Check migration file syntax
# 2. Verify using @payloadcms/db-postgres (NOT sqlite)
# 3. Check SQL syntax (double quotes, not backticks)
# 4. Test on staging database first
# 5. Rollback: npx payload migrate:down
```

### Admin Panel Error
```bash
# 1. Check browser console for errors
# 2. Verify Products.ts field definitions
# 3. Check condition functions
# 4. Restart dev server: npm run dev
```

### Component Not Rendering
```bash
# 1. Check component is exported in index.ts
# 2. Verify import path is correct
# 3. Check props are passed correctly
# 4. Inspect React DevTools
# 5. Check browser console for errors
```

---

## 📞 SUCCESS METRICS

**Je bent KLAAR als:**
- ✅ Alle 35+ componenten geïmplementeerd
- ✅ `npx tsc --noEmit` → No errors
- ✅ `npm run build` → Success
- ✅ Database migraties gedraaid
- ✅ Admin panel: kan producten aanmaken met alle opties
- ✅ Frontend: alle componenten renderen correct
- ✅ Mobile: volledig responsive
- ✅ Tests: alle unit/integration tests passen

**Geschatte tijd:** 84 uur totaal
**Verwachte outcome:** Production-ready product types systeem

---

## 📚 REFERENTIES

**Documentatie:**
- `/docs/PRODUCT_TYPES_IMPLEMENTATION_ANALYSIS.md` - Complete analysis
- `/docs/refactoring/components/ecommerce/product-types/` - Component prototypes
- `/docs/refactoring/components/ecommerce/product-types/variable/README.md` - Variable products overview

**Code:**
- `src/branches/ecommerce/lib/product-types/types.ts` - All TypeScript types
- `packages/modules/catalog/collections/Products.ts` - Database schema
- Existing: `src/branches/ecommerce/components/VariantSelector.tsx` - Legacy variant selector

**Tools:**
- `npx tsc --noEmit` - TypeScript check
- `npm run build` - Build test
- `npx payload migrate:create` - Create migration
- `npx payload migrate` - Run migrations
- `npm run dev` - Start dev server

---

**STATUS:** 📋 READY TO EXECUTE
**NEXT STEP:** Begin Fase 1, Stap 1.1 - Maak Folder Structuur

**SUCCES! 🚀**
