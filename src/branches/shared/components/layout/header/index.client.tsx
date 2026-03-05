'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { Header as HeaderType, Theme1, Setting } from '@/payload-types'
import { useSearch } from '@/branches/shared/components/features/search/search/SearchProvider'
import { useMiniCart } from '@/branches/ecommerce/components/ui/MiniCart'
import HeaderTemplate1 from '@/branches/shared/templates/header/HeaderTemplate1'
import type { MappedHeaderData } from '@/branches/shared/templates/header/types'

type Props = {
  header: HeaderType | null
  theme?: Theme1 | null
  settings?: Setting | null
}

// Adapter: maps flat CMS v2 fields to nested objects expected by child components
function mapHeaderData(header: any): MappedHeaderData {
  return {
    topBar: {
      enabled: header.topbarEnabled ?? false,
      backgroundColor: header.topbarBgColor || undefined,
      textColor: header.topbarTextColor || undefined,
      leftMessages: header.topbarMessages || [],
      rightLinks: header.topbarRightLinks || [],
    },
    alertBar: {
      enabled: header.alertBarEnabled ?? false,
      message: header.alertBarMessage || '',
      type: (header.alertBarType || 'info') as 'info' | 'success' | 'warning' | 'error' | 'promo',
      icon: header.alertBarIcon || undefined,
      link: header.alertBarLink || {},
      dismissible: header.alertBarDismissible ?? true,
      schedule: header.alertBarSchedule || {},
      customColors: header.alertBarCustomColors || {},
    },
    navigation:
      header.navigationEnabled !== false
        ? {
            mode: header.navigationMode || 'manual',
            items: header.manualNavItems || [],
            specialItems: header.specialNavItems || [],
            ctaButton: header.ctaButton
              ? { ...header.ctaButton, show: header.ctaButton.enabled }
              : undefined,
            categoryNavigation: header.categoryNavigation || {},
          }
        : null,
    logoOverride: header.logo || undefined,
    siteNameOverride: header.siteName || undefined,
    siteNameAccent: header.siteNameAccent || undefined,
    enableSearch: header.searchEnabled ?? true,
    searchPlaceholder: header.searchPlaceholder || 'Zoek producten...',
    enablePriceToggle: header.enablePriceToggle ?? false,
    priceToggle: header.priceToggle || {
      defaultMode: 'b2c',
      b2cLabel: 'Particulier',
      b2bLabel: 'Zakelijk',
    },
    showPhone: header.showPhoneButton ?? true,
    showCart: header.showCartButton ?? true,
    showAccount: header.showAccountButton ?? true,
    showWishlist: header.showWishlistButton ?? false,
    customButtons: header.customActionButtons || [],
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

  if (!header) return null

  const mapped = mapHeaderData(header)

  // Price toggle state (B2B/B2C)
  const [priceMode, setPriceMode] = useState<'b2c' | 'b2b'>(
    mapped.priceToggle?.defaultMode || 'b2c',
  )

  useEffect(() => {
    const saved = localStorage.getItem('price-mode') as 'b2c' | 'b2b' | null
    if (saved) setPriceMode(saved)
  }, [])

  const togglePriceMode = (newMode: 'b2c' | 'b2b') => {
    setPriceMode(newMode)
    localStorage.setItem('price-mode', newMode)
    window.dispatchEvent(new CustomEvent('priceToggle', { detail: { mode: newMode } }))
  }

  // Select template based on settings
  const templateKey = (settings as any)?.defaultHeaderTemplate || 'headertemplate1'

  // Currently only HeaderTemplate1 — more can be added here
  switch (templateKey) {
    case 'headertemplate1':
    default:
      return (
        <HeaderTemplate1
          header={header}
          theme={theme || null}
          settings={settings || null}
          mapped={mapped}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          openSearch={openSearch}
          openCart={openCart}
          itemCount={itemCount}
          priceMode={priceMode}
          togglePriceMode={togglePriceMode}
        />
      )
  }
}
