import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
  requiresFeature: string | null
}

export interface AccountSidebarSharedProps {
  userName: string
  userInitials: string
  userCompany?: string
  memberSinceDate: string
  navigation: NavigationItem[]
  pathname: string | null
  onLogout: () => void
}

export interface AccountMobileNavProps extends AccountSidebarSharedProps {
  mobileMenuOpen: boolean
  onToggleMobileMenu: () => void
}

export type AccountDesktopSidebarProps = AccountSidebarSharedProps
