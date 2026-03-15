'use client'

import React from 'react'
import type { AppointmentSidebarProps } from './types'
import { formatInsurance } from '@/branches/zorg/lib/appointmentUtils'

const DEFAULT_TRUST_SIGNALS = [
  'BIG-geregistreerd',
  'Verzekerde zorg',
  'Gratis intake',
]

export const AppointmentSidebar: React.FC<AppointmentSidebarProps> = ({
  selectedTreatment,
  selectedPractitioner,
  selectedDate,
  selectedTime,
  insurance,
  trustSignals = DEFAULT_TRUST_SIGNALS,
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

  const hasInfo = selectedTreatment || selectedDate || selectedTime

  return (
    <div className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] ${className}`}>
      {/* Header */}
      <div
        className="rounded-t-xl p-5"
        style={{ background: 'linear-gradient(135deg, #059669, #0891b2)' }}
      >
        <h3 className="text-lg font-bold text-white">Uw afspraak</h3>
      </div>

      {/* Summary */}
      <div className="space-y-4 p-5">
        {hasInfo ? (
          <>
            {/* Treatment */}
            {selectedTreatment && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-base-700)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span className="font-medium">{selectedTreatment}</span>
              </div>
            )}

            {/* Practitioner */}
            {selectedPractitioner && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-base-700)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>{selectedPractitioner}</span>
              </div>
            )}

            {/* Date + Time */}
            {selectedDate && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-base-700)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>
                  {formatDate(selectedDate)}
                  {selectedTime && <span> om {selectedTime}</span>}
                </span>
              </div>
            )}

            {/* Insurance */}
            {insurance && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-base-700)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className={`font-medium ${
                  insurance === 'covered'
                    ? 'text-green'
                    : insurance === 'partial'
                      ? 'text-amber-600'
                      : 'text-[var(--color-base-500)]'
                }`}>
                  {formatInsurance(insurance)}
                </span>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-[var(--color-base-500)]">Kies een behandeling om te beginnen</p>
        )}
      </div>

      {/* Trust signals */}
      <div className="border-t border-[var(--color-base-200)] p-5">
        <div className="space-y-2">
          {trustSignals.map((signal, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-base-600)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-green">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {signal}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AppointmentSidebar
