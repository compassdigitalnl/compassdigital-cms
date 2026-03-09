'use client'

import React from 'react'
import { Headphones, Phone, Mail } from 'lucide-react'
import type { SupportCardProps } from './types'

/**
 * SupportCard Component
 *
 * Centered help/support card with phone and email contact links.
 * Used on order confirmation pages to provide easy access to support.
 *
 * @example
 * ```tsx
 * <SupportCard
 *   phone="0251-247233"
 *   email="info@plastimed.nl"
 * />
 * ```
 */
export function SupportCard({
  title = 'Hulp nodig?',
  description = 'Heeft u vragen over uw bestelling? Wij helpen u graag.',
  phone,
  email,
  className = '',
}: SupportCardProps) {
  // Format phone number for tel: link (remove spaces, dashes)
  const phoneHref = phone ? `tel:${phone.replace(/[\s\-]/g, '')}` : undefined

  return (
    <div className={`support-card ${className}`}>
      <div className="support-header">
        <Headphones size={18} aria-hidden="true" />
        {title}
      </div>

      <p className="support-description">{description}</p>

      <div className="support-links">
        {phone && (
          <a href={phoneHref} className="support-link support-link--phone">
            <Phone size={15} aria-hidden="true" />
            {phone}
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} className="support-link support-link--email">
            <Mail size={15} aria-hidden="true" />
            {email}
          </a>
        )}
      </div>

      <style jsx>{`
        .support-card {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        }

        .support-header {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .support-header :global(svg) {
          color: var(--teal);
        }

        .support-description {
          font-size: 14px;
          color: var(--grey-dark);
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .support-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .support-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 14px;
          text-decoration: none;
          transition: color var(--transition);
        }

        .support-link--phone {
          font-weight: 700;
          color: var(--teal);
        }

        .support-link--phone:hover {
          color: var(--teal-light);
        }

        .support-link--email {
          color: var(--grey-dark);
        }

        .support-link--email:hover {
          color: var(--navy);
        }

        /* Print: hide entire card */
        @media print {
          .support-card {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
