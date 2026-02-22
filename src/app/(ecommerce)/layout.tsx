import type { ReactNode } from 'react'
import { AdminBar } from '@/branches/shared/components/admin/AdminBar'
import { Footer } from '@/branches/shared/components/layout/footer/Footer'
import { LivePreviewListener } from '@/branches/shared/components/utilities/LivePreviewListener'
import { Providers } from '@/providers'
import { ThemeProvider } from '@/branches/shared/components/utilities/ThemeProvider'
import { SearchProvider } from '@/branches/shared/components/features/search/search/SearchProvider'
import { MiniCartProvider } from '@/branches/shared/components/ui/MiniCart'
import { ToastProvider } from '@/branches/shared/components/ui/Toast'
import { HeaderClient } from '@/branches/shared/components/layout/header/Header/index.client'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import '../globals.css'

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
        <SearchProvider>
          <ToastProvider>
            <MiniCartProvider>
              <AdminBar />
              <LivePreviewListener />

              {/* Dynamic Header (CMS-driven, includes TopBar, Navigation) */}
              <HeaderClient header={headerGlobal} theme={themeGlobal} settings={settingsGlobal} />

              {/* Main Content */}
              <main className="bg-gray-50">{children}</main>

              {/* Footer (CMS-driven) */}
              <Footer />
            </MiniCartProvider>
          </ToastProvider>
        </SearchProvider>
      </ThemeProvider>
    </Providers>
  )
}
