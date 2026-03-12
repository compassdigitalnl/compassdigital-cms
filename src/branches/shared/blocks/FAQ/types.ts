import type { FAQBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-05 FAQ Block Props
 *
 * Extends the Payload-generated FAQBlock interface with animation props.
 */
export interface FAQBlockProps extends FAQBlock, BlockAnimationProps {}

export type FAQVariant = 'simple' | 'single-column' | 'bordered' | 'colored'

export interface FAQItem {
  question: string
  answer: any // Lexical JSON
  id?: string | null
}
