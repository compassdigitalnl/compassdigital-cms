'use client'

/**
 * VP13: VariantAvailabilityCalendar
 * Date-based variant availability for rentals, bookings, and time-based products
 */

import React, { useState } from 'react'
import type { VariantAvailabilityCalendarProps } from '@/branches/ecommerce/shared/lib/product-types'
import { cn } from '@/utilities/cn'

export function VariantAvailabilityCalendar({
  product,
  option,
  selectedDate,
  onDateSelect,
  availabilityData = {},
  minDate,
  maxDate,
  showLegend = true,
  className,
}: VariantAvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateAvailable = (date: Date) => {
    const dateStr = formatDate(date)
    const availability = availabilityData[dateStr]

    // Check min/max dates
    if (minDate && date < minDate) return false
    if (maxDate && date > maxDate) return false

    // Check availability data
    if (availability === undefined) return true // Default to available
    if (typeof availability === 'boolean') return availability
    if (typeof availability === 'number') return availability > 0

    return true
  }

  const getDateAvailability = (date: Date) => {
    const dateStr = formatDate(date)
    return availabilityData[dateStr]
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return formatDate(date) === formatDate(selectedDate)
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    )
  }

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    )
  }

  const handleDateClick = (date: Date) => {
    if (!isPastDate(date) && isDateAvailable(date)) {
      onDateSelect(date)
    }
  }

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
  const days: (Date | null)[] = []

  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          {option.optionName}
          {option.required && <span className="ml-1 text-red-500">*</span>}
        </h3>
        {selectedDate && (
          <span className="text-sm text-gray-600">
            Selected: {selectedDate.toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Calendar */}
      <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Previous month"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h4 className="text-base font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h4>

          <button
            type="button"
            onClick={handleNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Next month"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day Names */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const available = isDateAvailable(date)
            const selected = isDateSelected(date)
            const past = isPastDate(date)
            const availability = getDateAvailability(date)
            const isLowAvailability =
              typeof availability === 'number' && availability > 0 && availability <= 3

            return (
              <button
                key={formatDate(date)}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={past || !available}
                className={cn(
                  'relative aspect-square rounded-lg text-sm font-medium transition-all',
                  selected
                    ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                    : available && !past
                      ? 'bg-white text-gray-900 hover:bg-gray-50'
                      : 'cursor-not-allowed bg-gray-100 text-gray-400',
                  !past && available && !selected && 'border-2 border-gray-200',
                  past && 'opacity-50',
                )}
                aria-label={`${date.toLocaleDateString()} ${available ? 'available' : 'unavailable'}`}
                aria-pressed={selected}
              >
                <span className="flex h-full w-full items-center justify-center">
                  {date.getDate()}
                </span>

                {/* Availability Indicator */}
                {!past && available && !selected && (
                  <div
                    className={cn(
                      'absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full',
                      isLowAvailability ? 'bg-orange-500' : 'bg-green-500',
                    )}
                  />
                )}

                {/* Selected Checkmark */}
                {selected && (
                  <div className="absolute right-0.5 top-0.5">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
            <span>Low Availability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-gray-400"></div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
            <span>Selected</span>
          </div>
        </div>
      )}

      {/* Selected Date Info */}
      {selectedDate && option.values && (
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="mb-2 text-sm font-semibold text-blue-900">Selected Date:</div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {(() => {
              const availability = getDateAvailability(selectedDate)
              return (
                typeof availability === 'number' &&
                availability > 0 && (
                  <span className="text-sm font-medium text-blue-900">
                    {availability} {availability === 1 ? 'slot' : 'slots'} available
                  </span>
                )
              )
            })()}
          </div>
        </div>
      )}

      {/* Required Field Helper Text */}
      {option.required && !selectedDate && (
        <p className="text-xs text-red-600">Please select a date to continue</p>
      )}

      {/* Helper Text */}
      {!option.required && !selectedDate && (
        <p className="text-xs text-gray-500">
          Select a date to check availability
        </p>
      )}
    </div>
  )
}
