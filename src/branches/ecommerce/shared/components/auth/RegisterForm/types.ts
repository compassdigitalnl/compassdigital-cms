import type { OAuthProvider } from '../OAuthButtons/types'

export interface RegisterFormData {
  firstName: string
  lastName: string
  organization: string
  kvkNumber?: string
  email: string
  phone?: string
  password: string
  acceptTerms: boolean
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  onOAuthRegister?: (provider: OAuthProvider) => void
  onLoginClick?: () => void
  onTermsClick?: () => void
  title?: string
  subtitle?: string
  showOAuth?: boolean
  oauthProviders?: OAuthProvider[]
  showB2BNotice?: boolean
  b2bNoticeVariant?: 'info' | 'pending' | 'approved'
  loginLinkText?: string
  requireKvk?: boolean
  className?: string
}
