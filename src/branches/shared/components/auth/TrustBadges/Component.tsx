'use client'

import React from 'react'
import type { TrustBadgesProps, TrustBadge } from './types'

const defaultBadges: TrustBadge[] = [
  { icon: '🔒', label: 'SSL beveiligd' },
  { icon: '🛡️', label: 'AVG compliant' },
  { icon: '✓', label: 'ISO gecertificeerd' },
]

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  badges = defaultBadges,
  className = '',
}) => {
  return (
    <div className={`trust-bar ${className}`}>
      {badges.map((badge, index) => (
        <span key={index} className="trust-item">
          <span className="trust-icon">{badge.icon}</span>
          {badge.label}
        </span>
      ))}
    </div>
  )
}

export default TrustBadges
