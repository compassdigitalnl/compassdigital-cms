/**
 * QuantityStepper Type Definitions
 */

export type QuantitySize = 'sm' | 'md' | 'lg'

export interface QuantityStepperProps {
  /**
   * Current quantity value
   */
  value: number

  /**
   * Callback when quantity changes
   */
  onChange: (newValue: number) => void

  /**
   * Minimum allowed quantity
   * @default 1
   */
  min?: number

  /**
   * Maximum allowed quantity (e.g., stock limit)
   * @default 999
   */
  max?: number

  /**
   * Size variant
   * - sm: 30×36px (product cards, quick-add)
   * - md: 36×40px (cart items, default)
   * - lg: 42×48px (hero sections, primary CTAs)
   * @default 'md'
   */
  size?: QuantitySize

  /**
   * Use pill-style rounded borders
   * @default false
   */
  rounded?: boolean

  /**
   * Disable all interactions (out of stock, processing)
   * @default false
   */
  disabled?: boolean

  /**
   * ARIA label for screen readers
   * @default 'Quantity'
   */
  ariaLabel?: string

  /**
   * Additional CSS class names
   */
  className?: string
}
