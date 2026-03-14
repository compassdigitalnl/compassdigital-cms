export interface ReviewCardProps {
  review: {
    id: number
    authorName?: string
    rating?: number
    quote?: string
    occasion?: string
    createdAt?: string
    _status?: string
  }
  className?: string
}
