/**
 * CartLineItem Type Definitions
 */

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export interface CartProduct {
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
   * Product SKU
   */
  sku?: string

  /**
   * Product variant (e.g., "Maat: L", "Color: Blue")
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
   * Stock status
   */
  stockStatus?: StockStatus

  /**
   * Available stock quantity (optional, shown in low-stock state)
   */
  stockQuantity?: number
}

export interface CartLineItemProps {
  /**
   * Product data
   */
  product: CartProduct

  /**
   * Current quantity in cart
   */
  quantity: number

  /**
   * Callback when quantity changes
   */
  onQuantityChange: (newQuantity: number) => void

  /**
   * Callback when item is removed from cart
   */
  onRemove: () => void

  /**
   * Optional callback to add item to a list
   */
  onAddToList?: () => void

  /**
   * Additional CSS class names
   */
  className?: string
}
