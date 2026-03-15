'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavGroup } from '@payloadcms/ui'
import React from 'react'

export function SupportNavLinks() {
  const pathname = usePathname()

  return (
    <NavGroup label="Support">
      <Link
        href="/admin/support"
        className={`nav__link ${pathname === '/admin/support' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Support Dashboard</span>
      </Link>
      <Link
        href="/admin/support/chats"
        className={`nav__link ${pathname === '/admin/support/chats' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Chat Analyse</span>
      </Link>
    </NavGroup>
  )
}
