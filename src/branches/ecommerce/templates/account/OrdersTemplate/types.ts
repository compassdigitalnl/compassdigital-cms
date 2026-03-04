export interface OrderListItem {
  id: string
  orderNumber: string
  createdAt: string
  status: string
  total: number
  items?: Array<{
    title: string
    quantity: number
  }>
}

export interface OrdersTemplateProps {
  orders: OrderListItem[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPageChange: (page: number) => void
  onStatusFilter: (status: string) => void
  onSearch: (query: string) => void
  statusFilter: string
  searchQuery: string
  isLoading?: boolean
}
