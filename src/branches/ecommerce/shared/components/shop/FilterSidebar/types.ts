export type FilterType = 'checkbox' | 'range' | 'rating'

export interface FilterOption {
  value: string
  label: string
  count: number
}

export interface PriceRange {
  min: number
  max: number
  step: number
}

export interface FilterGroup {
  id: string
  label: string
  icon: string // Lucide icon name (kebab-case)
  type: FilterType
  options?: FilterOption[]
  range?: PriceRange
  defaultOpen?: boolean
}

export interface ActiveFilter {
  groupId: string
  label: string // Display label for chip (e.g., "Hartmann", "Maat: S, M", "€2,50 - €45,00")
  values: string[] // Selected values (e.g., ["hartmann"], ["s", "m"], ["2.50", "45.00"])
}

export interface FilterSidebarProps {
  filters: FilterGroup[]
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  onResetAll: () => void
  sticky?: boolean
  stickyTop?: number // Pixels from top (default: 90)
  defaultOpen?: string[] // Filter IDs to open by default
  className?: string
}

export interface FilterCardProps {
  filter: FilterGroup
  isOpen: boolean
  isActive: boolean
  onToggle: () => void
  onFilterChange: (groupId: string, values: string[]) => void
  selectedValues: string[]
}

export interface ActiveFilterChipsProps {
  filters: ActiveFilter[]
  onRemove: (groupId: string) => void
  onReset: () => void
  className?: string
}

export interface PriceRangeSliderProps {
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  onApply: () => void
  currency?: string
}
