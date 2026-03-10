export interface TrustBadge {
  icon: string | React.ReactNode // Emoji or Lucide icon
  label: string
}

export interface TrustBadgesProps {
  badges?: TrustBadge[]
  variant?: 'horizontal' | 'vertical'
  className?: string
}
