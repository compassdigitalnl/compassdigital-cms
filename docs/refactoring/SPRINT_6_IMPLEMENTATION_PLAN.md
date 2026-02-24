# Sprint 6 Implementation Plan

**Date:** February 24, 2026
**Sprint:** 6 of 10
**Status:** Ready for Implementation
**Blocks:** 5 (B12, B15, B18, B19, B26)

---

## Overview

Sprint 6 focuses on **utility and navigation blocks** that enhance content layout, user experience, and information architecture:

- **B12 Blog Preview** - Blog post grid with thumbnails
- **B15 Comparison** - Feature comparison tables
- **B18 InfoBox** - Status notification callouts
- **B19 Banner** - Top announcement/promo banners
- **B26 Spacer** - Vertical spacing control

**Total Implementation Time:** ~3-4 hours
**Complexity:** Medium (rich text, relationships, client components)

---

## Block Specifications

### B12: Blog Preview Block

**Category:** Content Display
**Location:** `src/branches/shared/blocks/BlogPreview/`

**Features:**
- **Grid Layouts:** 2 or 3 columns
- **Post Relationship:** Select 2-6 published blog posts
- **Display Options:**
  - Post thumbnail with category badge overlay
  - Title (DM Serif Display, 18px)
  - Optional excerpt (13px, grey-dark, line-clamp-2)
  - Published date with calendar icon
  - Optional read time calculation (e.g., "5 min")
  - "Lees meer" link with arrow icon
- **Header:** Optional section title + description
- **Responsive:** 3 cols → 2 @900px → 1 @640px

**Fields:**
```typescript
{
  title?: string
  description?: string
  columns: '2' | '3'  // default: '3'
  posts: Relationship[]  // relationTo: 'posts', min: 2, max: 6
  showExcerpt: boolean  // default: true
  showReadTime: boolean  // default: false
  showCategory: boolean  // default: true
}
```

**Key Implementation Notes:**
- Requires `Posts` collection with fields: `title`, `slug`, `excerpt`, `thumbnail`, `category`, `publishedAt`, `content`
- Must populate relationship with `depth: 1` in page query
- Read time calculation: `content.split(/\s+/).length / 200` words per minute
- Category badge: absolute positioned, dark backdrop blur

**Database Tables:**
- `pages_blocks_blogpreview`
- `pages_blocks_blogpreview_posts_rels` (relationship junction table)

---

### B15: Comparison Table Block

**Category:** Interactive Tables
**Location:** `src/branches/shared/blocks/Comparison/`

**Features:**
- **Columns:** 2-4 comparison columns (plans/products)
- **Column Configuration:**
  - Name (e.g., "Basic", "Pro", "Enterprise")
  - Price (e.g., "€29/maand", "Op maat")
  - Featured flag (highlights column with teal background)
- **Feature Rows:**
  - Feature label (e.g., "Email support", "Producten")
  - Values per column: Check mark (✓), X mark (✗), or custom text (e.g., "100", "Onbeperkt")
- **Layout:** Fixed 200px for feature labels, equal width for plan columns
- **Responsive:** Desktop table → Mobile stacked cards

**Fields:**
```typescript
{
  title: string  // required
  description?: string
  columns: [{  // min: 2, max: 4
    name: string  // required
    price: string  // required
    featured: boolean  // default: false
  }]
  rows: [{  // min: 1
    feature: string  // required
    values: [{  // must match column count
      type: 'check' | 'x' | 'text'
      text?: string  // if type === 'text'
    }]
  }]
}
```

**Key Implementation Notes:**
- Dynamic grid columns: `grid-template-columns: 200px repeat(${columns.length}, 1fr)`
- Validate row values count === columns count
- Featured column gets `bg-teal-glow` (rgba(0,137,123,0.04))
- Mobile view hides desktop table, shows stacked cards per column

**Database Tables:**
- `pages_blocks_comparison`
- `pages_blocks_comparison_columns`
- `pages_blocks_comparison_rows`
- `pages_blocks_comparison_rows_values`

---

### B18: InfoBox Block

**Category:** Status Notifications
**Location:** `src/branches/shared/blocks/InfoBox/`

**Features:**
- **Variants:** 4 color-coded types
  - `info` (blue) - General info, tips, documentation
  - `success` (green) - Confirmations, completed actions
  - `warning` (amber) - Cautions, important notices
  - `error` (coral) - Errors, failures, critical issues
- **Content:**
  - Lucide icon (auto-default per variant or custom)
  - Title (bold, 14px, variant color)
  - Description (Lexical rich text with bold/italic/links/code)
- **Behavior:**
  - Dismissible (optional close button)
  - Persistent (localStorage dismissal tracking)
  - Storage key (unique identifier for dismissal)
