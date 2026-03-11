import type { ContactFormBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-27 ContactForm Block Props
 *
 * Extends the Payload-generated ContactFormBlock interface with animation props.
 */
export interface ContactFormBlockProps extends ContactFormBlock, BlockAnimationProps {}

export type ContactFormVariant = 'standard' | 'sidebar' | 'floating'
