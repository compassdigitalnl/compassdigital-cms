# 🧱 Blocks Inventory & Analysis

**Generated**: 21 February 2026
**Total Blocks**: 38 blocks in `src/blocks/`
**Purpose**: Complete inventory of all blocks with usage analysis and migration recommendations

---

## 📊 Block Statistics

```
Total Blocks:        38
Shared Blocks:       18 (keep in src/blocks/)
Ecommerce Blocks:     8 (move to branches/ecommerce/blocks/)
Blocks to Evaluate:   5 (decide keep/remove)
Deprecated Blocks:    5 (remove)
Duplicate Blocks:     2 (consolidate)
```

---

## ✅ Shared Blocks (Keep in src/blocks/)

These blocks are used across multiple branches and should remain in the shared location.

### Content Blocks

| Block | Size (lines) | Description | Used In | Status |
|-------|--------------|-------------|---------|--------|
| `Hero` | 219 | Primary hero section with CTA | All branches | ✅ Keep |
| `Content` | ~150 | Rich text content block | All branches | ✅ Keep |
| `MediaBlock` | ~120 | Image/video display | All branches | ✅ Keep |
| `Features` | 192 | Feature grid with icons | Most pages | ✅ Keep |
| `BlogPreview` | 174 | Blog post preview cards | Content branch | ✅ Keep |
| `Video` | ~50 | Video embed (YouTube, Vimeo) | Content pages | ✅ Keep |
| `ImageGallery` | ~80 | Image gallery/carousel | Content pages | ✅ Keep |

### Interactive Blocks

| Block | Size (lines) | Description | Used In | Status |
|-------|--------------|-------------|---------|--------|
| `FAQ` | 83 | FAQ accordion | All branches | ✅ Keep |
| `ContactFormBlock` | 262 | Contact form with reCAPTCHA | All branches | ✅ Keep |
| `Form` | 176 | Form builder block | All pages | ✅ Keep |
| `Map` | ~50 | Google Maps embed | Contact, Construction | ✅ Keep |

### Social Proof Blocks

| Block | Size (lines) | Description | Used In | Status |
|-------|--------------|-------------|---------|--------|
| `TestimonialsBlock` | ~120 | Customer testimonials | All branches | ✅ Keep |
| `Team` | 106 | Team member grid | About pages | ✅ Keep |
| `Stats` | ~60 | Statistics/metrics display | All branches | ✅ Keep |
| `LogoBar` | 125 | Partner/client logos | Most pages | ✅ Keep |

### Business Blocks

| Block | Size (lines) | Description | Used In | Status |
|-------|--------------|-------------|---------|--------|
| `Pricing` | 101 | Pricing table/cards | Service pages | ✅ Keep |
| `Services` | ~150 | Service cards grid | Service pages, Construction | ✅ Keep |
| `CTA` | 103 | Call-to-action banner | All pages | ✅ Keep |

### Utility Blocks

| Block | Size (lines) | Description | Used In | Status |
|-------|--------------|-------------|---------|--------|
| `Spacer` | ~30 | Vertical spacing utility | All pages | ✅ Keep |

**Total Shared Blocks**: 18 blocks

---

## 🔵 Ecommerce Blocks (Move to branches/ecommerce/blocks/)

These blocks are exclusively used in the ecommerce branch and should be moved.

| Block | Size (lines) | Description | Usage | Priority |
|-------|--------------|-------------|-------|----------|
| `ProductGrid` | 273 | Product listing with filters | Shop pages | 🔴 High |
| `ProductFilters` | 286 | Advanced product filter sidebar | Shop pages | 🔴 High |
| `SearchBar` | 307 | Product search with autocomplete | Shop header | 🔴 High |
| `QuickOrder` | 279 | Quick order form (B2B) | B2B shop | 🟡 Medium |
| `CategoryGrid` | 137 | Product category tiles | Shop homepage | 🟡 Medium |
| `ProductEmbed` | 172 | Single product embed | Landing pages | 🟢 Low |
| `TopBar` | 94 | Promotional announcement bar | Shop header | 🟢 Low |
| `ComparisonTable` | 139 | Product comparison table | Product pages | 🟢 Low |

