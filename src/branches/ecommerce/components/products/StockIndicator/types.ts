/**
 * StockIndicator Type Definitions
 */

/**
 * Stock status types
 */
export type StockStatus = 'in-stock' | 'low' | 'out'

/**
 * Stock indicator size variants
 */
export type StockSize = 'small' | 'default' | 'large'

/**
 * StockIndicator Props
 */
export interface StockIndicatorProps {
  /**
   * Stock status (determines color and default text)
   */
  status: StockStatus

  /**
   * Stock quantity (shows exact number if provided)
   */
  quantity?: number

  /**
   * Size variant (default: 'default')
   */
  size?: StockSize

  /**
   * Custom text override (replaces default status text)
   */
  customText?: string

  /**
   * Additional CSS class names
   */
  className?: string
}
