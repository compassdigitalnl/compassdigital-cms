/**
 * MiniCartFlyout Type Definitions
 */

export interface MiniCartItem {
  /**
   * Product ID
   */
  id: string

  /**
   * Product title
   */
  title: string

  /**
   * Product brand (optional)
   */
  brand?: string

  /**
   * Product variant (e.g., "Maat: L")
   */
  variant?: string

  /**
   * Product image URL
   */
  image?: string

  /**
   * Unit price
   */
  price: number

  /**
   * Quantity in cart
   */
  quantity: number
}

export interface CartSummary {
  /**
   * Subtotal (before discounts/shipping)
   */
  subtotal: number

  /**
   * Shipping cost (0 if free shipping)
   */
  shipping: number

  /**
   * Discount amount (if coupon applied)
   */
  discount?: number

  /**
   * Total (subtotal + shipping - discount)
   */
  total: number

  /**
   * Number of items in cart
   */
  itemCount: number
}

export interface FreeShippingProgress {
  /**
   * Free shipping threshold amount
   */
  threshold: number

  /**
   * Current cart total
   */
  current: number

  /**
   * Amount remaining to reach free shipping
   */
  remaining: number

  /**
   * Progress percentage (0-100)
   */
  percentage: number

  /**
   * Whether free shipping is achieved
   */
  achieved: boolean
}

export interface MiniCartFlyoutProps {
  /**
   * Cart items
   */
  items: MiniCartItem[]

  /**
   * Cart summary (totals)
   */
  summary: CartSummary

  /**
   * Free shipping progress (optional)
   */
  freeShipping?: FreeShippingProgress

  /**
   * Whether the minicart is open
   */
  isOpen: boolean

  /**
   * Callback to close the minicart
   */
  onClose: () => void

  /**
   * Callback when quantity changes
   */
  onQuantityChange: (itemId: string, newQuantity: number) => void

  /**
   * Callback when item is removed
   */
  onRemove: (itemId: string) => void

  /**
   * Callback when checkout button is clicked
   */
  onCheckout: () => void
}
