export interface PropertyMapMarker {
  id: string | number
  title: string
  slug: string
  askingPrice: number
  priceCondition?: string
  city?: string
  bedrooms?: number
  bathrooms?: number
  livingArea?: number
  listingStatus?: string
  coordinates?: [number, number]
}

export interface PropertyMapViewProps {
  properties: PropertyMapMarker[]
  onPropertyClick?: (slug: string) => void
  className?: string
}
