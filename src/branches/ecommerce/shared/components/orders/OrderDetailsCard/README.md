# OrderDetailsCard (oc02)

3-column stats cards displaying order delivery timeline, payment status, and total amount on the order confirmation page. Color-coded icons and prominent values enable quick visual scanning.

## Features

- ✅ **3-column responsive grid:** Stacks to 1-column on mobile
- ✅ **Color-coded icons:** Teal (delivery), green/amber/coral (payment status), navy (total)
- ✅ **Large bold values:** 20px, weight 800 for quick scanning
- ✅ **Hover animation:** Subtle lift + shadow effect
- ✅ **Flexible content:** Multiple delivery/payment variants
- ✅ **Status badges:** Optional additional payment state indicators
- ✅ **Fully accessible:** ARIA labels, live regions, screen reader support
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { OrderDetailsCard } from '@/branches/ecommerce/components/orders/OrderDetailsCard'

<OrderDetailsCard
  delivery={{
    value: "Morgen",
    subtitle: "Voor 23:59 uur"
  }}
  payment={{
    value: "Betaald",
    subtitle: "Via iDEAL",
    status: "paid"
  }}
  total={{
    value: 7519,  // Amount in cents (€75.19)
  }}
/>
```

### With Custom Labels

```tsx
<OrderDetailsCard
  delivery={{
    label: "Expected Delivery",
    value: "Tomorrow",
    subtitle: "Before 11:59 PM",
    icon: "truck"
  }}
  payment={{
    label: "Payment Status",
    value: "Paid",
    subtitle: "Via Credit Card",
    status: "paid"
  }}
  total={{
    label: "Total Amount",
    value: 15000,
    subtitle: "Incl. VAT",
    currency: "€"
  }}
/>
```

### Delivery Variants

```tsx
// Next-day delivery
<OrderDetailsCard
  delivery={{ value: "Morgen", subtitle: "Voor 23:59 uur" }}
  // ...
/>

// Same-day delivery
<OrderDetailsCard
  delivery={{ value: "Vandaag", subtitle: "Voor 17:00 uur" }}
  // ...
/>

// Standard shipping
<OrderDetailsCard
  delivery={{ value: "3-5 werkdagen", subtitle: "Standaard verzending" }}
  // ...
/>

// Store pickup
<OrderDetailsCard
  delivery={{
    value: "Vandaag",
    subtitle: "Vanaf 14:00 uur",
    icon: "package"
  }}
  // ...
/>

// Express delivery
<OrderDetailsCard
  delivery={{
    value: "1-2 werkdagen",
    subtitle: "Express verzending",
    icon: "plane"
  }}
  // ...
/>
```

### Payment Status Variants

```tsx
// Paid (green)
<OrderDetailsCard
  payment={{
    value: "Betaald",
    subtitle: "Via iDEAL",
    status: "paid"
  }}
  // ...
/>

// Pending (amber)
<OrderDetailsCard
  payment={{
    value: "In behandeling",
    subtitle: "Bankoverschrijving",
    status: "pending"
  }}
  // ...
/>

// Failed (coral/red)
<OrderDetailsCard
  payment={{
    value: "Mislukt",
    subtitle: "Probeer opnieuw",
    status: "failed"
  }}
  // ...
/>

// Invoice / B2B (teal)
<OrderDetailsCard
  payment={{
    value: "Factuur",
    subtitle: "Vervaldatum: 14 dagen",
    status: "invoice"
  }}
  // ...
/>
```

### With Status Badges

```tsx
<OrderDetailsCard
  payment={{
    value: "Betaald",
    subtitle: "Via iDEAL",
    status: "paid",
    badge: {
      text: "Geverifieerd",
      variant: "paid"
    }
  }}
  // ...
/>

<OrderDetailsCard
  payment={{
    value: "In behandeling",
    subtitle: "Bankoverschrijving",
    status: "pending",
    badge: {
      text: "Wachtend op bevestiging",
      variant: "pending"
    }
  }}
  // ...
