import type { PricingGradientBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-17c Pricing Gradient Block Props
 */
export interface PricingGradientBlockProps extends PricingGradientBlock, BlockAnimationProps {}

export type PricingGradientVariant = 'three-tier' | 'two-column' | 'comparison' | 'with-faq'
export type PricingGradientColor = 'navy' | 'teal' | 'purple' | 'blue'
