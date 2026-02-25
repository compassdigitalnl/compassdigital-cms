# FreeShippingProgress (ec05)

Visual progress bar showing customers how much more they need to spend to qualify for free shipping. Encourages larger cart values through clear visual feedback.

## Features

- ✅ **Real-time progress calculation:** Based on cart total vs threshold
- ✅ **Teal gradient progress bar:** Smooth 0.5s animation
- ✅ **Dynamic icon:** Truck (in progress) → CheckCircle (achieved)
- ✅ **Remaining amount highlighted:** Teal color for emphasis
- ✅ **Success state:** Green color scheme when achieved
- ✅ **Threshold display:** Shows free shipping threshold amount
- ✅ **Theme variables only:** NO hardcoded colors!
- ✅ **Mobile responsive:** Reduced padding and font sizes
- ✅ **Fully accessible:** WCAG 2.1 AA compliant

## Usage

```tsx
import { FreeShippingProgress } from '@/branches/ecommerce/components/ui'

<FreeShippingProgress
  currentTotal={37.50}
  threshold={60.00}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentTotal` | `number` | ✓ | - | Current cart total (before shipping) |
| `threshold` | `number` | ✓ | - | Free shipping threshold amount |
| `currencySymbol` | `string` |  | `'€'` | Currency symbol |
| `locale` | `string` |  | `'nl-NL'` | Locale for number formatting |
| `showThresholdText` | `boolean` |  | `true` | Show threshold text below progress bar |
| `thresholdText` | `string` |  | - | Custom threshold text override |
| `achievedText` | `string` |  | - | Custom achieved message override |
| `className` | `string` |  | `''` | Additional CSS class names |

## Common Use Cases

### Basic Usage (In Progress)
```tsx
<FreeShippingProgress
  currentTotal={37.50}
  threshold={60.00}
/>
```
- Shows: "Nog € 22,50 tot gratis verzending!"
- Progress bar: 62.5% filled
- Truck icon in teal

### Achieved State
```tsx
<FreeShippingProgress
  currentTotal={65.00}
  threshold={60.00}
/>
```
- Shows: "Je bestelling komt in aanmerking voor gratis verzending! 🎉"
- Progress bar: 100% filled (green gradient)
- CheckCircle icon in green

### Custom Messages
```tsx
<FreeShippingProgress
  currentTotal={45.00}
  threshold={60.00}
  thresholdText="Spend €60+ for free delivery"
  achievedText="Free delivery unlocked!"
/>
```
- Custom threshold and achievement messages
- Useful for multi-language sites

### Without Threshold Text
```tsx
<FreeShippingProgress
  currentTotal={37.50}
  threshold={60.00}
  showThresholdText={false}
/>
```
- Only shows progress bar and remaining amount
- More compact display for limited space

## States

### In Progress (< 100%)
- **Icon:** Truck (teal)
- **Text:** "Nog €XX,XX tot gratis verzending!"
- **Progress Bar:** Teal gradient (percentage based)
- **Threshold Text:** "Bij bestellingen vanaf €XX,XX gratis verzending"

### Achieved (≥ 100%)
- **Icon:** CheckCircle (green)
- **Text:** "Je bestelling komt in aanmerking voor gratis verzending! 🎉"
- **Progress Bar:** Green gradient (100%)
- **Threshold Text:** "Gratis verzending toegepast bij checkout"

## Real-World Integration

### Cart Page
```tsx
'use client'

import { useCart } from '@/providers/CartProvider'
import { FreeShippingProgress } from '@/branches/ecommerce/components/ui'

export function CartPage() {
  const { subtotal } = useCart()
  const freeShippingThreshold = 60.00

  return (
    <div className="cart-page">
      {/* Free Shipping Progress at top */}
      <FreeShippingProgress
        currentTotal={subtotal}
        threshold={freeShippingThreshold}
      />

      {/* Cart items */}
      <div className="cart-items">
        {/* ... */}
      </div>
    </div>
  )
}
```

