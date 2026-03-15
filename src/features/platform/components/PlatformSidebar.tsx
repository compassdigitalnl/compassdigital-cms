'use client'

/**
 * Platform Admin Sidebar
 * Navigation for platform management
 */

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/platform', icon: '📊' },
  { name: 'Clients', href: '/platform/clients', icon: '👥' },
  { name: 'Deployments', href: '/platform/deployments', icon: '🚀' },
  { name: 'Monitoring', href: '/platform/monitoring', icon: '📈' },
  { name: 'Settings', href: '/platform/settings', icon: '⚙️' },
]

export default function PlatformSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-grey-light flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-grey-light">
        <h1 className="text-2xl font-bold text-navy">SiteForge</h1>
        <p className="text-sm text-grey-mid">Platform Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-grey-dark hover:bg-grey-light hover:text-navy'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-grey-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div>
            <p className="text-sm font-medium text-navy">Admin</p>
            <p className="text-xs text-grey-mid">platform-admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
