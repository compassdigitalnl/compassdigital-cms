/**
 * Bundle Product Components (BB01-BB06)
 *
 * Components for bundle product management:
 * - BB01: BundleOverviewCard - Complete bundle overview with pricing
 * - BB02: BundleProductCard - Individual product card for bundles
 * - BB03: BundleItemRow - Horizontal item row with quantity controls
 * - BB04: BundleDiscountTiers - Volume discount tier display
 * - BB05: BundleTotalCalculator - Price breakdown calculator
 * - BB06: BundleProgressBar - Progress indicator for goals
 */

// Component exports
export { BundleOverviewCard } from './BundleOverviewCard'
export { BundleProductCard } from './BundleProductCard'
export { BundleItemRow } from './BundleItemRow'
export { BundleDiscountTiers } from './BundleDiscountTiers'
export { BundleTotalCalculator } from './BundleTotalCalculator'
export { BundleProgressBar } from './BundleProgressBar'

// Type exports
export type {
  BundleOverviewCardProps,
  BundleProductCardProps,
  BundleItemRowProps,
  BundleDiscountTiersProps,
  BundleTotalCalculatorProps,
  BundleProgressBarProps,
  BundleItem,
  BundleDiscountTier,
} from '@/branches/ecommerce/lib/product-types'
