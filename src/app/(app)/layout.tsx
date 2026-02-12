import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { ThemeProvider } from '@/components/ThemeProvider'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { PlastimedTopBar } from '@/components/Plastimed/TopBar'
import { DynamicHeader } from '@/components/DynamicHeader'
import { DynamicNav } from '@/components/DynamicNav'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import './globals.css'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const payload = await getPayload({ config: configPromise })

  // Fetch globals for layout (with error handling)
  let topBarSettings = null
  let shopSettings = null
  let themeGlobal = null
  let siteSettings = null
  let headerGlobal = null
  let navigationGlobal = null

  try {
    topBarSettings = await payload.findGlobal({
      slug: 'topBarSettings',
    })
  } catch (error) {
    console.warn('TopBarSettings global not found, skipping TopBar')
  }

  try {
    shopSettings = await payload.findGlobal({
      slug: 'shopSettings',
    })
  } catch (error) {
    console.warn('ShopSettings global not found')
  }

  try {
    themeGlobal = await payload.findGlobal({
      slug: 'theme',
    })
  } catch (error) {
    console.warn('Theme global not found, using default theme')
  }

  try {
    siteSettings = await payload.findGlobal({
      slug: 'siteSettings',
    })
  } catch (error) {
    console.warn('SiteSettings global not found')
  }

  try {
    headerGlobal = await payload.findGlobal({
      slug: 'header',
    })
  } catch (error) {
    console.warn('Header global not found')
  }

  try {
    navigationGlobal = await payload.findGlobal({
      slug: 'navigation',
    })
  } catch (error) {
    console.warn('Navigation global not found')
  }

  return (
    <html
      className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
      lang="nl"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <GoogleAnalytics />
      </head>
      <body className="antialiased">
        <Providers>
          <ThemeProvider theme={themeGlobal}>
            <AdminBar />
            <LivePreviewListener />

            {/* Top Bar (optional, CMS-driven) */}
            {topBarSettings?.enabled && <PlastimedTopBar settings={topBarSettings} />}

            {/* Dynamic Header (CMS-driven) */}
            <DynamicHeader
              header={headerGlobal}
              siteSettings={siteSettings}
              shopSettings={shopSettings}
            />

            {/* Dynamic Navigation (CMS-driven) */}
            <DynamicNav navigation={navigationGlobal} />

            {/* Main Content */}
            <main className="bg-gray-50">{children}</main>

            {/* Footer (CMS-driven) */}
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