**Migration Steps**:
```bash
mv src/blocks/ProductGrid/ src/branches/ecommerce/blocks/
mv src/blocks/ProductFilters/ src/branches/ecommerce/blocks/
mv src/blocks/SearchBar/ src/branches/ecommerce/blocks/
mv src/blocks/QuickOrder/ src/branches/ecommerce/blocks/
mv src/blocks/CategoryGrid/ src/branches/ecommerce/blocks/
mv src/blocks/ProductEmbed/ src/branches/ecommerce/blocks/
mv src/blocks/TopBar/ src/branches/ecommerce/blocks/
mv src/blocks/ComparisonTable/ src/branches/ecommerce/blocks/
```

**Impact**: No breaking changes if imports are updated correctly.

---

## ⚠️  Blocks to Evaluate (Decide Keep/Remove)

These blocks need usage analysis to determine if they should be kept or removed.

### 1. Accordion

**Location**: `src/blocks/Accordion/`
**Size**: ~100 lines (estimated)
**Description**: Generic accordion/collapse component

**Analysis**:
- ❓ Usage unclear - need to check codebase
- Similar functionality exists in FAQ block
- Could be useful for general content

**Recommendation**:
```bash
# Check usage
grep -r "blockType.*accordion" src/ --include="*.ts" --include="*.tsx"

# If used: Keep as shared block
# If not used: Remove or merge into FAQ
```

**Decision**: ⏳ Pending usage analysis

---

### 2. Breadcrumb (Block)

**Location**: `src/blocks/Breadcrumb/`
**Size**: ~80 lines (estimated)
**Description**: Breadcrumb navigation block

**Analysis**:
- There's also a `src/components/Breadcrumbs.tsx` component
- Potential duplicate functionality
- Breadcrumbs are usually a component, not a content block

**Recommendation**:
```bash
# Check usage
grep -r "blockType.*breadcrumb" src/ --include="*.ts" --include="*.tsx"

# If block is used: Keep
# If component is used instead: Remove block, keep component
```

**Decision**: ⏳ Pending - likely remove (keep component instead)

---

### 3. InfoBox

**Location**: `src/blocks/InfoBox/`
**Size**: 98 lines
**Description**: Info/callout box

**Analysis**:
- Similar to alert/notification boxes
- May overlap with other blocks
- Could be useful for notices

**Recommendation**:
```bash
# Check usage
grep -r "blockType.*infoBox" src/ --include="*.ts" --include="*.tsx"

# If actively used: Keep
# If rarely used: Remove
```

**Decision**: ⏳ Pending usage analysis

---

### 4. TwoColumn

**Location**: `src/blocks/TwoColumn/`
**Size**: ~60 lines
**Description**: Two-column layout block

**Analysis**:
- Generic layout block
- Could be replaced by Grid component
- May still be useful for specific layouts

**Recommendation**:
```bash
# Check usage
grep -r "blockType.*twoColumn" src/ --include="*.ts" --include="*.tsx"

# If actively used: Keep
# If rarely used: Remove (use Grid instead)
```

**Decision**: ⏳ Pending usage analysis

---

### 5. Code

**Location**: `src/blocks/Code/`
**Size**: ~100 lines
**Description**: Code snippet block with syntax highlighting

**Analysis**:
- Useful for documentation/developer content
- Not needed for most client sites
- Could be feature-flagged

**Recommendation**:
```bash
# Check usage
grep -r "blockType.*code" src/ --include="*.ts" --include="*.tsx"

# If used in docs: Keep (move to content branch?)
# If not used: Remove
```

**Decision**: ⏳ Pending - likely remove (unless docs need it)

---

