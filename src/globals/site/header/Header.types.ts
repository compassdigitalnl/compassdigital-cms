/**
 * TypeScript interfaces for Header Global configuration
 * Used for navigation components, topbar, search, and mobile drawer
 */

import type { Media, Page } from '@/payload-types'

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT & THEME
// ─────────────────────────────────────────────────────────────────────────────

export type HeaderLayoutType = 'mega-nav' | 'single-row' | 'minimal'

export interface HeaderThemeColors {
  useThemeColors: boolean
  topbarBg?: string // CSS var or hex (e.g., 'var(--color-primary)' or '#0A1628')
  headerBg?: string
  navBg?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────

export interface TopbarMessage {
  icon?: string // Lucide icon name
  text: string
  link?: string
}

export interface TopbarLink {
  label: string
  link: string
}

export interface TopbarConfig {
  enabled: boolean
  backgroundColor?: string
  textColor?: string
  leftMessages?: TopbarMessage[]
  rightLinks?: TopbarLink[]
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE SWITCHER
// ─────────────────────────────────────────────────────────────────────────────

export interface Language {
  code: string // 'NL', 'EN', 'DE'
  label: string // 'Nederlands', 'English', 'Deutsch'
  flag?: string // '🇳🇱', '🇬🇧', '🇩🇪'
  isDefault?: boolean
}

export interface LanguageSwitcherConfig {
  enabled: boolean
  languages?: Language[]
  variant?: 'buttons' | 'dropdown' // Buttons for 2-3 langs, dropdown for 4+
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICE TOGGLE (B2B/B2C)
// ─────────────────────────────────────────────────────────────────────────────

export interface PriceToggleConfig {
  enabled: boolean
  defaultMode?: 'b2c' | 'b2b' // Default price mode
  b2cLabel?: string // Default: 'Particulier'
  b2bLabel?: string // Default: 'Zakelijk'
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────────────────────────────────────

export interface LogoConfig {
  logoOverride?: Media | string // Upload or media ID
  logoHeight?: number // Default: 32px
  logoUrl?: string // Default: '/'
  siteNameOverride?: string
  siteNameAccent?: string // Part of name to highlight
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchCategory {
  label: string
  url: string
  icon?: string
}

export interface SearchConfig {
  enableSearch: boolean
  searchPlaceholder?: string
  searchKeyboardShortcut?: string // Default: '⌘K'
  enableSearchSuggestions?: boolean
  searchCategories?: SearchCategory[] // Quick links below search
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export type ActionType = 'search' | 'cart' | 'account' | 'wishlist' | 'compare' | 'custom'

export interface HeaderAction {
  icon: string // Lucide icon name
  action: ActionType
  customUrl?: string // Only for action: 'custom'
  showBadge?: boolean // Show count badge (e.g., cart items)
  showOnMobile?: boolean
  label?: string // Accessibility label
}

export interface HeaderActionsConfig {
  actions?: HeaderAction[]
  customButtons?: CustomButton[] // Legacy support
}

export interface CustomButton {
  label: string
  url: string
  icon?: string
  style?: 'default' | 'primary' | 'secondary'
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

export type NavItemType = 'link' | 'mega' | 'branches'
export type NavigationMode = 'manual' | 'categories' | 'hybrid'

export interface NavLink {
  label: string
  url: string
  icon?: string
  description?: string
}

export interface MegaMenuColumn {
  title?: string
  links?: NavLink[]
  showPromoCard?: boolean
  promoProduct?: string // Product ID or relationship
}

export interface BranchItem {
  name: string
  emoji: string // '🏥', '🏭', etc.
  iconBg?: string // CSS var or hex for icon background
  productCount?: number
  url: string
}

export interface NavItem {
  label: string
  icon?: string
  type: NavItemType

  // For type: 'link'
  url?: string

  // For type: 'mega'
  megaColumns?: MegaMenuColumn[]

  // For type: 'branches'
  branches?: BranchItem[]
}

export interface SpecialNavItem {
  label: string
  icon?: string
  url: string
  highlight?: boolean // Show in accent color
  position?: 'start' | 'end' // Left or right in nav
}

export interface CategoryNavigationSettings {
  showIcons?: boolean
  showProductCount?: boolean
  megaMenuStyle?: 'subcategories' | 'with-products' | 'full'
  maxItems?: number // Max categories in navbar (1-20)
  maxProductsInMegaMenu?: number // Max products per category (1-6)
}

export interface CTAButton {
  text?: string
  link?: string
  show?: boolean
}

export interface NavigationConfig {
  mode: NavigationMode
  categorySettings?: CategoryNavigationSettings
  specialItems?: SpecialNavItem[]
  items?: NavItem[] // Manual items (for manual/hybrid modes)
  ctaButton?: CTAButton
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE DRAWER
// ─────────────────────────────────────────────────────────────────────────────

export interface MobileContactInfo {
  phone?: string
  email?: string
}

export interface MobileDrawerConfig {
  drawerWidth?: number // Default: 320px
  contactInfo?: MobileContactInfo
  showToggles?: boolean // Show price/language toggles in footer
}

// ─────────────────────────────────────────────────────────────────────────────
// ALERT BAR
// ─────────────────────────────────────────────────────────────────────────────

export type AlertType = 'info' | 'success' | 'warning' | 'error' | 'promo'

export interface AlertBarSchedule {
  useSchedule?: boolean
  startDate?: string
  endDate?: string
}

export interface AlertBarCustomColors {
  useCustomColors?: boolean
  backgroundColor?: string
  textColor?: string
}

export interface AlertBarLink {
  enabled?: boolean
  label?: string
  url?: string
}

export interface AlertBarConfig {
  enabled: boolean
  message?: string
  type?: AlertType
  icon?: string
  link?: AlertBarLink
  dismissible?: boolean
  schedule?: AlertBarSchedule
  customColors?: AlertBarCustomColors
}

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIOR
// ─────────────────────────────────────────────────────────────────────────────

export interface HeaderBehavior {
  stickyHeader?: boolean
  showShadow?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HEADER CONFIG (combines all)
// ─────────────────────────────────────────────────────────────────────────────

export interface HeaderConfig {
  // Layout
  layoutType?: HeaderLayoutType
  showTopbar?: boolean // Quick toggle (uses topBar.enabled)
  showSearchBar?: boolean // Quick toggle (uses enableSearch)

  // Theme
  theme?: HeaderThemeColors

  // Components
  topBar?: TopbarConfig
  alertBar?: AlertBarConfig
  logo?: LogoConfig
  search?: SearchConfig
  languageSwitcher?: LanguageSwitcherConfig
  priceToggle?: PriceToggleConfig
  headerActions?: HeaderActionsConfig
  navigation?: NavigationConfig
  mobile?: MobileDrawerConfig
  behavior?: HeaderBehavior

  // Legacy fields (keep for backward compatibility)
  enableSearch?: boolean
  searchPlaceholder?: string
  showPhone?: boolean
  showWishlist?: boolean
  showAccount?: boolean
  showCart?: boolean
  stickyHeader?: boolean
  showShadow?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMO CARD (for mega menu)
// ─────────────────────────────────────────────────────────────────────────────

export interface PromoCard {
  enabled: boolean
  title?: string
  description?: string
  image?: Media | string
  badge?: string // 'NIEUW', 'SALE', etc.
  badgeColor?: string // CSS var or hex
  link?: string
  buttonText?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type LucideIconName = string // Type alias for Lucide icon names

// Helper type for conditional rendering based on layout type
export type ComponentVisibility = {
  showOnMegaNav: boolean
  showOnSingleRow: boolean
  showOnMinimal: boolean
}
