'use client'

import { CMSLink } from '@/branches/shared/components/common/Link'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'
import type { Header as HeaderType, Theme } from '@/payload-types'

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
import { getCachedGlobal } from '@/utilities/getGlobals'

type Props = {
  header: HeaderType
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

export function HeaderClient({ header }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [theme, setTheme] = useState<Theme | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Load theme
  useEffect(() => {
    setIsMounted(true)
    async function loadTheme() {
      const themeData = await getCachedGlobal('theme', 1)()
      setTheme(themeData as Theme)
    }
    loadTheme()
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Extract settings from header
  const {
    topBar,
    alertBar,
    logoOverride,
    siteNameOverride,
    siteNameAccent,
    enableSearch = true,
    searchPlaceholder = 'Zoek producten...',
    showPhone = true,
    showWishlist = false,
    showAccount = true,
    showCart = true,
    customButtons = [],
    navigation,
    stickyHeader = true,
    showShadow = true,
  } = header

  // Build class names based on settings
  const headerClasses = cn(
    'bg-white border-b transition-all',
    {
      'sticky top-0 z-50': stickyHeader,
      'shadow-sm': showShadow,
    },
    showShadow && 'border-gray-200',
  )

  return (
    <>
      {/* Alert Bar */}
      {alertBar?.enabled && <AlertBar alertBar={alertBar} />}

      {/* Top Bar */}
      {topBar?.enabled && <TopBar topBar={topBar} theme={theme} />}

      {/* Main Header */}
      <header className={headerClasses}>
        <div className="max-w-[1320px] mx-auto px-8">
          <div className="h-[72px] grid grid-cols-[auto_1fr_auto] items-center gap-8">
            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-[42px] h-[42px] rounded-[10px] bg-[var(--secondary,#0A1628)] text-white flex items-center justify-center hover:bg-[var(--primary,#00897B)] transition-colors"
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
                <span className="text-xl font-extrabold text-[var(--secondary,#0A1628)]">
                  {siteNameAccent ? (
                    <>
                      {siteNameOverride.replace(siteNameAccent, '')}
                      <span className="text-[var(--primary,#00897B)]">{siteNameAccent}</span>
                    </>
                  ) : (
                    siteNameOverride
                  )}
                </span>
              ) : (
                <span className="text-xl font-extrabold text-[var(--secondary,#0A1628)]">
                  Site<span className="text-[var(--primary,#00897B)]">Forge</span>
                </span>
              )}
            </Link>

            {/* Search Bar */}
            {enableSearch && (
              <div className="hidden lg:flex flex-1 max-w-[600px] justify-self-center relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-11 pl-12 pr-4 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-[var(--primary,#00897B)] focus:ring-4 focus:ring-[var(--primary,#00897B)]/10 outline-none transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold font-mono text-gray-400 bg-white border border-gray-200 rounded px-2 py-0.5 pointer-events-none hidden xl:block">
                  ⌘K
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Custom Buttons */}
              {customButtons?.map((button, index) => {
                const Icon = button.icon ? iconMap[button.icon] : null
                const buttonStyle =
                  button.style === 'primary'
                    ? 'bg-[var(--primary,#00897B)] text-white hover:bg-[var(--primary,#00897B)]/90'
                    : button.style === 'secondary'
                      ? 'bg-[var(--secondary,#0A1628)] text-white hover:bg-[var(--secondary,#0A1628)]/90'
                      : 'bg-gray-100 hover:border-[var(--primary,#00897B)] hover:bg-[var(--primary,#00897B)]/10'

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
                  className="hidden lg:flex w-[42px] h-[42px] rounded-[10px] border border-transparent bg-gray-100 hover:border-[var(--primary,#00897B)] hover:bg-[var(--primary,#00897B)]/10 items-center justify-center transition-all"
                  title="Wishlist"
                >
                  <Heart className="w-[19px] h-[19px]" />
                </button>
              )}

              {/* Account */}
              {showAccount && (
                <Link
                  href="/account/"
                  className="w-[42px] h-[42px] rounded-[10px] border border-transparent bg-gray-100 hover:border-[var(--primary,#00897B)] hover:bg-[var(--primary,#00897B)]/10 flex items-center justify-center transition-all"
                  title="Account"
                >
                  <User className="w-[19px] h-[19px]" />
                </Link>
              )}

              {/* Separator */}
              {showCart && (showAccount || showWishlist || customButtons?.length) && (
                <div className="hidden lg:block w-px h-6 bg-gray-200 mx-1" />
              )}

              {/* Cart */}
              {showCart && (
                <Link
                  href="/cart/"
                  className="h-[42px] px-4 rounded-[10px] bg-[var(--secondary,#0A1628)] text-white hover:bg-[var(--primary,#00897B)] border border-[var(--secondary,#0A1628)] hover:border-[var(--primary,#00897B)] flex items-center gap-2 transition-all font-bold text-[13.5px]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">€0,00</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      {navigation && <NavigationBar navigation={navigation} theme={theme} />}

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        header={header}
        theme={theme}
      />

      {/* Apply theme CSS variables - only after mount to prevent hydration mismatch */}
      {isMounted && theme && (
        <style jsx global>{`
          :root {
            --primary: ${theme.primaryColor || '#00897B'};
            --secondary: ${theme.secondaryColor || '#0A1628'};
            --accent: ${theme.accentColor || '#8b5cf6'};
            --background: ${theme.backgroundColor || '#ffffff'};
            --surface: ${theme.surfaceColor || '#f9fafb'};
            --border: ${theme.borderColor || '#e5e7eb'};
            --text-primary: ${theme.textPrimary || '#0A1628'};
            --text-secondary: ${theme.textSecondary || '#64748b'};
            --text-muted: ${theme.textMuted || '#94a3b8'};
            --font-heading: ${theme.headingFont || 'Inter, system-ui, sans-serif'};
            --font-body: ${theme.bodyFont || 'Inter, system-ui, sans-serif'};
          }
        `}</style>
      )}
    </>
  )
}
