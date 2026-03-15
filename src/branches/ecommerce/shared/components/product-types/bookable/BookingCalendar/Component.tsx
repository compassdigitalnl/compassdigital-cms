'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/primitives/button'
import type { BookingCalendarProps, DayAvailability } from './types'

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  availableDates,
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  showPrices = false,
  highlightWeekends = false,
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())

  const monthNames = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
  ]
  const dayNames = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Adjust for Monday start

    const days: (Date | null)[] = []

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getDayInfo = (date: Date | null): DayAvailability | null => {
    if (!date) return null
    return availableDates.find(d =>
      d.date.getDate() === date.getDate() &&
      d.date.getMonth() === date.getMonth() &&
      d.date.getFullYear() === date.getFullYear()
    ) || null
  }

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true
    const dayInfo = getDayInfo(date)
    if (!dayInfo || !dayInfo.available) return true
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isWeekend = (date: Date | null) => {
    if (!date) return false
    const day = date.getDay()
    return day === 0 || day === 6
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className={`booking-calendar bg-white border border-grey-light rounded-xl p-5 ${className}`}>
      {/* Header */}
      <div className="calendar-header flex items-center justify-between mb-4">
        <Button
          onClick={goToPreviousMonth}
          variant="ghost"
          size="sm"
          className="btn btn-ghost btn-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-lg font-extrabold text-navy">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <Button
          onClick={goToNextMonth}
          variant="ghost"
          size="sm"
          className="btn btn-ghost btn-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Day names */}
      <div className="calendar-days-header grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold text-grey-mid py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dayInfo = getDayInfo(date)
          const isSelected = isDateSelected(date)
          const isDisabled = isDateDisabled(date)
          const isWeekendDay = isWeekend(date)

          return (
            <button
              key={index}
              onClick={() => date && !isDisabled && onDateSelect(date)}
              disabled={isDisabled}
              className={`
                calendar-day aspect-square rounded-lg p-1 text-center transition-all relative
                ${!date ? 'invisible' : ''}
                ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-glow)] cursor-pointer'}
                ${isSelected ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white border border-grey-light'}
                ${isWeekendDay && highlightWeekends && !isSelected ? 'bg-grey-light' : ''}
              `}
            >
              {date && (
                <>
                  <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-navy'}`}>
                    {date.getDate()}
                  </div>
                  {showPrices && dayInfo?.price && !isSelected && (
                    <div className="text-[10px] font-semibold text-[var(--color-primary)] mt-0.5">
                      €{dayInfo.price}
                    </div>
                  )}
                  {dayInfo && dayInfo.spotsLeft !== undefined && dayInfo.spotsLeft <= 3 && dayInfo.spotsLeft > 0 && !isSelected && (
                    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="calendar-legend mt-4 pt-4 border-t border-grey-light flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[var(--color-primary)]" />
          <span className="text-grey-dark">Geselecteerd</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border border-grey-light bg-white" />
          <span className="text-grey-dark">Beschikbaar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border border-grey-light bg-white opacity-40" />
          <span className="text-grey-dark">Niet beschikbaar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="relative w-3 h-3">
            <div className="w-3 h-3 rounded border border-grey-light bg-white" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-500 rounded-full" />
          </div>
          <span className="text-grey-dark">Bijna vol</span>
        </div>
      </div>
    </div>
  )
}

export default BookingCalendar
