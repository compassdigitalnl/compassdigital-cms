/**
 * PaymentMethodCard Type Definitions
 */

/**
 * Payment method slug types
 */
export type PaymentMethodSlug = 'ideal' | 'creditcard' | 'paypal' | 'invoice' | 'banktransfer'

/**
 * Payment method data
 */
export interface PaymentMethod {
  /**
   * Unique ID
   */
  id: string

  /**
   * Display name (e.g., "iDEAL", "Credit Card")
   */
  name: string

  /**
   * Method slug (ideal/creditcard/paypal/invoice/banktransfer)
   */
  slug: PaymentMethodSlug

  /**
   * Payment description (e.g., "Direct betalen via je bank")
   */
  description: string

  /**
   * Logo (emoji, icon component, or image URL)
   */
  logo: string | React.ReactNode

  /**
   * Whether this is a B2B-only payment method
   */
  isB2B?: boolean

  /**
   * Whether this method is active
   */
  isActive?: boolean

  /**
   * Transaction fee (optional, e.g., "€0.29")
   */
  fee?: string

  /**
   * Custom badge (e.g., "Populair", "Snel")
   */
  badge?: string
}

/**
 * PaymentMethodCard Props
 */
export interface PaymentMethodCardProps {
  /**
   * Payment method data
   */
  method: PaymentMethod

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
   * Additional CSS class names
   */
  className?: string
}
