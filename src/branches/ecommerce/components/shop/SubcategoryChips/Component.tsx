'use client'

import React from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

export interface SubcategoryChip {
  /** Chip label */
  label: string
  /** Link href */
  href: string
  /** Optional Lucide icon */
  icon?: LucideIcon
  /** Optional product count displayed in grey */
  count?: number
  /** Whether this chip is active (current subcategory) */
  active?: boolean
}

export interface SubcategoryChipsProps {
  /** Array of subcategory chips */
  chips: SubcategoryChip[]
  /** Additional className for container */
  className?: string
}

/**
 * EC03-SubcategoryChips - Horizontal scrollable subcategory navigation
 *
 * Features:
 * - Horizontal scroll with overflow-x auto
 * - Pill-shaped chips (100px border-radius)
 * - Active state: teal background + border
 * - Inactive state: grey background + border, hover effect
 * - Optional Lucide icons (14px)
 * - Optional product counts in grey text
 * - Keyboard navigation with visible focus ring
 * - Theme variable compliant (no hardcoded colors)
 *
 * Design Tokens:
 * - Chip padding: 8px 16px
 * - Font size: 13px (label), 11px (count)
 * - Icon size: 14px
 * - Border: 1.5px solid
 * - Border radius: 100px (pill shape)
 * - Gap: 10px between chips
 * - Active: teal (#00897B) text, teal-glow background, teal 20% border
 * - Inactive: navy text, bg (#F5F7FA) background, grey border
 *
 * @example
 * ```tsx
 * <SubcategoryChips
 *   chips={[
 *     { label: 'Alle handschoenen', href: '/shop/gloves', icon: Hand, active: true },
 *     { label: 'Nitril', href: '/shop/gloves/nitrile', count: 87 },
 *     { label: 'Latex', href: '/shop/gloves/latex', count: 34 },
 *     { label: 'Steriel', href: '/shop/gloves/sterile', count: 21 },
 *   ]}
 * />
 * ```
 */
export function SubcategoryChips({ chips, className = '' }: SubcategoryChipsProps) {
  return (
    <div
      className={`subcategory-chips ${className}`}
      style={{
        background: 'var(--color-white, #FAFBFC)',
        border: '1px solid var(--color-grey, #E8ECF1)',
        borderRadius: 'var(--radius, 12px)',
        padding: '14px 20px',
      }}
    >
      <div
        className="subcategory-chips__list"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-grey, #E8ECF1) transparent',
        }}
      >
        {chips.map((chip, index) => {
          const Icon = chip.icon
          const isActive = chip.active

          // Base styles
          const baseStyles: React.CSSProperties = {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1.5px solid',
          }

          // Active state
          if (isActive) {
            baseStyles.color = 'var(--color-teal, #00897B)'
            baseStyles.background = 'var(--color-teal-glow, rgba(0, 137, 123, 0.12))'
            baseStyles.borderColor = 'rgba(0, 137, 123, 0.2)'
          } else {
            // Inactive state
            baseStyles.color = 'var(--color-navy, #0A1628)'
            baseStyles.background = 'var(--color-bg, #F5F7FA)'
            baseStyles.borderColor = 'var(--color-grey, #E8ECF1)'
          }

          return (
            <Link
              key={`${chip.href}-${index}`}
              href={chip.href}
              className={`subcategory-chip ${isActive ? 'subcategory-chip--active' : 'subcategory-chip--inactive'}`}
              style={baseStyles}
              onMouseEnter={(e) => {
                if (isActive) {
                  e.currentTarget.style.background = 'rgba(0, 137, 123, 0.18)'
                  e.currentTarget.style.borderColor = 'rgba(0, 137, 123, 0.3)'
                } else {
                  e.currentTarget.style.background = 'var(--color-grey-light, #F1F4F8)'
                  e.currentTarget.style.borderColor = 'var(--color-grey-mid, #94A3B8)'
                }
              }}
              onMouseLeave={(e) => {
                if (isActive) {
                  e.currentTarget.style.background = 'var(--color-teal-glow, rgba(0, 137, 123, 0.12))'
                  e.currentTarget.style.borderColor = 'rgba(0, 137, 123, 0.2)'
                } else {
                  e.currentTarget.style.background = 'var(--color-bg, #F5F7FA)'
                  e.currentTarget.style.borderColor = 'var(--color-grey, #E8ECF1)'
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = 'none'
                e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-teal-glow, rgba(0, 137, 123, 0.12))'
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {Icon && (
                <Icon
                  style={{
                    width: '14px',
                    height: '14px',
                  }}
                />
              )}
              {chip.label}
              {chip.count !== undefined && chip.count > 0 && (
                <span
                  className="subcategory-chip__count"
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-grey-mid, #94A3B8)',
                    fontWeight: 400,
                  }}
                >
                  ({chip.count})
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <style jsx>{`
        .subcategory-chips__list::-webkit-scrollbar {
          height: 6px;
        }

        .subcategory-chips__list::-webkit-scrollbar-track {
          background: transparent;
        }

        .subcategory-chips__list::-webkit-scrollbar-thumb {
          background: var(--color-grey, #E8ECF1);
          border-radius: 3px;
        }

        .subcategory-chips__list::-webkit-scrollbar-thumb:hover {
          background: var(--color-grey-mid, #94A3B8);
        }
      `}</style>
    </div>
  )
}
