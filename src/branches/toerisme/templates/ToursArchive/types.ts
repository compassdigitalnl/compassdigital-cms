export interface ToursArchiveProps {
  tours: any[]
  destinations: Array<{ id: number; name: string; slug: string; continent?: string }>
  totalPages: number
  currentPage: number
  totalDocs: number
  filters?: {
    continent?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    minDuration?: number
    maxDuration?: number
  }
}
