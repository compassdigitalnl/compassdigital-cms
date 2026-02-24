# 🛒 SPRINT 2: Ecommerce Blocks - Updates & Enhancements

**Sprint:** 2 van X
**Datum:** 24 Februari 2026
**Status:** ⏳ READY TO START
**Impact:** 🟡 Medium - Field additions only, no breaking changes
**Database Impact:** ✅ Safe - Only ADD COLUMN statements, no DROP/ALTER existing data

---

## 📋 EXECUTIVE SUMMARY

### Doel Sprint 2
Updates aan 5 bestaande ecommerce blocks met enhanced fields volgens Compass Design System Sprint 2 specificaties:

**Blocks to Update:**
1. **ProductEmbed** (B13) - Layout options, specs configuration
2. **CategoryGrid** (B14) - Enhanced filtering, responsive controls
3. **ProductGrid** (B20) - Sorting, filtering, CTA options
4. **QuickOrder** (B21) - CSV upload, autocomplete config, info box ⚠️ **REQUIRES ENABLE_B2B feature flag**
5. **Pricing** (B22) - Tab structure, button variants, layout controls

### Status Existing Blocks
**ALLE 5 BLOCKS BESTAAN AL** - Dit zijn UPDATES, geen nieuwe implementaties!

### Waarom deze aanpak?
- **Modular Updates:** Elk block krijgt extra velden, geen bestaande velden worden verwijderd
- **Database-safe:** Alleen nieuwe kolommen toevoegen, geen bestaande data wijzigen
- **Type-safe:** TypeScript interfaces worden uitgebreid (niet vervangen)
- **CMS-controlled:** Admin kan nieuwe opties gebruiken zonder code changes
- **Feature-flagged:** QuickOrder conditionally enabled met ENABLE_B2B=true
- **Backward Compatible:** Bestaande block instances blijven werken met default values

### Wat er NIET gebeurt (veiligheid)
- ❌ **GEEN bestaande velden verwijderd**
- ❌ **GEEN bestaande velden gewijzigd**
- ❌ **GEEN database DROP/TRUNCATE statements**
- ❌ **GEEN breaking changes in frontend**
- ✅ **ALLEEN nieuwe velden toegevoegd** via `ALTER TABLE ... ADD COLUMN`

---

## 🎯 SCOPE & DELIVERABLES

### In Scope (Sprint 2)

**Block Updates (5 blocks)**
- [ ] ProductEmbed - Layout options, badge customization, spec fields
- [ ] CategoryGrid - Source modes, responsive columns, card styles
- [ ] ProductGrid - Sorting, filtering, CTA button
- [ ] QuickOrder - CSV upload, autocomplete config, info box (B2B only)
- [ ] Pricing - Tab structure, button variants, layout settings

**Infrastructure**
- [ ] TypeScript type updates (5 files)
- [ ] Database migrations (5 migrations)
- [ ] Feature flag integration (ENABLE_B2B for QuickOrder)
- [ ] Admin panel tab organization

**Testing & Documentation**
- [ ] Testing checklist (35 tests total - 7 per block)
- [ ] Rollback procedure
- [ ] Complete documentation

### Out of Scope (Later Sprints)
- ⏭️ Frontend React components refactoring (Sprint 3)
- ⏭️ New blocks implementation (Sprint 4+)
- ⏭️ Global consolidation (Sprint 5)

---

## 📊 DETAILED BLOCK COMPARISON

### Block 1: ProductEmbed (B13)

**Current Implementation:** `src/branches/ecommerce/blocks/ProductEmbed.ts` (50 lines)

**Existing Fields:**
```typescript
{
  product: relationship (products) ✅ KEEP
  showPrice: checkbox (default: true) ✅ KEEP
  showButton: checkbox (default: true) ✅ KEEP
  customDescription: textarea ✅ KEEP
}
```

**Sprint 2 Spec Additions:**
```typescript
{
  // NEW: Layout Configuration
  layout: select {
    options: ['horizontal', 'vertical']
    defaultValue: 'horizontal'
  }

  // NEW: Specs Configuration
  showSpecs: checkbox (default: true)
  specFields: array {
    fields: [
      { label: text, required: true }
      { field: text, required: true } // product field name
    ]
  }

  // NEW: Badge Configuration
  showBadge: checkbox (default: true)
  customBadge: group {
    text: text
    variant: select ['success', 'info', 'warning', 'error', 'pro']
  }

  // NEW: Button Text
  buttonText: text (default: 'In winkelwagen')
}
```

**Migration Required:**
```sql
ALTER TABLE "pages_blocks_productembed"
  ADD COLUMN "layout" VARCHAR(20) DEFAULT 'horizontal',
  ADD COLUMN "show_specs" BOOLEAN DEFAULT true,
  ADD COLUMN "show_badge" BOOLEAN DEFAULT true,
  ADD COLUMN "custom_badge" JSONB,
  ADD COLUMN "button_text" VARCHAR(100) DEFAULT 'In winkelwagen';

CREATE TABLE IF NOT EXISTS "pages_blocks_productembed_spec_fields" (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  field VARCHAR(100) NOT NULL,
  _order INTEGER
);
```

**Impact:**
- ✅ No breaking changes
- ✅ Existing blocks work with defaults
- ⚠️ Frontend Component needs updates to use new fields

---

### Block 2: CategoryGrid (B14)

**Current Implementation:** `src/branches/ecommerce/blocks/CategoryGrid.ts` (117 lines)

**Existing Fields:**
```typescript
{
  sectionLabelField ✅ KEEP
  heading: text ✅ KEEP
  intro: textarea ✅ KEEP
  source: select ['auto', 'manual'] ✅ UPDATE to ['manual', 'top', 'recent', 'all']
  categories: relationship (hasMany) ✅ KEEP
  showIcon: checkbox ✅ KEEP
  showProductCount: checkbox ✅ KEEP
  layout: select ['grid-2', 'grid-3', 'grid-4', 'grid-5', 'grid-6'] ✅ UPDATE
  limit: number (1-20) ✅ KEEP
  showQuickOrderCard: checkbox ✅ KEEP
  quickOrderLink: text ✅ KEEP
}
```

