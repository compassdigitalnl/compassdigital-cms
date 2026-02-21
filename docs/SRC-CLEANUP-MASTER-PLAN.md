# 🧹 SRC Cleanup & Migration Master Plan

**Status**: 📋 Ready for Implementation
**Priority**: 🔴 CRITICAL - Foundation for Future Development
**Estimated Time**: 12-16 hours
**Breaking Changes**: ❌ None (backward compatible migration)
**Created**: 21 February 2026

---

## 🎯 Executive Summary

The current `src/` directory has become disorganized with:
- **Duplicate collections structure** (`src/collections/` vs `src/branches/*/collections/`)
- **38+ blocks** in flat structure, many obsolete or duplicated
- **60+ components** not organized by branch
- **Legacy folders** (`heros/`, `fields/`, `contexts/`) that need evaluation
- **Inconsistent architecture** - some code migrated to branches, some not

This plan provides a **complete roadmap** to clean up the codebase, consolidate duplicates, remove obsolete code, and fully migrate to the vertical slice architecture.

---

## 📊 Current State Analysis

### Directory Structure Overview

```
src/
├── access/                    ✅ KEEP - Access control utilities
├── app/                       ⚠️  REORGANIZE - Route groups need cleanup
│   ├── (construction)/        ✅ GOOD - Branch-based routes
│   ├── (content)/             ⚠️  CONSOLIDATE to (shared)
│   ├── (ecommerce)/           ✅ GOOD - Branch-based routes
│   ├── (payload)/             ✅ KEEP - Payload admin
│   ├── (platform)/            ✅ GOOD - Platform routes
│   ├── (shared)/              ✅ GOOD - Shared routes
│   ├── [slug]/                ⚠️  MOVE to (shared)/[slug]
│   ├── api/                   ⚠️  REORGANIZE - Needs branch structure
│   └── tenant/                ✅ KEEP - Multi-tenant routing
│
├── blocks/                    🔴 CRITICAL - 38 blocks, many obsolete!
│   ├── Accordion/             ⚠️  EVALUATE - Rarely used?
│   ├── ArchiveBlock/          ❌ REMOVE - Deprecated
│   ├── Banner/                ❌ REMOVE - Deprecated
│   ├── BlogPreview/           ✅ KEEP - Active use
│   ├── Breadcrumb/            ⚠️  EVALUATE - Duplicate of component?
│   ├── CTA/                   ✅ KEEP - Consolidate with CallToAction
│   ├── CallToAction/          ⚠️  DUPLICATE - Merge with CTA
│   ├── Carousel/              ❌ REMOVE - Not used in ecommerce
│   ├── CategoryGrid/          🔵 MOVE to branches/ecommerce/blocks/
│   ├── Code/                  ⚠️  EVALUATE - Developer docs only?
│   ├── ComparisonTable/       ✅ KEEP - Used in ecommerce
│   ├── ContactFormBlock/      ✅ KEEP - Shared block
│   ├── Content/               ✅ KEEP - Core block
│   ├── FAQ/                   ✅ KEEP - Shared block
│   ├── Features/              ✅ KEEP - Shared block
│   ├── Form/                  ✅ KEEP - Shared block
│   ├── Hero/                  ✅ KEEP - Core block
│   ├── ImageGallery/          ✅ KEEP - Shared block
│   ├── InfoBox/               ⚠️  EVALUATE - Rarely used?
│   ├── LogoBar/               ✅ KEEP - Shared block
│   ├── Map/                   ✅ KEEP - Shared block
│   ├── MediaBlock/            ✅ KEEP - Core block
│   ├── Pricing/               ✅ KEEP - Shared block
│   ├── ProductEmbed/          🔵 MOVE to branches/ecommerce/blocks/
│   ├── ProductFilters/        🔵 MOVE to branches/ecommerce/blocks/
│   ├── ProductGrid/           🔵 MOVE to branches/ecommerce/blocks/
│   ├── QuickOrder/            🔵 MOVE to branches/ecommerce/blocks/
│   ├── SearchBar/             🔵 MOVE to branches/ecommerce/blocks/
│   ├── Services/              ⚠️  EVALUATE - Generic or construction?
│   ├── Spacer/                ✅ KEEP - Utility block
│   ├── Stats/                 ✅ KEEP - Shared block
│   ├── Team/                  ✅ KEEP - Shared block
│   ├── TestimonialsBlock/     ✅ KEEP - Shared block
│   ├── ThreeItemGrid/         ❌ REMOVE - Deprecated (use Grid)
│   ├── TopBar/                🔵 MOVE to branches/ecommerce/blocks/
│   ├── TwoColumn/             ⚠️  EVALUATE - Rarely used?
│   └── Video/                 ✅ KEEP - Shared block
│
├── branches/                  ✅ GOOD - Vertical slice architecture!
│   ├── construction/          ✅ Active development
│   │   ├── blocks/            ✅ 6 construction-specific blocks
│   │   └── collections/       ✅ 4 collections
│   ├── content/               ✅ Well organized
│   │   └── collections/       ✅ 5 collections
│   ├── ecommerce/             ✅ Well organized
│   │   ├── collections/       ✅ 19 collections
│   │   ├── components/        ❌ EMPTY - needs migration!
│   │   └── lib/               ❌ EMPTY - needs migration!
│   ├── marketplace/           ✅ Well organized
│   │   └── collections/       ✅ 3 collections
│   ├── platform/              ✅ Well organized
│   │   └── collections/       ✅ 3 collections
│   └── shared/                ✅ Well organized
│       └── collections/       ✅ 5 collections
│
├── collections/               🔴 DEPRECATED - Only 6 files left!
│   ├── Pages/                 🔵 MOVE to branches/shared/collections/
│   ├── Users/                 🔵 MOVE to branches/shared/collections/
│   └── shop/                  🔵 MOVE to branches/ecommerce/collections/
│       ├── CustomerGroups.ts
│       └── ProductCategories.ts
│
├── components/                ⚠️  REORGANIZE - 60+ components!
│   ├── AddToCartButton.tsx    🔵 MOVE to branches/ecommerce/components/
│   ├── OrderStatus/           🔵 MOVE to branches/ecommerce/components/
│   ├── ProductBadges/         🔵 MOVE to branches/ecommerce/components/
│   ├── checkout/              🔵 MOVE to branches/ecommerce/components/
│   ├── construction/          🔵 MOVE to branches/construction/components/
│   ├── platform/              🔵 MOVE to branches/platform/components/
│   ├── admin/                 ⚠️  EVALUATE - Platform or payload?
│   ├── Header/                ✅ KEEP - Shared
│   ├── Footer/                ✅ KEEP - Shared
│   ├── RichText/              ✅ KEEP - Shared
│   ├── Grid/                  ✅ KEEP - Shared
│   └── ... (see detailed list below)
│
├── contexts/                  ⚠️  EVALUATE - Only 1 file!
│   └── CartContext.tsx        🔵 MOVE to branches/ecommerce/contexts/
│
├── fields/                    ⚠️  EVALUATE - Generic field definitions
│   ├── hero.ts                ✅ KEEP - Used by Pages
│   ├── link.ts                ✅ KEEP - Shared utility
│   ├── linkGroup.ts           ✅ KEEP - Shared utility
│   └── sectionLabel.ts        ✅ KEEP - Shared utility
│
├── heros/                     🔴 DEPRECATED - Old hero system!
│   ├── HighImpact/            ❌ REMOVE - Replaced by blocks/Hero
│   ├── LowImpact/             ❌ REMOVE - Replaced by blocks/Hero
│   ├── MediumImpact/          ❌ REMOVE - Replaced by blocks/Hero
│   ├── RenderHero.tsx         ❌ REMOVE - No longer used
│   └── config.ts              ❌ REMOVE - No longer used
│
├── globals/                   ✅ KEEP - Global singletons
├── hooks/                     ✅ KEEP - React hooks
├── lib/                       ✅ KEEP - Core utilities
├── migrations/                ✅ KEEP - Database migrations
├── platform/                  🔴 DEPRECATED - Moved to branches/platform/
│   ├── api/                   🔵 MOVE to branches/platform/api/
│   ├── components/            🔵 MOVE to branches/platform/components/
│   ├── integrations/          🔵 MOVE to branches/platform/integrations/
│   └── services/              🔵 MOVE to branches/platform/services/
│
├── plugins/                   ✅ KEEP - Payload plugins
├── providers/                 ✅ KEEP - React context providers
├── scripts/                   ✅ KEEP - Utility scripts
├── styles/                    ✅ KEEP - Global styles
├── templates/                 ✅ KEEP - Email/page templates
└── utilities/                 ✅ KEEP - Core utilities
```

