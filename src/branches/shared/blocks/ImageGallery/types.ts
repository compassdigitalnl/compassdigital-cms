import type { ImageGalleryBlock, Media } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-20 ImageGallery Block Props
 */
export interface ImageGalleryBlockProps extends ImageGalleryBlock, BlockAnimationProps {}

export type ImageGalleryVariant = 'grid' | 'featured-grid' | 'masonry'
export type ImageGalleryAspectRatio = '16-9' | '4-3' | '1-1' | 'auto'
export type ImageGalleryGap = 'small' | 'normal' | 'large'

export interface GalleryImage {
  image: Media | number
  caption?: string | null
  id?: string | null
}
