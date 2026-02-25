# AddressBook (c12)

Address management interface for user accounts. Allows adding, editing, deleting, and setting default shipping/billing addresses. Used in My Account and during checkout for address selection.

## Features

- ✅ **2-column grid layout:** Responsive to 1-col on mobile (≤640px)
- ✅ **Address cards:** Type icons (Building2, FileText, Home), hover effects
- ✅ **Primary address indicator:** Teal border + "Standaard" badge (top-right)
- ✅ **3 action buttons:** Edit, Set as Default, Delete (conditional rendering)
- ✅ **Duplicate button:** For primary address (copy & modify)
- ✅ **Dashed "Add new" card:** Plus icon, centered layout
- ✅ **Inline edit form:** Appears below grid, teal border + shadow
- ✅ **Form validation:** Required fields, postal code validation (customizable)
- ✅ **Min 1 address rule:** Prevents deletion of last address
- ✅ **Primary logic:** Always exactly ONE primary address
- ✅ **Sorted display:** Primary first, then by createdAt desc (useMemo)
- ✅ **Confirmation dialogs:** Alert before delete
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { AddressBook } from '@/branches/ecommerce/components/account/AddressBook'

<AddressBook
  addresses={[
    {
      id: 'addr-1',
      type: 'shipping',
      isPrimary: true,
      company: 'Huisartsenpraktijk De Vries',
      firstName: 'Jan',
      lastName: 'de Vries',
      street: 'Breestraat 42',
      postalCode: '1941 EK',
      city: 'Beverwijk',
      country: 'NL',
      phone: '+31 20 123 4567',
      kvk: '12345678',
      createdAt: '2026-02-20T10:00:00Z',
    },
  ]}
  onAdd={async (address) => {
    await fetch('/api/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    })
  }}
  onEdit={async (addressId, updates) => {
    await fetch(`/api/addresses/${addressId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }}
  onDelete={async (addressId) => {
    await fetch(`/api/addresses/${addressId}`, { method: 'DELETE' })
  }}
  onSetPrimary={async (addressId) => {
    await fetch(`/api/addresses/${addressId}/set-primary`, { method: 'POST' })
  }}
  validatePostalCode={(code) => /^[1-9][0-9]{3}\s?[A-Z]{2}$/i.test(code)}
/>
```

### With SWR (Recommended)

```tsx
'use client'

import { AddressBook } from '@/branches/ecommerce/components/account/AddressBook'
import useSWR from 'swr'

export function MyAddresses() {
  const { data: addresses, mutate } = useSWR('/api/addresses', fetcher)

  const handleAdd = async (address) => {
    await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address),
    })
    mutate() // Revalidate
  }

  const handleEdit = async (addressId, updates) => {
    await fetch(`/api/addresses/${addressId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    mutate() // Revalidate
  }

  const handleDelete = async (addressId) => {
    await fetch(`/api/addresses/${addressId}`, { method: 'DELETE' })
    mutate() // Revalidate
  }

  const handleSetPrimary = async (addressId) => {
    // Optimistic update
    mutate(
      addresses.map((a) => ({ ...a, isPrimary: a.id === addressId })),
      false
    )
    await fetch(`/api/addresses/${addressId}/set-primary`, { method: 'POST' })
    mutate() // Revalidate from server
  }

  return (
    <AddressBook
      addresses={addresses || []}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSetPrimary={handleSetPrimary}
      maxAddresses={10}
      validatePostalCode={(code) => /^[1-9][0-9]{3}\s?[A-Z]{2}$/i.test(code)}
    />
  )
}
```

### With PostcodeAPI Integration

```tsx
import { AddressBook } from '@/branches/ecommerce/components/account/AddressBook'

// Auto-fill city from postal code
function AddressBookWithAutocomplete() {
  const validateAndAutofillPostalCode = async (code: string) => {
    const cleanCode = code.replace(/\s/g, '')
    if (!/^[1-9][0-9]{3}[A-Z]{2}$/i.test(cleanCode)) return false

    try {
      const response = await fetch(
        `https://api.postcodeapi.nu/v3/lookup/${cleanCode}`,
        { headers: { 'X-Api-Key': process.env.NEXT_PUBLIC_POSTCODE_API_KEY } }
      )
      const data = await response.json()
      if (data.city) {
        // Auto-fill city field
        return { valid: true, city: data.city }
      }
    } catch (error) {
      console.error('Postcode lookup failed:', error)
    }

    return true
  }

  return <AddressBook {...props} validatePostalCode={validateAndAutofillPostalCode} />
}
```

## Props

| Prop                | Type                                             | Required | Default | Description                              |
| ------------------- | ------------------------------------------------ | -------- | ------- | ---------------------------------------- |
| `addresses`         | `Address[]`                                      | ✅       | -       | Array of address objects                 |
| `onAdd`             | `(address) => void \| Promise<void>`             |          | -       | Handler for adding new address           |
| `onEdit`            | `(addressId, updates) => void \| Promise<void>`  |          | -       | Handler for editing address              |
| `onDelete`          | `(addressId) => void \| Promise<void>`           |          | -       | Handler for deleting address             |
| `onSetPrimary`      | `(addressId) => void \| Promise<void>`           |          | -       | Handler for setting primary address      |
| `onDuplicate`       | `(addressId) => void`                            |          | -       | Handler for duplicating address          |
| `maxAddresses`      | `number`                                         |          | `10`    | Maximum number of addresses allowed      |
| `validatePostalCode`| `(code: string) => boolean`                      |          | -       | Custom postal code validation function   |
| `className`         | `string`                                         |          | `''`    | Additional CSS classes                   |

### Address Type

```typescript
interface Address {
  id: string
  type: 'shipping' | 'billing' | 'both'
  isPrimary: boolean
  company?: string
  firstName: string
  lastName: string
  street: string
  postalCode: string
  city: string
  country?: string
  phone?: string
  kvk?: string // KVK number for business addresses
  createdAt?: string // ISO 8601 format
}
```

## API Integration

### Payload CMS Collection

```typescript
// src/branches/shared/collections/Addresses.ts
import { CollectionConfig } from 'payload/types'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  admin: {
    useAsTitle: 'street',
    defaultColumns: ['street', 'city', 'isPrimary', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return { user: { equals: user.id } }
      return false
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'type',
      type: 'select',
      options: ['shipping', 'billing', 'both'],
      defaultValue: 'shipping',
    },
    {
      name: 'isPrimary',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'street',
      type: 'text',
      required: true,
    },
    {
      name: 'postalCode',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
      defaultValue: 'NL',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'kvk',
      type: 'text',
    },
  ],
  timestamps: true,
}
```

### API Routes

```typescript
// src/app/api/addresses/route.ts
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const payload = await getPayloadHMR({ config })
  const user = req.headers.get('x-user-id')

  const addresses = await payload.find({
    collection: 'addresses',
    where: { user: { equals: user } },
    sort: '-isPrimary,-createdAt',
  })

  return NextResponse.json(addresses.docs)
}

export async function POST(req: Request) {
  const payload = await getPayloadHMR({ config })
  const user = req.headers.get('x-user-id')
  const data = await req.json()

  // If this is set as primary, unset other primaries
  if (data.isPrimary) {
    await payload.update({
      collection: 'addresses',
      where: { user: { equals: user }, isPrimary: { equals: true } },
      data: { isPrimary: false },
    })
  }

  const address = await payload.create({
    collection: 'addresses',
    data: { ...data, user },
  })

  return NextResponse.json(address)
}

// src/app/api/addresses/[id]/route.ts
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const payload = await getPayloadHMR({ config })
  const data = await req.json()

  const address = await payload.update({
    collection: 'addresses',
    id: params.id,
    data,
  })

  return NextResponse.json(address)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const payload = await getPayloadHMR({ config })

  await payload.delete({
    collection: 'addresses',
    id: params.id,
  })

  return NextResponse.json({ success: true })
}

