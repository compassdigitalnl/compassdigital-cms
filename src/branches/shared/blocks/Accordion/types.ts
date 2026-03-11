import type { AccordionBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-08 Accordion Block Props
 *
 * Extends the Payload-generated AccordionBlock interface with animation props.
 */
export interface AccordionBlockProps extends AccordionBlock, BlockAnimationProps {}

export type AccordionVariant = 'simple' | 'bordered' | 'separated'

export interface AccordionItem {
  title: string
  content: any // Lexical JSON
  defaultOpen?: boolean | null
  id?: string | null
}
