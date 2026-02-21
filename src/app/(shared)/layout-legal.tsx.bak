import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SearchProvider } from '@/components/Search/SearchProvider'
import { MiniCartProvider } from '@/components/ui/MiniCart'
import { ToastProvider } from '@/components/ui/Toast'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { PlastimedTopBar } from '@/components/Plastimed/TopBar'
import { DynamicHeader } from '@/components/DynamicHeader'
import { DynamicNav } from '@/components/DynamicNav'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import '../(app)/globals.css'

export const dynamic = 'force-dynamic'

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const payload = await getPayload({ config: configPromise })

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
            <SearchProvider>
              <ToastProvider>
                <MiniCartProvider>
                  <AdminBar />
                  <LivePreviewListener />
                  {headerGlobal?.topBar?.enabled && <PlastimedTopBar settings={headerGlobal.topBar} />}
                  <DynamicHeader header={headerGlobal} settings={settingsGlobal} />
                  <DynamicNav navigation={headerGlobal?.navigation} />
                  <main className="bg-gray-50">{children}</main>
                  <Footer />
                </MiniCartProvider>
              </ToastProvider>
            </SearchProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
