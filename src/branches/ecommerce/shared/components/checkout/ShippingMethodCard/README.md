# ShippingMethodCard (ec11)

Selectable shipping method card for checkout flow. Radio button card with icon, name, delivery time, and price. Supports Standard, Express, Pickup, and Same-Day delivery options.

## Features

- ✅ **Radio button selection:** Entire card is clickable
- ✅ **4 shipping methods:** Standard (Truck), Express (Zap), Pickup (Package), Same-Day (Clock)
- ✅ **Icon color coding:** Truck/Pickup (teal), Express/Same-Day (amber)
- ✅ **Free shipping display:** Green "Gratis" text when price = €0
- ✅ **Hover states:** Teal border + shadow effect
- ✅ **Keyboard accessible:** Full ARIA support, focus rings
- ✅ **Theme variables only:** NO hardcoded colors!
- ✅ **Responsive:** Grid → stack on mobile
- ✅ **Dutch locale:** Comma decimal separator (€ 6,95)

## Usage

### Basic Usage

```tsx
import { ShippingMethodCard } from '@/branches/ecommerce/components/checkout/ShippingMethodCard'

const shippingMethods = [
  {
    id: '1',
    name: 'Standaard',
    slug: 'standard',
    icon: 'truck',
    deliveryTime: '1-2 werkdagen',
    price: 6.95,
  },
  {
    id: '2',
    name: 'Express',
    slug: 'express',
    icon: 'zap',
    deliveryTime: 'Morgen in huis',
    price: 12.95,
  },
  {
    id: '3',
    name: 'Afhalen',
    slug: 'pickup',
    icon: 'package',
    deliveryTime: 'Binnen 4 uur klaar',
    price: 0,
    isFree: true,
  },
]

const [selectedId, setSelectedId] = useState('1')

<div className="shipping-methods-grid">
  {shippingMethods.map((method) => (
    <ShippingMethodCard
      key={method.id}
      method={method}
      selected={selectedId === method.id}
      onSelect={(id) => setSelectedId(id)}
    />
  ))}
</div>
```

### With Grid Container

```tsx
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  }}
>
  {shippingMethods.map((method) => (
    <ShippingMethodCard
      key={method.id}
      method={method}
      selected={selectedId === method.id}
      onSelect={handleSelect}
    />
  ))}
</div>
```

### With Free Shipping Threshold

```tsx
const cartTotal = 89.5
const freeShippingThreshold = 100

const shippingMethods = [
  {
    id: '1',
    name: 'Standaard',
    slug: 'standard',
    icon: 'truck',
    deliveryTime: '1-2 werkdagen',
    price: cartTotal >= freeShippingThreshold ? 0 : 6.95,
    isFree: cartTotal >= freeShippingThreshold,
    freeThreshold: freeShippingThreshold,
  },
]
```

### Full Checkout Integration

```tsx
'use client'

import { useState, useEffect } from 'react'
import { ShippingMethodCard } from '@/branches/ecommerce/components/checkout/ShippingMethodCard'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'

export function CheckoutShippingStep({ onComplete }) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [shippingCost, setShippingCost] = useState(0)

  // Auto-select first method on mount
  useEffect(() => {
    if (!selectedMethod && shippingMethods.length > 0) {
      setSelectedMethod(shippingMethods[0].id)
      setShippingCost(shippingMethods[0].price)
    }
  }, [])

  const handleSelect = (id: string) => {
    setSelectedMethod(id)
    const method = shippingMethods.find((m) => m.id === id)
    if (method) {
      setShippingCost(method.price)
    }
  }

  return (
    <div className="checkout-step">
      <h2>Verzendmethode</h2>

      <div className="shipping-methods-grid">
        {shippingMethods.map((method) => (
          <ShippingMethodCard
            key={method.id}
            method={method}
            selected={selectedMethod === method.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <OrderSummary shipping={shippingCost} />

      <button onClick={onComplete} disabled={!selectedMethod}>
        Verder naar betaling
      </button>
    </div>
  )
}
```

## Props

