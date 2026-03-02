export interface BackInStockNotifierProduct {
  id: string
  name: string
  variant?: string
  estimatedRestock?: string // ISO date string
}

export interface BackInStockNotifierProps {
  product: BackInStockNotifierProduct
  onSubmit: (email: string, productId: string, variantId?: string) => Promise<void> | void
  className?: string
  showEstimatedDate?: boolean
  customTitle?: string
  customDescription?: string
}
