export interface TreatmentCardProps {
  treatment: {
    id: number
    title: string
    slug: string
    shortDescription?: string
    duration?: number
    price?: number
    priceFrom?: number
    priceTo?: number
    insurance?: 'covered' | 'partial' | 'not-covered'
    bookable?: boolean
    _status?: string
  }
  className?: string
}
