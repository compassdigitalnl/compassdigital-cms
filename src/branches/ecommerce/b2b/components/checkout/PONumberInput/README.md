# PONumberInput (ec15)

B2B purchase order number input field for checkout and quote requests. Features monospace font (JetBrains Mono), auto-uppercase transformation, and letter-spacing for optimal readability of reference codes.

## Features

- ✅ **Monospace font:** JetBrains Mono for code-like reference numbers
- ✅ **Auto-uppercase:** Automatic uppercase transformation
- ✅ **Letter-spacing:** 0.02em for improved monospace readability
- ✅ **Optional field:** Not required by default (B2B convenience)
- ✅ **Helper text:** Explains purpose (appears on invoice/pakbon)
- ✅ **B2B badge:** Optional indicator for business customers
- ✅ **Icon variants:** File-text icon in label or inside input
- ✅ **Compact variant:** Smaller for inline forms
- ✅ **Max length:** 50 characters (prevents invoice overflow)
- ✅ **Fully accessible:** ARIA labels, keyboard navigation
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { PONumberInput } from '@/branches/ecommerce/components/checkout/PONumberInput'

<PONumberInput
  value={poNumber}
  onChange={(value) => setPoNumber(value)}
/>
```

### With B2B Badge

```tsx
<PONumberInput
  label="Purchase Order Nummer"
  showB2BBadge={true}
  value={poNumber}
  onChange={setPoNumber}
/>
```

### Compact Variant (Inline Forms)

```tsx
<PONumberInput
  variant="compact"
  label="PO-nummer"
  placeholder="Referentie"
  value={poNumber}
  onChange={setPoNumber}
/>
```

### Icon Inside Input

```tsx
<PONumberInput
  iconPosition="input"
  label="Referentienummer"
  value={poNumber}
  onChange={setPoNumber}
/>
```

### Required Field (Rare)

For wholesale orders where PO number is mandatory:

```tsx
<PONumberInput
  required={true}
  label="PO-nummer"
  helperText="Verplicht voor groothandel bestellingen"
  value={poNumber}
  onChange={setPoNumber}
/>
```

### Custom Helper Text

```tsx
<PONumberInput
  helperText="Dit nummer wordt gebruikt voor interne administratie en factuurverwerking."
  value={poNumber}
  onChange={setPoNumber}
/>
```

### Disabled State

For displaying existing PO number without editing:

```tsx
<PONumberInput
  value="PO-2024-001234"
  disabled={true}
/>
```

### Without Icon

```tsx
<PONumberInput
  showIcon={false}
  label="Referentienummer"
  value={poNumber}
  onChange={setPoNumber}
/>
```

## Props

| Prop            | Type                       | Required | Default                                                                   | Description                          |
| --------------- | -------------------------- | -------- | ------------------------------------------------------------------------- | ------------------------------------ |
| `name`          | `string`                   |          | `"poNumber"`                                                              | Field name attribute                 |
| `label`         | `string`                   |          | `"Referentienummer / PO-nummer"`                                          | Label text                           |
| `placeholder`   | `string`                   |          | `"Uw interne referentie voor op de factuur"`                             | Placeholder text                     |
| `helperText`    | `string`                   |          | `"Dit nummer verschijnt op uw factuur en pakbon voor interne administratie."` | Helper text below input              |
| `maxLength`     | `number`                   |          | `50`                                                                      | Maximum character length             |
| `variant`       | `'default' \| 'compact'`   |          | `'default'`                                                               | Visual variant                       |
| `showIcon`      | `boolean`                  |          | `true`                                                                    | Show file-text icon                  |
| `iconPosition`  | `'label' \| 'input'`       |          | `'label'`                                                                 | Icon position                        |
| `showB2BBadge`  | `boolean`                  |          | `false`                                                                   | Show B2B badge                       |
| `value`         | `string`                   |          | `''`                                                                      | Current value                        |
| `onChange`      | `(value: string) => void`  |          | -                                                                         | Change handler                       |
| `onBlur`        | `() => void`               |          | -                                                                         | Blur handler                         |
| `disabled`      | `boolean`                  |          | `false`                                                                   | Disabled state                       |
| `required`      | `boolean`                  |          | `false`                                                                   | Required field                       |
| `className`     | `string`                   |          | `''`                                                                      | Additional CSS classes               |

## Types

```typescript
type PONumberVariant = 'default' | 'compact'
type IconPosition = 'label' | 'input'

