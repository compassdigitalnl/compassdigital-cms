import React from 'react'
import type { OpeningHoursProps } from './types'

const DEFAULT_HOURS = [
  { day: 'Maandag', open: '09:00', close: '18:00' },
  { day: 'Dinsdag', open: '09:00', close: '18:00' },
  { day: 'Woensdag', open: '09:00', close: '18:00' },
  { day: 'Donderdag', open: '09:00', close: '21:00' },
  { day: 'Vrijdag', open: '09:00', close: '18:00' },
  { day: 'Zaterdag', open: '09:00', close: '17:00' },
  { day: 'Zondag', open: '', close: '', closed: true },
]

export const OpeningHours: React.FC<OpeningHoursProps> = ({
  hours = DEFAULT_HOURS,
  className = '',
}) => {
  const today = new Date().toLocaleDateString('nl-NL', { weekday: 'long' })

  return (
    <div className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 ${className}`}>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--color-base-1000)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Openingstijden
      </h3>
      <div className="space-y-2">
        {hours.map((h) => {
          const isToday = today.toLowerCase() === h.day.toLowerCase()
          return (
            <div
              key={h.day}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                isToday ? 'bg-[var(--color-primary)]/5 font-semibold' : ''
              }`}
            >
              <span className={isToday ? 'text-[var(--color-primary)]' : 'text-[var(--color-base-700)]'}>{h.day}</span>
              <span className={h.closed ? 'text-[var(--color-base-400)]' : 'text-[var(--color-base-1000)]'}>
                {h.closed ? 'Gesloten' : `${h.open} \u2013 ${h.close}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OpeningHours
