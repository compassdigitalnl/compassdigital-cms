import React from 'react'
import type { OpeningHoursProps } from './types'

const DEFAULT_HOURS = [
  { day: 'Maandag', morning: '08:00 \u2013 12:00', afternoon: '13:00 \u2013 17:00' },
  { day: 'Dinsdag', morning: '08:00 \u2013 12:00', afternoon: '13:00 \u2013 17:00' },
  { day: 'Woensdag', morning: '08:00 \u2013 12:00', afternoon: '13:00 \u2013 17:00' },
  { day: 'Donderdag', morning: '08:00 \u2013 12:00', afternoon: '13:00 \u2013 17:00' },
  { day: 'Vrijdag', morning: '08:00 \u2013 12:00', afternoon: '13:00 \u2013 17:00' },
  { day: 'Zaterdag', closed: true },
  { day: 'Zondag', closed: true },
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
      <div className="mb-3 grid grid-cols-[6rem_1fr_1fr] gap-4 text-xs text-[var(--color-base-500)]">
        <span></span>
        <span className="text-center">Ochtend</span>
        <span className="text-center">Middag</span>
      </div>

      <div className="space-y-2">
        {hours.map((h) => {
          const isToday = today.toLowerCase() === h.day.toLowerCase()
          return (
            <div
              key={h.day}
              className={`grid grid-cols-[6rem_1fr_1fr] items-center gap-4 rounded-lg px-3 py-2 text-sm ${
                isToday ? 'bg-[var(--color-primary)]/5 font-semibold' : ''
              }`}
            >
              <span className={`shrink-0 ${isToday ? 'text-[var(--color-primary)]' : 'text-[var(--color-base-700)]'}`}>
                {h.day}
              </span>
              {h.closed ? (
                <span className="col-span-2 text-center text-[var(--color-base-400)]">Gesloten</span>
              ) : (
                <>
                  <span className="text-center text-[var(--color-base-1000)]">{h.morning || '\u2013'}</span>
                  <span className="text-center text-[var(--color-base-1000)]">{h.afternoon || '\u2013'}</span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OpeningHours
