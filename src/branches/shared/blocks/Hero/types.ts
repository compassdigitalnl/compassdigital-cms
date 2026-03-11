import type { HeroBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-01 Hero Block Props
 *
 * Extends the Payload-generated HeroBlock interface with animation props.
 */
export interface HeroBlockProps extends HeroBlock, BlockAnimationProps {}

export type HeroVariant = 'default' | 'split' | 'centered'
export type HeroBackgroundStyle = 'gradient' | 'image' | 'solid'
export type HeroBackgroundColor = 'navy' | 'white' | 'bg' | 'teal'
export type HeroButtonStyle = 'primary' | 'secondary' | 'ghost'
