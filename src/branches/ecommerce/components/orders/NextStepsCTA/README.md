# NextStepsCTA (oc04)

Action buttons for next steps after order confirmation (track, download, shop). Features a 3-column grid layout with primary (teal gradient) and secondary (white) button variants.

## Features

- ✅ **3-column grid layout:** Stacks to 1-column on mobile
- ✅ **Primary button:** Teal gradient with shadow (track order)
- ✅ **Secondary buttons:** White background with grey border
- ✅ **Icon + text layout:** 28×28px icon above 14px bold text
- ✅ **Hover animation:** Lift (-2px) with enhanced shadow
- ✅ **Badge support:** Optional "Nieuw" badge overlay
- ✅ **Compact variant:** Smaller for email templates
- ✅ **Icon-only variant:** Horizontal layout for narrow spaces
- ✅ **Flexible columns:** 2-4 buttons supported
- ✅ **Fully accessible:** ARIA labels, keyboard navigation
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage (3 Buttons)

```tsx
import { NextStepsCTA } from '@/branches/ecommerce/components/orders/NextStepsCTA'

<NextStepsCTA
  actions={[
    {
      id: 'track',
      label: 'Track bestelling',
      icon: 'map-pin',
      variant: 'primary',
      href: '/account/orders/123/track',
    },
    {
      id: 'invoice',
      label: 'Download factuur',
      icon: 'download',
      variant: 'secondary',
      href: '/account/orders/123/invoice.pdf',
      download: true,
    },
    {
      id: 'shop',
      label: 'Verder winkelen',
      icon: 'shopping-bag',
      variant: 'secondary',
      href: '/shop',
    },
  ]}
/>
```

### With Badge

```tsx
<NextStepsCTA
  actions={[
    {
      id: 'track',
      label: 'Track bestelling',
      icon: 'map-pin',
      variant: 'primary',
      href: '/track',
    },
    {
      id: 'review',
      label: 'Beoordeel bestelling',
      icon: 'star',
      variant: 'secondary',
      href: '/review',
      badge: { text: 'Nieuw' },
    },
    {
      id: 'shop',
      label: 'Verder winkelen',
      icon: 'shopping-bag',
      variant: 'secondary',
      href: '/shop',
    },
  ]}
/>
```

### With onClick Handler

```tsx
<NextStepsCTA
  actions={[
    {
      id: 'track',
      label: 'Track bestelling',
      icon: 'map-pin',
      variant: 'primary',
      onClick: () => router.push('/track'),
    },
    {
      id: 'reorder',
      label: 'Bestel opnieuw',
      icon: 'copy',
      variant: 'secondary',
      onClick: () => handleReorder(order.items),
    },
    {
      id: 'shop',
      label: 'Verder winkelen',
      icon: 'shopping-bag',
      variant: 'secondary',
      href: '/shop',
    },
  ]}
/>
```

### Alternative Color Combinations

```tsx
<NextStepsCTA
  actions={[
    {
      id: 'view',
      label: 'Bekijk factuur',
      icon: 'file-text',
      variant: 'navy', // Navy gradient
      href: '/invoice',
    },
    {
      id: 'download',
      label: 'Download PDF',
      icon: 'download',
      variant: 'primary', // Teal gradient
      href: '/invoice.pdf',
      download: true,
    },
    {
      id: 'share',
      label: 'Deel bestelling',
      icon: 'share-2',
      variant: 'secondary', // White
      onClick: handleShare,
    },
  ]}
/>
```

### With Destructive Action (Cancel Order)

```tsx
<NextStepsCTA
  actions={[
    {
      id: 'track',
      label: 'Track bestelling',
      icon: 'map-pin',
      variant: 'primary',
      href: '/track',
    },
    {
      id: 'invoice',
      label: 'Download factuur',
      icon: 'download',
      variant: 'secondary',
      href: '/invoice.pdf',
      download: true,
    },
    {
      id: 'cancel',
      label: 'Annuleer bestelling',
      icon: 'x-circle',
      variant: 'coral', // Coral gradient (destructive)
      onClick: handleCancelOrder,
    },
  ]}
/>
```

### 4-Button Layout (B2B)