| Prop             | Type                             | Required | Default | Description                        |
| ---------------- | -------------------------------- | -------- | ------- | ---------------------------------- |
| `method`         | `ShippingMethod`                 | ✓        | -       | Shipping method data               |
| `selected`       | `boolean`                        | ✓        | -       | Whether this method is selected    |
| `onSelect`       | `(methodId: string) => void`     | ✓        | -       | Select handler                     |
| `disabled`       | `boolean`                        |          | `false` | Whether the card is disabled       |
| `currencySymbol` | `string`                         |          | `"€"`   | Currency symbol                    |
| `className`      | `string`                         |          | `''`    | Additional CSS classes             |

## Shipping Method Interface

```typescript
interface ShippingMethod {
  /**
   * Unique ID
   */
  id: string

  /**
   * Display name (e.g., "Standaard", "Express")
   */
  name: string

  /**
   * Method slug (standard/express/pickup/same-day)
   */
  slug: ShippingMethodSlug

  /**
   * Icon type (truck/zap/package/clock)
   */
  icon: ShippingMethodIcon

  /**
   * Delivery time description (e.g., "1-2 werkdagen")
   */
  deliveryTime: string

  /**
   * Shipping price in euros
   */
  price: number

  /**
   * Whether this method is free
   */
  isFree?: boolean

  /**
   * Estimated delivery days (for date calculation)
   */
  estimatedDays?: number

  /**
   * Whether this method is active
   */
  isActive?: boolean

  /**
   * Free shipping threshold (free above this cart total)
   */
  freeThreshold?: number
}

type ShippingMethodSlug = 'standard' | 'express' | 'pickup' | 'same-day'
type ShippingMethodIcon = 'truck' | 'zap' | 'package' | 'clock'
```

## Shipping Methods

### Standard Shipping (Truck Icon - Teal)

```typescript
{
  id: '1',
  name: 'Standaard',
  slug: 'standard',
  icon: 'truck',
  deliveryTime: '1-2 werkdagen',
  price: 6.95,
  estimatedDays: 2,
}
```

### Express Shipping (Zap Icon - Amber)

```typescript
{
  id: '2',
  name: 'Express',
  slug: 'express',
  icon: 'zap',
  deliveryTime: 'Morgen in huis',
  price: 12.95,
  estimatedDays: 1,
}
```

### Pickup (Package Icon - Teal)

```typescript
{
  id: '3',
  name: 'Afhalen',
  slug: 'pickup',
  icon: 'package',
  deliveryTime: 'Binnen 4 uur klaar',
  price: 0,
  isFree: true,
  estimatedDays: 0,
}
```

### Same-Day Delivery (Clock Icon - Teal)

```typescript
{
  id: '4',
  name: 'Vandaag bezorgd',
  slug: 'same-day',
  icon: 'clock',
  deliveryTime: 'Voor 18:00 besteld',
  price: 19.95,
  estimatedDays: 0,
}
```

## Payload CMS Integration

### Site Settings Configuration

Add shipping methods to your Payload Site Settings global:

```typescript
// src/collections/SiteSettings.ts
{
  slug: 'site-settings',
  fields: [
    {
      name: 'shippingMethods',
      type: 'array',
      label: 'Verzendmethoden',
      admin: {
        description: 'Configureer beschikbare verzendmethoden voor de checkout',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          defaultValue: 'Standaard',
        },
        {
          name: 'slug',
          type: 'select',
          required: true,
          options: [
            { label: 'Standaard', value: 'standard' },
            { label: 'Express', value: 'express' },
            { label: 'Afhalen', value: 'pickup' },
            { label: 'Same-Day', value: 'same-day' },
          ],
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Truck', value: 'truck' },
            { label: 'Zap', value: 'zap' },
            { label: 'Package', value: 'package' },
            { label: 'Clock', value: 'clock' },
          ],
          defaultValue: 'truck',
        },
        {
          name: 'deliveryTime',
          type: 'text',
          required: true,
          defaultValue: '1-2 werkdagen',
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          defaultValue: 6.95,
          admin: {
            step: 0.01,
            description: 'Verzendkosten in euro',
          },
        },
        {
          name: 'freeThreshold',
          type: 'number',
          admin: {
            description: 'Gratis verzending boven dit bedrag (leeg laten voor altijd betaald)',
          },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Zichtbaar in checkout',
          },
        },
        {
          name: 'estimatedDays',
          type: 'number',
          admin: {
            description: 'Geschatte levertijd in werkdagen',
          },
        },
      ],
    },
  ],
}
```

