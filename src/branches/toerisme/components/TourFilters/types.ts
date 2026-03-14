export interface TourFiltersProps {
  selectedContinents?: string[]
  selectedCategories?: string[]
  priceMin?: number
  priceMax?: number
  durationMin?: number
  durationMax?: number
  onFilterChange?: (filters: TourFilterState) => void
  className?: string
}

export interface TourFilterState {
  continents: string[]
  categories: string[]
  priceMin?: number
  priceMax?: number
  durationMin?: number
  durationMax?: number
}
