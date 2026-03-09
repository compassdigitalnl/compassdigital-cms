'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { useFeatures } from '@/providers/Features'
import { AccountTemplateProvider } from '@/branches/ecommerce/shared/contexts/AccountTemplateContext'
import { AccountMobileNav, AccountDesktopSidebar } from '@/branches/ecommerce/shared/components/account/ui/AccountSidebar'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  MapPin,
  Settings,
  CreditCard,
  KeyRound,
  Gift,
  Award,
  FileText,
  RefreshCw,
  Heart,
  Undo2,
  FileCheck,
  Users,
  ClipboardCheck,
  Wallet,
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
    { name: 'Offertes', href: '/account/quotes', icon: FileCheck, requiresFeature: 'checkout' as const },
    { name: 'Abonnementen', href: '/account/subscriptions', icon: CreditCard, requiresFeature: 'subscriptions' as const },
    { name: 'Licenties', href: '/account/licenses', icon: KeyRound, requiresFeature: 'licenses' as const },
    { name: 'Cadeaubonnen', href: '/account/gift-vouchers', icon: Gift, requiresFeature: 'giftVouchers' as const },
    { name: 'Loyalty', href: '/account/loyalty', icon: Award, requiresFeature: 'loyalty' as const },
    { name: 'Facturen', href: '/account/invoices', icon: FileText, requiresFeature: 'invoices' as const },
    { name: 'Bestelformulieren', href: '/account/lists', icon: ClipboardList, requiresFeature: 'orderLists' as const },
    { name: 'Terugkerende Orders', href: '/account/recurring-orders', icon: RefreshCw, requiresFeature: 'recurringOrders' as const },
    { name: 'Retouren', href: '/account/returns', icon: Undo2, requiresFeature: 'returns' as const },
    { name: 'Favorieten', href: '/account/favorites', icon: Heart, requiresFeature: 'wishlists' as const },
    { name: 'Team', href: '/account/team', icon: Users, requiresFeature: 'companyAccounts' as const },
    { name: 'Goedkeuringen', href: '/account/approvals', icon: ClipboardCheck, requiresFeature: 'approvalWorkflow' as const },
    { name: 'Budget & Krediet', href: '/account/budget', icon: Wallet, requiresFeature: 'budgetLimits' as const },
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

  const sidebarProps = {
    userName,
    userInitials,
    userCompany,
    memberSinceDate,
    navigation,
    pathname,
    onLogout: handleLogout,
  }

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
        {/* Mobile Header + Overlay (outside grid) */}
        <AccountMobileNav
          {...sidebarProps}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Desktop Layout */}
        <div style={{ maxWidth: 'var(--container-width, 1792px)' }} className="mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-7">
            {/* Desktop Sidebar (inside grid) */}
            <AccountDesktopSidebar {...sidebarProps} />

            {/* Main Content */}
            <main>{children}</main>
          </div>
        </div>
      </div>
    </AccountTemplateProvider>
  )
}
