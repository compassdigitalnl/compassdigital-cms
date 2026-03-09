# Variable Products Components (VP01-VP13)

**Last Updated:** 1 Maart 2026
**Status:** ✅ VP01-VP05, VP08-VP11 Complete | 📋 VP12-VP13 CSS Patterns Documented

---

## 📦 Components Overview

### Single-Variant Selection (VP01-VP05)

Choose **ONE** option per attribute:

- ✅ **VP01: VariantColorSwatches** - Color selection with swatches
- ✅ **VP02: VariantSizeSelector** - Size buttons (XS-XXL)
- ✅ **VP03: VariantDropdownSelector** - Dropdown for materials/finishes
- ✅ **VP04: VariantImageRadio** - Image-based selection
- ✅ **VP05: VariantCheckboxAddons** - Optional extras (multi-select)

### Multi-Variant Selection (VP08-VP11)

Choose **MULTIPLE** variants simultaneously:

- ✅ **VP08: VariantCardCompact** - Grid card with checkbox + qty stepper
- ✅ **VP09: VariantRowCompact** - Horizontal list row
- ✅ **VP10: VariantSelectionSidebar** - Sticky sidebar with selected items
- ✅ **VP11: VariantToolbar** - View toggle (grid/list) + bulk actions

### CSS Layout Patterns (VP12-VP13)

These are **not full components**, but CSS patterns for layout:

- 📋 **VP12: VariantGridContainer** - Responsive 6-column grid
- 📋 **VP13: VariantListContainer** - Vertical list layout

---

## 🎨 VP12: VariantGridContainer (CSS Pattern)

**Purpose:** Responsive grid wrapper for VP08 (VariantCardCompact) components

**Responsive Breakpoints:**
- Desktop (≥1024px): 6 columns
- Tablet (768-1023px): 4 columns
- Small Tablet (640-767px): 3 columns
- Mobile (<640px): 2 columns

### Implementation

```tsx
import { VariantCardCompact } from '@/branches/ecommerce/components/product-types/variable'

export function ProductVariantGrid({ variants }: { variants: ProductVariant[] }) {
  const [selection, setSelection] = useState<VariantSelectionState>({})

  const handleToggle = (variantId: string) => {
    setSelection((prev) => ({
      ...prev,
      [variantId]: {
        selected: !prev[variantId]?.selected,
        quantity: prev[variantId]?.quantity || 1,
      },
    }))
  }

  const handleQuantityChange = (variantId: string, quantity: number) => {
    setSelection((prev) => ({
      ...prev,
      [variantId]: {
        selected: quantity > 0,
        quantity,
      },
    }))
  }

  return (
    <div className="variant-grid-compact">
      {variants.map((variant) => (
        <VariantCardCompact
          key={variant.id}
          variant={variant}
          selected={selection[variant.id]?.selected || false}
          quantity={selection[variant.id]?.quantity || 0}
          onToggle={handleToggle}
          onQuantityChange={handleQuantityChange}
        />
      ))}
    </div>
  )
}
```

### CSS (TailwindCSS)

```css
.variant-grid-compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

/* Force 6 columns on desktop */
@media (min-width: 1024px) {
  .variant-grid-compact {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* 4 columns on tablet */
@media (max-width: 1023px) and (min-width: 768px) {
  .variant-grid-compact {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 3 columns on small tablet */
@media (max-width: 767px) and (min-width: 640px) {
  .variant-grid-compact {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 2 columns on mobile */
@media (max-width: 639px) {
  .variant-grid-compact {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### Tailwind Classes (Alternative)

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
  {/* VP08 cards */}
</div>
```

---

## 📜 VP13: VariantListContainer (CSS Pattern)

**Purpose:** Vertical list wrapper for VP09 (VariantRowCompact) components

**Features:**
- Vertical stack layout
- 8px gap between rows
- Optional striped rows
- Smooth scrolling

### Implementation

```tsx
import { VariantRowCompact } from '@/branches/ecommerce/components/product-types/variable'

export function ProductVariantList({ variants }: { variants: ProductVariant[] }) {
  const [selection, setSelection] = useState<VariantSelectionState>({})

  const handleToggle = (variantId: string) => {
    setSelection((prev) => ({
      ...prev,
      [variantId]: {
        selected: !prev[variantId]?.selected,
        quantity: prev[variantId]?.quantity || 1,
      },
    }))
  }

  const handleQuantityChange = (variantId: string, quantity: number) => {
    setSelection((prev) => ({
      ...prev,
      [variantId]: {
        selected: quantity > 0,
        quantity,
      },
    }))
  }

  return (
    <div className="variant-list-compact">
      {variants.map((variant) => (
        <VariantRowCompact
          key={variant.id}
          variant={variant}
          selected={selection[variant.id]?.selected || false}
          quantity={selection[variant.id]?.quantity || 0}
          onToggle={handleToggle}
          onQuantityChange={handleQuantityChange}
          showImage={true}
        />
      ))}
    </div>
  )
}
```

### CSS

