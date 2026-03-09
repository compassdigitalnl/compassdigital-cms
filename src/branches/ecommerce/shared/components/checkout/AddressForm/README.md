# AddressForm (ec14)

Shipping address form for checkout flow with validation, Dutch postcode autocomplete, and saved addresses support for B2B customers. Provides clear visual feedback for required fields, validation errors, and successful input.

## Features

- ✅ **7 address fields:** firstName, lastName, street, addition (optional), postalCode, city, country
- ✅ **Required field indicators:** Red asterisk (*)
- ✅ **Real-time validation:** Error messages below invalid fields
- ✅ **Validation states:** Error (coral), Success (green after validation)
- ✅ **NL postcode autocomplete:** Automatically fills city from postcode (1234 AB format)
- ✅ **Saved addresses:** Dropdown for B2B customers to select pre-saved addresses
- ✅ **Helper text:** For optional fields (e.g., "Appartement, verdieping, etc.")
- ✅ **Country selection:** Dropdown with NL, BE, DE, FR, UK
- ✅ **2-column grid:** Stacks to 1-column on mobile (<640px)
- ✅ **Fully accessible:** ARIA labels, keyboard navigation, screen reader support
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { AddressForm } from '@/branches/ecommerce/components/checkout/AddressForm'

<AddressForm
  onSubmit={(address) => {
    saveShippingAddress(address)
    goToNextStep()
  }}
/>
```

### With Saved Addresses (B2B)

```tsx
const savedAddresses = [
  {
    id: 'addr_1',
    label: '🏢 Hoofdlocatie — Breestraat 42, Beverwijk',
    address: {
      firstName: 'Jan',
      lastName: 'de Vries',
      street: 'Breestraat 42',
      postalCode: '1941 EK',
      city: 'Beverwijk',
      country: 'NL',
    },
    isDefault: true,
  },
  {
    id: 'addr_2',
    label: '📦 Magazijn — Industrieweg 15, Zaandam',
    address: {
      firstName: 'Magazijn',
      lastName: 'Manager',
      street: 'Industrieweg 15',
      addition: 'Hal B',
      postalCode: '1502 AB',
      city: 'Zaandam',
      country: 'NL',
    },
  },
]

<AddressForm
  showSavedAddresses={true}
  savedAddresses={savedAddresses}
  onSubmit={handleSubmit}
/>
```

### With Initial Values (Edit Mode)

```tsx
<AddressForm
  initialValues={{
    firstName: 'Jan',
    lastName: 'de Vries',
    street: 'Breestraat 42',
    postalCode: '1941 EK',
    city: 'Beverwijk',
    country: 'NL',
  }}
  onSubmit={updateAddress}
/>
```

### With Validation Handler

```tsx
<AddressForm
  onSubmit={saveAddress}
  onValidate={(errors) => {
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors)
    }
  }}
/>
```

### With onChange (Controlled Form)

```tsx
const [address, setAddress] = useState<Partial<Address>>({})

<AddressForm
  onChange={(partialAddress) => {
    setAddress(partialAddress)
    // Auto-save to localStorage, etc.
  }}
  onSubmit={finalizeCheckout}
/>
```

### International Shipping (Disable Autocomplete)

```tsx
<AddressForm
  enableAutocomplete={false}
  onSubmit={handleInternationalAddress}
/>
```

### Custom Title

```tsx
<AddressForm
  title="Factuuradres"
  onSubmit={saveBillingAddress}
/>
```

## Props

| Prop                    | Type                               | Required | Default                                                    | Description                                     |
| ----------------------- | ---------------------------------- | -------- | ---------------------------------------------------------- | ----------------------------------------------- |
| `onSubmit`              | `(address: Address) => void`       | ✓        | -                                                          | Form submission handler                         |
| `initialValues`         | `Partial<Address>`                 |          | `{}`                                                       | Initial form values                             |
| `savedAddresses`        | `SavedAddress[]`                   |          | `[]`                                                       | Saved addresses (B2B)                           |
| `showSavedAddresses`    | `boolean`                          |          | `false`                                                    | Show saved addresses dropdown                   |
| `enableAutocomplete`    | `boolean`                          |          | `true`                                                     | Enable NL postcode autocomplete                 |
| `onValidate`            | `(errors: ValidationErrors) => void` |          | -                                                          | Validation handler                              |
| `onChange`              | `(address: Partial<Address>) => void` |          | -                                                          | Change handler (for controlled forms)           |
| `isSubmitting`          | `boolean`                          |          | `false`                                                    | Whether form is submitting                      |
| `requiredFields`        | `(keyof Address)[]`                |          | `['firstName', 'lastName', 'street', 'postalCode', 'city', 'country']` | Override required fields                        |
| `title`                 | `string`                           |          | `'Afleveradres'`                                           | Section title                                   |
| `className`             | `string`                           |          | `''`                                                       | Additional CSS classes                          |

## Types

```typescript
interface Address {
  firstName: string
  lastName: string
  street: string
  addition?: string
  postalCode: string
  city: string
  country: string
}