---

## 🔍 Detailed Component Analysis

### Ecommerce Components (Need Migration)

**Location**: `src/components/` → `src/branches/ecommerce/components/`

```
✅ AddToCartButton.tsx         - Active use in shop
✅ ProductBadges/              - Active use (NEW, stock badges)
✅ ProductDetailPage.tsx       - Active use
✅ ProductDetailWrapper.tsx    - Active use
✅ OrderStatus/                - Active use in account
✅ checkout/                   - Active use (checkout flow)
✅ CategoryPage.tsx            - Active use in shop
```

### Construction Components (Already Migrated!)

**Location**: `src/branches/construction/components/` ✅

The construction branch already has its own components - **NO ACTION NEEDED**.

### Platform Components (Partial Migration Needed)

**Location**: `src/components/platform/` → `src/branches/platform/components/`

```
✅ ClientSwitcher/             - Multi-tenant UI
✅ ... (other platform components)
```

### Shared Components (Keep in src/components/)

```
✅ Header/                     - Global header
✅ Footer/                     - Global footer
✅ RichText/                   - Rich text renderer
✅ Grid/                       - Layout grid
✅ Logo/                       - Site logo
✅ Link/                       - Custom link component
✅ Media/                      - Media renderer
✅ Message/                    - Toast messages
✅ LoadingSpinner/             - Loading indicator
✅ Analytics/                  - Analytics wrapper
✅ BeforeDashboard/            - Payload dashboard
✅ BeforeLogin/                - Payload login
✅ AdminBar/                   - Frontend admin bar
✅ AdminLogo/                  - Payload admin logo
✅ Icon.tsx                    - Icon component
✅ IconPicker.tsx              - Icon picker
✅ Breadcrumbs.tsx             - Breadcrumb navigation
✅ ErrorBoundary.tsx           - Error handling
```