- **Design:**
  - Max width: narrow (640px), wide (900px), full
  - Margin top/bottom: none, sm (12px), md (24px), lg (48px)
  - Border-left accent (3px, variant color)

**Fields:**
```typescript
{
  // Tab 1: Content
  variant: 'info' | 'success' | 'warning' | 'error'  // required
  icon?: string  // Lucide icon name (auto if empty)
  title: string  // required
  description: RichText  // required (Lexical)

  // Tab 2: Behavior
  dismissible: boolean  // default: false
  persistent?: boolean  // if dismissible
  storageKey?: string  // required if persistent

  // Tab 3: Design
  maxWidth: 'narrow' | 'wide' | 'full'  // default: 'wide'
  marginTop: 'none' | 'sm' | 'md' | 'lg'  // default: 'md'
  marginBottom: 'none' | 'sm' | 'md' | 'lg'  // default: 'md'
}
```

**Key Implementation Notes:**
- Use Lexical editor with features: Bold, Italic, Link, InlineCode
- Variant config mapping (TypeScript):
  ```typescript
  {
    info: { bgColor: 'bg-blue-50', borderColor: 'border-blue-500', iconColor: 'text-blue-500', defaultIcon: 'info' },
    success: { bgColor: 'bg-green-50', borderColor: 'border-green-500', iconColor: 'text-green-500', defaultIcon: 'check-circle' },
    warning: { bgColor: 'bg-amber-50', borderColor: 'border-amber-500', iconColor: 'text-amber-500', defaultIcon: 'alert-triangle' },
    error: { bgColor: 'bg-coral-50', borderColor: 'border-coral-500', iconColor: 'text-coral-500', defaultIcon: 'x-circle' }
  }
  ```
- Client component (`'use client'`) for dismissible functionality
- localStorage: `infobox-${storageKey}` = `'true'`

**Database Tables:**
- `pages_blocks_infobox`

**Theme Colors Needed:**
- Add to `tailwind.config.js`: blue-50/500/900, green-50/500/900, amber-50/500/900, coral-50/500/900

---

### B19: Banner Block

**Category:** Announcements
**Location:** `src/branches/shared/blocks/Banner/`

**Features:**
- **Variants:** 3 gradient backgrounds
  - `announcement` (navy) - General updates, features
  - `promo` (teal) - Promotions, sales, offers
  - `warning` (amber) - Maintenance, important notices
- **Content:**
  - Message text (max 150 chars recommended)
  - Icon (Lucide: bell, gift, alert-triangle, info, zap, star, none)
  - Optional CTA link (text, URL, newTab flag)
- **Behavior:**
  - Dismissible (close button with localStorage)
  - Dismissal key (unique identifier)
  - Sticky (position: sticky; top: 0; z-index: 100)
  - Date range (showFrom, showUntil)
- **Layout:**
  - Full-width horizontal bar
  - Centered content (max-width: 1000px)
  - Icon + Message + Link in horizontal flex
  - Close button (absolute right)
- **Responsive:** Desktop horizontal → Mobile vertical stack, icon hidden

**Fields:**
```typescript
{
  // Tab 1: Content
  variant: 'announcement' | 'promo' | 'warning'  // required
  message: string  // required, maxLength: 150
  icon?: 'bell' | 'gift' | 'alert-triangle' | 'info' | 'zap' | 'star' | 'none'
  link?: {
    text?: string
    url?: string
    newTab?: boolean
  }

  // Tab 2: Behavior
  dismissible: boolean  // default: true
  dismissalKey?: string  // required if dismissible
  sticky: boolean  // default: false
  showFrom?: Date
  showUntil?: Date
}
```

**Key Implementation Notes:**
- Gradient backgrounds: `linear-gradient(135deg, var(--navy), var(--navy-light))`
- Client component for dismissal and date range logic
- localStorage: `banner-dismissed-${dismissalKey}` = `'true'`
- Date range check: `showFrom <= now <= showUntil`
- Sticky z-index: 100 (must not conflict with existing header)

**Database Tables:**
- `pages_blocks_banner`

---

### B26: Spacer Block

**Category:** Layout Utility
**Location:** `src/branches/shared/blocks/Spacer/`

**Features:**
- **Sizes:** 4 vertical spacing options
  - `sm` - 24px (no mobile change)
  - `md` - 48px (no mobile change)
  - `lg` - 80px desktop, 64px mobile
  - `xl` - 120px desktop, 80px mobile
- **Divider:** Optional horizontal line centered in spacer
- **Purpose:** Create whitespace between content sections
- **Accessibility:** `aria-hidden="true"` (invisible to screen readers)

**Fields:**
```typescript
{
  size: 'sm' | 'md' | 'lg' | 'xl'  // required, default: 'md'
  showDivider: boolean  // default: false
}
```

