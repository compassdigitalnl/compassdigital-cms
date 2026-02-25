export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order'

export interface ProductStock {
  status: StockStatus
  quantity?: number
  message?: string // Custom stock message (e.g., "Op voorraad (512)")
}

export interface ProductVariant {
  id: string
  name: string // e.g., "XS", "S", "M", "Blue", "Red"
  available: boolean
  default?: boolean
}

export interface QuickViewProduct {
  id: string
  name: string
  brand?: string
  sku?: string
  image: string // Primary product image URL
  imageAlt?: string // Alt text for image
  badge?: string // Badge text (e.g., "Staffelkorting", "Nieuw")
  badgeColor?: 'amber' | 'teal' | 'green' | 'coral' // Badge color variant
  stock: ProductStock
  price: number
  unit?: string // e.g., "per doos", "per stuk"
  staffelHint?: string // Volume pricing hint (e.g., "Vanaf 5 dozen: €7,50")
  variants?: ProductVariant[] // Optional size/color variants
  slug?: string // Product URL slug for "view full" link
}

export interface QuickViewModalProps {
  /**
   * Product data to display in the modal
   */
  product: QuickViewProduct

  /**
   * Whether the modal is open
   */
  isOpen: boolean

  /**
   * Callback when modal should close (backdrop click, ESC, close button)
   */
  onClose: () => void

  /**
   * Callback when user adds product to cart
   * @param productId - Product ID
   * @param variantId - Selected variant ID (if variants exist)
   * @param quantity - Selected quantity
   */
  onAddToCart?: (productId: string, variantId: string | null, quantity: number) => void

  /**
   * Callback when user clicks "View full product page"
   * @param productId - Product ID
   */
  onViewFull?: (productId: string) => void

  /**
   * Custom text for "Add to cart" button
   * @default "In winkelwagen"
   */
  addToCartText?: string

  /**
   * Custom text for "View full" link
   * @default "Bekijk volledige productpagina"
   */
  viewFullText?: string

  /**
   * Whether to show the "View full" link
   * @default true
   */
  showViewFullLink?: boolean

  /**
   * Custom CSS classes
   */
  className?: string
}
