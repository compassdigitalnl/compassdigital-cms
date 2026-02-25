'use client'

import React from 'react'
import { OfferteHeroProps } from './types'

export function OfferteHero({
  badge,
  badgeIcon,
  title,
  description,
  responseTime,
  maxWidth = 560,
  ariaLabel,
  className = '',
}: OfferteHeroProps) {
  // Dynamic icon loading (kebab-case → PascalCase)
  const [IconComponent, setIconComponent] = React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    if (badgeIcon) {
      const iconName = badgeIcon
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')

      import('lucide-react')
        .then((mod) => {
          const Icon = (mod as any)[iconName]
          if (Icon) {
            setIconComponent(() => Icon)
          }
        })
        .catch((err) => console.error('Failed to load icon:', err))
    }
  }, [badgeIcon])

  // Combine description with optional response time
  const fullDescription = responseTime
    ? `${description} Verwachte responstijd: ${responseTime}.`
    : description

  return (
    <header className={`offerte-hero ${className}`} aria-label={ariaLabel || 'Offerte aanvragen'}>
      <div className="offerte-hero__content">
        {/* Badge */}
        <div className="offerte-hero__badge">
          {IconComponent && <IconComponent size={14} strokeWidth={2.5} />}
          <span>{badge}</span>
        </div>

        {/* Title */}
        <h1 className="offerte-hero__title">{title}</h1>

        {/* Description */}
        <p className="offerte-hero__description">{fullDescription}</p>
      </div>

      <style jsx>{`
        .offerte-hero {
          position: relative;
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
          padding: 80px 24px;
          overflow: hidden;
        }

        /* Decorative teal glow */
        .offerte-hero::before {
          content: '';
          position: absolute;
          top: -30%;
          right: -15%;
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle,
            rgba(0, 137, 123, 0.15) 0%,
            rgba(0, 137, 123, 0) 70%
          );
          pointer-events: none;
          z-index: 0;
        }

        .offerte-hero__content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        /* Badge */
        .offerte-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: var(--teal-bg);
          border: 1.5px solid var(--teal);
          border-radius: 999px;
          font-family: var(--font-family-body);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 24px;
        }

        .offerte-hero__badge :global(svg) {
          flex-shrink: 0;
        }

        /* Title */
        .offerte-hero__title {
          font-family: var(--font-family-heading);
          font-size: 32px;
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.02em;
          color: var(--white);
          margin: 0 0 16px;
        }

        /* Description */
        .offerte-hero__description {
          font-family: var(--font-family-body);
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          max-width: ${maxWidth}px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Tablet (1024px) */
        @media (max-width: 1024px) {
          .offerte-hero {
            padding: 64px 24px;
          }

          .offerte-hero__title {
            font-size: 28px;
          }
        }

        /* Mobile (768px) */
        @media (max-width: 768px) {
          .offerte-hero {
            padding: 48px 16px;
          }

          .offerte-hero::before {
            width: 300px;
            height: 300px;
            top: -20%;
            right: -20%;
          }

          .offerte-hero__badge {
            font-size: 10px;
            padding: 5px 14px;
            gap: 5px;
            margin-bottom: 20px;
          }

          .offerte-hero__badge :global(svg) {
            width: 12px;
            height: 12px;
          }

          .offerte-hero__title {
            font-size: 24px;
          }

          .offerte-hero__description {
            font-size: 14px;
          }
        }
      `}</style>
    </header>
  )
}
