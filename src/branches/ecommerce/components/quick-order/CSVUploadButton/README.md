# CSVUploadButton (qo04)

File upload button for CSV files with loading, success, and error states. Hidden file input with visible styled label for accessibility.

## Features

- ✅ **Hidden file input:** Accessible file input (sr-only)
- ✅ **Styled button label:** Upload icon + "CSV uploaden" text
- ✅ **4 states:** Idle, Loading (spinner), Success (green), Error (coral)
- ✅ **File validation:** Type (.csv) and size (default 5MB max)
- ✅ **Feedback messages:** Success/error messages below button
- ✅ **Auto-reset:** Success state resets after 3 seconds
- ✅ **Hover effects:** Teal border + light teal bg + translateY(-1px)
- ✅ **Focus states:** Teal glow ring (3px box-shadow)
- ✅ **Disabled state:** Opacity 0.5, not allowed cursor
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { CSVUploadButton } from '@/branches/ecommerce/components/quick-order/CSVUploadButton'

<CSVUploadButton
  onFileSelect={async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    await fetch('/api/upload-csv', {
      method: 'POST',
      body: formData,
    })
  }}
/>
```

### With Error Handling

```tsx
<CSVUploadButton
  onFileSelect={async (file) => {
    const data = await uploadCSV(file)
    console.log('Uploaded:', data)
  }}
  onUploadError={(error) => {
    toast.error(`Upload failed: ${error.message}`)
  }}
  onUploadComplete={(data) => {
    toast.success(`${data.file.name} uploaded successfully!`)
  }}
/>
```

### Custom Max Size

```tsx
<CSVUploadButton
  maxSize={10 * 1024 * 1024} // 10MB
  onFileSelect={handleUpload}
/>
```

### Custom Label

```tsx
<CSVUploadButton
  label="Import CSV"
  onFileSelect={handleUpload}
/>
```

### Disabled State

```tsx
<CSVUploadButton
  disabled={isProcessing}
  onFileSelect={handleUpload}
/>
```

## Props

| Prop               | Type                           | Required | Default              | Description                       |
| ------------------ | ------------------------------ | -------- | -------------------- | --------------------------------- |
| `label`            | `string`                       |          | `'CSV uploaden'`     | Button label text                 |
| `accept`           | `string`                       |          | `'.csv,text/csv'`    | Accepted file types               |
| `maxSize`          | `number`                       |          | `5242880` (5MB)      | Max file size in bytes            |
| `onFileSelect`     | `(file: File) => void \| Promise<void>` |  | -  | Handler when file selected        |
| `onUploadComplete` | `(data: any) => void`          |          | -                    | Handler when upload succeeds      |
| `onUploadError`    | `(error: Error) => void`       |          | -                    | Handler when upload fails         |
| `disabled`         | `boolean`                      |          | `false`              | Disable button                    |
| `className`        | `string`                       |          | `''`                 | Additional CSS classes            |

## States

### Idle (Default)
- Upload icon
- "CSV uploaden" label
- White bg, grey border
- Hover: teal border + light teal bg

### Loading
- Spinning Loader icon
- "Uploaden..." label
- Opacity 0.7
- Pointer events disabled

### Success
- Green CheckCircle icon
- "Geüpload!" label
- Green border + light green background
- Auto-resets after 3 seconds

### Error
- Red XCircle icon
- "Opnieuw proberen" label
- Coral border + light coral background

## File Validation

### Type Validation
- Checks file extension: `.csv`
- Checks MIME type: `text/csv`
- Error message: "Alleen CSV-bestanden zijn toegestaan"

### Size Validation
- Default max: 5MB (5,242,880 bytes)
- Customizable via `maxSize` prop
- Error message: "Bestand te groot. Maximum: XMB"

## Feedback Messages

Success message format:
```
✓ [filename.csv] succesvol geüpload
```

Error message examples:
```
✗ Bestand te groot. Maximum: 5MB
✗ Alleen CSV-bestanden zijn toegestaan
✗ [Custom error message from API]
```

## Theme Variables

| Element           | Color/Style                    | Usage                    |
| ----------------- | ------------------------------ | ------------------------ |
| Button bg         | `white`                        | Default background       |
| Button border     | `var(--grey)`                  | Default border (1.5px)   |
| Button text       | `var(--navy)`                  | Default text color       |
| Hover bg          | `rgba(0, 137, 123, 0.05)`      | Light teal background    |
| Hover border      | `var(--teal)`                  | Teal border              |
| Focus ring        | `var(--teal-glow)`             | 3px box-shadow           |
| Success bg        | `var(--green-light)`           | Light green background   |
| Success border    | `var(--green)`                 | Green border             |
| Success text      | `var(--green)`                 | Green text               |
| Error bg          | `var(--coral-light)`           | Light coral background   |
| Error border      | `var(--coral)`                 | Coral border             |
| Error text        | `var(--coral)`                 | Coral text               |

## Component Location

```
src/branches/ecommerce/components/quick-order/CSVUploadButton/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / B2B / Quick Order
**Complexity:** Medium (file handling, state management)
**Priority:** 🟢 HIGH
**Last Updated:** February 25, 2026
