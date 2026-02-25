# QuickOrderHeader (qo01)

B2B Quick Order page header with title, description, and action buttons (CSV upload, bestellijst access, export functionality).

## Features

- ✅ **Title + icon:** 28px heading with Zap icon (28×28px teal)
- ✅ **Description:** 14px explanatory text below title
- ✅ **Action buttons:** 1-3 buttons with two variants (secondary outline, teal filled)
- ✅ **Dynamic icons:** Lucide icon support via string names
- ✅ **Default actions:** "CSV uploaden" + "Gebruik bestellijst"
- ✅ **Responsive layout:** Stacks vertically on mobile (≤768px)
- ✅ **Hover effects:** translateY(-1px), shadow, background color changes
- ✅ **Focus states:** Teal glow ring (3px box-shadow)
- ✅ **Accessible:** Semantic HTML, ARIA labels, keyboard navigation
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { QuickOrderHeader } from '@/branches/ecommerce/components/quick-order/QuickOrderHeader'

<QuickOrderHeader
  title="Snelbestellen"
  description="Voer meerdere artikelen tegelijk in voor een snelle bestelling"
  actions={[
    {
      id: 'csv-upload',
      label: 'CSV uploaden',
      icon: 'upload',
      variant: 'secondary',
      onClick: handleCSVUpload,
    },
    {
      id: 'use-bestellijst',
      label: 'Gebruik bestellijst',
      icon: 'list',
      variant: 'teal',
      onClick: handleUseBestellijst,
    },
  ]}
/>
```

### Single Action (Minimal)

```tsx
<QuickOrderHeader
  actions={[
    {
      id: 'use-bestellijst',
      label: 'Gebruik bestellijst',
      icon: 'list',
      variant: 'teal',
      onClick: () => router.push('/account/bestellijsten'),
    },
  ]}
/>
```

### Three Actions

```tsx
<QuickOrderHeader
  actions={[
    {
      id: 'csv-upload',
      label: 'CSV uploaden',
      icon: 'upload',
      variant: 'secondary',
      onClick: handleCSVUpload,
    },
    {
      id: 'export-excel',
      label: 'Export Excel',
      icon: 'download',
      variant: 'secondary',
      onClick: handleExportExcel,
    },
    {
      id: 'use-bestellijst',
      label: 'Gebruik bestellijst',
      icon: 'list',
      variant: 'teal',
      onClick: handleUseBestellijst,
    },
  ]}
/>
```

### Custom Title and Icon

```tsx
<QuickOrderHeader
  title="Bulk Order"
  description="Enter multiple SKUs to place a quick order"
  icon="zap"
  actions={[...]}
/>
```

### With Async onClick Handlers

```tsx
const handleCSVUpload = async () => {
  const file = await selectFile()
  if (file) {
    await uploadCSV(file)
    toast.success('CSV uploaded successfully!')
  }
}

<QuickOrderHeader
  actions={[
    {
      id: 'csv-upload',
      label: 'CSV uploaden',
      icon: 'upload',
      variant: 'secondary',
      onClick: handleCSVUpload,
    },
  ]}
