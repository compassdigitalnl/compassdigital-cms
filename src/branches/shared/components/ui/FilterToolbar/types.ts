export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface SortOption {
  label: string
  value: string
}

export interface FilterToolbarProps {
  filters: FilterOption[]
  activeFilter?: string
  onFilterChange: (value: string) => void
  sortOptions?: SortOption[]
  activeSort?: string
  onSortChange?: (value: string) => void
  allLabel?: string
  className?: string
}
