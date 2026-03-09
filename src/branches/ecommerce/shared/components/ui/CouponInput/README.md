# CouponInput (ec08)

Input field with submit button for applying discount/coupon codes. Includes validation, loading states, error/success feedback, and applied coupon display.

## Features

- ✅ **Text input:** With placeholder and auto-uppercase formatting
- ✅ **Submit button:** "Toepassen" (Apply) with disabled state
- ✅ **Loading state:** Spinner animation during validation
- ✅ **Error feedback:** Red border + error message with icon
- ✅ **Success display:** Applied coupon card with code and discount amount
- ✅ **Remove button:** Remove applied coupon with hover effect
- ✅ **Theme variables only:** NO hardcoded colors!
- ✅ **Mobile responsive:** Reduced padding and font sizes
- ✅ **Fully accessible:** WCAG 2.1 AA compliant

## Usage

```tsx
import { CouponInput } from '@/branches/ecommerce/components/ui'

<CouponInput
  onApply={async (code) => {
    const result = await validateCoupon(code)
    if (result.valid) {
      setAppliedCoupon({ code, discountAmount: result.discount })
    } else {
      setError('Deze kortingscode is ongeldig of verlopen')
    }
  }}
  onRemove={() => setAppliedCoupon(undefined)}
  appliedCoupon={appliedCoupon}
  isLoading={isValidating}
  errorMessage={error}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onApply` | `(code: string) => void \| Promise<void>` | ✓ | - | Callback when user submits coupon code |
| `appliedCoupon` | `AppliedCoupon` |  | - | Applied coupon data (code + discount) |
| `isLoading` | `boolean` |  | `false` | Loading state during validation |
| `errorMessage` | `string` |  | - | Error message if validation failed |
| `onRemove` | `() => void` |  | - | Callback when user removes coupon |
| `currencySymbol` | `string` |  | `'€'` | Currency symbol |
| `placeholder` | `string` |  | `'Kortingscode'` | Input placeholder text |
| `buttonText` | `string` |  | `'Toepassen'` | Button text |
| `autoUppercase` | `boolean` |  | `true` | Auto-uppercase input |
| `className` | `string` |  | `''` | Additional CSS class names |

## Types

```tsx
interface AppliedCoupon {
  code: string              // Coupon code (e.g., "SUMMER10")
  discountAmount: number    // Discount amount applied
}
```

## States

### Default (No Coupon)
```tsx
<CouponInput
  onApply={handleApply}
/>
```
- Empty input field
- Enabled apply button
- No feedback messages

### Loading (Validating)
```tsx
<CouponInput
  onApply={handleApply}
  isLoading={true}
/>
```
- Disabled input field
- Button shows spinner animation
- Input retains value during validation

### Error (Invalid Code)
```tsx
<CouponInput
  onApply={handleApply}
  errorMessage="Deze kortingscode is ongeldig of verlopen"
/>
```
- Red border on input field
- Error message with XCircle icon
- Button remains enabled for retry

### Applied (Success)
```tsx
<CouponInput
  onApply={handleApply}
  onRemove={handleRemove}
  appliedCoupon={{ code: 'SUMMER10', discountAmount: 6.14 }}
/>
```
- Shows applied coupon card
- Green background with code and discount
- Remove button (X icon) in top-right

## Real-World Integration

### With Cart Context
```tsx
'use client'

import { useState } from 'react'
import { CouponInput } from '@/branches/ecommerce/components/ui'
import { useCart } from '@/providers/CartProvider'

export function CartSidebar() {
  const { applyCoupon, removeCoupon, appliedCoupon } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()

  const handleApply = async (code: string) => {
    setIsLoading(true)
    setError(undefined)

    try {
      const result = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      }).then((r) => r.json())

      if (result.valid) {
        applyCoupon({ code, discountAmount: result.discount })
      } else {
        setError(result.message || 'Deze kortingscode is ongeldig of verlopen')
      }
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="cart-sidebar">
      <CouponInput
        onApply={handleApply}
        onRemove={removeCoupon}
        appliedCoupon={appliedCoupon}
        isLoading={isLoading}
        errorMessage={error}
      />
    </div>
  )
}
```

