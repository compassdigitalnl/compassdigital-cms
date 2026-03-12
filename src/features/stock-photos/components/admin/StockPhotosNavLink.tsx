'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavGroup } from '@payloadcms/ui'
import React from 'react'

export function StockPhotosNavLink() {
  const pathname = usePathname()

  return (
    <NavGroup label="Tools">
      <Link
        href="/admin/stock-photos"
        className={`nav__link ${pathname === '/admin/stock-photos' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Stock Foto&apos;s</span>
      </Link>
    </NavGroup>
  )
}
