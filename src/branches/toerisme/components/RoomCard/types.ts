export interface RoomCardProps {
  name: string
  type?: string
  maxGuests?: number
  pricePerNight?: number
  description?: string
  amenities?: string[]
  onSelect?: () => void
  className?: string
}
