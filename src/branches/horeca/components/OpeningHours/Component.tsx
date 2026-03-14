import React from 'react'
import type { OpeningHoursProps } from './types'

const DEFAULT_HOURS = [
  { day: 'Maandag', closed: true },
  { day: 'Dinsdag', lunch: '11:30 \u2013 14:00', dinner: '17:00 \u2013 22:00' },
  { day: 'Woensdag', lunch: '11:30 \u2013 14:00', dinner: '17:00 \u2013 22:00' },
  { day: 'Donderdag', lunch: '11:30 \u2013 14:00', dinner: '17:00 \u2013 22:00' },
  { day: 'Vrijdag', lunch: '11:30 \u2013 14:00', dinner: '17:00 \u2013 23:00' },
  { day: 'Zaterdag', lunch: '11:30 \u2013 14:00', dinner: '17:00 \u2013 23:00' },
  { day: 'Zondag', lunch: '12:00 \u2013 15:00', dinner: '17:00 \u2013 21:00' },
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

      {/* Legend */}
      <div className="mb-3 flex gap-4 text-xs text-[var(--color-base-500)]">
        <span>Lunch</span>
        <span>Diner</span>
      </div>

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
              <span className={`w-24 shrink-0 ${isToday ? 'text-[var(--color-primary)]' : 'text-[var(--color-base-700)]'}`}>
                {h.day}
              </span>
              {h.closed ? (
                <span className="text-[var(--color-base-400)]">Gesloten</span>
              ) : (
                <div className="flex gap-4 text-[var(--color-base-1000)]">
                  <span className="w-28 text-center">{h.lunch || '\u2013'}</span>
                  <span className="w-28 text-center">{h.dinner || '\u2013'}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OpeningHours