interface SavedAddress {
  id: string
  label: string // Display name (e.g., "Hoofdlocatie")
  address: Address
  isDefault?: boolean
}

type ValidationErrors = Record<string, string>

interface AddressFormProps {
  initialValues?: Partial<Address>
  savedAddresses?: SavedAddress[]
  showSavedAddresses?: boolean
  enableAutocomplete?: boolean
  onSubmit: (address: Address) => void
  onValidate?: (errors: ValidationErrors) => void
  onChange?: (address: Partial<Address>) => void
  isSubmitting?: boolean
  requiredFields?: (keyof Address)[]
  title?: string
  className?: string
}
```

## Field Configuration

| Field        | Type   | Required | Validation                                      |
| ------------ | ------ | -------- | ----------------------------------------------- |
| `firstName`  | text   | ✅ Yes   | Min 2 characters                                |
| `lastName`   | text   | ✅ Yes   | Min 2 characters                                |
| `street`     | text   | ✅ Yes   | Must include house number                       |
| `addition`   | text   | ❌ No    | None                                            |
| `postalCode` | text   | ✅ Yes   | NL: "1234 AB" format (country-specific)         |
| `city`       | text   | ✅ Yes   | Min 2 characters                                |
| `country`    | select | ✅ Yes   | Valid ISO code (NL, BE, DE, FR, UK)             |

## Postcode Autocomplete

The component automatically fills the `city` field when a valid Dutch postcode is entered (format: `1234 AB`).

### API Endpoint

Create `/api/postcode-lookup/route.ts`:

```typescript
// /api/postcode-lookup/route.ts

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const postalCode = searchParams.get('postal')

  if (!postalCode) {
    return Response.json({ error: 'Postcode is required' }, { status: 400 })
  }

  try {
    // Option 1: Pro6PP API (Dutch postcode service)
    const response = await fetch(
      `https://api.pro6pp.nl/v2/autocomplete/nl/${postalCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.POSTCODE_API_KEY}`,
        },
      },
    )

    const data = await response.json()

    return Response.json({
      city: data.city,
      street: data.street, // Optional
      municipality: data.municipality, // Optional
    })
  } catch (error) {
    console.error('Postcode lookup failed:', error)
    return Response.json({ error: 'Lookup failed' }, { status: 500 })
  }
}
```

### Postcode API Providers

**Recommended:**

1. **Pro6PP** - https://www.pro6pp.nl
   - €0.01 per lookup
   - Free tier: 100 lookups/month
   - Fast & accurate

2. **Postcode.nl** - https://www.postcode.nl/services/adresdata
   - €0.02 per lookup
   - High accuracy
   - Official Dutch postal data

3. **Postcodedata.nl** (Free)
   - Free for low volume
   - Less accurate than paid options

### International Postcodes

For non-NL countries, adjust validation pattern:

```typescript
const POSTCODE_PATTERNS = {
  NL: /^\d{4}\s?[A-Z]{2}$/i, // 1234 AB
  BE: /^\d{4}$/, // 1000
  DE: /^\d{5}$/, // 12345
  FR: /^\d{5}$/, // 75001
  UK: /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i, // SW1A 1AA
}
```

## Validation

### Client-Side Validation

Validation happens:

1. **On blur** - When user leaves a field
2. **On change** - If field was already touched
3. **On submit** - All fields validated

### Validation Rules

```typescript
// Required fields (default)
requiredFields = ['firstName', 'lastName', 'street', 'postalCode', 'city', 'country']

// Field-specific rules
firstName: min 2 characters
lastName: min 2 characters
street: required (no specific pattern)
addition: optional
postalCode: NL format "1234 AB" (if country === 'NL')
city: min 2 characters
country: must be valid option
```

### Custom Validation

Override `requiredFields` prop:

```typescript
<AddressForm
  requiredFields={['firstName', 'lastName', 'street', 'city', 'country']}
  // postalCode is now optional
  onSubmit={handleSubmit}
/>
```

## Payload CMS Integration

### Order Collection (Shipping Address)

```typescript
// collections/Orders.ts

{
  name: 'shippingAddress',
  type: 'group',
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'street', type: 'text', required: true },
    { name: 'addition', type: 'text' },
    { name: 'postalCode', type: 'text', required: true },
    { name: 'city', type: 'text', required: true },
    {
      name: 'country',
      type: 'select',
      options: ['NL', 'BE', 'DE', 'FR', 'UK'],
      defaultValue: 'NL',
    },
  ],
}
```

### User Collection (Saved Addresses - B2B)

```typescript
// collections/Users.ts

