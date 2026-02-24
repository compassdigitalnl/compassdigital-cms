/**
 * HeaderActions Component
 *
 * Right-side action buttons: cart, account, wishlist, etc.
 * Configurable via Header global, supports badges
 */

'use client'

import React from 'react'
import { CartButton } from './CartButton'
import { AccountButton } from './AccountButton'
import { ActionButton } from './ActionButton'

export interface HeaderAction {
  icon: string // Lucide icon name
  action: 'search' | 'cart' | 'account' | 'wishlist' | 'compare' | 'custom'
  customUrl?: string
  showBadge?: boolean
  showOnMobile?: boolean
  badgeCount?: number
}

export interface HeaderActionsProps {
  actions?: HeaderAction[]
  variant?: 'default' | 'minimal' // Minimal: fewer actions
  className?: string
}

export function HeaderActions({
  actions = [
    { icon: 'shopping-cart', action: 'cart', showBadge: true, showOnMobile: true },
    { icon: 'user', action: 'account', showOnMobile: false },
  ],
  variant = 'default',
  className = '',
}: HeaderActionsProps) {
  return (
    <div className={`header-actions ${variant} ${className}`}>
      {actions.map((actionConfig, index) => {
        // Special components for cart and account
        if (actionConfig.action === 'cart') {
          return (
            <CartButton
              key={index}
              showBadge={actionConfig.showBadge}
              showOnMobile={actionConfig.showOnMobile}
              count={actionConfig.badgeCount}
            />
          )
        }

        if (actionConfig.action === 'account') {
          return (
            <AccountButton
              key={index}
              showOnMobile={actionConfig.showOnMobile}
            />
          )
        }

        // Generic action button for other actions
        return (
          <ActionButton
            key={index}
            icon={actionConfig.icon}
            action={actionConfig.action}
            customUrl={actionConfig.customUrl}
            showBadge={actionConfig.showBadge}
            showOnMobile={actionConfig.showOnMobile}
            badgeCount={actionConfig.badgeCount}
          />
        )
      })}

      <style jsx>{`
        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2, 8px);
        }

        .header-actions.minimal {
          gap: var(--space-1, 4px);
        }

        /* Mobile: hide actions with showOnMobile: false */
        @media (max-width: 767px) {
          .header-actions {
            gap: var(--space-1, 4px);
          }
        }
      `}</style>
    </div>
  )
}
