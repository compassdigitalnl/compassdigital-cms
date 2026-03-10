'use client'

import React from 'react'
import { Zap } from 'lucide-react'
import { getIcon } from '@/utilities/getIcon'
import type { QuickOrderHeaderProps } from './types'

/**
 * QuickOrderHeader Component
 *
 * B2B Quick Order page header with title, description, and action buttons
 * (CSV upload, bestellijst access, export, etc.)
 *
 * @example
 * ```tsx
 * <QuickOrderHeader
 *   title="Snelbestellen"
 *   description="Voer meerdere artikelen tegelijk in voor een snelle bestelling"
 *   actions={[
 *     { id: '1', label: 'CSV uploaden', icon: 'upload', variant: 'secondary', onClick: handleUpload },
 *     { id: '2', label: 'Gebruik bestellijst', icon: 'list', variant: 'teal', onClick: handleList },
 *   ]}
 * />
 * ```
 */
// Convert kebab-case icon name to PascalCase and resolve
function resolveIcon(iconName: string, fallback: typeof Zap) {
  const pascalCase = iconName
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  return getIcon(pascalCase, fallback)!
}

export function QuickOrderHeader({
  title = 'Snelbestellen',
  description = 'Voer meerdere artikelen tegelijk in voor een snelle bestelling',
  icon = 'zap',
  actions,
  className = '',
}: QuickOrderHeaderProps) {
  const HeaderIcon = resolveIcon(icon, Zap)

  return (
    <header className={`qoh ${className}`} role="banner">
      <div className="qoh-content">
        <h1 className="qoh-title">
          <HeaderIcon className="qoh-icon" size={28} aria-hidden="true" />
          {title}
        </h1>
        <p className="qoh-description">{description}</p>
      </div>
      <div className="qoh-actions">
        {actions.map((action) => {
          const Icon = resolveIcon(action.icon, Zap)
          return (
            <button
              key={action.id}
              type="button"
              className={`qoh-btn ${action.variant}`}
              onClick={action.onClick}
              aria-label={action.label}
            >
              <Icon size={18} aria-hidden="true" />
              {action.label}
            </button>
          )
        })}
      </div>

      <style jsx>{`
        .qoh {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-32) var(--space-40);
          background: white;
          border: 1px solid var(--grey);
          border-radius: var(--radius-xl);
        }

        .qoh-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        .qoh-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 800;
          color: var(--navy);
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--space-12);
        }

        .qoh-title :global(svg) {
          color: var(--teal);
          flex-shrink: 0;
        }

        .qoh-description {
          font-size: 14px;
          color: var(--grey-dark);
          margin: 0;
        }

        .qoh-actions {
          display: flex;
          gap: var(--space-12);
        }

        .qoh-btn {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          padding: var(--space-12) var(--space-20);
          border-radius: var(--radius-md);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          white-space: nowrap;
          outline: none;
        }

        .qoh-btn :global(svg) {
          flex-shrink: 0;
        }

        /* Secondary variant (outline) */
        .qoh-btn.secondary {
          background: white;
          border: 1.5px solid var(--grey);
          color: var(--navy);
        }

        .qoh-btn.secondary:hover {
          border-color: var(--teal);
          background: var(--color-primary-glow);
          transform: translateY(-1px);
          box-shadow: 0 1px 3px rgba(10, 22, 40, 0.06);
        }

        .qoh-btn.secondary:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        .qoh-btn.secondary:active {
          transform: translateY(0);
        }

        /* Teal variant */
        .qoh-btn.teal {
          background: var(--teal-glow);
          border: 1.5px solid transparent;
          color: var(--teal);
        }

        .qoh-btn.teal:hover {
          background: var(--color-primary-glow);
          transform: translateY(-1px);
          box-shadow: 0 1px 3px rgba(10, 22, 40, 0.06);
        }

        .qoh-btn.teal:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        .qoh-btn.teal:active {
          transform: translateY(0);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .qoh {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-24);
            padding: var(--space-24);
          }

          .qoh-title {
            font-size: 24px;
          }

          .qoh-actions {
            flex-direction: column;
            gap: var(--space-12);
          }

          .qoh-btn {
            justify-content: center;
          }
        }
      `}</style>
    </header>
  )
}