interface PONumberInputProps {
  name?: string
  label?: string
  placeholder?: string
  helperText?: string
  maxLength?: number
  variant?: PONumberVariant
  showIcon?: boolean
  iconPosition?: IconPosition
  showB2BBadge?: boolean
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  required?: boolean
  className?: string
}
```

## Auto-Uppercase Transformation

The component automatically converts all input to uppercase for consistency in PO number formatting.

### Implementation

```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // Auto-uppercase transformation
  const uppercased = e.target.value.toUpperCase()
  onChange?.(uppercased)
}
```

### Example

```
User types: "po-2024-12345"
Stored value: "PO-2024-12345"
```

## Monospace Typography

### Font Configuration

The input uses **JetBrains Mono** (monospace font) for better readability of reference codes, while the placeholder uses the standard Plus Jakarta Sans font.

```css
.po-input {
  font-family: var(--font-mono); /* JetBrains Mono */
  font-size: 14px;
  letter-spacing: 0.02em; /* Improves monospace readability */
  text-transform: uppercase;
}

.po-input::placeholder {
  font-family: var(--font-body); /* Plus Jakarta Sans */
  font-size: 13px;
  text-transform: none;
  letter-spacing: 0;
}
```

### Why Monospace?

- Better visual distinction for alphanumeric codes
- Consistent character width (easier to scan)
- Professional "code-like" appearance
- Matches invoice/document styling

## Validation

### Default Rules

```typescript
// Max length validation
maxLength={50} // Prevents overflow on invoices

// Format pattern (optional - for strict validation)
const PO_NUMBER_PATTERN = /^[A-Z0-9-]+$/ // Alphanumeric + dashes only

const validatePONumber = (value: string): boolean => {
  if (!value) return true // Optional field
  return PO_NUMBER_PATTERN.test(value) && value.length <= 50
}
```

### Common PO Number Formats

```
PO-2024-12345       ✅ Valid
ORDER-001234        ✅ Valid
REF123456           ✅ Valid
2024/Q1/001         ✅ Valid (if allowing slashes)
PO_2024_001         ✅ Valid (if allowing underscores)
```

## Payload CMS Integration

### Order Collection (Store PO Number)

```typescript
// collections/Orders.ts

{
  name: 'poNumber',
  type: 'text',
  maxLength: 50,
  admin: {
    description: 'Purchase Order number for B2B customers (appears on invoice)',
    placeholder: 'PO-2024-12345',
    condition: (data) => data.customerType === 'business', // B2B only
  },
}
```

### User Collection (Default PO Number Prefix)

```typescript
// collections/Users.ts

{
  name: 'poNumberPrefix',
  type: 'text',
  maxLength: 20,
  admin: {
    description: 'Default PO number prefix (e.g., "PO-2024-" or "ORDER-")',
    condition: (data) => data.role === 'business',
  },
}
```

### Fetching User's PO Prefix

```typescript
// In checkout page component

const user = await payload.findByID({
  collection: 'users',
  id: session.userId,
})

const defaultPONumber = user.poNumberPrefix
  ? `${user.poNumberPrefix}${String(user.orderCount + 1).padStart(5, '0')}`
  : ''

return (
  <PONumberInput
    value={defaultPONumber}
    onChange={setPONumber}
    showB2BBadge={user.role === 'business'}
  />
)
```

## Invoice Display

### PDF Invoice Template

```tsx
// In invoice template component

