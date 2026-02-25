export type EmailBannerVariant = 'info' | 'success' | 'warning' | 'error'

export interface EmailBannerLink {
  text: string
  href?: string
  onClick?: () => void
}

export interface EmailConfirmationBannerProps {
  message: string | React.ReactNode
  email?: string // Optional: email address to highlight (will be bolded)
  variant?: EmailBannerVariant // Default: 'info'
  icon?: string // Lucide icon name (defaults by variant: mail, check-circle, alert-triangle, x-circle)
  showClose?: boolean // Show close button (default: false)
  onClose?: () => void // Close button handler
  compact?: boolean // Use compact styling (default: false)
  link?: EmailBannerLink // Optional inline link (e.g., "Mail niet ontvangen?")
  className?: string
}
