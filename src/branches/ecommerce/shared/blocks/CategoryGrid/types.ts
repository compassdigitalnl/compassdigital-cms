import type { CategoryGridBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-15 Category Grid Block Props
 */
export interface CategoryGridBlockProps extends CategoryGridBlock, BlockAnimationProps {}

export type CategoryGridLayout = 'grid-3' | 'grid-4' | 'masonry'
export type CategoryGridSource = 'all' | 'featured' | 'manual'
