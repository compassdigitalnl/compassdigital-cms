'use client'

import React from 'react'
import type { BookingSidebarProps } from './types'

const DEFAULT_GUARANTEES = [
  'Gratis annuleren tot 24u',
  'Bevestiging per e-mail',
  'Geen vooruitbetaling nodig',
]

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  selectedService,
  selectedStylist,
  selectedDate,
  selectedTime,
  guarantees = DEFAULT_GUARANTEES,
  className = '',
}) => {
  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const formatDuration = (min: number) => {
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60)
    const m = min % 60
    return m > 0 ? `${h}u ${m}min` : `${h} uur`
  }

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
        style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
      >
        <h3 className="text-lg font-bold text-white">Jouw afspraak</h3>
      </div>

      {/* Summary */}
      <div className="space-y-4 p-5">
        {selectedService ? (
          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-[var(--color-base-1000)]">{selectedService.title}</div>
                {selectedService.duration && (
                  <div className="mt-0.5 text-sm text-[var(--color-base-600)]">{formatDuration(selectedService.duration)}</div>
                )}
              </div>
              {selectedService.price && (
                <div className="font-bold text-[var(--color-primary)]">{formatPrice(selectedService.price)}</div>
              )}
            </div>

            {selectedStylist && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-base-700)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {selectedStylist.name}
              </div>
            )}

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
          </>
        ) : (
          <p className="text-sm text-[var(--color-base-500)]">Selecteer een behandeling om te beginnen</p>
        )}
      </div>

      {/* Guarantees */}
      <div className="border-t border-[var(--color-base-200)] p-5">
        <div className="space-y-2">
          {guarantees.map((g, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-base-600)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-green-500">
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

export default BookingSidebar