### Obsolete Components (Can Be Removed)

```
❌ DynamicHeader.tsx           - Not used (use Header/)
❌ DynamicNav.tsx              - Not used (use Header/)
❌ CategoryTabs/               - Deprecated (use CategoryPage)
❌ CollectionArchive/          - Deprecated (use blocks)
❌ LegalLayout/                - Not used (use standard layout)
```

---

## 🧱 Block Analysis & Migration Strategy

### ✅ Shared Blocks (Keep in src/blocks/)

**Core Content Blocks** (Used across all branches):
```
✅ Hero                        - Primary hero block (219 lines)
✅ Content                     - Rich text content
✅ MediaBlock                  - Image/video display
✅ Features                    - Feature grid (192 lines)
✅ FAQ                         - FAQ accordion (83 lines)
✅ TestimonialsBlock           - Customer testimonials
✅ Team                        - Team member grid (106 lines)
✅ Stats                       - Statistics display
✅ LogoBar                     - Partner/client logos (125 lines)
✅ Pricing                     - Pricing tables (101 lines)
✅ Services                    - Service cards (can be shared)
✅ BlogPreview                 - Blog post preview (174 lines)
✅ ContactFormBlock            - Contact form (262 lines)
✅ Map                         - Embedded map
✅ ImageGallery                - Image gallery
✅ Video                       - Video embed
✅ Spacer                      - Layout spacer
✅ Form                        - Form builder (176 lines)
```

**Total Shared Blocks**: 18 blocks

### 🔵 Ecommerce Blocks (Move to branches/ecommerce/blocks/)

```
🔵 CategoryGrid               - Product category display (137 lines)
🔵 ProductGrid                - Product listing (273 lines)
🔵 ProductFilters             - Product filter sidebar (286 lines)
🔵 ProductEmbed               - Single product embed (172 lines)
🔵 SearchBar                  - Product search (307 lines)
🔵 QuickOrder                 - Quick order form (279 lines)
🔵 TopBar                     - Promotional top bar (94 lines)
🔵 ComparisonTable            - Product comparison (139 lines)
```

**Total Ecommerce Blocks**: 8 blocks

### ⚠️  Blocks to Evaluate

```
⚠️  Accordion                 - Rarely used? Check usage
⚠️  Breadcrumb                - Duplicate of component?
⚠️  InfoBox                   - Rarely used? Check usage
⚠️  TwoColumn                 - Rarely used? Use Grid instead?
⚠️  Code                      - Developer docs only?
```

### ❌ Deprecated Blocks (Remove)

```
❌ ArchiveBlock               - Replaced by ProductGrid/BlogPreview
❌ Banner                     - Replaced by Hero
❌ Carousel                   - Not used in ecommerce
❌ CallToAction               - Duplicate of CTA (merge)
❌ ThreeItemGrid              - Use Grid component instead
```

**Total Blocks to Remove**: 5 blocks

### 🎯 Final Block Count After Cleanup

```
Current:  38 blocks (src/blocks/)
Keep:     18 shared blocks
Move:      8 ecommerce blocks → branches/ecommerce/blocks/
Evaluate:  5 blocks (decide keep/remove)
Remove:    5 deprecated blocks
──────────────────────────────
Result:   18-23 shared blocks (depending on evaluation)
          + 8 ecommerce blocks (in branches/)
          + 6 construction blocks (in branches/)
          = 32-37 total blocks (better organized!)
```

---

## 🗂️ Migration Plan

### Phase 1: Cleanup Old Structures (2 hours)

#### 1.1 Remove Deprecated `heros/` Directory

