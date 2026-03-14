export interface CoursesArchiveProps {
  courses: any[]
  categories: any[]
  totalPages: number
  currentPage: number
  totalDocs: number
  filters?: {
    q?: string
    category?: string
    level?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    sort?: string
  }
}
