export type OAuthProvider = 'google' | 'facebook' | 'apple'

export interface OAuthButtonsProps {
  providers?: OAuthProvider[]
  onProviderClick: (provider: OAuthProvider) => void
  showDivider?: boolean
  dividerText?: string
  className?: string
}
