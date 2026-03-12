import type { Product } from '@/payload-types'

export interface BookableContainerProps {
  product: Product
  className?: string
}

/** Raw booking config from the product's bookableConfig field */
export interface BookableConfig {
  durationOptions?: RawDurationOption[]
  timeSlots?: RawTimeSlot[]
  participantCategories?: RawParticipantCategory[]
  addOns?: RawAddOn[]
  totalCapacity?: number
  bufferTime?: number
  showPricesOnCalendar?: boolean
}

export interface RawDurationOption {
  id?: string
  duration: number
  label: string
  price: number
  popular?: boolean
  description?: string
}

export interface RawTimeSlot {
  id?: string
  time: string
  available?: boolean
  spotsLeft?: number
  priceOverride?: number
}

export interface RawParticipantCategory {
  id?: string
  label: string
  price: number
  minCount?: number
  maxCount?: number
  description?: string
}

export interface RawAddOn {
  id?: string
  label: string
  price: number
  required?: boolean
  description?: string
}
