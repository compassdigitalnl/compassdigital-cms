# PaymentMethodCard (ec12)

Payment method selection card for checkout flow. Radio button card with logo, name, and description. Supports iDEAL, Credit Card, PayPal, Invoice, and Bank Transfer payment options.

## Features

- ✅ **Radio button selection:** Entire card is clickable
- ✅ **5 payment methods:** iDEAL, Credit Card, PayPal, Invoice (B2B), Bank Transfer
- ✅ **Payment logos:** Emoji placeholders (swap with real logos in production)
- ✅ **B2B badge:** Shows for business-only payment methods (Invoice)
- ✅ **Transaction fees:** Optional fee display (e.g., "€0.29")
- ✅ **Custom badges:** "Populair", "Snel", etc.
- ✅ **Hover states:** Border color + subtle shadow
- ✅ **Keyboard accessible:** Full ARIA support, focus rings
- ✅ **Theme variables only:** NO hardcoded colors!
- ✅ **Responsive:** 2-column grid → 1-column on mobile

## Usage

### Basic Usage

```tsx
import { PaymentMethodCard } from '@/branches/ecommerce/components/checkout/PaymentMethodCard'

const paymentMethods = [
  {
    id: '1',
    name: 'iDEAL',
    slug: 'ideal',
    description: 'Direct betalen via je bank',
    logo: '🏦',
  },
  {
    id: '2',
    name: 'Credit Card',
    slug: 'creditcard',
    description: 'Visa, Mastercard, Amex',
    logo: '💳',
  },
  {
    id: '3',
    name: 'PayPal',
    slug: 'paypal',
    description: 'Betaal via PayPal',
    logo: <span className="paypal-logo">P</span>,
  },
  {
    id: '4',
    name: 'Factuur',
    slug: 'invoice',
    description: 'Betaal binnen 14 dagen',
    logo: '📄',
    isB2B: true,
  },
]

const [selectedId, setSelectedId] = useState('1')

<div className="payment-methods-grid">
  {paymentMethods.map((method) => (
    <PaymentMethodCard
      key={method.id}
      method={method}
      selected={selectedId === method.id}
      onSelect={(id) => setSelectedId(id)}
    />
  ))}
</div>
```

### With 2-Column Grid

```tsx
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  }}
>
  {paymentMethods.map((method) => (
    <PaymentMethodCard
      key={method.id}
      method={method}
      selected={selectedId === method.id}
      onSelect={handleSelect}
    />
  ))}
</div>
```

### With Transaction Fees

```tsx
const paymentMethods = [
  {
    id: '1',
    name: 'iDEAL',
    slug: 'ideal',
    description: 'Direct betalen via je bank',
    logo: '🏦',
  },
  {
    id: '2',
    name: 'PayPal',
    slug: 'paypal',
    description: 'Betaal via PayPal',
    logo: <span className="paypal-logo">P</span>,
    fee: '+€0.29',
  },
]
```

### B2C Only (Hide Invoice)

```tsx
const b2cMethods = paymentMethods.filter((m) => !m.isB2B)

<div className="payment-methods-grid">
  {b2cMethods.map((method) => (
    <PaymentMethodCard
      key={method.id}
      method={method}
      selected={selectedId === method.id}
      onSelect={handleSelect}
    />
  ))}
</div>
```

### Full Checkout Integration

```tsx
'use client'

import { useState, useEffect } from 'react'
import { PaymentMethodCard } from '@/branches/ecommerce/components/checkout/PaymentMethodCard'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'

export function CheckoutPaymentStep({ onComplete, isB2B }) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  // Filter methods based on account type
  const availableMethods = paymentMethods.filter((m) => {
    if (m.isB2B) return isB2B // Only show invoice for B2B
    return true
  })

  // Auto-select first method on mount
  useEffect(() => {
    if (!selectedMethod && availableMethods.length > 0) {
      setSelectedMethod(availableMethods[0].id)
    }
  }, [])

  const handleSelect = (id: string) => {
    setSelectedMethod(id)
  }

  return (
    <div className="checkout-step">
      <h2>Betaalmethode</h2>

      <div className="payment-methods-grid">
        {availableMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            selected={selectedMethod === method.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <OrderSummary paymentMethod={selectedMethod} />

      <button onClick={onComplete} disabled={!selectedMethod}>
        Bestelling afronden
      </button>
    </div>
  )
}
```