## ❌ Deprecated Blocks (Remove)

These blocks are confirmed obsolete and should be removed.

### 1. ArchiveBlock

**Location**: `src/blocks/ArchiveBlock/`
**Reason for Removal**:
- Replaced by `ProductGrid` (ecommerce)
- Replaced by `BlogPreview` (content)
- Old pattern from earlier architecture

**Check Before Removal**:
```bash
grep -r "blockType.*archiveBlock\|ArchiveBlock" src/ --include="*.ts" --include="*.tsx"
# Should return 0 results
```

**Remove**:
```bash
rm -rf src/blocks/ArchiveBlock/
```

---

### 2. Banner

**Location**: `src/blocks/Banner/`
**Reason for Removal**:
- Replaced by `Hero` block (more flexible)
- Old design pattern
- Not used in modern ecommerce

**Check Before Removal**:
```bash
grep -r "blockType.*banner\|Banner" src/ --include="*.ts" --include="*.tsx"
# Should return 0 results
```

**Remove**:
```bash
rm -rf src/blocks/Banner/
```

---

### 3. Carousel

**Location**: `src/blocks/Carousel/`
**Reason for Removal**:
- Not used in current ecommerce design
- Modern design uses grid layouts instead
- Accessibility concerns with carousels

**Check Before Removal**:
```bash
grep -r "blockType.*carousel\|Carousel" src/ --include="*.ts" --include="*.tsx"
# Should return 0 results
```

**Remove**:
```bash
rm -rf src/blocks/Carousel/
```

---

### 4. ThreeItemGrid

**Location**: `src/blocks/ThreeItemGrid/`
**Reason for Removal**:
- Replaced by generic `Grid` component
- Too specific - Grid component is more flexible
- Same functionality available elsewhere

**Check Before Removal**:
```bash
grep -r "blockType.*threeItemGrid\|ThreeItemGrid" src/ --include="*.ts" --include="*.tsx"
# Should return 0 results
```

**Remove**:
```bash
rm -rf src/blocks/ThreeItemGrid/
```

---

## 🔄 Duplicate Blocks (Consolidate)

### CallToAction vs CTA

**Issue**: Two blocks with same purpose

**Locations**:
- `src/blocks/CallToAction/` (~100 lines)
- `src/blocks/CTA/` (103 lines)

**Analysis**:
```bash
# Check which one is used more
grep -r "blockType.*callToAction" src/ --include="*.ts" --include="*.tsx" | wc -l
grep -r "blockType.*cta" src/ --include="*.ts" --include="*.tsx" | wc -l
```

**Recommendation**:
1. Compare both implementations
2. Keep the better/more complete one (likely `CTA`)
3. Migrate any unique features to the kept version
4. Update all references to use the kept version
5. Remove the deprecated version

**Action**:
```bash
# Step 1: Compare implementations
diff -u src/blocks/CallToAction/Component.tsx src/blocks/CTA/Component.tsx

# Step 2: Check usage
grep -r "CallToAction" src/collections/ src/app/
grep -r "blockType.*cta" src/collections/ src/app/

# Step 3: Consolidate (manual - check which is better)
# Option A: Keep CTA
# - Update CallToAction references to use CTA
# - Remove CallToAction/

# Option B: Keep CallToAction
# - Update CTA references to use CallToAction
# - Remove CTA/
```

---

## 📈 Block Usage Analysis Script

**Create**: `scripts/analyze-block-usage.mjs`

