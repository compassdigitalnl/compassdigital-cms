import type { LucideIcon } from 'lucide-react'

export interface AccountStatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  subtitle?: string
  iconBg?: string
  iconColor?: string
}
