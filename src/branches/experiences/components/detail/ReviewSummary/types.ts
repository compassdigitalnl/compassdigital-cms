export interface ReviewBreakdown {
  label: string
  score: number
}

export interface Review {
  id: string
  author: string
  initials: string
  groupType?: string
  date: string
  rating: number
  content: string
}

export interface ReviewSummaryProps {
  overallRating: number
  breakdowns: ReviewBreakdown[]
  reviews: Review[]
  className?: string
}
