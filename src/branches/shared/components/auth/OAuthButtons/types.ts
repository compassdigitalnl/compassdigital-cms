export type OAuthProvider = 'google' | 'microsoft' | 'apple'

export interface OAuthButtonsProps {
  providers?: OAuthProvider[]
  onProviderClick?: (provider: OAuthProvider) => void | Promise<void>
  className?: string
  showDivider?: boolean
  dividerText?: string
}