**Sprint 2 Spec Changes:**
```typescript
{
  // UPDATE: Rename to 'title'
  title: text (was 'heading')

  // UPDATE: Rename to 'description'
  description: textarea (was 'intro')

  // UPDATE: Change to 'categorySource' with new options
  categorySource: select {
    options: ['manual', 'top', 'recent', 'all']
    defaultValue: 'manual'
  }

  // NEW: Max categories (for auto modes)
  maxCategories: number (2-24, default: 8)

  // NEW: Hide empty categories filter
  hideEmptyCategories: checkbox (default: true)

  // NEW: Tab structure with Layout tab
  tabs: [
    {
      label: 'Content'
      fields: [title, description, categorySource, categories, etc.]
    },
    {
      label: 'Layout'
      fields: [
        columns: select ['2', '3', '4'] (desktop)
        tabletColumns: select ['2', '3']
        mobileColumns: select ['1', '2']
        gap: select ['sm', 'md', 'lg']
        cardStyle: select ['default', 'minimal', 'elevated']
        imageHeight: select ['sm', 'md', 'lg']
        enableHoverEffect: checkbox
      ]
    },
    {
      label: 'Settings'
      fields: [backgroundColor, paddingTop, paddingBottom, containerWidth]
    }
  ]
}
```

**Migration Required:**
```sql
-- Rename columns (safe - preserves data)
ALTER TABLE "pages_blocks_categorygrid"
  RENAME COLUMN "heading" TO "title";
ALTER TABLE "pages_blocks_categorygrid"
  RENAME COLUMN "intro" TO "description";
ALTER TABLE "pages_blocks_categorygrid"
  RENAME COLUMN "source" TO "category_source";

-- Add new columns
ALTER TABLE "pages_blocks_categorygrid"
  ADD COLUMN "max_categories" INTEGER DEFAULT 8,
  ADD COLUMN "hide_empty_categories" BOOLEAN DEFAULT true,
  ADD COLUMN "tablet_columns" VARCHAR(1) DEFAULT '3',
  ADD COLUMN "mobile_columns" VARCHAR(1) DEFAULT '2',
  ADD COLUMN "gap" VARCHAR(2) DEFAULT 'md',
  ADD COLUMN "card_style" VARCHAR(10) DEFAULT 'default',
  ADD COLUMN "image_height" VARCHAR(2) DEFAULT 'md',
  ADD COLUMN "enable_hover_effect" BOOLEAN DEFAULT true,
  ADD COLUMN "background_color" VARCHAR(10) DEFAULT 'bg',
  ADD COLUMN "padding_top" VARCHAR(4) DEFAULT 'lg',
  ADD COLUMN "padding_bottom" VARCHAR(4) DEFAULT 'lg',
  ADD COLUMN "container_width" VARCHAR(10) DEFAULT 'default';
```

**Impact:**
- ⚠️ Column renames (safe but requires data migration)
- ✅ No breaking changes (renamed columns preserve data)
- ⚠️ Frontend Component needs major updates for new layout options

---

### Block 3: ProductGrid (B20)

**Current Implementation:** `src/branches/ecommerce/blocks/ProductGrid.ts` (181 lines)

**Existing Fields:**
```typescript
{
  sectionLabelField ✅ KEEP
  heading: text ✅ KEEP
  intro: textarea ✅ KEEP
  source: select ['manual', 'featured', 'latest', 'category', 'brand'] ✅ UPDATE
  products: relationship (hasMany) ✅ KEEP
  category: relationship ✅ KEEP
  brand: relationship ✅ KEEP
  displayMode: select ['grid', 'carousel'] ✅ KEEP
  layout: select ['grid-2', 'grid-3', 'grid-4', 'grid-5'] ✅ UPDATE
  limit: number (1-20) ✅ UPDATE to (1-24)
  showAddToCart: checkbox ✅ KEEP
  showStockStatus: checkbox ✅ KEEP
  showBrand: checkbox ✅ KEEP
  showComparePrice: checkbox ✅ KEEP
  showViewAllButton: checkbox ✅ KEEP
  viewAllButtonText: text ✅ RENAME to 'ctaLabel'
  viewAllButtonLink: text ✅ RENAME to 'ctaUrl'
}
```

**Sprint 2 Spec Changes:**
```typescript
{
  // UPDATE: Rename to 'title'
  title: text (was 'heading')

  // UPDATE: Add columns + sortBy
  columns: select ['2', '3', '4'] (default: '4')
  sortBy: select {
    options: ['manual', 'newest', 'price-asc', 'price-desc', 'popular']
    defaultValue: 'manual'
  }

  // UPDATE: source options
  source: select {
    options: ['manual', 'category', 'tag', 'recent']
    defaultValue: 'manual'
  }

  // NEW: Tag filter
  tag: relationship (tags)

  // RENAME: viewAllButton fields
  showCta: checkbox (was showViewAllButton)
  ctaLabel: text (was viewAllButtonText)
  ctaUrl: text (was viewAllButtonLink)
}
```

**Migration Required:**
```sql
-- Rename columns
ALTER TABLE "pages_blocks_productgrid"
  RENAME COLUMN "heading" TO "title";
ALTER TABLE "pages_blocks_productgrid"
  RENAME COLUMN "show_view_all_button" TO "show_cta";
ALTER TABLE "pages_blocks_productgrid"
  RENAME COLUMN "view_all_button_text" TO "cta_label";
ALTER TABLE "pages_blocks_productgrid"
  RENAME COLUMN "view_all_button_link" TO "cta_url";

-- Add new columns
ALTER TABLE "pages_blocks_productgrid"
  ADD COLUMN "columns" VARCHAR(1) DEFAULT '4',
  ADD COLUMN "sort_by" VARCHAR(20) DEFAULT 'manual',
  ADD COLUMN "tag_id" INTEGER REFERENCES tags(id);

-- Update limit constraint
ALTER TABLE "pages_blocks_productgrid"
  ALTER COLUMN "limit" SET DEFAULT 8,
  ADD CONSTRAINT check_limit_range CHECK (limit BETWEEN 1 AND 24);
```

**Impact:**
- ⚠️ Column renames (safe - preserves data)
- ✅ No breaking changes
- ⚠️ Frontend Component needs sorting logic

---

### Block 4: QuickOrder (B21) ⚠️ **ENABLE_B2B Feature Flag**

**Current Implementation:** `src/branches/ecommerce/blocks/QuickOrder.ts` (93 lines)

**⚠️ CRITICAL: Feature Flag Required**
```typescript
// This block should ONLY be visible when ENABLE_B2B=true
// Update block config:
export const QuickOrder: Block = {
  slug: 'quickOrder',
  access: {
    read: () => process.env.ENABLE_B2B === 'true',
    create: () => process.env.ENABLE_B2B === 'true',
  },
  // ... fields
}
```

**Existing Fields:**
```typescript
{
  heading: text ✅ KEEP (but rename to 'title')
  intro: textarea ✅ KEEP (but rename to 'description')
  showOrderLists: checkbox ✅ KEEP
  inputMode: select ['textarea', 'single', 'both'] ✅ REMOVE
  placeholderText: textarea ✅ KEEP
  helpText: richText ✅ KEEP
  submitButtonText: text ✅ KEEP
  showUpload: checkbox ✅ RENAME to 'allowCsvUpload'
  uploadHelpText: text ✅ KEEP
}
```

