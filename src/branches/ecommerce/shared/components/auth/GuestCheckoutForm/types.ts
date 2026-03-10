export interface GuestCheckoutFormData {
  firstName: string
  lastName: string
  email: string
  organization?: string
  phone: string
  acceptTerms: boolean
}

export interface GuestCheckoutFormProps {
  onSubmit: (data: GuestCheckoutFormData) => Promise<void>
  onRegisterClick?: () => void
  onTermsClick?: () => void
  onPrivacyClick?: () => void
  title?: string
  subtitle?: string
  showInfoBox?: boolean
  submitButtonText?: string
  registerButtonText?: string
  className?: string
}
