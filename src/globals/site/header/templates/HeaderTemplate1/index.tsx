'use client'

import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/utilities/cn'
import { Search, ShoppingCart, User, Heart, Phone, Menu } from 'lucide-react'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AlertBar } from '@/globals/site/header/components/AlertBar'
import { TopBar } from '@/globals/site/header/components/TopBar'
import { NavigationBar } from '@/globals/site/header/components/NavigationBar'
import { MobileDrawer } from '@/globals/site/header/components/MobileDrawer'
import type { HeaderTemplateProps } from '@/globals/site/header/templates/types'

export default function HeaderTemplate1({
  header,
  theme,
  settings,
  mapped,
  mobileOpen,
  setMobileOpen,
  openSearch,
  openCart,
  itemCount,
  priceMode,
  togglePriceMode,
}: HeaderTemplateProps) {
  const {
    topBar,
    alertBar,
    navigation,
    logoOverride,
    logoHeight,
    logoUrl,
    siteNameOverride,
    enableSearch,
    searchPlaceholder,
    showPhone,
    showWishlist,
    showAccount,
    showCart,
    customButtons,
    stickyHeader,
    showShadow,
  } = mapped

  const { stickyBehavior, hideTopbarOnScroll } = mapped

  // Scroll direction tracking for stickyBehavior and hideTopbarOnScroll
  const lastScrollY = useRef(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (!stickyHeader || (stickyBehavior === 'always' && !hideTopbarOnScroll)) return

    const handleScroll = () => {
      const currentY = window.scrollY
      setIsScrolled(currentY > 10)
      setScrollDirection(currentY > lastScrollY.current ? 'down' : 'up')
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [stickyHeader, stickyBehavior, hideTopbarOnScroll])

  // Determine if header should be visible based on stickyBehavior
  const isHeaderVisible =
    !stickyHeader ||
    stickyBehavior === 'always' ||
    (stickyBehavior === 'scroll-up' && scrollDirection === 'up') ||
    (stickyBehavior === 'scroll-down' && scrollDirection === 'down')

  // Determine if topbar should be hidden on scroll
  const isTopbarHidden = hideTopbarOnScroll && isScrolled && stickyHeader

  const headerClasses = cn('bg-white border-b', {
    'sticky top-0 z-50': stickyHeader,
    'shadow-sm': showShadow,
    'transition-all': true,
    '-translate-y-full': stickyHeader && !isHeaderVisible,
  })

  const headerStyle = {
    borderColor: showShadow ? 'var(--color-border)' : 'transparent',
  }

  return (
    <>
      {/* Alert Bar */}
      {alertBar?.enabled && <AlertBar alertBar={alertBar} theme={theme} />}

      {/* Top Bar */}
      {topBar?.enabled && !isTopbarHidden && <TopBar topBar={topBar} theme={theme} header={header} />}

      {/* Main Header */}
      <header className={headerClasses} style={headerStyle}>
        <div className="mx-auto px-4" style={{ maxWidth: 'var(--container-width)' }}>
          <div className="h-[72px] grid grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-8">
            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-[42px] h-[42px] bg-[var(--color-secondary)] text-white flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href={logoUrl} className="flex items-center">
              {logoOverride &&
              typeof logoOverride === 'object' &&
              logoOverride.url ? (
                <img
                  src={logoOverride.url}
                  alt={siteNameOverride || 'Logo'}
                  className="w-auto"
                  style={{ height: `${logoHeight}px` }}
                />
              ) : siteNameOverride ? (
                <span className="text-xl font-extrabold text-[var(--color-secondary)]">
                  {siteNameOverride}
                </span>
              ) : (
                <span className="text-xl font-extrabold text-[var(--color-secondary)]">
                  Site
                  <span className="text-[var(--color-primary)]">Forge</span>
                </span>
              )}
            </Link>

            {/* Search Bar — desktop */}
            {enableSearch && (
              <button
                onClick={openSearch}
                type="button"
                className={cn(
                  'hidden lg:flex flex-1 max-w-[600px] justify-self-center relative w-full h-11 pl-12 border-2 rounded-xl text-sm hover:bg-white focus:bg-white focus:ring-4 outline-none transition-all text-left cursor-text items-center',
                  mapped.enablePriceToggle ? 'pr-[170px]' : 'pr-4',
                )}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                  e.currentTarget.style.boxShadow = '0 0 0 4px var(--color-primary-glow)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none z-10"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                {searchPlaceholder}

                {/* Price Toggle — embedded in search bar */}
                {mapped.enablePriceToggle && (
                  <div
                    className="absolute right-[48px] top-1/2 -translate-y-1/2 hidden xl:flex items-center rounded-md border overflow-hidden"
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePriceMode('b2b')
                      }}
                      className="px-2.5 py-[5px] text-[11px] font-bold tracking-wide transition-all"
                      style={{
                        background:
                          priceMode === 'b2b'
                            ? 'var(--color-primary)'
                            : 'transparent',
                        color:
                          priceMode === 'b2b'
                            ? 'white'
                            : 'var(--color-text-muted)',
                      }}
                    >
                      {mapped.priceToggle?.b2bLabel || 'B2B'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePriceMode('b2c')
                      }}
                      className="px-2.5 py-[5px] text-[11px] font-bold tracking-wide transition-all"
                      style={{
                        background:
                          priceMode === 'b2c'
                            ? 'var(--color-primary)'
                            : 'transparent',
                        color:
                          priceMode === 'b2c'
                            ? 'white'
                            : 'var(--color-text-muted)',
                      }}
                    >
                      {mapped.priceToggle?.b2cLabel || 'B2C'}
                    </button>
                  </div>
                )}

                {/* Keyboard Shortcut Badge */}
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold font-mono bg-white border rounded px-2 py-0.5 pointer-events-none hidden xl:block"
                  style={{
                    color: 'var(--color-text-muted)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  ⌘K
                </div>
              </button>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Mobile Search */}
              {enableSearch && (
                <button
                  onClick={openSearch}
                  className="lg:hidden w-[42px] h-[42px] rounded-[10px] border border-transparent bg-gray-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 flex items-center justify-center transition-all"
                  aria-label="Zoeken"
                >
                  <Search className="w-[19px] h-[19px]" />
                </button>
              )}

              {/* Phone */}
              {showPhone && settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="hidden lg:flex items-center gap-1.5 h-[42px] px-3 rounded-[10px] text-sm font-semibold transition-all hover:bg-gray-100"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <Phone
                    className="w-4 h-4"
                    style={{ color: 'var(--color-primary)' }}
                  />
                  {settings.phone}
                </a>
              )}

              {/* Custom Buttons */}
              {customButtons?.map((button: any, index: number) => (
                <Link
                  key={index}
                  href={button.url || '#'}
                  className={cn(
                    'h-[42px] px-4 rounded-[10px] border border-transparent flex items-center justify-center gap-2 transition-all text-sm font-semibold',
                    'bg-gray-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10',
                    button.showOnMobile === false && 'hidden lg:flex',
                  )}
                  title={button.label || undefined}
                >
                  {button.icon && <Icon name={button.icon} size={19} />}
                  <span className="hidden xl:inline">{button.label}</span>
                </Link>
              ))}

              {/* Wishlist — always visible */}
              {showWishlist && (
                <Link
                  href="/account/favorites"
                  className="w-[42px] h-[42px] rounded-[10px] border border-transparent bg-gray-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 flex items-center justify-center transition-all"
                  title="Wishlist"
                >
                  <Heart className="w-[19px] h-[19px]" />
                </Link>
              )}

              {/* Account */}
              {showAccount && (
                <Link
                  href="/account/"
                  className="w-[42px] h-[42px] rounded-[10px] border border-transparent bg-gray-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 flex items-center justify-center transition-all"
                  title="Account"
                >
                  <User className="w-[19px] h-[19px]" />
                </Link>
              )}

              {/* Separator */}
              {showCart &&
                (showAccount || showWishlist || customButtons?.length) && (
                  <div
                    className="hidden lg:block w-px h-6 mx-1"
                    style={{ backgroundColor: 'var(--color-border)' }}
                  />
                )}

              {/* Cart */}
              {showCart && (
                <button
                  onClick={openCart}
                  className="h-[42px] px-4 rounded-[10px] text-white border flex items-center gap-2 transition-all font-bold text-[13.5px] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    borderColor: 'var(--color-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--color-primary)'
                    e.currentTarget.style.borderColor =
                      'var(--color-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'var(--color-secondary)'
                    e.currentTarget.style.borderColor =
                      'var(--color-secondary)'
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
      {navigation && (
        <NavigationBar navigation={navigation as any} theme={theme} settings={settings} />
      )}

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        header={header}
        navigation={mapped.navigation}
        theme={theme}
        settings={settings}
        onOpenSearch={openSearch}
        drawerWidth={mapped.mobileDrawerWidth}
        drawerPosition="left"
        showContactInfo={mapped.showMobileContactInfo}
        contactInfoOverride={mapped.mobileContactInfo}
        showToggles={mapped.showMobileToggles}
      />
    </>
  )
}
