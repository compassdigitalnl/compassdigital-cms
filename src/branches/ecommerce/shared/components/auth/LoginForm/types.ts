import type { OAuthProvider } from '../OAuthButtons/types'

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  onOAuthLogin?: (provider: OAuthProvider) => void
  onForgotPassword?: () => void
  onRegisterClick?: () => void
  title?: string
  subtitle?: string
  showOAuth?: boolean
  oauthProviders?: OAuthProvider[]
  registerLinkText?: string
  className?: string
}
