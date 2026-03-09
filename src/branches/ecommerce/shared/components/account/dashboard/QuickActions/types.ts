import type { LucideIcon } from 'lucide-react'

export interface QuickAction {
  href?: string
  icon: LucideIcon
  iconBg: string
  cardBg: string
  label: string
  description: string
  onClick?: () => void
  featureFlag?: string
}

export interface QuickActionsProps {
  actions?: QuickAction[]
}
