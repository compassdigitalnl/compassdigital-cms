'use client'

import { CMSLink } from '@/branches/shared/components/common/Link'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'
import type { Header as HeaderType, Theme1 } from '@/payload-types'

import {
  Search,
  ShoppingCart,
  User,
  Heart,
  ClipboardList,
  Phone,
  Mail,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Clock,
  Truck,
  Shield,
  ShieldCheck,
  BadgeCheck,
  Award,
  CheckCircle,
  CreditCard,
  Lock,
  Zap,
  Gift,
  RefreshCw,
  Users,
  AlertCircle,
  Info,
  Bell,
  Megaphone,
  Flame,
  Star,
  Sparkles,
  Package,
  Tag,
  Building2,
  FileText,
  Home,
} from 'lucide-react'

import { TopBar } from './TopBar'
import { AlertBar } from './AlertBar'
import { MobileDrawer } from './MobileDrawer'
import { NavigationBar } from './NavigationBar'
import { useSearch } from '@/branches/shared/components/features/search/search/SearchProvider'
import { useMiniCart } from '@/branches/ecommerce/components/ui/MiniCart'
import type { Setting } from '@/payload-types'

type Props = {
  header: HeaderType | null
  theme?: Theme1 | null
  settings?: Setting | null
}

// Icon mapping helper
const iconMap: Record<string, React.ComponentType<any>> = {
  BadgeCheck,
  Truck,
  Shield,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Clock,
  MapPin,
  CheckCircle,
  CreditCard,
  Lock,
  Zap,
  Gift,
  RefreshCw,
  Users,
  AlertCircle,
  Info,
  Bell,
  Megaphone,
  Flame,
  Star,
  Sparkles,
  Package,
  Tag,
  Building2,
  FileText,
  Home,
  Search,
  ShoppingCart,
  User,
  Heart,
  ClipboardList,
}

// Adapter: maps flat CMS v2 fields to nested objects expected by child components
function mapHeaderData(header: any) {
  return {
    // TopBar — nested object from flat fields
    topBar: {
      enabled: header.topbarEnabled ?? header.showTopbar ?? false,
      backgroundColor: header.topbarBgColor || undefined,
      textColor: header.topbarTextColor || undefined,
      leftMessages: header.topbarMessages || [],
      rightLinks: header.topbarRightLinks || [],
    },

    // AlertBar — nested object from flat fields
    alertBar: {
      enabled: header.alertBarEnabled ?? header.showAlertBar ?? false,
      message: header.alertBarMessage || '',
      type: header.alertBarType || 'info',
      icon: header.alertBarIcon || undefined,
      link: header.alertBarLink || {},
      dismissible: header.alertBarDismissible ?? true,
      schedule: header.alertBarSchedule || {},
      customColors: header.alertBarCustomColors || {},
    },

    // Navigation — nested object from flat fields
    navigation: (header.showNavigation !== false) ? {
      mode: header.navigationMode || 'manual',
      items: header.manualNavItems || [],
      specialItems: header.specialNavItems || [],
      ctaButton: header.ctaButton
        ? { ...header.ctaButton, show: header.ctaButton.enabled }
        : undefined,
      categoryNavigation: header.categoryNavigation || {},
    } : null,

    // Logo — renamed fields
    logoOverride: header.logo || undefined,
    siteNameOverride: header.siteName || undefined,
    siteNameAccent: header.siteNameAccent || undefined,

    // Search — renamed fields
    enableSearch: (header.searchEnabled ?? true) && (header.showSearchBar !== false),
    searchPlaceholder: header.searchPlaceholder || 'Zoek producten...',

    // Price toggle (embedded in search bar)
    enablePriceToggle: header.enablePriceToggle ?? false,
    priceToggle: header.priceToggle || { defaultMode: 'b2c', b2cLabel: 'Particulier', b2bLabel: 'Zakelijk' },

    // Action buttons — renamed fields
    showPhone: header.showPhoneButton ?? true,
    showCart: header.showCartButton ?? true,
    showAccount: header.showAccountButton ?? true,
    showWishlist: header.showWishlistButton ?? false,
    customButtons: header.customActionButtons || [],

    // Behavior
    stickyHeader: header.stickyHeader ?? true,
    showShadow: header.stickyHeaderShadow ?? true,
  }
}

