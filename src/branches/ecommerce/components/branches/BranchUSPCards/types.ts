import type { LucideIcon } from 'lucide-react'

export interface USPCard {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  title: string
  description: string
}

export interface BranchUSPCardsProps {
  cards: USPCard[]
  className?: string
}
