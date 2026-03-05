/**
 * ProductCard Type Definitions
 */

/**
 * Volume pricing tier for bulk discounts
 */
export interface VolumePricingTier {
  /**
   * Minimum quantity for this tier
   */
  minQty: number

  /**
   * Price at this tier
   */
  price: number

  /**
   * Discount percentage (e.g., 15 for 15% off)
   */
  discountPercent: number
}

/**
 * Product badge type
 */
export type BadgeType = 'sale' | 'new' | 'pro' | 'popular'

/**
 * Product badge configuration
 */
export interface ProductBadge {
  /**
   * Badge type (determines color and styling)
   */
  type: BadgeType

  /**
   * Custom label (defaults to type if not provided)
   */
  label?: string
}

/**
 * Stock status for availability indicator
 */
export type StockStatus = 'in-stock' | 'low' | 'out' | 'on-backorder'

/**
 * Brand information
 */
export interface Brand {
  /**
   * Brand name
   */
  name: string

  /**
   * Brand slug for URL
   */
  slug: string
}

/**
 * Product image
 */
export interface ProductImage {
  /**
   * Image URL
   */
  url: string

  /**
   * Alt text for accessibility
   */
  alt: string
}

/**
 * ProductCard Props
 */
export interface ProductCardProps {
  // === Product Data ===

  /**
   * Product ID
   */
  id: string

  /**
   * Product name/title
   */
  name: string

  /**
   * Product slug for URL
   */
  slug: string

  /**
   * SKU code
   */
  sku: string

  /**
   * Brand information
   */
  brand: Brand

  /**
   * Product image
   */
  image?: ProductImage

  // === Pricing ===

  /**
   * Current price (null for grouped products without own price)
   */
  price: number | null

  /**
   * Compare-at price (original price before sale)
   */
  compareAtPrice?: number

  /**
   * Unit text (e.g., "per 100 stuks", "per 50 paar")
   */
  unit?: string

  /**
   * Volume pricing tiers (staffel pricing)
   */
  volumePricing?: VolumePricingTier[]

  // === Rating & Reviews ===

  /**
   * Average rating (0-5)
   */
  rating?: number

  /**
   * Number of reviews
   */
  reviewCount?: number

  // === Stock Status ===

  /**
   * Available stock quantity
   */
  stock: number

  /**
   * Stock status indicator
   */
  stockStatus: StockStatus

  /**
   * Custom stock message (overrides default)
   */
  stockText?: string

  // === Badges ===

  /**
   * Product badges (Sale, Nieuw, Pro, Popular)
   */
  badges?: ProductBadge[]

  // === Layout ===

  /**
   * Card layout variant (default: 'grid')
   */
  variant?: 'grid' | 'list'

  // === Actions ===

  /**
   * Callback when add-to-cart button is clicked
   */
  onAddToCart?: (productId: string, quantity: number) => void

  /**
   * Callback when wishlist button is clicked
   */
  onWishlistToggle?: () => void

  /**
   * Callback when quick-view button is clicked
   */
  onQuickView?: () => void

  /**
   * Product detail page URL (overrides default /products/[slug])
   */
  href?: string

  /**
   * Currency symbol (default: '€')
   */
  currencySymbol?: string

  /**
   * Locale for number formatting (default: 'nl-NL')
   */
  locale?: string

  /**
   * Additional CSS class names
   */
  className?: string

  /**
   * Price label prefix (e.g. "Vanaf" for grouped products)
   */
  priceLabel?: string

  /**
   * Tax class for correct BTW calculation
   */
  taxClass?: 'standard' | 'reduced' | 'zero'
}
