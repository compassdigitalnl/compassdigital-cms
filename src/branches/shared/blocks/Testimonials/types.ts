import type { TestimonialsBlock, Media } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-38 Testimonials Block Props
 */
export interface TestimonialsBlockProps extends TestimonialsBlock, BlockAnimationProps {}

export type TestimonialsVariant = 'grid' | 'featured' | 'carousel'

export interface TestimonialItem {
  quote: string
  author: string
  role?: string | null
  company?: string | null
  avatar?: Media | number | null
  rating?: number | null
  id?: string | null
}
