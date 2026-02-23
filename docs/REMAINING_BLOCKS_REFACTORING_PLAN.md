# Remaining Blocks Refactoring Plan

**Created:** 23 Februari 2026
**Status:** 4/30 blocks complete (13%), 26 remaining
**Est. Time:** 6-8 hours for all remaining blocks

---

## ✅ COMPLETED (4 blocks)

1. **InfoBox** - `src/branches/shared/blocks/InfoBox/Component.tsx` ✅
   Status: 100% theme compliant, reference implementation

2. **ComparisonTable** - `src/branches/ecommerce/blocks/ComparisonTable/Component.tsx` ✅
   Status: All inline styles converted to Tailwind + theme vars

3. **ProductEmbed** - `src/branches/ecommerce/blocks/ProductEmbed/Component.tsx` ✅
   Status: All inline styles converted to Tailwind + theme vars

4. **ContactFormBlock** - `src/branches/shared/blocks/ContactFormBlock/Component.tsx` ✅
   Status: Success/error states now use theme vars

---

## ⏳ REMAINING (26 blocks)

### Phase 1: Critical (2 remaining)

#### 5. Features - `src/branches/shared/blocks/Features/Component.tsx`
**Issue:** Hardcoded navy gradient in dark variant
**Line 33:** `from-[#0A1628] via-[#0D1B2E] to-[#0A1628]`
**Fix:** Replace with `bg-gradient-secondary` or keep as-is (minor issue)
**Priority:** LOW (already uses Tailwind, gradient is secondary)

#### 6. Hero - `src/branches/shared/blocks/Hero/Component.tsx`
**Issue:** Background gradient overlays hardcoded
**Search for:** `linear-gradient` or `rgba(0,137,123`
**Fix:** Replace with `bg-gradient-hero` class
**Priority:** MEDIUM

---

### Phase 2: High-Impact Partial (4 blocks)

#### 7. ProductGrid - `src/branches/ecommerce/blocks/ProductGrid/Component.tsx`
**Issue:** Badge colors hardcoded
**Search for:** `teal-500`, `red-500`, `amber-500`
**Fix:**
```tsx
// BEFORE
className="bg-teal-500"

// AFTER
className="bg-primary"
```
**Priority:** MEDIUM

#### 8. FAQ - `src/branches/shared/blocks/FAQ/Component.tsx`
**Issue:** Border colors inconsistent
**Search for:** hardcoded grey shades
**Fix:** Use `border-grey` consistently
**Priority:** LOW

#### 9. BlogPreview - `src/branches/shared/blocks/BlogPreview/Component.tsx`
**Issue:** Category badge colors hardcoded
**Fix:** Use theme colors for badges
**Priority:** LOW

#### 10. TestimonialsBlock - `src/branches/shared/blocks/TestimonialsBlock/Component.tsx`
**Issue:** Star colors hardcoded (gold)
**Search for:** `#` color codes in star rendering
**Fix:** Use theme accent color or keep gold (acceptable)
**Priority:** LOW

---

### Phase 3: Minor Partial Compliance (17 blocks)

These blocks have minor hardcoded elements but are mostly compliant:

#### 11. Archive - `src/branches/shared/blocks/Archive/Component.tsx`
**Issue:** Minor gray inconsistencies
**Fix:** Search for `#` and replace with theme greys

#### 12. Cards - `src/branches/shared/blocks/Cards/Component.tsx`
**Issue:** Card border/background colors
**Fix:** Use `bg-surface`, `border-grey`

#### 13. ContentGrid - `src/branches/shared/blocks/ContentGrid/Component.tsx`
**Issue:** Grid item borders
**Fix:** Use `border-grey`

#### 14. Heading - `src/branches/shared/blocks/Heading/Component.tsx`
**Issue:** Minimal, likely already compliant
**Action:** Quick audit only

#### 15. IconGrid - `src/branches/shared/blocks/IconGrid/Component.tsx`
**Issue:** Icon backgrounds
**Fix:** Use theme colors

#### 16. LogoGrid - `src/branches/shared/blocks/LogoGrid/Component.tsx`
**Issue:** Background colors
**Fix:** Use `bg-grey-light`

#### 17. MediaGrid - `src/branches/shared/blocks/MediaGrid/Component.tsx`
**Issue:** Overlay colors
**Fix:** Use theme colors for overlays

#### 18. PricingTable - `src/branches/shared/blocks/PricingTable/Component.tsx`
**Issue:** Feature badges, borders
**Fix:** Use theme colors

