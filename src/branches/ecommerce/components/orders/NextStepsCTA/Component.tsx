'use client'

import React from 'react'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import type { NextStepsCTAProps } from './types'

/**
 * NextStepsCTA Component
 *
 * Action buttons for next steps after order confirmation. Displays a grid of
 * actionable buttons (track, download, shop) with primary/secondary variants.
 *
 * @example
 * ```tsx
 * <NextStepsCTA
 *   actions={[
 *     { id: 'track', label: 'Track bestelling', icon: 'map-pin', variant: 'primary', href: '/track' },
 *     { id: 'invoice', label: 'Download factuur', icon: 'download', variant: 'secondary', href: '/invoice.pdf', download: true },
 *     { id: 'shop', label: 'Verder winkelen', icon: 'shopping-bag', variant: 'secondary', href: '/shop' },
 *   ]}
 * />
 * ```
 */
export function NextStepsCTA({
  actions,
  variant = 'default',
  columns,
  className = '',
}: NextStepsCTAProps) {
  // Auto-calculate grid columns based on actions length if not specified
  const gridColumns = columns || actions.length

  // Get Lucide icon component by name
  const getIcon = (iconName: string) => {
    const IconComponent =
      (LucideIcons as any)[
        iconName
          .split('-')
          .map((word: string, i: number) =>
            i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
          )
          .join('')
      ] || LucideIcons.Package
    return IconComponent
  }

  return (
    <section
      aria-label="Next steps"
      className={`next-steps-cta ${variant} ${className}`}
      style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
    >
      {actions.map((action) => {
        const IconComponent = getIcon(action.icon)
        const isExternal = action.external || action.href?.startsWith('http')
        const isDownload = action.download || action.href?.endsWith('.pdf')

        // Use Link for internal links, <a> for external/download
        const Component = action.href && !isExternal && !isDownload ? Link : 'a'

        const buttonProps: any = {
          key: action.id,
          className: `next-step-button ${action.variant} ${variant === 'icon-only' ? 'icon-only' : ''}`,
          'aria-label': action.label,
        }

        if (action.href) {
          buttonProps.href = action.href
        }

        if (action.onClick) {
          buttonProps.onClick = action.onClick
        }

        if (isExternal) {
          buttonProps.target = '_blank'
          buttonProps.rel = 'noopener noreferrer'
        }

        if (isDownload) {
          buttonProps.download = true
        }

        return (
          <Component {...buttonProps}>
            {action.badge && (
              <span
                className="next-step-button-badge"
                style={action.badge.color ? { background: action.badge.color } : {}}
              >
                {action.badge.text}
              </span>
            )}
            <IconComponent size={variant === 'icon-only' ? 20 : 28} aria-hidden="true" />
            <span className="next-step-button-text">{action.label}</span>
          </Component>
        )
      })}

      <style jsx>{`
        /* Container */
        .next-steps-cta {
          display: grid;
          gap: var(--space-16);
          margin-bottom: var(--space-32);
        }

        /* Button base styles */
        .next-step-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-12);
          padding: var(--space-24);
          border-radius: var(--radius-lg);
          cursor: pointer;
          border: none;
          font-family: var(--font-body);
          transition: all var(--transition);
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .next-step-button:hover {
          transform: translateY(-2px);
        }

        .next-step-button:active {
          transform: translateY(0);
        }

        .next-step-button:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
          box-shadow: 0 0 0 4px var(--teal-glow);
        }

        /* Button text */
        .next-step-button-text {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.3;
          text-align: center;
        }

        /* Primary variant (Track order) */
        .next-step-button.primary {
          background: linear-gradient(135deg, var(--teal), var(--teal-light));
          color: white;
          box-shadow: 0 4px 16px var(--color-primary-glow);
        }

        .next-step-button.primary:hover {
          box-shadow: 0 8px 24px var(--color-primary-glow);
        }

        .next-step-button.primary :global(svg) {
          color: white;
        }

        /* Secondary variant (Download invoice, Continue shopping) */
        .next-step-button.secondary {
          background: var(--white);
          color: var(--navy);
          border: 1.5px solid var(--grey);
        }

        .next-step-button.secondary:hover {
          border-color: var(--teal);
          box-shadow: var(--shadow-md);
        }

        .next-step-button.secondary :global(svg) {
          color: var(--teal);
        }

        /* Navy variant */
        .next-step-button.navy {
          background: linear-gradient(135deg, var(--navy), var(--navy-light));
          color: white;
          box-shadow: 0 4px 16px rgba(10, 22, 40, 0.3);
        }

        .next-step-button.navy:hover {
          box-shadow: 0 8px 24px rgba(10, 22, 40, 0.4);
        }

        .next-step-button.navy :global(svg) {
          color: white;
        }

        /* Coral variant (Destructive) */
        .next-step-button.coral {
          background: linear-gradient(135deg, var(--coral), #ff8787);
          color: white;
          box-shadow: 0 4px 16px rgba(255, 107, 107, 0.3);
        }

        .next-step-button.coral:hover {
          box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4);
        }

        .next-step-button.coral :global(svg) {
          color: white;
        }

        /* Badge */
        .next-step-button-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--coral);
          color: white;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 2px 8px;
          border-radius: 12px;
          line-height: 1.4;
          z-index: 1;
        }

        /* Icon-only variant */
        .next-step-button.icon-only {
          flex-direction: row;
          gap: var(--space-8);
          padding: var(--space-16) var(--space-20);
        }

        .next-step-button.icon-only .next-step-button-text {
          font-size: 13px;
        }

        /* Compact variant */
        .next-steps-cta.compact .next-step-button {
          padding: var(--space-20);
          gap: var(--space-8);
        }

        .next-steps-cta.compact .next-step-button :global(svg) {
          width: 24px;
          height: 24px;
        }

        .next-steps-cta.compact .next-step-button-text {
          font-size: 13px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .next-steps-cta {
            grid-template-columns: 1fr !important;
            gap: var(--space-12);
          }

          .next-step-button {
            padding: var(--space-20);
          }

          .next-step-button :global(svg) {
            width: 24px;
            height: 24px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .next-step-button {
            transition: none;
          }

          .next-step-button:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
