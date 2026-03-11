import type { ProcessStepsBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-44 Process Steps Block Props
 *
 * Extends the Payload-generated ProcessStepsBlock interface with animation props.
 */
export interface ProcessStepsBlockProps extends ProcessStepsBlock, BlockAnimationProps {}

export type ProcessStepsIcon = 'search' | 'settings' | 'check-circle' | 'zap' | 'rocket' | 'target' | 'bar-chart' | 'lightbulb' | 'palette' | 'smartphone'
export type ProcessStepsBgColor = 'light-grey' | 'white'

export interface ProcessStepItem {
  icon?: ProcessStepsIcon | null
  title: string
  description: string
  id?: string | null
}
