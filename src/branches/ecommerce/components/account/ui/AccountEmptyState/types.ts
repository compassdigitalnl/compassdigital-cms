import type { LucideIcon } from 'lucide-react'

export interface AccountEmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}
