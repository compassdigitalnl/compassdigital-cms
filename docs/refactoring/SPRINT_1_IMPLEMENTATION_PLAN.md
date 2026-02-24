# 🎨 SPRINT 1: Design System - Design Tokens Implementation

**Sprint:** 1 van X
**Datum:** 24 Februari 2026
**Status:** ⏳ READY TO START
**Impact:** 🟡 Medium - Geen breaking changes, alleen additive changes
**Database Impact:** ✅ Safe - Alleen ADD COLUMN statements, geen DROP/ALTER existing data

---

## 📋 EXECUTIVE SUMMARY

### Doel Sprint 1
Implementatie van complete design system in Payload CMS:

**Part A: Base Design Tokens (Theme Global)**
1. **Colors** - 16 kleuren tokens (primary, status, neutrals)
2. **Spacing** - 9 spacing tokens (4px grid systeem, read-only)
3. **Typography** - 11 typografie tokens (fonts + type scale)
4. **Visual** - 14 visuele tokens (radius, shadows, z-index)

**Part B: Multi-Tenant Theme Engine (Themes Collection)**
5. **Themes Collection** - 10 vertical-specific theme overrides
   - Beauty/Salon, Bouw, Horeca, Zorg, Events, Accommodatie, Makelaar, Automotive, Professional Services, Medisch B2B (default)

### Waarom deze aanpak?
- **Modular Architecture:** Elke design token groep in eigen file (`src/globals/colors/index.ts`)
- **Multi-Tenant Support:** 10 industry verticals met eigen branding via CSS custom properties
- **Database-safe:** Alleen nieuwe kolommen toevoegen, geen bestaande data wijzigen
- **Type-safe:** TypeScript interfaces voor alle tokens
- **CMS-controlled:** Admin kan design tokens aanpassen per vertical
- **CSS Variables:** Automatische CSS custom property generation in Next.js layout
- **Zero JavaScript:** Theme switching via `data-theme` attribute (pure CSS)

### Wat er NIET gebeurt (veiligheid)
- ❌ **GEEN bestaande data verwijderd**
- ❌ **GEEN bestaande velden gewijzigd**
- ❌ **GEEN database DROP/TRUNCATE statements**
- ❌ **GEEN breaking changes in frontend**
- ❌ **GEEN changes aan existing Theme global structure**
- ✅ **ALLEEN nieuwe velden toegevoegd** via `ALTER TABLE ... ADD COLUMN`

---

## 🎯 SCOPE & DELIVERABLES

### In Scope (Sprint 1)

**Part A: Base Design Tokens (Theme Global)**
- [ ] 4 design token tab files maken (`colors/`, `spacing/`, `typography/`, `visual/`)
- [ ] TypeScript type definitions voor base tokens
- [ ] Database migrations (4x ADD COLUMN statements voor Theme global)
- [ ] CSS variable generation voor base tokens
- [ ] Admin panel configuratie (Theme global tabs)

**Part B: Multi-Tenant Theme Engine**
- [ ] Themes collection maken (`src/collections/Themes/index.ts`)
- [ ] TypeScript interfaces voor Themes collection
- [ ] Database migration voor Themes table (CREATE TABLE)
- [ ] CSS variable generation voor vertical overrides
- [ ] Theme switcher component (optional preview)
- [ ] Seed script voor 10 default verticals
- [ ] `data-theme` attribute support in layout

**Testing & Documentation**
- [ ] Testing checklist (10 tests totaal)
- [ ] Rollback procedure
- [ ] Complete documentation

### Out of Scope (Later Sprints)
- ⏭️ Block refactoring (Sprint 2)
- ⏭️ Component migration (Sprint 3)
- ⏭️ Global consolidation (Sprint 4)
- ⏭️ Vertical-specific template customization (Sprint 5+)

---

## 🗄️ DATABASE MIGRATION STRATEGY

### Cruciale Regel #1: ADDITIVE ONLY!
**Alle migrations zijn ADDITIVE - geen data wordt verwijderd of gewijzigd!**

```sql
-- ✅ CORRECT: ADD COLUMN (additive, safe)
ALTER TABLE "theme" ADD COLUMN "navy" text DEFAULT '#0A1628';

-- ❌ WRONG: DROP COLUMN (destructive, NOT ALLOWED)
ALTER TABLE "theme" DROP COLUMN "old_field"; -- NEVER DO THIS!

-- ❌ WRONG: ALTER COLUMN (risky, NOT ALLOWED)
ALTER TABLE "theme" ALTER COLUMN "existing_field" TYPE integer; -- NEVER DO THIS!
```

### Migration Files (5 total)

**Part A: Base Design Tokens (4 migrations)**
1. `YYYYMMDD_add_colors_to_theme.ts` - 16 color columns
2. `YYYYMMDD_add_spacing_to_theme.ts` - 9 spacing columns
3. `YYYYMMDD_add_typography_to_theme.ts` - 11 typography columns
4. `YYYYMMDD_add_visual_to_theme.ts` - 14 visual columns

**Part B: Multi-Tenant Themes (1 migration)**
5. `YYYYMMDD_create_themes_collection.ts` - CREATE TABLE for themes collection

