'use client'

/**
 * Sprint 7: Premium Badge Component
 *
 * Small badge indicator for premium/pro content
 */

import React from 'react'
import { Lock, Crown, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface PremiumBadgeProps {
  /**
   * Badge variant
   * - solid: Filled background (default)
   * - outline: Border only
   * - subtle: Light background
   */
  variant?: 'solid' | 'outline' | 'subtle'

  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Icon to show
   * - lock: Lock icon (default)
   * - crown: Crown icon (premium feel)
   * - sparkles: Sparkles icon (modern)
   * - none: No icon
   */
  icon?: 'lock' | 'crown' | 'sparkles' | 'none'

  /**
   * Custom text (default: "Pro")
   */
  text?: string

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Show as pill shape instead of rounded rectangle
   */
  pill?: boolean
}

/**
 * Premium Badge Component
 *
 * Displays a small badge to indicate premium/pro content
 *
 * @example
 * ```tsx
 * <PremiumBadge variant="solid" size="sm" icon="lock" />
 * <PremiumBadge variant="outline" text="Premium" icon="crown" />
 * <PremiumBadge variant="subtle" size="lg" icon="sparkles" />
 * ```
 */
export function PremiumBadge({
  variant = 'solid',
  size = 'sm',
  icon = 'lock',
  text = 'Pro',
  className = '',
  pill = false,
}: PremiumBadgeProps) {
  // Icon mapping
  const iconMap: Record<string, LucideIcon> = {
    lock: Lock,
    crown: Crown,
    sparkles: Sparkles,
  }
  const IconComponent = icon !== 'none' ? iconMap[icon] : null

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  }

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }

  // Variant classes
  const variantClasses = {
    solid: `
      bg-gradient-to-r from-amber-500 to-orange-500
      text-white
      shadow-sm
    `,
    outline: `
      border-2 border-amber-500
      text-amber-600 dark:text-amber-400
      bg-transparent
    `,
    subtle: `
      bg-amber-50 dark:bg-amber-950/30
      text-amber-700 dark:text-amber-400
      border border-amber-200 dark:border-amber-800
    `,
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-semibold uppercase tracking-wide
        ${pill ? 'rounded-full' : 'rounded-md'}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        transition-all duration-200
        ${className}
      `}
    >
      {IconComponent && <IconComponent className={iconSizeClasses[size]} />}
      <span>{text}</span>
    </span>
  )
}

/**
 * Compact Premium Icon Badge
 *
 * Small icon-only version for minimal UI
 */
export function PremiumIcon({
  icon = 'lock',
  size = 'sm',
  className = '',
}: Pick<PremiumBadgeProps, 'icon' | 'size' | 'className'>) {
  const iconMap: Record<string, LucideIcon> = {
    lock: Lock,
    crown: Crown,
    sparkles: Sparkles,
  }
  const IconComponent = icon !== 'none' ? iconMap[icon] : null

  if (!IconComponent) return null

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center
        text-amber-600 dark:text-amber-400
        ${className}
      `}
      title="Premium content"
    >
      <IconComponent className={sizeClasses[size]} />
    </span>
  )
}
