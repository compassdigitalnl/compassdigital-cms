export interface PropertyCardProps {
  title: string
  slug: string
  coverImage?: string
  coverAlt?: string
  askingPrice: number
  priceCondition?: string
  originalPrice?: number
  city?: string
  bedrooms?: number
  bathrooms?: number
  livingArea?: number
  energyLabel?: string
  listingStatus?: string
  listingDate?: string
  featured?: boolean
  className?: string
}