**Total Changes:**
- 50 nieuwe kolommen aan `theme` table (base design tokens)
- 1 nieuwe `themes` table (multi-tenant verticals)

### Migration Validation Checklist
Voordat elke migration wordt gerun:
- [ ] Check: Alleen `ADD COLUMN` statements, geen `DROP` of `ALTER`
- [ ] Check: Alle columns hebben `DEFAULT` values
- [ ] Check: Geen `NOT NULL` zonder default (zou errors geven op existing rows)
- [ ] Check: Test migration eerst op LOCAL database copy
- [ ] Check: Backup van production database voordat migration wordt gerun

---

## 📁 FILE STRUCTURE

### New Files (29 total)

#### Part A: Design Token Tabs (4 files)
```
src/globals/
├── colors/
│   └── index.ts          # Colors tab (16 fields)
├── spacing/
│   └── index.ts          # Spacing tab (9 fields, all read-only)
├── typography/
│   └── index.ts          # Typography tab (11 fields)
└── visual/
    └── index.ts          # Visual tab (14 fields)
```

#### Part B: Themes Collection (1 file)
```
src/collections/
└── Themes/
    └── index.ts          # Multi-tenant themes collection (10 verticals)
```

#### TypeScript Types (1 file)
```
src/types/
└── theme.ts              # Theme interfaces (EXTEND existing, not replace!)
                          # - ThemeColors, ThemeSpacing, ThemeTypography, ThemeVisual
                          # - ThemeConfig (for Themes collection)
```

#### Theme Utilities (2 files)
```
src/lib/theme/
├── generateThemeCSS.ts   # CSS variable generation from theme data
└── index.ts              # Re-exports (optional)
```

#### Components (1 file)
```
src/components/
└── ThemeSwitcher.tsx     # Optional: Preview theme switching in admin
```

#### Scripts (1 file)
```
src/scripts/
└── seedThemes.ts         # Seed 10 default vertical themes
```

#### Documentation (4 files)
```
docs/refactoring/
├── SPRINT_1_IMPLEMENTATION_PLAN.md    # This file
├── sprint-1/
│   ├── colors.html                     # Reference (already exists)
│   ├── spacing.html                    # Reference (already exists)
│   ├── typography.html                 # Reference (already exists)
│   └── visual.html                     # Reference (already exists)
```

#### Migrations (5 files - auto-generated)
```
src/migrations/
├── YYYYMMDD_HHMMSS_add_colors_to_theme.ts
├── YYYYMMDD_HHMMSS_add_spacing_to_theme.ts
├── YYYYMMDD_HHMMSS_add_typography_to_theme.ts
├── YYYYMMDD_HHMMSS_add_visual_to_theme.ts
└── YYYYMMDD_HHMMSS_create_themes_collection.ts
```

### Modified Files (4 files)

#### 1. Theme Global (ADD tabs, don't replace!)
```typescript
// src/globals/Theme.ts
// BEFORE:
export const Theme: GlobalConfig = {
  slug: 'theme',
  fields: [
    // ... existing fields (KEEP THESE!)
  ],
}

// AFTER:
import { Colors } from './colors'
import { Spacing } from './spacing'
import { Typography } from './typography'
import { Visual } from './visual'

export const Theme: GlobalConfig = {
  slug: 'theme',
  fields: [
    // ... existing fields (KEEP THESE!) <-- IMPORTANT!
    {
      type: 'tabs',
      tabs: [
        Colors,      // NEW
        Spacing,     // NEW
        Typography,  // NEW
        Visual,      // NEW
      ],
    },
  ],
}
```

#### 2. TypeScript Types (EXTEND, don't replace!)
```typescript
// src/types/theme.ts
// ADD these interfaces (don't remove existing ones!)
export interface ThemeColors { /* ... */ }
export interface ThemeSpacing { /* ... */ }
export interface ThemeTypography { /* ... */ }
export interface ThemeVisual { /* ... */ }

// EXTEND Theme interface (don't replace!)
export interface Theme {
  // ... existing properties (KEEP THESE!)
  colors?: ThemeColors        // NEW
  spacing?: ThemeSpacing      // NEW
  typography?: ThemeTypography // NEW
  visual?: ThemeVisual        // NEW
}
```

#### 3. Payload Config (ADD Themes collection)
```typescript
// payload.config.ts
// BEFORE:
export default buildConfig({
  collections: [
    // ... existing collections
  ],
})

// AFTER:
import { Themes } from './collections/Themes'

export default buildConfig({
  collections: [
    Themes,      // NEW: Multi-tenant themes collection
    // ... existing collections
  ],
})
```

#### 4. Root Layout (ADD CSS var generation for base tokens + vertical overrides)
```typescript
// src/app/layout.tsx
// ADD theme fetching + CSS variable generation
// (See detailed implementation in Phase 4 and Phase 7)
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Design Token Tab Files (1-2 hours)
**Goal:** Create 4 modular tab files for design tokens

**Files to create:**
1. `src/globals/colors/index.ts` (16 fields)
2. `src/globals/spacing/index.ts` (9 fields, all `readOnly: true`)
3. `src/globals/typography/index.ts` (11 fields)
4. `src/globals/visual/index.ts` (14 fields)

**Template for each file:**
```typescript
import { Tab } from 'payload/types'

