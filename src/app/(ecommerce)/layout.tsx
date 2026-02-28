import type { ReactNode } from 'react'
import { DM_Sans } from 'next/font/google'
import { AdminBar } from '@/branches/shared/components/admin/AdminBar'
import { Footer } from '@/branches/shared/components/layout/footer/Footer'
import { LivePreviewListener } from '@/branches/shared/components/utilities/LivePreviewListener'
import { Providers } from '@/providers'
import { ThemeProvider } from '@/branches/shared/components/utilities/ThemeProvider'
import { SearchProvider } from '@/branches/shared/components/features/search/search/SearchProvider'
import { MiniCartProvider } from '@/branches/ecommerce/components/ui/MiniCart'
import { ToastProvider } from '@/branches/shared/components/ui/ToastSystem'
import { AddToCartToastProviderClient } from '@/branches/ecommerce/components/ui/AddToCartToast'
import { HeaderClient } from '@/branches/shared/components/layout/header/Header/index.client'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { isFeatureEnabled } from '@/lib/features'
import React from 'react'
import '../globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// Force dynamic rendering to avoid database queries during build
export const dynamic = 'force-dynamic'

/**
 * Ecommerce Branch Layout
 *
 * Wraps all ecommerce routes: shop, cart, checkout, my-account, etc.
 * Includes full frontend chrome: Header, Footer, Nav, TopBar, etc.
 */
export default async function EcommerceLayout({ children }: { children: ReactNode }) {
  const payload = await getPayload({ config: configPromise })

  // Fetch consolidated globals for layout (with error handling)
  let themeGlobal = null
  let settingsGlobal = null
  let headerGlobal = null

  try {
    themeGlobal = await payload.findGlobal({
      slug: 'theme',
    })
  } catch (error) {
    console.warn('Theme global not found, using default theme')
  }

  try {
    settingsGlobal = await payload.findGlobal({
      slug: 'settings',
    })
  } catch (error) {
    console.warn('Settings global not found')
  }

  try {
    headerGlobal = await payload.findGlobal({
      slug: 'header',
    })
  } catch (error) {
    console.warn('Header global not found')
  }

  return (
    <Providers>
      <ThemeProvider theme={themeGlobal}>
        <SearchProvider enableSearch={isFeatureEnabled('search')}>
          <ToastProvider>
            <MiniCartProvider enableMiniCart={isFeatureEnabled('mini_cart') || isFeatureEnabled('cart')}>
              <AddToCartToastProviderClient>
                <AdminBar />
                <LivePreviewListener />

                {/* Dynamic Header (CMS-driven, includes TopBar, Navigation) */}
                <HeaderClient header={headerGlobal} theme={themeGlobal} settings={settingsGlobal} />

                {/* Main Content */}
                <main className={`bg-gray-50 ${dmSans.variable}`} style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>{children}</main>

                {/* Footer (CMS-driven) */}
                <Footer />
              </AddToCartToastProviderClient>
            </MiniCartProvider>
          </ToastProvider>
        </SearchProvider>
      </ThemeProvider>
    </Providers>
  )
}
