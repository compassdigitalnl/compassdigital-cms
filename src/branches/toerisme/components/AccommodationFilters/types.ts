export interface AccommodationFiltersProps {
  selectedTypes?: string[]
  selectedFacilities?: string[]
  selectedMealPlans?: string[]
  starsMin?: number
  starsMax?: number
  priceMin?: number
  priceMax?: number
  onFilterChange?: (filters: AccommodationFilterState) => void
  className?: string
}

export interface AccommodationFilterState {
  types: string[]
  facilities: string[]
  mealPlans: string[]
  starsMin?: number
  starsMax?: number
  priceMin?: number
  priceMax?: number
}
