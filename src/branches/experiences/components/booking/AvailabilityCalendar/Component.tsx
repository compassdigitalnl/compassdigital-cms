'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AvailabilityCalendarProps, CalendarDay, DayStatus } from './types'

const DAY_NAMES = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

function getDayClasses(day: CalendarDay, isSelected: boolean): string {
  const base =
    'flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-all duration-150'

  if (isSelected) {
    return `${base} font-bold text-white cursor-pointer`
  }

  switch (day.status) {
    case 'available':
    case 'limited':
      return `${base} cursor-pointer hover:font-semibold`
    case 'full':
    case 'unavailable':
      return `${base} line-through cursor-not-allowed opacity-60`
    default:
      return base
  }
}

function getDayStyle(
  day: CalendarDay,
  isSelected: boolean,
): React.CSSProperties {
  if (isSelected) {
    return { backgroundColor: 'var(--color-teal, #00a39b)' }
  }

  switch (day.status) {
    case 'full':
    case 'unavailable':
      return { backgroundColor: 'var(--color-coral-light, #ffe0e0)' }
    default:
      return {}
  }
}

function getDayHoverStyle(status: DayStatus): React.CSSProperties {
  if (status === 'available' || status === 'limited') {
    return { backgroundColor: 'var(--color-teal-light, #e6f7f6)' }
  }
  return {}
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  month,
  year,
  days,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  timeSlots,
  selectedTime,
  onSelectTime,
  personOptions,
  selectedPersons,
  onSelectPersons,
  className = '',
}) => {
  const [hoveredDate, setHoveredDate] = React.useState<number | null>(null)

  // Calculate empty cells before the first day
  const firstDayObj = days.find((d) => d.date === 1)
  const firstDayIndex = firstDayObj
    ? new Date(year, getMonthIndex(month), 1).getDay()
    : 0
  // Convert Sunday=0 to Monday-based (Mo=0, Su=6)
  const emptySlots = firstDayIndex === 0 ? 6 : firstDayIndex - 1

  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
      style={{
        borderColor: 'var(--color-border, #e5e7eb)',
        backgroundColor: 'var(--color-white, #ffffff)',
      }}
    >
      {/* Month header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-grey-light"
          style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
          aria-label="Vorige maand"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3
          className="text-base font-bold"
          style={{ color: 'var(--color-navy, #1a2b4a)' }}
        >
          {month} {year}
        </h3>
        <button
          type="button"
          onClick={onNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-grey-light"
          style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
          aria-label="Volgende maand"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day name headers */}
      <div className="mb-1 grid grid-cols-7 gap-1">
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="flex h-8 items-center justify-center text-[10px] font-bold uppercase tracking-wider text-grey-mid"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Day cells grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before month start */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className="h-9 w-9" />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const isSelected = selectedDate === day.date
          const isHovered = hoveredDate === day.date
          const isClickable =
            day.status === 'available' || day.status === 'limited'

          return (
            <button
              key={day.date}
              type="button"
              className={getDayClasses(day, isSelected)}
              style={{
                ...getDayStyle(day, isSelected),
                ...(isHovered && !isSelected
                  ? getDayHoverStyle(day.status)
                  : {}),
                color: isSelected
                  ? '#ffffff'
                  : 'var(--color-navy, #1a2b4a)',
              }}
              onClick={() => isClickable && onSelectDate(day.date)}
              onMouseEnter={() => isClickable && setHoveredDate(day.date)}
              onMouseLeave={() => setHoveredDate(null)}
              disabled={!isClickable}
              aria-label={`${day.date} ${month} - ${day.status}`}
            >
              {day.date}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-[11px] text-grey-mid">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
          />
          Beschikbaar
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: 'var(--color-amber, #f59e0b)' }}
          />
          Beperkt
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: 'var(--color-coral, #ff6b6b)' }}
          />
          Vol
        </span>
      </div>

      {/* Time slot + person count selects */}
      {(timeSlots || personOptions) && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {timeSlots && timeSlots.length > 0 && (
            <div>
              <label
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-navy, #1a2b4a)' }}
              >
                Tijdstip
              </label>
              <select
                value={selectedTime || ''}
                onChange={(e) => onSelectTime?.(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--color-border, #e5e7eb)',
                  '--tw-ring-color': 'var(--color-teal, #00a39b)',
                } as React.CSSProperties}
              >
                <option value="">Kies tijdstip</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          )}

          {personOptions && personOptions.length > 0 && (
            <div>
              <label
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-navy, #1a2b4a)' }}
              >
                Aantal personen
              </label>
              <select
                value={selectedPersons || ''}
                onChange={(e) => onSelectPersons?.(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--color-border, #e5e7eb)',
                  '--tw-ring-color': 'var(--color-teal, #00a39b)',
                } as React.CSSProperties}
              >
                <option value="">Kies aantal</option>
                {personOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** Helper: Convert Dutch month name to JS month index */
function getMonthIndex(month: string): number {
  const months: Record<string, number> = {
    januari: 0,
    februari: 1,
    maart: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    augustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    december: 11,
  }
  return months[month.toLowerCase()] ?? 0
}
