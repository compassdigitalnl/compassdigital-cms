export interface TabItem {
  id: string
  label: string
  icon?: string
  count?: number
}

export interface ExperienceTabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  children: React.ReactNode
  className?: string
}
