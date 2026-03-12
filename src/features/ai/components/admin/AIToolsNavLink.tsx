'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavGroup } from '@payloadcms/ui'
import React from 'react'

export function AIToolsNavLink() {
  const pathname = usePathname()

  return (
    <NavGroup label="AI Tools">
      <Link
        href="/admin/ai-studio"
        className={`nav__link ${pathname === '/admin/ai-studio' ? 'active' : ''}`}
      >
        <span className="nav__link-label">AI Studio</span>
      </Link>
      <Link
        href="/admin/content-templates"
        className={`nav__link ${pathname === '/admin/content-templates' ? 'active' : ''}`}
      >
        <span className="nav__link-label">Content Templates</span>
      </Link>
    </NavGroup>
  )
}
