export interface BookingSidebarProps {
  selectedService?: {
    title: string
    duration?: number
    price?: number
  } | null
  selectedStylist?: {
    name: string
  } | null
  selectedDate?: string
  selectedTime?: string
  guarantees?: string[]
  className?: string
}
