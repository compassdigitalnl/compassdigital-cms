# Bundle Product Components (BB01-BB06)

**Last Updated:** 1 Maart 2026
**Status:** ✅ BB01-BB06 Complete (6/6 components)

---

## 📦 Components Overview

Components for bundle product management and display:

- ✅ **BB01: BundleOverviewCard** - Complete bundle overview with pricing
- ✅ **BB02: BundleProductCard** - Individual product card for bundles
- ✅ **BB03: BundleItemRow** - Horizontal item row with quantity controls
- ✅ **BB04: BundleDiscountTiers** - Volume discount tier display
- ✅ **BB05: BundleTotalCalculator** - Price breakdown calculator
- ✅ **BB06: BundleProgressBar** - Progress indicator for goals

---

## 💡 BB01: BundleOverviewCard

**Purpose:** Complete bundle overview showing all items, pricing, and savings

**Features:**
- Bundle title + description
- List of included items
- Price breakdown (original vs bundle)
- Savings display with percentage
- "Add to Cart" CTA
- Required vs optional items indicator

### Implementation

```tsx
import { BundleOverviewCard } from '@/branches/ecommerce/components/product-types/bundle'
import type { BundleItem } from '@/branches/ecommerce/lib/product-types'

export function BundleExample() {
  const bundleItems: BundleItem[] = [
    {
      id: '1',
      product: productObject, // Product object
      quantity: 2,
      required: true,
      discount: 10,
    },
    {
      id: '2',
      product: 'product-id-2', // Or just ID
      quantity: 1,
      required: false,
    },
  ]

  const handleAddToCart = () => {
    console.log('Adding bundle to cart')
  }

  return (
    <BundleOverviewCard
      title="Starter Bundle"
      description="Everything you need to get started"
      items={bundleItems}
      totalPrice={89.99}
      originalPrice={119.99}
      discount={25}
      onAddToCart={handleAddToCart}
    />
  )
}
```

**Visual Design:**
- Purple gradient header with Package icon
- Required items: purple dot indicator
- Optional items: gray dot + "Optioneel" badge
- Green savings badge
- Price display with monospace font

---

## 🎨 BB02: BundleProductCard

**Purpose:** Individual product card for bundle selection with image and details

**Features:**
- Product image with fallback
- Product title + short description
- Quantity display
- Discount badge (if applicable)
- Required vs optional indicator
- Selection state with checkbox
- Optional toggle handler
- Hover states and animations

### Implementation

```tsx
import { BundleProductCard } from '@/branches/ecommerce/components/product-types/bundle'

export function BundleProductSelection() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleToggle = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {bundleItems.map((item) => (
        <BundleProductCard
          key={item.id}
          item={item}
          selected={selectedItems.includes(item.id)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  )
}
```

**Visual Design:**
- Square aspect ratio image
- Checkbox in top-right corner
- Discount badge (red, top-left)
- "Verplicht" badge (purple, bottom-left)
- Purple bottom bar when selected
- Hover shadow effect

---

## 📋 BB03: BundleItemRow

**Purpose:** Horizontal row for bundle item with quantity controls and remove option

**Features:**
- Compact horizontal layout
- Product image thumbnail (80x80)
- Product name + required badge
- Quantity controls (- / + buttons)
- Price display (unit price × quantity)
- Optional remove button
- Responsive layout (stacks on mobile)

### Implementation

```tsx
import { BundleItemRow } from '@/branches/ecommerce/components/product-types/bundle'

export function BundleCart() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    '1': 2,
    '2': 1,
  })

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }))
  }

  const handleRemove = (itemId: string) => {
    setQuantities((prev) => {
      const updated = { ...prev }
      delete updated[itemId]
      return updated
    })
  }

  return (
    <div className="space-y-3">
      {bundleItems.map((item) => (
        <BundleItemRow
          key={item.id}
          item={item}
          quantity={quantities[item.id] || 1}
          onQuantityChange={handleQuantityChange}
          onRemove={item.required ? undefined : handleRemove}
        />
      ))}
    </div>
  )
}
```

**Visual Design:**
- Horizontal layout (desktop), stacks on mobile
- Minus button disabled when quantity = 1
- Remove button only shown for optional items
- Hover effects on buttons (purple accent)

---

## 📊 BB04: BundleDiscountTiers

