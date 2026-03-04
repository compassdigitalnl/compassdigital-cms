'use client'

import React from 'react'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import type { AccountCreationCTAProps } from './types'

/**
 * AccountCreationCTA Component
 *
 * Navy gradient card encouraging guest users to create an account
 * after completing an order. Includes decorative teal glow.
 *
 * @example
 * ```tsx
 * <AccountCreationCTA
 *   title="Account aanmaken?"
 *   description="Volg uw bestelling en bestel sneller opnieuw."
 *   buttonText="Account aanmaken"
 *   buttonHref="/auth/register/"
 * />
 * ```
 */
export function AccountCreationCTA({
  title = 'Account aanmaken?',
  description = 'Volg uw bestelling, bestel sneller opnieuw en beheer uw bestellijsten vanuit uw eigen dashboard.',
  buttonText = 'Account aanmaken',
  buttonHref = '/auth/register/',
  className = '',
}: AccountCreationCTAProps) {
  return (
    <div className={`account-cta ${className}`}>
      <div className="cta-glow" aria-hidden="true" />
      <h3 className="cta-title">{title}</h3>
      <p className="cta-description">{description}</p>
      <Link href={buttonHref} className="cta-button">
        <UserPlus size={16} aria-hidden="true" />
        {buttonText}
      </Link>

      <style jsx>{`
        .account-cta {
          background: linear-gradient(135deg, var(--navy), var(--navy-light));
          border-radius: 16px;
          padding: 28px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-glow {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(0, 137, 123, 0.1), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .cta-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          color: white;
          margin-bottom: 6px;
          position: relative;
        }

        .cta-description {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.5;
          margin-bottom: 18px;
          position: relative;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 12px 24px;
          background: var(--teal);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition);
          text-decoration: none;
          position: relative;
        }

        .cta-button:hover {
          background: var(--teal-light);
          transform: translateY(-1px);
        }

        .cta-button:focus-visible {
          outline: 2px solid white;
          outline-offset: 2px;
        }

        /* Print: hide entire card */
        @media print {
          .account-cta {
            display: none !important;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .cta-button:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}
