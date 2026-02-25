export interface GuestCheckoutFormValues {
  email: string
  firstName: string
  lastName: string
  phone?: string
  acceptTerms: boolean
}

export interface GuestCheckoutFormProps {
  /** Form submission handler */
  onSubmit?: (values: GuestCheckoutFormValues) => void | Promise<void>
  /** Callback when user clicks "create account" link */
  onRegisterClick?: () => void
  /** Additional CSS classes */
  className?: string
}
