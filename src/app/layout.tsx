import type { ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { GoogleAnalytics } from '@/branches/shared/components/Analytics/GoogleAnalytics'
import './globals.css'

// Force dynamic rendering to avoid database queries during build
export const dynamic = 'force-dynamic'

/**
 * Root Layout
 *
 * This is the minimal root layout - only HTML shell.
 * No frontend components (Header, Footer, Nav, etc.) here!
 *
 * Frontend chrome is in the route group layouts:
 * - (content)/layout.tsx
 * - (ecommerce)/layout.tsx
 * - (shared)/layout.tsx
 * - (platform)/layout.tsx (platform-specific layout)
 * - (payload)/layout.tsx (Payload admin - handled by Payload)
 */
export default function RootLayout({ children }: { children: ReactNode }) {
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
        {children}
      </body>
    </html>
  )
}
