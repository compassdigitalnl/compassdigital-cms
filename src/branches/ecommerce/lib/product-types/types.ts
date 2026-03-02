/**
 * Product Types - TypeScript Type Definitions
 * Centralized type definitions for all product types
 */

import type { Product, Media } from '@/payload-types'

// ============================================
// VARIABLE PRODUCTS (VP01-VP13)
// ============================================

export type VariantDisplayType =
  | 'colorSwatch'
  | 'sizeRadio'
  | 'dropdown'
  | 'imageRadio'
  | 'checkbox'

export interface VariantValue {
  label: string
  value: string
  priceModifier?: number | null
  stock?: number | null
  colorHex?: string | null
  image?: Media | string | number | null
  disabled?: boolean
}

export interface VariantOption {
  optionName: string
  displayType: VariantDisplayType
  values: VariantValue[]
  required?: boolean
  description?: string
}

export interface VariantSelection {
  [optionName: string]: VariantValue
}

// Component Props
export interface VariantColorSwatchesProps {
  product: Product
  option: VariantOption
  selectedValue?: VariantValue | null
  onSelect: (value: VariantValue) => void
  className?: string
}

export interface VariantSizeSelectorProps {
  product: Product
  option: VariantOption
  selectedValue?: VariantValue | null
  onSelect: (value: VariantValue) => void
  showSizeGuide?: boolean
  className?: string
}

export interface VariantDropdownSelectorProps {
  product: Product
  option: VariantOption
  selectedValue?: VariantValue | null
  onSelect: (value: VariantValue) => void
  placeholder?: string
  className?: string
}

