# StaffelCalculator (c4)

Volume pricing calculator showing tiered pricing (staffelprijzen) with live updates. Encourages bulk purchases by showing savings and next-tier hints.

## Features

- ✅ **Tiered pricing:** 4+ price levels with quantity ranges
- ✅ **Visual tier selection:** Radio-style cards with check icons
- ✅ **Quantity stepper:** Increment/decrement buttons
- ✅ **Live calculation:** Total updates automatically
- ✅ **Savings display:** Shows amount saved vs. base price
- ✅ **Next-tier hint:** Smart upsell ("Bestel er X meer...")
- ✅ **Clickable tiers:** Jump to tier minimum quantity
- ✅ **Keyboard accessible:** Full ARIA support
- ✅ **Theme variables only:** NO hardcoded colors!
- ✅ **Responsive:** Stacks on mobile

## Usage

### Basic Usage

```tsx
import { StaffelCalculator } from '@/branches/ecommerce/components/products/StaffelCalculator'

const tiers = [
  { min: 1, max: 4, price: 8.95, discount: 0 },
  { min: 5, max: 9, price: 8.25, discount: 8 },
  { min: 10, max: 24, price: 7.50, discount: 16 },
  { min: 25, max: Infinity, price: 6.95, discount: 22 },
]

<StaffelCalculator
  productName="Peha-soft Nitrile Fino"
  basePrice={8.95}
  tiers={tiers}
  initialQty={5}
/>
```

### With Callback

```tsx
<StaffelCalculator
  productName="Nitrile Handschoenen"
  basePrice={8.95}
  tiers={tiers}
  initialQty={5}
  onQtyChange={(qty, total, tier) => {
    console.log(`Quantity: ${qty}, Total: €${total}, Price: €${tier.price}`)
    // Update cart or external state
  }}
/>
```

### Custom Unit

```tsx
<StaffelCalculator
  productName="Latex Handschoenen"
  basePrice={12.50}
  tiers={tiers}
  unit="dozen" // instead of "stuks"
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `productName` | `string` | ✓ | - | Product name (shown in header) |
| `basePrice` | `number` | ✓ | - | Base price (first tier, for savings calc) |
| `tiers` | `VolumePriceTier[]` | ✓ | - | Volume pricing tiers |
| `initialQty` | `number` |  | `1` | Initial quantity |
| `unit` | `string` |  | `"stuks"` | Unit name (stuks/dozen/boxes) |
| `currencySymbol` | `string` |  | `"€"` | Currency symbol |
| `onQtyChange` | `(qty, total, tier) => void` |  | - | Quantity change callback |
| `className` | `string` |  | `''` | Additional CSS classes |

## Volume Pricing Tiers

### Tier Structure

```typescript
interface VolumePriceTier {
  min: number        // Minimum quantity for this tier
  max: number        // Maximum quantity (use Infinity for last tier)
  price: number      // Price per unit at this tier
  discount: number   // Discount percentage (vs. base price)
}
```

### Example Tier Configuration

```typescript
const tiers: VolumePriceTier[] = [
  {
    min: 1,
    max: 4,
    price: 8.95,
    discount: 0, // No discount (base price)
  },
  {
    min: 5,
    max: 9,
    price: 8.25,
    discount: 8, // 8% off base price
  },
  {
    min: 10,
    max: 24,
    price: 7.50,
    discount: 16, // 16% off
  },
  {
    min: 25,
    max: Infinity,
    price: 6.95,
    discount: 22, // 22% off (highest tier)
  },
]
```

### Tier Display

- **1 – 4 stuks:** €8,95 (no badge)
- **5 – 9 stuks:** €8,25 **−8%** (green badge)
- **10 – 24 stuks:** €7,50 **−16%** (green badge)
- **25+ stuks:** €6,95 **−22%** (green badge)

## Component Sections

### 1. Header (with Icon)

```tsx
<div className="staffel-header">
  <Tag size={20} /> {/* Lucide icon */}
  <div className="staffel-title">Staffelprijzen — {productName}</div>
</div>
```

### 2. Tier Cards (Radio Group)

Interactive cards showing each pricing tier:

- **Radio-style selection:** Circle with check icon when active
- **Clickable:** Jump to tier minimum quantity
- **Keyboard accessible:** Tab through, Enter/Space to select
- **Visual feedback:** Hover (grey), Active (teal glow)
- **Discount badge:** Green pill showing percentage off

### 3. Calculator Section

Two-column layout (stacks on mobile):

**Left:** Quantity stepper
- Label: "Aantal {unit}"
- Decrement button (−)
- Number input (editable)
- Increment button (+)

**Right:** Result display
- **Total price:** Large, bold (22px, 800 weight)
- **Unit breakdown:** "{qty} × €{price} per {unit}"
- **Savings:** Green text with TrendingDown icon

### 4. Hint Section (Upsell)

Smart next-tier suggestion:

- **Has next tier:** "Bestel er X meer en betaal €Y per {unit} (−Z%)"
- **Highest tier:** "U profiteert van de hoogste staffelkorting!"

## Real-World Integration

### In Product Detail Page

```tsx
'use client'