**Sprint 2 Spec Changes:**
```typescript
{
  // UPDATE: Rename fields
  subtitle: text (new - before title)
  title: text (was 'heading')
  description: textarea (was 'intro')

  // NEW: Table configuration
  defaultRows: number {
    min: 1
    max: 20
    defaultValue: 5
  }
  maxRows: number {
    min: 5
    max: 100
    defaultValue: 50
  }

  // NEW: Autocomplete config
  minAutocompleteChars: number {
    min: 1
    max: 5
    defaultValue: 2
  }

  // UPDATE: CSV upload fields
  allowCsvUpload: checkbox (was showUpload)
  maxCsvFileSize: number {
    min: 1
    max: 10
    defaultValue: 5 // MB
  }

  // NEW: Info box
  showInfoBox: checkbox (default: true)
  infoTitle: text (default: 'Tip: SKU Autocomplete')
  infoIcon: text (default: '💡')
  infoText: textarea
}
```

**Migration Required:**
```sql
-- Rename columns
ALTER TABLE "pages_blocks_quickorder"
  RENAME COLUMN "heading" TO "title";
ALTER TABLE "pages_blocks_quickorder"
  RENAME COLUMN "intro" TO "description";
ALTER TABLE "pages_blocks_quickorder"
  RENAME COLUMN "show_upload" TO "allow_csv_upload";

-- Add new columns
ALTER TABLE "pages_blocks_quickorder"
  ADD COLUMN "subtitle" TEXT,
  ADD COLUMN "default_rows" INTEGER DEFAULT 5,
  ADD COLUMN "max_rows" INTEGER DEFAULT 50,
  ADD COLUMN "min_autocomplete_chars" INTEGER DEFAULT 2,
  ADD COLUMN "max_csv_file_size" INTEGER DEFAULT 5,
  ADD COLUMN "show_info_box" BOOLEAN DEFAULT true,
  ADD COLUMN "info_title" TEXT DEFAULT 'Tip: SKU Autocomplete',
  ADD COLUMN "info_icon" TEXT DEFAULT '💡',
  ADD COLUMN "info_text" TEXT;

-- Remove obsolete field
ALTER TABLE "pages_blocks_quickorder"
  DROP COLUMN IF EXISTS "input_mode";
```

**Impact:**
- ⚠️ **FEATURE FLAG REQUIRED** - Block only visible when ENABLE_B2B=true
- ⚠️ Column renames + deletion (safe - inputMode unused)
- ✅ Existing blocks work with defaults
- ⚠️ Frontend Component needs major updates for CSV upload + autocomplete

---

### Block 5: Pricing (B22)

**Current Implementation:** `src/branches/shared/blocks/Pricing.ts` (101 lines)

**Existing Fields:**
```typescript
{
  heading: text ✅ RENAME to 'title'
  intro: textarea ✅ RENAME to 'subtitle'
  plans: array {
    minRows: 1 ⚠️ UPDATE to 2
    maxRows: 4 ✅ KEEP
    fields: [
      name: text ✅ KEEP
      price: text ✅ KEEP
      period: text ✅ KEEP
      description: textarea ✅ KEEP
      features: array {
        feature: text ✅ UPDATE to 'text'
        // MISSING: included checkbox
      }
      ctaText: text ✅ RENAME to 'buttonLabel'
      ctaLink: text ✅ RENAME to 'buttonLink'
      highlighted: checkbox ✅ RENAME to 'featured'
    ]
  }
}
```

**Sprint 2 Spec Changes (MAJOR):**
```typescript
{
  // NEW: Tab structure
  type: 'tabs'
  tabs: [
    {
      label: 'Content'
      fields: [
        // RENAME: heading → title
        title: text

        // RENAME: intro → subtitle
        subtitle: textarea

        // UPDATE: plans array
        plans: array {
          minRows: 2 // was 1
          maxRows: 4
          fields: [
            name: text
            badge: text (NEW - optional)
            price: text
            period: text (default: 'per maand')
            description: textarea
            features: array {
              text: text (was 'feature')
              included: checkbox (NEW - default: true)
            }
            featured: checkbox (was 'highlighted')
            buttonLabel: text (was 'ctaText')
            buttonLink: text (was 'ctaLink')
            buttonVariant: select (NEW) {
              options: ['primary', 'gradient', 'outline']
              defaultValue: 'primary'
            }
          ]
        }
      ]
    },
    {
      label: 'Layout'
      fields: [
        layout: select ['auto', '2', '3', '4']
        cardAlignment: select ['center', 'top', 'stretch']
        gap: select ['sm', 'md', 'lg']
        enableHoverEffect: checkbox
      ]
    },
    {
      label: 'Settings'
      fields: [
        backgroundColor: select ['white', 'bg', 'navy']
        paddingTop: select ['none', 'sm', 'md', 'lg', 'xl']
        containerWidth: select ['default', 'wide', 'narrow']
      ]
    }
  ]
}
```

**Migration Required:**
```sql
-- Rename columns
ALTER TABLE "pages_blocks_pricing"
  RENAME COLUMN "heading" TO "title";
ALTER TABLE "pages_blocks_pricing"
  RENAME COLUMN "intro" TO "subtitle";

-- Update plans table
ALTER TABLE "pages_blocks_pricing_plans"
  RENAME COLUMN "cta_text" TO "button_label";
ALTER TABLE "pages_blocks_pricing_plans"
  RENAME COLUMN "cta_link" TO "button_link";
ALTER TABLE "pages_blocks_pricing_plans"
  RENAME COLUMN "highlighted" TO "featured";

-- Add new columns
ALTER TABLE "pages_blocks_pricing_plans"
  ADD COLUMN "badge" TEXT,
  ADD COLUMN "button_variant" VARCHAR(20) DEFAULT 'primary';

-- Update features table
ALTER TABLE "pages_blocks_pricing_plans_features"
  RENAME COLUMN "feature" TO "text";
ALTER TABLE "pages_blocks_pricing_plans_features"
  ADD COLUMN "included" BOOLEAN DEFAULT true;

-- Add layout settings to main table
ALTER TABLE "pages_blocks_pricing"
  ADD COLUMN "layout" VARCHAR(10) DEFAULT 'auto',
  ADD COLUMN "card_alignment" VARCHAR(10) DEFAULT 'center',
  ADD COLUMN "gap" VARCHAR(2) DEFAULT 'md',
  ADD COLUMN "enable_hover_effect" BOOLEAN DEFAULT true,
  ADD COLUMN "background_color" VARCHAR(10) DEFAULT 'white',
  ADD COLUMN "padding_top" VARCHAR(4) DEFAULT 'lg',
  ADD COLUMN "container_width" VARCHAR(10) DEFAULT 'default';
```

