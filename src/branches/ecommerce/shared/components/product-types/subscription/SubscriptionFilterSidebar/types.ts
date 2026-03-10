import * as LucideIcons from 'lucide-react'

export interface FilterSection {
  title: string
  filters: Array<{
    id: string
    label: string
    count?: number
    checked: boolean
  }>
}

export interface SubscriptionFilterSidebarProps {
  title?: string
  titleIcon?: keyof typeof LucideIcons
  sections: FilterSection[]
  onChange: (sectionIndex: number, filterId: string, checked: boolean) => void
  className?: string
}
