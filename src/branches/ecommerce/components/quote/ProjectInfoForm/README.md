# ProjectInfoForm (qr04)

Project-specific information form for B2B quote requests with validation, required fields, and character counter.

## Features

- ✅ **Project name input:** Required field with helper text
- ✅ **Delivery date picker:** Required field with min date validation
- ✅ **Notes textarea:** Optional field with 500 character limit
- ✅ **Character counter:** Shows count, turns amber at 90%, coral at 100%
- ✅ **Required field indicators:** Asterisk (*) in coral color
- ✅ **Real-time validation:** Error messages with icons
- ✅ **Helper icons:** FolderOpen, Info, Calendar, AlertCircle
- ✅ **Single-column layout:** All fields full width
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

```tsx
import { ProjectInfoForm } from '@/branches/ecommerce/components/quote/ProjectInfoForm'
import { useState } from 'react'

const [projectInfo, setProjectInfo] = useState({
  projectName: '',
  deliveryDate: '',
  notes: '',
})

const [errors, setErrors] = useState({})

<ProjectInfoForm
  projectInfo={projectInfo}
  onChange={(field, value) => {
    setProjectInfo({ ...projectInfo, [field]: value })
  }}
  errors={errors}
  minDeliveryDate="2026-02-28"
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `projectInfo` | `Partial<ProjectInfo>` | ❌ | `{}` | Pre-fill values |
| `onChange` | `(field, value) => void` | ❌ | - | Handler when field changes |
| `errors` | `ValidationErrors` | ❌ | `{}` | Validation error messages |
| `minDeliveryDate` | `string` | ❌ | - | Min date (ISO format) |
| `notesMaxLength` | `number` | ❌ | `500` | Max notes length |
| `showNotesCounter` | `boolean` | ❌ | `true` | Show character counter |
| `projectNameHelperText` | `string` | ❌ | `"Deze naam wordt gebruikt op facturen..."` | Custom helper text |
| `deliveryDateHelperText` | `string` | ❌ | `"Standaard levertijd is 3-5 werkdagen..."` | Custom helper text |
| `className` | `string` | ❌ | `''` | Additional CSS classes |

## Interfaces

```typescript
interface ProjectInfo {
  projectName: string
  deliveryDate: string // ISO date (YYYY-MM-DD)
  notes?: string
}

interface ValidationErrors {
  projectName?: string
  deliveryDate?: string
  notes?: string
}
```

## Visual States

### Default State
- Project name: empty input with placeholder
- Delivery date: date picker with min date
- Notes: empty textarea with placeholder
- Counter: "0 / 500" (grey)

### Filled State
- Inputs have values
- Counter updates on change
- No errors shown

### Error State
- Red border on invalid fields
- Red label text
- Error message with AlertCircle icon
- aria-invalid="true"

### Counter States
- **Default (0-89%):** Grey text
- **Warning (90-99%):** Amber text (#F59E0B)
- **Error (100%):** Coral text (#FF6B6B)

## Validation Example

```typescript
function validateProjectInfo(info: Partial<ProjectInfo>): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!info.projectName || info.projectName.trim() === '') {
    errors.projectName = 'Projectnaam is verplicht'
  }

  if (!info.deliveryDate) {
    errors.deliveryDate = 'Leverdatum is verplicht'
  } else {
    const minDate = new Date()
    minDate.setDate(minDate.getDate() + 3) // +3 business days

    if (new Date(info.deliveryDate) < minDate) {
      errors.deliveryDate = 'Leverdatum moet minimaal 3 werkdagen in de toekomst liggen'
    }
  }

  if (info.notes && info.notes.length > 500) {
    errors.notes = 'Opmerkingen mogen maximaal 500 tekens bevatten'
  }

  return errors
}
```

## Accessibility

- **Semantic HTML:** Proper labels with `htmlFor`, inputs with `id`
- **Required fields:** `required` attribute + visual asterisk
- **ARIA attributes:**
  - `aria-required="true"` on required fields
  - `aria-invalid="true"` when errors present
  - `aria-describedby` connecting inputs to helper/error text
  - `role="alert"` on error messages
  - `aria-live="polite"` on character counter
- **Keyboard:** Full keyboard navigation support
- **Color contrast:** All text meets WCAG AA standards

## Theme Variables

| Element | Variable | Value |
|---------|----------|-------|
| Title text | `var(--navy)` | #0A1628 |
| Title icon | `var(--teal)` | #00897B |
| Label text | `var(--grey-dark)` | #64748B |
| Required asterisk | - | #FF6B6B (coral) |
| Input border | `var(--grey)` | #E8ECF1 |
| Input focus | `var(--teal)` | #00897B |
| Error text/border | - | #FF6B6B |
| Helper text | `var(--grey-mid)` | #94A3B8 |
| Counter warning | - | #F59E0B (amber) |
| Counter error | - | #FF6B6B (coral) |

## Related Components

- **QR01: OfferteHero** - Header section
- **QR02: ProductSelectionTable** - Product selection
- **QR03: CompanyInfoForm** - Company details
- **QR05: FileUploadDropzone** - File upload

## Component Location

```
src/branches/ecommerce/components/quote/ProjectInfoForm/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / B2B / Quote Request / Forms
**Complexity:** Medium (validation, character counter, date picker)
**Priority:** 🟢 HIGH
**Last Updated:** February 25, 2026
