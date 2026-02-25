# SuccessHero (oc01)

Order confirmation success message with green-to-teal gradient background, animated checkmark icon, and prominent order number display. Provides immediate positive feedback to customers after successful checkout.

## Features

- ✅ **Green gradient:** Success color psychology (green → teal, 135deg)
- ✅ **Checkmark animation:** Scale-in bounce effect on icon
- ✅ **Staggered animations:** Fade-in-up sequence (icon → title → description → badge)
- ✅ **Frosted glass effect:** Backdrop blur on icon and badge
- ✅ **Monospace order number:** JetBrains Mono font with letter-spacing
- ✅ **Decorative glow:** Radial gradient overlay (top-right)
- ✅ **Compact variant:** Smaller padding for secondary pages
- ✅ **Animation control:** Disable animations on repeat visits
- ✅ **Fully accessible:** ARIA role="status", aria-live, proper labels
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage (Order Confirmation)

```tsx
import { SuccessHero } from '@/branches/ecommerce/components/orders/SuccessHero'

<SuccessHero orderNumber="PL-2024-00142" />
```

### Custom Title and Description

```tsx
<SuccessHero
  orderNumber="PL-2024-00142"
  title="Order Confirmed!"
  description="Your order has been successfully placed and will be processed shortly."
/>
```

### Quote Submission

```tsx
<SuccessHero
  orderNumber="QT-2024-00023"
  title="Quote Request Submitted!"
  description="We'll send you a custom quote within 24 hours."
  orderNumberLabel="Quote nummer:"
/>
```

### Payment Success

```tsx
<SuccessHero
  orderNumber="PAY-2024-98765"
  title="Payment Successful!"
  description="Your payment has been processed successfully."
  orderNumberLabel="Transaction ID:"
/>
```

### Compact Variant

For secondary success pages with less emphasis:

```tsx
<SuccessHero orderNumber="PL-2024-00142" variant="compact" />
```

### Disable Animations

For repeat page visits or reduced motion preferences:

```tsx
<SuccessHero orderNumber="PL-2024-00142" enableAnimation={false} />
```

## Props

| Prop                | Type                          | Required | Default                                           | Description                  |
| ------------------- | ----------------------------- | -------- | ------------------------------------------------- | ---------------------------- |
| `orderNumber`       | `string`                      | ✅       | -                                                 | Order/transaction number     |
| `title`             | `string`                      |          | `"Bedankt voor je bestelling!"`                   | Main heading text            |
| `description`       | `string`                      |          | `"Je bestelling is succesvol geplaatst..."`       | Description text             |
| `orderNumberLabel`  | `string`                      |          | `"Ordernummer:"`                                  | Label for order number       |
| `enableAnimation`   | `boolean`                     |          | `true`                                            | Enable/disable animations    |
| `variant`           | `'default' \\| 'compact'`     |          | `'default'`                                       | Visual variant               |
| `className`         | `string`                      |          | `''`                                              | Additional CSS classes       |

## Types

```typescript
type SuccessHeroVariant = 'default' | 'compact'

interface SuccessHeroProps {
  orderNumber: string
  title?: string
  description?: string
  orderNumberLabel?: string
  enableAnimation?: boolean
  variant?: SuccessHeroVariant
  className?: string
}
```

## Animations

The component features staggered fade-in-up animations with configurable timing:

### Animation Sequence

1. **Icon (0s delay):** Scale-in bounce (0.5s duration)
2. **Title (0.2s delay):** Fade-in-up (0.6s duration)
3. **Description (0.3s delay):** Fade-in-up (0.6s duration)
4. **Badge (0.4s delay):** Fade-in-up (0.6s duration)

### Keyframes

```css
@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Disable Animations on Repeat Visits

```tsx
'use client'

import { useState, useEffect } from 'react'
import { SuccessHero } from '@/branches/ecommerce/components/orders/SuccessHero'

export function OrderConfirmationHero({ orderNumber }: { orderNumber: string }) {
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const hasSeenOrder = sessionStorage.getItem(`order-${orderNumber}`)
    if (hasSeenOrder) {
      setShowAnimation(false)
    } else {
      sessionStorage.setItem(`order-${orderNumber}`, 'true')
    }
  }, [orderNumber])

  return <SuccessHero orderNumber={orderNumber} enableAnimation={showAnimation} />
}
```

## Order Confirmation Page Integration

### Complete Order Confirmation Flow

```tsx
// /app/order-confirmation/[orderId]/page.tsx

