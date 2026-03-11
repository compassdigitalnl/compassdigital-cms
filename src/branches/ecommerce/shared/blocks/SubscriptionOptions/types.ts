import type { SubscriptionOptionsBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-23 Subscription Options Block Props
 */
export interface SubscriptionOptionsBlockProps
  extends SubscriptionOptionsBlock,
    BlockAnimationProps {}

export type SubscriptionOptionsVariant = 'cards' | 'list'