export const Colors: Tab = {
  label: 'Colors',
  fields: [
    {
      type: 'collapsible',
      label: 'Primary Colors',
      fields: [
        {
          name: 'navy',
          type: 'text',
          label: 'Navy',
          defaultValue: '#0A1628',
          validate: (val) => {
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color (e.g. #0A1628)'
            }
            return true
          },
        },
        // ... 15 more color fields
      ],
    },
  ],
}
```

**Checklist:**
- [ ] All fields have `defaultValue` set
- [ ] Color fields have hex validation
- [ ] Spacing fields have `readOnly: true` (locked!)
- [ ] Number fields have `min`/`max` constraints where applicable
- [ ] All fields have descriptive `admin.description`

---

### Phase 2: TypeScript Type Definitions (30 min)
**Goal:** Add type-safe interfaces for all design tokens

**File:** `src/types/theme.ts`

**Important:** Check if this file already exists!
- If **exists:** ADD new interfaces, DON'T delete existing ones
- If **NOT exists:** Create new file

**Implementation:**
```typescript
// src/types/theme.ts

// ═══════════════════════════════════════════════════════════
// NEW INTERFACES (ADD THESE)
// ═══════════════════════════════════════════════════════════

export interface ThemeColors {
  // Primary Colors
  navy: string
  navyLight: string
  teal: string
  tealLight: string
  tealDark: string

  // Status Colors
  green: string
  coral: string
  amber: string
  blue: string
  purple: string

  // Neutral Colors
  white: string
  bg: string
  grey: string
  greyMid: string
  greyDark: string
  text: string
}

export interface ThemeSpacing {
  sp1: number   // 4px
  sp2: number   // 8px
  sp3: number   // 12px
  sp4: number   // 16px
  sp6: number   // 24px
  sp8: number   // 32px
  sp12: number  // 48px
  sp16: number  // 64px
  sp20: number  // 80px
}

export interface ThemeTypography {
  // Font Families
  fontBody: string
  fontDisplay: string
  fontMono: string

  // Type Scale (sizes in px)
  heroSize: number
  sectionSize: number
  cardTitleSize: number
  bodyLgSize: number
  bodySize: number
  smallSize: number
  labelSize: number
  microSize: number
}

export interface ThemeVisual {
  // Border Radius
  radiusSm: number    // 8px
  radiusMd: number    // 12px
  radiusLg: number    // 16px
  radiusXl: number    // 20px
  radiusFull: number  // 9999px

  // Box Shadows
  shadowSm: string
  shadowMd: string
  shadowLg: string
  shadowXl: string

  // Z-index Scale
  zDropdown: number   // 100
  zSticky: number     // 200
  zOverlay: number    // 300
  zModal: number      // 400
  zToast: number      // 500
}

// ═══════════════════════════════════════════════════════════
// EXTEND THEME INTERFACE (ADD NEW PROPERTIES)
// ═══════════════════════════════════════════════════════════

export interface Theme {
  id: string
  // ... keep all existing properties here! ...

  // NEW: Add these design token properties
  colors?: ThemeColors
  spacing?: ThemeSpacing
  typography?: ThemeTypography
  visual?: ThemeVisual

  updatedAt: string
  createdAt: string
}
```

**Checklist:**
- [ ] All interfaces exported
- [ ] Optional properties (`?`) used (data might not exist on existing theme records!)
- [ ] Comments added for clarity
- [ ] Existing Theme interface properties preserved

---

### Phase 3: Update Theme Global Config (15 min)
**Goal:** Import and register all design token tabs

**File:** `src/globals/Theme.ts`

**CRITICAL:** Check current Theme.ts structure first!
- If it uses `fields: []` → Add tabs inside fields
- If it uses `tabs: []` → Add new tabs to existing tabs array
- **NEVER delete existing fields/tabs!**

**Implementation:**
```typescript
// src/globals/Theme.ts
import { GlobalConfig } from 'payload/types'

// NEW IMPORTS
import { Colors } from './colors'
import { Spacing } from './spacing'
import { Typography } from './typography'
import { Visual } from './visual'