## Props

| Prop        | Type                         | Required | Default | Description                  |
| ----------- | ---------------------------- | -------- | ------- | ---------------------------- |
| `method`    | `PaymentMethod`              | ✓        | -       | Payment method data          |
| `selected`  | `boolean`                    | ✓        | -       | Whether this method is selected |
| `onSelect`  | `(methodId: string) => void` | ✓        | -       | Select handler               |
| `disabled`  | `boolean`                    |          | `false` | Whether the card is disabled |
| `className` | `string`                     |          | `''`    | Additional CSS classes       |

## Payment Method Interface

```typescript
interface PaymentMethod {
  /**
   * Unique ID
   */
  id: string

  /**
   * Display name (e.g., "iDEAL", "Credit Card")
   */
  name: string

  /**
   * Method slug (ideal/creditcard/paypal/invoice/banktransfer)
   */
  slug: PaymentMethodSlug

  /**
   * Payment description (e.g., "Direct betalen via je bank")
   */
  description: string

  /**
   * Logo (emoji, icon component, or image URL)
   */
  logo: string | React.ReactNode

  /**
   * Whether this is a B2B-only payment method
   */
  isB2B?: boolean

  /**
   * Whether this method is active
   */
  isActive?: boolean

  /**
   * Transaction fee (optional, e.g., "€0.29")
   */
  fee?: string

  /**
   * Custom badge (e.g., "Populair", "Snel")
   */
  badge?: string
}

type PaymentMethodSlug = 'ideal' | 'creditcard' | 'paypal' | 'invoice' | 'banktransfer'
```

## Payment Methods

### iDEAL (Most Popular in NL)

```typescript
{
  id: '1',
  name: 'iDEAL',
  slug: 'ideal',
  description: 'Direct betalen via je bank',
  logo: '🏦', // or <Image src="/logos/ideal.svg" />
}
```

### Credit Card

```typescript
{
  id: '2',
  name: 'Credit Card',
  slug: 'creditcard',
  description: 'Visa, Mastercard, Amex',
  logo: '💳', // or card logos
}
```

### PayPal (Blue "P" Text)

```typescript
{
  id: '3',
  name: 'PayPal',
  slug: 'paypal',
  description: 'Betaal via PayPal',
  logo: <span className="paypal-logo">P</span>, // Blue #0070BA
  fee: '+€0.29', // Optional transaction fee
}
```

### Invoice (B2B Only)

```typescript
{
  id: '4',
  name: 'Factuur',
  slug: 'invoice',
  description: 'Betaal binnen 14 dagen',
  logo: '📄',
  isB2B: true, // Shows B2B badge
}
```

### Bank Transfer

```typescript
{
  id: '5',
  name: 'Bankoverschrijving',
  slug: 'banktransfer',
  description: 'Handmatig overmaken',
  logo: '🏦',
}
```

## Payload CMS Integration

### Site Settings Configuration

Add payment methods to your Payload Site Settings global:

```typescript
// src/collections/SiteSettings.ts
{
  slug: 'site-settings',
  fields: [
    {
      name: 'paymentMethods',
      type: 'array',
      label: 'Betaalmethoden',
      admin: {
        description: 'Configureer beschikbare betaalmethoden voor de checkout',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          defaultValue: 'iDEAL',
        },
        {
          name: 'slug',
          type: 'select',
          required: true,
          options: [
            { label: 'iDEAL', value: 'ideal' },
            { label: 'Credit Card', value: 'creditcard' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'Factuur', value: 'invoice' },
            { label: 'Bankoverschrijving', value: 'banktransfer' },
          ],
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          defaultValue: 'Direct betalen via je bank',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload payment provider logo',
          },
        },
        {
          name: 'isB2B',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Alleen zichtbaar voor zakelijke klanten',
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
          name: 'transactionFee',
          type: 'number',
          admin: {
            step: 0.01,
            description: 'Transactiekosten (optioneel)',
          },
        },
      ],
    },
  ],
}
```

### Fetching Payment Methods

```typescript
// In your checkout page/component
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function getPaymentMethods(isB2B: boolean = false) {
  const payload = await getPayloadHMR({ config: configPromise })

  const settings = await payload.findGlobal({
    slug: 'site-settings',
  })

  // Filter active methods
  let activeMethods = settings.paymentMethods?.filter((m) => m.isActive) || []

  // Filter B2B methods for B2C customers
  if (!isB2B) {
    activeMethods = activeMethods.filter((m) => !m.isB2B)
  }

  return activeMethods
}
```

