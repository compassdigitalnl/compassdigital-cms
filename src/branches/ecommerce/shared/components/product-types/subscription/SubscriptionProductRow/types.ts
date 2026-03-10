import * as LucideIcons from 'lucide-react'

export interface Badge {
  label: string
  variant: 'popular' | 'personal' | 'gift'
  icon?: keyof typeof LucideIcons
}

export interface SubscriptionProductRowProps {
  id: string
  icon?: string
  emoji?: string
  title?: string
  badges?: Badge[]
  editionCount?: number
  frequency?: string
  pricePerMonth?: number
  totalPrice?: number
  savingsPercent?: number
  onSubscribe?: (id: string) => void
  onLearnMore?: (id: string) => void
  className?: string
}