**Why**: The old hero system has been replaced by the new `Hero` block.

```bash
# Verify no imports exist
grep -r "from.*heros" src/ --include="*.ts" --include="*.tsx"

# Remove directory
rm -rf src/heros/
```

**Files to Remove**:
- `src/heros/HighImpact/Component.tsx`
- `src/heros/LowImpact/Component.tsx`
- `src/heros/MediumImpact/Component.tsx`
- `src/heros/RenderHero.tsx`
- `src/heros/config.ts`

**Impact**: ✅ No breaking changes (not used anymore)

#### 1.2 Remove Deprecated Blocks

```bash
# Remove deprecated blocks
rm -rf src/blocks/ArchiveBlock/
rm -rf src/blocks/Banner/
rm -rf src/blocks/Carousel/
rm -rf src/blocks/ThreeItemGrid/

# Merge CallToAction into CTA (if both exist)
# TODO: Manual merge - check both implementations first
```

**Blocks to Remove**:
1. `ArchiveBlock` - Replaced by `ProductGrid` and `BlogPreview`
2. `Banner` - Replaced by `Hero` block
3. `Carousel` - Not used in modern ecommerce design
4. `ThreeItemGrid` - Use `Grid` component instead
5. `CallToAction` - Merge into `CTA` (consolidate)

**Before Removal**:
```bash
# Check for any usage (should return 0)
grep -r "blockType.*archiveBlock\|blockType.*banner\|blockType.*carousel" src/ --include="*.ts"
```

#### 1.3 Consolidate Duplicate Blocks

**CTA vs CallToAction**:
1. Compare both implementations
2. Keep the better one (likely `CTA`)
3. Update any references
4. Remove the other

```bash
# Find usage
grep -r "blockType.*cta\|blockType.*callToAction" src/ --include="*.ts"

# After consolidation
rm -rf src/blocks/CallToAction/  # or CTA, depending on which we keep
```

---

### Phase 2: Migrate Collections to Branches (3 hours)

#### 2.1 Complete Ecommerce Collections Migration

**Status**: ✅ 19/21 ecommerce collections already migrated!

**Remaining**: Move from `src/collections/shop/` to `src/branches/ecommerce/collections/`

```bash
# Move remaining shop collections
mv src/collections/shop/ProductCategories.ts src/branches/ecommerce/collections/
mv src/collections/shop/CustomerGroups.ts src/branches/ecommerce/collections/

# Remove empty shop directory
rmdir src/collections/shop/
```

**Update Import in `payload.config.ts`**:
```typescript
// BEFORE
import { ProductCategories } from '@/collections/shop/ProductCategories'
import { CustomerGroups } from '@/collections/shop/CustomerGroups'

// AFTER
import { ProductCategories } from '@/branches/ecommerce/collections/ProductCategories'
import { CustomerGroups } from '@/branches/ecommerce/collections/CustomerGroups'
```

**Update `src/branches/ecommerce/index.ts`**:
```typescript
export { ProductCategories } from './collections/ProductCategories'
export { CustomerGroups } from './collections/CustomerGroups'

export const ecommerceCollections = [
  Products,
  ProductCategories,  // Added
  CustomerGroups,     // Added
  Orders,
  // ... rest
]
```

#### 2.2 Migrate Shared Collections

**Move**: `src/collections/Pages/` and `src/collections/Users/` to `src/branches/shared/collections/`

```bash
# Move Pages collection
mv src/collections/Pages/ src/branches/shared/collections/Pages/

# Move Users collection
mv src/collections/Users/ src/branches/shared/collections/Users/
```

**Update `payload.config.ts`**:
```typescript
// BEFORE
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'

// AFTER
import { Pages } from '@/branches/shared/collections/Pages'
import { Users } from '@/branches/shared/collections/Users'
```

**Update `src/branches/shared/index.ts`**:
```typescript
export { Pages } from './collections/Pages'
export { Users } from './collections/Users'
export { Media } from './collections/Media'
export { Partners } from './collections/Partners'
export { ServicesCollection } from './collections/ServicesCollection'
export { FormSubmissions } from './collections/FormSubmissions'
export { Notifications } from './collections/Notifications'

export const sharedCollections = [
  Pages,
  Users,
  Media,
  Partners,
  ServicesCollection,
  FormSubmissions,
  Notifications,
]
```

#### 2.3 Remove Empty `src/collections/` Directory

