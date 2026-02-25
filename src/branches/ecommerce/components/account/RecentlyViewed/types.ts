export interface RecentlyViewedProduct {
  id: string
  name: string
  brand?: string
  price: number // In cents
  imageUrl?: string
  imagePlaceholder?: string // Emoji or icon
  viewedAt: string // ISO 8601 timestamp
  slug: string
}

export interface RecentlyViewedProps {
  products: RecentlyViewedProduct[]
  onProductClick?: (product: RecentlyViewedProduct) => void
  onAddToCart?: (productId: string) => void | Promise<void>
  onAddToFavorites?: (productId: string) => void | Promise<void>
  onClearHistory?: () => void | Promise<void>
  maxProducts?: number
  className?: string
}
