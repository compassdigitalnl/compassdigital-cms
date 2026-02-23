# Block Theme Variable Analysis

**Analyzed:** 23 Februari 2026
**Total Blocks:** 30 (25 shared + 5 ecommerce)
**Status:** 7 compliant, 17 partial, 6 non-compliant

---

## Executive Summary

### Current State
- **✅ Fully Compliant:** 7 blocks (23%)
- **⚠️ Partially Compliant:** 17 blocks (57%)
- **❌ Not Compliant:** 6 blocks (20%)

### Critical Issues
1. **InfoBox** - 100% inline styles, all variant colors hardcoded
2. **ComparisonTable** - 100% inline styles, navy/teal hardcoded
3. **ProductEmbed** - 100% inline styles, complete rewrite needed
4. **ContactFormBlock** - Success/error colors hardcoded
5. **Features** - Teal gradients hardcoded
6. **Hero** - Background gradients hardcoded

### Impact by Branch
- **Shared Blocks:** 28% fully compliant, 20% not compliant
- **Ecommerce Blocks:** 0% fully compliant, 40% not compliant

---

## ✅ Fully Compliant Blocks (7)

These blocks use only theme variables via Tailwind classes:

### 1. Accordion
**File:** `src/branches/shared/blocks/Accordion/Component.tsx`
**Status:** ✅ 100% theme compliant
**Usage:** `border-border`, `bg-card`, Tailwind utilities

### 2. Banner
**File:** `src/branches/shared/blocks/Banner/Component.tsx`
**Status:** ✅ 100% theme compliant
**Usage:** `border-border`, `bg-card`, status variants via Tailwind

### 3. CallToAction
**File:** `src/branches/shared/blocks/CallToAction/Component.tsx`
**Status:** ✅ 100% theme compliant
**Usage:** `bg-card`, `border-border`

### 4. Code
**File:** `src/branches/shared/blocks/Code/Component.tsx`
**Status:** ✅ 100% theme compliant
**Usage:** Minimal styling, Tailwind only

### 5. Content
**File:** `src/branches/shared/blocks/Content/Component.tsx`
**Status:** ✅ 100% theme compliant
**Usage:** Tailwind utilities only

### 6. MediaBlock
**File:** `src/branches/shared/blocks/MediaBlock/Component.tsx`
**Status:** ✅ 100% theme compliant
**Usage:** `border-border`

### 7. Spacer
**File:** `src/branches/shared/blocks/Spacer/Component.tsx`
**Status:** ✅ 100% theme compliant
**Usage:** Structural only, no colors

---

## ⚠️ Partially Compliant Blocks (17)

These blocks use some theme variables but also have hardcoded elements:

### 1. BlogPreview
**File:** `src/branches/shared/blocks/BlogPreview/Component.tsx`
**Issues:**
- Some hardcoded grays in category badges
- Mix of theme classes and inline styles

### 2. CTA (Call To Action variant)
**File:** `src/branches/shared/blocks/CTA/Component.tsx`
**Issues:**
- Some hardcoded button colors
- Gradient backgrounds partially hardcoded

### 3. FAQ
**File:** `src/branches/shared/blocks/FAQ/Component.tsx`
**Issues:**
- Some hardcoded grays in borders
- Inconsistent use of theme classes

### 4. Features
**File:** `src/branches/shared/blocks/Features/Component.tsx`
**Issues:**
- ⚠️ **CRITICAL:** Hardcoded teal gradients
```typescript
background: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)'
```

### 5. Form
**File:** `src/branches/shared/blocks/Form/Component.tsx`
**Issues:**
- Input focus states partially hardcoded
- Some border colors hardcoded

### 6. Hero
**File:** `src/branches/shared/blocks/Hero/Component.tsx`
**Issues:**
- ⚠️ **CRITICAL:** Background gradients hardcoded
- Overlay colors partially hardcoded

### 7. ProductGrid
**File:** `src/branches/ecommerce/blocks/ProductGrid/Component.tsx`
**Issues:**
- Badge colors hardcoded: `teal-500`, `red-500`, `amber-500`
- Price colors partially hardcoded

