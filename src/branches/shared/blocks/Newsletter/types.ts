import type { NewsletterBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-28 Newsletter Block Props
 *
 * Extends the Payload-generated NewsletterBlock interface with animation props.
 */
export interface NewsletterBlockProps extends NewsletterBlock, BlockAnimationProps {}

export type NewsletterVariant = 'inline' | 'card' | 'banner'
export type NewsletterBackgroundColor = 'white' | 'grey' | 'navy' | 'teal'
