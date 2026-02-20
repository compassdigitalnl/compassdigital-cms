'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { Settings, Header as HeaderType, Media } from '@/payload-types'
import { useSearch } from '@/components/Search/SearchProvider'
import { useMiniCart } from '@/components/ui/MiniCart'

type Props = {
  header?: HeaderType | null
  settings?: Settings | null // Consolidated: combines SiteSettings + ShopSettings
}

/**
 * DynamicHeader Component
 *
 * 100% CMS-driven header component
 * Uses Header global for header-specific settings (logo, search, buttons)
 * Falls back to Settings global (consolidated SiteSettings + ShopSettings)
 *
 * Framework principle: "Build reusable components" - payload-website-framework-b2b-b2c.md
 */
export function DynamicHeader({ header, settings }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { openSearch } = useSearch()
  const { openCart, totalItems } = useMiniCart()

  // Get logo (Header override > Settings)
  const logoOverride = header?.logoOverride as Media | null
  const settingsLogoObj = settings?.logo as Media | null
  const logoUrl = logoOverride?.url || settingsLogoObj?.url || null

  // Get site name (Header override > Settings.companyName > fallback)
  // Use consistent fallback to prevent hydration mismatch
  const siteName = header?.siteNameOverride || settings?.companyName || 'Your Site Name'
  const siteNameAccent = header?.siteNameAccent || null

  // Search settings
  const enableSearch = header?.enableSearch !== false
  const searchPlaceholder = header?.searchPlaceholder || 'Zoek producten...'

  // Action button visibility
  const showPhone = header?.showPhone !== false
  const showWishlist = header?.showWishlist === true
  const showAccount = header?.showAccount !== false
  const showCart = header?.showCart !== false

  // Behavior settings
  const stickyHeader = header?.stickyHeader !== false
  const showShadow = header?.showShadow !== false

  const headerClasses = `bg-white border-b z-50 ${stickyHeader ? 'sticky top-0' : ''} ${showShadow ? 'shadow-sm' : ''}`

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-[42px] w-auto" />
            ) : (
              <div className="w-[42px] h-[42px] bg-gradient-to-br from-primary to-primary/80 rounded-[10px] flex items-center justify-center text-white text-xl font-extrabold shadow-lg">
                {siteName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-[22px] font-extrabold text-gray-900 tracking-tight">
              {siteNameAccent && siteName.includes(siteNameAccent) ? (
                <>
                  {siteName.split(siteNameAccent)[0]}
                  <span className="text-primary">{siteNameAccent}</span>
                  {siteName.split(siteNameAccent).slice(1).join(siteNameAccent)}
                </>
              ) : (
                siteName
              )}
            </div>
          </Link>

          {/* Search - Centered */}
          {enableSearch && (
            <button
              onClick={openSearch}
              type="button"
              className="flex-1 max-w-[560px] mx-auto relative flex items-center w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-[15px] bg-gray-50 hover:bg-white hover:border-primary/50 focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-left text-gray-400 cursor-text"
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                🔍
              </span>
              {searchPlaceholder}
              <kbd className="ml-auto text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile Menu Button (hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-lg hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Phone button */}
            {showPhone && settings?.phone && (
              <Link
                href={`tel:${settings.phone}`}
                className="px-4 h-11 bg-surface text-primary rounded-lg font-semibold text-sm hover:bg-primary/10 transition-colors flex items-center gap-2"
              >
                📞 {settings.phone}
              </Link>
            )}

            {/* Custom buttons from Header global */}
            {header?.customButtons &&
              header.customButtons.map((button, idx) => {
                const buttonClasses =
                  button.style === 'primary'
                    ? 'px-4 h-11 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2'
                    : button.style === 'secondary'
                      ? 'px-4 h-11 bg-secondary text-white rounded-lg font-semibold text-sm hover:bg-secondary/90 transition-colors flex items-center gap-2'
                      : 'px-4 h-11 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2'

                return (
                  <Link key={idx} href={button.url || '#'} className={buttonClasses}>
                    {button.icon && <span>{button.icon}</span>}
                    {button.label}
                  </Link>
                )
              })}

            {/* Wishlist */}
            {showWishlist && (
              <Link
                href="/wishlist"
                className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-lg hover:bg-primary/10 hover:text-primary transition-colors"
                title="Wishlist"
              >
                ♡
              </Link>
            )}

            {/* Account */}
            {showAccount && (
              <Link
                href="/account"
                className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-lg hover:bg-primary/10 hover:text-primary transition-colors"
                title="Account"
              >
                👤
              </Link>
            )}

            {/* Cart */}
            {showCart && (
              <button
                onClick={openCart}
                className="relative w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-lg hover:bg-primary/10 hover:text-primary transition-colors"
                title="Winkelwagen"
              >
                🛒
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-fadeIn">
          <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
            {/* Search on mobile */}
            {enableSearch && (
              <button
                onClick={() => {
                  openSearch()
                  setMobileMenuOpen(false)
                }}
                type="button"
                className="w-full mb-4 flex items-center px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 hover:bg-white hover:border-primary/50 transition-all text-left text-gray-400"
              >
                <span className="mr-2">🔍</span>
                {searchPlaceholder}
                <kbd className="ml-auto text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Quick links */}
            <div className="space-y-2">
              {showPhone && settings?.phone && (
                <Link
                  href={`tel:${settings.phone}`}
                  className="block px-4 py-3 bg-gray-50 hover:bg-primary/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm font-semibold text-gray-900">📞 {settings.phone}</span>
                </Link>
              )}

              {showWishlist && (
                <Link
                  href="/wishlist"
                  className="block px-4 py-3 bg-gray-50 hover:bg-primary/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm font-semibold text-gray-900">♡ Wishlist</span>
                </Link>
              )}

              {showAccount && (
                <Link
                  href="/account"
                  className="block px-4 py-3 bg-gray-50 hover:bg-primary/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm font-semibold text-gray-900">👤 Account</span>
                </Link>
              )}

              {showCart && (
                <Link
                  href="/cart"
                  className="block px-4 py-3 bg-gray-50 hover:bg-primary/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-sm font-semibold text-gray-900">
                    🛒 Winkelwagen {cartCount > 0 && `(${cartCount})`}
                  </span>
                </Link>
              )}

              {/* Custom buttons */}
              {header?.customButtons &&
                header.customButtons.map((button, idx) => (
                  <Link
                    key={idx}
                    href={button.url || '#'}
                    className="block px-4 py-3 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors text-center font-semibold text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {button.icon && <span className="mr-2">{button.icon}</span>}
                    {button.label}
                  </Link>
                ))}
            </div>

            {/* Note about navigation */}
            <p className="text-xs text-gray-500 mt-6 pt-4 border-t text-center">
              Voor productcategorieën zie Navigation component
            </p>
          </div>
        </div>
      )}
    </header>
  )
}
