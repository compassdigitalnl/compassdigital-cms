/**
 * ShippingMethodCard Type Definitions
 */

/**
 * Shipping method slug types
 */
export type ShippingMethodSlug = 'standard' | 'express' | 'pickup' | 'same-day'

/**
 * Shipping method icon types
 */
export type ShippingMethodIcon = 'truck' | 'zap' | 'package' | 'clock'

/**
 * Shipping method data
 */
export interface ShippingMethod {
  /**
   * Unique ID
   */
  id: string

  /**
   * Display name
   */
  name: string

  /**
   * Method slug (standard/express/pickup/same-day)
   */
  slug: ShippingMethodSlug

  /**
   * Icon type (truck/zap/package/clock)
   */
  icon: ShippingMethodIcon

  /**
   * Delivery time description (e.g., "1-2 werkdagen")
   */
  deliveryTime: string

  /**
   * Shipping price in euros
   */
  price: number

  /**
   * Whether this method is free
   */
  isFree?: boolean

  /**
   * Estimated delivery days (for date calculation)
   */
  estimatedDays?: number

  /**
   * Whether this method is active
   */
  isActive?: boolean

  /**
   * Free shipping threshold (free above this cart total)
   */
  freeThreshold?: number
}

/**
 * ShippingMethodCard Props
 */
export interface ShippingMethodCardProps {
  /**
   * Shipping method data
   */
  method: ShippingMethod

  /**
   * Whether this method is currently selected
   */
  selected: boolean

  /**
   * Select handler
   */
  onSelect: (methodId: string) => void

  /**
   * Whether the card is disabled
   */
  disabled?: boolean

  /**
   * Currency symbol (default: "€")
   */
  currencySymbol?: string

  /**
   * Additional CSS class names
   */
  className?: string
}