```css
.variant-list-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Optional: Striped rows */
.variant-list-compact .variant-row-compact:nth-child(even) {
  background-color: rgba(243, 244, 246, 0.5); /* gray-100 with opacity */
}

/* Optional: Hover effect on rows */
.variant-list-compact .variant-row-compact:hover {
  background-color: rgba(0, 137, 123, 0.02); /* teal-50 with opacity */
}
```

### Tailwind Classes (Alternative)

```tsx
<div className="flex flex-col gap-2">
  {/* VP09 rows */}
</div>
```

---

## 🔄 Complete Multi-Variant Selection Example

**Full implementation with VP08-VP13:**

```tsx
'use client'

import { useState } from 'react'
import {
  VariantCardCompact,
  VariantRowCompact,
  VariantSelectionSidebar,
  VariantToolbar,
} from '@/branches/ecommerce/components/product-types/variable'
import type {
  ProductVariant,
  VariantSelectionState,
  VariantViewMode,
} from '@/branches/ecommerce/lib/product-types'

export function MultiVariantSelector({ variants }: { variants: ProductVariant[] }) {
  const [viewMode, setViewMode] = useState<VariantViewMode>('grid')
  const [selection, setSelection] = useState<VariantSelectionState>({})

  // Calculate selected variants
  const selectedVariants = variants
    .filter((v) => selection[v.id]?.selected)
    .map((v) => ({
      variant: v,
      quantity: selection[v.id]?.quantity || 0,
    }))

  // Calculate prices
  const subtotal = selectedVariants.reduce(
    (sum, { variant, quantity }) => sum + variant.price * quantity,
    0
  )
  const discount = subtotal > 100 ? subtotal * 0.15 : 0 // 15% discount for orders > €100
  const total = subtotal - discount

  // Handlers
  const handleToggle = (variantId: string) => {
    setSelection((prev) => ({
      ...prev,
      [variantId]: {
        selected: !prev[variantId]?.selected,
        quantity: prev[variantId]?.quantity || 1,
      },
    }))
  }

  const handleQuantityChange = (variantId: string, quantity: number) => {
    setSelection((prev) => ({
      ...prev,
      [variantId]: {
        selected: quantity > 0,
        quantity,
      },
    }))
  }

  const handleSelectAll = () => {
    const newSelection: VariantSelectionState = {}
    variants.forEach((v) => {
      newSelection[v.id] = { selected: true, quantity: 1 }
    })
    setSelection(newSelection)
  }

  const handleDeselectAll = () => {
    setSelection({})
  }

  const handleRemoveVariant = (variantId: string) => {
    setSelection((prev) => {
      const updated = { ...prev }
      delete updated[variantId]
      return updated
    })
  }

  const handleClearAll = () => {
    setSelection({})
  }

  const handleAddToCart = async () => {
    // Add to cart logic here
    console.log('Adding to cart:', selectedVariants)
  }

  return (
    <div className="flex gap-6">
      {/* Main Variant Selection Area */}
      <div className="flex-1">
        {/* VP11: Toolbar */}
        <VariantToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalVariants={variants.length}
          selectedCount={selectedVariants.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />

        {/* VP12: Grid Container (Grid View) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 mt-4">
            {variants.map((variant) => (
              <VariantCardCompact
                key={variant.id}
                variant={variant}
                selected={selection[variant.id]?.selected || false}
                quantity={selection[variant.id]?.quantity || 0}
                onToggle={handleToggle}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        )}

        {/* VP13: List Container (List View) */}
        {viewMode === 'list' && (
          <div className="flex flex-col gap-2 mt-4">
            {variants.map((variant) => (
              <VariantRowCompact
                key={variant.id}
                variant={variant}
                selected={selection[variant.id]?.selected || false}
                quantity={selection[variant.id]?.quantity || 0}
                onToggle={handleToggle}
                onQuantityChange={handleQuantityChange}
                showImage={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* VP10: Sidebar */}
      <VariantSelectionSidebar
        selectedVariants={selectedVariants}
        subtotal={subtotal}
        discount={discount}
        total={total}
        onRemoveVariant={handleRemoveVariant}
        onClearAll={handleClearAll}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
```

---

## 📊 Status Summary

**Completion:** 11/13 components (84.6%)

- ✅ **VP01-VP05:** Single-variant selectors (COMPLETE)
- ✅ **VP08-VP11:** Multi-variant components (COMPLETE)
- 📋 **VP12-VP13:** CSS patterns (DOCUMENTED)

**Total Lines of Code:**
- VP08: ~200 lines
- VP09: ~250 lines
- VP10: ~220 lines
- VP11: ~120 lines
- **Total:** ~790 lines for VP08-VP11

---

## 🚀 Next Steps

**For new implementations:**
1. Import components from `@/branches/ecommerce/components/product-types/variable`
2. Use VP12/VP13 CSS patterns for layout
3. Combine with VP10 (Sidebar) and VP11 (Toolbar) for complete UX
4. Add your business logic for cart integration

**Testing:**
```bash
# TypeScript check
npx tsc --noEmit

# Build test
npm run build

# Run dev server
npm run dev
```

---

**DONE! ✨**
