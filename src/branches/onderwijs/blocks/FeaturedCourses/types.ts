export interface FeaturedCoursesProps {
  heading?: string
  limit?: number
  columns?: '2' | '3' | '4'
  categoryFilter?: string | number | { id: string | number } | null
  showPrice?: boolean
  showRating?: boolean
}
