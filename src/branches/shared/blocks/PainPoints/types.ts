import type { PainPointsBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * Pain Points Block Props
 *
 * Extends the Payload-generated PainPointsBlock interface with animation props.
 */
export interface PainPointsBlockProps extends PainPointsBlock, BlockAnimationProps {}

export type PainPointsIcon = 'alert-triangle' | 'clock' | 'frown' | 'trending-down' | 'phone-missed' | 'users' | 'ban' | 'help-circle' | 'thumbs-down' | 'repeat'
export type PainPointsBgColor = 'white' | 'light-grey' | 'red-tint'

export interface PainPointItem {
  icon?: PainPointsIcon | null
  title: string
  description: string
  id?: string | null
}
