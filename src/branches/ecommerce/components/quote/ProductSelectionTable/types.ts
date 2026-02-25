export interface Product {
  id: string
  name: string
  sku: string
  thumbnail?: string // Image URL or emoji
  quantity: number
  price?: number // Optional: show price column
  maxQuantity?: number // Stock limit or MOQ
}

export interface ProductSelectionTableProps {
  products: Product[]
  onProductAdd?: () => void // Opens product search modal
  onProductRemove?: (id: string) => void
  onQuantityChange?: (id: string, qty: number) => void
  showPrices?: boolean // Show price column (future enhancement)
  emptyMessage?: string
  className?: string
}
