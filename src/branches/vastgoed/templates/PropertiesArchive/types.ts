export interface PropertiesArchiveProps {
  properties: any[]
  totalPages: number
  currentPage: number
  totalDocs: number
  filters?: {
    city?: string
    minPrice?: number
    maxPrice?: number
    propertyType?: string
    minBedrooms?: number
    minArea?: number
    maxArea?: number
    energyLabel?: string
    status?: string
    sort?: string
  }
}
