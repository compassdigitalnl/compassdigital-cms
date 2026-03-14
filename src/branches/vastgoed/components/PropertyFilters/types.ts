export interface PropertyFiltersProps {
  initialFilters?: PropertyFilterState
  onFilterChange?: (filters: PropertyFilterState) => void
  className?: string
}

export interface PropertyFilterState {
  location: string
  priceMin?: number
  priceMax?: number
  propertyType: string
  minBedrooms?: number
  areaMin?: number
  areaMax?: number
  energyLabels: string[]
}