/>
```

## Props

| Prop          | Type                          | Required | Default                                              | Description                    |
| ------------- | ----------------------------- | -------- | ---------------------------------------------------- | ------------------------------ |
| `title`       | `string`                      |          | `'Snelbestellen'`                                    | Header title text              |
| `description` | `string`                      |          | `'Voer meerdere artikelen tegelijk in...'`           | Description text below title   |
| `icon`        | `string`                      |          | `'zap'`                                              | Lucide icon name for title     |
| `actions`     | `QuickOrderHeaderAction[]`    | ✅       | -                                                    | Array of action buttons        |
| `className`   | `string`                      |          | `''`                                                 | Additional CSS classes         |

### QuickOrderHeaderAction Type

```typescript
interface QuickOrderHeaderAction {
  id: string
  label: string
  icon: string // Lucide icon name (e.g., "upload", "list", "download")
  variant: 'secondary' | 'teal'
  onClick?: () => void | Promise<void>
  href?: string // Future support for link buttons
}
```

### Common Action Configurations

**CSV Upload:**
```typescript
{
  id: 'csv-upload',
  label: 'CSV uploaden',
  icon: 'upload',
  variant: 'secondary',
  onClick: handleCSVUpload,
}
```

**Use Bestellijst:**
```typescript
{
  id: 'use-bestellijst',
  label: 'Gebruik bestellijst',
  icon: 'list',
  variant: 'teal',
  onClick: () => router.push('/account/bestellijsten'),
}
```

**Export Excel:**
```typescript
{
  id: 'export-excel',
  label: 'Export Excel',
  icon: 'download',
  variant: 'secondary',
  onClick: handleExportExcel,
}
```

**Save Template:**
```typescript
{
  id: 'save-template',
  label: 'Opslaan als template',
  icon: 'save',
  variant: 'secondary',
  onClick: handleSaveTemplate,
}
```

## Icons

### Header Icon (Default: "zap")
- Size: 28×28px
- Color: `var(--teal)`
- Alternative icons: `lightning`, `bolt`, `rocket`, `gauge`

### Action Button Icons
- Size: 18×18px
- Color: Inherited from button variant
- Common icons:
  - `upload` - CSV upload
  - `download` - Export Excel
  - `list` - Bestellijst
  - `file-text` - Templates
  - `save` - Save order

## Accessibility

- **Container:** `<header role="banner">`
- **Title:** `<h1>` (or appropriate heading level)
- **Description:** `<p>`
- **Buttons:** `<button type="button">` with `aria-label`
- **Icons:** `aria-hidden="true"` (decorative)
- **Focus:** Teal glow ring on focus-visible
- **Keyboard:** Tab navigation through all buttons
- **Color contrast:** All text meets WCAG AA standards

## Theme Variables

### Colors

| Element              | Color                          | Usage                          |
| -------------------- | ------------------------------ | ------------------------------ |
| Background           | `white`                        | Card background                |
| Border               | `var(--grey)`                  | Card border (1px)              |
| Header icon          | `var(--teal)`                  | Zap icon color                 |
| Title                | `var(--navy)`                  | Heading text                   |
| Description          | `var(--grey-dark)`             | Subtext                        |
| Secondary btn bg     | `white`                        | Default background             |
| Secondary btn border | `var(--grey)`                  | Default border (1.5px)         |
| Secondary btn hover  | `rgba(0, 137, 123, 0.04)`      | Light teal background          |
| Teal btn bg          | `var(--teal-glow)`             | Light teal background          |
| Teal btn text        | `var(--teal)`                  | Teal text color                |
| Teal btn hover bg    | `rgba(0, 137, 123, 0.18)`      | Darker teal background         |
| Focus ring           | `var(--teal-glow)`             | 3px box-shadow                 |

### Spacing

- **Container padding (desktop):** 32px (top/bottom), 40px (left/right)
- **Container padding (mobile):** 24px (all sides)
- **Title-to-description gap:** 8px
- **Icon-to-title gap:** 12px
- **Button gap:** 12px
- **Button padding:** 12px (vertical), 20px (horizontal)
- **Icon-to-label gap (buttons):** 8px
- **Mobile content-to-actions gap:** 24px

### Typography

- **Title (desktop):** 28px, weight 800, `var(--font-display)`
- **Title (mobile):** 24px, weight 800, `var(--font-display)`
- **Description:** 14px, weight 400, `var(--font-primary)`
- **Buttons:** 14px, weight 600, `var(--font-primary)`

## Button Variants

### Secondary (Outline)
- White background
- Grey border (1.5px)
- Navy text
- Hover: Teal border + light teal background + translateY(-1px) + shadow
- Focus: Teal glow ring (3px)
- Active: Reset translateY(0)

### Teal (Filled)
- Light teal background (`var(--teal-glow)`)
- Transparent border (1.5px)
- Teal text
- Hover: Darker teal background + translateY(-1px) + shadow
- Focus: Teal glow ring (3px)
- Active: Reset translateY(0)

## Responsive Behavior

### Desktop (>768px)
- Horizontal layout (flex-direction: row)
- Title/description on left, actions on right
- Buttons in horizontal row
- 28px title size

### Mobile (≤768px)
- Vertical layout (flex-direction: column)
- Content section stacks above actions
- Buttons stack vertically (full width)
- Buttons centered with `justify-content: center`
- 24px title size
- 24px padding (all sides)

## Integration Example

### Full Quick Order Page

```tsx
'use client'

import { QuickOrderHeader } from '@/branches/ecommerce/components/quick-order/QuickOrderHeader'
import { QuickOrderTable } from '@/branches/ecommerce/components/quick-order/QuickOrderTable'
import { ProTipBanner } from '@/branches/ecommerce/components/quick-order/ProTipBanner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QuickOrderPage() {
  const router = useRouter()
  const [showCSVUpload, setShowCSVUpload] = useState(false)

  const headerActions = [
    {
      id: 'csv-upload',
      label: 'CSV uploaden',
      icon: 'upload',
      variant: 'secondary' as const,
      onClick: () => setShowCSVUpload(true),
    },
    {
      id: 'use-bestellijst',
      label: 'Gebruik bestellijst',
      icon: 'list',
      variant: 'teal' as const,
      onClick: () => router.push('/account/bestellijsten'),
    },
  ]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
      <QuickOrderHeader actions={headerActions} />
      <div style={{ marginTop: '24px' }}>
        <QuickOrderTable {...tableProps} />
      </div>
      <div style={{ marginTop: '24px' }}>
        <ProTipBanner tip="Gebruik Ctrl+Enter om direct toe te voegen aan je winkelwagen" />
      </div>
    </div>
  )
}
```

## Testing Checklist

- [ ] Header renders with correct title and description
- [ ] Icon displays correctly (28×28px teal Zap)
- [ ] Action buttons render with correct labels and icons
- [ ] Clicking buttons triggers onClick handlers
- [ ] Async onClick handlers work correctly
- [ ] Secondary variant buttons styled correctly (white bg, grey border)
- [ ] Teal variant buttons styled correctly (teal-glow bg, teal text)
- [ ] Hover effects work (translateY, shadow, background change)
- [ ] Focus states visible when tabbing (teal glow ring)
- [ ] Active states work (reset translateY)
- [ ] Responsive layout stacks correctly on mobile (≤768px)
- [ ] Mobile buttons centered and full-width
- [ ] Title size reduces to 24px on mobile
- [ ] Padding adjusts to 24px on mobile
- [ ] Works with 1 action button
- [ ] Works with 2 action buttons (default)
- [ ] Works with 3 action buttons
- [ ] Custom title and description work
- [ ] Custom header icon works
- [ ] Screen reader announces buttons correctly

## Component Location

```
src/branches/ecommerce/components/quick-order/QuickOrderHeader/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / B2B / Quick Order
**Complexity:** Low (simple header with action buttons)
**Priority:** 🟢 HIGH (essential for B2B quick order flow)
**Last Updated:** February 25, 2026