export const Theme: GlobalConfig = {
  slug: 'theme',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // ═══════════════════════════════════════════════════════════
    // EXISTING FIELDS (KEEP ALL OF THESE!!!)
    // ═══════════════════════════════════════════════════════════
    // ... any existing fields stay here ...

    // ═══════════════════════════════════════════════════════════
    // NEW: Design Token Tabs
    // ═══════════════════════════════════════════════════════════
    {
      type: 'tabs',
      tabs: [
        Colors,      // Chapter 1: Colors (16 fields)
        Typography,  // Chapter 2: Typography (11 fields)
        Spacing,     // Chapter 3: Spacing (9 fields, read-only)
        Visual,      // Chapter 4: Visual (14 fields)
      ],
    },
  ],
}
```

**Checklist:**
- [ ] All 4 tabs imported
- [ ] Tabs added in logical order (Colors → Typography → Spacing → Visual)
- [ ] Existing fields preserved
- [ ] No syntax errors (run `npm run build` to check)

---

### Phase 4: CSS Variable Generation in Layout (1 hour)
**Goal:** Generate CSS custom properties from Payload theme data

**File:** `src/app/layout.tsx` (or wherever root layout is)

**Implementation:**
```typescript
// src/app/layout.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Theme } from '@/types/theme'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: configPromise })

  // Fetch theme global
  const theme = await payload.findGlobal({
    slug: 'theme',
  }) as Theme

  // ═══════════════════════════════════════════════════════════
  // Generate CSS Variables
  // ═══════════════════════════════════════════════════════════

  // 1. Colors (16 variables)
  const colors = theme.colors || {}
  const colorVars = `
    --navy: ${colors.navy || '#0A1628'};
    --navy-light: ${colors.navyLight || '#121F33'};
    --teal: ${colors.teal || '#00897B'};
    --teal-light: ${colors.tealLight || '#26A69A'};
    --teal-dark: ${colors.tealDark || '#00695C'};
    --green: ${colors.green || '#00C853'};
    --coral: ${colors.coral || '#FF6B6B'};
    --amber: ${colors.amber || '#F59E0B'};
    --blue: ${colors.blue || '#2196F3'};
    --purple: ${colors.purple || '#7C3AED'};
    --white: ${colors.white || '#FAFBFC'};
    --bg: ${colors.bg || '#F5F7FA'};
    --grey: ${colors.grey || '#E8ECF1'};
    --grey-mid: ${colors.greyMid || '#94A3B8'};
    --grey-dark: ${colors.greyDark || '#64748B'};
    --text: ${colors.text || '#1E293B'};
  `

  // 2. Spacing (9 variables)
  const spacing = theme.spacing || {}
  const spacingVars = `
    --sp-1: ${spacing.sp1 || 4}px;
    --sp-2: ${spacing.sp2 || 8}px;
    --sp-3: ${spacing.sp3 || 12}px;
    --sp-4: ${spacing.sp4 || 16}px;
    --sp-6: ${spacing.sp6 || 24}px;
    --sp-8: ${spacing.sp8 || 32}px;
    --sp-12: ${spacing.sp12 || 48}px;
    --sp-16: ${spacing.sp16 || 64}px;
    --sp-20: ${spacing.sp20 || 80}px;
  `

  // 3. Typography (11 variables)
  const typography = theme.typography || {}
  const typographyVars = `
    --font: ${typography.fontBody || "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif"};
    --font-display: ${typography.fontDisplay || "'DM Serif Display', Georgia, serif"};
    --font-mono: ${typography.fontMono || "'JetBrains Mono', 'Courier New', monospace"};
    --text-hero: ${typography.heroSize || 36}px;
    --text-section: ${typography.sectionSize || 24}px;
    --text-card-title: ${typography.cardTitleSize || 18}px;
    --text-body-lg: ${typography.bodyLgSize || 15}px;
    --text-body: ${typography.bodySize || 13}px;
    --text-small: ${typography.smallSize || 12}px;
    --text-label: ${typography.labelSize || 10}px;
    --text-micro: ${typography.microSize || 8}px;
  `

  // 4. Visual (14 variables)
  const visual = theme.visual || {}
  const visualVars = `
    --r-sm: ${visual.radiusSm || 8}px;
    --r-md: ${visual.radiusMd || 12}px;
    --r-lg: ${visual.radiusLg || 16}px;
    --r-xl: ${visual.radiusXl || 20}px;
    --r-full: ${visual.radiusFull || 9999}px;
    --sh-sm: ${visual.shadowSm || '0 1px 3px rgba(10, 22, 40, 0.06)'};
    --sh-md: ${visual.shadowMd || '0 4px 20px rgba(10, 22, 40, 0.08)'};
    --sh-lg: ${visual.shadowLg || '0 8px 40px rgba(10, 22, 40, 0.12)'};
    --sh-xl: ${visual.shadowXl || '0 20px 60px rgba(10, 22, 40, 0.16)'};
    --z-dropdown: ${visual.zDropdown || 100};
    --z-sticky: ${visual.zSticky || 200};
    --z-overlay: ${visual.zOverlay || 300};
    --z-modal: ${visual.zModal || 400};
    --z-toast: ${visual.zToast || 500};
  `

  // Combine all CSS variables
  const allVars = `${colorVars}${spacingVars}${typographyVars}${visualVars}`

  return (
    <html lang="nl">
      <head>
        {/* Inject design tokens as CSS variables */}
        <style dangerouslySetInnerHTML={{
          __html: `:root { ${allVars} }`
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Checklist:**
- [ ] All 50 CSS variables generated
- [ ] Fallback values provided for all variables
- [ ] Optional chaining used (`theme.colors?.navy`)
- [ ] No errors if theme data is missing

---

### Phase 5: Database Migrations (30 min)
**Goal:** Generate and run 4 database migrations safely

**Step 5a: Generate Migrations**

```bash
# 1. Generate colors migration
npx payload migrate:create add_colors_to_theme

# 2. Generate spacing migration
npx payload migrate:create add_spacing_to_theme

# 3. Generate typography migration
npx payload migrate:create add_typography_to_theme

# 4. Generate visual migration
npx payload migrate:create add_visual_to_theme
```

**Step 5b: Review Generated Migrations**

Check each migration file in `src/migrations/`:

```typescript
// Example: YYYYMMDD_HHMMSS_add_colors_to_theme.ts

import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    -- ✅ VERIFY: Only ADD COLUMN statements!
    ALTER TABLE "theme" ADD COLUMN "navy" text DEFAULT '#0A1628';
    ALTER TABLE "theme" ADD COLUMN "navy_light" text DEFAULT '#121F33';
    ALTER TABLE "theme" ADD COLUMN "teal" text DEFAULT '#00897B';
    -- ... 13 more ADD COLUMN statements
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    -- Rollback: remove columns (only if needed)
    ALTER TABLE "theme" DROP COLUMN "navy";
    ALTER TABLE "theme" DROP COLUMN "navy_light";
    -- ...
  `)
}
```

**CRITICAL VALIDATION CHECKLIST:**
- [ ] Only `ALTER TABLE ... ADD COLUMN` statements (no DROP, no ALTER existing columns)
- [ ] All columns have `DEFAULT` values
- [ ] No `NOT NULL` without default
- [ ] Column names match TypeScript interface (camelCase → snake_case conversion)

**Step 5c: Test Migrations Locally**

```bash
# 1. Backup local database first
pg_dump $DATABASE_URL > backup_before_sprint1.sql

# 2. Run migrations
npx payload migrate

# 3. Verify columns exist
npx payload migrate:status

# Expected output:
# ✅ YYYYMMDD_HHMMSS_add_colors_to_theme (ran)
# ✅ YYYYMMDD_HHMMSS_add_spacing_to_theme (ran)
# ✅ YYYYMMDD_HHMMSS_add_typography_to_theme (ran)
# ✅ YYYYMMDD_HHMMSS_add_visual_to_theme (ran)

# 4. Check database schema
psql $DATABASE_URL -c "\d theme"

# Expected: 50 new columns added
```

**Step 5d: Run on Production (when ready)**

```bash
# 1. Backup production database
pg_dump $PRODUCTION_DATABASE_URL > backup_prod_before_sprint1_YYYYMMDD.sql

# 2. Run migrations (will execute all pending migrations)
npx payload migrate

# 3. Verify success
npx payload migrate:status
```

**Checklist:**
- [ ] Local migrations tested successfully
- [ ] Production backup created
- [ ] All 4 migrations ran without errors
- [ ] No existing data was modified (verify with sample query)

---

### Phase 6: Testing & Verification (1 hour)
**Goal:** Verify all design tokens work correctly

#### Test 1: Admin Panel Access
```bash
# Navigate to admin panel
open http://localhost:3020/admin/globals/theme
```

**Expected:**
- ✅ Theme global exists
- ✅ 4 new tabs visible: Colors, Typography, Spacing, Visual
- ✅ All fields have default values
- ✅ Spacing fields are read-only (🔒 locked)
- ✅ Can save changes without errors

#### Test 2: CSS Variables Generated
```bash
# Open frontend
open http://localhost:3020

# Inspect page in DevTools
# Check <head> for <style>:root { ... }</style>
```

**Expected:**
- ✅ All 50 CSS variables present in `:root` style block
- ✅ Values match defaults (or custom values if changed in admin)

#### Test 3: TypeScript Type Safety
```typescript
// Test in any component
import type { Theme } from '@/types/theme'

const theme: Theme = await payload.findGlobal({ slug: 'theme' })

// Should have autocomplete for:
theme.colors?.navy          // ✅ string
theme.spacing?.sp4          // ✅ number
theme.typography?.heroSize  // ✅ number
theme.visual?.radiusMd      // ✅ number
```

**Expected:**
- ✅ No TypeScript errors
- ✅ Autocomplete works for all properties

#### Test 4: Database Schema Verification
```bash
psql $DATABASE_URL -c "SELECT column_name, data_type, column_default
  FROM information_schema.columns
  WHERE table_name = 'theme'
  ORDER BY ordinal_position;"
```

**Expected:**
- ✅ 50 new columns exist (16 colors + 9 spacing + 11 typography + 14 visual)
- ✅ All have default values set
- ✅ Correct data types (text for colors/shadows, integer for numbers)

#### Test 5: Existing Data Preserved
```bash
# If you have existing theme data, verify it's still there
psql $DATABASE_URL -c "SELECT * FROM theme LIMIT 1;"
```

**Expected:**
- ✅ Existing columns still have data
- ✅ New columns have default values
- ✅ No NULL values in required columns

#### Test 6: Frontend Component Usage
```typescript
// Test in a component (e.g., Card)
export function Card() {
  return (
    <div style={{
      padding: 'var(--sp-6)',           // 24px
      borderRadius: 'var(--r-md)',       // 12px
      boxShadow: 'var(--sh-sm)',         // subtle elevation
      backgroundColor: 'var(--white)',   // #FAFBFC
    }}>
      Card content
    </div>
  )
}
```

**Expected:**
- ✅ Computed styles show correct values (24px, 12px, etc.)
- ✅ No console errors

#### Test 7: Rollback Test (Optional but Recommended)
```bash
# Test rollback of migrations (on local only!)
npx payload migrate:down

# Verify columns removed
psql $DATABASE_URL -c "\d theme"

# Re-run migrations
npx payload migrate
```

**Expected:**
- ✅ Rollback works (columns removed)
- ✅ Re-run works (columns re-added with same default values)

#### Test 8: Themes Collection Admin
```bash
# Navigate to themes collection
open http://localhost:3020/admin/collections/themes
```

**Expected:**
- ✅ Themes collection visible in admin
- ✅ All 10 seeded themes present
- ✅ Can edit theme (e.g., change Beauty primary color)
- ✅ Validation works (hex colors, required fields)

#### Test 9: Vertical Theme Overrides
```bash
# Test theme switching
open http://localhost:3020

# In browser DevTools console:
document.documentElement.setAttribute('data-theme', 'beauty')
# Inspect button element - background should be pink (#E91E63)

document.documentElement.setAttribute('data-theme', 'horeca')
# Inspect button element - background should be gold (#C9A84C)
```

**Expected:**
- ✅ Theme switcher changes `data-theme` attribute
- ✅ CSS variables update instantly
- ✅ All components adopt new theme colors
- ✅ No JavaScript errors

#### Test 10: Multi-Tenant CSS Generation
```bash
# Inspect <head> for theme CSS
# Check for [data-theme="beauty"] { ... } blocks
```

**Expected:**
- ✅ CSS generated for all 10 verticals
- ✅ Each vertical has correct color overrides
- ✅ Custom colors included (e.g., --pink for Beauty)
- ✅ No duplicate CSS rules

---

### Phase 7: Multi-Tenant Themes Collection (1-2 hours)
**Goal:** Create Themes collection for 10 industry verticals

**Step 7a: Create Themes Collection**

**File:** `src/collections/Themes/index.ts`

See `docs/refactoring/sprint-1/themes.html` for complete implementation (lines 625-946).

**Key Features:**
- 5 tabs: Basic Info, Color Overrides, Typography, Visual, Metadata
- Fields:
  - `name` (text) - "Beauty/Salon", "Horeca", etc.
  - `slug` (text, unique) - "beauty", "horeca", etc. (used in `data-theme` attribute)
  - `isDefault` (checkbox) - Mark default vertical
  - `primaryColor` (text) - Hex color to override `--teal`
  - `darkSurface` (text) - Hex color to override `--navy`
  - `bodyFont` (text) - Font family override
  - `customColors` (array) - Additional vertical-specific colors
  - `templateCount`, `uniqueComponentCount`, `status` (metadata)

**Checklist:**
- [ ] All fields have proper validation (hex color validator)
- [ ] Optional fields (overrides only when needed)
- [ ] Admin descriptions explain purpose
- [ ] Public read access for frontend

**Step 7b: Create CSS Generation Utility**

**File:** `src/lib/theme/generateThemeCSS.ts`

See `docs/refactoring/sprint-1/themes.html` lines 1038-1078 for complete code.

```typescript
export function generateThemeCSS(theme: ThemeConfig): string {
  const vars: string[] = []

  // Color overrides
  if (theme.primaryColor) vars.push(`--teal: ${theme.primaryColor};`)
  if (theme.darkSurface) vars.push(`--navy: ${theme.darkSurface};`)
  // ... more overrides

  // Custom colors
  if (theme.customColors) {
    theme.customColors.forEach(({ tokenName, tokenValue }) => {
      vars.push(`--${tokenName}: ${tokenValue};`)
    })
  }

  return `[data-theme="${theme.slug}"] {\n  ${vars.join('\n  ')}\n}`
}
```

**Step 7c: Update Root Layout**

Extend Phase 4's layout.tsx to also fetch and generate vertical theme CSS:

```typescript
// Fetch all active themes
const { docs: themes } = await payload.find({
  collection: 'themes',
  where: { status: { equals: 'active' } },
})

// Generate CSS for all themes
const themeCSS = themes.map(generateThemeCSS).join('\n\n')

// Find default theme
const defaultTheme = themes.find(t => t.isDefault)

return (
  <html data-theme={defaultTheme?.slug || 'medisch'}>
    <head>
      {/* Base tokens from Phase 4 */}
      <style dangerouslySetInnerHTML={{ __html: `:root { ${baseTokens} }` }} />
      {/* Vertical overrides */}
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
    </head>
    <body>{children}</body>
  </html>
)
```

**Step 7d: Create Theme Switcher (Optional)**

**File:** `src/components/ThemeSwitcher.tsx`

See `docs/refactoring/sprint-1/themes.html` lines 1127-1164 for complete code.

Client component that changes `data-theme` attribute on `<html>` element.

**Checklist:**
- [ ] Themes collection created with all fields
- [ ] CSS generation utility works
- [ ] Layout generates CSS for all active themes
- [ ] Theme switcher component created (optional)

---

### Phase 8: Seed Default Themes (30 min)
**Goal:** Populate 10 default vertical themes

**File:** `src/scripts/seedThemes.ts`

See `docs/refactoring/sprint-1/themes.html` lines 1179-1400 for complete implementation with all 10 verticals.

**Default Themes:**
1. **Medisch B2B** (default) - Teal (#00897B), Plus Jakarta Sans
2. **Beauty/Salon** - Pink (#E91E63), DM Sans
3. **Bouw** - Blue (#2196F3), DM Sans
4. **Horeca** - Gold (#C9A84C), DM Sans
5. **Zorg/Fysio** - Green (#4CAF50), DM Sans
6. **Events** - Purple (#7C3AED), DM Sans
7. **Accommodatie** - Cyan (#00BCD4), DM Sans
8. **Makelaar** - Indigo (#3F51B5), DM Sans (status: development)
9. **Automotive** - Orange (#FF5722), DM Sans (status: development)
10. **Professional Services** - Blue Grey (#607D8B), DM Sans (status: development)

**Run seed script:**
```bash
npx ts-node src/scripts/seedThemes.ts
```

**Expected output:**
```
🌱 Seeding themes...
✅ Created theme: Medisch B2B
✅ Created theme: Beauty / Salon
✅ Created theme: Bouw
✅ Created theme: Horeca
✅ Created theme: Zorg / Fysio
✅ Created theme: Events
✅ Created theme: Accommodatie
⏭️  Skipped (already exists): Makelaar
⏭️  Skipped (already exists): Automotive
⏭️  Skipped (already exists): Professional Services
✨ Theme seeding complete!
```

**Checklist:**
- [ ] Seed script created with all 10 verticals
- [ ] Script checks for existing themes (no duplicates)
- [ ] All themes have proper metadata (templateCount, uniqueComponentCount, status)
- [ ] Default theme marked with `isDefault: true`
- [ ] Script ran successfully

---

## 🔙 ROLLBACK PROCEDURE

### If Something Goes Wrong

#### Scenario 1: Migration Failed Halfway
```bash
# 1. Check migration status
npx payload migrate:status

# 2. Manually fix failed migration SQL
# Edit the migration file and remove problematic statements

# 3. Re-run migration
npx payload migrate

# 4. If still failing, restore from backup
psql $DATABASE_URL < backup_before_sprint1.sql
```

#### Scenario 2: CSS Variables Not Appearing
```bash
# 1. Check theme data exists
psql $DATABASE_URL -c "SELECT * FROM theme LIMIT 1;"

# 2. Check layout.tsx fetches theme correctly
# 3. Verify no TypeScript errors
npm run typecheck

# 4. Restart dev server
npm run dev
```

#### Scenario 3: Admin Panel Not Showing Tabs
```bash
# 1. Verify Theme.ts imports all tabs
grep -r "import.*Colors" src/globals/Theme.ts

# 2. Check for syntax errors
npm run build

# 3. Clear Payload cache
rm -rf .next .payload-cache
npm run dev
```

#### Scenario 4: Complete Rollback Needed
```bash
# 1. Rollback all migrations
npx payload migrate:down
npx payload migrate:down
npx payload migrate:down
npx payload migrate:down

# 2. Verify migrations rolled back
npx payload migrate:status

# 3. Remove design token tabs from Theme.ts
# (comment out or remove the tabs section)

# 4. Restart server
npm run dev
```

---

## ✅ COMPLETION CHECKLIST

### Phase 1: Design Token Files
- [ ] `src/globals/colors/index.ts` created (16 fields)
- [ ] `src/globals/spacing/index.ts` created (9 fields, all read-only)
- [ ] `src/globals/typography/index.ts` created (11 fields)
- [ ] `src/globals/visual/index.ts` created (14 fields)
- [ ] All fields have default values
- [ ] All fields have descriptions

### Phase 2: TypeScript Types
- [ ] `src/types/theme.ts` created or extended
- [ ] `ThemeColors` interface added (16 properties)
- [ ] `ThemeSpacing` interface added (9 properties)
- [ ] `ThemeTypography` interface added (11 properties)
- [ ] `ThemeVisual` interface added (14 properties)
- [ ] `Theme` interface extended with new properties
- [ ] No TypeScript errors (`npm run typecheck`)

### Phase 3: Theme Global Update
- [ ] `src/globals/Theme.ts` updated
- [ ] All 4 tabs imported
- [ ] Tabs added to fields array
- [ ] Existing fields preserved
- [ ] Build succeeds (`npm run build`)

### Phase 4: CSS Variable Generation
- [ ] `src/app/layout.tsx` updated
- [ ] Theme fetching added
- [ ] All 50 CSS variables generated
- [ ] Fallback values provided
- [ ] No errors if theme data missing

### Phase 5: Database Migrations
- [ ] 4 migrations generated
- [ ] All migrations reviewed (only ADD COLUMN)
- [ ] Local backup created
- [ ] Migrations tested locally
- [ ] Production backup created (when deploying)
- [ ] Migrations run successfully
- [ ] `migrate:status` shows all migrations ran

### Phase 6: Testing & Verification
- [ ] Test 1: Admin panel access ✅
- [ ] Test 2: CSS variables generated ✅
- [ ] Test 3: TypeScript type safety ✅
- [ ] Test 4: Database schema verified ✅
- [ ] Test 5: Existing data preserved ✅
- [ ] Test 6: Frontend component usage ✅
- [ ] Test 7: Rollback test passed ✅

### Documentation
- [ ] This implementation plan reviewed
- [ ] Reference HTML files read (colors, spacing, typography, visual)
- [ ] Team notified of changes
- [ ] Deployment scheduled

---

## 📊 SUCCESS METRICS

### Technical Metrics
- ✅ 0 TypeScript errors
- ✅ 0 Build errors
- ✅ 0 Runtime errors
- ✅ 100% test coverage (10/10 tests pass)
- ✅ 50 new database columns added (Theme global)
- ✅ 1 new database table created (Themes collection)
- ✅ 50+ CSS variables generated (base tokens + vertical overrides)
- ✅ 10 vertical themes seeded
- ✅ 0 existing data lost

### Admin Experience
- ✅ 4 new design token tabs accessible (Theme global)
- ✅ 1 new Themes collection for multi-tenant management
- ✅ All fields have sensible defaults
- ✅ Spacing fields locked (read-only) to prevent accidents
- ✅ Changes reflect immediately on frontend (after save + refresh)
- ✅ 10 pre-configured verticals ready to use

### Developer Experience
- ✅ TypeScript autocomplete for all design tokens
- ✅ CSS variables available in all components
- ✅ Zero JavaScript theme switching (pure CSS via `data-theme`)
- ✅ Modular file structure (easy to maintain)
- ✅ Complete documentation with reference HTML files

### Multi-Tenant Support
- ✅ 10 industry verticals supported (7 active, 3 in development)
- ✅ Instant theme switching via `data-theme` attribute
- ✅ No component code changes needed for vertical customization
- ✅ Shared component library (156+ components work across all verticals)

---

## 🚨 CRITICAL WARNINGS

### ⚠️ DO NOT DO THESE THINGS:
1. **DO NOT DROP COLUMNS** - This will delete data!
2. **DO NOT ALTER EXISTING COLUMNS** - This can corrupt data!
3. **DO NOT REMOVE EXISTING THEME FIELDS** - Existing sites depend on them!
4. **DO NOT SKIP MIGRATIONS** - Database will be out of sync!
5. **DO NOT FORGET BACKUPS** - Always backup before migrations!
6. **DO NOT CHANGE SPACING VALUES** - They are locked for a reason!

### ⚠️ DATA LOSS PREVENTION:
- **Always backup database** before running migrations
- **Test migrations locally** before production
- **Verify existing data** after migrations run
- **Have rollback plan** ready before starting

---

## 📅 ESTIMATED TIME

### Development (1 dev)

**Part A: Base Design Tokens**
- Phase 1: Design Token Files - **1-2 hours**
- Phase 2: TypeScript Types - **30 minutes**
- Phase 3: Theme Global Update - **15 minutes**
- Phase 4: CSS Variable Generation - **1 hour**
- Phase 5: Database Migrations - **30 minutes**

**Part B: Multi-Tenant Themes**
- Phase 6: Testing & Verification (base tokens) - **1 hour**
- Phase 7: Themes Collection + CSS Generation - **1-2 hours**
- Phase 8: Seed Default Themes - **30 minutes**
- Phase 9: Final Testing (multi-tenant) - **1 hour**

**Total Development Time: 6-8 hours**

### Deployment
- Backup database - **5 minutes**
- Run migrations (5 total) - **3 minutes**
- Run seed script - **1 minute**
- Verify deployment - **15 minutes**
- Monitor for errors - **30 minutes**

**Total Deployment Time: ~1 hour**

---

## 🎯 NEXT SPRINT

**Sprint 2 (Future):** Block Refactoring
- Refactor existing blocks to use design tokens
- Migrate hardcoded colors/spacing to CSS variables
- Update block admin UI to be token-aware

**Sprint 3 (Future):** Component Migration
- Update all components to use design tokens
- Remove hardcoded styles
- Implement vertical-specific overrides

---

## 📞 SUPPORT & QUESTIONS

**Issues with this sprint?**
1. Check troubleshooting sections in reference HTML files
2. Review error logs: `npx payload migrate:status`
3. Verify database schema: `psql $DATABASE_URL -c "\d theme"`
4. Check TypeScript errors: `npm run typecheck`
5. Create GitHub issue with error details

**Critical Production Issue?**
1. Immediately run rollback procedure
2. Restore from backup if needed
3. Document what went wrong
4. Fix locally before re-deploying

---

**🎉 READY TO START SPRINT 1!**

Read this plan thoroughly before starting. Follow phases in order. Test each phase before moving to next. Always backup before migrations.

**Generated:** 24 Februari 2026
**Last Updated:** 24 Februari 2026
**Version:** 1.0
**Status:** ✅ Ready for Implementation
