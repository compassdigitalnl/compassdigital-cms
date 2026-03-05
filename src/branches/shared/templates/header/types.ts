import type { Header, Theme1, Setting } from '@/payload-types'

export type HeaderTemplateProps = {
  header: Header
  theme: Theme1 | null
  settings: Setting | null
  mapped: MappedHeaderData
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  openSearch: () => void
  openCart: () => void
  itemCount: number
  priceMode: 'b2c' | 'b2b'
  togglePriceMode: (mode: 'b2c' | 'b2b') => void
}

export type MappedHeaderData = {
  topBar: {
    enabled: boolean
    backgroundColor?: string
    textColor?: string
    leftMessages: any[]
    rightLinks: any[]
  }
  alertBar: {
    enabled: boolean
    message: string
    type: 'info' | 'success' | 'warning' | 'error' | 'promo'
    icon?: string
    link: any
    dismissible: boolean
    schedule: any
    customColors: any
  }
  navigation: {
    mode: string
    items: any[]
    specialItems: any[]
    ctaButton?: any
    categoryNavigation?: any
  } | null
  logoOverride?: any
  siteNameOverride?: string
  siteNameAccent?: string
  enableSearch: boolean
  searchPlaceholder: string
  enablePriceToggle: boolean
  priceToggle: {
    defaultMode: 'b2c' | 'b2b'
    b2cLabel: string
    b2bLabel: string
  }
  showPhone: boolean
  showCart: boolean
  showAccount: boolean
  showWishlist: boolean
  customButtons: any[]
  stickyHeader: boolean
  showShadow: boolean
}
