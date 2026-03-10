export type AvailabilityStatus = 'available' | 'limited' | 'full' | 'unavailable'

export interface BookingAvailabilityStatusProps {
  status: AvailabilityStatus
  spotsLeft?: number
  totalSpots?: number
  message?: string
  showIcon?: boolean
  variant?: 'inline' | 'badge' | 'banner'
  className?: string
}
