import type { BannerBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-34 Banner Block Props
 */
export interface BannerBlockProps extends BannerBlock, BlockAnimationProps {}

export type BannerVariant = 'info' | 'promo' | 'warning'
export type BannerPosition = 'inline' | 'top'
