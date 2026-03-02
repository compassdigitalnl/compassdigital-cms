# Personalized Products Components (PP01-PP08)

**Last Updated:** 1 Maart 2026
**Status:** ✅ PP02-PP08 Complete (7/8 implemented)

---

## 📦 Components Overview

### ✅ COMPLETE (7/8)

- ✅ **PP01: PersonalizationTextInput** - Text input with character counter (exists elsewhere)
- ✅ **PP02: PersonalizationFontSelector** - Font/style dropdown with previews
- ✅ **PP03: PersonalizationColorPicker** - Color swatches with hex input
- ✅ **PP04: PersonalizationImageUpload** - Drag-drop file upload with preview
- ✅ **PP05: PersonalizationLivePreview** - Visual product preview with customization
- ✅ **PP06: PersonalizationSummaryCard** - Summary of all personalization choices
- ✅ **PP07: PersonalizationCharacterLimit** - Visual character counter with warning
- ✅ **PP08: PersonalizationProductionTime** - Time indicator with delivery date calculator

---

## 🎨 Component Details

### PP02: PersonalizationFontSelector

**Purpose:** Font/style selector with visual previews for engraving/printing

**Features:**
- Grid of font options with previews
- Shows sample text in each font (default: "Voorbeeld")
- Radio-style selection (one at a time)
- Optional price modifiers per font
- Responsive grid (2 cols mobile, 3 cols desktop)
- Default fonts: Arial, Times New Roman, Courier New, Georgia, Verdana, Comic Sans MS

**Props:**
```typescript
interface PersonalizationFontSelectorProps {
  option: PersonalizationOption
  value: string
  onChange: (value: string) => void
  availableFonts?: string[]  // Override default fonts
  className?: string
}
```

**Usage:**
```tsx
<PersonalizationFontSelector
  option={{
    fieldName: 'Lettertype',
    fieldType: 'font',
    required: false,
    priceModifier: 2.50,
  }}
  value={selectedFont}
  onChange={setSelectedFont}
  availableFonts={['Arial', 'Helvetica', 'Times New Roman']}
/>
```

---

### PP03: PersonalizationColorPicker

**Purpose:** Color swatches or picker for text color, thread color, etc.

