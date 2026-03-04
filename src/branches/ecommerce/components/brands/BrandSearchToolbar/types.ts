export interface BrandSearchToolbarProps {
  totalCount: number
  searchQuery: string
  onSearchChange: (query: string) => void
  className?: string
}
