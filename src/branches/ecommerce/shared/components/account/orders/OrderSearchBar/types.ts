export interface OrderSearchBarProps {
  searchQuery: string
  statusFilter: string
  onSearch: (query: string) => void
  onStatusFilter: (status: string) => void
}
