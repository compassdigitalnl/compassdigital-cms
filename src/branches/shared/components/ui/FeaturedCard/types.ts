export interface FeaturedCardProps {
  title: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  badge?: string
  meta?: Array<{ icon?: string; text: string }>
  href: string
  ctaText?: string
  className?: string
}