### Fetching Shipping Methods

```typescript
// In your checkout page/component
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function getShippingMethods() {
  const payload = await getPayloadHMR({ config: configPromise })

  const settings = await payload.findGlobal({
    slug: 'site-settings',
  })

  // Filter active methods only
  const activeMethods = settings.shippingMethods?.filter((m) => m.isActive) || []

  return activeMethods
}
```

### API Validation Endpoint

```typescript
// app/api/checkout/validate-shipping/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  const { methodId, cartTotal } = await req.json()

  const payload = await getPayloadHMR({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const method = settings.shippingMethods?.find((m) => m.id === methodId)

  if (!method || !method.isActive) {
    return NextResponse.json(
      { valid: false, message: 'Deze verzendmethode is niet beschikbaar' },
      { status: 400 },
    )
  }

  // Check free threshold
  const isFree = method.freeThreshold && cartTotal >= method.freeThreshold
  const finalPrice = isFree ? 0 : method.price

  return NextResponse.json({
    valid: true,
    price: finalPrice,
    isFree,
    name: method.name,
    deliveryTime: method.deliveryTime,
  })
}
```

## State Management

### Auto-Select First Method

```typescript
const [selectedShipping, setSelectedShipping] = useState<string | null>(null)

useEffect(() => {
  if (!selectedShipping && methods.length > 0) {
    setSelectedShipping(methods[0].id)
  }
}, [methods, selectedShipping])
```

### Update Order Total on Selection

```typescript
useEffect(() => {
  const method = methods.find((m) => m.id === selectedShipping)
  if (method) {
    updateCartTotal({ shippingCost: method.price })
  }
}, [selectedShipping])
```

### Persist Selection to Cart

```typescript
const handleSelect = async (id: string) => {
  setSelectedShipping(id)

  // Update cart in database
  await fetch('/api/cart/update-shipping', {
    method: 'POST',
    body: JSON.stringify({ shippingMethodId: id }),
  })
}
```

## Accessibility

### ARIA Attributes

```tsx
<label className="shipping-method">
  <input
    type="radio"
    name="shipping-method"
    value={method.id}
    checked={selected}
    onChange={() => onSelect(method.id)}
    aria-label={`${method.name}, ${method.deliveryTime}, ${formatPrice(method.price)}`}
  />
  {/* Card content */}
</label>
```

### Keyboard Support

- **Tab:** Focus on radio buttons
- **Space/Enter:** Select shipping method
- **Arrow keys:** Navigate between radio buttons (native radio group behavior)
- **Focus ring:** 3px teal glow outline (visible on keyboard focus)

### Screen Reader Behavior

**Announces:**

- "Standaard, radio button, 1-2 werkdagen, € 6,95, not checked"
- "Express, radio button, Morgen in huis, € 12,95, not checked"
- "Afhalen, radio button, Binnen 4 uur klaar, Gratis, checked"

## Theme Variables Used

### Colors

- **Teal:** `var(--teal)` — #00897B (selected border, truck/pickup icon)
- **Teal Glow:** `var(--teal-glow)` — rgba(0, 137, 123, 0.12) (focus outline)
- **Amber:** `var(--amber)` — #F59E0B (express/same-day icon)
- **Green:** `var(--green)` — #00C853 (free shipping text)
- **Grey:** `var(--grey)` — #E8ECF1 (default border)
- **Grey Dark:** `var(--grey-dark)` — #64748B (delivery time text)
- **Navy:** `var(--navy)` — #0A1628 (name, price)
- **White:** `var(--white)` — #FAFBFC (selected background)

