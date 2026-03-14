export interface StylistCardProps {
  stylist: {
    id: number
    name: string
    slug: string
    role?: string
    avatar?: { url: string; alt?: string } | null
    bio?: string
    specialties?: Array<{ specialty: string }>
    bookable?: boolean
    _status?: string
  }
  showBookButton?: boolean
  className?: string
}
