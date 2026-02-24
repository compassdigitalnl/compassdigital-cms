'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, Gift, AlertTriangle, Info, Zap, Star, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

/**
 * B19 - Banner Block Component
 *
 * Full-width top announcement banner with gradient backgrounds and optional sticky positioning.
 *
 * FEATURES:
 * - 3 gradient variants: announcement (navy), promo (teal), warning (amber)
 * - Lucide icons (6 options + none)
 * - Optional CTA link with newTab support
 * - Dismissible with localStorage persistence
 * - Optional sticky positioning (z-index: 100)
 * - Date range visibility (showFrom/showUntil)
 * - Responsive: horizontal desktop → vertical mobile
 *
 * @see src/branches/shared/blocks/Banner/config.ts
 * @see docs/refactoring/sprint-6/b19-banner.html
 */

type BannerVariant = 'announcement' | 'promo' | 'warning'
type BannerIcon = 'bell' | 'gift' | 'alert-triangle' | 'info' | 'zap' | 'star' | 'none'

interface BannerLink {
  text?: string
  url?: string
  newTab?: boolean
}

interface BannerBlockProps {
  variant?: BannerVariant
  message?: string
  icon?: BannerIcon
  link?: BannerLink
  dismissible?: boolean
  dismissalKey?: string
  sticky?: boolean
  showFrom?: string // ISO date string
  showUntil?: string // ISO date string
}

// Icon mapping
const iconComponents = {
  bell: Bell,
  gift: Gift,
  'alert-triangle': AlertTriangle,
  info: Info,
  zap: Zap,
  star: Star,
  none: null,
}

// Variant gradients
const variantStyles = {
  announcement: 'bg-gradient-to-r from-navy to-navy-light',
  promo: 'bg-gradient-to-r from-teal to-teal-light',
  warning: 'bg-gradient-to-r from-amber-500 to-amber-600',
}

export const BannerBlockComponent: React.FC<BannerBlockProps> = ({
  variant = 'announcement',
  message,
  icon = 'bell',
  link,
  dismissible = true,
  dismissalKey,
  sticky = false,
  showFrom,
  showUntil,
}) => {
  const [isVisible, setIsVisible] = useState(true)

  // Check if banner should be shown based on dates and dismissal
  useEffect(() => {
    // Check date range
    const now = new Date()
    if (showFrom && new Date(showFrom) > now) {
      setIsVisible(false)
      return
    }
    if (showUntil && new Date(showUntil) < now) {
      setIsVisible(false)
      return
    }

    // Check localStorage for dismissal
    if (dismissible && dismissalKey) {
      try {
        const isDismissed = localStorage.getItem(`banner-dismissed-${dismissalKey}`)
        if (isDismissed === 'true') {
          setIsVisible(false)
        }
      } catch (error) {
        console.warn('Banner: localStorage not available', error)
      }
    }
  }, [showFrom, showUntil, dismissible, dismissalKey])

  const handleDismiss = () => {
    if (dismissalKey) {
      try {
        localStorage.setItem(`banner-dismissed-${dismissalKey}`, 'true')
      } catch (error) {
        console.warn('Banner: Failed to save dismissal to localStorage', error)
      }
    }
    setIsVisible(false)
  }

  if (!isVisible || !message) return null

  const IconComponent = iconComponents[icon]

  return (
    <div
      className={`
        relative w-full py-3.5 px-5 flex items-center justify-center gap-4 text-white text-sm transition-all duration-300
        ${variantStyles[variant]}
        ${sticky ? 'sticky top-0 z-[100]' : ''}
        sm:flex-row flex-col
      `}
    >
      <div className="flex items-center gap-3 flex-1 max-w-4xl justify-center sm:flex-row flex-col sm:items-center items-start">
        {/* Icon (hidden on mobile) */}
        {IconComponent && (
          <IconComponent className="w-5 h-5 flex-shrink-0 opacity-90 hidden sm:block" />
        )}

        {/* Message */}
        <span className="text-sm font-medium leading-relaxed">
          {message}
        </span>

        {/* CTA Link */}
        {link?.text && link?.url && (
          <Link
            href={link.url}
            className="font-bold underline underline-offset-2 whitespace-nowrap transition-opacity hover:opacity-80"
            target={link.newTab ? '_blank' : undefined}
            rel={link.newTab ? 'noopener noreferrer' : undefined}
          >
            {link.text}
          </Link>
        )}
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center flex-shrink-0 transition-all bg-white/15 hover:bg-white/25 sm:relative absolute top-2 right-2"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