### API Validation Endpoint

```typescript
// app/api/checkout/validate-payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  const { methodId, userType } = await req.json()

  const payload = await getPayloadHMR({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const method = settings.paymentMethods?.find((m) => m.id === methodId)

  if (!method || !method.isActive) {
    return NextResponse.json(
      { valid: false, message: 'Deze betaalmethode is niet beschikbaar' },
      { status: 400 },
    )
  }

  // B2B validation: invoice only for verified business accounts
  if (method.isB2B && userType !== 'b2b') {
    return NextResponse.json(
      {
        valid: false,
        message: 'Factuur betaling is alleen beschikbaar voor zakelijke klanten',
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    valid: true,
    name: method.name,
    description: method.description,
    fee: method.transactionFee || 0,
  })
}
```

## Payment Gateway Integration

### Mollie Integration (iDEAL)

```typescript
import { createMollieClient } from '@mollie/api-client'

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY })

const createPayment = async (order: Order, method: string) => {
  if (method === 'ideal') {
    return await mollie.payments.create({
      amount: { value: order.total.toFixed(2), currency: 'EUR' },
      method: 'ideal',
      description: `Order #${order.orderNumber}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/order-confirmation/${order.id}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/webhooks/mollie`,
    })
  }
}
```

### Stripe Integration (Credit Card)

```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const createPayment = async (order: Order, method: string) => {
  if (method === 'creditcard') {
    return await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // cents
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: { orderId: order.id },
    })
  }
}
```

### PayPal Integration

```typescript
import { PayPalClient } from '@paypal/checkout-server-sdk'

const createPayment = async (order: Order, method: string) => {
  if (method === 'paypal') {
    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer('return=representation')
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: order.total.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order-confirmation/${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout`,
      },
    })

    return await paypalClient.execute(request)
  }
}
```

### Invoice (B2B)

```typescript
const createInvoice = async (order: Order) => {
  // Set order status to "pending payment"
  await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      status: 'pending_payment',
      paymentDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    },
  })

  // Send invoice email
  await sendEmail({
    to: order.customer.email,
    subject: `Factuur voor bestelling #${order.orderNumber}`,
    template: 'invoice',
    data: { order },
  })

  return { success: true, message: 'Factuur verzonden' }
}
```

## State Management

### Auto-Select First Method

```typescript
const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

useEffect(() => {
  if (!selectedPayment && methods.length > 0) {
    setSelectedPayment(methods[0].id)
  }
}, [methods, selectedPayment])
```

### Update Order on Selection

```typescript
useEffect(() => {
  const method = methods.find((m) => m.id === selectedPayment)
  if (method) {
    // Update order with payment method
    updateOrder({ paymentMethod: method.slug })
  }
}, [selectedPayment])
```

### Persist Selection to Cart

```typescript
const handleSelect = async (id: string) => {
  setSelectedPayment(id)

  // Update cart in database
  await fetch('/api/cart/update-payment', {
    method: 'POST',
    body: JSON.stringify({ paymentMethodId: id }),
  })
}
```

## Accessibility

### ARIA Attributes

```tsx
<div role="radiogroup" aria-labelledby="payment-heading">
  <h3 id="payment-heading">Kies je betaalmethode</h3>

  <label className="payment-method-card">
    <input
      type="radio"
      name="payment-method"
      value={method.id}
      checked={selected}
      aria-label={`${method.name}, ${method.description}`}
    />
    {/* Card content */}
  </label>