### Typography

- `--font-display` (Plus Jakarta Sans) - Price
- `--font-primary` (DM Sans) - Name, delivery time

## Styling Details

### Card

- **Padding:** 20px (18px on mobile)
- **Border:** 2px solid var(--grey) (teal when selected)
- **Border-radius:** 14px
- **Display:** flex, flex-direction: column
- **Gap:** 8px between elements
- **Hover:** border-color: var(--teal), shadow: 0 4px 12px rgba(0,137,123,0.1)

### Radio Button

- **Position:** absolute, top: 16px, right: 16px
- **Size:** 20px × 20px
- **Accent-color:** var(--teal)
- **Focus outline:** 3px solid var(--teal-glow)

### Typography Sizes

- **Name:** 14px, 700 weight (13px on mobile)
- **Delivery time:** 13px, 400 weight (12px on mobile)
- **Price:** 18px, 800 weight, var(--font-display) (16px on mobile)

## Responsive Behavior

### Desktop (>768px)

- **Grid layout:** `repeat(auto-fit, minmax(240px, 1fr))`
- **Displays:** Up to 3 cards per row
- **Padding:** 20px

### Mobile (≤768px)

- **Grid layout:** 1 column
- **Padding:** 18px
- **Font sizes:** Slightly smaller for better fit

## Best Practices

### Always Show At Least 1 Method

```typescript
// Ensure at least standard shipping is available
if (shippingMethods.length === 0) {
  shippingMethods = [
    {
      id: 'default',
      name: 'Standaard',
      slug: 'standard',
      icon: 'truck',
      deliveryTime: '1-2 werkdagen',
      price: 6.95,
    },
  ]
}
```

### Free Shipping Logic

```typescript
const isFree = (cartTotal: number, method: ShippingMethod): boolean => {
  if (method.price === 0) return true
  if (method.freeThreshold && cartTotal >= method.freeThreshold) return true
  return false
}
```

### Delivery Date Calculation

```typescript
const calculateDeliveryDate = (estimatedDays: number): string => {
  const today = new Date()
  let businessDays = 0
  let currentDate = new Date(today)

  while (businessDays < estimatedDays) {
    currentDate.setDate(currentDate.getDate() + 1)
    const dayOfWeek = currentDate.getDay()
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays++
    }
  }

  return currentDate.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

// Usage: "woensdag 28 februari"
```

### Postal Code Restrictions

```typescript
const isExpressAvailable = (postalCode: string): boolean => {
  // Express not available in rural areas
  const ruralPrefixes = ['9', '8'] // Example: provinces Groningen, Friesland
  return !ruralPrefixes.includes(postalCode[0])
}
```

## Integration with Other Components

- **EC12: PaymentMethodCard** - Same pattern for payment methods
- **EC13: CheckoutProgressStepper** - Shows current checkout step
- **EC07: OrderSummary** - Displays selected shipping cost
- **EC05: FreeShippingProgress** - Shows progress to free shipping threshold
- **C25: ProgressSteps** - Checkout step indicator

## Testing Checklist

- [ ] Radio button selection works (1 selected at a time)
- [ ] Click anywhere on card selects the method
- [ ] Hover state visible (teal border + shadow)
- [ ] Focus state visible (teal glow ring)
- [ ] Keyboard navigation (Tab, Space, Arrows)
- [ ] Price updates in Order Summary
- [ ] Free shipping shows green "Gratis" text
- [ ] Mobile responsive (1 column)
- [ ] Icon colors correct (truck/pickup teal, express amber)
- [ ] Disabled state works (greyed out, not clickable)
- [ ] Screen reader announces all info correctly
- [ ] Dutch locale formatting (€ 6,95 with comma)

## Component Location

```
src/branches/ecommerce/components/checkout/ShippingMethodCard/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Checkout
**Complexity:** Medium (radio group, state management)
**Priority:** 🔴 CRITICAL (Phase 1 - Checkout Flow)
**Last Updated:** February 25, 2026
