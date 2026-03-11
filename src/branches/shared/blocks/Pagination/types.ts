import type { PaginationBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-36 Pagination Block Props
 */
export interface PaginationBlockProps extends PaginationBlock, BlockAnimationProps {}

export type PaginationVariant = 'numbered' | 'simple'