// src/app/api/addresses/[id]/set-primary/route.ts
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const payload = await getPayloadHMR({ config })
  const user = req.headers.get('x-user-id')

  // Unset all other primaries
  await payload.update({
    collection: 'addresses',
    where: { user: { equals: user }, isPrimary: { equals: true } },
    data: { isPrimary: false },
  })

  // Set this as primary
  await payload.update({
    collection: 'addresses',
    id: params.id,
    data: { isPrimary: true },
  })

  return NextResponse.json({ success: true })
}
```

## Accessibility

- **Container:** `role="region"`, `aria-labelledby` pointing to header
- **Cards:** `<article>` elements, `aria-label` for primary address
- **Action buttons:** Descriptive `aria-label` (e.g., "Bewerk praktijkadres")
- **Form inputs:** `id`, `htmlFor` labels, `aria-invalid`, `aria-describedby` for errors
- **Error messages:** `role="alert"` for immediate screen reader announcement
- **Icons:** `aria-hidden="true"` (decorative)
- **Keyboard:** Tab to navigate, Enter/Space to activate buttons

## Theme Variables

### Colors

| Element         | Color                | Usage                     |
| --------------- | -------------------- | ------------------------- |
| Card border     | `var(--grey)`        | Default                   |
| Card hover      | `var(--teal)`        | Hover border              |
| Primary border  | `var(--teal)`        | Primary address           |
| Primary badge   | `var(--teal)`        | Badge background          |
| Type label      | `var(--teal)`        | Icon + text color         |
| Delete button   | `var(--coral)`       | Text color                |
| Delete bg       | `var(--coral-light)` | Hover background          |

### Spacing

- **Card padding:** 18px
- **Grid gap:** 12px
- **Primary badge:** 12px (top) × 12px (right), 3px × 8px padding
- **Action buttons:** 30px height, 10px horizontal padding
- **Edit form padding:** 20px
- **Input height:** 36px

### Typography

- **Header title:** 16px, weight 800, `var(--font-display)`
- **Type label:** 11px, weight 700, uppercase, letter-spacing 0.06em
- **Address name:** 15px, weight 700
- **Address text:** 13px, line-height 1.6
- **Action buttons:** 12px, weight 600
- **Form labels:** 11px, weight 700
- **Form inputs:** 13px

## Testing Checklist

- [ ] Grid displays 2 columns (desktop), 1 column (mobile)
- [ ] Primary address shows teal border + badge
- [ ] Primary address appears first in grid
- [ ] Hover effect works on cards
- [ ] Edit button opens form below grid
- [ ] Form pre-fills data for editing
- [ ] Form validation works (required fields)
- [ ] Postal code validation works (custom function)
- [ ] Error messages appear inline (red text)
- [ ] Save button submits form
- [ ] Cancel button closes form
- [ ] "Set as Default" button works
- [ ] Only ONE primary address at a time
- [ ] Delete button shows confirmation
- [ ] Cannot delete last address (alert shown)
- [ ] Duplicate button opens form with copied data
- [ ] "Add new" card opens empty form
- [ ] Max addresses limit enforced
- [ ] Screen reader: all elements announced
- [ ] Keyboard: Tab navigation works

## Component Location

```
src/branches/ecommerce/components/account/AddressBook/
├── Component.tsx    # Main + sub-components
├── types.ts         # TypeScript interfaces
├── index.ts         # Exports
└── README.md        # This file
```

---

**Category:** E-commerce / Account / Checkout
**Complexity:** High (CRUD operations, validation, primary logic)
**Priority:** 🟢 HIGH (essential for checkout and account management)
**Last Updated:** February 25, 2026
