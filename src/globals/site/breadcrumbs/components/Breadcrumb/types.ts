import type { LucideIcon } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: LucideIcon
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  variant?: 'default' | 'pills' | 'icons'
  className?: string
}
