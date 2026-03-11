import type { QuickOrderBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-18 Quick Order Block Props
 */
export interface QuickOrderBlockProps extends QuickOrderBlock, BlockAnimationProps {}

export type QuickOrderVariant = 'simple' | 'advanced'