#### 19. Stats - `src/branches/shared/blocks/Stats/Component.tsx`
**Issue:** Number/label colors
**Fix:** Use `text-primary`, `text-secondary-color`

#### 20. Form - `src/branches/shared/blocks/Form/Component.tsx`
**Issue:** Input focus states
**Fix:** Use theme colors for focus rings

#### 21. CTA - `src/branches/shared/blocks/CTA/Component.tsx`
**Issue:** Button gradients
**Fix:** Use `bg-gradient-primary`

#### 22-30. Additional Blocks
Search all remaining blocks in:
- `src/branches/shared/blocks/`
- `src/branches/ecommerce/blocks/`

For each:
1. `grep -r "#[0-9A-F]\{6\}" [file]` - Find hex colors
2. `grep -r "rgb(" [file]` - Find RGB colors
3. `grep -r "style={{" [file]` - Find inline styles
4. Replace with appropriate theme classes

---

## 🔧 UNIVERSAL REFACTORING PATTERN

For **EVERY** remaining block, follow this process:

### Step 1: Identify Hardcoded Colors

```bash
# In block directory
grep -n "#[0-9A-Fa-f]\{6\}" Component.tsx
grep -n "rgb\(" Component.tsx
grep -n "rgba\(" Component.tsx
```

### Step 2: Map to Theme Variables

| Hardcoded Color | Theme Variable | Tailwind Class |
|----------------|----------------|----------------|
| `#00897B` (teal) | `--color-primary` | `.bg-primary`, `.text-primary` |
| `#26A69A` (teal light) | `--color-primary-light` | `.bg-primary-light` |
| `rgba(0,137,123,0.12)` | `--color-primary-glow` | `.bg-primary-glow` |
| `#0A1628` (navy) | `--color-secondary` | `.bg-secondary`, `.text-secondary-color` |
| `#E8ECF1` (grey border) | `--color-border` | `.border-grey` |
| `#F1F4F8` (grey light) | `--color-grey-light` | `.bg-grey-light` |
| `#94A3B8` (grey mid) | `--color-grey-mid` | `.text-grey-mid` |
| `#00C853` (green) | `--color-success` | `.bg-success`, `.text-success` |
| `#E8F5E9` (green light) | `--color-success-light` | `.bg-success-light` |
| `#F59E0B` (amber) | `--color-warning` | `.bg-warning`, `.text-warning` |
| `#FFF8E1` (amber light) | `--color-warning-light` | `.bg-warning-light` |
| `#EF4444` (red) | `--color-error` | `.bg-error`, `.text-error` |
| `#FFF0F0` (red light) | `--color-error-light` | `.bg-error-light` |

### Step 3: Replace Inline Styles with Classes

```typescript
// BEFORE ❌
<div style={{
  backgroundColor: '#00897B',
  color: 'white',
  padding: '12px',
  borderRadius: '8px'
}}>

// AFTER ✅
<div className="bg-primary text-white p-3 rounded-lg">
```

### Step 4: Handle Gradients

```typescript
// BEFORE ❌
<div style={{
  background: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)'
}}>

// AFTER ✅
<div className="bg-gradient-primary">
```

### Step 5: Add Documentation Comment

```typescript
/**
 * [BlockName] Component - 100% Theme Variable Compliant
 *
 * Refactored from [describe what was hardcoded] to theme variables.
 * All colors now use CSS variables from ThemeProvider.
 */
```

### Step 6: Test

```bash
# Build test
npm run build

# Visual test
npm run dev
# Navigate to page with block
# Verify appearance unchanged
```

---

## 📋 BATCH REFACTORING SCRIPT

For efficient processing of all 26 remaining blocks:

