import type { HeroEmailCaptureBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-01d Hero Email Capture Block Props
 *
 * Extends the Payload-generated HeroEmailCaptureBlock interface with animation props.
 */
export interface HeroEmailCaptureBlockProps extends HeroEmailCaptureBlock, BlockAnimationProps {}

export type HeroEmailCaptureVariant = 'centered' | 'split' | 'compact'
