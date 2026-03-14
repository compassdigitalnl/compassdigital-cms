export interface VehicleCardProps {
  vehicle: {
    id: number
    slug: string
    title: string
    images?: Array<{ url?: string; alt?: string }> | null
    price?: number | null
    salePrice?: number | null
    year?: number | null
    mileage?: number | null
    fuelType?: string | null
    transmission?: string | null
    status?: 'beschikbaar' | 'gereserveerd' | 'verkocht' | null
    bodyType?: string | null
    brand?: { title?: string } | number | null
    model?: string | null
  }
  showPrice?: boolean
  className?: string
}
