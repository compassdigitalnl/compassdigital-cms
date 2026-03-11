import type { ProductEmbedBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-14 Product Embed Block Props
 */
export interface ProductEmbedBlockProps extends ProductEmbedBlock, BlockAnimationProps {}

export type ProductEmbedVariant = 'card' | 'hero' | 'minimal'