```bash
# After all migrations, this directory should be empty
ls -la src/collections/  # Should show empty

# Create deprecation notice
cat > src/collections/README.md << 'EOF'
# ⚠️ DEPRECATED: Collections Moved

All collections have been migrated to the vertical slice architecture.

**New Locations**:
- Ecommerce: `src/branches/ecommerce/collections/`
- Content: `src/branches/content/collections/`
- Marketplace: `src/branches/marketplace/collections/`
- Shared: `src/branches/shared/collections/`
- Platform: `src/branches/platform/collections/`
- Construction: `src/branches/construction/collections/`

See: `docs/ARCHITECTURE-MASTER-PLAN.md`
EOF

# Optionally remove the directory entirely after a transition period
# rm -rf src/collections/
```

---

### Phase 3: Migrate Ecommerce Blocks (2-3 hours)

#### 3.1 Create Ecommerce Blocks Directory

```bash
# Directory already exists (empty)
ls -la src/branches/ecommerce/blocks/  # Should exist but be empty
```

#### 3.2 Move Ecommerce-Specific Blocks

```bash
# Move blocks
mv src/blocks/CategoryGrid/ src/branches/ecommerce/blocks/
mv src/blocks/ProductGrid/ src/branches/ecommerce/blocks/
mv src/blocks/ProductFilters/ src/branches/ecommerce/blocks/
mv src/blocks/ProductEmbed/ src/branches/ecommerce/blocks/
mv src/blocks/SearchBar/ src/branches/ecommerce/blocks/
mv src/blocks/QuickOrder/ src/branches/ecommerce/blocks/
mv src/blocks/TopBar/ src/branches/ecommerce/blocks/
mv src/blocks/ComparisonTable/ src/branches/ecommerce/blocks/
```

#### 3.3 Create Ecommerce Blocks Index

**Create**: `src/branches/ecommerce/blocks/index.ts`

```typescript
// Ecommerce-specific blocks
export { CategoryGrid } from './CategoryGrid/CategoryGrid'
export { ProductGrid } from './ProductGrid/ProductGrid'
export { ProductFilters } from './ProductFilters/ProductFilters'
export { ProductEmbed } from './ProductEmbed/ProductEmbed'
export { SearchBar } from './SearchBar/SearchBar'
export { QuickOrder } from './QuickOrder/QuickOrder'
export { TopBar } from './TopBar/TopBar'
export { ComparisonTable } from './ComparisonTable/ComparisonTable'

import { CategoryGrid } from './CategoryGrid/CategoryGrid'
import { ProductGrid } from './ProductGrid/ProductGrid'
import { ProductFilters } from './ProductFilters/ProductFilters'
import { ProductEmbed } from './ProductEmbed/ProductEmbed'
import { SearchBar } from './SearchBar/SearchBar'
import { QuickOrder } from './QuickOrder/QuickOrder'
import { TopBar } from './TopBar/TopBar'
import { ComparisonTable } from './ComparisonTable/ComparisonTable'

export const ecommerceBlocks = [
  CategoryGrid,
  ProductGrid,
  ProductFilters,
  ProductEmbed,
  SearchBar,
  QuickOrder,
  TopBar,
  ComparisonTable,
]
```

#### 3.4 Update Block References

**Update** in collections that use these blocks (e.g., `Pages.ts`):

```typescript
// BEFORE
import { CategoryGrid } from '@/blocks/CategoryGrid/CategoryGrid'
import { ProductGrid } from '@/blocks/ProductGrid/ProductGrid'

// AFTER
import { CategoryGrid } from '@/branches/ecommerce/blocks/CategoryGrid/CategoryGrid'
import { ProductGrid } from '@/branches/ecommerce/blocks/ProductGrid/ProductGrid'

// OR (if using feature flags)
import { ecommerceBlocks } from '@/branches/ecommerce/blocks'

// In blocks array
blocks: [
  // Shared blocks
  ...sharedBlocks,

  // Ecommerce blocks (conditionally included)
  ...(features.shop ? ecommerceBlocks : []),
]
```

---

### Phase 4: Migrate Components to Branches (3-4 hours)

#### 4.1 Migrate Ecommerce Components

**Create**: `src/branches/ecommerce/components/` (already exists but empty)

```bash
# Move ecommerce components
mv src/components/AddToCartButton.tsx src/branches/ecommerce/components/
mv src/components/ProductBadges/ src/branches/ecommerce/components/
mv src/components/ProductDetailPage.tsx src/branches/ecommerce/components/
mv src/components/ProductDetailWrapper.tsx src/branches/ecommerce/components/
mv src/components/OrderStatus/ src/branches/ecommerce/components/
mv src/components/checkout/ src/branches/ecommerce/components/
mv src/components/CategoryPage.tsx src/branches/ecommerce/components/

# Move ecommerce-specific UI components
mv src/components/addresses/ src/branches/ecommerce/components/  # Address management
```

**Create**: `src/branches/ecommerce/components/index.ts`

