export interface AccommodationsArchiveProps {
  accommodations: any[]
  totalPages: number
  currentPage: number
  totalDocs: number
  filters?: {
    type?: string
    stars?: number
    facilities?: string[]
    mealPlan?: string
    minPrice?: number
    maxPrice?: number
  }
}