### 8. TestimonialsBlock
**File:** `src/branches/shared/blocks/TestimonialsBlock/Component.tsx`
**Issues:**
- Star colors hardcoded (gold)
- Quote marks color hardcoded

### 9-17. Minor Issues
The following blocks have minor hardcoded elements:
- Archive
- Cards
- ContentGrid
- Heading
- IconGrid
- LogoGrid
- MediaGrid
- PricingTable
- Stats

**Common issues:**
- Inconsistent gray shades
- Hardcoded hover states
- Mixed inline styles and Tailwind

---

## ❌ Not Compliant Blocks (6)

These blocks require complete refactoring:

### 1. InfoBox ⚠️ CRITICAL
**File:** `src/branches/shared/blocks/InfoBox/Component.tsx`
**Lines:** 12-37
**Status:** ❌ 100% inline styles

**Hardcoded Colors:**
```typescript
// Warning variant
backgroundColor: '#FFF8E1'
borderLeftColor: '#F59E0B'
color: '#92400E'

// Success variant
backgroundColor: '#E8F5E9'
borderLeftColor: '#00C853'
color: '#1B5E20'

// Danger variant
backgroundColor: '#FFF0F0'
borderLeftColor: '#EF4444'
color: '#991B1B'

// Info variant (default)
backgroundColor: 'rgba(0, 137, 123, 0.12)'
borderLeftColor: '#00897B'
color: '#004D40'
```

**Impact:** High - used on many pages for alerts/notifications

---

### 2. ComparisonTable ⚠️ CRITICAL
**File:** `src/branches/ecommerce/blocks/ComparisonTable/Component.tsx`
**Lines:** 17-140
**Status:** ❌ 100% inline styles

**Hardcoded Colors:**
```typescript
const COLORS = {
  navy: '#0A1628',
  teal: '#00897B',
  tealLight: '#26A69A',
  tealGlow: 'rgba(0,137,123,0.15)',
  grey: '#E8ECF1',
  greyMid: '#94A3B8',
  bg: '#F5F7FA',
}
```

**Impact:** Medium - ecommerce feature comparison tables

---

### 3. ProductEmbed ⚠️ CRITICAL
**File:** `src/branches/ecommerce/blocks/ProductEmbed/Component.tsx`
**Lines:** 36-169
**Status:** ❌ 100% inline styles

**Hardcoded Colors:**
```typescript
const COLORS = {
  navy: '#0A1628',
  teal: '#00897B',
  tealLight: '#26A69A',
  grey: '#E8ECF1',
  greyMid: '#94A3B8',
  bg: '#F5F7FA',
  white: '#FFFFFF',
}
```

**Impact:** High - product embeds in content pages

---

### 4. ContactFormBlock
**File:** `src/branches/shared/blocks/ContactFormBlock/Component.tsx`
**Lines:** 138, 139, 243, 244
**Status:** ❌ Many hardcoded colors

**Hardcoded Colors:**
```typescript
// Success state
backgroundColor: '#dcfce7'  // Line 138
color: '#22c55e'           // Line 139

// Error state
backgroundColor: '#fee2e2'  // Line 243
color: '#dc2626'           // Line 244
```

**Impact:** High - main contact form on all sites

---

### 5. Features (Hardcoded Gradients)
**File:** `src/branches/shared/blocks/Features/Component.tsx`
**Status:** ❌ Hardcoded teal gradients

**Issue:** Icon backgrounds use inline gradient styles instead of theme variables

**Impact:** Medium - feature sections on landing pages

---

### 6. Hero (Hardcoded Backgrounds)
**File:** `src/branches/shared/blocks/Hero/Component.tsx`
**Status:** ❌ Hardcoded background gradients

**Issue:** Background overlays and gradients use inline styles

**Impact:** High - hero sections on all major pages

---

## Missing Theme Variables

To fully support all blocks, the Theme global needs:

