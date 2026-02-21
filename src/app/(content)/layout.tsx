import type { ReactNode } from 'react'
import { AdminBar } from '@/branches/shared/components/AdminBar'
import { Footer } from '@/branches/shared/components/Footer'
import { LivePreviewListener } from '@/branches/shared/components/LivePreviewListener'
import { Providers } from '@/providers'
import { ThemeProvider } from '@/branches/shared/components/ThemeProvider'
import { SearchProvider } from '@/branches/shared/components/search/SearchProvider'
import { MiniCartProvider } from '@/branches/shared/components/ui/MiniCart'
import { ToastProvider } from '@/branches/shared/components/ui/Toast'
import { PlastimedTopBar } from '@/branches/shared/components/Plastimed/TopBar'
import { DynamicHeader } from '@/branches/shared/components/DynamicHeader'
import { DynamicNav } from '@/branches/shared/components/DynamicNav'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'

// Force dynamic rendering to avoid database queries during build
export const dynamic = 'force-dynamic'

/**
 * Content Branch Layout
 *
 * Wraps all content routes: blog, faq, merken (brands), etc.
 * Includes full frontend chrome: Header, Footer, Nav, TopBar, etc.
 */
export default async function ContentLayout({ children }: { children: ReactNode }) {
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

              {/* Top Bar (optional, CMS-driven) */}
              {headerGlobal?.topBar?.enabled && <PlastimedTopBar settings={headerGlobal.topBar} />}

              {/* Dynamic Header (CMS-driven) */}
              <DynamicHeader header={headerGlobal} settings={settingsGlobal} />

              {/* Dynamic Navigation (CMS-driven) */}
              <DynamicNav navigation={headerGlobal?.navigation} />

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
