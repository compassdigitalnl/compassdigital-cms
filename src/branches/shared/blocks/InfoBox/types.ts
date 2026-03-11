import type { InfoBoxBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-33 InfoBox Block Props
 */
export interface InfoBoxBlockProps extends InfoBoxBlock, BlockAnimationProps {}

export type InfoBoxVariant = 'info' | 'success' | 'warning' | 'error'
