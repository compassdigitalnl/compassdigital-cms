/**
 * PONumberInput Type Definitions
 */

/**
 * Component variant types
 */
export type PONumberVariant = 'default' | 'compact'

/**
 * Icon position types
 */
export type IconPosition = 'label' | 'input'

/**
 * PONumberInput Props
 */
export interface PONumberInputProps {
  /**
   * Field name attribute
   * @default "poNumber"
   */
  name?: string

  /**
   * Label text
   * @default "Referentienummer / PO-nummer"
   */
  label?: string

  /**
   * Placeholder text
   * @default "Uw interne referentie voor op de factuur"
   */
  placeholder?: string

  /**
   * Helper text shown below input
   * @default "Dit nummer verschijnt op uw factuur en pakbon voor interne administratie."
   */
  helperText?: string

  /**
   * Maximum character length
   * @default 50
   */
  maxLength?: number

  /**
   * Visual variant
   * @default "default"
   */
  variant?: PONumberVariant

  /**
   * Show file-text icon
   * @default true
   */
  showIcon?: boolean

  /**
   * Icon position (in label or inside input)
   * @default "label"
   */
  iconPosition?: IconPosition

  /**
   * Show B2B badge next to label
   * @default false
   */
  showB2BBadge?: boolean

  /**
   * Current value
   */
  value?: string

  /**
   * Change handler
   */
  onChange?: (value: string) => void

  /**
   * Blur handler
   */
  onBlur?: () => void

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean

  /**
   * Required field (rare - PO numbers are typically optional)
   * @default false
   */
  required?: boolean

  /**
   * Additional CSS class names
   */
  className?: string
}
