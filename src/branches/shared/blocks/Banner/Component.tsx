'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { BannerBlockProps, BannerVariant, BannerPosition } from './types'

/**
 * B-34 Banner Block Component (Client)
 *
 * Thin announcement/promo banner with dismiss functionality.
 * Info=blue, promo=teal, warning=amber.
 * Inline or sticky top position. Text + optional link + dismiss X.
 */

const variantStyles: Record<string, string> = {
  info: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white',
  announcement: 'bg-gradient-to-r from-navy to-navy-light text-white',
  promo: 'bg-gradient-to-r from-teal to-teal-light text-white',
  warning: 'bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950',
}

export const BannerBlockComponent: React.FC<BannerBlockProps> = (props) => {
  const {
    link,
    linkLabel,
    icon,
    variant = 'info',
    position = 'inline',
    dismissible = true,
  } = props
  // Support both old field name 'message' and new field name 'text'
  const text = (props as any).message || (props as any).text || ''
  // Support old field names from config.ts
  const ctaLink = link || (props as any).ctaLink
  const ctaLabel = linkLabel || (props as any).ctaText
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !text) return null

  const currentVariant = (variant || 'info') as BannerVariant
  const currentPosition = (position || 'inline') as BannerPosition
  const styles = variantStyles[currentVariant] || variantStyles.info

  return (
    <div
      className={`${styles} ${currentPosition === 'top' ? 'sticky top-0 z-50' : ''} w-full`}
      role="banner"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-6 py-2.5 text-sm">
        {/* Icon */}
        {icon && <span className="shrink-0">{icon}</span>}

        {/* Text */}
        <span className="font-medium">{text}</span>

        {/* Link */}
        {ctaLink && ctaLabel && (
          <Link
            href={ctaLink}
            className="shrink-0 font-bold underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            {ctaLabel}
          </Link>
        )}

        {/* Dismiss */}
        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="ml-auto shrink-0 rounded p-1 transition-colors hover:bg-white/20"
            aria-label="Sluiten"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default BannerBlockComponent