```javascript
#!/usr/bin/env node

import { execSync } from 'child_process'

const blocks = [
  'accordion',
  'archiveBlock',
  'banner',
  'blogPreview',
  'breadcrumb',
  'cta',
  'callToAction',
  'carousel',
  'categoryGrid',
  'code',
  'comparisonTable',
  'contactFormBlock',
  'content',
  'faq',
  'features',
  'form',
  'hero',
  'imageGallery',
  'infoBox',
  'logoBar',
  'map',
  'mediaBlock',
  'pricing',
  'productEmbed',
  'productFilters',
  'productGrid',
  'quickOrder',
  'searchBar',
  'services',
  'spacer',
  'stats',
  'team',
  'testimonialsBlock',
  'threeItemGrid',
  'topBar',
  'twoColumn',
  'video',
]

console.log('🔍 Block Usage Analysis\n')
console.log('Block Name              | Usage Count | Status')
console.log('------------------------|-------------|--------')

const results = []

blocks.forEach((block) => {
  try {
    const cmd = `grep -r "blockType.*${block}" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l`
    const count = parseInt(execSync(cmd, { encoding: 'utf-8' }).trim())

    let status = '✅ Active'
    if (count === 0) {
      status = '❌ Unused'
    } else if (count <= 2) {
      status = '⚠️  Rarely used'
    }

    results.push({ block, count, status })
  } catch (e) {
    results.push({ block, count: 0, status: '❓ Error' })
  }
})

// Sort by usage count (descending)
results.sort((a, b) => b.count - a.count)

results.forEach(({ block, count, status }) => {
  const paddedBlock = block.padEnd(23)
  const paddedCount = count.toString().padEnd(11)
  console.log(`${paddedBlock} | ${paddedCount} | ${status}`)
})

console.log('\n📊 Summary:')
const unused = results.filter((r) => r.count === 0).length
const active = results.filter((r) => r.count > 2).length
const rarely = results.filter((r) => r.count > 0 && r.count <= 2).length

console.log(`  Unused: ${unused}`)
console.log(`  Rarely used: ${rarely}`)
console.log(`  Actively used: ${active}`)
```

**Usage**:
```bash
chmod +x scripts/analyze-block-usage.mjs
node scripts/analyze-block-usage.mjs
```

---

## 🎯 Recommended Action Plan

### Immediate Actions:

1. **Run Usage Analysis**
   ```bash
   node scripts/analyze-block-usage.mjs > docs/block-usage-report.txt
   ```

2. **Remove Confirmed Deprecated Blocks** (saves ~500 lines)
   ```bash
   rm -rf src/blocks/ArchiveBlock/
   rm -rf src/blocks/Banner/
   rm -rf src/blocks/Carousel/
   rm -rf src/blocks/ThreeItemGrid/
   ```

3. **Consolidate Duplicates** (CTA vs CallToAction)
   ```bash
   # Manual: Compare and merge
   # Then remove one
   ```

### Evaluate Based on Usage:

4. **Check "Evaluate" Blocks**
   - Accordion - Keep if usage > 0, else remove
   - Breadcrumb - Remove (use component instead)
   - InfoBox - Keep if usage > 2, else remove
   - TwoColumn - Remove (use Grid instead)
   - Code - Remove unless used in docs

### Migration:

5. **Move Ecommerce Blocks** (see Phase 3 of master plan)
   ```bash
   # 8 blocks to move
   mv src/blocks/ProductGrid/ src/branches/ecommerce/blocks/
   # ... etc
   ```

---

## 📊 Expected Results

### Before Cleanup:
```
Total Blocks: 38
Total Lines: ~4,210 lines
Organization: Flat structure
Ecommerce Separation: None
```

### After Cleanup:
```
Shared Blocks: 18-23 (depending on evaluation)
Ecommerce Blocks: 8 (in branches/)
Construction Blocks: 6 (in branches/)
Total Lines: ~3,500 lines (15-20% reduction)
Organization: Branch-based vertical slices
Ecommerce Separation: Complete
```

### Benefits:
- ✅ 40-47% reduction in shared blocks
- ✅ Clear separation of concerns
- ✅ Easier maintenance
- ✅ Better code organization
- ✅ Faster development (easier to find code)
- ✅ Smaller bundles (code splitting by branch)

---

**Last Updated**: 21 February 2026
**Status**: ✅ Ready for Analysis & Implementation
