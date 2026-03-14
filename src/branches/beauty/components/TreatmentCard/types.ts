export interface TreatmentCardProps {
  treatment: {
    id: number
    title: string
    slug: string
    shortDescription?: string
    icon?: string
    duration?: number
    price?: number
    priceFrom?: number
    priceTo?: number
    category?: string
    _status?: string
  }
  variant?: 'default' | 'compact' | 'featured'
  showCTA?: boolean
  className?: string
}
