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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">SiteForge</h1>
        <p className="text-sm text-gray-500">Platform Admin</p>
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
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">platform-admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
