import type { LucideIcon } from 'lucide-react'

export interface BranchCategory {
  name: string
  slug: string
  icon: LucideIcon
  iconBg: string
  productCount: number
}

export interface BranchCategoryGridProps {
  title?: string
  titleIcon?: LucideIcon
  categories: BranchCategory[]
  branchSlug: string
  className?: string
}
