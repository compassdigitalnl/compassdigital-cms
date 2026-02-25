export interface OfferteHeroProps {
  // Content
  badge: string // "B2B SERVICE", "WHOLESALE", etc.
  badgeIcon?: string // Lucide icon name (optional)
  title: string // "Offerte aanvragen"
  description: string // Main message

  // Customization
  responseTime?: string // "24 uur", "1 werkdag" (appended to description)
  maxWidth?: number // Description max-width (default: 560)

  // Accessibility
  ariaLabel?: string
  className?: string
}
