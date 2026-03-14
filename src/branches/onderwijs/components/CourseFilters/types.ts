export interface CourseFiltersProps {
  categories: Array<{
    id: string | number
    name: string
    slug: string
  }>
  onFilterChange?: (filters: CourseFilterState) => void
  initialFilters?: Partial<CourseFilterState>
  className?: string
}

export interface CourseFilterState {
  category: string
  priceType: 'alle' | 'gratis' | 'betaald'
  priceMin?: number
  priceMax?: number
  levels: string[]
  minRating: string
  durations: string[]
}
