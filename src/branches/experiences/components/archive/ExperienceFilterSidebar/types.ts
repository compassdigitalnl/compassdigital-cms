export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface ExperienceFilters {
  category?: string
  priceRange?: [number, number]
  groupSize?: string
  duration?: string
  location?: string
  rating?: number
}

export interface ExperienceFilterSidebarProps {
  categories: FilterOption[]
  locations: FilterOption[]
  durations: FilterOption[]
  groupSizes: FilterOption[]
  filters: ExperienceFilters
  onFilterChange: (filters: ExperienceFilters) => void
  resultCount?: number
  className?: string
}