<div className="invoice-header">
  <h1>Factuur #{order.invoiceNumber}</h1>
  <div className="invoice-meta">
    <div>
      <strong>Datum:</strong> {formatDate(order.createdAt)}
    </div>
    {order.poNumber && (
      <div className="po-reference">
        <strong>PO-nummer:</strong> <code>{order.poNumber}</code>
      </div>
    )}
  </div>
</div>
```

### Packing Slip Display

```tsx
// In packing slip template

<div className="packing-slip-header">
  <h2>Pakbon #{order.orderNumber}</h2>
  {order.poNumber && (
    <div className="po-reference">
      <strong>Klantreferentie:</strong> {order.poNumber}
    </div>
  )}
</div>
```

## Checkout Integration

### Complete Form Integration

```tsx
'use client'

import { useState } from 'react'
import { AddressForm } from '@/branches/ecommerce/components/checkout/AddressForm'
import { PONumberInput } from '@/branches/ecommerce/components/checkout/PONumberInput'

export function CheckoutStep1() {
  const [address, setAddress] = useState(null)
  const [poNumber, setPONumber] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save both address and PO number
    saveCheckoutData({ address, poNumber })
    goToNextStep()
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Address form */}
      <AddressForm onSubmit={setAddress} showSavedAddresses={user.isB2B} />

      {/* PO Number (B2B only) */}
      {user.isB2B && (
        <div className="mt-4">
          <PONumberInput
            value={poNumber}
            onChange={setPONumber}
            showB2BBadge={true}
          />
        </div>
      )}

      <button type="submit">Volgende stap</button>
    </form>
  )
}
```

### With Auto-Save

```tsx
const [poNumber, setPONumber] = useState('')

<PONumberInput
  value={poNumber}
  onChange={(value) => {
    setPONumber(value)
    // Auto-save to localStorage
    localStorage.setItem('checkoutPONumber', value)
  }}
/>

// Restore on mount
useEffect(() => {
  const saved = localStorage.getItem('checkoutPONumber')
  if (saved) {
    setPONumber(saved)
  }
}, [])
```

## Accessibility

### ARIA Attributes

```tsx
<div className="po-number-group">
  <label className="po-label" htmlFor="po-number-input">
    <FileText size={16} aria-hidden="true" />
    Referentienummer / PO-nummer
    <span className="optional">(optioneel)</span>
  </label>
  <input
    id="po-number-input"
    className="po-input"
    type="text"
    name="poNumber"
    aria-describedby="po-number-helper"
    aria-required="false"
  />
  <div className="po-helper" id="po-number-helper">
    <Info size={14} aria-hidden="true" />
    <span>Dit nummer verschijnt op uw factuur en pakbon.</span>
  </div>
