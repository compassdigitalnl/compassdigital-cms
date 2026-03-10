export type DayStatus = 'available' | 'limited' | 'full' | 'unavailable'

export interface CalendarDay {
  date: number
  status: DayStatus
}

export interface AvailabilityCalendarProps {
  month: string
  year: number
  days: CalendarDay[]
  selectedDate?: number
  onSelectDate: (date: number) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  timeSlots?: string[]
  selectedTime?: string
  onSelectTime?: (time: string) => void
  personOptions?: string[]
  selectedPersons?: string
  onSelectPersons?: (persons: string) => void
  className?: string
}
