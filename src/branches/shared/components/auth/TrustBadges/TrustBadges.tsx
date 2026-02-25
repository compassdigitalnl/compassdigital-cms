'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'
import styles from './TrustBadges.module.css'

export interface TrustBadge {
  icon: string // Lucide icon name or emoji
  label: string
}

export interface TrustBadgesProps {
  badges?: TrustBadge[]
  variant?: 'horizontal' | 'vertical'
  className?: string
}

const DEFAULT_BADGES: TrustBadge[] = [
  { icon: '🔒', label: 'SSL beveiligd' },
  { icon: '🛡️', label: 'AVG compliant' },
  { icon: '✓', label: 'ISO gecertificeerd' },
]

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  badges = DEFAULT_BADGES,
  variant = 'horizontal',
  className = '',
}) => {
  return (
    <div className={`${styles.trustBar} ${styles[variant]} ${className}`}>
      {badges.map((badge, index) => {
        // Check if icon is an emoji or Lucide icon name
        const isEmoji = /[\p{Emoji}]/u.test(badge.icon)
        const IconComponent = !isEmoji
          ? (LucideIcons[badge.icon as keyof typeof LucideIcons] as React.ComponentType<{ size?: number }> | undefined)
          : null

        return (
          <span key={index} className={styles.trustItem}>
            <span className={styles.trustIcon}>
              {isEmoji ? badge.icon : IconComponent ? <IconComponent size={16} /> : badge.icon}
            </span>
            {badge.label}
          </span>
        )
      })}
    </div>
  )
}
