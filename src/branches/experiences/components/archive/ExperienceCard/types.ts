export interface ExperienceCardProps {
  title: string
  slug: string
  category?: string
  thumbnail?: string
  duration?: string
  minPersons?: number
  maxPersons?: number
  rating?: number
  reviewCount?: number
  pricePerPerson: number
  priceType?: 'per-person' | 'fixed' | 'from'
  popular?: boolean
  featured?: boolean
  badge?: string
  className?: string
}