{
  name: 'savedAddresses',
  type: 'array',
  admin: {
    condition: (data) => data.role === 'business', // B2B only
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name (e.g., "Hoofdlocatie", "Magazijn")',
      },
    },
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'street', type: 'text', required: true },
    { name: 'addition', type: 'text' },
    { name: 'postalCode', type: 'text', required: true },
    { name: 'city', type: 'text', required: true },
    { name: 'country', type: 'text', required: true },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Use as default shipping address',
      },
    },
  ],
}
```

### Fetching Saved Addresses

```typescript
// In checkout page component

const user = await payload.findByID({
  collection: 'users',
  id: session.userId,
})

const savedAddresses = user.savedAddresses?.map((addr) => ({
  id: addr.id,
  label: addr.label,
  address: {
    firstName: addr.firstName,
    lastName: addr.lastName,
    street: addr.street,
    addition: addr.addition,
    postalCode: addr.postalCode,
    city: addr.city,
    country: addr.country,
  },
  isDefault: addr.isDefault,
}))

return (
  <AddressForm
    showSavedAddresses={user.role === 'business'}
    savedAddresses={savedAddresses}
    initialValues={savedAddresses.find((a) => a.isDefault)?.address}
    onSubmit={handleSubmit}
  />
)
```

## Accessibility

### ARIA Attributes

```tsx
<div className="form-group error">
  <label className="form-label" htmlFor="postalCode">
    Postcode
    <span className="req" aria-label="required">
      *
    </span>
  </label>
  <input
    id="postalCode"
    className="form-input"
    type="text"
    aria-required="true"
    aria-invalid="true"
    aria-describedby="postalCode-error"
  />
  <div className="error-message" id="postalCode-error" role="alert">
    <AlertCircle size={14} />
    Voer een geldige postcode in (bijv. 1234 AB)
  </div>
</div>
```

### Keyboard Navigation

- **Tab:** Focus next field
- **Shift+Tab:** Focus previous field
- **Enter:** Submit form
- **Arrow keys:** Navigate country dropdown

### Screen Reader Announcements

- "Voornaam, required, edit text"
- "Postcode, required, invalid entry, edit text, Voer een geldige postcode in"
- "Adres automatisch aangevuld" (on postcode autocomplete)
- Error messages announced with `role="alert"`

### Focus Management

- Visible focus ring: `box-shadow: 0 0 0 3px var(--teal-glow)`
- Focus first empty required field on form load
- Focus first error field after validation

## Theme Variables Used

### Colors

- **Navy:** `var(--navy)` — #0A1628 (labels, input text)
- **Teal:** `var(--teal)` — #00897B (focus border, section icon)
- **Teal Glow:** `var(--teal-glow)` — rgba(0, 137, 123, 0.12) (focus ring, autocomplete hint)
- **Green:** `var(--green)` — #00C853 (success state - optional use)
- **Coral:** `var(--coral)` — #FF6B6B (required asterisk, error border, error text)
- **White:** `var(--white)` — #FAFBFC (input background)
- **Grey:** `var(--grey)` — #E8ECF1 (default borders)
- **Grey Mid:** `var(--grey-mid)` — #94A3B8 (placeholder, helper text)

### Spacing

- **--space-4:** 4px (label gap)
- **--space-6:** 6px (label → input gap)
- **--space-8:** 8px (icon gap, select padding)
- **--space-12:** 12px (title border gap, saved addresses padding)
- **--space-16:** 16px (grid gap, mobile padding, saved addresses margin)
- **--space-20:** 20px (title margin-bottom)
- **--space-24:** 24px (section padding, section margin-bottom)

### Border & Radius

- **Input border:** 1.5px solid (slightly thicker for clarity)
- **Section border:** 1px solid
- **Input radius:** 8px (--radius-sm)
- **Section radius:** 14px (--radius-lg)

## Styling Details

### Section Container

- **Background:** white
- **Border:** 1px solid var(--grey)
- **Border-radius:** var(--radius-lg) (14px)
- **Padding:** 24px (desktop), 16px (mobile)
- **Margin-bottom:** 24px

### Form Grid

- **Desktop (>640px):** 2-column layout
- **Mobile (<640px):** 1-column (stacked)
- **Gap:** 16px (row and column)

### Input Fields

- **Font:** 13px, 400 weight
- **Padding:** 10px 14px
- **Border:** 1.5px solid var(--grey)
- **Focus:** Teal border + 3px glow ring
- **Error:** Coral border + coral error message
- **Placeholder:** var(--grey-mid)

## Responsive Behavior

### Desktop (>640px)

- **Layout:** 2-column grid
- **Section padding:** 24px
- **Full-width fields:** Country dropdown only

### Mobile (<640px)

- **Layout:** 1-column (stacked)
- **Section padding:** 16px
- **All fields:** Full width

## Integration with Other Components

- **EC13: CheckoutProgressStepper** - Shows "Gegevens" as active step
- **EC11: ShippingMethodCard** - Next step after address entry
- **EC12: PaymentMethodCard** - Step 3 (payment selection)
- **C12: AddressBook** - Saved addresses management (admin panel)
- **EC15: PONumberInput** - Additional B2B field (purchase order number)

## Complete Checkout Integration

```tsx
'use client'

