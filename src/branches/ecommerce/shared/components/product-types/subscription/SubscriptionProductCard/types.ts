import * as LucideIcons from 'lucide-react'

export interface Badge {
  label: string
  variant: 'popular' | 'personal' | 'gift'
  icon?: keyof typeof LucideIcons
}

export interface SubscriptionProductCardProps {
  id: string
  icon?: string
  emoji?: string
  title: string
  description: string
  badges?: Badge[]
  frequency?: string
  editionCount?: number
  pricePerMonth?: number
  totalPrice?: number
  savingsPercent?: number
  features?: string[]
  onSubscribe?: (id: string) => void
  onLearnMore?: (id: string) => void
  className?: string
}
