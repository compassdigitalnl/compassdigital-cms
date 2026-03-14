export interface AccommodationCardProps {
  name: string
  slug: string
  coverImage?: string
  coverAlt?: string
  stars?: number
  type?: string
  city?: string
  region?: string
  facilities?: string[]
  priceFrom?: number
  mealPlan?: string
  rating?: number
  reviewCount?: number
  className?: string
}