**Key Implementation Notes:**
- Simplest block (2 fields only)
- Tailwind classes: `h-6`, `h-12`, `h-20 md:h-[80px]`, `h-20 md:h-[120px]`
- Divider: absolute positioned border-t in center
- Server component (no interactivity needed)

**Database Tables:**
- `pages_blocks_spacer`

---

## Theme Integration

### New Theme Colors Required

Add to `src/globals/Theme.ts` and `tailwind.config.js`:

```javascript
// Tailwind config extensions
module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#E3F2FD',
          500: '#2196F3',
          900: '#0D47A1',
        },
        green: {
          50: '#E8F5E9',
          500: '#00C853',
          900: '#1B5E20',
        },
        amber: {
          50: '#FFF8E1',
          500: '#F59E0B',
          900: '#78350F',
        },
        coral: {
          50: '#FFF0F0',
          500: '#FF6B6B',
          900: '#7F1D1D',
        },
      },
    },
  },
}
```

**Note:** InfoBox and Banner blocks reference these new colors.

---

## Implementation Strategy

### Clean Slate Approach

Following Sprint 4 and Sprint 5 patterns:

1. **Remove ALL existing files** for these blocks:
   ```bash
   rm -rf src/branches/shared/blocks/BlogPreview/
   rm -rf src/branches/shared/blocks/Comparison/
   rm -rf src/branches/shared/blocks/InfoBox/
   rm -rf src/branches/shared/blocks/Banner/
   rm -rf src/branches/shared/blocks/Spacer/
   ```

2. **Create fresh implementations** from Sprint 6 specs
3. **Theme-aware everything** (reference Theme global tokens)
4. **Placeholder components** first (JSON display)
5. **Build must pass** before Phase 2 (frontend)

---

## Implementation Steps

### Phase 1: Backend Configuration (This Sprint)

1. **Remove Old Blocks** (5 minutes)
   - Delete all old BlogPreview, Comparison, InfoBox, Banner, Spacer files

2. **Implement B12: Blog Preview** (30 minutes)
   - Create `config.ts` with relationship field
   - Ensure `Posts` collection exists with required fields
   - Add placeholder `Component.tsx`

3. **Implement B15: Comparison** (40 minutes)
   - Create `config.ts` with nested arrays (columns, rows, values)
   - Add validation: row values count === columns count
   - Add placeholder `Component.tsx`

4. **Implement B18: InfoBox** (45 minutes)
   - Create `config.ts` with 3 tabs (Content, Behavior, Design)
   - Configure Lexical editor with features
   - Create `types.ts` with variant config mapping
   - Add placeholder `Component.tsx`

5. **Implement B19: Banner** (40 minutes)
   - Create `config.ts` with 2 tabs (Content, Behavior)
   - Add date fields (showFrom, showUntil)
   - Add placeholder `Component.tsx`

6. **Implement B26: Spacer** (20 minutes)
   - Create `config.ts` (simplest block, 2 fields)
   - Add placeholder `Component.tsx`

7. **Update Pages Collection** (10 minutes)
   - Import all 5 new blocks
   - Add to blocks array in appropriate sections:
     - BlogPreview → Content & Media
     - Comparison → Interactive & Forms
     - InfoBox → Navigation & Info
     - Banner → Navigation & Info
     - Spacer → Layout & Structure (new section)

8. **Update RenderBlocks** (10 minutes)
   - Add imports for all 5 block components
   - Add to `blockComponents` mapping

9. **Build Test** (5 minutes)
   - Run `npm run build`
   - Verify no TypeScript errors
   - Verify all blocks compile

10. **Create Progress Doc** (10 minutes)
    - Document completed tasks
    - List expected migration tables
    - Outline Phase 2 frontend work

**Total Phase 1 Time:** ~3.5 hours

### Phase 2: Frontend Components (Future Sprint)

Deferred to Sprint 6 Phase 2:

- **BlogPreview:** Implement card grid with thumbnails, category badges, hover effects
- **Comparison:** Implement responsive table with mobile stacked cards
- **InfoBox:** Implement client component with dismissal logic and rich text rendering
- **Banner:** Implement client component with sticky positioning, date range, dismissal
- **Spacer:** Implement simple div with height classes and optional divider

---

## Manual Steps (Post-Implementation)

### Database Migration

After completing Phase 1, run manually:

```bash
npx payload migrate:create sprint6_utility_blocks
```

**Expected prompts (select "create table" for all):**

1. `pages_blocks_blogpreview` → **+ create table**
2. `pages_blocks_blogpreview_posts_rels` → **+ create table**
3. `pages_blocks_comparison` → **+ create table**
4. `pages_blocks_comparison_columns` → **+ create table**
5. `pages_blocks_comparison_rows` → **+ create table**
6. `pages_blocks_comparison_rows_values` → **+ create table**
7. `pages_blocks_infobox` → **+ create table**
8. `pages_blocks_banner` → **+ create table**
9. `pages_blocks_spacer` → **+ create table**

