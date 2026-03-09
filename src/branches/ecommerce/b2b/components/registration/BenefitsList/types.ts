import type { LucideIcon } from 'lucide-react'

export interface Benefit {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  title: string
  description: string
}

export interface BenefitsListProps {
  title?: string
  titleIcon?: LucideIcon
  benefits: Benefit[]
  className?: string
}
