export interface ProTipBannerProps {
  tip: string // Main tip text
  label?: string // Label text, default "Pro tip:"
  icon?: string // Lucide icon name, default "lightbulb"
  variant?: 'default' | 'compact'
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}