```tsx
<NextStepsCTA
  columns={4}
  actions={[
    {
      id: 'track',
      label: 'Track bestelling',
      icon: 'map-pin',
      variant: 'primary',
      href: '/track',
    },
    {
      id: 'invoice',
      label: 'Download factuur',
      icon: 'download',
      variant: 'secondary',
      href: '/invoice.pdf',
      download: true,
    },
    {
      id: 'reorder',
      label: 'Bestel opnieuw',
      icon: 'copy',
      variant: 'secondary',
      onClick: handleReorder,
    },
    {
      id: 'shop',
      label: 'Verder winkelen',
      icon: 'shopping-bag',
      variant: 'secondary',
      href: '/shop',
    },
  ]}
/>
```

### Compact Variant (Email Templates)

```tsx
<NextStepsCTA
  variant="compact"
  actions={[
    {
      id: 'track',
      label: 'Track bestelling',
      icon: 'map-pin',
      variant: 'primary',
      href: 'https://example.com/track',
      external: true,
    },
    {
      id: 'invoice',
      label: 'Download factuur',
      icon: 'download',
      variant: 'secondary',
      href: 'https://example.com/invoice.pdf',
      download: true,
    },
  ]}
/>
```

### Icon-Only Variant (Horizontal)

```tsx
<NextStepsCTA
  variant="icon-only"
  actions={[
    {
      id: 'track',
      label: 'Track bestelling',
      icon: 'map-pin',
      variant: 'primary',
      href: '/track',
    },
    {
      id: 'invoice',
      label: 'Factuur',
      icon: 'download',
      variant: 'secondary',
      href: '/invoice.pdf',
      download: true,
    },
    {
      id: 'shop',
      label: 'Winkelen',
      icon: 'shopping-bag',
      variant: 'secondary',
      href: '/shop',
    },
  ]}
/>
```

## Props

| Prop       | Type                 | Required | Default     | Description                      |
| ---------- | -------------------- | -------- | ----------- | -------------------------------- |
| `actions`  | `NextStepAction[]`   | ✅       | -           | Array of action buttons          |
| `variant`  | `NextStepsCTAVariant`|          | `'default'` | Visual variant                   |
| `columns`  | `number`             |          | Auto        | Grid columns (overrides auto)    |
| `className`| `string`             |          | `''`        | Additional CSS classes           |

### NextStepAction Type

```typescript
interface NextStepAction {
  id: string // Unique identifier
  label: string // Button text (e.g., "Track bestelling")
  icon: string // Lucide icon name (e.g., "map-pin")
  variant: 'primary' | 'secondary' | 'navy' | 'coral'
  href?: string // Link URL
  onClick?: () => void // Click handler
  badge?: { text: string; color?: string } // Optional badge
  download?: boolean // Trigger download
  external?: boolean // Open in new tab
}
```

## Order Confirmation Page Integration

```tsx
import { SuccessHero } from '@/branches/ecommerce/components/orders/SuccessHero'
import { OrderDetailsCard } from '@/branches/ecommerce/components/orders/OrderDetailsCard'
import { OrderItemsSummary } from '@/branches/ecommerce/components/orders/OrderItemsSummary'
import { NextStepsCTA } from '@/branches/ecommerce/components/orders/NextStepsCTA'

export default async function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const order = await getOrder(params.orderId)

  const orderActions = [
    {
      id: 'track',
      label: 'Track bestelling',
      icon: 'map-pin',
      variant: 'primary' as const,
      href: `/account/orders/${order.id}/track`,
    },
    {
      id: 'invoice',
      label: 'Download factuur',
      icon: 'download',
      variant: 'secondary' as const,
      href: `/api/orders/${order.id}/invoice`,
      download: true,
    },
    {
      id: 'shop',
      label: 'Verder winkelen',
      icon: 'shopping-bag',
      variant: 'secondary' as const,
      href: '/shop',
    },
  ]

  return (
    <div>
      <SuccessHero orderNumber={order.orderNumber} />
      <OrderDetailsCard {...orderDetailsProps} />
      <OrderItemsSummary items={orderItems} />
      <NextStepsCTA actions={orderActions} />
    </div>
  )
}
```