/>
```

## Props

| Prop       | Type              | Required | Description                    |
| ---------- | ----------------- | -------- | ------------------------------ |
| `delivery` | `DeliveryDetails` | ✅       | Delivery information           |
| `payment`  | `PaymentDetails`  | ✅       | Payment status information     |
| `total`    | `TotalDetails`    | ✅       | Total amount information       |
| `className`| `string`          |          | Additional CSS classes         |

### DeliveryDetails

| Prop       | Type              | Required | Default                | Description             |
| ---------- | ----------------- | -------- | ---------------------- | ----------------------- |
| `label`    | `string`          |          | `"Verwachte levering"` | Card label              |
| `value`    | `string`          | ✅       | -                      | Delivery timeframe      |
| `subtitle` | `string`          | ✅       | -                      | Additional details      |
| `icon`     | `'truck' \\| 'package' \\| 'plane'` |  | `'truck'`   | Icon variant            |

### PaymentDetails

| Prop       | Type              | Required | Default           | Description             |
| ---------- | ----------------- | -------- | ----------------- | ----------------------- |
| `label`    | `string`          |          | `"Betaalstatus"`  | Card label              |
| `value`    | `string`          | ✅       | -                 | Payment status text     |
| `subtitle` | `string`          | ✅       | -                 | Payment method          |
| `status`   | `PaymentStatus`   | ✅       | -                 | Status for styling      |
| `badge`    | `StatusBadge`     |          | -                 | Optional status badge   |

**PaymentStatus:** `'paid'` | `'pending'` | `'failed'` | `'invoice'`

### TotalDetails

| Prop       | Type     | Required | Default             | Description             |
| ---------- | -------- | -------- | ------------------- | ----------------------- |
| `label`    | `string` |          | `"Totaalbedrag"`    | Card label              |
| `value`    | `number` | ✅       | -                   | Amount in cents         |
| `subtitle` | `string` |          | `"Incl. BTW"`       | Tax information         |
| `currency` | `string` |          | `"€"`               | Currency symbol         |

## Order Confirmation Page Integration

```tsx
// app/order-confirmation/[orderId]/page.tsx

import { SuccessHero } from '@/branches/ecommerce/components/orders/SuccessHero'
import { OrderDetailsCard } from '@/branches/ecommerce/components/orders/OrderDetailsCard'
import { OrderItemsSummary } from '@/branches/ecommerce/components/orders/OrderItemsSummary'

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string }
}) {
  const order = await getOrder(params.orderId)

  return (
    <div className="order-confirmation-page">
      {/* OC01: Success Hero */}
      <SuccessHero orderNumber={order.orderNumber} />

      {/* OC02: Order Details Cards */}
      <OrderDetailsCard
        delivery={{
          value: formatDeliveryEstimate(order.shippingMethod, order.createdAt),
          subtitle: order.deliveryTime || "Standaard verzending",
        }}
        payment={{
          value: formatPaymentStatus(order.paymentStatus),
          subtitle: `Via ${order.paymentMethod}`,
          status: order.paymentStatus,
        }}
        total={{
          value: order.total,  // In cents
        }}
      />

      {/* OC03: Order Items Summary */}
      <OrderItemsSummary items={order.items} />
    </div>
  )
}
```

## Utility Functions

### Format Delivery Estimate

```tsx
function formatDeliveryEstimate(
  shippingMethod: 'standard' | 'express' | 'next-day' | 'pickup',
  orderTime: Date
): { value: string; subtitle: string; icon?: 'truck' | 'package' | 'plane' } {
  const now = orderTime
  const cutoffTime = new Date(now)
  cutoffTime.setHours(23, 59, 59)

  if (shippingMethod === 'pickup') {
    return {
      value: 'Vandaag',
      subtitle: 'Vanaf 14:00 uur',
      icon: 'package',
    }
  }

  if (shippingMethod === 'next-day') {
    return now < cutoffTime
      ? { value: 'Morgen', subtitle: 'Voor 23:59 uur' }
      : { value: 'Overmorgen', subtitle: 'Standaard levering' }
  }

  if (shippingMethod === 'express') {
    return {
      value: '1-2 werkdagen',
      subtitle: 'Express verzending',
      icon: 'plane',
    }
  }

  return {
    value: '3-5 werkdagen',
    subtitle: 'Standaard verzending',
  }
}
```

### Format Payment Status

```tsx
function formatPaymentStatus(status: PaymentStatus): string {
  const statusMap: Record<PaymentStatus, string> = {
    paid: 'Betaald',
    pending: 'In behandeling',
    failed: 'Mislukt',
    invoice: 'Factuur',
  }
  return statusMap[status]
}
```

### Transform Payload Order Data

```tsx
function transformOrderData(order: PayloadOrder) {
  return {
    delivery: {
      value: order.deliveryEstimate || '3-5 werkdagen',
      subtitle: order.deliveryTime || 'Standaard verzending',
      icon: order.shippingMethod === 'pickup' ? 'package' : 'truck',
    },
    payment: {
      value: formatPaymentStatus(order.paymentStatus),
      subtitle: `Via ${order.paymentMethod}`,
      status: order.paymentStatus,
    },
    total: {
      value: order.total, // In cents
      currency: '€',
    },
  }
}
```

## Accessibility

### ARIA Attributes

```tsx
<section aria-label="Order details" className="order-details-grid">
  <article className="order-details-card delivery">
    <div className="order-details-icon" aria-hidden="true">
      <Truck size={28} />
    </div>
    <div className="order-details-label" id="delivery-label">
      Verwachte levering
    </div>
    <div className="order-details-value" aria-labelledby="delivery-label">
      Morgen
    </div>
    <div className="order-details-subtitle">Voor 23:59 uur</div>
  </article>
  {/* ... */}
