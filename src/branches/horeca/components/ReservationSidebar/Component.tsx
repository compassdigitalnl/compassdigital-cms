'use client'

import React from 'react'
import type { ReservationSidebarProps } from './types'
import { formatGuests, formatOccasion } from '@/branches/horeca/lib/reservationUtils'

const DEFAULT_GUARANTEES = [
  'Gratis annuleren tot 24u',
  'Bevestiging per e-mail',
  'Geen vooruitbetaling nodig',
  'Flexibel omboeken',
]

export const ReservationSidebar: React.FC<ReservationSidebarProps> = ({
  selectedDate,
  selectedTime,
  guests,
  occasion,
  guarantees = DEFAULT_GUARANTEES,
  className = '',
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('nl-NL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] ${className}`}>
      {/* Header */}
      <div
        className="rounded-t-xl p-5"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-base-800))' }}
      >
        <h3 className="text-lg font-bold text-white">Uw reservering</h3>
      </div>

      {/* Summary */}
      <div className="space-y-4 p-5">
        {selectedDate || selectedTime || guests ? (
          <>
            {selectedDate && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-base-700)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDate(selectedDate)}
                {selectedTime && <span>om {selectedTime}</span>}
              </div>
            )}

            {guests && guests > 0 && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-base-700)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                {formatGuests(guests)}
              </div>
            )}

            {occasion && occasion !== 'regular' && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-base-700)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {formatOccasion(occasion)}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-[var(--color-base-500)]">Kies een datum en tijd om te beginnen</p>
        )}
      </div>

      {/* Guarantees */}
      <div className="border-t border-[var(--color-base-200)] p-5">
        <div className="space-y-2">
          {guarantees.map((g, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-base-600)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-green">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {g}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReservationSidebar
