# CompanyInfoForm (qr03)

Displays verified company information for B2B users with read-only fields and optional editable contact person details for quote requests.

## Features

- ✅ **Auto-filled company data:** Name, KVK, BTW, address from user account
- ✅ **Read-only verified fields:** Grey background indicates non-editable
- ✅ **"Geverifieerd" badge:** Shield-check icon for trust signals
- ✅ **Optional contact fields:** Editable name, phone, email for this quote
- ✅ **Helper text:** Explains why company data is locked
- ✅ **2-column responsive grid:** 1-column on mobile (<640px)
- ✅ **Building icon:** Visual hierarchy in header
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage (Read-Only)

```tsx
import { CompanyInfoForm } from '@/branches/ecommerce/components/quote/CompanyInfoForm'

<CompanyInfoForm
  companyInfo={{
    name: 'Medisch Centrum Amsterdam',
    kvk: '12345678',
    btw: 'NL123456789B01',
    address: 'Weesperplein 4, 1018 XA Amsterdam',
    verified: true,
  }}
/>
```

### With Contact Person Fields

```tsx
const [contactPerson, setContactPerson] = useState({
  name: 'Dr. J. van der Berg',
  phone: '020 123 4567',
  email: 'j.vandenberg@mca.nl',
})

<CompanyInfoForm
  companyInfo={{
    name: 'Medisch Centrum Amsterdam',
    kvk: '12345678',
    btw: 'NL123456789B01',
    address: 'Weesperplein 4, 1018 XA Amsterdam',
    verified: true,
    contactPerson,
  }}
  showContactFields={true}
  onContactChange={(field, value) => {
    setContactPerson({ ...contactPerson, [field]: value })
  }}
/>
```

### Custom Helper Text

```tsx
<CompanyInfoForm
  companyInfo={{...}}
  helperText="Bedrijfsgegevens worden automatisch gesynchroniseerd vanuit uw KVK-registratie."
/>
```

### Unverified Company

```tsx
<CompanyInfoForm
  companyInfo={{
    name: 'Startup BV',
    kvk: '87654321',
    btw: 'NL987654321B01',
    address: 'Keizersgracht 100, 1015 CS Amsterdam',
    verified: false, // No badge shown
  }}
/>
```

## Props

| Prop                | Type                                  | Required | Default                                                | Description                            |
| ------------------- | ------------------------------------- | -------- | ------------------------------------------------------ | -------------------------------------- |
| `companyInfo`       | `CompanyInfo`                         | ✅       | -                                                      | Company data object                    |
| `showContactFields` | `boolean`                             | ❌       | `false`                                                | Show editable contact person fields    |
| `onContactChange`   | `(field, value) => void`              | ❌       | -                                                      | Handler when contact field changes     |
| `helperText`        | `string`                              | ❌       | `"Deze gegevens zijn gekoppeld aan uw bedrijfsaccount..."` | Helper text below fields           |
| `showEditButton`    | `boolean`                             | ❌       | `false`                                                | Show edit button (future enhancement)  |
| `className`         | `string`                              | ❌       | `''`                                                   | Additional CSS classes                 |

## CompanyInfo Interface

```typescript
interface CompanyInfo {
  name: string // Bedrijfsnaam
  kvk: string // KVK-nummer (8 digits)
  btw: string // BTW-nummer (NL123456789B01)
  address: string // Full address
  verified: boolean // Show verified badge
  contactPerson?: {
    name: string // Contactpersoon naam
    phone: string // Telefoonnummer
    email: string // E-mailadres
  }
}
```

## Visual Design

### Layout Structure
```
┌─────────────────────────────────────────┐
│ [🏢] Bedrijfsgegevens         [✓ Ver]  │ ← Header (flex space-between)
├─────────────────────────────────────────┤
│                                         │
│ Bedrijfsnaam                            │ ← Full width (read-only)
│ [Medisch Centrum Amsterdam         ]   │
│                                         │
│ KVK-nummer           BTW-nummer         │ ← 2-column grid (read-only)
│ [12345678  ]         [NL123456789B01]  │
│                                         │
│ Adres                                   │ ← Full width (read-only)
│ [Weesperplein 4, 1018 XA Amsterdam ]   │
│                                         │
│ Contactpersoon       Telefoonnummer     │ ← 2-column grid (editable)
│ [Dr. J. van der Berg] [020 123 4567]   │
│                                         │
│ E-mailadres contactpersoon              │ ← Full width (editable)
│ [j.vandenberg@mca.nl               ]   │
│                                         │
│ ℹ Deze gegevens zijn gekoppeld...      │ ← Helper text
└─────────────────────────────────────────┘
```

