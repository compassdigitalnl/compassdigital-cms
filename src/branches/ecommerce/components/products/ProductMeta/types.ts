export type StockStatus = 'ok' | 'low' | 'out'

export interface ProductRating {
  value: number // Average rating (0-5, e.g., 4.8)
  count: number // Total review count
  reviewsUrl?: string // Link to reviews section (default: "#reviews")
}

export interface StockInfo {
  status: StockStatus // Stock level
  quantity?: number // Current stock count (for "low" status)
  message?: string // Custom stock message
  expectedDate?: string // Restock date (for "out" status)
}

export interface TrustBadge {
  icon: string // Lucide icon name (e.g., "truck", "shield-check")
  label: string // Badge text
}

export interface ProductMetaProduct {
  // Required
  title: string // Product name (H1)
  price: number // Current price in cents (e.g., 15995 = €159.95)
  category: string // Category breadcrumb (e.g., "Schoenen · Custom")

  // Optional
  shortDescription?: string // 2-3 line product summary
  priceOriginal?: number // Original price (if on sale)
  priceNote?: string // BTW/shipping info below price

  // Rating
  rating?: ProductRating

  // Stock
  stock?: StockInfo

  // Trust badges
  trustBadges?: TrustBadge[]

  // Tax class
  taxClass?: 'standard' | 'reduced' | 'zero'
}

export interface ProductMetaProps {
  product: ProductMetaProduct
  className?: string // Additional CSS classes
  showTrustBadges?: boolean // Show/hide trust badges (default: true)
  variant?: 'default' | 'compact' // Layout variant
}
