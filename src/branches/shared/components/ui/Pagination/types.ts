export type PaginationVariant = 'default' | 'with-count' | 'compact'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
  maxVisiblePages?: number
  variant?: PaginationVariant
  showArrows?: boolean
  showEllipsis?: boolean
  showCount?: boolean
  showPerPageSelector?: boolean
  perPageOptions?: number[]
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  getPageUrl?: (page: number) => string
  className?: string
}

export interface PaginationButtonProps {
  page: number | 'prev' | 'next'
  isActive?: boolean
  isDisabled?: boolean
  onClick: () => void
  href?: string
  'aria-label'?: string
  'aria-current'?: 'page'
  children?: React.ReactNode
}

export type PageNumber = number | '...'