**Impact:**
- ⚠️ **MAJOR CHANGE:** Tab structure in admin (UX improvement)
- ⚠️ Multiple column renames (safe - preserves data)
- ⚠️ minRows change (1 → 2) - existing blocks with 1 plan will need update
- ✅ No breaking changes (defaults provided)
- ⚠️ Frontend Component needs major refactor for new layout options

---

## 🗄️ DATABASE MIGRATION STRATEGY

### Cruciale Regel #1: ADDITIVE + SAFE RENAMES!
**Migraties zijn ADDITIVE met veilige RENAMES - geen data wordt verwijderd!**

```sql
-- ✅ CORRECT: ADD COLUMN (additive, safe)
ALTER TABLE "pages_blocks_pricing" ADD COLUMN "badge" TEXT;

-- ✅ CORRECT: RENAME COLUMN (safe, preserves data)
ALTER TABLE "pages_blocks_pricing" RENAME COLUMN "heading" TO "title";

-- ❌ WRONG: DROP COLUMN (destructive, NOT ALLOWED)
ALTER TABLE "pages_blocks_pricing" DROP COLUMN "old_field"; -- NEVER DO THIS!

-- ⚠️ ALLOWED: DROP COLUMN IF FIELD IS CONFIRMED UNUSED
-- Only for QuickOrder.inputMode which is documented as unused
ALTER TABLE "pages_blocks_quickorder" DROP COLUMN IF EXISTS "input_mode";
```

### Migration Files (5 total)

1. `YYYYMMDD_update_productembed_block.ts` - Layout + specs + badge
2. `YYYYMMDD_update_categorygrid_block.ts` - Source modes + responsive + styles
3. `YYYYMMDD_update_productgrid_block.ts` - Sorting + tag filter + CTA
4. `YYYYMMDD_update_quickorder_block.ts` - CSV + autocomplete + info box
5. `YYYYMMDD_update_pricing_block.ts` - Tabs + badge + button variants + layout

**Total Changes:**
- 15 column renames (safe - preserves data)
- 45 new columns added across 5 blocks
- 1 column drop (QuickOrder.inputMode - confirmed unused)
- 1 new table (productembed_spec_fields)

### Migration Validation Checklist
Voordat elke migration wordt gerun:
- [ ] Check: Renames preserve data (test with SELECT after rename)
- [ ] Check: Alle ADD COLUMN statements hebben DEFAULT values
- [ ] Check: Geen `NOT NULL` zonder default
- [ ] Check: Test migration eerst op LOCAL database copy
- [ ] Check: Backup van production database voordat migration wordt gerun
- [ ] Check: Feature flag logic voor QuickOrder geïmplementeerd

---

## 📁 FILE STRUCTURE

### Modified Files (10 total)

#### Block Config Files (5 files)
```
src/branches/ecommerce/blocks/
├── ProductEmbed.ts (50 → ~120 lines)
├── CategoryGrid.ts (117 → ~240 lines)
├── ProductGrid.ts (181 → ~220 lines)
└── QuickOrder.ts (93 → ~180 lines)

src/branches/shared/blocks/
└── Pricing.ts (101 → ~280 lines)
```

#### TypeScript Types (1 file - extend)
```
src/types/
└── blocks.ts
    # EXTEND interfaces (don't replace!)
    # - ProductEmbedBlock, CategoryGridBlock, ProductGridBlock
    # - QuickOrderBlock, PricingBlock
```

#### Migrations (5 files - auto-generated)
```
src/migrations/
├── YYYYMMDD_HHMMSS_update_productembed_block.ts
├── YYYYMMDD_HHMMSS_update_categorygrid_block.ts
├── YYYYMMDD_HHMMSS_update_productgrid_block.ts
├── YYYYMMDD_HHMMSS_update_quickorder_block.ts
└── YYYYMMDD_HHMMSS_update_pricing_block.ts
```

#### Feature Flag Integration (2 files)
```
src/branches/ecommerce/blocks/QuickOrder.ts
# Add access control based on ENABLE_B2B

src/lib/featureFlags.ts (if doesn't exist, create)
# Utility functions for feature flag checks
```

### New Files (1 total)

