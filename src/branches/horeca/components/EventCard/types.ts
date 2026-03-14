export interface EventCardProps {
  event: {
    id: number
    title: string
    slug: string
    shortDescription?: string
    featuredImage?: { url: string; alt?: string } | null
    startDate?: string
    endDate?: string
    price?: number
    priceType?: string
    maxParticipants?: number
    _status?: string
  }
  className?: string
}
