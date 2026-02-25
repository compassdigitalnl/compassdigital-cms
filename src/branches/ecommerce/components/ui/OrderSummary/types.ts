/**
 * OrderSummary Type Definitions
 */

export interface OrderSummaryProps {
  /**
   * Subtotal (before discounts and shipping)
   */
  subtotal: number

  /**
   * Discount amount (positive number, displayed as negative)
   */
  discount?: number

  /**
   * Discount code applied (e.g., "SUMMER10")
   */
  discountCode?: string

  /**
   * Shipping cost (number or 'free')
   */
  shipping: number | 'free'

  /**
   * Tax amount (e.g., 21% BTW)
   */
  tax: number

  /**
   * Grand total (subtotal - discount + shipping)
   */
  total: number

  /**
   * Show "Offerte aanvragen" button (default: true)
   */
  showQuoteButton?: boolean

  /**
   * Apply sticky positioning for sidebar (default: false)
   */
  sticky?: boolean

  /**
   * Hide action buttons (read-only mode, e.g., order confirmation)
   */
  readonly?: boolean

  /**
   * Tax rate percentage (default: 21)
   */
  taxRate?: number

  /**
   * Tax label override (default: "BTW (21%)")
   */
  taxLabel?: string

  /**
   * Currency symbol (default: '€')
   */
  currencySymbol?: string

  /**
   * Locale for number formatting (default: 'nl-NL')
   */
  locale?: string

  /**
   * Callback when checkout button is clicked
   */
  onCheckout?: () => void

  /**
   * Callback when request quote button is clicked
   */
  onRequestQuote?: () => void

  /**
   * Additional CSS class names
   */
  className?: string
}
