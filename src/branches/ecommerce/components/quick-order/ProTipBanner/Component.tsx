'use client'

import React, { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import type { ProTipBannerProps } from './types'

// Helper: Get Lucide icon by name
function getIcon(iconName: string) {
  const pascalCase = iconName
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  return (LucideIcons as any)[pascalCase] || LucideIcons.Lightbulb
}

/**
 * ProTipBanner Component
 *
 * Light teal informational banner for tips and guidance on Quick Order pages.
 *
 * @example
 * ```tsx
 * <ProTipBanner
 *   tip="Sla je veelgebruikte bestellingen op als bestellijst om ze later met één klik opnieuw te bestellen."
 *   dismissible
 * />
 * ```
 */
export function ProTipBanner({
  tip,
  label = 'Pro tip:',
  icon = 'lightbulb',
  variant = 'default',
  dismissible = false,
  onDismiss,
  className = '',
}: ProTipBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const Icon = getIcon(icon)

  const handleDismiss = () => {
    setIsDismissed(true)
    if (onDismiss) {
      onDismiss()
    }
  }

  if (isDismissed) {
    return null
  }

  return (
    <aside className={`ptb ${variant} ${className}`} role="note">
      <Icon className="ptb-icon" aria-hidden="true" />
      <div
        className="ptb-content"
        dangerouslySetInnerHTML={{
          __html: `<strong class="ptb-label">${label}</strong> ${tip}`,
        }}
      />
      {dismissible && (
        <button
          className="ptb-close"
          onClick={handleDismiss}
          type="button"
          aria-label="Sluiten"
        >
          <LucideIcons.X size={16} aria-hidden="true" />
        </button>
      )}

      <style jsx>{`
        .ptb {
          background: var(--color-primary-glow);
          border: 1px solid var(--color-primary-glow);
          border-radius: var(--radius-lg);
          padding: var(--space-16) var(--space-20);
          display: flex;
          align-items: flex-start;
          gap: var(--space-12);
        }

        .ptb.compact {
          padding: var(--space-12) var(--space-16);
        }

        .ptb-icon {
          color: var(--teal);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .ptb.compact :global(.ptb-icon) {
          width: 18px;
          height: 18px;
        }

        .ptb-content {
          font-size: 14px;
          color: var(--navy);
          line-height: 1.6;
          flex: 1;
        }

        .ptb.compact .ptb-content {
          font-size: 13px;
        }

        .ptb-content :global(.ptb-label) {
          font-weight: 700;
          color: var(--teal);
        }

        .ptb-content :global(strong) {
          font-weight: 700;
          color: var(--navy);
        }

        .ptb-content :global(a) {
          color: var(--teal);
          text-decoration: none;
          font-weight: 600;
          transition: opacity var(--transition);
        }

        .ptb-content :global(a:hover) {
          text-decoration: underline;
          opacity: 0.8;
        }

        .ptb-close {
          width: 24px;
          height: 24px;
          border: none;
          background: none;
          color: var(--grey-dark);
          cursor: pointer;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all var(--transition);
          margin-left: auto;
        }

        .ptb-close:hover {
          background: rgba(0, 0, 0, 0.05);
          color: var(--navy);
        }

        /* Mobile */
        @media (max-width: 640px) {
          .ptb {
            position: relative;
            padding-right: 40px;
          }

          .ptb-icon {
            margin-top: 0;
          }

          .ptb-close {
            position: absolute;
            top: var(--space-12);
            right: var(--space-12);
            margin-left: 0;
          }
        }
      `}</style>
    </aside>
  )
}
