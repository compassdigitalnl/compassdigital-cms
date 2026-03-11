import type { ProductGridBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-13 Product Grid Block Props
 */
export interface ProductGridBlockProps extends ProductGridBlock, BlockAnimationProps {}

export type ProductGridLayout = 'grid-3' | 'grid-4' | 'list'
export type ProductGridSource = 'latest' | 'featured' | 'manual' | 'category'