### Header
- **Title:** 16px, 700 weight, navy, Building-2 icon (20px, teal)
- **Badge:** 10px uppercase, teal bg (8% opacity), teal border, ShieldCheck icon (12px)
- **Layout:** flex, space-between, 12px gap

### Read-Only Fields
- **Background:** `var(--grey-lighter)` (#F5F7FA)
- **Cursor:** `not-allowed`
- **Tab index:** `-1` (skip in keyboard navigation)
- **Border:** 1.5px grey

### Editable Fields
- **Background:** `var(--white)` (#FAFBFC)
- **Cursor:** `text`
- **Hover:** Grey-mid border
- **Focus:** Teal border + teal glow (3px box-shadow)

### Spacing
- Card padding: 24px (20px mobile)
- Header margin-bottom: 20px
- Field gap: 16px vertical
- Row gap: 12px horizontal
- Label margin-bottom: 6px

## Responsive Breakpoints

### Desktop (Default)
- 2-column grid for KVK + BTW
- 2-column grid for Contact + Phone
- Header: horizontal flex layout

### Mobile (≤640px)
- 1-column grid (all fields stacked)
- Header: vertical flex layout (stacked)
- Smaller padding: 20px

## Theme Variables

| Element              | Variable / Color       | Usage                          |
| -------------------- | ---------------------- | ------------------------------ |
| Card background      | `var(--white)`         | #FAFBFC                        |
| Card border          | `var(--grey)`          | #E8ECF1                        |
| Title text           | `var(--navy)`          | #0A1628                        |
| Title icon           | `var(--teal)`          | #00897B                        |
| Badge bg             | `rgba(0,137,123,0.08)` | Teal 8% opacity                |
| Badge border         | `var(--teal)`          | #00897B                        |
| Badge text           | `var(--teal)`          | #00897B                        |
| Label text           | `var(--grey-dark)`     | #64748B                        |
| Input text           | `var(--navy)`          | #0A1628                        |
| Read-only input bg   | `var(--grey-lighter)`  | #F5F7FA                        |
| Editable input bg    | `var(--white)`         | #FAFBFC                        |
| Helper text          | `var(--grey-mid)`      | #94A3B8                        |

## Accessibility

### Semantic HTML
- Container: `<div>` (could add `role="region"` with `aria-labelledby`)
- Title: `<h3>` for proper heading hierarchy
- Badge: `<span>` (could add `role="status"`)
- Inputs: Proper `<label>` + `<input>` association

### ARIA Attributes
- `tabindex="-1"` on read-only inputs (skip in keyboard navigation)
- `readOnly` attribute on locked fields
- `aria-readonly="true"` (implicit via `readOnly`)
- `aria-describedby` to connect helper text (optional enhancement)

### Keyboard Navigation
- Tab: Skips read-only fields (tabIndex={-1})
- Tab: Focuses editable fields only (contact person)
- Focus states: Teal border + teal glow on editable inputs

### Color Contrast
- Title (#0A1628) on white (#FAFBFC): 14.2:1 (WCAG AAA ✓)
- Badge text (#00897B) on badge bg: 4.8:1 (WCAG AA ✓)
- Label (#64748B) on white: 5.1:1 (WCAG AA ✓)
- Input text (#0A1628) on grey-lighter (#F5F7FA): 13.8:1 (WCAG AAA ✓)

## State Management

### Read-Only Company Data
```typescript
// Fetched from authenticated user's company
const user = await getAuthenticatedUser()
const company = await getCompanyById(user.companyId)

<CompanyInfoForm companyInfo={company} />
```

### Editable Contact Person
```typescript
const [contactPerson, setContactPerson] = useState({
  name: '',
  phone: '',
  email: '',
})

const handleContactChange = (field: string, value: string) => {
  setContactPerson((prev) => ({
    ...prev,
    [field]: value,
  }))
}

<CompanyInfoForm
  companyInfo={{
    ...company,
    contactPerson,
  }}
  showContactFields={true}
  onContactChange={handleContactChange}
/>
```

### Form Validation
```typescript
function validateContactPerson(contact: CompanyInfo['contactPerson']): string[] {
  const errors: string[] = []

  if (!contact) return errors

  if (!contact.name || contact.name.trim() === '') {
    errors.push('Naam contactpersoon is verplicht')
  }

  if (!contact.phone || !/^0\d{9}$/.test(contact.phone.replace(/\s/g, ''))) {
    errors.push('Ongeldig telefoonnummer (bijv. 020 123 4567)')
  }

  if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    errors.push('Ongeldig e-mailadres')
  }

  return errors
}
```

### KVK/BTW Validation
```typescript
function validateKVK(kvk: string): boolean {
  // Dutch Chamber of Commerce number: exactly 8 digits
  return /^\d{8}$/.test(kvk)
}

function validateBTW(btw: string): boolean {
  // Dutch VAT number: NL + 9 digits + B + 2 digits
  return /^NL\d{9}B\d{2}$/.test(btw)
}
```

## Integration with Payload CMS

### Company Collection
```typescript
// collections/Companies.ts
export const Companies: CollectionConfig = {
  slug: 'companies',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'kvk', type: 'text', required: true, validate: validateKVK },
    { name: 'btw', type: 'text', required: true, validate: validateBTW },
    { name: 'address', type: 'text', required: true },
    { name: 'verified', type: 'checkbox', defaultValue: false },
  ],
}
```

### User Collection (Link to Company)
```typescript
// collections/Users.ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    // ... other user fields
  ],
}
```

### Quote Request Page
```typescript
// app/(frontend)/offerte/page.tsx
import { CompanyInfoForm } from '@/branches/ecommerce/components/quote/CompanyInfoForm'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export default async function OffertePage() {
  const payload = await getPayloadHMR({ config })
  const user = await payload.auth()
  const company = await payload.findByID({
    collection: 'companies',
    id: user.company,
  })

  return (
    <CompanyInfoForm
      companyInfo={{
        name: company.name,
        kvk: company.kvk,
        btw: company.btw,
        address: company.address,
        verified: company.verified,
      }}
      showContactFields={true}
    />
  )
}
```

## When to Use

### ✅ Use this component when:
- B2B user is requesting a quote (offerte)
- Placing an order that requires invoice details
- Displaying company profile information
- Company data is verified and should not be changed
- You need to show trust signals (verified badge)

### ❌ Do NOT use when:
- User is editing their company profile (use editable form)
- During registration/onboarding (use editable fields)
- For B2C users (they don't have company data)
- Company data is unverified AND you want them to edit it

## Related Components

- **QR01: OfferteHero** - Header above this form
- **QR02: ProductSelectionTable** - Product selection above this form
- **QR04: ProjectInfoForm** - Project details (next step)
- **QR05: FileUploadDropzone** - File upload (after forms)
- **EC14: AddressForm** - Editable address fields
- **QO05: ProTipBanner** - Info banners pattern

## Testing Checklist

- ✓ Read-only fields cannot be edited
- ✓ Read-only fields have grey background
- ✓ Read-only fields skipped in Tab navigation
- ✓ Verified badge appears when `verified === true`
- ✓ Verified badge hidden when `verified === false`
- ✓ Contact fields editable when `showContactFields === true`
- ✓ Contact fields hidden when `showContactFields === false`
- ✓ onContactChange handler fires on input change
- ✓ Helper text displays correctly
- ✓ Custom helper text works
- ✓ Responsive: 2-col grid → 1-col at 640px
- ✓ Responsive: header stacks on mobile
- ✓ Focus states visible on editable inputs
- ✓ Icons render correctly (Building2, ShieldCheck, Info)

## Common Pitfalls

- ❌ Allowing edits to verified company data (security risk!)
- ❌ Forgetting grey background on read-only fields (confusing UX)
- ❌ Not validating KVK/BTW format on backend
- ❌ Showing verified badge for unverified companies (trust issue!)
- ❌ Missing `tabindex="-1"` on read-only inputs (keyboard trap)
- ❌ Not providing helper text explaining locked fields

## Component Location

```
src/branches/ecommerce/components/quote/CompanyInfoForm/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / B2B / Quote Request / Forms
**Complexity:** Medium (read-only vs editable states, validation, responsive grid)
**Priority:** 🟢 HIGH
**Last Updated:** February 25, 2026
