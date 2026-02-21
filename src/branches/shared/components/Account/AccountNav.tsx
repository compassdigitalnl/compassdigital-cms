'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@/payload-types'
import { features } from '@/lib/features'
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  KeyRound,
  Gift,
  Award,
  FileText,
  ListOrdered,
  RefreshCw,
  Heart,
  MapPin,
  Settings,
  LogOut,
} from 'lucide-react'

interface AccountNavProps {
  user: User
}

export function AccountNav({ user }: AccountNavProps) {
  const pathname = usePathname()

  // All possible navigation items with feature requirements
  const allNavigation = [
    {
      name: 'Dashboard',
      href: '/account',
      icon: LayoutDashboard,
      requiresFeature: null, // Always visible
    },
    {
      name: 'Bestellingen',
      href: '/account/orders',
      icon: ShoppingCart,
      requiresFeature: 'checkout' as const,
    },
    {
      name: 'Abonnement',
      href: '/my-account/subscription',
      icon: CreditCard,
      requiresFeature: 'subscriptions' as const,
    },
    {
      name: 'Licenties',
      href: '/my-account/licenses',
      icon: KeyRound,
      requiresFeature: 'licenses' as const,
    },
    {
      name: 'Cadeaubonnen',
      href: '/my-account/gift-vouchers',
      icon: Gift,
      requiresFeature: 'giftVouchers' as const,
    },
    {
      name: 'Loyalty',
      href: '/my-account/loyalty',
      icon: Award,
      requiresFeature: 'loyalty' as const,
    },
    {
      name: 'Facturen',
      href: '/account/invoices',
      icon: FileText,
      requiresFeature: 'invoices' as const,
    },
    {
      name: 'Bestelformulieren',
      href: '/account/order-lists',
      icon: ListOrdered,
      requiresFeature: 'orderLists' as const,
    },
    {
      name: 'Terugkerende Orders',
      href: '/account/recurring-orders',
      icon: RefreshCw,
      requiresFeature: 'recurringOrders' as const,
    },
    {
      name: 'Favorieten',
      href: '/account/favorites',
      icon: Heart,
      requiresFeature: 'wishlists' as const,
    },
    {
      name: 'Adressen',
      href: '/account/addresses',
      icon: MapPin,
      requiresFeature: 'addresses' as const,
    },
    {
      name: 'Instellingen',
      href: '/account/settings',
      icon: Settings,
      requiresFeature: null, // Always visible
    },
  ]

  // Filter navigation based on enabled features
  const navigation = allNavigation.filter((item) => {
    if (!item.requiresFeature) return true // Always show items without feature requirement
    return features[item.requiresFeature] === true
  })

  // Get user initials for avatar
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    if (user.name) {
      const nameParts = user.name.split(' ')
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      }
      return user.name.substring(0, 2).toUpperCase()
    }
    return user.email.substring(0, 2).toUpperCase()
  }

  // Get display name
  const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()

  // Get company name if B2B
  const companyName =
    user.accountType === 'b2b' && typeof user.company === 'object' && user.company?.name
      ? user.company.name
      : null

  return (
    <nav className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials()}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
            {companyName && (
              <p className="text-xs text-gray-500 truncate mt-0.5">{companyName}</p>
            )}
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Logout Section */}
      <div className="p-3 border-t border-gray-200">
        <Link
          href="/logout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Uitloggen</span>
        </Link>
      </div>
    </nav>
  )
}
