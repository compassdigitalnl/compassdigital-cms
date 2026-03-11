import type { TrustSignalsBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-40 TrustSignals Block Props
 */
export interface TrustSignalsBlockProps extends TrustSignalsBlock, BlockAnimationProps {}

export type TrustSignalsVariant = 'horizontal' | 'cards'
export type TrustSignalsBackground = 'white' | 'grey' | 'navy'

export interface TrustSignalItem {
  icon?: string | null
  title: string
  description?: string | null
  id?: string | null
}
