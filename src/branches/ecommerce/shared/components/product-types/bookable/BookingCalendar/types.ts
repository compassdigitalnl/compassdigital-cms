export interface DayAvailability {
  date: Date
  available: boolean
  price?: number
  spotsLeft?: number
}

export interface BookingCalendarProps {
  availableDates: DayAvailability[]
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  showPrices?: boolean
  highlightWeekends?: boolean
  className?: string
}
