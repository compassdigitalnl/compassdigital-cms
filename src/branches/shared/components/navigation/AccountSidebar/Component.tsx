'use client'

import React from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Repeat,
  Heart,
  MapPin,
  Building2,
  FileText,
  Settings,
  LogOut,
  Calendar,
} from 'lucide-react'

export interface AccountNavItem {
  /** Navigation item label */
  label: string
  /** Link href */
  href: string
  /** Lucide icon component */
  icon: LucideIcon
  /** Badge count (optional) - shown in coral pill */
  badge?: number
  /** Whether this is the active page */
  active?: boolean
  /** Whether this is a logout link (special coral styling) */
  isLogout?: boolean
}

export interface AccountSidebarProps {
  /** User's full name */
  userName: string
  /** User's initials for avatar (e.g., "JV") */
  userInitials: string
  /** Company name (B2B) - hidden if not provided */
  companyName?: string
  /** Member since date (e.g., "maart 2019") */
  memberSince: string
  /** Navigation items */
  navItems: AccountNavItem[]
  /** Additional className for sidebar */
  className?: string
}

/**
 * C24-AccountSidebar - User profile card + navigation menu for account pages
 *
 * Features:
 * - Gradient avatar with user initials
 * - User name and company name (B2B only)
 * - Membership date with calendar icon
 * - Icon-based navigation with active states
 * - Badge counts for pending items (notifications, orders, etc.)
 * - Special logout link styling (coral)
 * - Theme variable compliant (no hardcoded colors)
 *
 * Design Tokens:
 * - Width: 280px (desktop), 100% (mobile)
 * - Avatar: 64x64px, gradient (teal to teal-light), 16px border-radius
 * - Active state: teal-glow background + 3px left border (teal)
 * - Badge: 10px font, coral background, white text
 * - Icons: 18px (nav), 12px (calendar)
 *
 * @example
 * ```tsx
 * <AccountSidebar
 *   userName="Jan de Vries"
 *   userInitials="JV"
 *   companyName="Huisartsenpraktijk De Vries"
 *   memberSince="maart 2019"
 *   navItems={[
 *     { label: 'Dashboard', href: '/account', icon: LayoutDashboard, active: true },
 *     { label: 'Bestellingen', href: '/account/orders', icon: Package, badge: 2 },
 *     { label: 'Uitloggen', href: '/auth/logout', icon: LogOut, isLogout: true },
 *   ]}
 * />
 * ```
 */
export function AccountSidebar({
  userName,
  userInitials,
  companyName,
  memberSince,
  navItems,
  className = '',
}: AccountSidebarProps) {
  return (
    <aside
      className={`account-sidebar ${className}`}
      style={{
        width: '100%',
        maxWidth: '280px',
      }}
    >
      {/* User Profile Card */}
      <div
        className="account-user"
        style={{
          background: 'var(--color-white, #FAFBFC)',
          border: '1px solid var(--color-grey, #E8ECF1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '16px',
          textAlign: 'center',
          transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Avatar */}
        <div
          className="user-avatar"
          style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, var(--color-teal, #00897B), var(--color-teal-light, #26A69A))',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '24px',
            fontWeight: 800,
            margin: '0 auto 12px',
            boxShadow: '0 4px 12px rgba(0, 137, 123, 0.25)',
          }}
        >
          {userInitials}
        </div>

        {/* User Name */}
        <div
          className="user-name"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '16px',
            fontWeight: 800,
            color: 'var(--color-navy, #0A1628)',
            lineHeight: 1.3,
          }}
        >
          {userName}
        </div>

        {/* Company Name (B2B only) */}
        {companyName && (
          <div
            className="user-company"
            style={{
              fontSize: '13px',
              color: 'var(--color-grey-mid, #94A3B8)',
              marginTop: '2px',
              lineHeight: 1.4,
            }}
          >
            {companyName}
          </div>
        )}

        {/* Member Since */}
        <div
          className="user-since"
          style={{
            fontSize: '11px',
            color: 'var(--color-grey-mid, #94A3B8)',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <Calendar
            style={{
              width: '12px',
              height: '12px',
            }}
          />
          Klant sinds {memberSince}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav
        className="account-nav"
        style={{
          background: 'var(--color-white, #FAFBFC)',
          border: '1px solid var(--color-grey, #E8ECF1)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isLast = index === navItems.length - 1

          // Base styles
          const baseStyles: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            borderBottom: isLast ? 'none' : '1px solid var(--color-grey, #E8ECF1)',
            cursor: 'pointer',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-navy, #0A1628)',
            textDecoration: 'none',
            position: 'relative',
          }

          // Active state
          if (item.active) {
            baseStyles.background = 'var(--color-teal-glow, rgba(0, 137, 123, 0.15))'
            baseStyles.color = 'var(--color-teal, #00897B)'
            baseStyles.fontWeight = 700
            baseStyles.borderLeft = '3px solid var(--color-teal, #00897B)'
          }

          // Logout link styling
          if (item.isLogout) {
            baseStyles.color = 'var(--color-coral, #FF6B6B)'
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${item.active ? 'active' : ''} ${item.isLogout ? 'logout' : ''}`}
              style={baseStyles}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = item.isLogout
                    ? 'var(--color-coral-light, #FFF0F0)'
                    : 'var(--color-teal-glow, rgba(0, 137, 123, 0.15))'
                  if (!item.isLogout) {
                    e.currentTarget.style.color = 'var(--color-teal, #00897B)'
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = item.isLogout
                    ? 'var(--color-coral, #FF6B6B)'
                    : 'var(--color-navy, #0A1628)'
                }
              }}
            >
              <Icon
                style={{
                  width: '18px',
                  height: '18px',
                  flexShrink: 0,
                }}
              />
              {item.label}
              {item.badge && item.badge > 0 && (
                <span
                  className="badge"
                  style={{
                    marginLeft: 'auto',
                    background: 'var(--color-coral, #FF6B6B)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '100px',
                    lineHeight: 1,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

// Export commonly used icons for convenience
export const AccountIcons = {
  LayoutDashboard,
  Package,
  ClipboardList,
  Repeat,
  Heart,
  MapPin,
  Building2,
  FileText,
  Settings,
  LogOut,
}
