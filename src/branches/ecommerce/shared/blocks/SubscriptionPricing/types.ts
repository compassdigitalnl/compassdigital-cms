import type { SubscriptionPricingBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-17 Subscription Pricing Block Props
 */
export interface SubscriptionPricingBlockProps
  extends SubscriptionPricingBlock,
    BlockAnimationProps {}

export type SubscriptionFrequency = 'monthly' | 'yearly' | 'both'
export type SubscriptionPricingVariant = 'cards' | 'table'
