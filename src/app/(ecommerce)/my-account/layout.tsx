'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { features } from '@/lib/features'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  MapPin,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  Menu,
  X,
  CreditCard,
  KeyRound,
  Gift,
  Award,
  FileText,
  RefreshCw,
  Heart,
} from 'lucide-react'

export default function MyAccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // TODO: Replace with real user data from useAuth()
  const user = {
    name: 'Jan de Vries',
    email: 'jan.jansen@example.com',
    company: 'Plastimed B.V.',
    memberSince: '2023-03-15',
    initials: 'JV',
  }

  // All possible navigation items with feature requirements
  const allNavigation = [
    { name: 'Dashboard', href: '/my-account', icon: LayoutDashboard, requiresFeature: null },
    { name: 'Bestellingen', href: '/my-account/orders', icon: Package, requiresFeature: 'checkout' as const },
    { name: 'Abonnementen', href: '/my-account/subscriptions', icon: CreditCard, requiresFeature: 'subscriptions' as const },
    { name: 'Licenties', href: '/my-account/licenses', icon: KeyRound, requiresFeature: 'licenses' as const },
    { name: 'Cadeaubonnen', href: '/my-account/gift-vouchers', icon: Gift, requiresFeature: 'giftVouchers' as const },
    { name: 'Loyalty', href: '/my-account/loyalty', icon: Award, requiresFeature: 'loyalty' as const },
    { name: 'Facturen', href: '/my-account/invoices', icon: FileText, requiresFeature: 'invoices' as const },
    { name: 'Bestelformulieren', href: '/my-account/lists', icon: ClipboardList, requiresFeature: 'orderLists' as const },
    { name: 'Terugkerende Orders', href: '/my-account/recurring-orders', icon: RefreshCw, requiresFeature: 'recurringOrders' as const },
    { name: 'Favorieten', href: '/my-account/favorites', icon: Heart, requiresFeature: 'wishlists' as const },
    { name: 'Adressen', href: '/my-account/addresses', icon: MapPin, requiresFeature: 'addresses' as const },
    { name: 'Instellingen', href: '/my-account/settings', icon: Settings, requiresFeature: null },
  ]

  // Filter navigation based on enabled features
  const navigation = allNavigation.filter((item) => {
    if (!item.requiresFeature) return true // Always show items without feature requirement
    return features[item.requiresFeature] === true
  })

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...')
    router.push('/')
  }

  const isActive = (href: string) => {
    if (href === '/my-account') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  const memberSinceDate = new Date(user.memberSince).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="min-h-screen" style={{ background: '#F5F7FA' }}>
      {/* Mobile Header */}
      <div
        className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-4"
        style={{ background: '#0A1628', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <Link href="/" className="flex items-center gap-2 text-white">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold" style={{ fontSize: '14px' }}>
            Terug naar shop
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(10,22,40,0.95)', paddingTop: '64px' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="p-4 space-y-4">
            {/* User Card */}
            <div className="bg-white rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
                    color: 'white',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 800,
                    fontSize: '18px',
                  }}
                >
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-bold truncate"
                    style={{
                      fontSize: '16px',
                      color: '#0A1628',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    {user.name}
                  </div>
                  {user.company && (
                    <div
                      className="truncate"
                      style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}
                    >
                      {user.company}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                    Klant sinds {memberSinceDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                    style={{
                      background: active ? 'rgba(0,137,123,0.1)' : 'rgba(255,255,255,0.05)',
                      border: active ? '1.5px solid #00897B' : '1.5px solid transparent',
                    }}
                  >
                    <Icon
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: active ? '#00897B' : '#94A3B8' }}
                    />
                    <span
                      className="flex-1 font-semibold"
                      style={{
                        fontSize: '14px',
                        color: active ? '#00897B' : '#FAFBFC',
                      }}
                    >
                      {item.name}
                    </span>
                  </Link>
                )
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                style={{
                  background: 'rgba(255,107,107,0.1)',
                  border: '1.5px solid transparent',
                }}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" style={{ color: '#FF6B6B' }} />
                <span
                  className="flex-1 text-left font-semibold"
                  style={{ fontSize: '14px', color: '#FF6B6B' }}
                >
                  Uitloggen
                </span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              {/* User Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
                      color: 'white',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 800,
                      fontSize: '18px',
                    }}
                  >
                    {user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-bold truncate"
                      style={{
                        fontSize: '15px',
                        color: '#0A1628',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                      }}
                    >
                      {user.name}
                    </div>
                    {user.company && (
                      <div
                        className="truncate"
                        style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}
                      >
                        {user.company}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="pt-3"
                  style={{ borderTop: '1px solid #E8ECF1', fontSize: '12px', color: '#94A3B8' }}
                >
                  Klant sinds {memberSinceDate}
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-white rounded-2xl p-3 shadow-sm">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                        style={{
                          background: active ? 'rgba(0,137,123,0.08)' : 'transparent',
                          color: active ? '#00897B' : '#0A1628',
                        }}
                      >
                        <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                        <span className="flex-1 font-semibold" style={{ fontSize: '14px' }}>
                          {item.name}
                        </span>
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-3 pt-3" style={{ borderTop: '1px solid #E8ECF1' }}>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-red-50"
                    style={{ color: '#FF6B6B' }}
                  >
                    <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
                    <span className="font-semibold" style={{ fontSize: '14px' }}>
                      Uitloggen
                    </span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}
