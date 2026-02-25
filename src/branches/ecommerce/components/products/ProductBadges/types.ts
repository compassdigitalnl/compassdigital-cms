/**
 * ProductBadges Type Definitions
 */

/**
 * Badge variant types (semantic naming)
 */
export type BadgeVariant =
  | 'bestseller'    // Bestseller products (amber)
  | 'nieuw'         // New products (blue)
  | 'uitverkocht'   // Out of stock (coral)
  | 'staffel'       // Volume discount available (green)
  | 'eco'           // Eco-friendly/sustainable (dark green)
  | 'aanbieding'    // Sale/special offer (coral)
  | 'exclusief'     // Exclusive product (navy gradient)
  | 'b2b'           // B2B only (teal)

/**
 * Badge size variants
 */
export type BadgeSize = 'sm' | 'md' | 'lg'

/**
 * Badge position on product card
 */
export type BadgePosition = 'top-left' | 'top-right' | 'ribbon'

/**
 * Badge style (pill or positioned)
 */
export type BadgeStyle = 'pill' | 'positioned'

/**
 * ProductBadge Props
 */
export interface ProductBadgeProps {
  /**
   * Badge variant (determines color and icon)
   */
  variant: BadgeVariant

  /**
   * Custom label text (overrides default variant label)
   */
  label?: string

  /**
   * Show icon (default: true for pill, false for positioned)
   */
  showIcon?: boolean

  /**
   * Badge size (default: 'md')
   */
  size?: BadgeSize

  /**
   * Badge style: 'pill' (standalone) or 'positioned' (on product image)
   * Default: 'pill'
   */
  style?: BadgeStyle

  /**
   * Position on product card (only applies if style='positioned')
   */
  position?: BadgePosition

  /**
   * Make badge clickable (for filters)
   */
  onClick?: () => void

  /**
   * Animated pulsing effect (for bestseller, new, etc.)
   */
  animated?: boolean

  /**
   * Hide from screen readers (set to true if badge is decorative/redundant)
   */
  decorative?: boolean

  /**
   * Additional CSS class names
   */
  className?: string
}

/**
 * Badge configuration (for rendering multiple badges)
 */
export interface BadgeConfig {
  /**
   * Badge variant
   */
  variant: BadgeVariant

  /**
   * Custom label
   */
  label?: string

  /**
   * Priority (for sorting when max badges is exceeded)
   * Lower number = higher priority
   */
  priority?: number
}
