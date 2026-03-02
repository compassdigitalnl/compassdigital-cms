/**
 * Personalized Products Components (PP01-PP08)
 *
 * Components for personalized/customizable products:
 * - PP01: PersonalizationTextInput (already exists elsewhere)
 * - PP02: PersonalizationFontSelector - Font/style selector with previews
 * - PP03: PersonalizationColorPicker - Color swatches or picker
 * - PP04: PersonalizationImageUpload - Drag-drop file upload
 * - PP05: PersonalizationLivePreview - Visual product preview with customization
 * - PP06: PersonalizationSummaryCard - Summary of all personalization choices
 * - PP07: PersonalizationCharacterLimit - Visual character counter
 * - PP08: PersonalizationProductionTime - Time indicator with delivery date calculator
 */

// PP02-PP08 exports
export { PersonalizationFontSelector } from './PersonalizationFontSelector'
export { PersonalizationColorPicker } from './PersonalizationColorPicker'
export { PersonalizationImageUpload } from './PersonalizationImageUpload'
export { PersonalizationLivePreview } from './PersonalizationLivePreview'
export { PersonalizationSummaryCard } from './PersonalizationSummaryCard'
export { PersonalizationCharacterLimit } from './PersonalizationCharacterLimit'
export { PersonalizationProductionTime } from './PersonalizationProductionTime'

// Type exports
export type {
  PersonalizationFontSelectorProps,
  PersonalizationColorPickerProps,
  PersonalizationImageUploadProps,
  PersonalizationLivePreviewProps,
  PersonalizationSummaryCardProps,
  PersonalizationCharacterLimitProps,
  PersonalizationProductionTimeProps,
} from '@/branches/ecommerce/lib/product-types'
