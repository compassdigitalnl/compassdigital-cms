# Sprint 1: Variable Products & Mix and Match - Implementation Plan

**Sprint Goal**: Add Variable Products (configureerbaar) and Mix & Match (bundle builder) product types

**Feature Flags**: `variableProducts`, `mixAndMatch`

**Migration Required**: Yes - adds new fields to Products collection

---

## 📊 Architecture Overview

```
Product Types Hierarchy:
├─ Simple Product (existing)
├─ Variable Product (NEW - Sprint 1) 🆕
│  ├─ Color Swatches (radio visual)
│  ├─ Size Selection (radio buttons with stock)
│  ├─ Dropdown Options (complex select with icons)
│  ├─ Image Selection (radio with thumbnails)
│  ├─ Checkbox Add-ons (multi-select extras)
│  └─ Custom Fields (text/number personalization)
└─ Mix & Match Product (NEW - Sprint 1) 🆕
   ├─ Box Size Options (4, 6, 10 items)
   ├─ Item Pool (available products to choose from)
   ├─ Category Filters
   └─ Pricing Rules (box discount, per-item pricing)
```

---

## 🚀 Implementation Phases

### **Phase 0: Feature Flags Setup**
1. Add to `src/lib/features.ts`:
   ```typescript
   variableProducts: parseBoolean(process.env.FEATURE_VARIABLE_PRODUCTS)
   mixAndMatch: parseBoolean(process.env.FEATURE_MIX_AND_MATCH)
   ```

2. Add to `.env`:
   ```bash
   FEATURE_VARIABLE_PRODUCTS=false
   FEATURE_MIX_AND_MATCH=false
   ```

3. Add to `.env.example` with documentation

---

### **Phase 1: Database Migration**

**Migration file**: `src/migrations/YYYY_MM_DD_HHMMSS_add_variable_and_mixmatch_products.ts`

**Changes to existing data**:
```typescript
// All existing products get productType: 'simple'
await payload.update({
  collection: 'products',
  where: { productType: { exists: false } },
  data: { productType: 'simple' },
})
```

**New fields added** (backward compatible):
- `productType`: 'simple' | 'variable' | 'mixAndMatch'
- `variants`: Array (only for variable products)
- `mixMatchConfig`: Group (only for mix & match products)

---

### **Phase 2: Products Collection Updates**

**File**: `src/collections/Products.ts`

**Changes**:

1. **Add productType field** (NOT gated - always visible):
```typescript
{
  name: 'productType',
  type: 'select',
  required: true,
  defaultValue: 'simple',
  label: 'Product Type',
  options: [
    { label: 'Eenvoudig Product', value: 'simple' },
    { label: 'Variabel Product (configureerbaar)', value: 'variable' },
    { label: 'Mix & Match (bundel builder)', value: 'mixAndMatch' },
  ],
  admin: {
    description: 'Type product bepaalt welke velden beschikbaar zijn',
  },
}
```

2. **Variable Products Fields** (gated with `featureFields('variableProducts', [...])`):
```typescript
...featureFields('variableProducts', [
  {
    name: 'variantOptions',
    type: 'array',
    label: 'Variant Opties',
    admin: {
      condition: (data) => data.productType === 'variable',
    },
    fields: [
      {
        name: 'optionName',
        type: 'text',
        required: true,
        label: 'Optie Naam',
        admin: {
          description: 'bijv. "Kleur", "Maat", "Zooltype"',
        },
      },
      {
        name: 'displayType',
        type: 'select',
        required: true,
        label: 'Weergave Type',
        options: [
          { label: 'Color Swatches (visueel)', value: 'colorSwatch' },
          { label: 'Size Buttons (radio)', value: 'sizeRadio' },
          { label: 'Dropdown (select)', value: 'dropdown' },
          { label: 'Image Selection', value: 'imageRadio' },
          { label: 'Checkbox Add-ons', value: 'checkbox' },
          { label: 'Text/Number Input', value: 'textInput' },
        ],
      },
      {
        name: 'values',
        type: 'array',
        label: 'Waarden',
        fields: [
          { name: 'label', type: 'text', required: true },
          { name: 'value', type: 'text', required: true },
          { name: 'priceModifier', type: 'number', label: 'Prijs Aanpassing (€)' },
          { name: 'stockLevel', type: 'number', label: 'Voorraad' },
          { name: 'colorCode', type: 'text', label: 'Kleur Code (hex)' },
          { name: 'image', type: 'upload', relationTo: 'media', label: 'Afbeelding' },
        ],
      },
    ],
  },
]),
```

3. **Mix & Match Fields** (gated with `featureFields('mixAndMatch', [...])`):
```typescript
...featureFields('mixAndMatch', [
  {
    name: 'mixMatchConfig',
    type: 'group',
    label: 'Mix & Match Configuratie',
    admin: {
      condition: (data) => data.productType === 'mixAndMatch',
    },
    fields: [
      {
        name: 'boxSizes',
        type: 'array',
        label: 'Box Formaten',
        fields: [
          { name: 'name', type: 'text', required: true, label: 'Naam (Small/Medium/Large)' },
          { name: 'itemCount', type: 'number', required: true, label: 'Aantal Items' },
          { name: 'price', type: 'number', required: true, label: 'Prijs (€)' },
          { name: 'description', type: 'text', label: 'Beschrijving' },
        ],
      },
      {
        name: 'availableProducts',
        type: 'relationship',
        relationTo: 'products',
        hasMany: true,
        label: 'Beschikbare Producten',
        admin: {
          description: 'Producten die gekozen kunnen worden voor de box',
        },
      },
      {
        name: 'discountPercentage',
        type: 'number',
        label: 'Box Korting (%)',
        defaultValue: 20,
        admin: {
          description: 'Korting wanneer box vol is',
        },
      },
    ],
  },
]),
```

