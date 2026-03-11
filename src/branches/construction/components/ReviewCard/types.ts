import type { ConstructionReview } from '@/payload-types'

export interface ReviewCardProps {
  review: ConstructionReview
  variant?: 'default' | 'compact' | 'featured'
  showProject?: boolean
  className?: string
}
