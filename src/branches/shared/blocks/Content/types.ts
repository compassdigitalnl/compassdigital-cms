import type { ContentBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-07 Content Block Props
 *
 * Extends the Payload-generated ContentBlock interface with animation props.
 */
export interface ContentBlockProps extends ContentBlock, BlockAnimationProps {}

export type ContentWidth = 'narrow' | 'wide' | 'full'
