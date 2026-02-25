export type SortOption = {
  value: string
  label: string
}

export type ViewMode = 'grid' | 'list'

export type SortDropdownSize = 'sm' | 'md' | 'lg'

export interface SortDropdownProps {
  value: string
  options: SortOption[]
  onChange: (value: string) => void
  size?: SortDropdownSize
  disabled?: boolean
  className?: string
}

export interface ViewToggleProps {
  view: ViewMode
  onChange: (view: ViewMode) => void
  size?: SortDropdownSize
  disabled?: boolean
  className?: string
}

export interface ShopToolbarProps {
  sortValue: string
  sortOptions: SortOption[]
  onSortChange: (value: string) => void
  viewMode?: ViewMode
  onViewChange?: (view: ViewMode) => void
  resultCount?: number
  totalCount?: number
  showViewToggle?: boolean
  size?: SortDropdownSize
  className?: string
}
