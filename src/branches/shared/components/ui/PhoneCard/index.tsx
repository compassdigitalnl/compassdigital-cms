import React from 'react'
import type { PhoneCardProps } from './types'

/**
 * PhoneCard - Call-us sidebar card
 *
 * Compact card with phone number, availability info and call CTA.
 * Used by: construction (sidebar), hospitality, beauty, professional services.
 */
export const PhoneCard: React.FC<PhoneCardProps> = ({
  phone,
  title = 'Liever bellen?',
  subtitle = 'Wij staan voor u klaar',
  availability = 'Ma-Vr: 08:00 - 17:30',
  className = '',
}) => {
  const phoneHref = `tel:${phone.replace(/[\s\-()]/g, '')}`

  return (
    <div className={`rounded-xl border border-grey bg-white p-5 ${className}`}>
      {/* Icon */}
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-primary">
          <path
            d="M17.5 14.1v2.4a1.6 1.6 0 01-1.7 1.6A15.8 15.8 0 012 4.2a1.6 1.6 0 011.6-1.7h2.4a1.6 1.6 0 011.6 1.4c.1.8.3 1.6.6 2.4a1.6 1.6 0 01-.4 1.7L6.5 9.3A12.8 12.8 0 0010.7 13.5l1.3-1.3a1.6 1.6 0 011.7-.4c.8.3 1.6.5 2.4.6a1.6 1.6 0 011.4 1.6z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h3 className="text-base font-bold text-navy">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-grey-dark">{subtitle}</p>}

      {/* Phone number */}
      <a
        href={phoneHref}
        className="mt-3 block text-lg font-bold text-primary transition-colors hover:text-primary/80"
      >
        {phone}
      </a>

      {/* Availability */}
      {availability && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-grey-mid">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {availability}
        </div>
      )}
    </div>
  )
}

export default PhoneCard