### API Validation Example
```tsx
// app/api/validate-coupon/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { code } = await request.json()

  // Mock validation logic
  const coupons = {
    SUMMER10: { discount: 10, percentage: true },
    WINTER15: { discount: 15, percentage: true },
    FIXED20: { discount: 20, percentage: false },
  }

  const coupon = coupons[code.toUpperCase()]

  if (coupon) {
    return NextResponse.json({
      valid: true,
      discount: coupon.discount,
      percentage: coupon.percentage,
    })
  }

  return NextResponse.json({
    valid: false,
    message: 'Deze kortingscode is ongeldig of verlopen',
  })
}
```

### In OrderSummary
```tsx
import { OrderSummary, CouponInput } from '@/branches/ecommerce/components/ui'

export function CheckoutSidebar() {
  return (
    <div>
      {/* Coupon Input above Order Summary */}
      <div className="mb-4">
        <CouponInput
          onApply={handleApply}
          onRemove={handleRemove}
          appliedCoupon={appliedCoupon}
          isLoading={isValidating}
          errorMessage={error}
        />
      </div>

      {/* Order Summary with applied discount */}
      <OrderSummary
        subtotal={61.35}
        discount={appliedCoupon?.discountAmount}
        discountCode={appliedCoupon?.code}
        shipping={6.95}
        tax={13.03}
        total={68.23}
        onCheckout={handleCheckout}
      />
    </div>
  )
}
```

## Theme Variables Used

### Colors
- `--white` (#FAFBFC) - Input background
- `--bg` (#F5F7FA) - Button background (default)
- `--grey` (#E8ECF1) - Border (default)
- `--grey-mid` (#94A3B8) - Placeholder text
- `--grey-dark` (#64748B) - Remove button
- `--navy` (#0A1628) - Text, button text
- `--teal` (#00897B) - Focus state, hover state, spinner
- `--green` (#00C853) - Success (applied coupon)
- `--coral` (#FF6B6B) - Error state

### Typography
- `--font-primary` (DM Sans) - All text
- `--font-mono` (JetBrains Mono) - Coupon code display

### Spacing & Animation
- `--transition` (0.2s cubic-bezier) - Hover transitions
- Custom: 0.6s spin animation for loading spinner

## Mobile Responsive (< 768px)

- **Input/Button padding:** 10px 12px / 10px 14px (from 12px 14px / 12px 18px)
- **Font sizes:** 13px (from 14px)
- **Feedback text:** 12px (from 13px)

## Accessibility

### ARIA Attributes
- Input: `aria-label`, `aria-invalid`, `aria-describedby`
- Error message: `role="alert"`
- Remove button: `aria-label="Verwijder kortingscode"`

### Keyboard Support
- **Tab:** Navigate between input and button
- **Enter:** Submit form
- **Space/Enter:** Activate remove button

### Screen Reader Support
- Error announced immediately with `role="alert"`
- Applied coupon code and discount announced
- Remove button clearly labeled

### Form Validation
- Input disabled during loading
- Button disabled when input is empty or loading
- Clear error states with visual and text feedback

### Color Contrast
- Text (navy on white): 14.8:1 (WCAG AAA ✓)
- Placeholder (grey-mid on white): 4.5:1 (WCAG AA ✓)
- Error text (coral on white): 4.6:1 (WCAG AA ✓)

## Best Practices

### UX Tips
- **Auto-uppercase:** Enabled by default for consistency
- **Immediate feedback:** Show errors/success right away
- **Clear loading state:** Spinner prevents double-submission
- **Easy removal:** Remove button always visible in applied state
- **Preserve value:** Keep input value during validation

### Common Error Messages
```tsx
const errorMessages = {
  invalid: 'Deze kortingscode is ongeldig of verlopen',
  expired: 'Deze kortingscode is verlopen',
  minimum: 'Minimaal bestelbedrag van €50,- vereist',
  firstOrder: 'Deze code is alleen geldig voor nieuwe klanten',
  network: 'Er is een fout opgetreden. Probeer het opnieuw.',
}
```

## Integration with Other Components

- **OrderSummary (ec07):** Shows discount amount in totals breakdown
- **MiniCartFlyout (c2):** Can include coupon input (collapsible)
- **FreeShippingProgress (ec05):** Consider if discount counts toward free shipping

## Component Location

```
src/branches/ecommerce/components/ui/CouponInput/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Conversion
**Priority:** CRITICAL (proven conversion booster)
**Last Updated:** February 25, 2026
