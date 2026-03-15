import type { ReactNode } from 'react'
import { AdminBar } from '@/branches/shared/components/admin/AdminBar'
import { Footer } from '@/globals/site/footer/components/Footer'
import { LivePreviewListener } from '@/branches/shared/components/utilities/LivePreviewListener'
import { Providers } from '@/providers'
import { ThemeProvider } from '@/branches/shared/components/utilities/ThemeProvider'
import { SearchProvider } from '@/features/search/components/SearchProvider'
import { MiniCartProvider } from '@/branches/ecommerce/shared/components/ui/MiniCart'
import { ToastProvider } from '@/branches/shared/components/ui/ToastSystem'
import { HeaderClient } from '@/globals/site/header/components/index.client'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import '../globals.css'

export const dynamic = 'force-dynamic'

/**
 * Onderwijs Branch Layout
 *
 * Wraps all onderwijs routes: cursussen, docenten, contact.
 * Includes full frontend chrome: Header, Footer, Nav, etc.
 * Feature gate: only accessible when education feature is enabled.
 */
export default async function OnderwijsLayout({ children }: { children: ReactNode }) {
  if (!isFeatureEnabled('education')) notFound()

  const payload = await getPayload({ config: configPromise })

  // Fetch consolidated globals for layout (with error handling)
  let themeGlobal = null
  let settingsGlobal = null
  let headerGlobal = null

  try {
    themeGlobal = await payload.findGlobal({ slug: 'theme' })
  } catch (error) {
    console.warn('Theme global not found, using default theme')
  }

  try {
    settingsGlobal = await payload.findGlobal({ slug: 'settings' })
  } catch (error) {
    console.warn('Settings global not found')
  }

  try {
    headerGlobal = await payload.findGlobal({ slug: 'header' })
  } catch (error) {
    console.warn('Header global not found')
  }

  return (
    <Providers>
      <ThemeProvider theme={themeGlobal}>
        <SearchProvider enableSearch={isFeatureEnabled('search')}>
          <ToastProvider>
            <MiniCartProvider enableMiniCart={isFeatureEnabled('mini_cart') || isFeatureEnabled('cart')}>
              <AdminBar />
              <LivePreviewListener />

              {/* Dynamic Header (CMS-driven, includes TopBar, Navigation) */}
              <HeaderClient header={headerGlobal} theme={themeGlobal} settings={settingsGlobal} />

              {/* Main Content */}
              <main className="bg-grey-light">{children}</main>

              {/* Footer (CMS-driven) */}
              <Footer />
            </MiniCartProvider>
          </ToastProvider>
        </SearchProvider>
      </ThemeProvider>
    </Providers>
  )
}
