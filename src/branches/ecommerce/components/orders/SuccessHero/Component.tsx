'use client'

import React from 'react'
import { Check } from 'lucide-react'
import type { SuccessHeroProps } from './types'

/**
 * SuccessHero Component
 *
 * Order confirmation success message with gradient background, checkmark animation,
 * and prominent order number display. Provides immediate positive feedback to customers.
 *
 * @example
 * ```tsx
 * <SuccessHero orderNumber="PL-2024-00142" />
 * ```
 */
export function SuccessHero({
  orderNumber,
  title = 'Bedankt voor je bestelling!',
  description = 'Je bestelling is succesvol geplaatst en wordt zo snel mogelijk verwerkt.',
  orderNumberLabel = 'Ordernummer:',
  enableAnimation = true,
  variant = 'default',
  className = '',
}: SuccessHeroProps) {
  return (
    <section
      className={`success-hero ${variant} ${enableAnimation ? 'animated' : ''} ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Decorative glow (top-right) */}
      <div className="decorative-glow" aria-hidden="true" />

      {/* Content wrapper */}
      <div className="success-content">
        {/* Checkmark icon circle */}
        <div className="success-icon" aria-hidden="true">
          <Check size={48} strokeWidth={3} />
        </div>

        {/* Title */}
        <h1 className="success-title">{title}</h1>

        {/* Description */}
        <p className="success-description">{description}</p>

        {/* Order number badge */}
        <div className="order-number-badge">
          <span className="order-number-label">{orderNumberLabel}</span>
          <span className="order-number" aria-label={`Order nummer ${orderNumber.replace(/-/g, ' ')}`}>
            #{orderNumber}
          </span>
        </div>
      </div>

      <style jsx>{`
        /* Success hero container */
        .success-hero {
          background: linear-gradient(135deg, var(--green) 0%, var(--teal) 100%);
          border-radius: var(--radius-lg);
          padding: var(--space-48);
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0, 137, 123, 0.2);
        }

        /* Decorative glow (top-right) */
        .decorative-glow {
          position: absolute;
          top: -30%;
          right: -15%;
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
          );
          border-radius: 50%;
          pointer-events: none;
        }

        /* Content wrapper */
        .success-content {
          position: relative;
          z-index: 1;
        }

        /* Checkmark icon circle */
        .success-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-20);
          backdrop-filter: blur(10px);
        }

        .success-icon :global(svg) {
          color: white;
        }

        /* Scale-in animation for icon */
        .success-hero.animated .success-icon {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Success title */
        .success-title {
          font-size: 32px;
          font-weight: 800;
          color: white;
          margin-bottom: var(--space-12);
        }

        .success-hero.animated .success-title {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        /* Success description */
        .success-description {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: var(--space-24);
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .success-hero.animated .success-description {
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        /* Order number badge */
        .order-number-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.15);
          padding: var(--space-12) var(--space-24);
          border-radius: var(--radius);
          backdrop-filter: blur(10px);
        }

        .success-hero.animated .order-number-badge {
          animation: fadeInUp 0.6s ease-out 0.4s both;
        }

        .order-number-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        .order-number {
          font-family: var(--font-mono);
          font-size: 18px;
          font-weight: 800;
          color: white;
          letter-spacing: 0.02em;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Compact variant */
        .success-hero.compact {
          padding: var(--space-32);
        }

        .success-hero.compact .success-title {
          font-size: 24px;
        }

        .success-hero.compact .success-icon {
          width: 64px;
          height: 64px;
        }

        .success-hero.compact .success-icon :global(svg) {
          width: 36px;
          height: 36px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .success-hero {
            padding: var(--space-32);
          }

          .success-title {
            font-size: 24px;
          }

          .success-description {
            font-size: 14px;
          }

          .order-number-badge {
            flex-direction: column;
            gap: 4px;
            padding: var(--space-12) var(--space-16);
          }

          .order-number {
            font-size: 16px;
          }

          .success-icon {
            width: 64px;
            height: 64px;
          }

          .success-icon :global(svg) {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </section>
  )
}
