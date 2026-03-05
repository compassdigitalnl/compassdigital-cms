import type { LucideIcon } from 'lucide-react'

export interface BranchOption {
  id: string
  label: string
  icon: LucideIcon
}

export interface BranchSelectorProps {
  options: BranchOption[]
  selected?: string | null
  onSelect: (id: string) => void
  className?: string
}