export interface VariantImageRadioProps {
  product: Product
  option: VariantOption
  selectedValue?: VariantValue | null
  onSelect: (value: VariantValue) => void
  imageSize?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface VariantCheckboxAddonsProps {
  product: Product
  option: VariantOption
  selectedValues: VariantValue[]
  onToggle: (value: VariantValue) => void
  className?: string
}

// Multi-Variant Component Props (VP08-VP13)
export interface VariantMatrixSelectorProps {
  product: Product
  primaryOption: VariantOption
  secondaryOption: VariantOption
  selectedCombination?: {
    primary: string
    secondary: string
  } | null
  onSelect: (combination: { primary: string; secondary: string }) => void
  showStock?: boolean
  className?: string
}

export interface VariantStepByStepProps {
  product: Product
  options: VariantOption[]
  selectedValues: Record<string, VariantValue>
  onSelectionsChange: (selections: Record<string, VariantValue>) => void
  showProgressBar?: boolean
  className?: string
}

export interface VariantBulkSelectorProps {
  product: Product
  options: VariantOption[]
  variantQuantities: Record<string, number>
  onQuantityChange: (variantKey: string, quantity: number) => void
  showTotalSummary?: boolean
  minQuantity?: number
  maxQuantity?: number
  className?: string
}

export interface VariantComparisonTableProps {
  product: Product
  options: VariantOption[]
  selectedVariants: string[]
  onVariantsChange: (variants: string[]) => void
  maxCompare?: number
  className?: string
}

export interface VariantQuickAddProps {
  product: Product
  options: VariantOption[]
  onAddToCart: (variantValue: string, quantity: number) => Promise<void>
  showImages?: boolean
  compactMode?: boolean
  className?: string
}

export interface VariantAvailabilityCalendarProps {
  product: Product
  option: VariantOption
  selectedDate?: Date | null
  onDateSelect: (date: Date) => void
  availabilityData?: Record<string, boolean | number>
  minDate?: Date
  maxDate?: Date
  showLegend?: boolean
  className?: string
}

// ============================================
// MULTI-VARIANT SELECTION (VP08-VP13)
// ============================================

/**
 * ProductVariant - Represents a single variant (combination of options)
 * Used for multi-variant selection (bulk ordering)
 */
export interface ProductVariant {
  id: string
  sku: string
  name: string
  price: number
  compareAtPrice?: number
  stock: number
  image?: Media | string | number | null
  attributes: { [key: string]: string }
}

/**
 * VP08: VariantCardCompact - Compact card for grid view
 */
export interface VariantCardCompactProps {
  variant: ProductVariant
  selected: boolean
  quantity: number
  onToggle: (variantId: string) => void
  onQuantityChange: (variantId: string, quantity: number) => void
  className?: string
}

/**
 * VP09: VariantRowCompact - Horizontal row for list view
 */
export interface VariantRowCompactProps {
  variant: ProductVariant
  selected: boolean
  quantity: number
  onToggle: (variantId: string) => void
  onQuantityChange: (variantId: string, quantity: number) => void
  showImage?: boolean
  className?: string
}

/**
 * VP10: VariantSelectionSidebar - Sticky sidebar with selected items
 */
export interface VariantSelectionSidebarProps {
  selectedVariants: Array<{
    variant: ProductVariant
    quantity: number
  }>
  subtotal: number
  discount?: number
  total: number
  onRemoveVariant: (variantId: string) => void
  onClearAll: () => void
  onAddToCart: () => void
  className?: string
}

/**
 * VP11: VariantToolbar - View toggle + bulk actions
 */
export interface VariantToolbarProps {
  viewMode: VariantViewMode
  onViewModeChange: (mode: VariantViewMode) => void
  totalVariants: number
  selectedCount: number
  onSelectAll: () => void
  onDeselectAll: () => void
  className?: string
}

/**
 * View mode for variant display
 */
export type VariantViewMode = 'grid' | 'list'

/**
 * Selection state for all variants
 */
export interface VariantSelectionState {
  [variantId: string]: {
    selected: boolean
    quantity: number
  }
}

// ============================================
// PERSONALIZED PRODUCTS (PP01-PP08)
// ============================================

export type PersonalizationFieldType = 'text' | 'font' | 'color' | 'image'

export interface PersonalizationOption {
  fieldName: string
  fieldType: PersonalizationFieldType
  required?: boolean
  maxLength?: number | null
  priceModifier?: number | null
  productionTimeAdded?: number | null
}

export interface PersonalizationValue {
  fieldName: string
  value: string | File | null
}

export interface PersonalizationSelection {
  [fieldName: string]: PersonalizationValue
}

// Component Props
export interface PersonalizationTextInputProps {
  option: PersonalizationOption
  value: string
  onChange: (value: string) => void
  error?: string | null
  className?: string
}

export interface PersonalizationFontSelectorProps {
  option: PersonalizationOption
  value: string
  onChange: (value: string) => void
  availableFonts?: string[]
  className?: string
}

export interface PersonalizationColorPickerProps {
  option: PersonalizationOption
  value: string
  onChange: (value: string) => void
  presetColors?: string[]
  className?: string
}

export interface PersonalizationImageUploadProps {
  option: PersonalizationOption
  value: File | null
  onChange: (file: File | null) => void
  maxSize?: number
  acceptedFormats?: string[]
  className?: string
}

export interface PersonalizationLivePreviewProps {
  product: Product
  personalization: PersonalizationSelection
  className?: string
}

export interface PersonalizationSummaryCardProps {
  personalization: PersonalizationSelection
  options: PersonalizationOption[]
  onEdit?: () => void
  className?: string
}

export interface PersonalizationCharacterLimitProps {
  currentLength: number
  maxLength: number
  warningThreshold?: number
  className?: string
}

export interface PersonalizationProductionTimeProps {
  baseProductionDays: number
  personalizationDays?: number
  rushAvailable?: boolean
  onRushToggle?: (enabled: boolean) => void
  className?: string
}

// ============================================
// CONFIGURATOR (PC01-PC08)
// ============================================

export interface ConfiguratorOption {
  name: string
  description?: string | null
  price: number
  image?: Media | string | number | null
  recommended?: boolean
}

export interface ConfiguratorStep {
  stepNumber: number
  title: string
  description?: string | null
  required?: boolean
  options: ConfiguratorOption[]
}

export interface ConfiguratorSelection {
  [stepNumber: number]: ConfiguratorOption
}

// Component Props
export interface ConfiguratorStepIndicatorProps {
  steps: ConfiguratorStep[]
  currentStep: number
  completedSteps: number[]
  onStepClick?: (stepNumber: number) => void
  className?: string
}

export interface ConfiguratorStepCardProps {
  step: ConfiguratorStep
  isActive: boolean
  isCompleted: boolean
  className?: string
}

export interface ConfiguratorOptionCardProps {
  option: ConfiguratorOption
  isSelected: boolean
  onSelect: () => void
  showPrice?: boolean
  className?: string
}

export interface ConfiguratorOptionGridProps {
  options: ConfiguratorOption[]
  selectedOption?: ConfiguratorOption | null
  onSelect: (option: ConfiguratorOption) => void
  columns?: 2 | 3 | 4
  className?: string
}

export interface ConfiguratorNavigationProps {
  currentStep: number
  totalSteps: number
  canGoNext: boolean
  canGoPrevious: boolean
  onNext: () => void
  onPrevious: () => void
  onReset?: () => void
  className?: string
}

export interface ConfiguratorValidationProps {
  step: ConfiguratorStep
  selection: ConfiguratorOption | null
  error?: string | null
  className?: string
}

export interface ConfiguratorReviewProps {
  steps: ConfiguratorStep[]
  selections: ConfiguratorSelection
  totalPrice: number
  onEdit: (stepNumber: number) => void
  className?: string
}

export interface ConfiguratorSummaryProps {
  selections: ConfiguratorSelection
  totalPrice: number
  onCheckout: () => void
  className?: string
}

// ============================================
// SUBSCRIPTION (PT5)
// ============================================

export type SubscriptionInterval = 'day' | 'week' | 'month' | 'year'

export interface SubscriptionFrequency {
  interval: SubscriptionInterval
  intervalCount: number
  discount?: number | null
}

export interface SubscriptionOptions {
  frequencies: SubscriptionFrequency[]
  minSubscriptionLength?: number | null
  maxSubscriptionLength?: number | null
  cancellationPolicy?: string | null
}

export interface SubscriptionSelection {
  frequency: SubscriptionFrequency
  length?: number | null
}

// Component Props
export interface SubscriptionPricingTableProps {
  product: Product
  subscriptionOptions: SubscriptionOptions
  selectedFrequency?: SubscriptionFrequency | null
  onSelect: (frequency: SubscriptionFrequency) => void
  className?: string
}

export interface SubscriptionFrequencySelectorProps {
  frequencies: SubscriptionFrequency[]
  selectedFrequency?: SubscriptionFrequency | null
  onSelect: (frequency: SubscriptionFrequency) => void
  showDiscount?: boolean
  className?: string
}

export interface SubscriptionBenefitsCardProps {
  benefits: string[]
  cancellationPolicy?: string | null
  className?: string
}

// ============================================
// BUNDLE PRODUCTS (PT2)
// ============================================

export interface BundleProduct {
  product: Product | string | number
  quantity: number
  discount?: number | null
}

export interface BundleProductListProps {
  products: BundleProduct[]
  className?: string
}

export interface BundleDiscountBadgeProps {
  discount: number
  discountType?: 'percentage' | 'fixed'
  className?: string
}

export interface BundleSavingsCalculatorProps {
  originalPrice: number
  bundlePrice: number
  showPercentage?: boolean
  className?: string
}

// Bundle Components (BB01-BB06)
export interface BundleItem {
  id: string
  product: Product | string | number
  quantity: number
  required: boolean
  discount?: number | null
}

export interface BundleDiscountTier {
  minQuantity: number
  discountPercentage: number
  label?: string
}

export interface BundleOverviewCardProps {
  title: string
  description?: string
  items: BundleItem[]
  totalPrice: number
  originalPrice: number
  discount: number
  onAddToCart: () => void
  className?: string
}

export interface BundleProductCardProps {
  item: BundleItem
  selected: boolean
  onToggle?: (itemId: string) => void
  className?: string
}

export interface BundleItemRowProps {
  item: BundleItem
  quantity: number
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove?: (itemId: string) => void
  className?: string
}

export interface BundleDiscountTiersProps {
  tiers: BundleDiscountTier[]
  currentQuantity: number
  className?: string
}

export interface BundleTotalCalculatorProps {
  items: Array<{ price: number; quantity: number }>
  discountPercentage?: number
  shipping?: number
  tax?: number
  className?: string
}

export interface BundleProgressBarProps {
  current: number
  min: number
  max: number
  label?: string
  showValue?: boolean
  className?: string
}

// ============================================
// MIX & MATCH (PT3)
// ============================================

export interface MixMatchConfig {
  boxSize: number
  allowedProducts: (Product | string | number)[]
  pricePerBox: number
}

export interface MixMatchSelection {
  [productId: string]: number
}

export interface MixMatchBoxSelectorProps {
  config: MixMatchConfig
  selection: MixMatchSelection
  onSelectionChange: (selection: MixMatchSelection) => void
  className?: string
}

export interface MixMatchProductGridProps {
  products: Product[]
  selection: MixMatchSelection
  onAdd: (product: Product) => void
  onRemove: (product: Product) => void
  maxQuantityPerProduct?: number
  className?: string
}

export interface MixMatchSummaryProps {
  selection: MixMatchSelection
  config: MixMatchConfig
  totalSelected: number
  onCheckout: () => void
  className?: string
}

// ============================================
// SHARED UTILITIES
// ============================================

export interface AddToCartOptions {
  productId: string | number
  quantity: number
  variants?: VariantSelection
  personalization?: PersonalizationSelection
  configuratorSelections?: ConfiguratorSelection
  subscription?: SubscriptionSelection
}

export interface PriceCalculation {
  basePrice: number
  variantModifiers: number
  personalizationModifiers: number
  configuratorTotal: number
  subscriptionDiscount: number
  finalPrice: number
}

// ============================================
// PRODUCT TYPE DETECTION
// ============================================

export type ProductType = 'simple' | 'grouped' | 'variable' | 'mixAndMatch' | 'subscription'

export function isVariableProduct(product: Product): boolean {
  return product.productType === 'variable' || !!(product as any).variantOptions
}

export function hasPersonalization(product: Product): boolean {
  return (
    Array.isArray((product as any).personalizationOptions) &&
    (product as any).personalizationOptions.length > 0
  )
}

export function hasConfigurator(product: Product): boolean {
  return (
    Array.isArray((product as any).configuratorSteps) &&
    (product as any).configuratorSteps.length > 0
  )
}

export function isSubscriptionProduct(product: Product): boolean {
  return !!(product as any).subscriptionOptions
}

export function isBundleProduct(product: Product): boolean {
  return product.productType === 'grouped'
}

export function isMixMatchProduct(product: Product): boolean {
  return product.productType === 'mixAndMatch'
}
