import type { LucideIcon } from 'lucide-react'

export interface TrustItem {
  text: string
}

export interface TrustListProps {
  title?: string
  titleIcon?: LucideIcon
  items: TrustItem[]
  className?: string
}
