'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { SiteSettings, ShopSettings, Header as HeaderType, Media } from '@/payload-types'

type Props = {
  header?: HeaderType | null
  siteSettings?: SiteSettings | null
  shopSettings?: ShopSettings | null
}

/**
 * DynamicHeader Component
 *
 * 100% CMS-driven header component
 * Uses Header global for header-specific settings (logo, search, buttons)
 * Falls back to SiteSettings and ShopSettings
 *
 * Framework principle: "Build reusable components" - payload-website-framework-b2b-b2c.md
 */
export function DynamicHeader({ header, siteSettings, shopSettings }: Props) {
  const [cartCount] = useState(0) // TODO: Get from cart context

  // Get logo (Header override > SiteSettings)
  const logoOverride = header?.logoOverride as Media | null
  const siteLogoObj = siteSettings?.logo as Media | null
  const logoUrl = logoOverride?.url || siteLogoObj?.url || null

  // Get site name (Header override > SiteSettings > fallback)
  // Use consistent fallback to prevent hydration mismatch
  const siteName =
    header?.siteNameOverride || siteSettings?.siteName || 'Your Site Name'

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
              {siteName}
            </div>
          </Link>

          {/* Search - Centered */}
          {enableSearch && (
            <div className="flex-1 max-w-[560px] mx-auto relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </span>
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-[15px] bg-gray-50 focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Phone button */}
            {showPhone && shopSettings?.phone && (
              <Link
                href={`tel:${shopSettings.phone}`}
                className="px-4 h-11 bg-surface text-primary rounded-lg font-semibold text-sm hover:bg-primary/10 transition-colors flex items-center gap-2"
              >
                📞 {shopSettings.phone}
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
              <Link
                href="/cart"
                className="relative w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-lg hover:bg-primary/10 hover:text-primary transition-colors"
                title="Winkelwagen"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
