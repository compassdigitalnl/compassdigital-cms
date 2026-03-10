import * as LucideIcons from 'lucide-react'

export interface FilterTab {
  id: string
  label: string
  icon?: keyof typeof LucideIcons
  count?: number
}

export interface SubscriptionFilterTabsProps {
  tabs: FilterTab[]
  activeId: string
  onChange: (tabId: string) => void
  showCounts?: boolean
  className?: string
}
