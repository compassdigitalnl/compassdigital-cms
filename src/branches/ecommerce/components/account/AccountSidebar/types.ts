export interface UserProfile {
  name: string
  company?: string
  avatarUrl?: string
  initials?: string // e.g., "JD" for "John Doe"
  memberSince: string // ISO 8601 timestamp
}

export interface NavigationLink {
  label: string
  href: string
  icon: string // Lucide icon name (e.g., "user", "package", "heart")
  badge?: number // Notification count
  isActive?: boolean
}

export interface AccountSidebarProps {
  user: UserProfile
  navigationLinks: NavigationLink[]
  onLogout?: () => void | Promise<void>
  className?: string
}
