import type { SocialProofBannerBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-41 SocialProofBanner Block Props
 */
export interface SocialProofBannerBlockProps extends SocialProofBannerBlock, BlockAnimationProps {}

export type SocialProofBannerVariant = 'dark' | 'light' | 'gradient'

export interface MetricItem {
  value: string
  label: string
  id?: string | null
}