```typescript
export { default as AddToCartButton } from './AddToCartButton'
export { default as ProductBadges } from './ProductBadges'
export { default as ProductDetailPage } from './ProductDetailPage'
export { default as ProductDetailWrapper } from './ProductDetailWrapper'
export { default as OrderStatus } from './OrderStatus'
export { default as CategoryPage } from './CategoryPage'
// ... etc
```

#### 4.2 Migrate Construction Components

**Status**: ✅ Already done! Components are in `src/branches/construction/components/`

**No Action Needed** - Construction components are already properly organized.

#### 4.3 Migrate Platform Components

```bash
# Move platform components
mv src/components/platform/ src/branches/platform/components/

# Optionally move admin components to platform
# (if they're platform-specific and not Payload admin)
# mv src/components/admin/ src/branches/platform/components/admin/
```

#### 4.4 Migrate Platform Code from Old Location

**Current**: `src/platform/` contains API, components, integrations, services

**Target**: Move to `src/branches/platform/`

```bash
# Move platform subdirectories
mv src/platform/api/ src/branches/platform/api/
mv src/platform/integrations/ src/branches/platform/integrations/
mv src/platform/services/ src/branches/platform/services/

# Note: src/platform/components/ may already be moved in step 4.3
# If not:
mv src/platform/components/ src/branches/platform/components/

# Remove old platform directory
rmdir src/platform/

# Create deprecation notice
cat > src/platform/README.md << 'EOF'
# ⚠️ DEPRECATED: Platform Code Moved

Platform code has been migrated to `src/branches/platform/`

**New Structure**:
- API: `src/branches/platform/api/`
- Components: `src/branches/platform/components/`
- Integrations: `src/branches/platform/integrations/`
- Services: `src/branches/platform/services/`
- Collections: `src/branches/platform/collections/`

See: `docs/ARCHITECTURE-MASTER-PLAN.md`
EOF
```

**Update Imports**:

Find all imports from `@/platform/`:
```bash
grep -r "from '@/platform/" src/ --include="*.ts" --include="*.tsx"
```

Replace with `@/branches/platform/`:
```bash
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|@/platform/|@/branches/platform/|g" {} +
```

#### 4.5 Move CartContext to Ecommerce

**Current**: `src/contexts/CartContext.tsx` (only file in contexts/)

**Target**: `src/branches/ecommerce/contexts/CartContext.tsx`

```bash
# Create contexts directory
mkdir -p src/branches/ecommerce/contexts/

# Move CartContext
mv src/contexts/CartContext.tsx src/branches/ecommerce/contexts/

# Remove old contexts directory
rmdir src/contexts/
```

**Update Imports**:
```bash
# Find all imports
grep -r "from '@/contexts/CartContext" src/ --include="*.ts" --include="*.tsx"

# Replace
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' "s|@/contexts/CartContext|@/branches/ecommerce/contexts/CartContext|g" {} +
```

**Create**: `src/branches/ecommerce/contexts/index.ts`
```typescript
export { CartProvider, useCart } from './CartContext'
export type { CartItem, CartContextType } from './CartContext'
```

---

### Phase 5: Reorganize App Routes (2 hours)

#### 5.1 Consolidate (content) into (shared)

**Current**:
```
src/app/(content)/        - blog, faq, merken
src/app/(shared)/         - account, login, privacy, etc.
```

**Target**: All non-branch-specific routes in `(shared)`

```bash
# Move (content) routes to (shared)
mv src/app/\(content\)/blog src/app/\(shared\)/blog
mv src/app/\(content\)/faq src/app/\(shared\)/faq
mv src/app/\(content\)/merken src/app/\(shared\)/merken

# Remove empty (content) directory
rmdir src/app/\(content\)/
```

**Update** `layout.tsx` if needed - ensure (shared) layout handles all these routes.

#### 5.2 Move [slug] Route to (shared)

**Current**: `src/app/[slug]/` (top level)

**Target**: `src/app/(shared)/[slug]/`

```bash
# Move dynamic slug route
mv src/app/\[slug\]/ src/app/\(shared\)/\[slug\]/
```

**Reasoning**: Dynamic pages should be part of the shared layout structure.

#### 5.3 Reorganize API Routes (Optional - Advanced)

**Current**: `src/app/api/` (flat structure with some subdirectories)

**Proposed** (OPTIONAL - can be a future phase):
```
src/app/api/
├── ecommerce/           # Ecommerce APIs
│   ├── products/
│   ├── cart/
│   ├── orders/
│   └── ...
├── platform/            # Platform APIs (already exists)
├── ai/                  # AI APIs (already exists)
├── shared/              # Shared APIs
│   ├── contact/
│   ├── health/
│   ├── og/
│   └── search/
└── ...
```

**Note**: This is a larger refactor. Consider doing this in a separate phase or skipping if the current API structure works well enough.

