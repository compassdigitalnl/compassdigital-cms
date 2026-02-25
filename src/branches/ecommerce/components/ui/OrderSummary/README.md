# OrderSummary (ec07)

Sidebar component displaying order totals breakdown (subtotal, discount, shipping, tax) with grand total and checkout CTA buttons. Used in cart pages, checkout reviews, and order confirmations.

## Features

- ✅ **Line-by-line cost breakdown:** Subtotal, discount, shipping, tax
- ✅ **Discount display:** Green color, negative value, shows discount code
- ✅ **Free shipping indicator:** "Gratis" label when shipping is free
- ✅ **Tax calculation:** 21% BTW by default (customizable)
- ✅ **Grand total:** Large, bold typography (Jakarta Sans 28px 800)
- ✅ **Tax-inclusive note:** "Inclusief BTW" below total
- ✅ **Primary CTA:** "Naar betalen" with gradient teal button
- ✅ **Secondary CTA:** "Offerte aanvragen" (optional, outline button)
- ✅ **Sticky positioning:** Option for cart sidebar (top: 90px)
- ✅ **Read-only mode:** Hide action buttons (for order confirmation)
- ✅ **Theme variables only:** NO hardcoded colors!
- ✅ **Mobile responsive:** Static positioning on mobile, reduced font sizes
- ✅ **Fully accessible:** WCAG 2.1 AA compliant

## Usage

```tsx
import { OrderSummary } from '@/branches/ecommerce/components/ui'

<OrderSummary
  subtotal={61.35}
  discount={6.14}
  discountCode="SUMMER10"
  shipping={6.95}
  tax={13.03}
  total={75.19}
  onCheckout={() => router.push('/checkout')}
  onRequestQuote={() => setQuoteModalOpen(true)}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `subtotal` | `number` | ✓ | - | Subtotal (before discounts/shipping) |
| `discount` | `number` |  | - | Discount amount (positive, displayed as negative) |
| `discountCode` | `string` |  | - | Discount code applied (e.g., "SUMMER10") |
| `shipping` | `number \| 'free'` | ✓ | - | Shipping cost (number or 'free') |
| `tax` | `number` | ✓ | - | Tax amount |
| `total` | `number` | ✓ | - | Grand total |
| `showQuoteButton` | `boolean` |  | `true` | Show "Offerte aanvragen" button |
| `sticky` | `boolean` |  | `false` | Apply sticky positioning (for sidebar) |
| `readonly` | `boolean` |  | `false` | Hide action buttons (read-only mode) |
| `taxRate` | `number` |  | `21` | Tax rate percentage |
| `taxLabel` | `string` |  | `"BTW (21%)"` | Tax label override |
| `currencySymbol` | `string` |  | `'€'` | Currency symbol |
| `locale` | `string` |  | `'nl-NL'` | Locale for number formatting |
| `onCheckout` | `() => void` |  | - | Callback when checkout button clicked |
| `onRequestQuote` | `() => void` |  | - | Callback when request quote clicked |
| `className` | `string` |  | `''` | Additional CSS class names |

## Common Use Cases

### Cart Page Sidebar (Sticky)
```tsx
<OrderSummary
  subtotal={61.35}
  discount={6.14}
  discountCode="SUMMER10"
  shipping={6.95}
  tax={13.03}
  total={75.19}
  sticky={true}
  onCheckout={() => router.push('/checkout')}
  onRequestQuote={() => setQuoteModalOpen(true)}
/>
```
- Sticky positioning at `top: 90px` (below header)
- Both action buttons visible
- Shows discount with code

### Free Shipping
```tsx
<OrderSummary
  subtotal={124.80}
  shipping="free"
  tax={26.21}
  total={124.80}
  onCheckout={() => router.push('/checkout')}
/>
```
- "Verzendkosten: Gratis" displayed in green
- Total equals subtotal + tax

### Checkout Page
```tsx
<OrderSummary
  subtotal={61.35}
  shipping={6.95}
  tax={13.03}
  total={68.30}
  showQuoteButton={false}
  onCheckout={handlePlaceOrder}
/>
```
- No sticky positioning
- Only checkout button (no quote button)
- Static in right column

### Order Confirmation (Read-Only)
```tsx
<OrderSummary
  subtotal={61.35}
  discount={6.14}
  discountCode="SUMMER10"
  shipping={6.95}
  tax={13.03}
  total={75.19}
  readonly={true}
/>
```
- No action buttons
- Read-only display of final order totals
- Center-aligned on confirmation page

### No Discount Applied
```tsx
<OrderSummary
  subtotal={38.85}
  shipping={6.95}
  tax={9.62}
  total={55.42}
  onCheckout={() => router.push('/checkout')}
/>
```
- Discount row not rendered (omitted if `discount` is undefined or 0)
- Standard display

### Custom Tax Rate
```tsx
<OrderSummary
  subtotal={100.00}
  shipping={5.00}
  tax={6.30}
  total={111.30}
  taxRate={6}
  taxLabel="BTW (6%)"
  onCheckout={() => router.push('/checkout')}
/>
```
- Custom tax rate (e.g., 6% for books/magazines in NL)
- Custom tax label

## Real-World Integration

### With Cart Context
```tsx
'use client'

import { useCart } from '@/providers/CartProvider'
import { OrderSummary } from '@/branches/ecommerce/components/ui'

