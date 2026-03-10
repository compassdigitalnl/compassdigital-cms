import type * as LucideIcons from 'lucide-react'

export interface Category {
  id: string
  label: string
  icon?: keyof typeof LucideIcons
  emoji?: string
  count: number
}

export interface MixMatchCategoryFilterProps {
  categories: Category[]
  activeId: string
  onChange: (categoryId: string) => void
  showCounts?: boolean
  className?: string
}
