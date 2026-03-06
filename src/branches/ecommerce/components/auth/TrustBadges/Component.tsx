'use client'

/**
 * TrustBadges - Trust signals for auth forms
 *
 * Features:
 * - Horizontal row of trust badges
 * - Default badges: SSL, GDPR (AVG), ISO
 * - Customizable badges
 * - Responsive (stacks vertically on mobile)
 * - Small, subtle styling
 *
 * @component
 * @example
 * <TrustBadges />
 *
 * @example
 * <TrustBadges
 *   badges={[
 *     { icon: '🔒', label: 'SSL beveiligd' },
 *     { icon: '🛡️', label: 'AVG compliant' },
 *   ]}
 * />
 */

import { Shield, Lock, CheckCircle } from 'lucide-react'

export interface TrustBadge {
  icon: string | React.ReactNode // Emoji or Lucide icon
  label: string
}

export interface TrustBadgesProps {
  badges?: TrustBadge[]
  variant?: 'horizontal' | 'vertical'
  className?: string
}

const defaultBadges: TrustBadge[] = [
  { icon: <Lock className="w-3.5 h-3.5" />, label: 'SSL beveiligd' },
  { icon: <Shield className="w-3.5 h-3.5" />, label: 'AVG compliant' },
  { icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'ISO gecertificeerd' },
]

export function TrustBadges({
  badges = defaultBadges,
  variant = 'horizontal',
  className = '',
}: TrustBadgesProps) {
  return (
    <div
      className={`
        flex justify-center gap-8 pt-6 border-t
        ${variant === 'vertical' ? 'flex-col items-center gap-3' : 'max-sm:flex-col max-sm:items-center max-sm:gap-3'}
        ${className}
      `}
      style={{
        borderColor: 'var(--color-border)',
      }}
    >
      {badges.map((badge, index) => (
        <span
          key={index}
          className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide"
          style={{
            color: 'var(--color-text-muted)',
          }}
        >
          {/* Icon */}
          {typeof badge.icon === 'string' ? (
            <span className="text-base">{badge.icon}</span>
          ) : (
            badge.icon
          )}

          {/* Label */}
          {badge.label}
        </span>
      ))}
    </div>
  )
}