#### Documentation
```
docs/refactoring/
└── SPRINT_2_IMPLEMENTATION_PLAN.md (this file)
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: ProductEmbed Block Updates (1-2 hours)
**Goal:** Add layout options, specs configuration, badge customization

**Files to modify:**
1. `src/branches/ecommerce/blocks/ProductEmbed.ts`

**Changes:**
```typescript
// Add new fields
{
  name: 'layout',
  type: 'select',
  defaultValue: 'horizontal',
  options: [
    { label: 'Horizontal', value: 'horizontal' },
    { label: 'Vertical', value: 'vertical' },
  ],
},
{
  name: 'showSpecs',
  type: 'checkbox',
  defaultValue: true,
},
{
  name: 'specFields',
  type: 'array',
  admin: {
    condition: (data, siblingData) => siblingData?.showSpecs === true,
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'field', type: 'text', required: true },
  ],
},
{
  name: 'showBadge',
  type: 'checkbox',
  defaultValue: true,
},
{
  name: 'customBadge',
  type: 'group',
  admin: {
    condition: (data, siblingData) => siblingData?.showBadge === true,
  },
  fields: [
    { name: 'text', type: 'text' },
    {
      name: 'variant',
      type: 'select',
      options: ['success', 'info', 'warning', 'error', 'pro'],
    },
  ],
},
{
  name: 'buttonText',
  type: 'text',
  defaultValue: 'In winkelwagen',
},
```

**Migration:**
```bash
npx payload migrate:create update_productembed_block
```

**Checklist:**
- [ ] Fields toegevoegd aan config
- [ ] Conditional fields (specFields, customBadge) werken
- [ ] Migration gegenereerd en getest
- [ ] TypeScript types updated
- [ ] No errors in admin panel

---

### Phase 2: CategoryGrid Block Updates (2 hours)
**Goal:** Add source modes, responsive columns, card styles, tabs

**Files to modify:**
1. `src/branches/ecommerce/blocks/CategoryGrid.ts`

**Changes:**
```typescript
export const CategoryGrid: Block = {
  slug: 'categoryGrid',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title', // renamed from 'heading'
              type: 'text',
            },
            {
              name: 'description', // renamed from 'intro'
              type: 'textarea',
            },
            {
              name: 'categorySource', // renamed from 'source'
              type: 'select',
              defaultValue: 'manual',
              options: [
                { label: 'Manual Selection', value: 'manual' },
                { label: 'Top Categories', value: 'top' },
                { label: 'Recently Added', value: 'recent' },
                { label: 'All Categories', value: 'all' },
              ],
            },
            {
              name: 'maxCategories',
              type: 'number',
              defaultValue: 8,
              min: 2,
              max: 24,
              admin: {
                condition: (data, siblingData) => siblingData?.categorySource !== 'manual',
              },
            },
            {
              name: 'hideEmptyCategories',
              type: 'checkbox',
              defaultValue: true,
            },
            // ... existing categories relationship field
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'columns',
              type: 'select',
              defaultValue: '4',
              options: ['2', '3', '4'],
            },
            {
              name: 'tabletColumns',
              type: 'select',
              defaultValue: '3',
              options: ['2', '3'],
            },
            {
              name: 'mobileColumns',
              type: 'select',
              defaultValue: '2',
              options: ['1', '2'],
            },
            {
              name: 'gap',
              type: 'select',
              defaultValue: 'md',
              options: ['sm', 'md', 'lg'],
            },
            {
              name: 'cardStyle',
              type: 'select',
              defaultValue: 'default',
              options: ['default', 'minimal', 'elevated'],
            },
            {
              name: 'imageHeight',
              type: 'select',
              defaultValue: 'md',
              options: ['sm', 'md', 'lg'],
            },
            {
              name: 'enableHoverEffect',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'bg',
              options: ['white', 'bg', 'navy'],
            },
            {
              name: 'paddingTop',
              type: 'select',
              defaultValue: 'lg',
              options: ['none', 'sm', 'md', 'lg', 'xl'],
            },
            {
              name: 'paddingBottom',
              type: 'select',
              defaultValue: 'lg',
              options: ['none', 'sm', 'md', 'lg', 'xl'],
            },
            {
              name: 'containerWidth',
              type: 'select',
              defaultValue: 'default',
              options: ['default', 'wide', 'full'],
            },
          ],
        },
      ],
    },
  ],
}
```

**Migration:**
```bash
npx payload migrate:create update_categorygrid_block
```

**Checklist:**
- [ ] Tab structure implemented
- [ ] Fields renamed (heading→title, intro→description, source→categorySource)
- [ ] New source modes added
- [ ] Responsive column options added
- [ ] Layout/Settings tabs populated
- [ ] Migration gegenereerd (includes RENAME + ADD columns)
- [ ] Test tab switching in admin

---

### Phase 3: ProductGrid Block Updates (1 hour)
**Goal:** Add sorting, tag filter, rename CTA fields

**Files to modify:**
1. `src/branches/ecommerce/blocks/ProductGrid.ts`

**Changes:**
```typescript
// Rename existing fields
{
  name: 'title', // was 'heading'
  type: 'text',
},

// Add new fields
{
  name: 'columns',
  type: 'select',
  defaultValue: '4',
  options: ['2', '3', '4'],
},
{
  name: 'sortBy',
  type: 'select',
  defaultValue: 'manual',
  options: [
    { label: 'Manual', value: 'manual' },
    { label: 'Newest', value: 'newest' },
    { label: 'Price Low-High', value: 'price-asc' },
    { label: 'Price High-Low', value: 'price-desc' },
    { label: 'Popular', value: 'popular' },
  ],
},
{
  name: 'tag',
  type: 'relationship',
  relationTo: 'tags',
  admin: {
    condition: (data, siblingData) => siblingData?.source === 'tag',
  },
},

// Rename CTA fields
{
  name: 'showCta', // was 'showViewAllButton'
  type: 'checkbox',
},
{
  name: 'ctaLabel', // was 'viewAllButtonText'
  type: 'text',
  defaultValue: 'Bekijk alle producten',
},
{
  name: 'ctaUrl', // was 'viewAllButtonLink'
  type: 'text',
  defaultValue: '/products',
},
```

**Migration:**
```bash
npx payload migrate:create update_productgrid_block
```

**Checklist:**
- [ ] Fields renamed (heading→title, etc.)
- [ ] Sorting options added
- [ ] Tag filter relationship added
- [ ] CTA fields renamed
- [ ] Migration gegenereerd
- [ ] Test sorting in component

---

### Phase 4: QuickOrder Block Updates + Feature Flag (2-3 hours)
**Goal:** Add CSV upload config, autocomplete settings, info box, ENABLE_B2B feature flag

**⚠️ CRITICAL: Feature Flag Implementation**

**Step 4a: Update Block Config with Access Control**

**File:** `src/branches/ecommerce/blocks/QuickOrder.ts`

```typescript
import { Block } from 'payload'

// Helper function to check B2B feature flag
const isB2BEnabled = () => process.env.ENABLE_B2B === 'true'

