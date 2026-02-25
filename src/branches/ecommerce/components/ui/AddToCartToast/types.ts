/**
 * AddToCartToast Type Definitions
 */

export interface CartToastProduct {
  /**
   * Product ID
   */
  id: string

  /**
   * Product name
   */
  name: string

  /**
   * Product variant (e.g., "Maat M", "Color: Blue")
   */
  variant?: string

  /**
   * Product image URL
   */
  image?: string

  /**
   * Quantity added to cart
   */
  quantity: number

  /**
   * Unit price
   */
  price: number
}

export interface AddToCartToastProps {
  /**
   * Product that was added to cart
   */
  product: CartToastProduct

  /**
   * Whether to show the toast
   */
  show: boolean

  /**
   * Auto-dismiss duration in milliseconds
   * Set to 0 to disable auto-dismiss
   * @default 5000
   */
  autoDismiss?: number

  /**
   * Callback when toast is closed
   */
  onClose: () => void

  /**
   * Callback when "View Cart" is clicked
   */
  onViewCart?: () => void

  /**
   * Callback when "Continue Shopping" is clicked
   */
  onContinueShopping?: () => void
}

export interface ToastItem {
  /**
   * Unique toast ID
   */
  id: string

  /**
   * Product data
   */
  product: CartToastProduct

  /**
   * Timestamp when toast was created
   */
  createdAt: number
}