import { useState } from 'react'
import { StaffelCalculator } from '@/branches/ecommerce/components/products/StaffelCalculator'
import { useCart } from '@/branches/shared/components/ui/CartContext'

export function ProductDetailPage({ product }) {
  const { addToCart } = useCart()
  const [selectedQty, setSelectedQty] = useState(1)
  const [selectedTotal, setSelectedTotal] = useState(product.basePrice)

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>

      {/* Volume Pricing Calculator */}
      {product.volumePricing && (
        <StaffelCalculator
          productName={product.name}
          basePrice={product.basePrice}
          tiers={product.volumePricing}
          initialQty={1}
          onQtyChange={(qty, total, tier) => {
            setSelectedQty(qty)
            setSelectedTotal(total)
          }}
        />
      )}

      {/* Add to Cart */}
      <button
        onClick={() => {
          addToCart({
            productId: product.id,
            quantity: selectedQty,
            price: selectedTotal / selectedQty,
          })
        }}
      >
        Toevoegen aan winkelwagen (€{selectedTotal.toFixed(2)})
      </button>
    </div>
  )
}
```

### With Payload Products Collection

```typescript
// In Products collection config
{
  slug: 'products',
  fields: [
    {
      name: 'volumePricing',
      type: 'array',
      label: 'Staffelprijzen',
      fields: [
        {
          name: 'min',
          type: 'number',
          required: true,
          label: 'Min aantal',
        },
        {
          name: 'max',
          type: 'number',
          required: true,
          label: 'Max aantal',
          admin: {
            description: 'Gebruik 999999 voor laatste tier (25+)',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'Prijs per stuk',
        },
        {
          name: 'discount',
          type: 'number',
          required: true,
          label: 'Korting (%)',
          admin: {
            description: 'Percentage korting t.o.v. basisprijs',
          },
        },
      ],
    },
  ],
}
```

### Auto-Calculate Discount Hook

```typescript
// In Products collection hooks
{
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.volumePricing && data.basePrice) {
          // Auto-calculate discount percentages
          data.volumePricing = data.volumePricing.map((tier: any) => ({
            ...tier,
            discount: Math.round(
              ((data.basePrice - tier.price) / data.basePrice) * 100
            ),
          }))
        }
        return data
      },
    ],
  },
}
```

## Calculations

### Total Price

```typescript
const total = quantity * currentTier.price
```

### Savings (vs. Base Price)

```typescript
const savings = quantity * (basePrice - currentTier.price)
```

### Next Tier Hint

```typescript
const nextTier = tiers.find((t) => t.min > quantity)
if (nextTier) {
  const qtyNeeded = nextTier.min - quantity
  // "Bestel er {qtyNeeded} meer en betaal €{nextTier.price} per {unit}"
}
```

### Tier Detection

```typescript
const getTierForQty = (qty: number): VolumePriceTier => {
  return tiers.find((t) => qty >= t.min && qty <= t.max) || tiers[0]
}
```

## Accessibility

### ARIA Attributes

```tsx
{/* Tier radio group */}
<div role="radiogroup" aria-label="Staffelprijzen">
  <div
    role="radio"
    aria-checked={isActive}
    tabIndex={0}
    onClick={handleTierClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleTierClick()
      }
    }}
  >
    {/* Tier content */}
  </div>
</div>

{/* Quantity input */}
<input
  type="number"
  value={quantity}
  aria-label={`Aantal ${unit}`}
  min={1}
/>

