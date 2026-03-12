import type { BranchePricingBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * Branche Pricing Block Props
 *
 * Extends the Payload-generated BranchePricingBlock interface with animation props.
 */
export interface BranchePricingBlockProps extends BranchePricingBlock, BlockAnimationProps {}

export type BranchePricingBgColor = 'white' | 'light-grey' | 'gradient'

export interface BranchePricingPlan {
  name: string
  price: string
  period?: string | null
  description?: string | null
  features?: BranchePricingFeature[] | null
  buttonLabel?: string | null
  buttonLink?: string | null
  featured?: boolean | null
  badge?: string | null
  id?: string | null
}

export interface BranchePricingFeature {
  text: string
  included?: boolean | null
  id?: string | null
}
