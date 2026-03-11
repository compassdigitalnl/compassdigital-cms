import type { BlockAnimationProps } from '../_shared/types'

export interface VideoBlockProps extends BlockAnimationProps {
  blockType: 'video'
  videoUrl: string
  title?: string | null
  caption?: string | null
  size?: 'narrow' | 'wide' | 'full' | null
  autoplay?: boolean | null
}
