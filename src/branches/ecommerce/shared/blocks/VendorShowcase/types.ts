import type { VendorShowcaseBlock } from '@/payload-types'
import type { BlockAnimationProps } from '@/branches/shared/blocks/_shared/types'

/**
 * B-26 Vendor Showcase Block Props
 */
export interface VendorShowcaseBlockProps extends VendorShowcaseBlock, BlockAnimationProps {}

export type VendorShowcaseLayout = 'grid' | 'carousel'
export type VendorShowcaseSource = 'all' | 'featured' | 'manual'
