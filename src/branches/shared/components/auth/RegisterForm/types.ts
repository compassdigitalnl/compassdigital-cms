export interface RegisterFormValues {
  firstName: string
  lastName: string
  organization: string
  kvkNumber?: string
  email: string
  phone: string
  password: string
  acceptTerms: boolean
}

export interface RegisterFormProps {
  onSubmit?: (values: RegisterFormValues) => void | Promise<void>
  onOAuthClick?: (provider: string) => void
  onLoginClick?: () => void
  className?: string
  showOAuth?: boolean
  showB2BNotice?: boolean
}