</div>
```

### Keyboard Support

- **Tab:** Focus on radio buttons
- **Space/Enter:** Select payment method
- **Arrow keys:** Navigate between radio buttons (native radio group behavior)
- **Focus ring:** 2px teal outline (visible on keyboard focus)

### Screen Reader Behavior

**Announces:**

- "iDEAL, radio button, Direct betalen via je bank, checked"
- "Credit Card, radio button, Visa, Mastercard, Amex, not checked"
- "Factuur, B2B, radio button, Betaal binnen 14 dagen, not checked"

## Theme Variables Used

### Colors

- **Teal:** `var(--teal)` — #00897B (selected border, radio button, B2B badge text)
- **Teal Light:** `var(--teal-light)` — #26A69A (hover border)
- **Teal Glow:** `var(--teal-glow)` — rgba(0, 137, 123, 0.12) (B2B badge background)
- **Grey:** `var(--grey)` — #E8ECF1 (default border)
- **Grey Light:** `var(--grey-light)` — #F1F4F8 (logo background)
- **Grey Mid:** `var(--grey-mid)` — #94A3B8 (fee text)
- **Grey Dark:** `var(--grey-dark)` — #64748B (description text)
- **Navy:** `var(--navy)` — #0A1628 (name text)
- **White:** `white` — Card background

### Typography

- `--font-primary` (DM Sans) - Name, description
- PayPal logo: Plus Jakarta Sans, 14px, 700, #0070BA

## Styling Details

### Card

- **Padding:** 20px (16px on mobile)
- **Border:** 2px solid var(--grey) (teal when selected)
- **Border-radius:** 14px
- **Display:** flex, align-items: center
- **Gap:** 16px (radio → info → logo)
- **Hover:** border-color: var(--teal-light), shadow: 0 1px 3px

### Radio Button

- **Size:** 20px × 20px
- **Accent-color:** var(--teal)
- **Position:** Left side (not absolute)

### Payment Logo

- **Size:** 48px × 32px (40×24 on mobile)
- **Background:** var(--grey-light)
- **Border-radius:** 6px
- **Font-size:** 20px (emoji)

### B2B Badge

- **Font:** 10px, 700 weight
- **Color:** var(--teal)
- **Background:** var(--teal-glow)
- **Padding:** 2px 6px
- **Border-radius:** 4px
- **Text-transform:** uppercase

### Typography Sizes

- **Name:** 15px, 700 weight (14px on mobile)
- **Description:** 13px, 400 weight (12px on mobile)
- **Fee:** 12px, var(--grey-mid)

## Responsive Behavior

### Desktop (>640px)

- **Grid layout:** `repeat(2, 1fr)` (2 columns)
- **Card width:** ~50%
- **Padding:** 20px

### Mobile (≤640px)

- **Grid layout:** 1 column
- **Card width:** 100%
- **Padding:** 16px
- **Logo:** 40×24px

## Best Practices

### Always Show At Least 1 Method

```typescript
if (paymentMethods.length === 0) {
  paymentMethods = [
    {
      id: 'default',
      name: 'iDEAL',
      slug: 'ideal',
      description: 'Direct betalen via je bank',
      logo: '🏦',
    },
  ]
}
```

### Filter B2B Methods for B2C

```typescript
const availableMethods = (isB2B: boolean) => {
  return paymentMethods.filter((m) => {
    if (m.isB2B) return isB2B
    return true
  })
}
```

### Validate Before Checkout

```typescript
const validatePaymentMethod = (methodId: string, userType: string): boolean => {
  const method = paymentMethods.find((m) => m.id === methodId)

  if (!method || !method.isActive) return false
  if (method.isB2B && userType !== 'b2b') return false

  return true
}
```

## Integration with Other Components

- **EC11: ShippingMethodCard** - Previous step, same visual pattern
- **EC13: CheckoutProgressStepper** - Shows "Betaling" step as active
- **EC07: OrderSummary** - Displays selected payment method
- **C25: ProgressSteps** - Generic progress indicator
- **EC14: AddressForm** - Previous checkout step (address entry)

## Testing Checklist

- [ ] Single selection enforced (only 1 radio checked)
- [ ] Border color changes on selection (teal)
- [ ] Hover state works (border + shadow)
- [ ] Focus ring visible on keyboard navigation
- [ ] Arrow keys navigate between options
- [ ] Space/Enter selects focused option
- [ ] Screen reader announces method + description
- [ ] B2B badge only shows for invoice method
- [ ] Disabled state prevents interaction
- [ ] Mobile: stacks to single column (<640px)
- [ ] Payment logos render correctly
- [ ] PayPal logo uses blue "P" text (not emoji)
- [ ] Form submission includes selected method
- [ ] Validation prevents checkout without selection
- [ ] B2B methods hidden for B2C customers

## Component Location

```
src/branches/ecommerce/components/checkout/PaymentMethodCard/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Checkout
**Complexity:** Medium (radio group, state management, B2B logic)
**Priority:** 🔴 CRITICAL (Phase 1 - Checkout Flow)
**Last Updated:** February 25, 2026
