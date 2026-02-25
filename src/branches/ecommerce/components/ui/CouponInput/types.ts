/**
 * CouponInput Type Definitions
 */

export interface AppliedCoupon {
  /**
   * Coupon code (e.g., "SUMMER10")
   */
  code: string

  /**
   * Discount amount applied
   */
  discountAmount: number
}

export interface CouponInputProps {
  /**
   * Applied coupon (if any)
   */
  appliedCoupon?: AppliedCoupon

  /**
   * Loading state (during validation)
   */
  isLoading?: boolean

  /**
   * Error message (if validation failed)
   */
  errorMessage?: string

  /**
   * Currency symbol (default: '€')
   */
  currencySymbol?: string

  /**
   * Callback when user submits a coupon code
   */
  onApply: (code: string) => void | Promise<void>

  /**
   * Callback when user removes applied coupon
   */
  onRemove?: () => void

  /**
   * Input placeholder text (default: "Kortingscode")
   */
  placeholder?: string

  /**
   * Button text (default: "Toepassen")
   */
  buttonText?: string

  /**
   * Auto-uppercase input (default: true)
   */
  autoUppercase?: boolean

  /**
   * Additional CSS class names
   */
  className?: string
}
