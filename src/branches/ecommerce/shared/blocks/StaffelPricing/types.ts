import type { StaffelPricingBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-19 Staffel Pricing Block Props
 */
export interface StaffelPricingBlockProps extends StaffelPricingBlock, BlockAnimationProps {}

export type StaffelPricingVariant = 'table' | 'cards'
