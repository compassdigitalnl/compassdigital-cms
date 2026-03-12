import type { CTABlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-04 CTA Block Props
 *
 * Extends the Payload-generated CTABlock interface with animation props.
 */
export interface CTABlockProps extends CTABlock, BlockAnimationProps {}

export type CTAVariant = 'centered' | 'split' | 'banner' | 'full-width'
export type CTABackgroundStyle = 'gradient' | 'solid' | 'image'
export type CTAButtonStyle = 'primary' | 'secondary' | 'ghost'
export type CTASize = 'small' | 'medium' | 'large'
export type CTAAlignment = 'center' | 'left'