---

### Phase 6: Update Imports & References (2 hours)

#### 6.1 Create Import Update Script

**Create**: `scripts/update-imports.mjs`

```javascript
#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

// Import path mappings
const replacements = [
  // Collections
  { from: '@/collections/Pages', to: '@/branches/shared/collections/Pages' },
  { from: '@/collections/Users', to: '@/branches/shared/collections/Users' },
  { from: '@/collections/shop/ProductCategories', to: '@/branches/ecommerce/collections/ProductCategories' },
  { from: '@/collections/shop/CustomerGroups', to: '@/branches/ecommerce/collections/CustomerGroups' },

  // Blocks
  { from: '@/blocks/CategoryGrid', to: '@/branches/ecommerce/blocks/CategoryGrid' },
  { from: '@/blocks/ProductGrid', to: '@/branches/ecommerce/blocks/ProductGrid' },
  { from: '@/blocks/ProductFilters', to: '@/branches/ecommerce/blocks/ProductFilters' },
  { from: '@/blocks/ProductEmbed', to: '@/branches/ecommerce/blocks/ProductEmbed' },
  { from: '@/blocks/SearchBar', to: '@/branches/ecommerce/blocks/SearchBar' },
  { from: '@/blocks/QuickOrder', to: '@/branches/ecommerce/blocks/QuickOrder' },
  { from: '@/blocks/TopBar', to: '@/branches/ecommerce/blocks/TopBar' },
  { from: '@/blocks/ComparisonTable', to: '@/branches/ecommerce/blocks/ComparisonTable' },

  // Components
  { from: '@/components/AddToCartButton', to: '@/branches/ecommerce/components/AddToCartButton' },
  { from: '@/components/ProductBadges', to: '@/branches/ecommerce/components/ProductBadges' },
  { from: '@/components/checkout', to: '@/branches/ecommerce/components/checkout' },
  { from: '@/components/platform/', to: '@/branches/platform/components/' },

  // Contexts
  { from: '@/contexts/CartContext', to: '@/branches/ecommerce/contexts/CartContext' },

  // Platform
  { from: '@/platform/', to: '@/branches/platform/' },
]

console.log('🔄 Updating imports...\n')

// Find all TypeScript/TSX files
const files = execSync('find src -type f \\( -name "*.ts" -o -name "*.tsx" \\)', { encoding: 'utf-8' })
  .trim()
  .split('\n')

let updatedFiles = 0

files.forEach((file) => {
  let content = readFileSync(file, 'utf-8')
  let modified = false

  replacements.forEach(({ from, to }) => {
    const regex = new RegExp(from.replace(/\//g, '\\/'), 'g')
    if (content.includes(from)) {
      content = content.replace(regex, to)
      modified = true
    }
  })

  if (modified) {
    writeFileSync(file, content)
    updatedFiles++
    console.log(`✅ ${file}`)
  }
})

console.log(`\n✨ Updated ${updatedFiles} files`)
```

**Run**:
```bash
chmod +x scripts/update-imports.mjs
node scripts/update-imports.mjs
```

#### 6.2 Manual Review

After automated updates, manually check:
1. `src/payload.config.ts` - All imports correct
2. `src/app/` routes - All imports correct
3. `src/branches/*/index.ts` - Export all collections/blocks

```bash
# Check for any remaining old imports
grep -r "@/collections/" src/ --include="*.ts" --include="*.tsx"
grep -r "@/platform/" src/ --include="*.ts" --include="*.tsx"
grep -r "@/contexts/" src/ --include="*.ts" --include="*.tsx"
```

---

### Phase 7: Testing & Validation (1-2 hours)

#### 7.1 Build Test

```bash
# Clean build
rm -rf .next/
npm run build

# Should complete without errors
```

#### 7.2 Type Check

```bash
npm run typecheck

# Should pass without errors
```

#### 7.3 Development Server

```bash
npm run dev

# Test:
# - Homepage loads
# - Ecommerce pages work
# - Construction pages work
# - Admin panel loads
# - Collections appear correctly
```

#### 7.4 E2E Tests (if available)

```bash
npm run test:e2e

# Should pass all tests
```

#### 7.5 Manual Testing Checklist

- [ ] Homepage renders correctly
- [ ] Product pages load (ecommerce)
- [ ] Cart functionality works
- [ ] Checkout flow works
- [ ] Blog pages load
- [ ] Construction pages load (if enabled)
- [ ] Admin panel:
  - [ ] All collections visible
  - [ ] Can create/edit products
  - [ ] Can create/edit pages
  - [ ] Blocks appear in block selector
- [ ] Search functionality works
- [ ] Contact form works

---

## 📋 Final Checklist

