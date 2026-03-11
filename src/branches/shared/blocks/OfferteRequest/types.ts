import type { OfferteRequestBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-29 OfferteRequest Block Props
 *
 * Extends the Payload-generated OfferteRequestBlock interface with animation props.
 */
export interface OfferteRequestBlockProps extends OfferteRequestBlock, BlockAnimationProps {}

export type OfferteRequestVariant = 'standard' | 'sidebar'
