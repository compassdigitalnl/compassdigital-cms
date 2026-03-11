import type { ReviewsWidgetBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-39 ReviewsWidget Block Props
 */
export interface ReviewsWidgetBlockProps extends ReviewsWidgetBlock, BlockAnimationProps {}

export type ReviewSource = 'manual' | 'collection' | 'auto'

export type ReviewLayout = 'cards' | 'quotes' | 'compact'

export type ReviewAveragePosition = 'top' | 'left'

export type ReviewCollectionSource = 'product-reviews' | 'construction-reviews' | 'experience-reviews'

export interface ReviewItem {
  reviewer?: string | null
  rating?: number | null
  text?: string | null
  date?: string | null
  id?: string | null
}