### Removed:
- [ ] `src/heros/` directory (7 files)
- [ ] Deprecated blocks (5 blocks):
  - [ ] ArchiveBlock
  - [ ] Banner
  - [ ] Carousel
  - [ ] ThreeItemGrid
  - [ ] CallToAction (merged into CTA)
- [ ] `src/collections/` (empty or deprecated)
- [ ] `src/contexts/` directory (moved to ecommerce)
- [ ] `src/platform/` directory (moved to branches)
- [ ] Obsolete components (if identified)

### Migrated:
- [ ] Collections:
  - [ ] Pages → shared/collections/
  - [ ] Users → shared/collections/
  - [ ] ProductCategories → ecommerce/collections/
  - [ ] CustomerGroups → ecommerce/collections/
- [ ] Blocks:
  - [ ] 8 ecommerce blocks → ecommerce/blocks/
- [ ] Components:
  - [ ] 7+ ecommerce components → ecommerce/components/
  - [ ] Platform components → platform/components/
  - [ ] CartContext → ecommerce/contexts/
- [ ] Platform code:
  - [ ] api/ → branches/platform/api/
  - [ ] integrations/ → branches/platform/integrations/
  - [ ] services/ → branches/platform/services/
- [ ] Routes:
  - [ ] (content)/ → (shared)/
  - [ ] [slug]/ → (shared)/[slug]/

### Updated:
- [ ] `payload.config.ts` - All import paths
- [ ] All component imports
- [ ] All block references
- [ ] Branch index files (exports)
- [ ] tsconfig paths (if needed)

### Tested:
- [ ] Build passes
- [ ] Type check passes
- [ ] Dev server runs
- [ ] All routes work
- [ ] Admin panel works
- [ ] E2E tests pass (if available)

---

## 🎯 Success Metrics

### Code Organization (Before → After):

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Collections in `src/collections/` | 6 files | 0 (moved to branches) | 100% |
| Blocks in `src/blocks/` | 38 blocks | 18-23 shared blocks | 40-47% reduction |
| Components in `src/components/` | 60+ components | 30-40 shared components | 33-50% reduction |
| Deprecated directories | 3 (heros, platform, contexts) | 0 | 100% cleanup |
| Ecommerce code in branches | 19 collections only | Collections + Blocks + Components + Contexts | Complete |
| Platform code in branches | Partial | Complete | 100% |

### Developer Experience:

- ✅ Clear separation of concerns
- ✅ Easy to find related code
- ✅ Feature flags work per branch
- ✅ Consistent architecture across all branches
- ✅ No duplicate/obsolete code
- ✅ Scalable for future branches

---

## 🚀 Future Phases (Post-Cleanup)

### Phase 8: Advanced Features (Optional)

1. **Code Splitting by Branch**
   - Implement dynamic imports for branch-specific code
   - Reduce initial bundle size

2. **Branch-Specific Styles**
   - Move ecommerce styles to `branches/ecommerce/styles/`
   - Create consistent styling architecture

3. **Shared Component Library**
   - Consolidate common UI patterns
   - Create reusable design system

4. **API Route Organization**
   - Reorganize `src/app/api/` by branch
   - Implement consistent API patterns

---

## 🔥 Quick Start Guide

### For Immediate Implementation:

```bash
# 1. Create a new branch
git checkout -b cleanup/src-migration

# 2. Run phases in order:
# Phase 1: Cleanup (2 hours)
./scripts/phase1-cleanup.sh

# Phase 2: Migrate Collections (3 hours)
./scripts/phase2-collections.sh

# Phase 3: Migrate Blocks (2-3 hours)
./scripts/phase3-blocks.sh

# Phase 4: Migrate Components (3-4 hours)
./scripts/phase4-components.sh

# Phase 5: Reorganize Routes (2 hours)
./scripts/phase5-routes.sh

# Phase 6: Update Imports (2 hours)
node scripts/update-imports.mjs

# Phase 7: Test (1-2 hours)
npm run build && npm run typecheck && npm run dev

# 3. Commit & Test
git add .
git commit -m "refactor: complete src/ cleanup and branch migration"
npm run build
npm run test

# 4. Merge to main
git checkout main
git merge cleanup/src-migration
```

---

## 📞 Support & Questions

**Questions?** Check:
- `docs/ARCHITECTURE-MASTER-PLAN.md` - Overall architecture
- `docs/BRANCHES_README.md` - Branch-specific documentation
- Ask the team in Slack/Discord

**Issues?** Create a GitHub issue with:
- Which phase you're on
- Error message
- Steps to reproduce

---

**Created**: 21 February 2026
**Last Updated**: 21 February 2026
**Status**: ✅ Ready for Implementation
**Estimated Completion**: 12-16 hours
**Priority**: 🔴 CRITICAL
