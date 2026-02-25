'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'
import type { AccountSidebarProps } from './types'

// Helper: Get Lucide icon by name
function getIcon(iconName: string) {
  const pascalCase = iconName
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  return (LucideIcons as any)[pascalCase] || LucideIcons.User
}

// Helper: Format member since date
function formatMemberSince(isoTimestamp: string): string {
  const date = new Date(isoTimestamp)
  const month = date.toLocaleString('nl-NL', { month: 'long' })
  const year = date.getFullYear()
  return `${month} ${year}`
}

// Helper: Generate initials from name
function generateInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * AccountSidebar Component
 *
 * Vertical navigation sidebar for user account pages. Includes user profile card,
 * navigation links with icons and badges, and logout button.
 *
 * @example
 * ```tsx
 * <AccountSidebar
 *   user={{
 *     name: 'Jan de Vries',
 *     company: 'Huisartsenpraktijk De Vries',
 *     memberSince: '2024-01-15T10:00:00Z',
 *   }}
 *   navigationLinks={[
 *     { label: 'Mijn account', href: '/account', icon: 'user', isActive: true },
 *     { label: 'Bestellingen', href: '/account/orders', icon: 'package', badge: 2 },
 *   ]}
 *   onLogout={handleLogout}
 * />
 * ```
 */
export function AccountSidebar({
  user,
  navigationLinks,
  onLogout,
  className = '',
}: AccountSidebarProps) {
  const userInitials = user.initials || generateInitials(user.name)
  const memberSince = formatMemberSince(user.memberSince)

  const handleLogout = async () => {
    if (confirm('Weet u zeker dat u wilt uitloggen?')) {
      if (onLogout) {
        await onLogout()
      }
    }
  }

  return (
    <aside className={`sidebar ${className}`} role="navigation" aria-label="Account navigatie">
      {/* User Card */}
      <div className="sidebar-user">
        <div className="user-avatar" aria-hidden="true">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} />
          ) : (
            <span className="user-initials">{userInitials}</span>
          )}
        </div>
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          {user.company && <div className="user-company">{user.company}</div>}
          <div className="user-since">Lid sinds {memberSince}</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navigationLinks.map((link) => {
          const Icon = getIcon(link.icon)
          return (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${link.isActive ? 'active' : ''}`}
              aria-current={link.isActive ? 'page' : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="nav-label">{link.label}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="nav-badge" aria-label={`${link.badge} nieuwe items`}>
                  {link.badge}
                </span>
              )}
            </a>
          )
        })}
      </nav>

      {/* Logout Button */}
      {onLogout && (
        <button className="sidebar-logout" onClick={handleLogout} type="button">
          <LucideIcons.LogOut size={18} aria-hidden="true" />
          Uitloggen
        </button>
      )}

      <style jsx>{`
        .sidebar {
          max-width: 280px;
          width: 100%;
        }

        .sidebar-user {
          background: white;
          border: 1px solid var(--grey);
          border-radius: var(--radius-lg);
          padding: var(--space-16);
          margin-bottom: var(--space-12);
          transition: all var(--transition);
        }

        .sidebar-user:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          border-color: var(--grey-mid);
        }

        .user-avatar {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--teal), var(--teal-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-12);
          overflow: hidden;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-initials {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 800;
          color: white;
        }

        .user-info {
          text-align: center;
        }

        .user-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: var(--space-2);
        }

        .user-company {
          font-size: 13px;
          font-weight: 600;
          color: var(--grey-mid);
          margin-bottom: var(--space-4);
        }

        .user-since {
          font-size: 12px;
          color: var(--grey-mid);
        }

        .sidebar-nav {
          background: white;
          border: 1px solid var(--grey);
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: var(--space-12);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--space-10);
          padding: var(--space-12) var(--space-14);
          border-bottom: 1px solid var(--grey-light);
          text-decoration: none;
          color: var(--navy);
          font-size: 14px;
          font-weight: 600;
          transition: all var(--transition);
          position: relative;
        }

        .nav-link:last-child {
          border-bottom: none;
        }

        .nav-link:hover {
          background: var(--teal-glow);
          color: var(--teal-dark);
        }

        .nav-link.active {
          background: var(--teal-glow);
          color: var(--teal-dark);
        }

        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--teal);
        }

        .nav-link :global(svg) {
          color: var(--grey-mid);
          flex-shrink: 0;
        }

        .nav-link.active :global(svg),
        .nav-link:hover :global(svg) {
          color: var(--teal);
        }

        .nav-label {
          flex: 1;
        }

        .nav-badge {
          background: var(--coral);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          min-width: 20px;
          text-align: center;
        }

        .sidebar-logout {
          width: 100%;
          background: white;
          border: 1px solid var(--grey);
          border-radius: var(--radius-lg);
          padding: var(--space-12) var(--space-14);
          display: flex;
          align-items: center;
          gap: var(--space-10);
          cursor: pointer;
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          color: var(--coral);
          transition: all var(--transition);
        }

        .sidebar-logout:hover {
          background: var(--coral-light);
          border-color: var(--coral);
        }

        .sidebar-logout :global(svg) {
          color: var(--coral);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .sidebar {
            max-width: 100%;
          }
        }
      `}</style>
    </aside>
  )
}
