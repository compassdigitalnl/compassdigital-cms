import type { PricingBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-16 Pricing Block Props
 */
export interface PricingBlockProps extends PricingBlock, BlockAnimationProps {}

export type PricingColumns = '2' | '3' | '4'
