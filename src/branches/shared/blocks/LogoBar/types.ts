import type { LogoBarBlock, Media } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-42 LogoBar Block Props
 */
export interface LogoBarBlockProps extends LogoBarBlock, BlockAnimationProps {}

export type LogoBarVariant = 'static' | 'scroll'
export type LogoBarContext = 'customers' | 'certifications' | 'partners'

export interface LogoItem {
  logo: Media | number
  name?: string | null
  link?: string | null
  id?: string | null
}
