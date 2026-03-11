import type { TwoColumnBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-02 Two Column Block Props
 *
 * Extends the Payload-generated TwoColumnBlock interface with animation props.
 */
export interface TwoColumnBlockProps extends TwoColumnBlock, BlockAnimationProps {}

export type TwoColumnVariant = 'text-text' | 'text-image' | 'image-text'
export type TwoColumnGap = 'sm' | 'md' | 'lg'
export type TwoColumnImagePosition = 'left' | 'right'
