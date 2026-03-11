import type { WorkshopRegistrationBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-30 WorkshopRegistration Block Props
 *
 * Extends the Payload-generated WorkshopRegistrationBlock interface with animation props.
 */
export interface WorkshopRegistrationBlockProps
  extends WorkshopRegistrationBlock,
    BlockAnimationProps {}

export type WorkshopRegistrationVariant = 'standard' | 'card'
