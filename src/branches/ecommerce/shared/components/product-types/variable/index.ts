/**
 * Variable Product Components (VP01-VP13)
 *
 * Single-Variant Selectors (VP01-VP05):
 * - VP01: VariantColorSwatches - Color swatch selector with hex codes
 * - VP02: VariantSizeSelector - Size selector with size guide
 * - VP03: VariantDropdownSelector - Dropdown selector for materials/finishes
 * - VP04: VariantImageRadio - Image-based radio selector
 * - VP05: VariantCheckboxAddons - Checkbox selector for add-ons (multi-select)
 *
 * Multi-Variant Selectors (VP08-VP13):
 * - VP08: VariantMatrixSelector - Grid-based multi-variant selection (size x color)
 * - VP09: VariantStepByStep - Wizard-style multi-step selector
 * - VP10: VariantBulkSelector - Bulk quantity selector for multiple variants
 * - VP11: VariantComparisonTable - Side-by-side variant comparison
 * - VP12: VariantQuickAdd - Quick add multiple variants to cart
 * - VP13: VariantAvailabilityCalendar - Date-based variant availability
 */

// Single-Variant Selectors (VP01-VP05)
export { VariantColorSwatches } from './VariantColorSwatches'
export { VariantSizeSelector } from './VariantSizeSelector'
export { VariantDropdownSelector } from './VariantDropdownSelector'
export { VariantImageRadio } from './VariantImageRadio'
export { VariantCheckboxAddons } from './VariantCheckboxAddons'

// Multi-Variant Selectors (VP08-VP13) - NEW IMPLEMENTATION
export { VariantCardCompact } from './VariantCardCompact' // VP08: Grid card for multi-select
export { VariantRowCompact } from './VariantRowCompact' // VP09: List row for multi-select
export { VariantSelectionSidebar } from './VariantSelectionSidebar' // VP10: Sticky sidebar with selected items
export { VariantToolbar } from './VariantToolbar' // VP11: View toggle + bulk actions
// VP12-VP13: Grid/List containers (CSS patterns) - see README.md

// Legacy Multi-Variant Components (keeping for compatibility)
export { VariantMatrixSelector } from './VariantMatrixSelector'
export { VariantStepByStep } from './VariantStepByStep'
export { VariantBulkSelector } from './VariantBulkSelector'
export { VariantComparisonTable } from './VariantComparisonTable'
export { VariantQuickAdd } from './VariantQuickAdd'
export { VariantAvailabilityCalendar } from './VariantAvailabilityCalendar'
