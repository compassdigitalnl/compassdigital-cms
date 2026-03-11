import type { TwoColumnImagePairBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-02d Two Column Image Pair Block Props
 *
 * Extends the Payload-generated TwoColumnImagePairBlock interface with animation props.
 */
export interface TwoColumnImagePairBlockProps extends TwoColumnImagePairBlock, BlockAnimationProps {}

export type ImagePairLayout = 'equal' | 'left-large' | 'right-large' | 'comparison'
export type ImagePairType = 'standard' | 'overlay'
export type ImagePairAspectRatio = 'landscape' | 'portrait' | 'square'
export type ImagePairSpacing = 'compact' | 'default' | 'spacious'
