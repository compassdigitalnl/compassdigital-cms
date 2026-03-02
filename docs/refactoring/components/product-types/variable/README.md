# Variable Products (VP01-VP13)

**Product Type:** PT1 - Variable Product
**Source:** `/Users/markkokkelkoren/Projects/payload-design/designs/variabel-product.html`

---

## 📦 PURPOSE

Components for **variable products** — products with multiple variants (sizes, colors, materials) where the customer selects ONE variant at a time.

**Examples:**
- T-shirt: Choose size (S/M/L/XL) + color (red/blue/green)
- Yoga mat: Choose size (60x90, 80x120, 100x150)
- Medical gloves: Choose material (nitrile/latex) + size (S/M/L)

---

## 🎯 SINGLE-VARIANT SELECTION (VP01-VP05)

Choose **ONE** option per attribute:

- ✅ **VP01:** VariantColorSwatches (1,358 lines) — Color selection with swatches
- ✅ **VP02:** VariantSizeSelector (1,392 lines) — Size buttons (XS-XXL)
- ✅ **VP03:** VariantDropdownSelector (1,064 lines) — Dropdown for materials/finishes
- ✅ **VP04:** VariantImageRadio (1,100 lines) — Image-based selection
- ✅ **VP05:** VariantCheckboxAddons (1,250 lines) — Optional extras (multi-select)

---

## 🎯 MULTI-VARIANT SELECTION (VP08-VP13)

Choose **MULTIPLE** variants simultaneously (e.g., buy 3 sizes at once):

- ✅ **VP08:** VariantCardCompact (1,020 lines) — Grid card with checkbox + qty stepper
- ⏳ **VP09:** VariantRowCompact — List row (horizontal layout)
- ⏳ **VP10:** VariantSelectionSidebar — Sticky sidebar with selected items
- ⏳ **VP11:** VariantToolbar — Grid/list toggle + bulk actions
- ⏳ **VP12:** VariantGridContainer — 6-column responsive grid
- ⏳ **VP13:** VariantListContainer — List view wrapper

**See:** `VARIANT_MULTI_SELECT_COMPONENTS.md` for roadmap

---

## 🚫 NOT IN THIS FOLDER

- **Personalization (PP01-PP08):** Text inputs for engraving/custom text → `/personalized/`
- **Configurator (PC01-PC08):** Multi-step configuration wizards → `/configurator/`
- **Grouped Products (GP01-GP07):** Different products bundled together → `/grouped/`
- **Mix & Match (MM01-MM07):** Build-your-own packs → `/mix-match/`

---

## 📊 STATUS

**Total Components:** 11 (planned)
**Completed:** 6/11 (55%)
- ✅ VP01-VP05: Single-variant selection (COMPLETE)
- ✅ VP08: Multi-variant grid card (COMPLETE)
- ⏳ VP09-VP13: Multi-variant components (IN PROGRESS)

**Last Updated:** 25 Februari 2026
