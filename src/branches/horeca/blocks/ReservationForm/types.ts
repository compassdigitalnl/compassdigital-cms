import type { ReservationFormBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-31 ReservationForm Block Props
 *
 * Extends the Payload-generated ReservationFormBlock interface with animation props.
 */
export interface ReservationFormBlockProps extends ReservationFormBlock, BlockAnimationProps {}

export type ReservationFormVariant = 'standard' | 'split'
