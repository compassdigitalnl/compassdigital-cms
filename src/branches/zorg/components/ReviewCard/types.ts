export interface ReviewCardProps {
  review: {
    id: number
    rating?: number
    content?: string
    authorName?: string
    treatmentType?: string
    date?: string
    _status?: string
  }
  className?: string
}