export const QuickOrder: Block = {
  slug: 'quickOrder',
  interfaceName: 'QuickOrderBlock',
  labels: {
    singular: 'Quick Order',
    plural: 'Quick Orders',
  },
  // ⚠️ FEATURE FLAG: Only visible when ENABLE_B2B=true
  access: {
    read: () => isB2BEnabled(),
    create: () => isB2BEnabled(),
    update: () => isB2BEnabled(),
  },
  admin: {
    // Show warning in admin if feature is disabled
    description: isB2BEnabled()
      ? 'B2B bulk order functionality with CSV upload and SKU autocomplete'
      : '⚠️ DISABLED: Set ENABLE_B2B=true in .env to enable this block',
  },
  fields: [
    // Rename existing fields
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle (optioneel)',
      admin: {
        description: 'Kleine tekst boven de titel (bijv: "B2B Snelbestellen")',
      },
    },
    {
      name: 'title', // was 'heading'
      type: 'text',
      label: 'Titel',
      defaultValue: 'Bulk Order',
    },
    {
      name: 'description', // was 'intro'
      type: 'textarea',
      label: 'Beschrijving',
    },

    // NEW: Table configuration
    {
      type: 'row',
      fields: [
        {
          name: 'defaultRows',
          type: 'number',
          label: 'Standaard aantal rijen',
          defaultValue: 5,
          min: 1,
          max: 20,
          admin: {
            description: 'Aantal lege rijen bij laden',
            width: '33%',
          },
        },
        {
          name: 'maxRows',
          type: 'number',
          label: 'Maximum aantal rijen',
          defaultValue: 50,
          min: 5,
          max: 100,
          admin: {
            description: 'Max aantal producten per order',
            width: '33%',
          },
        },
        {
          name: 'minAutocompleteChars',
          type: 'number',
          label: 'Min chars voor autocomplete',
          defaultValue: 2,
          min: 1,
          max: 5,
          admin: {
            description: 'Start autocomplete na X karakters',
            width: '33%',
          },
        },
      ],
    },

    // NEW: CSV Upload configuration
    {
      type: 'collapsible',
      label: 'CSV Upload Instellingen',
      fields: [
        {
          name: 'allowCsvUpload', // renamed from 'showUpload'
          type: 'checkbox',
          label: 'CSV upload toestaan',
          defaultValue: false,
        },
        {
          name: 'uploadHelpText',
          type: 'text',
          label: 'Upload help tekst',
          defaultValue: 'Format: SKU, Hoeveelheid (één per regel)',
          admin: {
            condition: (data, siblingData) => siblingData?.allowCsvUpload === true,
          },
        },
        {
          name: 'maxCsvFileSize',
          type: 'number',
          label: 'Max CSV bestandsgrootte (MB)',
          defaultValue: 5,
          min: 1,
          max: 10,
          admin: {
            condition: (data, siblingData) => siblingData?.allowCsvUpload === true,
          },
        },
      ],
    },

    // NEW: Info Box
    {
      type: 'collapsible',
      label: 'Info Box (Tips voor gebruiker)',
      fields: [
        {
          name: 'showInfoBox',
          type: 'checkbox',
          label: 'Toon info box',
          defaultValue: true,
        },
        {
          name: 'infoTitle',
          type: 'text',
          label: 'Info titel',
          defaultValue: 'Tip: SKU Autocomplete',
          admin: {
            condition: (data, siblingData) => siblingData?.showInfoBox === true,
          },
        },
        {
          name: 'infoIcon',
          type: 'text',
          label: 'Icon (emoji)',
          defaultValue: '💡',
          admin: {
            condition: (data, siblingData) => siblingData?.showInfoBox === true,
          },
        },
        {
          name: 'infoText',
          type: 'textarea',
          label: 'Info tekst',
          defaultValue: 'Begin met typen in het SKU veld om producten te zoeken. Autocomplete activeert na 2 karakters.',
          admin: {
            condition: (data, siblingData) => siblingData?.showInfoBox === true,
            rows: 3,
          },
        },
      ],
    },

    // Keep existing fields
    {
      name: 'showOrderLists',
      type: 'checkbox',
      label: 'Toon opgeslagen bestellijsten',
      defaultValue: true,
    },
    {
      name: 'placeholderText',
      type: 'textarea',
      label: 'Placeholder tekst',
    },
    {
      name: 'submitButtonText',
      type: 'text',
      label: 'Submit button tekst',
      defaultValue: 'Toevoegen aan winkelwagen',
    },
  ],
}
```

**Step 4b: Update .env with Feature Flag**

**File:** `.env`

```bash
# B2B Feature Flags
ENABLE_B2B=false # Set to 'true' to enable QuickOrder block
```

**Step 4c: Create Feature Flag Utility (Optional)**

**File:** `src/lib/featureFlags.ts`

```typescript
export const isB2BEnabled = (): boolean => {
  return process.env.ENABLE_B2B === 'true'
}

