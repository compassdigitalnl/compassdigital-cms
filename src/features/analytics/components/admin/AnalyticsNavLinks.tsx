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
        <span className="nav__link-label">Analytics</span>
      </Link>
      <Link
        href="/admin/insights"
        className={`nav__link ${pathname === '/admin/insights' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Klantinzichten</span>
      </Link>
    </NavGroup>
  )
}