export function HeaderClient({ header, theme, settings }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openSearch } = useSearch()
  const { openCart, itemCount } = useMiniCart()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Return null if no header data
  if (!header) {
    return null
  }

  // Map flat CMS v2 fields to nested structure for child components
  const mapped = mapHeaderData(header)
  const {
    topBar, alertBar, navigation, logoOverride, siteNameOverride,
    siteNameAccent, enableSearch, searchPlaceholder, showPhone,
    showWishlist, showAccount, showCart, customButtons,
    stickyHeader, showShadow,
  } = mapped

  // Price toggle state (B2B/B2C)
  const [priceMode, setPriceMode] = useState<'b2c' | 'b2b'>(mapped.priceToggle?.defaultMode || 'b2c')

  useEffect(() => {
    const saved = localStorage.getItem('price-mode') as 'b2c' | 'b2b' | null
    if (saved) setPriceMode(saved)
  }, [])

  const togglePriceMode = (newMode: 'b2c' | 'b2b') => {
    setPriceMode(newMode)
    localStorage.setItem('price-mode', newMode)
    window.dispatchEvent(new CustomEvent('priceToggle', { detail: { mode: newMode } }))
  }

  // Build class names based on settings
  const headerClasses = cn(
    'bg-white border-b transition-all',
    {
      'sticky top-0 z-50': stickyHeader,
      'shadow-sm': showShadow,
    },
  )

  const headerStyle = {
    borderColor: showShadow ? 'var(--color-border, #e5e7eb)' : 'transparent',
  }

  return (
    <>
      {/* Alert Bar */}
      {alertBar?.enabled && <AlertBar alertBar={alertBar} theme={theme || null} />}

      {/* Top Bar */}
      {topBar?.enabled && <TopBar topBar={topBar} theme={theme || null} header={header} />}

      {/* Main Header */}
      <header className={headerClasses} style={headerStyle}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-width)' }}>
          <div className="h-[72px] grid grid-cols-[auto_1fr_auto] items-center gap-8">
            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-[42px] h-[42px] rounded-[10px] bg-[var(--color-secondary,#0A1628)] text-white flex items-center justify-center hover:bg-[var(--color-primary,#00897B)] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              {logoOverride && typeof logoOverride === 'object' && logoOverride.url ? (
                <img
                  src={logoOverride.url}
                  alt={siteNameOverride || 'Logo'}
                  className="h-9 w-auto"
                />
              ) : siteNameOverride ? (
                <span className="text-xl font-extrabold text-[var(--color-secondary,#0A1628)]">
                  {siteNameAccent ? (
                    <>
                      {siteNameOverride.replace(siteNameAccent, '')}
                      <span className="text-[var(--color-primary,#00897B)]">{siteNameAccent}</span>
                    </>
                  ) : (
                    siteNameOverride
                  )}
                </span>
              ) : (
                <span className="text-xl font-extrabold text-[var(--color-secondary,#0A1628)]">
                  Site<span className="text-[var(--color-primary,#00897B)]">Forge</span>
                </span>
              )}
            </Link>

            {/* Search Bar */}
            {enableSearch && (
              <button
                onClick={openSearch}
                type="button"
                className={cn(
                  "hidden lg:flex flex-1 max-w-[600px] justify-self-center relative w-full h-11 pl-12 border-2 rounded-xl text-sm hover:bg-white focus:bg-white focus:ring-4 outline-none transition-all text-left cursor-text items-center",
                  mapped.enablePriceToggle ? "pr-[170px]" : "pr-4",
                )}
                style={{
                  backgroundColor: 'var(--color-surface, #f9fafb)',
                  borderColor: 'var(--color-border, #e5e7eb)',
                  color: 'var(--color-text-muted, #94a3b8)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary, #00897B)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border, #e5e7eb)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary, #00897B)'
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 137, 123, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border, #e5e7eb)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none z-10" style={{ color: 'var(--color-text-muted, #94a3b8)' }} />
                {searchPlaceholder}

                {/* Price Toggle — embedded in search bar */}
                {mapped.enablePriceToggle && (
                  <div
                    className="absolute right-[48px] top-1/2 -translate-y-1/2 hidden xl:flex items-center rounded-md border overflow-hidden"
                    style={{ background: 'var(--color-surface, #F1F4F8)', borderColor: 'var(--color-border, #E8ECF1)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); togglePriceMode('b2b') }}
                      className="px-2.5 py-[5px] text-[11px] font-bold tracking-wide transition-all"
                      style={{
                        background: priceMode === 'b2b' ? 'var(--color-primary, #00897B)' : 'transparent',
                        color: priceMode === 'b2b' ? 'white' : 'var(--color-text-muted, #94A3B8)',
                      }}
                    >
                      {mapped.priceToggle?.b2bLabel || 'B2B'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); togglePriceMode('b2c') }}
                      className="px-2.5 py-[5px] text-[11px] font-bold tracking-wide transition-all"
                      style={{
                        background: priceMode === 'b2c' ? 'var(--color-primary, #00897B)' : 'transparent',
                        color: priceMode === 'b2c' ? 'white' : 'var(--color-text-muted, #94A3B8)',
                      }}
                    >
                      {mapped.priceToggle?.b2cLabel || 'B2C'}
                    </button>
                  </div>
                )}

                {/* ⌘K Badge */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold font-mono bg-white border rounded px-2 py-0.5 pointer-events-none hidden xl:block" style={{ color: 'var(--color-text-muted, #94a3b8)', borderColor: 'var(--color-border, #e5e7eb)' }}>
                  ⌘K
                </div>
              </button>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Phone */}
              {showPhone && settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="hidden lg:flex items-center gap-1.5 h-[42px] px-3 rounded-[10px] text-sm font-semibold transition-all hover:bg-gray-100"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <Phone className="w-4 h-4" style={{ color: 'var(--color-primary, #00897B)' }} />
                  {settings.phone}
                </a>
              )}

              {/* Custom Buttons */}
              {customButtons?.map((button: any, index: number) => {
                const Icon = button.icon ? iconMap[button.icon] : null
                const buttonStyle =
                  button.style === 'primary'
                    ? 'bg-[var(--color-primary,#00897B)] text-white hover:bg-[var(--color-primary,#00897B)]/90'
                    : button.style === 'secondary'
                      ? 'bg-[var(--color-secondary,#0A1628)] text-white hover:bg-[var(--color-secondary,#0A1628)]/90'
                      : 'bg-gray-100 hover:border-[var(--color-primary,#00897B)] hover:bg-[var(--color-primary,#00897B)]/10'

                return (
                  <Link
                    key={index}
                    href={button.url || '#'}
                    className={cn(
                      'h-[42px] px-4 rounded-[10px] border border-transparent flex items-center justify-center gap-2 transition-all text-sm font-semibold',
                      buttonStyle,
                    )}
                    title={button.label || undefined}
                  >
                    {Icon && <Icon className="w-[19px] h-[19px]" />}
                    <span className="hidden xl:inline">{button.label}</span>
                  </Link>
                )
              })}

              {/* Wishlist */}
              {showWishlist && (
                <button
                  className="hidden lg:flex w-[42px] h-[42px] rounded-[10px] border border-transparent bg-gray-100 hover:border-[var(--color-primary,#00897B)] hover:bg-[var(--color-primary,#00897B)]/10 items-center justify-center transition-all"
                  title="Wishlist"
                >
                  <Heart className="w-[19px] h-[19px]" />
                </button>
              )}

              {/* Account */}
              {showAccount && (
                <Link
                  href="/my-account/"
                  className="w-[42px] h-[42px] rounded-[10px] border border-transparent bg-gray-100 hover:border-[var(--color-primary,#00897B)] hover:bg-[var(--color-primary,#00897B)]/10 flex items-center justify-center transition-all"
                  title="Account"
                >
                  <User className="w-[19px] h-[19px]" />
                </Link>
              )}

              {/* Separator */}
              {showCart && (showAccount || showWishlist || customButtons?.length) && (
                <div className="hidden lg:block w-px h-6 mx-1" style={{ backgroundColor: 'var(--color-border, #e5e7eb)' }} />
              )}

              {/* Cart */}
              {showCart && (
                <button
                  onClick={openCart}
                  className="h-[42px] px-4 rounded-[10px] text-white border flex items-center gap-2 transition-all font-bold text-[13.5px] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-secondary, #0A1628)',
                    borderColor: 'var(--color-secondary, #0A1628)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary, #00897B)'
                    e.currentTarget.style.borderColor = 'var(--color-primary, #00897B)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-secondary, #0A1628)'
                    e.currentTarget.style.borderColor = 'var(--color-secondary, #0A1628)'
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {itemCount > 0 && (
                    <span className="bg-white text-[var(--color-secondary)] text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      {navigation && <NavigationBar navigation={navigation} theme={theme || null} settings={settings} />}

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        header={header}
        navigation={mapped.navigation}
        theme={theme || null}
        settings={settings}
      />
    </>
  )
}