</div>
```

### Keyboard Navigation

- **Tab:** Focus input
- **Shift+Tab:** Leave input
- **Type:** Enter text (auto-uppercase)
- **Ctrl+A:** Select all text

### Screen Reader Announcements

- "Referentienummer / PO-nummer, optioneel, edit text"
- "Dit nummer verschijnt op uw factuur en pakbon" (helper text after focus)
- Icons hidden from screen readers (decorative only)

### Focus Management

- Visible focus ring: `box-shadow: 0 0 0 3px var(--teal-glow)`
- Teal border on focus
- Clear visual distinction from default state

## Theme Variables Used

### Colors

- **Navy:** `var(--navy)` — #0A1628 (label, input text)
- **Teal:** `var(--teal)` — #00897B (focus border, icon, B2B badge text)
- **Teal Glow:** `var(--teal-glow)` — rgba(0, 137, 123, 0.12) (focus ring, B2B badge bg)
- **White:** `var(--white)` — #FAFBFC (input background)
- **Grey:** `var(--grey)` — #E8ECF1 (default border)
- **Grey Mid:** `var(--grey-mid)` — #94A3B8 (placeholder, helper text, optional indicator, disabled text)
- **Grey Light:** `var(--grey-light)` — #F1F4F8 (disabled background)

### Typography

- **Label:** Plus Jakarta Sans, 13px, 600 weight
- **Input:** JetBrains Mono (monospace), 14px, 400 weight
- **Placeholder:** Plus Jakarta Sans, 13px, 400 weight
- **Helper text:** Plus Jakarta Sans, 12px, 400 weight
- **Optional indicator:** Plus Jakarta Sans, 11px, 400 weight
- **B2B badge:** Plus Jakarta Sans, 10px, 700 weight

### Spacing

- **--space-6:** 6px (label → input gap, icon gaps)
- **--space-8:** 8px (compact padding vertical)
- **--space-12:** 12px (compact padding horizontal)

### Special Typography

- **Text-transform:** uppercase (automatic capitalization)
- **Letter-spacing:** 0.02em (monospace readability)

## Styling Details

### Default Variant

- **Padding:** 10px 14px
- **Font-size:** 14px
- **Border:** 1.5px solid var(--grey)
- **Border-radius:** 8px (--radius-sm)

### Compact Variant

- **Label:** 12px (smaller)
- **Padding:** 8px 12px (tighter)
- **Font-size:** 13px (slightly smaller)

### Icon Inside Input

- **Icon position:** Absolute left 14px, centered vertically
- **Input padding-left:** 40px (makes room for icon)
- **Icon color:** var(--grey-mid)

## Integration with Other Components

- **EC14: AddressForm** - Often placed below address form in B2B checkout
- **EC07: OrderSummary** - May display PO number in summary
- **Invoice Templates** - Shows PO number on PDF invoices
- **OC02: OrderDetailsCard** - Displays PO number in order confirmation
- **Admin Order View** - Shows PO number in order details

## Best Practices

### Conditional Display (B2B Only)

```tsx
{
  user.role === 'business' && (
    <PONumberInput value={poNumber} onChange={setPONumber} showB2BBadge={true} />
  )
}
```

### Auto-Generate from User Prefix

```tsx
const generatePONumber = (user: User, orderCount: number): string => {
  if (!user.poNumberPrefix) return ''
  const nextNumber = String(orderCount + 1).padStart(5, '0')
  return `${user.poNumberPrefix}${nextNumber}`
}

const defaultPO = generatePONumber(user, user.orderCount)

<PONumberInput value={poNumber || defaultPO} onChange={setPONumber} />
```

### Validate Before Submission

```typescript
const PO_NUMBER_PATTERN = /^[A-Z0-9-]+$/

const validatePONumber = (value: string): boolean => {
  if (!value) return true // Optional
  if (value.length > 50) return false
  if (!PO_NUMBER_PATTERN.test(value)) return false
  return true
}

const handleSubmit = () => {
  if (poNumber && !validatePONumber(poNumber)) {
    setError('PO-nummer mag alleen letters, cijfers en streepjes bevatten')
    return
  }
  // Continue with submission
}
```

## Testing Checklist

- [ ] Input uses monospace font (JetBrains Mono)
- [ ] Placeholder uses regular font (Plus Jakarta Sans)
- [ ] Text auto-transforms to uppercase
- [ ] Letter-spacing applied (0.02em)
- [ ] Focus state shows teal border + glow ring
- [ ] Helper text explains purpose (appears on invoice)
- [ ] Optional indicator visible by default
- [ ] B2B badge shows when enabled
- [ ] Icon can appear in label or inside input
- [ ] Compact variant has smaller padding/font
- [ ] Disabled state prevents input
- [ ] Max length enforced (50 characters)
- [ ] Screen reader announces helper text
- [ ] Value saves correctly to database
- [ ] Appears on generated invoices
- [ ] All theme variables used (no hardcoded colors)

## Component Location

```
src/branches/ecommerce/components/checkout/PONumberInput/
├── Component.tsx    # Main component
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Checkout / B2B Forms
**Complexity:** Low-Medium (monospace font, uppercase transformation)
**Priority:** 🟡 MEDIUM (Phase 1 - B2B Feature)
**Last Updated:** February 25, 2026
