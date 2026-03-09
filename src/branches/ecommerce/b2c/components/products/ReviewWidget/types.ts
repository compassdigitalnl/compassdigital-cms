export interface Review {
  id: string
  author: {
    name: string
    initials: string
    verified: boolean
  }
  rating: 1 | 2 | 3 | 4 | 5
  date: string // ISO date string
  text: string
  helpful: {
    yes: number
    no: number
  }
  userVote?: 'yes' | 'no' | null // Current user's vote (if logged in)
}

export interface ReviewDistribution {
  1: number
  2: number
  3: number
  4: number
  5: number
}

export interface ReviewSummary {
  average: number // 0-5 with decimals (e.g., 4.7)
  total: number
  distribution: ReviewDistribution
}

export type SortOption = 'helpful' | 'newest' | 'rating-high' | 'rating-low'

export interface ReviewWidgetProps {
  productId: string
  productName: string
  summary: ReviewSummary
  reviews: Review[]
  onWriteReview?: () => void
  onHelpful?: (reviewId: string, vote: 'yes' | 'no') => void | Promise<void>
  sortBy?: SortOption
  onSortChange?: (sort: SortOption) => void
  filterBy?: 1 | 2 | 3 | 4 | 5 | null
  onFilterChange?: (rating: 1 | 2 | 3 | 4 | 5 | null) => void
  showWriteButton?: boolean
  className?: string
}
