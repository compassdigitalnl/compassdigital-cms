export interface VehiclesArchiveProps {
  vehicles: any[]
  brands: Array<{ id: number; name: string; slug: string }>
  totalPages: number
  currentPage: number
  totalDocs: number
  filters?: {
    brand?: string
    fuelType?: string
    bodyType?: string
    priceMin?: number
    priceMax?: number
    yearMin?: number
    yearMax?: number
  }
}
