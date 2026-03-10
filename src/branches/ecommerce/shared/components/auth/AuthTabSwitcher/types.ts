export type TabId = 'login' | 'register' | 'guest'

export interface Tab {
  id: TabId
  label: string
}

export interface AuthTabSwitcherProps {
  activeTab: TabId
  onChange: (tab: TabId) => void
  tabs?: Tab[]
  className?: string
}
