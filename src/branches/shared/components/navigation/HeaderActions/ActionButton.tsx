/**
 * ActionButton Component
 *
 * Generic action button for wishlist, compare, custom actions
 * Supports badges and custom URLs
 */

'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'

export interface ActionButtonProps {
  icon: string // Lucide icon name
  action: 'search' | 'wishlist' | 'compare' | 'custom'
  customUrl?: string
  showBadge?: boolean
  badgeCount?: number
  showOnMobile?: boolean
  ariaLabel?: string
  className?: string
}

export function ActionButton({
  icon,
  action,
  customUrl,
  showBadge = false,
  badgeCount = 0,
  showOnMobile = true,
  ariaLabel,
  className = '',
}: ActionButtonProps) {
  // Convert icon name to PascalCase for Lucide icon lookup
  const IconComponent = (LucideIcons as any)[
    icon
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  ]

  // Determine URL based on action type
  const getUrl = () => {
    if (customUrl) return customUrl

    switch (action) {
      case 'wishlist':
        return '/wishlist'
      case 'compare':
        return '/compare'
      case 'search':
        return '/search'
      default:
        return '#'
    }
  }

  // Determine aria-label
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel

    switch (action) {
      case 'wishlist':
        return badgeCount > 0 ? `Wishlist (${badgeCount} items)` : 'Wishlist'
      case 'compare':
        return badgeCount > 0 ? `Compare (${badgeCount} items)` : 'Compare products'
      case 'search':
        return 'Search'
      default:
        return 'Action'
    }
  }

  // Handle click for search action (opens search overlay)
  const handleClick = (e: React.MouseEvent) => {
    if (action === 'search') {
      e.preventDefault()
      // Dispatch event to open search overlay
      window.dispatchEvent(new CustomEvent('openSearch'))
    }
  }

  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in Lucide icons`)
    return null
  }

  return (
    <a
      href={getUrl()}
      onClick={handleClick}
      className={`action-button ${!showOnMobile ? 'hide-mobile' : ''} ${className}`}
      aria-label={getAriaLabel()}
    >
      <div className="action-icon-wrapper">
        <IconComponent size={20} aria-hidden="true" />
        {showBadge && badgeCount > 0 && (
          <span className="action-badge" aria-label={`${badgeCount} items`}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </span>
        )}
      </div>

      <style jsx>{`
        .action-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-2, 8px);
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: background-color 0.2s ease;
          cursor: pointer;
        }

        .action-button:hover {
          background: var(--color-surface, #f5f5f5);
        }

        .action-icon-wrapper {
          position: relative;
        }

        .action-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--color-accent, #00d4aa);
          color: var(--color-white, #fff);
          font-size: var(--font-size-xs, 10px);
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 12px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Mobile: hide if showOnMobile is false */
        @media (max-width: 767px) {
          .action-button.hide-mobile {
            display: none;
          }
        }
      `}</style>
    </a>
  )
}