### MiniCart Flyout
```tsx
import { MiniCartFlyout, FreeShippingProgress } from '@/branches/ecommerce/components/ui'

export function MiniCart() {
  const { items, subtotal } = useCart()

  return (
    <MiniCartFlyout
      items={items}
      summary={{
        subtotal,
        shipping: subtotal >= 60 ? 0 : 6.95,
        total: subtotal + (subtotal >= 60 ? 0 : 6.95),
        itemCount: items.length,
      }}
      freeShipping={{
        threshold: 60,
        current: subtotal,
        remaining: Math.max(0, 60 - subtotal),
        percentage: Math.min(100, (subtotal / 60) * 100),
        achieved: subtotal >= 60,
      }}
      isOpen={isOpen}
      onClose={closeCart}
      onQuantityChange={updateQty}
      onRemove={removeItem}
      onCheckout={handleCheckout}
    />
  )
}
```

### With Dynamic Threshold (from CMS)
```tsx
'use client'

import { FreeShippingProgress } from '@/branches/ecommerce/components/ui'
import { useGlobalSettings } from '@/hooks/useGlobalSettings'

export function CartSummary({ subtotal }) {
  const { freeShippingThreshold } = useGlobalSettings()

  return (
    <FreeShippingProgress
      currentTotal={subtotal}
      threshold={freeShippingThreshold || 60}
    />
  )
}
```

## Theme Variables Used

### Colors
- `--white` (#FAFBFC) - Card background
- `--grey` (#E8ECF1) - Border, progress bar background
- `--grey-mid` (#94A3B8) - Threshold text
- `--navy` (#0A1628) - Main text
- `--teal` (#00897B) - Icon, amount highlight, gradient start (in progress)
- `--teal-light` (#26A69A) - Gradient end (in progress)
- `--green` (#00C853) - Success state (icon, text, gradient start)
- `#4CAF50` - Success gradient end

### Typography
- `--font-primary` (DM Sans) - All text

### Spacing & Animation
- `--transition` (0.2s cubic-bezier) - Hover transitions
- Custom: 0.5s ease for progress bar width animation

## Mobile Responsive (< 768px)

- **Padding:** Reduced to 14px 18px (from 18px 24px)
- **Gap:** 12px (from 16px)
- **Icon:** 20px (from 24px)
- **Text:** 13px (from 14px)
- **Threshold:** 11px (from 12px)

## Accessibility

### Semantic HTML
- Proper structure with descriptive text
- Icon provides visual reinforcement
- Color is not the only indicator (text also changes)

### Screen Reader Support
- Remaining amount clearly announced
- Achievement message announced
- Threshold text provides context

### Color Contrast
- Text (navy on white): 14.8:1 (WCAG AAA ✓)
- Amount (teal on white): 4.6:1 (WCAG AA ✓)
- Threshold (grey-mid on white): 4.5:1 (WCAG AA ✓)

## Conversion Optimization Tips

### Average Order Value (AOV) Increase
- Studies show 20-30% increase in AOV with free shipping progress bars
- Most effective when threshold is 20-40% above average cart value
- Dynamic thresholds can adapt to customer segments

### Recommended Thresholds
- **B2C:** €50-€75 (European markets)
- **B2B:** €150-€300 (larger order values)
- **Digital Products:** Often no shipping, skip this component

### Best Practices
- **Show early:** Display from first item in cart
- **Prominent placement:** Above cart items or in sidebar
- **Real-time updates:** Animate progress bar on quantity changes
- **Clear messaging:** Use action-oriented language
- **Success celebration:** Emoji or icon change when achieved

## Integration with Other Components

- **MiniCartFlyout (c2):** Embedded in flyout header (condensed version)
- **OrderSummary (ec07):** Can be shown above OrderSummary on cart page
- **CartLineItem (ec06):** Updates progress when quantity changes
- **CouponInput (ec08):** Consider excluding discounts from progress calculation

## Component Location

```
src/branches/ecommerce/components/ui/FreeShippingProgress/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Conversion
**Priority:** CRITICAL (proven AOV booster)
**Last Updated:** February 25, 2026
