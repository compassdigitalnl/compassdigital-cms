/**
 * AddressForm Type Definitions
 */

/**
 * Address data structure
 */
export interface Address {
  /**
   * First name
   */
  firstName: string

  /**
   * Last name
   */
  lastName: string

  /**
   * Street address with house number
   */
  street: string

  /**
   * Address addition (apartment, floor, etc.) - optional
   */
  addition?: string

  /**
   * Postal code (format depends on country)
   */
  postalCode: string

  /**
   * City name
   */
  city: string

  /**
   * Country code (ISO 2-letter)
   */
  country: string
}

/**
 * Saved address entry (for B2B customers)
 */
export interface SavedAddress {
  /**
   * Unique address ID
   */
  id: string

  /**
   * Display label (e.g., "Hoofdlocatie", "Magazijn")
   */
  label: string

  /**
   * Address data
   */
  address: Address

  /**
   * Whether this is the default address
   */
  isDefault?: boolean
}

/**
 * Validation error map
 */
export type ValidationErrors = Record<string, string>

/**
 * AddressForm Props
 */
export interface AddressFormProps {
  /**
   * Initial address values
   */
  initialValues?: Partial<Address>

  /**
   * Saved addresses (B2B only)
   */
  savedAddresses?: SavedAddress[]

  /**
   * Show saved addresses dropdown (B2B feature)
   */
  showSavedAddresses?: boolean

  /**
   * Enable postcode autocomplete (NL only)
   * @default true
   */
  enableAutocomplete?: boolean

  /**
   * Form submission handler
   */
  onSubmit: (address: Address) => void

  /**
   * Validation handler (optional)
   */
  onValidate?: (errors: ValidationErrors) => void

  /**
   * Change handler (for controlled forms)
   */
  onChange?: (address: Partial<Address>) => void

  /**
   * Whether form is currently submitting
   */
  isSubmitting?: boolean

  /**
   * Required fields override
   * @default ['firstName', 'lastName', 'street', 'postalCode', 'city', 'country']
   */
  requiredFields?: (keyof Address)[]

  /**
   * Section title
   * @default "Afleveradres"
   */
  title?: string

  /**
   * Submit button label. Set to false to hide button.
   * @default "Opslaan en doorgaan"
   */
  submitLabel?: string | false

  /**
   * Additional CSS class names
   */
  className?: string
}
