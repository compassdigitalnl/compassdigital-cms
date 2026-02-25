'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { EmailConfirmationBannerProps } from './types'

/**
 * EmailConfirmationBanner Component
 *
 * Info banner confirming that a confirmation email has been (or will be) sent
 * to the customer. Displays at the bottom of order confirmation pages.
 *
 * @example
 * ```tsx
 * <EmailConfirmationBanner
 *   message="Je ontvangt binnen 5 minuten een bevestigingsmail met alle details"
 *   email="john.doe@example.com"
 *   variant="info"
 *   link={{ text: 'Mail niet ontvangen?', href: '/contact' }}
 * />
 * ```
 */
export function EmailConfirmationBanner({
  message,
  email,
  variant = 'info',
  icon,
  showClose = false,
  onClose,
  compact = false,
  link,
  className = '',
}: EmailConfirmationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  // Default icons by variant
  const iconMap = {
    info: Mail,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
  }

  // Get icon component
  const getIcon = () => {
    if (icon) {
      // Convert kebab-case to PascalCase (e.g., "check-circle" → "CheckCircle")
      const pascalCase = icon
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')
      return (LucideIcons as any)[pascalCase] || iconMap[variant]
    }
    return iconMap[variant]
  }

  const IconComponent = getIcon()
  const iconSize = compact ? 16 : 20

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      className={`email-confirmation-banner ${variant} ${compact ? 'compact' : ''} ${className}`}
    >
      <div className="banner-icon" aria-hidden="true">
        <IconComponent size={iconSize} />
      </div>
      <div className="banner-text">
        {typeof message === 'string' ? (
          <span dangerouslySetInnerHTML={{ __html: message }} />
        ) : (
          message
        )}
        {email && !String(message).includes(email) && (
          <>
            {' '}
            op <strong>{email}</strong>
          </>
        )}
        {link && (
          <>
            {' '}
            <a
              href={link.href}
              onClick={(e) => {
                if (link.onClick) {
                  e.preventDefault()
                  link.onClick()
                }
              }}
            >
              {link.text}
            </a>
          </>
        )}
      </div>
      {showClose && (
        <button className="banner-close" onClick={handleClose} aria-label="Sluit melding">
          <X size={16} />
        </button>
      )}

      <style jsx>{`
        /* Container */
        .email-confirmation-banner {
          display: flex;
          align-items: center;
          gap: var(--space-12);
          padding: var(--space-16) var(--space-20);
          border-radius: var(--radius);
          margin-bottom: var(--space-32);
        }

        /* Variant: info (blue - default) */
        .email-confirmation-banner.info {
          background: var(--blue-light);
          border: 1px solid #90caf9;
        }

        .email-confirmation-banner.info .banner-icon {
          color: #1565c0;
        }

        .email-confirmation-banner.info .banner-text {
          color: #0d47a1;
        }

        /* Variant: success (green) */
        .email-confirmation-banner.success {
          background: var(--green-light);
          border: 1px solid #81c784;
        }

        .email-confirmation-banner.success .banner-icon {
          color: #1b5e20;
        }

        .email-confirmation-banner.success .banner-text {
          color: #1b5e20;
        }

        /* Variant: warning (amber) */
        .email-confirmation-banner.warning {
          background: var(--amber-light);
          border: 1px solid #ffb74d;
        }

        .email-confirmation-banner.warning .banner-icon {
          color: #e65100;
        }

        .email-confirmation-banner.warning .banner-text {
          color: #e65100;
        }

        /* Variant: error (coral) */
        .email-confirmation-banner.error {
          background: var(--coral-light);
          border: 1px solid #ef5350;
        }

        .email-confirmation-banner.error .banner-icon {
          color: #c62828;
        }

        .email-confirmation-banner.error .banner-text {
          color: #c62828;
        }

        /* Icon */
        .banner-icon {
          flex-shrink: 0;
        }

        /* Text */
        .banner-text {
          font-size: 14px;
          line-height: 1.6;
          flex: 1;
        }

        .banner-text :global(strong) {
          font-weight: 700;
        }

        .banner-text :global(a) {
          color: inherit;
          text-decoration: underline;
          font-weight: 600;
        }

        .banner-text :global(a:hover) {
          text-decoration: none;
        }

        /* Close button */
        .banner-close {
          flex-shrink: 0;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-4);
          border-radius: var(--radius-sm);
          transition: background var(--transition);
          margin-left: var(--space-8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .banner-close:hover {
          background: rgba(0, 0, 0, 0.08);
        }

        .banner-close :global(svg) {
          opacity: 0.7;
        }

        .banner-close:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
          box-shadow: 0 0 0 4px var(--teal-glow);
        }

        /* Compact variant */
        .email-confirmation-banner.compact {
          padding: var(--space-12) var(--space-16);
          gap: var(--space-8);
        }

        .email-confirmation-banner.compact .banner-text {
          font-size: 13px;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .email-confirmation-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-12);
            padding: var(--space-16);
            position: relative;
          }

          .banner-icon {
            align-self: flex-start;
          }

          .banner-close {
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