---

### **Phase 3: New Collections (Optional - Future Enhancement)**

**Collections to consider** (not in Sprint 1, but plan ahead):

1. **ProductVariants** - For pre-defined variant combinations:
   - SKU per variant combination
   - Stock per variant
   - Price per variant
   - Images per variant

2. **MixMatchConfigurations** - Saved customer box configurations:
   - User relationship
   - Selected items
   - Box size
   - Saved for re-ordering

---

### **Phase 4: Admin UI Enhancements**

**Conditional Field Visibility**:
- Use `admin.condition` to show/hide variant fields based on `productType`
- Show "X configureerbaar opties" badge when product type is variable
- Show mix & match builder when product type is mixAndMatch

**Example**:
```typescript
admin: {
  condition: (data) => {
    return features.variableProducts && data.productType === 'variable'
  },
  description: 'Alleen zichtbaar voor variabele producten',
}
```

---

### **Phase 5: Frontend Components (Separate PR)**

**Components needed** (not in this sprint, plan for Sprint 2):

1. **VariableProductConfigurator**:
   - `ColorSwatchSelector.tsx`
   - `SizeRadioSelector.tsx`
   - `DropdownSelector.tsx`
   - `ImageRadioSelector.tsx`
   - `CheckboxAddons.tsx`
   - `CustomFieldInput.tsx`
   - `ConfigurationSummary.tsx`
   - `PriceCalculator.tsx`

2. **MixMatchBuilder**:
   - `BoxSizeSelector.tsx`
   - `ProductGrid.tsx`
   - `BoxSidebar.tsx`
   - `CategoryFilter.tsx`
   - `ProgressBar.tsx`
   - `PricingSummary.tsx`

---

## 🔄 Migration Strategy

### **Step 1: Create Migration File**

```bash
cd /Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app
npm run payload migrate:create add_variable_and_mixmatch_products
```

### **Step 2: Migration Content**

```typescript
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Add productType field to all existing products (default: 'simple')
  await payload.db.drizzle.execute(sql`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS product_type VARCHAR(50) DEFAULT 'simple'
  `)

  // Update existing products
  await payload.update({
    collection: 'products',
    where: {},
    data: { productType: 'simple' },
  })

  console.log('✅ Migration complete: All existing products set to "simple" type')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Rollback: Remove productType field
  await payload.db.drizzle.execute(sql`
    ALTER TABLE products
    DROP COLUMN IF EXISTS product_type
  `)
}
```

### **Step 3: Run Migration**

```bash
npm run payload migrate
```

---

## ✅ Testing Checklist

### **Feature Flag Testing**:
- [ ] `FEATURE_VARIABLE_PRODUCTS=false` - variant fields hidden
- [ ] `FEATURE_VARIABLE_PRODUCTS=true` - variant fields visible
- [ ] `FEATURE_MIX_AND_MATCH=false` - mix & match fields hidden
- [ ] `FEATURE_MIX_AND_MATCH=true` - mix & match fields visible

### **Migration Testing**:
- [ ] Existing products have `productType: 'simple'`
- [ ] Can create new variable product
- [ ] Can create new mix & match product
- [ ] Migration can rollback successfully

### **Admin UI Testing**:
- [ ] Product type selector visible (always, not gated)
- [ ] Variant fields only show when productType = 'variable' AND feature enabled
- [ ] Mix & match fields only show when productType = 'mixAndMatch' AND feature enabled
- [ ] Conditional visibility works correctly

---

## 📝 Commit Strategy

**Commit 1**: Feature flags + Migration
```bash
git commit -m "feat: add variable products and mix&match feature flags + migration

- Add FEATURE_VARIABLE_PRODUCTS and FEATURE_MIX_AND_MATCH flags
- Create migration to add productType field
- All existing products migrated to 'simple' type
- Backward compatible changes

Sprint 1 - Phase 0, 1"
```

**Commit 2**: Products Collection Updates
```bash
git commit -m "feat: add variable and mix&match product types to Products collection

- Add productType field (simple, variable, mixAndMatch)
- Add variantOptions array (gated with variableProducts feature)
- Add mixMatchConfig group (gated with mixAndMatch feature)
- Applied feature-aware field gating patterns

Sprint 1 - Phase 2"
```

---

## 🎯 Success Criteria

1. ✅ Feature flags added and functional
2. ✅ Migration runs successfully on existing databases
3. ✅ Existing products unaffected (backward compatible)
4. ✅ New product types can be created when features enabled
5. ✅ Fields properly gated with feature flags
6. ✅ Admin UI conditional visibility works
7. ✅ TypeScript compilation passes
8. ✅ No breaking changes to existing functionality

---

## 🚧 Future Enhancements (Post Sprint 1)

- Frontend components for variable product configurator
- Frontend components for mix & match builder
- Stock management for variants
- Price calculator logic
- Cart integration for configured products
- Order tracking for custom configurations

---

**Estimated Time**: 2-3 hours
**Priority**: High
**Dependencies**: Feature-aware field gating (COMPLETE ✅)
**Risk Level**: Low (backward compatible, gated by feature flags)
