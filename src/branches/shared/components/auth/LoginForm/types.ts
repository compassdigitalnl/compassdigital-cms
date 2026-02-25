export interface LoginFormValues {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void | Promise<void>
  onForgotPassword?: () => void
  onOAuthClick?: (provider: string) => void
  onRegisterClick?: () => void
  className?: string
  showOAuth?: boolean
}
