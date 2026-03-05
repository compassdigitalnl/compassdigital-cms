'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { useFeatures } from '@/providers/Features'
import { AccountTemplateProvider } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  MapPin,
  Settings,
  LogOut,
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
  Undo2,
} from 'lucide-react'

export default function MyAccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, logout } = useAccountAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const features = useFeatures()
  const [templateKey, setTemplateKey] = useState('enterprise')

  // Fetch template setting client-side
  useEffect(() => {
    fetch('/api/globals/settings?depth=0')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.defaultMyAccountTemplate) {
          setTemplateKey(data.defaultMyAccountTemplate)
        }
      })
      .catch(() => {})
  }, [])

  // All possible navigation items with feature requirements
  const allNavigation = [
    { name: 'Dashboard', href: '/account', icon: LayoutDashboard, requiresFeature: null },
    { name: 'Bestellingen', href: '/account/orders', icon: Package, requiresFeature: 'checkout' as const },
    { name: 'Abonnementen', href: '/account/subscriptions', icon: CreditCard, requiresFeature: 'subscriptions' as const },
    { name: 'Licenties', href: '/account/licenses', icon: KeyRound, requiresFeature: 'licenses' as const },
    { name: 'Cadeaubonnen', href: '/account/gift-vouchers', icon: Gift, requiresFeature: 'giftVouchers' as const },
    { name: 'Loyalty', href: '/account/loyalty', icon: Award, requiresFeature: 'loyalty' as const },
    { name: 'Facturen', href: '/account/invoices', icon: FileText, requiresFeature: 'invoices' as const },
    { name: 'Bestelformulieren', href: '/account/lists', icon: ClipboardList, requiresFeature: 'orderLists' as const },
    { name: 'Terugkerende Orders', href: '/account/recurring-orders', icon: RefreshCw, requiresFeature: 'recurringOrders' as const },
    { name: 'Retouren', href: '/account/returns', icon: Undo2, requiresFeature: 'returns' as const },
    { name: 'Favorieten', href: '/account/favorites', icon: Heart, requiresFeature: 'wishlists' as const },
    { name: 'Adressen', href: '/account/addresses', icon: MapPin, requiresFeature: 'addresses' as const },
    { name: 'Instellingen', href: '/account/settings', icon: Settings, requiresFeature: null },
  ]

  // Filter navigation based on enabled features
  const navigation = allNavigation.filter((item) => {
    if (!item.requiresFeature) return true
    return features[item.requiresFeature] === true
  })

  const handleLogout = async () => {
    if (confirm('Weet u zeker dat u wilt uitloggen?')) {
      await logout()
      router.push('/')
    }
  }

  const isActive = (href: string) => {
    if (href === '/account') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  // Derive user display info from auth
  const userName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || (user.email?.split('@')[0] ?? 'Gebruiker')
    : ''
  const userInitials = user
    ? (user.firstName?.[0] || '') + (user.lastName?.[0] || user.email?.[0] || '')
    : ''
  const companyRaw = (user as any)?.company
  const userCompany = typeof companyRaw === 'string' ? companyRaw : companyRaw?.name || undefined
  const memberSinceDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long' })
    : ''

  // Show loading skeleton while auth resolves
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#F5F7FA' }}>
        <div style={{ maxWidth: 'var(--container-width, 1792px)' }} className="mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-7">
            <aside className="hidden lg:block">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-32" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-3 shadow-sm animate-pulse space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded-lg" />
                  ))}
                </div>
              </div>
            </aside>
            <main>
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-48" />
                <div className="h-5 bg-gray-200 rounded w-64" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 shadow-sm h-28" />
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AccountTemplateProvider templateKey={templateKey}>
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
                    {userInitials.toUpperCase()}
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
                      {userName}
                    </div>
                    {userCompany && (
                      <div
                        className="truncate"
                        style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}
                      >
                        {userCompany}
                      </div>
                    )}
                    {memberSinceDate && (
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                        Klant sinds {memberSinceDate}
                      </div>
                    )}
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
        <div style={{ maxWidth: 'var(--container-width, 1792px)' }} className="mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-7">
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
                      {userInitials.toUpperCase()}
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
                        {userName}
                      </div>
                      {userCompany && (
                        <div
                          className="truncate"
                          style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}
                        >
                          {userCompany}
                        </div>
                      )}
                    </div>
                  </div>
                  {memberSinceDate && (
                    <div
                      className="pt-3"
                      style={{ borderTop: '1px solid #E8ECF1', fontSize: '12px', color: '#94A3B8' }}
                    >
                      Klant sinds {memberSinceDate}
                    </div>
                  )}
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
    </AccountTemplateProvider>
  )
}
