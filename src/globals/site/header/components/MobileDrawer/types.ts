import type { Header, Theme1, Setting } from '@/payload-types'

export type NavItem = {
  id?: string | null
  label: string
  icon?: string | null
  type?: 'page' | 'external' | 'mega' | null
  page?: unknown
  url?: string | null
  children?: NavItem[]
  megaColumns?: Array<{
    title?: string | null
    links?: Array<{
      label: string
      url: string
      icon?: string | null
      description?: string | null
      id?: string | null
    }>
    id?: string | null
  }>
}

export type SpecialNavItem = {
  label: string
  icon?: string | null
  url: string
  highlight?: boolean | null
  id?: string | null
}

export type MobileDrawerProps = {
  isOpen: boolean
  onClose: () => void
  header: Header
  navigation?: {
    mode: string
    items?: NavItem[]
    specialItems?: SpecialNavItem[]
    ctaButton?: { label: string; url: string } | null
  } | null
  theme: Theme1 | null
  settings?: Setting | null
  onOpenSearch?: () => void
  // Mobile settings from mapped data
  drawerWidth?: number
  drawerPosition?: 'left' | 'right'
  showContactInfo?: boolean
  contactInfoOverride?: { phone?: string; email?: string }
  showToggles?: boolean
}
