export interface BookingSummary {
  date?: Date
  time?: string
  duration?: string
  participants?: {
    category: string
    count: number
    price: number
  }[]
  addOns?: {
    label: string
    price: number
  }[]
  basePrice?: number
  totalPrice: number
}

export interface BookingSummaryCardProps {
  summary: BookingSummary
  onBook?: () => void
  onEdit?: (section: 'date' | 'time' | 'participants' | 'addons') => void
  isBooking?: boolean
  showEditButtons?: boolean
  className?: string
}
