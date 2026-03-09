/**
 * FreeShippingProgress Type Definitions
 */

export interface FreeShippingProgressBarProps {
  /**
   * Current cart total (before shipping)
   */
  currentTotal: number

  /**
   * Free shipping threshold amount
   */
  threshold: number

  /**
   * Currency symbol (default: '€')
   */
  currencySymbol?: string

  /**
   * Locale for number formatting (default: 'nl-NL')
   */
  locale?: string

  /**
   * Show threshold text below progress bar (default: true)
   */
  showThresholdText?: boolean

  /**
   * Custom threshold text override
   */
  thresholdText?: string

  /**
   * Custom achieved message override
   */
  achievedText?: string

  /**
   * Additional CSS class names
   */
  className?: string
}
