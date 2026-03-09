/**
 * ProductBadge Component
 *
 * Comprehensive badge system for product cards with 8 semantic variants,
 * 3 sizes, and support for both pill (standalone) and positioned (on image) styles.
 *
 * Features:
 * - 8 semantic variants: Bestseller, Nieuw, Uitverkocht, Staffel, Eco, Aanbieding, Exclusief, B2B
 * - 3 sizes: Small (10px), Medium (12px), Large (13px)
 * - 2 styles: Pill (standalone) or Positioned (on product image)
 * - 3 positions: Top-left, Top-right, Ribbon
 * - Icon support with Lucide icons
 * - Animated pulsing effect option
 * - Clickable for filters
 * - Full accessibility support
 *
 * @category E-commerce
 * @component C18
 */

'use client'

import React from 'react'
import {
  Flame,
  Sparkles,
  Clock,
  Layers,
  Leaf,
  Percent,
  Crown,
  Building2,
} from 'lucide-react'
import type { ProductBadgeProps, BadgeVariant } from './types'

// Badge configuration with colors, icons, and default labels
const BADGE_CONFIG: Record<
  BadgeVariant,
  {
    icon: typeof Flame
    label: string
    bgVar?: string
    bg?: string
    textVar?: string
    text?: string
  }
> = {
  bestseller: {
    icon: Flame,
    label: 'Bestseller',
    bgVar: '--amber-light',
    textVar: '--amber',
  },
  nieuw: {
    icon: Sparkles,
    label: 'Nieuw',
    bgVar: '--blue-light',
    textVar: '--blue',
  },
  uitverkocht: {
    icon: Clock,
    label: 'Uitverkocht',
    bgVar: '--coral-light',
    textVar: '--coral',
  },
  staffel: {
    icon: Layers,
    label: 'Staffelkorting',
    bgVar: '--green-light',
    textVar: '--green',
  },
  eco: {
    icon: Leaf,
    label: 'Duurzaam',
    bg: '#E8F5E9',
    text: '#2E7D32',
  },
  aanbieding: {
    icon: Percent,
    label: 'Aanbieding',
    bg: '#FFF0F0',
    textVar: '--coral',
  },
  exclusief: {
    icon: Crown,
    label: 'Exclusief',
    bg: 'linear-gradient(135deg, var(--navy), var(--navy-light))',
    text: 'white',
  },
  b2b: {
    icon: Building2,
    label: 'Alleen B2B',
    bgVar: '--teal-glow',
    textVar: '--teal',
  },
}

export function ProductBadge({
  variant,
  label,
  showIcon,
  size = 'md',
  style = 'pill',
  position = 'top-left',
  onClick,
  animated = false,
  decorative = false,
  className = '',
}: ProductBadgeProps) {
  const config = BADGE_CONFIG[variant]
  const Icon = config.icon

  // Determine if icon should be shown
  const displayIcon = showIcon !== undefined ? showIcon : style === 'pill'

  // Badge label
  const badgeLabel = label || config.label

  // Background color (CSS var or direct value)
  const bgColor = config.bgVar ? `var(${config.bgVar})` : config.bg

  // Text color (CSS var or direct value)
  const textColor = config.textVar ? `var(${config.textVar})` : config.text

  // ARIA attributes
  const ariaLabel = decorative ? undefined : `${badgeLabel} product`
  const ariaHidden = decorative ? true : undefined
  const role = !decorative && style === 'pill' ? 'status' : undefined

  // Class names
  const badgeClasses = [
    style === 'pill' ? 'pbadge' : 'pbadge-positioned',
    `pbadge--${variant}`,
    size !== 'md' ? `pbadge--${size}` : '',
    style === 'positioned' ? `pbadge--${position}` : '',
    animated ? 'pbadge--animated' : '',
    onClick ? 'pbadge--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Render as button if clickable, otherwise span
  const Tag = onClick ? 'button' : 'span'

  return (
    <Tag
      className={badgeClasses}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      type={onClick ? 'button' : undefined}
    >
      {displayIcon && <Icon size={size === 'sm' ? 11 : size === 'lg' ? 15 : 13} aria-hidden="true" />}
      {badgeLabel}

      <style jsx>{`
        /* ═══ BASE PILL BADGE ═══ */
        .pbadge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          background: ${bgColor};
          color: ${textColor};
          border: none;
          font-family: var(--font-primary);
          transition: opacity var(--transition);
        }

        .pbadge :global(svg) {
          flex-shrink: 0;
        }

        /* Size Variants */
        .pbadge--sm {
          padding: 3px 8px;
          font-size: 10px;
        }

        .pbadge--lg {
          padding: 6px 14px;
          font-size: 13px;
        }

        /* Clickable */
        .pbadge--clickable {
          cursor: pointer;
        }

        .pbadge--clickable:hover {
          opacity: 0.8;
        }

        .pbadge--clickable:focus {
          outline: 3px solid var(--teal);
          outline-offset: 2px;
        }

        /* Animated (Pulsing) */
        .pbadge--animated {
          animation: badgePulse 2s infinite;
        }

        @keyframes badgePulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* ═══ POSITIONED BADGE (On Product Image) ═══ */
        .pbadge-positioned {
          position: absolute;
          font-size: 10px;
          font-weight: 700;
          color: white;
          padding: 4px 10px;
          z-index: 2;
          background: ${bgColor};
          color: ${textColor};
          white-space: nowrap;
          font-family: var(--font-primary);
        }

        .pbadge-positioned :global(svg) {
          display: none; /* Icons hidden in positioned badges */
        }

        /* Position Variants */
        .pbadge-positioned.pbadge--top-left {
          top: 8px;
          left: 8px;
          border-radius: 6px;
        }

        .pbadge-positioned.pbadge--top-right {
          top: 0;
          right: 0;
          border-radius: 0 14px 0 10px;
        }

        .pbadge-positioned.pbadge--ribbon {
          top: 12px;
          left: -4px;
          padding: 3px 10px 3px 8px;
          border-radius: 0 4px 4px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Size adjustments for positioned badges */
        .pbadge-positioned.pbadge--sm {
          font-size: 9px;
          padding: 3px 8px;
        }

        .pbadge-positioned.pbadge--lg {
          font-size: 11px;
          padding: 5px 12px;
        }
      `}</style>
    </Tag>
  )
}