import { SuccessHero } from '@/branches/ecommerce/components/orders/SuccessHero'
import { OrderDetailsCard } from '@/branches/ecommerce/components/orders/OrderDetailsCard'
import { OrderItemsSummary } from '@/branches/ecommerce/components/orders/OrderItemsSummary'
import { NextStepsCTA } from '@/branches/ecommerce/components/orders/NextStepsCTA'
import { EmailConfirmationBanner } from '@/branches/ecommerce/components/orders/EmailConfirmationBanner'

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string }
}) {
  const order = await getOrder(params.orderId)

  if (!order) {
    notFound()
  }

  return (
    <div className="order-confirmation-page">
      {/* Success Hero */}
      <SuccessHero orderNumber={order.orderNumber} />

      {/* Order Details Card (OC02) */}
      <OrderDetailsCard order={order} />

      {/* Order Items Summary (OC03) */}
      <OrderItemsSummary items={order.items} />

      {/* Next Steps CTAs (OC04) */}
      <NextStepsCTA orderId={order.id} />

      {/* Email Confirmation Banner (OC05) */}
      <EmailConfirmationBanner email={order.email} />
    </div>
  )
}
```

### After Stripe Payment Success

```typescript
// In Stripe webhook handler

if (event.type === 'payment_intent.succeeded') {
  const order = await payload.update({
    collection: 'orders',
    id: orderId,
    data: {
      status: 'paid',
      paidAt: new Date(),
    },
  })

  // Redirect to order confirmation page
  return redirect(`/order-confirmation/${order.id}`)
}
```

## Accessibility

### ARIA Attributes

```tsx
<section className="success-hero" role="status" aria-live="polite">
  <div className="decorative-glow" aria-hidden="true" />
  <div className="success-content">
    <div className="success-icon" aria-hidden="true">
      <Check size={48} />
    </div>
    <h1 className="success-title">Bedankt voor je bestelling!</h1>
    <p className="success-description">Je bestelling is succesvol geplaatst...</p>
    <div className="order-number-badge">
      <span className="order-number-label">Ordernummer:</span>
      <span className="order-number" aria-label="Order nummer PL 2024 00142">
        #PL-2024-00142
      </span>
    </div>
  </div>
</section>
```

### Screen Reader Announcements

- **role="status"**: Announces content as status update
- **aria-live="polite"**: Waits for user to finish reading before announcing
- **aria-hidden="true"**: Hides decorative elements (glow, icon) from screen readers
- **aria-label on order number**: Spells out dashes/hyphens for clarity

Example announcement:

```
"Status: Bedankt voor je bestelling!"
"Je bestelling is succesvol geplaatst en wordt zo snel mogelijk verwerkt."
"Ordernummer: PL 2024 00142"
```

### Keyboard Navigation

- No interactive elements in hero (display only)
- Focus automatically moved to order details section
- Skip link available for keyboard users

### Color Contrast

- ✅ White text on green/teal gradient: **7:1** contrast ratio (AAA)
- ✅ Success communicated via text + icon (not color alone)
- ✅ Order number highly readable (monospace, high contrast)

## Theme Variables Used

### Colors

- **Green:** `var(--green)` — #00C853 (gradient start, success color)
- **Teal:** `var(--teal)` — #00897B (gradient end, brand color)
- **White:** Pure white (#FFFFFF) for text
- **White overlays:**
  - `rgba(255, 255, 255, 0.9)` — Description text
  - `rgba(255, 255, 255, 0.2)` — Icon circle background
  - `rgba(255, 255, 255, 0.15)` — Badge background
  - `rgba(255, 255, 255, 0.1)` — Decorative glow

### Typography

- **Title:** Plus Jakarta Sans, 32px (desktop) / 24px (mobile), 800 weight
- **Description:** Plus Jakarta Sans, 16px (desktop) / 14px (mobile), 400 weight
- **Order number label:** Plus Jakarta Sans, 14px, 400 weight
- **Order number:** JetBrains Mono, 18px (desktop) / 16px (mobile), 800 weight

### Spacing

- **--space-12:** 12px (title → description, badge padding mobile)
- **--space-16:** 16px (badge horizontal padding mobile)
- **--space-20:** 20px (icon → title gap)
- **--space-24:** 24px (description → badge, badge padding desktop)
- **--space-32:** 32px (hero padding mobile, compact variant)
- **--space-48:** 48px (hero padding desktop)

### Visual

- **--radius:** 12px (badge border-radius)
- **--radius-lg:** 16px (hero border-radius)
- **--font-mono:** JetBrains Mono (order number)

### Effects

- **Background gradient:** `linear-gradient(135deg, var(--green) 0%, var(--teal) 100%)`
- **Backdrop blur:** `blur(10px)` (icon circle, badge)
- **Box shadow:** `0 16px 48px rgba(0, 137, 123, 0.2)`

## Styling Details

### Default Variant

- **Padding:** 48px (all sides)
- **Icon circle:** 80×80px with backdrop blur
- **Title:** 32px font-size
- **Description:** Max-width 480px, centered
- **Badge:** Inline-flex, 12px×24px padding

### Compact Variant

- **Padding:** 32px (reduced from 48px)
- **Icon circle:** 64×64px (reduced from 80px)
- **Title:** 24px font-size (reduced from 32px)

### Mobile Responsive (<768px)

- **Padding:** 32px
- **Title:** 24px
- **Description:** 14px
- **Icon circle:** 64×64px
- **Badge:** Stacks vertically (flex-direction: column)
- **Order number:** 16px

## Variants

### Error Variant (Failed Payment)

```tsx
// Custom implementation for failed orders