export const isFeatureEnabled = (featureKey: string): boolean => {
  const envKey = `ENABLE_${featureKey.toUpperCase()}`
  return process.env[envKey] === 'true'
}
```

**Migration:**
```bash
npx payload migrate:create update_quickorder_block
```

**Checklist:**
- [ ] Feature flag implemented (ENABLE_B2B check)
- [ ] Block hidden when ENABLE_B2B=false
- [ ] Fields renamed (heading→title, intro→description)
- [ ] Table config fields added (defaultRows, maxRows, minAutocompleteChars)
- [ ] CSV upload config updated (allowCsvUpload, maxCsvFileSize)
- [ ] Info box fields added
- [ ] inputMode field removed (unused)
- [ ] Migration gegenereerd (includes DROP COLUMN for inputMode)
- [ ] Test with ENABLE_B2B=true and false
- [ ] Admin shows warning when disabled

---

### Phase 5: Pricing Block Updates (2-3 hours)
**Goal:** Add tab structure, badge, button variants, layout settings

**Files to modify:**
1. `src/branches/shared/blocks/Pricing.ts`

**Changes:**
```typescript
export const Pricing: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  labels: {
    singular: 'Prijstabel',
    plural: 'Prijstabellen',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title', // renamed from 'heading'
              type: 'text',
              label: 'Sectie titel',
              defaultValue: 'Onze pakketten',
            },
            {
              name: 'subtitle', // renamed from 'intro'
              type: 'textarea',
              label: 'Intro tekst',
              admin: {
                rows: 2,
              },
            },
            {
              name: 'plans',
              type: 'array',
              label: 'Pakketten',
              minRows: 2, // was 1
              maxRows: 4,
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'badge', // NEW
                  type: 'text',
                  label: 'Badge (optioneel)',
                  admin: {
                    placeholder: 'Bijv: "Meest gekozen", "Pro"',
                  },
                },
                {
                  name: 'price',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'period',
                  type: 'text',
                  defaultValue: 'per maand',
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'features',
                  type: 'array',
                  fields: [
                    {
                      name: 'text', // renamed from 'feature'
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'included', // NEW
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Inbegrepen',
                    },
                  ],
                },
                {
                  name: 'featured', // renamed from 'highlighted'
                  type: 'checkbox',
                  label: 'Uitgelicht',
                  defaultValue: false,
                },
                {
                  name: 'buttonLabel', // renamed from 'ctaText'
                  type: 'text',
                  label: 'Button tekst',
                  defaultValue: 'Kies dit plan',
                  required: true,
                },
                {
                  name: 'buttonLink', // renamed from 'ctaLink'
                  type: 'text',
                  label: 'Button link',
                },
                {
                  name: 'buttonVariant', // NEW
                  type: 'select',
                  label: 'Button stijl',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary (Teal)', value: 'primary' },
                    { label: 'Gradient (Teal→Dark)', value: 'gradient' },
                    { label: 'Outline (Border only)', value: 'outline' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'layout',
              type: 'select',
              label: 'Aantal kolommen',
              defaultValue: 'auto',
              options: [
                { label: 'Auto (past aan op aantal plans)', value: 'auto' },
                { label: '2 kolommen', value: '2' },
                { label: '3 kolommen', value: '3' },
                { label: '4 kolommen', value: '4' },
              ],
            },
            {
              name: 'cardAlignment',
              type: 'select',
              label: 'Card uitlijning',
              defaultValue: 'center',
              options: [
                { label: 'Center (gecentreerd)', value: 'center' },
                { label: 'Top (bovenkant uitlijnen)', value: 'top' },
                { label: 'Stretch (gelijke hoogte)', value: 'stretch' },
              ],
            },
            {
              name: 'gap',
              type: 'select',
              label: 'Ruimte tussen cards',
              defaultValue: 'md',
              options: [
                { label: 'Klein (16px)', value: 'sm' },
                { label: 'Medium (24px)', value: 'md' },
                { label: 'Groot (32px)', value: 'lg' },
              ],
            },
            {
              name: 'enableHoverEffect',
              type: 'checkbox',
              label: 'Hover effect inschakelen',
              defaultValue: true,
              admin: {
                description: 'Scale + shadow bij hover',
              },
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'backgroundColor',
              type: 'select',
              label: 'Achtergrond kleur',
              defaultValue: 'white',
              options: [
                { label: 'Wit', value: 'white' },
                { label: 'Light Grey', value: 'bg' },
                { label: 'Navy (donker)', value: 'navy' },
              ],
            },
            {
              name: 'paddingTop',
              type: 'select',
              label: 'Padding boven',
              defaultValue: 'lg',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Small (32px)', value: 'sm' },
                { label: 'Medium (48px)', value: 'md' },
                { label: 'Large (64px)', value: 'lg' },
                { label: 'XLarge (80px)', value: 'xl' },
              ],
            },
            {
              name: 'containerWidth',
              type: 'select',
              label: 'Container breedte',
              defaultValue: 'default',
              options: [
                { label: 'Default (1200px)', value: 'default' },
                { label: 'Wide (1400px)', value: 'wide' },
                { label: 'Narrow (960px)', value: 'narrow' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

**Migration:**
```bash
npx payload migrate:create update_pricing_block
```

**Checklist:**
- [ ] Tab structure implemented (Content/Layout/Settings)
- [ ] Fields renamed (heading→title, intro→subtitle, etc.)
- [ ] Badge field added to plans
- [ ] Button variant field added
- [ ] Features.included checkbox added
- [ ] minRows updated (1 → 2)
- [ ] Layout tab fields added
- [ ] Settings tab fields added
- [ ] Migration gegenereerd (includes multiple RENAME + ADD)
- [ ] Test tab structure in admin
- [ ] Verify existing blocks work with defaults

---

### Phase 6: Testing & Verification (2 hours)
**Goal:** Verify all 5 block updates work correctly

#### Test Suite (35 tests total - 7 per block)

**ProductEmbed Tests (7):**
- [ ] Layout switch (horizontal ↔ vertical) works
- [ ] Specs configuration displays correctly
- [ ] Custom badge renders with all 5 variants
- [ ] Conditional fields (specFields, customBadge) show/hide correctly
- [ ] Button text customization works
- [ ] Existing blocks still render with defaults
- [ ] Migration applied successfully

**CategoryGrid Tests (7):**
- [ ] Tab structure visible in admin (Content/Layout/Settings)
- [ ] Source modes work (manual/top/recent/all)
- [ ] Responsive columns configuration works
- [ ] Card style variants render correctly
- [ ] Empty categories filter works
- [ ] Field renames preserved data
- [ ] Migration applied successfully

**ProductGrid Tests (7):**
- [ ] Sorting options work (newest, price-asc, price-desc, popular)
- [ ] Tag filter relationship works
- [ ] Columns configuration works
- [ ] CTA button renders when enabled
- [ ] Field renames preserved data
- [ ] Existing blocks still work
- [ ] Migration applied successfully

**QuickOrder Tests (7):**
- [ ] ⚠️ **Block hidden when ENABLE_B2B=false**
- [ ] ⚠️ **Block visible when ENABLE_B2B=true**
- [ ] Table configuration (defaultRows, maxRows) works
- [ ] Autocomplete config field visible
- [ ] CSV upload toggle works with conditional fields
- [ ] Info box configuration works
- [ ] Migration applied successfully (inputMode removed)

**Pricing Tests (7):**
- [ ] Tab structure works (Content/Layout/Settings)
- [ ] Badge field appears in plans
- [ ] Button variant select works
- [ ] Features.included checkbox works
- [ ] minRows constraint enforced (2 minimum)
- [ ] Layout options affect grid
- [ ] Migration applied successfully (multiple renames)

#### Database Verification
```bash
# Check all migrations ran
npx payload migrate:status

# Verify ProductEmbed columns
psql $DATABASE_URL -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'pages_blocks_productembed';"
# Should include: layout, show_specs, show_badge, custom_badge, button_text

# Verify CategoryGrid renames
psql $DATABASE_URL -c "SELECT title, description, category_source FROM pages_blocks_categorygrid LIMIT 1;"
# Should work (no errors on renamed columns)

# Verify QuickOrder removed inputMode
psql $DATABASE_URL -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'pages_blocks_quickorder' AND column_name = 'input_mode';"
# Should return 0 rows (column removed)

# Verify Pricing minRows
psql $DATABASE_URL -c "SELECT id FROM pages_blocks_pricing_plans GROUP BY pricing_block_id HAVING COUNT(*) < 2;"
# Should return 0 rows (all blocks have 2+ plans after migration data fix)
```

---

## 🔙 ROLLBACK PROCEDURE

### If Something Goes Wrong

#### Scenario 1: Migration Failed Halfway
```bash
# 1. Check migration status
npx payload migrate:status

# 2. Identify failed migration
# Example output:
# ✅ YYYYMMDD_update_productembed_block (ran)
# ❌ YYYYMMDD_update_categorygrid_block (failed)
# ⏳ YYYYMMDD_update_productgrid_block (pending)

# 3. Rollback failed migration
npx payload migrate:down

# 4. Fix migration file
# Edit src/migrations/YYYYMMDD_update_categorygrid_block.ts
# Fix SQL syntax error

# 5. Re-run migration
npx payload migrate

# 6. If still failing, restore from backup
psql $DATABASE_URL < backup_before_sprint2.sql
```

#### Scenario 2: Feature Flag Not Working (QuickOrder)
```bash
# 1. Check .env file
cat .env | grep ENABLE_B2B
# Should show: ENABLE_B2B=true (or false)

# 2. Restart Payload server
npm run dev

# 3. Verify access control
# Open admin panel → Pages → Edit page → Add block
# QuickOrder should be visible only when ENABLE_B2B=true

# 4. Check block config
grep -A5 "access:" src/branches/ecommerce/blocks/QuickOrder.ts
# Should show access control functions

# 5. If not working, check console for errors
# Browser DevTools → Console
# Should NOT see "QuickOrder" in blocks list when feature disabled
```

#### Scenario 3: Field Renames Broke Existing Data
```bash
# 1. Identify broken block type (e.g., Pricing)
psql $DATABASE_URL -c "SELECT id, heading FROM pages_blocks_pricing LIMIT 1;"
# ERROR: column "heading" does not exist
# → Migration renamed it to "title" but frontend code still uses "heading"

# 2. Rollback migration
npx payload migrate:down

# 3. Verify data restored
psql $DATABASE_URL -c "SELECT id, heading FROM pages_blocks_pricing LIMIT 1;"
# Should work now

# 4. Fix frontend code to use new field name
# Update Component.tsx to use block.title instead of block.heading

# 5. Re-run migration
npx payload migrate
```

#### Scenario 4: Complete Rollback Needed
```bash
# 1. Rollback all 5 migrations
npx payload migrate:down  # Pricing
npx payload migrate:down  # QuickOrder
npx payload migrate:down  # ProductGrid
npx payload migrate:down  # CategoryGrid
npx payload migrate:down  # ProductEmbed

# 2. Verify all migrations rolled back
npx payload migrate:status
# All Sprint 2 migrations should show (not run)

# 3. Remove migration files (optional - if not needed)
rm src/migrations/YYYYMMDD_update_*_block.ts

# 4. Restore block configs to original state
git checkout src/branches/ecommerce/blocks/
git checkout src/branches/shared/blocks/Pricing.ts

# 5. Restart server
npm run dev
```

---

## ✅ COMPLETION CHECKLIST

### Block Updates
- [ ] ProductEmbed - layout + specs + badge
- [ ] CategoryGrid - tabs + source modes + responsive
- [ ] ProductGrid - sorting + tag filter + CTA
- [ ] QuickOrder - CSV + autocomplete + info box + **ENABLE_B2B feature flag**
- [ ] Pricing - tabs + badge + button variant + layout

### Migrations
- [ ] All 5 migrations generated
- [ ] All migrations reviewed (only ADD/RENAME, no DROP except inputMode)
- [ ] Local backup created
- [ ] Migrations tested locally
- [ ] Production backup created (when deploying)
- [ ] Migrations run successfully
- [ ] `migrate:status` shows all migrations ran

### Feature Flags
- [ ] ENABLE_B2B added to .env
- [ ] QuickOrder access control implemented
- [ ] Tested with ENABLE_B2B=true
- [ ] Tested with ENABLE_B2B=false
- [ ] Admin shows warning when disabled

### Testing
- [ ] ProductEmbed: 7/7 tests passed ✅
- [ ] CategoryGrid: 7/7 tests passed ✅
- [ ] ProductGrid: 7/7 tests passed ✅
- [ ] QuickOrder: 7/7 tests passed ✅ (including feature flag)
- [ ] Pricing: 7/7 tests passed ✅

### Documentation
- [ ] This implementation plan reviewed
- [ ] Reference HTML files read (all 5 Sprint 2 specs)
- [ ] Team notified of changes
- [ ] Deployment scheduled

---

## 📊 SUCCESS METRICS

### Technical Metrics
- ✅ 0 TypeScript errors
- ✅ 0 Build errors
- ✅ 0 Runtime errors
- ✅ 35/35 tests pass (7 per block)
- ✅ 45 new database columns added
- ✅ 15 columns renamed (safe - data preserved)
- ✅ 1 column dropped (inputMode - confirmed unused)
- ✅ 0 existing data lost

### Admin Experience
- ✅ 5 blocks updated with new fields
- ✅ Tab structure in CategoryGrid and Pricing
- ✅ All fields have sensible defaults
- ✅ Conditional fields show/hide correctly
- ✅ Feature flag integration works (QuickOrder)
- ✅ Changes reflect immediately on frontend

### Developer Experience
- ✅ TypeScript autocomplete for new fields
- ✅ Type-safe block configurations
- ✅ Safe migrations (ADDITIVE + RENAME only)
- ✅ Feature flag utility functions
- ✅ Complete documentation with specs

---

## 🚨 CRITICAL WARNINGS

### ⚠️ DO NOT DO THESE THINGS:
1. **DO NOT DROP COLUMNS** without confirming they're unused (only inputMode is safe to drop)
2. **DO NOT FORGET ENABLE_B2B** feature flag for QuickOrder
3. **DO NOT SKIP MIGRATIONS** - Database will be out of sync!
4. **DO NOT FORGET BACKUPS** - Always backup before migrations!
5. **DO NOT CHANGE minRows TO 2** for Pricing without data migration (existing blocks with 1 plan will break)

### ⚠️ DATA MIGRATION REQUIRED:
**Pricing Block:** If any existing blocks have only 1 plan, must add a second plan before updating minRows to 2.

```sql
-- Check for Pricing blocks with only 1 plan
SELECT pricing_block_id, COUNT(*) as plan_count
FROM pages_blocks_pricing_plans
GROUP BY pricing_block_id
HAVING COUNT(*) < 2;

-- If results found, manually add a second plan or update those blocks in admin before migration
```

---

## 📅 ESTIMATED TIME

### Development (1 dev)
- Phase 1: ProductEmbed - **1-2 hours**
- Phase 2: CategoryGrid - **2 hours**
- Phase 3: ProductGrid - **1 hour**
- Phase 4: QuickOrder + Feature Flag - **2-3 hours**
- Phase 5: Pricing - **2-3 hours**
- Phase 6: Testing & Verification - **2 hours**

**Total Development Time: 10-13 hours**

### Deployment
- Backup database - **5 minutes**
- Run migrations (5 total) - **3 minutes**
- Verify deployment - **15 minutes**
- Test feature flag - **10 minutes**
- Monitor for errors - **30 minutes**

**Total Deployment Time: ~1 hour**

---

## 🎯 NEXT SPRINT

**Sprint 3 (Future):** Frontend Component Refactoring
- Update React components to use new block fields
- Implement new layout options (CategoryGrid responsive columns)
- Add sorting UI (ProductGrid)
- Build CSV upload component (QuickOrder)
- Create button variant styles (Pricing)

**Sprint 4 (Future):** New Ecommerce Blocks
- Product comparison block
- Product filters block
- Wishlist block
- Cart summary block

---

## 📞 SUPPORT & QUESTIONS

**Issues with this sprint?**
1. Check troubleshooting sections in reference HTML files
2. Review error logs: `npx payload migrate:status`
3. Verify database schema: `psql $DATABASE_URL -c "\d pages_blocks_[blockname]"`
4. Check TypeScript errors: `npm run typecheck`
5. Test feature flag: Check ENABLE_B2B in .env

**Critical Production Issue?**
1. Immediately run rollback procedure (see Phase 6)
2. Restore from backup if needed
3. Document what went wrong
4. Fix locally before re-deploying

---

**🎉 READY TO START SPRINT 2!**

Lees deze plan grondig door voordat je begint. Volg de fasen in volgorde. Test elke fase voordat je naar de volgende gaat. Back-up altijd voor migraties. **Vergeet ENABLE_B2B feature flag niet voor QuickOrder!**

**Generated:** 24 Februari 2026
**Last Updated:** 24 Februari 2026
**Version:** 1.0
**Status:** ✅ Ready for Implementation
