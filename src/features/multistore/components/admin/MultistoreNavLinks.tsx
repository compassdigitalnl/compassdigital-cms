'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavGroup } from '@payloadcms/ui'
import React from 'react'

export function MultistoreNavLinks() {
  const pathname = usePathname()

  return (
    <NavGroup label="Multistore Hub">
      <Link
        href="/admin/multistore"
        className={`nav__link ${pathname === '/admin/multistore' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Dashboard</span>
      </Link>
      <Link
        href="/admin/multistore/orders"
        className={`nav__link ${pathname === '/admin/multistore/orders' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Bestellingen</span>
      </Link>
      <Link
        href="/admin/multistore/inventory"
        className={`nav__link ${pathname === '/admin/multistore/inventory' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Voorraad</span>
      </Link>
      <Link
        href="/admin/multistore/fulfillment"
        className={`nav__link ${pathname === '/admin/multistore/fulfillment' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Fulfillment</span>
      </Link>
      <Link
        href="/admin/multistore/distribution"
        className={`nav__link ${pathname === '/admin/multistore/distribution' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Distributie</span>
      </Link>
      <Link
        href="/admin/multistore/reports"
        className={`nav__link ${pathname === '/admin/multistore/reports' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Rapporten</span>
      </Link>
    </NavGroup>
  )
}
