import type { BlogPreviewBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-32 BlogPreview Block Props
 */
export interface BlogPreviewBlockProps extends BlogPreviewBlock, BlockAnimationProps {}

export type BlogPreviewSource = 'latest' | 'featured' | 'category'
export type BlogPreviewLayout = 'grid' | 'list' | 'featured'

export interface BlogPostItem {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: {
    url?: string | null
    alt?: string | null
  } | number | null
  author?: {
    name?: string | null
  } | number | null
  publishedAt?: string | null
  category?: {
    title?: string | null
  } | number | null
}
