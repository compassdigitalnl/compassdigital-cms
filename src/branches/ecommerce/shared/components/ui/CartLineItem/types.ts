/**
 * CartLineItem Type Definitions
 */

export type StockStatus = 'in-stock' | 'low-stock' | 'on-backorder' | 'out-of-stock'

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

  /**
   * Tax class for BTW calculation
   */
  taxClass?: 'standard' | 'reduced' | 'zero'
}

/** Booking/personalization/configurator metadata passed alongside cart items */
export interface CartItemMeta {
  booking?: {
    date?: string
    time?: string
    duration?: string
    participants?: Array<{ category: string; count: number; price: number }>
    addOns?: Array<{ label: string; price: number }>
    totalPrice?: number
    summary?: string
  }
  personalization?: {
    values?: Record<string, { fieldName: string; value: string | null }>
    personalizationCost?: number
    rushEnabled?: boolean
    rushFee?: number
    totalPrice?: number
    summary?: string
  }
  configuration?: {
    selections?: Record<string, { name: string; price: number }>
    totalPrice?: number
    summary?: string
  }
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
   * Special product type metadata (booking, personalization, configurator)
   */
  meta?: CartItemMeta

  /**
   * Additional CSS class names
   */
  className?: string
}
