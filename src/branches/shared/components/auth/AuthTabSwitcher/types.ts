import { ReactNode } from 'react'

export type AuthTab = 'login' | 'register' | 'guest'

export interface AuthTabConfig {
  id: AuthTab
  label: string
}

export interface AuthTabSwitcherProps {
  activeTab?: AuthTab
  onTabChange?: (tab: AuthTab) => void
  loginContent?: ReactNode
  registerContent?: ReactNode
  guestContent?: ReactNode
  className?: string
  tabs?: AuthTabConfig[]
}