```bash
#!/bin/bash

# List of remaining blocks
BLOCKS=(
  "src/branches/shared/blocks/Features/Component.tsx"
  "src/branches/shared/blocks/Hero/Component.tsx"
  "src/branches/ecommerce/blocks/ProductGrid/Component.tsx"
  "src/branches/shared/blocks/FAQ/Component.tsx"
  "src/branches/shared/blocks/BlogPreview/Component.tsx"
  "src/branches/shared/blocks/TestimonialsBlock/Component.tsx"
  "src/branches/shared/blocks/Archive/Component.tsx"
  "src/branches/shared/blocks/Cards/Component.tsx"
  "src/branches/shared/blocks/ContentGrid/Component.tsx"
  "src/branches/shared/blocks/Heading/Component.tsx"
  "src/branches/shared/blocks/IconGrid/Component.tsx"
  "src/branches/shared/blocks/LogoGrid/Component.tsx"
  "src/branches/shared/blocks/MediaGrid/Component.tsx"
  "src/branches/shared/blocks/PricingTable/Component.tsx"
  "src/branches/shared/blocks/Stats/Component.tsx"
  "src/branches/shared/blocks/Form/Component.tsx"
  "src/branches/shared/blocks/CTA/Component.tsx"
  # Add remaining 9 blocks here
)

echo "🔍 Analyzing ${#BLOCKS[@]} blocks for hardcoded colors..."

for BLOCK in "${BLOCKS[@]}"; do
  echo ""
  echo "===== $BLOCK ====="

  # Count hardcoded colors
  HEX_COUNT=$(grep -c "#[0-9A-Fa-f]\{6\}" "$BLOCK" 2>/dev/null || echo "0")
  RGB_COUNT=$(grep -c "rgb\|rgba" "$BLOCK" 2>/dev/null || echo "0")
  STYLE_COUNT=$(grep -c "style={{" "$BLOCK" 2>/dev/null || echo "0")

  echo "  Hex colors: $HEX_COUNT"
  echo "  RGB colors: $RGB_COUNT"
  echo "  Inline styles: $STYLE_COUNT"

  # Show specific lines with colors
  if [ "$HEX_COUNT" -gt 0 ]; then
    echo "  Lines with hex colors:"
    grep -n "#[0-9A-Fa-f]\{6\}" "$BLOCK" | head -5
  fi
done

echo ""
echo "✅ Analysis complete. Review output and refactor each block."
```

---

## 🎯 COMPLETION CHECKLIST

Use this to track progress:

### Phase 1: Critical (2 blocks)
- [ ] Features (LOW priority - minor issue)
- [ ] Hero (MEDIUM priority - gradients)

### Phase 2: High-Impact (4 blocks)
- [ ] ProductGrid (badge colors)
- [ ] FAQ (borders)
- [ ] BlogPreview (category badges)
- [ ] TestimonialsBlock (star colors)

### Phase 3: Minor Issues (17 blocks)
- [ ] Archive
- [ ] Cards
- [ ] ContentGrid
- [ ] Heading
- [ ] IconGrid
- [ ] LogoGrid
- [ ] MediaGrid
- [ ] PricingTable
- [ ] Stats
- [ ] Form
- [ ] CTA
- [ ] [6 more blocks - audit shared/ecommerce dirs]

### Phase 4: Verification
- [ ] Run `npm run build` - Must succeed
- [ ] Visual regression test all blocks
- [ ] Test all color variants (success, warning, error, info)
- [ ] Test in `/admin/globals/theme/` - change colors, verify blocks update
- [ ] Commit with message: "Complete block refactoring to theme variables (30/30)"

---

## 💾 BACKUP BEFORE STARTING

```bash
# Create backup branch
git checkout -b theme-refactoring-backup
git checkout main

# Or create backup commits
git add -A
git commit -m "WIP: Backup before Phase 2-3 refactoring"
```

---

## 🚀 FINAL DEPLOYMENT

After completing all 26 blocks:

1. **Test thoroughly**
   ```bash
   npm run build
   npm run dev
   # Test every block type on different pages
   ```

2. **Update documentation**
   - Update `BLOCK_THEME_ANALYSIS.md` with new status
   - Mark all 30 blocks as ✅ compliant

3. **Commit**
   ```bash
   git add -A
   git commit -m "Complete theme system: All 30 blocks now theme-compliant

   PHASE 2-3 COMPLETE:
   - Refactored 26 remaining blocks to use theme variables
   - All hardcoded colors replaced with theme CSS vars
   - 100% CMS-driven color system

   FINAL STATUS:
   - Infrastructure: 100% ✅
   - Blocks: 100% (30/30) ✅
   - Documentation: Complete ✅

   All colors now configurable via /admin/globals/theme/.
   No hardcoded hex/rgb values remain in any block.

   Impact:
   - Single source of truth for all colors
   - Per-client customization via CMS
   - Easier maintenance and brand updates

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

4. **Push and deploy**
   ```bash
   git push origin main
   ```

---

## 📞 SUPPORT

If you encounter issues:

1. Check the 4 completed blocks as reference implementations
2. Review `THEME_SYSTEM_IMPLEMENTATION_GUIDE.md`
3. Review `BLOCK_THEME_ANALYSIS.md` for specific block details
4. Test changes in isolation before committing

---

**Created:** 23 Februari 2026
**Last Updated:** 23 Februari 2026, 13:30
**Estimated Completion:** 6-8 hours for all remaining blocks
**Current Progress:** 13% (4/30 blocks)
**Target:** 100% (30/30 blocks) theme compliant
