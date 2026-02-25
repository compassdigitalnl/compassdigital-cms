# Personalized Products (PP01-PP08)

**Product Type:** PT8 - Personalized Products
**Source:** Partially in `variabel-product.html` + to be expanded

---

## 📦 PURPOSE

Components for **personalized/customizable products** — products that allow custom text, images, or other personalization options.

**Examples:**
- Engraving: Names, dates, messages on jewelry/gifts
- Monogramming: Initials on clothing/towels
- Custom printing: Text/logos on mugs, t-shirts
- Gift cards: Personal messages
- Photo products: Upload custom images

---

## 🎯 COMPONENTS (PP01-PP08)

### ✅ COMPLETE (1/8)

- ✅ **PP01:** PersonalizationTextInput (1,250 lines)
  - Text input with character counter
  - Validation (required, max length, special chars)
  - Helper text & error messages
  - Optional vs required states
  - Price display (free or paid personalization)

### ⏳ PLANNED (7/8)

- ⏳ **PP02:** PersonalizationFontSelector
  - Font/style dropdown with previews
  - For engraving/printing styles
  - Visual font samples

- ⏳ **PP03:** PersonalizationColorPicker
  - Color swatches or picker
  - For text color, thread color, etc.
  - Hex input support

- ⏳ **PP04:** PersonalizationImageUpload
  - Drag-drop file upload
  - Image preview & crop
  - File type/size validation
  - Guidelines (min resolution, formats)

- ⏳ **PP05:** PersonalizationLivePreview
  - Visual product preview with customization
  - Updates in real-time
  - Zoom/rotate controls

- ⏳ **PP06:** PersonalizationSummaryCard
  - Summary of all personalization choices
  - Pricing breakdown
  - Edit buttons

- ⏳ **PP07:** PersonalizationCharacterLimit
  - Visual character counter
  - Warning at 90%
  - Block input at 100%

- ⏳ **PP08:** PersonalizationProductionTime
  - Time indicator (e.g., "+3 werkdagen")
  - Delivery date calculator
  - Rush order option

---

## 🔗 RELATED COMPONENTS

**Variable Products:**
- VP06 was moved here → PP01 (personalization belongs to PT8, not PT1)

**Configurator:**
- PC08: ConfiguratorSummary (shows configuration + personalization combined)

---

## 📊 STATUS

**Total Components:** 8 (planned)
**Completed:** 1/8 (12.5%)
- ✅ PP01: Text input (COMPLETE)
- ⏳ PP02-PP08: (PLANNED)

**Priority:** MEDIUM (after Variable Products, Configurator)

**Last Updated:** 25 Februari 2026
