import type { ReactNode } from 'react'
import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SearchProvider } from '@/components/Search/SearchProvider'
import { MiniCartProvider } from '@/components/ui/MiniCart'
import { ToastProvider } from '@/components/ui/Toast'
import { PlastimedTopBar } from '@/components/Plastimed/TopBar'
import { DynamicHeader } from '@/components/DynamicHeader'
import { DynamicNav } from '@/components/DynamicNav'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import './legal.css'

// Force dynamic rendering to avoid database queries during build
export const dynamic = 'force-dynamic'

/**
 * Shared Branch Layout
 *
 * Wraps all shared routes: auth (login, register), legal pages, account, search, etc.
 * Includes full frontend chrome: Header, Footer, Nav, TopBar, etc.
 * Includes legal.css for styling privacy/terms pages.
 */
export default async function SharedLayout({ children }: { children: ReactNode }) {
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
