'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavGroup } from '@payloadcms/ui'
import React from 'react'

export function AnalyticsNavLinks() {
  const pathname = usePathname()

  return (
    <NavGroup label="Rapportages">
      <Link
        href="/admin/analytics"
        className={`nav__link ${pathname === '/admin/analytics' ? 'active' : ''}`}
      >
        <span className="nav__link-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
        </span>
        <span className="nav__link-label">Analytics</span>
      </Link>
      <Link
        href="/admin/insights"
        className={`nav__link ${pathname === '/admin/insights' ? 'active' : ''}`}
      >
        <span className="nav__link-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </span>
        <span className="nav__link-label">Klantinzichten</span>
      </Link>
    </NavGroup>
  )
}
