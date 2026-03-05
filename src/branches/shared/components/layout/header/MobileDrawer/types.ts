import type { Header, Theme1, Setting } from '@/payload-types'

export type MobileDrawerProps = {
  isOpen: boolean
  onClose: () => void
  header: Header
  navigation?: {
    mode: string
    items?: any[]
    specialItems?: any[]
    ctaButton?: any
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
