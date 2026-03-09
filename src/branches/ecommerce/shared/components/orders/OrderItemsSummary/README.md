# OrderItemsSummary (oc03)

Compact list of products in an order, displayed on order confirmation pages. Features product thumbnails, metadata (size/color/quantity), and line prices.

## Features

- ✅ **Horizontal row layout:** Thumbnail (60×60px), product info, metadata, price
- ✅ **Product count header:** Shows total item count (e.g., "5 producten")
- ✅ **Flexible metadata:** Display size, color, quantity with Lucide icons
- ✅ **Collapsible variant:** Expandable/collapsible for long orders
- ✅ **Compact variant:** Smaller for email templates
- ✅ **Empty state:** Fallback for orders with no items
- ✅ **Hover effect:** Subtle teal background on row hover
- ✅ **Responsive:** Price stacks below on mobile
- ✅ **Fully accessible:** ARIA labels, keyboard navigation
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { OrderItemsSummary } from '@/branches/ecommerce/components/orders/OrderItemsSummary'

<OrderItemsSummary
  items={[
    {
      id: '1',
      name: 'Supreme Plus Nitrile Handschoenen',
      imagePlaceholder: '🧤',
      metadata: [
        { icon: 'ruler', label: 'Maat: L' },
        { icon: 'hash', label: 'Aantal: 3' },
      ],
      price: 3885, // €38.85 in cents
    },
  ]}
/>
```

### With Product Images

```tsx
<OrderItemsSummary
  items={[
    {
      id: '1',
      name: 'Digitale Bloeddrukmeter',
      imageUrl: '/products/bloeddrukmeter.jpg',
      metadata: [
        { icon: 'palette', label: 'Kleur: Wit' },
        { icon: 'hash', label: 'Aantal: 1' },
      ],
      price: 8995,
    },
  ]}
/>
```

### Collapsible Variant

```tsx
<OrderItemsSummary
  items={orderItems}
  collapsible={true}
  defaultCollapsed={false}
  onToggle={(collapsed) => console.log('Collapsed:', collapsed)}
/>
```

### Compact Variant (Email Templates)

```tsx
<OrderItemsSummary items={orderItems} variant="compact" />
```

### Custom Title

```tsx
<OrderItemsSummary items={orderItems} title="Ordered Products" />
```

## Props

| Prop               | Type                       | Required | Default                | Description                      |
| ------------------ | -------------------------- | -------- | ---------------------- | -------------------------------- |
| `items`            | `OrderItem[]`              | ✅       | -                      | Array of order items             |
| `title`            | `string`                   |          | `"Bestelde producten"` | Header title                     |
| `collapsible`      | `boolean`                  |          | `false`                | Enable collapse/expand           |
| `defaultCollapsed` | `boolean`                  |          | `false`                | Start collapsed                  |
| `variant`          | `'default' \\| 'compact'`  |          | `'default'`            | Visual variant                   |
| `className`        | `string`                   |          | `''`                   | Additional CSS classes           |
| `onToggle`         | `(collapsed: boolean) => void` |      | -                      | Callback when toggle clicked     |

### OrderItem Type

```typescript
interface OrderItem {
  id: string
  name: string
  imageUrl?: string // Product image URL
  imagePlaceholder?: string // Emoji fallback (e.g., "🧤")
  metadata: OrderItemMetadata[] // Size, color, quantity, etc.
  price: number // Line total in cents (price × quantity)
}

interface OrderItemMetadata {
  icon?: string // Lucide icon name (e.g., "ruler", "palette", "hash")
  label: string // e.g., "Maat: L", "Kleur: Wit", "Aantal: 3"
}
```

## Order Confirmation Page Integration

```tsx
import { SuccessHero } from '@/branches/ecommerce/components/orders/SuccessHero'
import { OrderDetailsCard } from '@/branches/ecommerce/components/orders/OrderDetailsCard'
import { OrderItemsSummary } from '@/branches/ecommerce/components/orders/OrderItemsSummary'

export default async function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const order = await getOrder(params.orderId)

  const orderItems = order.items.map((item) => ({
    id: item.id,
    name: item.product.name,
    imageUrl: item.product.image?.url,
    imagePlaceholder: '📦',
    metadata: [
      ...(item.variant?.size ? [{ icon: 'ruler', label: `Maat: ${item.variant.size}` }] : []),
      ...(item.variant?.color ? [{ icon: 'palette', label: `Kleur: ${item.variant.color}` }] : []),
      { icon: 'hash', label: `Aantal: ${item.quantity}` },
    ],
    price: item.lineTotal, // In cents
  }))

  return (
    <div>
      <SuccessHero orderNumber={order.orderNumber} />
      <OrderDetailsCard {...orderDetailsProps} />
      <OrderItemsSummary items={orderItems} collapsible={orderItems.length > 5} />
    </div>
  )
}
```

## Metadata Icons

Common Lucide icons for metadata:

| Icon       | Usage           | Example               |
| ---------- | --------------- | --------------------- |
| `ruler`    | Size            | "Maat: L"             |
| `palette`  | Color           | "Kleur: Blauw"        |
| `hash`     | Quantity        | "Aantal: 3"           |
| `droplet`  | Volume          | "Volume: 500ml"       |
| `package`  | Package size    | "Verpakking: Box 50"  |

## Accessibility

- **Header:** `role="button"` and `tabIndex={0}` when collapsible
- **Items list:** `aria-label="Order items"`
- **Empty state:** Clear message with icon
- **Keyboard:** Enter/Space to toggle collapse
- **Screen reader:** Item count announced ("5 producten")

## Theme Variables

- **Container:** `var(--white)`, `var(--grey)` border, `var(--radius-lg)`
- **Header:** `var(--bg)` background, `var(--navy)` title
- **Icons:** `var(--teal)` Package icon, `var(--grey-mid)` metadata icons
- **Hover:** `rgba(0, 137, 123, 0.02)` teal background
- **Price:** `var(--navy)`, 800 weight

## Testing Checklist

- [ ] Items display with thumbnails and metadata
- [ ] Product count shows correctly in header
- [ ] Collapsible variant toggles on click/keyboard
- [ ] Compact variant has smaller thumbnails (48px vs 60px)
- [ ] Empty state shows when items array is empty
- [ ] Hover effect works (teal background)
- [ ] Price displays correctly (€ XX,XX format)
- [ ] Mobile: price stacks below product info
- [ ] Screen reader announces item count
- [ ] Keyboard navigation works for collapsible header

## Component Location

```
src/branches/ecommerce/components/orders/OrderItemsSummary/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Orders / Product Lists
**Complexity:** Medium (collapsible state, dynamic metadata icons)
**Priority:** 🟢 HIGH (Phase 1 - Core order flow)
**Last Updated:** February 25, 2026
