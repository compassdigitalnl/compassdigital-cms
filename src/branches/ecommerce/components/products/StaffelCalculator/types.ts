/**
 * StaffelCalculator Type Definitions
 */

/**
 * Volume pricing tier
 */
export interface VolumePriceTier {
  /**
   * Minimum quantity for this tier
   */
  min: number

  /**
   * Maximum quantity for this tier (use Infinity for last tier)
   */
  max: number

  /**
   * Price per unit at this tier
   */
  price: number

  /**
   * Discount percentage (vs. base price)
   */
  discount: number
}

/**
 * StaffelCalculator Props
 */
export interface StaffelCalculatorProps {
  /**
   * Product name
   */
  productName: string

  /**
   * Base price (first tier price, for savings calculation)
   */
  basePrice: number

  /**
   * Volume pricing tiers
   */
  tiers: VolumePriceTier[]

  /**
   * Initial quantity
   */
  initialQty?: number

  /**
   * Unit name (default: "stuks")
   */
  unit?: string

  /**
   * Currency symbol (default: "€")
   */
  currencySymbol?: string

  /**
   * Quantity change callback
   */
  onQtyChange?: (qty: number, total: number, tier: VolumePriceTier) => void

  /**
   * Additional CSS class names
   */
  className?: string
}