{/* Stepper buttons */}
<button aria-label="Aantal verlagen">−</button>
<button aria-label="Aantal verhogen">+</button>
```

### Keyboard Support

- **Tab:** Navigate through tiers and controls
- **Enter/Space:** Select tier
- **Arrow keys:** Adjust quantity in input
- **Focus indicators:** 2px teal outline

### Screen Reader Behavior

- **Tier selection:** "5 – 9 stuks, €8,25, −8%, radio button, checked"
- **Quantity change:** Value announced when changed
- **Savings update:** Updates announced as they change

## Theme Variables Used

### Colors

- **Teal:** `var(--teal)` — #00897B (icons, active tier)
- **Teal Glow:** `var(--teal-glow)` — rgba(0, 137, 123, 0.12) (active tier bg, hint bg)
- **Green:** `var(--green)` — #00C853 (savings text)
- **Green Light:** `var(--green-light)` — #E8F5E9 (discount badge bg)
- **Grey:** `var(--grey)` — #E8ECF1 (borders, unchecked radio)
- **Grey Light:** `var(--grey-light)` — #F1F4F8 (calculator bg, hover)
- **Grey Mid:** `var(--grey-mid)` — #94A3B8 (labels, unit text)
- **Navy:** `var(--navy)` — #0A1628 (text, prices)

### Typography

- `--font-primary` (DM Sans) - Body text
- `--font-display` (Plus Jakarta Sans) - Title, prices
- `--font-mono` (JetBrains Mono) - Quantity input

## Styling Details

### Tier Cards

- **Padding:** 10px 14px
- **Border radius:** 10px
- **Border:** 1.5px solid transparent
- **Active bg:** var(--teal-glow)
- **Active border:** rgba(0, 137, 123, 0.15)
- **Hover bg:** var(--grey-light)

### Check Icon

- **Size:** 20px × 20px circle
- **Border:** 2px solid var(--grey)
- **Active bg:** var(--teal)
- **Icon:** Check (12px, white)

### Discount Badge

- **Background:** var(--green-light)
- **Color:** var(--green)
- **Padding:** 2px 8px
- **Border radius:** 100px (pill shape)
- **Font size:** 12px
- **Font weight:** 700

### Calculator Section

- **Background:** var(--grey-light)
- **Padding:** 16px
- **Border radius:** 12px
- **Gap:** 16px (between qty and result)

### Quantity Stepper

- **Button size:** 36px × 38px
- **Input width:** 52px
- **Border:** 2px solid var(--grey)
- **Border radius:** 10px
- **Font:** var(--font-mono), 15px, 600

### Total Price

- **Font:** var(--font-display)
- **Size:** 22px
- **Weight:** 800

## Responsive Behavior

### Desktop (>640px)

Calculator section: Horizontal layout
- Left: Quantity stepper
- Right: Result display

### Mobile (≤640px)

Calculator section: Vertical stack
- Top: Result display
- Bottom: Quantity stepper

```css
@media (max-width: 640px) {
  .staffel-calc {
    flex-direction: column;
    align-items: stretch;
  }

  .staffel-qty-wrap {
    order: 2; /* Bottom */
  }

  .staffel-result {
    order: 1; /* Top */
  }
}
```

## Best Practices

### Tier Configuration

- ✅ Start with quantity 1 (not 0)
- ✅ Use Infinity for last tier max
- ✅ Ensure no gaps between tiers (5-9, 10-24, NOT 5-9, 11-24)
- ✅ Discount percentages should increase with quantity
- ✅ Aim for 3-5 tiers (not too many)

### Pricing Strategy

- **Tier 1 (1-4):** Base price, no discount
- **Tier 2 (5-9):** 5-10% off (encourage small bulk)
- **Tier 3 (10-24):** 15-20% off (encourage medium bulk)
- **Tier 4 (25+):** 20-30% off (encourage large bulk)

### Next-Tier Hints

- ✅ Show hint when user is close to next tier (within 10 units)
- ✅ Hide hint when at highest tier
- ✅ Use encouraging language ("Bestel er X meer...")

## Integration with Other Components

- **ProductCard (ec01):** Show "Staffelkorting" badge if volumePricing exists
- **ProductBadges (c18):** Use "staffel" variant badge
- **StockIndicator (ec04):** Show stock status alongside calculator
- **CartLineItem (ec06):** Apply tier pricing in cart
- **QuantityStepper (c23):** Reusable quantity control (already integrated)

## Future Enhancements

### Bulk Discount Visualization

```tsx
<div className="tier-savings-chart">
  {/* Visual bar chart showing increasing discounts */}
</div>
```

### Tier Comparison Table

```tsx
<table className="tier-comparison">
  <thead>
    <tr>
      <th>Aantal</th>
      <th>Prijs per stuk</th>
      <th>Besparing</th>
    </tr>
  </thead>
  <tbody>
    {tiers.map((tier) => (
      <tr>
        <td>{tier.min}–{tier.max}</td>
        <td>€{tier.price}</td>
        <td>−{tier.discount}%</td>
      </tr>
    ))}
  </tbody>
</table>
```

### Custom Quantity Input

Allow custom quantities via modal:

```tsx
<button onClick={() => setShowCustomQtyModal(true)}>
  Aangepast aantal invoeren
</button>
```

## Component Location

```
src/branches/ecommerce/components/products/StaffelCalculator/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Products
**Complexity:** High (interactive calculations, tier detection)
**Priority:** HIGH (increases average order value)
**Last Updated:** February 25, 2026
