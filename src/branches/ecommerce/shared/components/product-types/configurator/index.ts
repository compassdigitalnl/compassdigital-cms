/**
 * Product Configurator Components (PC01-PC08)
 *
 * Components for step-by-step product configuration:
 * - PC01: ConfiguratorStepIndicator - Multi-step progress bar
 * - PC02: ConfiguratorStepCard - Step content wrapper
 * - PC03: ConfiguratorOptionCard - Single option selection card
 * - PC04: ConfiguratorOptionGrid - Grid layout for options
 * - PC05: ConfiguratorNavigation - Bottom navigation bar
 * - PC06: ConfiguratorValidation - Required field warnings
 * - PC07: ConfiguratorReview - Final review step
 * - PC08: ConfiguratorSummary (exists elsewhere)
 */

// PC01-PC07 exports
export { ConfiguratorStepIndicator } from './ConfiguratorStepIndicator'
export { ConfiguratorStepCard } from './ConfiguratorStepCard'
export { ConfiguratorOptionCard } from './ConfiguratorOptionCard'
export { ConfiguratorOptionGrid } from './ConfiguratorOptionGrid'
export { ConfiguratorNavigation } from './ConfiguratorNavigation'
export { ConfiguratorValidation } from './ConfiguratorValidation'
export { ConfiguratorReview } from './ConfiguratorReview'

// Type exports
export type {
  ConfiguratorStepIndicatorProps,
  ConfiguratorStepCardProps,
  ConfiguratorOptionCardProps,
  ConfiguratorOptionGridProps,
  ConfiguratorNavigationProps,
  ConfiguratorValidationProps,
  ConfiguratorReviewProps,
  ConfiguratorStep,
  ConfiguratorOption,
  ConfiguratorSelection,
} from '@/branches/ecommerce/shared/lib/product-types'