**Purpose:** Display volume discount tiers with current quantity status

**Features:**
- List of all discount tiers
- Current active tier highlighted (green)
- Unlocked vs locked tier states
- Visual progress indicators (checkmark vs lock icon)
- "Next tier" messaging
- Responsive layout

### Implementation

```tsx
import { BundleDiscountTiers } from '@/branches/ecommerce/components/product-types/bundle'
import type { BundleDiscountTier } from '@/branches/ecommerce/lib/product-types'

export function BundleTierDisplay() {
  const tiers: BundleDiscountTier[] = [
    { minQuantity: 1, discountPercentage: 0, label: 'Standaard prijs' },
    { minQuantity: 5, discountPercentage: 10, label: 'Koop 5+' },
    { minQuantity: 10, discountPercentage: 15, label: 'Koop 10+' },
    { minQuantity: 20, discountPercentage: 20, label: 'Koop 20+' },
  ]

  const [currentQuantity, setCurrentQuantity] = useState(7)

  return (
    <BundleDiscountTiers
      tiers={tiers}
      currentQuantity={currentQuantity}
    />
  )
}
```

**Visual Design:**
- Unlocked tiers: green background + checkmark
- Locked tiers: gray background + lock icon
- Active tier: darker green with "Actieve korting" message
- Next tier message: purple box showing items needed
- Max tier message: green box when max discount reached

---

## 🧮 BB05: BundleTotalCalculator

**Purpose:** Price breakdown calculator with subtotal, discount, shipping, tax, and total

**Features:**
- Subtotal calculation (items × price)
- Discount calculation (percentage-based)
- Shipping cost display
- Tax calculation
- Final total
- Clear visual separators
- Savings summary

### Implementation

```tsx
import { BundleTotalCalculator } from '@/branches/ecommerce/components/product-types/bundle'

export function BundleCheckout() {
  const items = [
    { price: 29.99, quantity: 2 }, // €59.98
    { price: 49.99, quantity: 1 }, // €49.99
  ]

  return (
    <BundleTotalCalculator
      items={items}
      discountPercentage={15} // 15% discount
      shipping={4.95}
      tax={23.09}
    />
  )
}
```

**Example Output:**
```
Subtotaal (2 items):     €109.97
Korting (15%):           -€16.50
─────────────────────────────────
Subtotaal na korting:    €93.47
Verzendkosten:           Gratis!
BTW:                     €23.09
═════════════════════════════════
Totaal:                  €116.56

✓ Je bespaart €16.50 met deze bundel!
```

**Visual Design:**
- Calculator icon header
- Discount with TrendingDown icon (green)
- Free shipping highlighted in green
- Bold dividers before total
- Green savings summary box
- Monospace font for prices

---

## 📈 BB06: BundleProgressBar

**Purpose:** Visual progress indicator for bundle goals and milestones

**Features:**
- Animated progress bar
- Current vs goal display
- Percentage calculation
- Optional label
- Optional value display (e.g., "5 / 10")
- Color-coded (green when complete, purple otherwise)
- Completion checkmark
- Smooth animations

### Implementation

```tsx
import { BundleProgressBar } from '@/branches/ecommerce/components/product-types/bundle'

export function BundleGoal() {
  const [itemsSelected, setItemsSelected] = useState(5)

  return (
    <div className="space-y-6">
      {/* Simple progress bar */}
      <BundleProgressBar
        current={itemsSelected}
        min={0}
        max={10}
        label="Bundle Progress"
        showValue={true}
      />

      {/* Free shipping goal */}
      <BundleProgressBar
        current={currentTotal}
        min={0}
        max={50}
        label="Gratis verzending bij €50"
        showValue={false}
      />
    </div>
  )
}
```

**Visual Design:**
- Gradient fill: purple (in progress) or green (complete)
- Percentage displayed inside bar
- Checkmark + "Compleet!" when done
- "Nog X items nodig" message below
- Smooth width transition animation

**States:**
- In Progress: Purple gradient, percentage shown
- Complete: Green gradient, checkmark shown

---

## 🔄 Complete Bundle Example

**Full implementation with BB01-BB06:**

