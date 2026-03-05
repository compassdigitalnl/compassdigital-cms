import type { LucideIcon } from 'lucide-react'

export interface BranchStat {
  value: string
  label: string
}

export interface BranchHeroProps {
  badge?: string
  title: string
  description?: string
  icon?: LucideIcon
  stats?: BranchStat[]
  className?: string
}