**After generation:**

```bash
npx payload migrate
npx payload migrate:status
```

---

## Testing Checklist

### Build Verification

- [ ] `npm run build` exits with code 0
- [ ] No TypeScript errors
- [ ] All 5 blocks visible in admin panel
- [ ] Can create/save each block type

### Admin Panel Testing

- [ ] **BlogPreview:** Relationship picker shows published posts, min/max validation works
- [ ] **Comparison:** Can add 2-4 columns, add feature rows, values count matches columns
- [ ] **InfoBox:** Tabs visible, Lexical editor works, conditional fields (persistent, storageKey)
- [ ] **Banner:** Date pickers work, link fields optional, conditional dismissalKey field
- [ ] **Spacer:** Size dropdown shows all 4 options, divider checkbox toggles

### Database Verification

- [ ] All 9 tables created successfully
- [ ] Foreign key relationships exist (comparison nested arrays, blogpreview relationship)
- [ ] Column types match schema (varchar, boolean, text, jsonb, timestamptz)

---

## Risk Assessment

### High Risk
- **Comparison Block Complexity:** Nested arrays 3 levels deep (columns → rows → values)
  - **Mitigation:** Add admin validation, test thoroughly before migration

### Medium Risk
- **InfoBox/Banner Client Components:** Require `'use client'` directive, localStorage usage
  - **Mitigation:** Test dismissal logic, handle localStorage errors (private browsing)

- **BlogPreview Relationship:** Depends on `Posts` collection existing with correct fields
  - **Mitigation:** Verify Posts collection structure before implementation

### Low Risk
- **Spacer Block:** Simplest block, low complexity
- **Theme Colors:** Easy to add to Tailwind config

---

## Success Criteria

### Phase 1 (This Sprint)

- ✅ All 5 block configs created with full field definitions
- ✅ Placeholder components created (display JSON)
- ✅ Build passes (exit code 0)
- ✅ Pages collection updated correctly
- ✅ RenderBlocks integration complete
- ⏳ Migration ready (manual step documented)

### Phase 2 (Future)

- ⏸️ Frontend components implemented
- ⏸️ Responsive designs working
- ⏸️ Client-side interactivity (dismissal, date range)
- ⏸️ Theme CSS variables used correctly
- ⏸️ Accessibility compliance (WCAG 2.1 AA)

---

## Notes for Phase 2 Implementation

### BlogPreview Frontend Requirements
- Next.js Image component with proper aspect ratio
- Link component for navigation
- date-fns for date formatting (Dutch locale)
- Lucide icons: Calendar, ArrowRight, Clock
- Hover effects: translateY(-4px), shadow-md
- Category badge: backdrop-filter blur

### Comparison Frontend Requirements
- Desktop: CSS Grid with dynamic columns
- Mobile: Hide table, show stacked cards
- Lucide icons: Check (green), X (grey)
- Featured column: teal-glow background on all cells

### InfoBox Frontend Requirements
- `'use client'` directive
- useState for dismissed state
- useEffect for localStorage check
- serializeLexical utility for rich text rendering
- Conditional padding-right when dismissible (avoid title overlap)

### Banner Frontend Requirements
- `'use client'` directive
- useState for isVisible
- useEffect for date range check and localStorage
- Sticky positioning: `position: sticky; top: 0; z-index: 100`
- Mobile: flex-col, icon hidden, dismiss button absolute positioned

### Spacer Frontend Requirements
- Simple div with height classes
- Optional divider: absolute positioned border-t
- `aria-hidden="true"` for accessibility
- Server component (no state needed)

---

## Reference Files

**Sprint 6 Specs:**
- `docs/refactoring/sprint-6/b12-blog-preview.html`
- `docs/refactoring/sprint-6/b15-comparison.html`
- `docs/refactoring/sprint-6/b18-infobox.html`
- `docs/refactoring/sprint-6/b19-banner.html`
- `docs/refactoring/sprint-6/b26-spacer.html`

**Related Files:**
- Theme Global: `src/globals/Theme.ts`
- Theme Types: `src/types/theme.ts`
- Pages Collection: `src/branches/shared/collections/Pages/index.ts`
- RenderBlocks: `src/branches/shared/blocks/RenderBlocks.tsx`
- Sprint 5 Progress: `docs/refactoring/SPRINT_5_PROGRESS.md`

---

**Created:** February 24, 2026 at 15:45 UTC
**Sprint:** 6 of 10
**Next:** Remove old blocks + Implement 5 new blocks + Test build
**Estimated Time:** 3-4 hours