export function CartPage() {
  const { items, subtotal, discount, discountCode, shipping, tax, total } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    router.push('/checkout')
  }

  const handleRequestQuote = () => {
    // Open quote request modal
    setQuoteModalOpen(true)
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        {/* Cart items list */}
      </div>

      <div className="cart-sidebar">
        <OrderSummary
          subtotal={subtotal}
          discount={discount}
          discountCode={discountCode}
          shipping={shipping}
          tax={tax}
          total={total}
          sticky={true}
          onCheckout={handleCheckout}
          onRequestQuote={handleRequestQuote}
        />
      </div>
    </div>
  )
}
```

### With Dynamic Tax Calculation
```tsx
'use client'

import { useMemo } from 'react'
import { OrderSummary } from '@/branches/ecommerce/components/ui'

export function CheckoutSidebar({ items, discountCode }) {
  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Apply discount
    const discountAmount = discountCode === 'SUMMER10' ? subtotal * 0.1 : 0
    const subtotalAfterDiscount = subtotal - discountAmount

    // Calculate shipping
    const shipping = subtotalAfterDiscount >= 150 ? 0 : 6.95

    // Calculate tax (21%)
    const tax = (subtotalAfterDiscount + shipping) * 0.21

    // Total
    const total = subtotalAfterDiscount + shipping + tax

    return {
      subtotal,
      discount: discountAmount,
      shipping,
      tax,
      total,
    }
  }, [items, discountCode])

  return (
    <OrderSummary
      {...calculations}
      discountCode={discountCode}
      onCheckout={handlePlaceOrder}
    />
  )
}
```

## Theme Variables Used

### Colors
- `--white` (#FAFBFC) - Card background
- `--grey` (#E8ECF1) - Border, divider
- `--grey-mid` (#94A3B8) - Tax note
- `--grey-dark` (#64748B) - Row labels
- `--navy` (#0A1628) - Header, values, total
- `--teal` (#00897B) - Header icon, button gradient start
- `--teal-light` (#26A69A) - Button gradient end
- `--green` (#00C853) - Discount value, free shipping

### Typography
- `--font-display` (Plus Jakarta Sans) - Header (18px 800), Total (28px 800)
- `--font-primary` (DM Sans) - All other text, buttons

### Spacing
- `--radius` (12px) - Button border radius
- `--radius-lg` (16px) - Card border radius
- `--transition` (0.2s cubic-bezier) - Hover transitions

## Mobile Responsive (< 768px)

- **Padding:** Reduced to 20px (from 28px)
- **Sticky:** Disabled (position: static)
- **Total value:** 24px (from 28px)
- **Total cents:** 18px (from 22px)

## Accessibility

### Semantic HTML
- Proper heading hierarchy (visual, not semantic h1-h6)
- Descriptive button text
- Icon + text for better comprehension

### Keyboard Support
- **Tab:** Navigate to action buttons
- **Enter/Space:** Activate buttons
- All interactive elements keyboard accessible

### Screen Reader Support
- Price formatting clearly announced
- Discount code announced with amount
- Free shipping clearly indicated
- Total amount announced distinctly

### Color Contrast
- Labels (grey-dark on white): 4.8:1 (WCAG AA ✓)
- Values (navy on white): 14.8:1 (WCAG AAA ✓)
- Total (navy on white): 14.8:1 (WCAG AAA ✓)
- Buttons meet WCAG AA standards

## Integration with Other Components

- **MiniCartFlyout (c2):** Uses similar summary structure in footer
- **CartLineItem (ec06):** Items displayed above OrderSummary on cart page
- **CouponInput (ec08):** Apply discount codes that update OrderSummary
- **FreeShippingProgress (ec05):** Can be shown above OrderSummary on cart page

## Layout Patterns

### Cart Page (Sticky Sidebar)
```
┌────────────────────────────────────────────┐
│  Cart Items (Left Column)                 │ OrderSummary
│  ┌───────────────────────────────────┐    │ (Sticky Sidebar)
│  │ CartLineItem                      │    │ ┌──────────────┐
│  └───────────────────────────────────┘    │ │ Overzicht    │
│  ┌───────────────────────────────────┐    │ │ Subtotaal    │
│  │ CartLineItem                      │    │ │ Korting      │
│  └───────────────────────────────────┘    │ │ Verzending   │
│  ┌───────────────────────────────────┐    │ │ BTW          │
│  │ CartLineItem                      │    │ │ ───────────  │
│  └───────────────────────────────────┘    │ │ Totaal       │
│                                            │ │ Naar betalen │
└────────────────────────────────────────────┘ └──────────────┘
```

### Checkout Page (Static)
```
┌────────────────────────────────────────────┐
│  Shipping Form (Left)    OrderSummary (R) │
│  ┌──────────────────┐    ┌──────────────┐ │
│  │ Name             │    │ Overzicht    │ │
│  │ Address          │    │ Subtotaal    │ │
│  │ City             │    │ Verzending   │ │
│  │ Postal Code      │    │ BTW          │ │
│  └──────────────────┘    │ ───────────  │ │
│                          │ Totaal       │ │
│                          │ Naar betalen │ │
│                          └──────────────┘ │
└────────────────────────────────────────────┘
```

## Component Location

```
src/branches/ecommerce/components/ui/OrderSummary/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Cart
**Priority:** CRITICAL (essential for checkout flow)
**Last Updated:** February 25, 2026