**Features:**
- Grid of preset color swatches (12 default colors)
- Hex input for custom colors (#RRGGBB)
- Visual checkmark on selected color
- Auto-validates hex format
- Color preview for custom colors
- Light/dark color handling for checkmark visibility

**Default Colors:**
- Zwart (#000000), Wit (#FFFFFF), Rood (#FF0000), Groen (#00FF00)
- Blauw (#0000FF), Geel (#FFFF00), Oranje (#FFA500), Paars (#800080)
- Roze (#FFC0CB), Bruin (#A52A2A), Grijs (#808080), Goud (#FFD700)

**Props:**
```typescript
interface PersonalizationColorPickerProps {
  option: PersonalizationOption
  value: string
  onChange: (value: string) => void
  presetColors?: string[]  // Override default colors
  className?: string
}
```

**Usage:**
```tsx
<PersonalizationColorPicker
  option={{
    fieldName: 'Kleur',
    fieldType: 'color',
    required: true,
  }}
  value={selectedColor}
  onChange={setSelectedColor}
  presetColors={['#FF0000', '#00FF00', '#0000FF']}
/>
```

---

### PP04: PersonalizationImageUpload

**Purpose:** Drag-drop file upload with image preview & validation

**Features:**
- Drag & drop zone with hover state
- File input fallback (click to select)
- Image preview with thumbnail
- File type validation (JPEG, PNG, WEBP)
- File size validation (default: 5 MB)
- Remove uploaded image
- Guidelines display (min resolution, formats)

**Props:**
```typescript
interface PersonalizationImageUploadProps {
  option: PersonalizationOption
  value: File | null
  onChange: (file: File | null) => void
  maxSize?: number  // Bytes, default: 5 * 1024 * 1024
  acceptedFormats?: string[]  // MIME types
  className?: string
}
```

**Usage:**
```tsx
<PersonalizationImageUpload
  option={{
    fieldName: 'Upload afbeelding',
    fieldType: 'image',
    required: true,
    priceModifier: 5.00,
  }}
  value={uploadedImage}
  onChange={setUploadedImage}
  maxSize={10 * 1024 * 1024}  // 10 MB
  acceptedFormats={['image/jpeg', 'image/png']}
/>
```

---

### PP05: PersonalizationLivePreview

**Purpose:** Visual product preview with customization updates in real-time

**Features:**
- Product image display
- Text overlay for personalization
- Zoom controls (50% - 200%)
- Rotate control (90° increments)
- Updates in real-time as user changes personalization
- Responsive layout

**Props:**
```typescript
interface PersonalizationLivePreviewProps {
  product: Product
  personalization: PersonalizationSelection
  className?: string
}
```

**Usage:**
```tsx
<PersonalizationLivePreview
  product={product}
  personalization={{
    'Tekst': { fieldName: 'Tekst', value: 'Mijn Tekst' },
    'Lettertype': { fieldName: 'Lettertype', value: 'Arial' },
    'Kleur': { fieldName: 'Kleur', value: '#FF0000' },
  }}
/>
```

---

### PP06: PersonalizationSummaryCard

**Purpose:** Summary of all personalization choices with pricing breakdown

**Features:**
- List all personalization selections
- Shows field name, value, and price modifier
- Edit buttons for each field
- Total personalization cost
- Icon indicators per field type (text, font, color, image)
- Empty state message
- Responsive layout

**Props:**
```typescript
interface PersonalizationSummaryCardProps {
  personalization: PersonalizationSelection
  options: PersonalizationOption[]
  onEdit?: () => void
  className?: string
}
```

**Usage:**
```tsx
<PersonalizationSummaryCard
  personalization={personalizationState}
  options={product.personalizationOptions}
  onEdit={() => setStep(1)}
/>
```

---

### PP07: PersonalizationCharacterLimit

**Purpose:** Visual character counter with warning at 90% and block at 100%

**Features:**
- Progress bar showing character usage
- Color-coded status (green, yellow, red)
- Warning message at 90% threshold
- Block indicator at 100%
- Character count display (current / max)
- Percentage display

**Props:**
```typescript
interface PersonalizationCharacterLimitProps {
  currentLength: number
  maxLength: number
  warningThreshold?: number  // Default: 90
  className?: string
}
```

**Usage:**
```tsx
<PersonalizationCharacterLimit
  currentLength={text.length}
  maxLength={50}
  warningThreshold={80}  // Warn at 80% instead of 90%
/>
```

---

### PP08: PersonalizationProductionTime

**Purpose:** Time indicator with delivery date calculator and rush order option

**Features:**
- Shows base production days
- Shows additional personalization days
- Calculates estimated delivery date (business days only)
- Rush order toggle (optional, 50% faster)
- Visual timeline breakdown
- Business days calculation (excludes weekends)
- Formatted delivery date display

**Props:**
```typescript
interface PersonalizationProductionTimeProps {
  baseProductionDays: number
  personalizationDays?: number
  rushAvailable?: boolean
  onRushToggle?: (enabled: boolean) => void
  className?: string
}
```

**Usage:**
```tsx
<PersonalizationProductionTime
  baseProductionDays={5}
  personalizationDays={3}
  rushAvailable={true}
  onRushToggle={(enabled) => {
    if (enabled) {
      // Add rush fee to total
      setRushFee(25.00)
    } else {
      setRushFee(0)
    }
  }}
/>
```

---

## 🔄 Complete Personalization Flow Example

**Full implementation with PP02-PP08:**

```tsx
'use client'

import { useState } from 'react'
import {
  PersonalizationFontSelector,
  PersonalizationColorPicker,
  PersonalizationImageUpload,
  PersonalizationLivePreview,
  PersonalizationSummaryCard,
  PersonalizationCharacterLimit,
  PersonalizationProductionTime,
} from '@/branches/ecommerce/components/product-types/personalized'
import type {
  PersonalizationOption,
  PersonalizationSelection,
} from '@/branches/ecommerce/lib/product-types'

export function PersonalizedProductForm({ product }: { product: Product }) {
  const [personalization, setPersonalization] = useState<PersonalizationSelection>({})
  const [text, setText] = useState('')

  // Personalization options (from product data)
  const options: PersonalizationOption[] = [
    {
      fieldName: 'Tekst',
      fieldType: 'text',
      required: true,
      maxLength: 50,
      priceModifier: 0,
    },
    {
      fieldName: 'Lettertype',
      fieldType: 'font',
      required: false,
      priceModifier: 2.50,
    },
    {
      fieldName: 'Kleur',
      fieldType: 'color',
      required: true,
      priceModifier: 0,
    },
    {
      fieldName: 'Upload afbeelding',
      fieldType: 'image',
      required: false,
      priceModifier: 5.00,
      productionTimeAdded: 2,
    },
  ]

  // Handlers
  const handleTextChange = (value: string) => {
    setText(value)
    setPersonalization((prev) => ({
      ...prev,
      Tekst: { fieldName: 'Tekst', value },
    }))
  }

  const handleFontChange = (value: string) => {
    setPersonalization((prev) => ({
      ...prev,
      Lettertype: { fieldName: 'Lettertype', value },
    }))
  }

  const handleColorChange = (value: string) => {
    setPersonalization((prev) => ({
      ...prev,
      Kleur: { fieldName: 'Kleur', value },
    }))
  }

  const handleImageChange = (file: File | null) => {
    setPersonalization((prev) => ({
      ...prev,
      'Upload afbeelding': { fieldName: 'Upload afbeelding', value: file },
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Personalization Form */}
      <div className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block mb-2 text-[15px] font-bold">
            Tekst
            <span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            maxLength={50}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
            placeholder="Voer uw tekst in..."
          />
          <PersonalizationCharacterLimit
            currentLength={text.length}
            maxLength={50}
          />
        </div>

        {/* Font Selector */}
        <PersonalizationFontSelector
          option={options[1]}
          value={personalization['Lettertype']?.value as string || 'Arial'}
          onChange={handleFontChange}
        />

        {/* Color Picker */}
        <PersonalizationColorPicker
          option={options[2]}
          value={personalization['Kleur']?.value as string || '#000000'}
          onChange={handleColorChange}
        />

        {/* Image Upload */}
        <PersonalizationImageUpload
          option={options[3]}
          value={personalization['Upload afbeelding']?.value as File | null}
          onChange={handleImageChange}
        />

        {/* Production Time */}
        <PersonalizationProductionTime
          baseProductionDays={5}
          personalizationDays={personalization['Upload afbeelding']?.value ? 2 : 0}
          rushAvailable={true}
        />
      </div>

      {/* Right: Live Preview + Summary */}
      <div className="space-y-6">
        {/* Live Preview */}
        <PersonalizationLivePreview
          product={product}
          personalization={personalization}
        />

        {/* Summary Card */}
        <PersonalizationSummaryCard
          personalization={personalization}
          options={options}
          onEdit={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>
    </div>
  )
}
```

---

## 📊 Status Summary

**Completion:** 7/8 components (87.5%)

- ✅ **PP01:** Exists elsewhere (PersonalizationTextInput)
- ✅ **PP02-PP08:** Fully implemented

**Total Lines of Code:**
- PP02: ~110 lines
- PP03: ~160 lines
- PP04: ~230 lines
- PP05: ~160 lines
- PP06: ~150 lines
- PP07: ~100 lines
- PP08: ~150 lines
- **Total:** ~1,060 lines for PP02-PP08

---

## 🚀 Next Steps

**For new implementations:**
1. Import components from `@/branches/ecommerce/components/product-types/personalized`
2. Define `PersonalizationOption[]` array for your product
3. Manage `PersonalizationSelection` state
4. Combine PP02-PP08 for complete personalization UX
5. Add business logic for cart integration

**Testing:**
```bash
# TypeScript check
npx tsc --noEmit

# Build test
npm run build

# Run dev server
npm run dev
```

---

**DONE! ✨**