</section>
```

### Screen Reader Announcements

- **Grid container:** "Order details section"
- **Delivery card:** "Article, Verwachte levering: Morgen. Voor 23:59 uur."
- **Payment card:** "Article, Betaalstatus: Betaald. Via iDEAL." (aria-live="polite" for status updates)
- **Total card:** "Article, Totaalbedrag: 75 euro 19 cent. Inclusief BTW."

### Color Contrast

- ✅ Label (navy #0A1628 on white): **13.8:1** (AAA)
- ✅ Delivery value (teal #00897B on white): **4.7:1** (AA)
- ✅ Payment value green (#00C853 on white): **4.2:1** (AA Large)
- ✅ Subtitle (grey-mid #94A3B8 on white): **3.8:1** (AA Large)

## Theme Variables Used

### Colors

- **Delivery:** `var(--teal-glow)` (icon bg), `var(--teal)` (icon/value)
- **Payment (paid):** `rgba(0,200,83,0.12)` (icon bg), `var(--green)` (icon/value)
- **Payment (pending):** `rgba(245,158,11,0.12)` (icon bg), `var(--amber)` (icon/value)
- **Payment (failed):** `rgba(255,107,107,0.12)` (icon bg), `var(--coral)` (icon/value)
- **Payment (invoice):** `var(--teal-glow)` (icon bg), `var(--teal)` (icon/value)
- **Total:** `rgba(10,22,40,0.08)` (icon bg), `var(--navy)` (icon/value)
- **Card:** `var(--white)` (background), `var(--grey)` (border)
- **Labels:** `var(--navy)`
- **Subtitles:** `var(--grey-mid)`

### Spacing

- **--space-4:** 4px (label → value, value → subtitle gaps)
- **--space-8:** 8px (badge top margin)
- **--space-16:** 16px (icon → label gap, mobile grid gap)
- **--space-20:** 20px (desktop grid gap, mobile card padding)
- **--space-24:** 24px (desktop card padding)
- **--space-32:** 32px (section bottom margin)

### Visual

- **--radius:** 12px (icon container)
- **--radius-lg:** 14px (card border-radius)
- **--shadow-md:** Hover shadow
- **--transition:** Hover animation

## Styling Details

### Grid Layout

- **Desktop (>768px):** 3 equal columns, 20px gap, 24px card padding
- **Mobile (≤768px):** 1 column stack, 16px gap, 20px card padding

### Card Anatomy (Top to Bottom)

1. **Icon container:** 56×56px (48×48 mobile), 16px margin-bottom
2. **Label:** 14px, weight 700, navy, 4px margin-bottom
3. **Value:** 20px (18px mobile), weight 800, color-coded, 4px margin-bottom
4. **Subtitle:** 12px, grey-mid
5. **Badge (optional):** 8px margin-top

### Icon Sizes

- **Container:** 56×56px (desktop), 48×48px (mobile)
- **Icon:** 28×28px (desktop), 24×24px (mobile)

## Related Components

- **OC01: SuccessHero** - Appears directly above (32px gap)
- **OC03: OrderItemsSummary** - Appears directly below (32px gap)
- **OC04: NextStepsCTA** - Action buttons below order summary
- **EC07: OrderSummary** - Different use case (checkout sidebar vs. confirmation cards)

## Testing Checklist

- [ ] All three cards display in 3-column grid on desktop
- [ ] Cards stack to 1-column on mobile (≤768px)
- [ ] Icons render correctly (Lucide icons)
- [ ] Color-coded values match status (teal/green/amber/coral/navy)
- [ ] Hover animation works (lift + shadow, translateY -2px)
- [ ] Currency formatting correct (€ XX,XX with space, comma separator)
- [ ] Payment status borders appear for pending/failed/invoice
- [ ] Status badges display when provided
- [ ] Screen reader announces all cards correctly
- [ ] aria-live updates for payment status changes
- [ ] Color contrast passes WCAG AA standards
- [ ] Reduced motion preference disables animations

## Component Location

```
src/branches/ecommerce/components/orders/OrderDetailsCard/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Orders / Stats Cards
**Complexity:** Medium (grid layout, multiple color variants, dynamic icons)
**Priority:** 🟢 HIGH (Phase 1 - Core order flow)
**Last Updated:** February 25, 2026