## Common Icons

| Action              | Icon              | Alternatives                      |
| ------------------- | ----------------- | --------------------------------- |
| Track order         | `map-pin`         | `package`, `truck`                |
| Download invoice    | `download`        | `file-text`, `file-down`          |
| Continue shopping   | `shopping-bag`    | `store`, `arrow-right`            |
| Reorder             | `copy`            | `repeat`, `refresh-cw`            |
| Customer service    | `headphones`      | `message-circle`, `help-circle`   |
| Print invoice       | `printer`         | `file-text`                       |
| Cancel order        | `x-circle`        | `trash-2`                         |
| Rate/Review         | `star`            | `message-square`                  |
| View details        | `package`         | `eye`, `file-text`                |

## Dynamic Action Generation

```tsx
function generateOrderActions(order: PayloadOrder, user: User) {
  const actions: NextStepAction[] = []

  // Track order (always available)
  actions.push({
    id: 'track',
    label: 'Track bestelling',
    icon: 'map-pin',
    variant: 'primary',
    href: `/account/orders/${order.id}/track`,
  })

  // Download invoice (only if paid)
  if (order.paymentStatus === 'paid') {
    actions.push({
      id: 'invoice',
      label: 'Download factuur',
      icon: 'download',
      variant: 'secondary',
      href: `/api/orders/${order.id}/invoice`,
      download: true,
    })
  }

  // Reorder (B2B only)
  if (user.role === 'b2b') {
    actions.push({
      id: 'reorder',
      label: 'Bestel opnieuw',
      icon: 'copy',
      variant: 'secondary',
      onClick: () => reorderItems(order.items),
    })
  }

  // Continue shopping
  actions.push({
    id: 'shop',
    label: 'Verder winkelen',
    icon: 'shopping-bag',
    variant: 'secondary',
    href: '/shop',
  })

  return actions
}
```

## Accessibility

- **Container:** `aria-label="Next steps"` for section identification
- **Buttons:** `aria-label` with descriptive text for screen readers
- **Icons:** `aria-hidden="true"` (decorative only)
- **Keyboard:** Tab to focus, Enter/Space to activate
- **Focus ring:** 2px teal outline + 4px teal glow
- **Download links:** `download` attribute for file downloads
- **External links:** `rel="noopener noreferrer"` for security

## Theme Variables

- **Primary button:** `linear-gradient(135deg, var(--teal), var(--teal-light))`, white text
- **Primary shadow:** `0 4px 16px rgba(0,137,123,0.3)`
- **Secondary button:** `var(--white)` bg, `var(--grey)` border, `var(--navy)` text, `var(--teal)` icon
- **Navy button:** `linear-gradient(135deg, var(--navy), var(--navy-light))`, white text
- **Coral button:** `linear-gradient(135deg, var(--coral), #ff8787)`, white text
- **Badge:** `var(--coral)` bg, white text, 10px uppercase
- **Spacing:** Grid gap 16px, button padding 24px, icon-text gap 12px
- **Icons:** 28×28px (24px on mobile)
- **Text:** 14px weight 700 (13px in compact)
- **Radius:** `var(--radius-lg)` (14px)

## Testing Checklist

- [ ] All buttons display with icons and text
- [ ] Primary button has teal gradient and shadow
- [ ] Secondary buttons have white bg and grey border
- [ ] Hover animation works (lift -2px, enhanced shadow)
- [ ] Icons render correctly (Lucide)
- [ ] Grid: 3 columns on desktop, 1 column on mobile
- [ ] Links navigate to correct URLs
- [ ] Download links trigger file download
- [ ] External links open in new tab
- [ ] Badge displays correctly (if used)
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Focus ring visible on :focus-visible
- [ ] Screen reader announces all buttons
- [ ] Color contrast passes WCAG AA standards
- [ ] Reduced motion preference disables animations

## Component Location

```
src/branches/ecommerce/components/orders/NextStepsCTA/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Orders / CTA Buttons
**Complexity:** Medium (grid layout, multiple variants, dynamic icons)
**Priority:** 🟢 HIGH (Phase 1 - Core order flow)
**Last Updated:** February 25, 2026
