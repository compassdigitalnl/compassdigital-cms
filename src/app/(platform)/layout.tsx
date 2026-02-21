/**
 * Platform Admin Layout
 * Wraps all platform management pages
 *
 * Note: This layout does NOT include <html> and <body> tags!
 * Those are provided by the root layout (src/app/layout.tsx).
 */

import React from 'react'
import PlatformSidebar from '@/branches/platform/components/PlatformSidebar'
import '../globals.css'

export const metadata = {
  title: 'Platform Admin - SiteForge',
  description: 'Multi-tenant platform administration',
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <PlatformSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
