export interface ProductActionsProps {
  // Product info
  productId: string
  price: number // Price in cents
  initialQuantity?: number // Starting quantity (default: 1)
  maxQuantity?: number // Maximum allowed quantity (default: 99)
  minQuantity?: number // Minimum allowed quantity (default: 1)

  // State
  disabled?: boolean // Disable all actions (e.g., out of stock)
  loading?: boolean // Show loading state
  inWishlist?: boolean // Initial wishlist state

  // Callbacks
  onAddToCart?: (productId: string, quantity: number) => void | Promise<void>
  onQuantityChange?: (quantity: number) => void
  onWishlistToggle?: (productId: string, inWishlist: boolean) => void | Promise<void>

  // Customization
  addToCartLabel?: string // Button label (default: "In winkelwagen")
  showWishlist?: boolean // Show wishlist button (default: true)
  showTotalPrice?: boolean // Show total price below (default: false)
  taxClass?: 'standard' | 'reduced' | 'zero'
  className?: string
}
