/**
 * Platform Admin Layout
 * Wraps all platform management pages
 */

import React from 'react'
import { Inter } from 'next/font/google'
import '@/app/(app)/globals.css'
import PlatformSidebar from '@/platform/components/PlatformSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Platform Admin - SiteForge',
  description: 'Multi-tenant platform administration',
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <PlatformSidebar />

          {/* Main Content */}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