### Status Colors (Required)
```typescript
colors: {
  // Existing
  primary: string
  secondary: string

  // Missing - NEED TO ADD
  success: {
    DEFAULT: string    // e.g., '#00C853'
    light: string      // e.g., '#E8F5E9'
    dark: string       // e.g., '#1B5E20'
  }
  warning: {
    DEFAULT: string    // e.g., '#F59E0B'
    light: string      // e.g., '#FFF8E1'
    dark: string       // e.g., '#92400E'
  }
  error: {
    DEFAULT: string    // e.g., '#EF4444'
    light: string      // e.g., '#FFF0F0'
    dark: string       // e.g., '#991B1B'
  }
  info: {
    DEFAULT: string    // e.g., '#00897B'
    light: string      // e.g., 'rgba(0,137,123,0.12)'
    dark: string       // e.g., '#004D40'
  }
}
```

### Gradient Support
```typescript
gradients: {
  primary: string      // e.g., 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)'
  secondary: string
  hero: string
}
```

### Typography Colors
```typescript
typography: {
  heading: string
  body: string
  muted: string
  accent: string
}
```

---

## Refactoring Priority

### Phase 1: Critical Fixes (Week 1)
**Priority:** 🔴 High
**Blocks:** 5
**Effort:** 8-12 hours

1. **InfoBox** - Refactor to Tailwind + theme vars
2. **ComparisonTable** - Refactor to Tailwind + theme vars
3. **ProductEmbed** - Refactor to Tailwind + theme vars
4. **ContactFormBlock** - Update success/error states
5. **Features** - Replace hardcoded gradients

**Impact:** Fixes 80% of non-compliant issues

---

### Phase 2: High-Impact Partial Fixes (Week 2)
**Priority:** 🟡 Medium
**Blocks:** 4
**Effort:** 4-6 hours

1. **Hero** - Background gradients
2. **ProductGrid** - Badge colors
3. **FAQ** - Border consistency
4. **BlogPreview** - Category badges

**Impact:** Major visual consistency improvement

---

### Phase 3: Minor Improvements (Week 3)
**Priority:** 🟢 Low
**Blocks:** 13
**Effort:** 6-8 hours

Refactor remaining 13 partially compliant blocks to use theme variables consistently.

---

### Phase 4: Documentation (Week 4)
**Priority:** 🟢 Low
**Effort:** 2-3 hours

- Update block documentation
- Create theme variable usage guide
- Add Storybook examples

---

## Testing Checklist

After refactoring each block:

- [ ] Visual regression test (before/after screenshots)
- [ ] Test all variants (success, warning, error, info)
- [ ] Test dark mode (if applicable)
- [ ] Verify Tailwind classes work
- [ ] Check responsive behavior
- [ ] Validate accessibility (color contrast)
- [ ] Test on production deployment

---

## Expected Benefits

### Developer Experience
- ✅ Consistent theming API
- ✅ Easy to customize per client
- ✅ Type-safe theme configuration
- ✅ Faster block development

### Performance
- ✅ Smaller bundle size (fewer inline styles)
- ✅ Better CSS caching
- ✅ Reduced specificity issues

### Maintainability
- ✅ Single source of truth for colors
- ✅ Easier to update brand colors
- ✅ Better code reusability
- ✅ Clearer component structure

### SEO & Accessibility
- ✅ Better color contrast control
- ✅ Consistent semantic colors
- ✅ WCAG compliance easier to maintain

---

## Implementation Notes

### Before Starting
1. ✅ Expand Theme global with all color variants
2. ✅ Generate database migration for new fields
3. ✅ Update CSS variable generation
4. ✅ Test theme changes don't break existing sites

### During Refactoring
- Always test locally before committing
- Keep existing functionality intact
- Maintain backward compatibility
- Document breaking changes

### After Completion
- Update all client theme configurations
- Run visual regression tests
- Update deployment guides
- Notify team of changes

---

**Last Updated:** 23 Februari 2026
**Next Review:** After Phase 1 completion