```tsx
'use client'

import { useState } from 'react'
import {
  BundleOverviewCard,
  BundleProductCard,
  BundleItemRow,
  BundleDiscountTiers,
  BundleTotalCalculator,
  BundleProgressBar,
} from '@/branches/ecommerce/components/product-types/bundle'
import type {
  BundleItem,
  BundleDiscountTier,
} from '@/branches/ecommerce/lib/product-types'

export function CompleteBundleFlow() {
  const bundleItems: BundleItem[] = [
    {
      id: '1',
      product: product1,
      quantity: 2,
      required: true,
      discount: 10,
    },
    {
      id: '2',
      product: product2,
      quantity: 1,
      required: false,
    },
    {
      id: '3',
      product: product3,
      quantity: 1,
      required: false,
    },
  ]

  const discountTiers: BundleDiscountTier[] = [
    { minQuantity: 1, discountPercentage: 0 },
    { minQuantity: 5, discountPercentage: 10 },
    { minQuantity: 10, discountPercentage: 15 },
  ]

  const [selectedItems, setSelectedItems] = useState<string[]>(['1'])
  const [quantities, setQuantities] = useState<Record<string, number>>({
    '1': 2,
  })

  // Calculate totals
  const selectedBundleItems = bundleItems.filter((item) =>
    selectedItems.includes(item.id)
  )
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  const items = selectedBundleItems.map((item) => ({
    price: typeof item.product === 'object' ? item.product.price || 0 : 0,
    quantity: quantities[item.id] || 1,
  }))

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* BB01: Bundle Overview */}
          <BundleOverviewCard
            title="Ultimate Starter Bundle"
            description="Everything you need to get started"
            items={bundleItems}
            totalPrice={89.99}
            originalPrice={119.99}
            discount={25}
            onAddToCart={() => console.log('Add to cart')}
          />

          {/* BB02: Product Cards Grid */}
          <div>
            <h2 className="text-xl font-bold mb-4">Selecteer Producten</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {bundleItems.map((item) => (
                <BundleProductCard
                  key={item.id}
                  item={item}
                  selected={selectedItems.includes(item.id)}
                  onToggle={(id) =>
                    setSelectedItems((prev) =>
                      prev.includes(id)
                        ? prev.filter((i) => i !== id)
                        : [...prev, id]
                    )
                  }
                />
              ))}
            </div>
          </div>

          {/* BB03: Selected Items Rows */}
          {selectedItems.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Geselecteerde Items</h2>
              <div className="space-y-3">
                {selectedBundleItems.map((item) => (
                  <BundleItemRow
                    key={item.id}
                    item={item}
                    quantity={quantities[item.id] || 1}
                    onQuantityChange={(id, qty) =>
                      setQuantities((prev) => ({ ...prev, [id]: qty }))
                    }
                    onRemove={
                      item.required
                        ? undefined
                        : (id) =>
                            setSelectedItems((prev) =>
                              prev.filter((i) => i !== id)
                            )
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Progress */}
        <div className="space-y-6">
          {/* BB06: Progress Bar */}
          <BundleProgressBar
            current={totalItems}
            min={0}
            max={10}
            label="Bundle Voortgang"
            showValue={true}
          />

          {/* BB04: Discount Tiers */}
          <BundleDiscountTiers
            tiers={discountTiers}
            currentQuantity={totalItems}
          />

          {/* BB05: Total Calculator */}
          <BundleTotalCalculator
            items={items}
            discountPercentage={totalItems >= 10 ? 15 : totalItems >= 5 ? 10 : 0}
            shipping={totalItems >= 5 ? 0 : 4.95}
            tax={0}
          />
        </div>
      </div>
    </div>
  )
}
```

---

## 📊 Status Summary

**Completion:** 6/6 components (100%)

- ✅ **BB01:** BundleOverviewCard (~150 lines)
- ✅ **BB02:** BundleProductCard (~180 lines)
- ✅ **BB03:** BundleItemRow (~170 lines)
- ✅ **BB04:** BundleDiscountTiers (~140 lines)
- ✅ **BB05:** BundleTotalCalculator (~150 lines)
- ✅ **BB06:** BundleProgressBar (~90 lines)

**Total Lines of Code:** ~880 lines

---

## 🚀 Next Steps

**For new implementations:**
1. Import components from `@/branches/ecommerce/components/product-types/bundle`
2. Define your `BundleItem[]` array with products
3. Set up discount tiers (if applicable)
4. Combine components for complete bundle UX
5. Add your business logic for cart integration

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