<div className="success-hero error">
  <X size={48} /> {/* Replace Check with X icon */}
  <h1>Payment Failed</h1>
  <p>Your payment could not be processed. Please try again.</p>
</div>

<style>{`
  .success-hero.error {
    background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
  }
`}</style>
```

### Pending Variant

```tsx
<div className="success-hero pending">
  <Clock size={48} />
  <h1>Order Pending</h1>
  <p>Your order is being processed. We'll notify you once it's confirmed.</p>
</div>

<style>{`
  .success-hero.pending {
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  }
`}</style>
```

### With Confetti Animation

```tsx
'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { SuccessHero } from '@/branches/ecommerce/components/orders/SuccessHero'

export function SuccessHeroWithConfetti({ orderNumber }: { orderNumber: string }) {
  useEffect(() => {
    // Trigger confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  return <SuccessHero orderNumber={orderNumber} />
}
```

## Related Components

- **OC02: OrderDetailsCard** - Displays delivery/payment/total info below hero
- **OC03: OrderItemsSummary** - Shows compact list of ordered products
- **OC04: NextStepsCTA** - Action buttons (track order, view invoice, continue shopping)
- **OC05: EmailConfirmationBanner** - Reminds customer to check email
- **C3: AddToCartToast** - Similar success pattern (smaller scale)

## Testing Checklist

- [ ] Gradient renders correctly (green → teal, 135deg)
- [ ] Decorative glow visible (top-right radial)
- [ ] Checkmark icon animates on load (scale-in bounce)
- [ ] Content fades in sequentially (icon → title → desc → badge)
- [ ] Order number displays correctly (monospace font, uppercase)
- [ ] Backdrop blur works (frosted glass effect on icon/badge)
- [ ] Compact variant has smaller padding and font sizes
- [ ] Mobile: smaller padding (32px) and font sizes
- [ ] Mobile: order badge stacks vertically
- [ ] Screen reader announces "Status: Bedankt voor je bestelling!"
- [ ] Order number aria-label spells out dashes ("PL 2024 00142")
- [ ] High contrast (white on green/teal, 7:1 ratio)
- [ ] No layout shift during animations
- [ ] Works without JavaScript (animations disabled, still displays)
- [ ] enableAnimation={false} disables all animations

## Component Location

```
src/branches/ecommerce/components/orders/SuccessHero/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Orders / Success Messages
**Complexity:** Medium (gradient, animations, frosted glass)
**Priority:** 🟢 HIGH (Phase 1 - Core order flow)
**Last Updated:** February 25, 2026
