export type SuccessHeroVariant = 'default' | 'compact'

export interface SuccessHeroProps {
  // Order details
  orderNumber: string // e.g., "PL-2024-00142"

  // Content
  title?: string // Default: "Bedankt voor je bestelling!"
  description?: string // Default: "Je bestelling is succesvol..."
  orderNumberLabel?: string // Default: "Ordernummer:"

  // Animation control
  enableAnimation?: boolean // Default: true

  // Styling
  variant?: SuccessHeroVariant // Default: 'default'
  className?: string
}