import { useState } from 'react'
import { CheckoutProgressStepper } from '@/branches/ecommerce/components/checkout/CheckoutProgressStepper'
import { AddressForm } from '@/branches/ecommerce/components/checkout/AddressForm'
import { ShippingMethodCard } from '@/branches/ecommerce/components/checkout/ShippingMethodCard'
import { PaymentMethodCard } from '@/branches/ecommerce/components/checkout/PaymentMethodCard'

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [shippingAddress, setShippingAddress] = useState(null)

  const handleAddressSubmit = (address) => {
    setShippingAddress(address)
    setCurrentStep(2) // Go to shipping method selection
  }

  return (
    <div className="checkout-container">
      {/* Progress indicator */}
      <CheckoutProgressStepper currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Step 1: Address */}
      {currentStep === 1 && (
        <AddressForm
          initialValues={shippingAddress}
          onSubmit={handleAddressSubmit}
          showSavedAddresses={user?.role === 'business'}
          savedAddresses={user?.savedAddresses}
        />
      )}

      {/* Step 2: Shipping method */}
      {currentStep === 2 && <ShippingSelection onNext={() => setCurrentStep(3)} />}

      {/* Step 3: Payment method */}
      {currentStep === 3 && <PaymentSelection onNext={() => setCurrentStep(4)} />}

      {/* Step 4: Review */}
      {currentStep === 4 && <OrderReview shippingAddress={shippingAddress} />}
    </div>
  )
}
```

## Best Practices

### Auto-Save Progress

```typescript
const [address, setAddress] = useState<Partial<Address>>({})

<AddressForm
  onChange={(partialAddress) => {
    setAddress(partialAddress)
    // Auto-save to localStorage
    localStorage.setItem('checkoutAddress', JSON.stringify(partialAddress))
  }}
  onSubmit={finalizeCheckout}
/>

// Restore on mount
useEffect(() => {
  const saved = localStorage.getItem('checkoutAddress')
  if (saved) {
    setAddress(JSON.parse(saved))
  }
}, [])
```

### Validate Before Next Step

```typescript
const [hasErrors, setHasErrors] = useState(false)

<AddressForm
  onValidate={(errors) => {
    setHasErrors(Object.keys(errors).length > 0)
  }}
  onSubmit={(address) => {
    if (!hasErrors) {
      saveAddress(address)
      goToNextStep()
    }
  }}
/>
```

### Handle Submission State

```typescript
const [isSubmitting, setIsSubmitting] = useState(false)

<AddressForm
  isSubmitting={isSubmitting}
  onSubmit={async (address) => {
    setIsSubmitting(true)
    try {
      await saveAddress(address)
      setCurrentStep(2)
    } catch (error) {
      console.error('Failed to save address:', error)
    } finally {
      setIsSubmitting(false)
    }
  }}
/>
```

## Testing Checklist

- [ ] Required fields show red asterisks (*)
- [ ] Validation errors appear below fields (not alerts)
- [ ] Focus state has teal border + glow ring
- [ ] Error state has coral border + error message
- [ ] Postcode autocomplete fills city (NL only, "1234 AB" format)
- [ ] Saved addresses load all fields correctly (B2B)
- [ ] Form submission prevented if validation fails
- [ ] Mobile: stacks to single column (<640px)
- [ ] Tab key navigates through all fields
- [ ] Screen reader announces errors with role="alert"
- [ ] Country dropdown allows keyboard selection
- [ ] Helper text visible for optional fields (addition)
- [ ] Error messages include AlertCircle icon
- [ ] Autocomplete hint shows Sparkles icon + "Adres automatisch aangevuld"
- [ ] All fields use theme variables (no hardcoded colors)

## Component Location

```
src/branches/ecommerce/components/checkout/AddressForm/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Checkout / Forms
**Complexity:** High (validation, autocomplete, state management)
**Priority:** 🔴 CRITICAL (Phase 1 - Checkout Flow)
**Last Updated:** February 25, 2026
