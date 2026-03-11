import type { FeaturesBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-03 Features Block Props
 *
 * Extends the Payload-generated FeaturesBlock interface with animation props.
 */
export interface FeaturesBlockProps extends FeaturesBlock, BlockAnimationProps {}

export type FeaturesLayout = 'grid-3' | 'grid-4' | 'list' | 'split'
export type FeaturesIconStyle = 'glow' | 'solid' | 'outlined'

export interface FeatureItem {
  icon: string
  title: string
  description?: string | null
  link?: string | null
  id?: string | null
}
