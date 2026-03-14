export interface WorkshopService {
  id: number
  title: string
  price?: number | null
  duration?: number | null
}

export interface WorkshopBookingFormData {
  serviceId: number | null
  licensePlate: string
  vehicleInfo: string
  date: string
  timeSlot: 'ochtend' | 'middag'
  firstName: string
  lastName: string
  email: string
  phone: string
  remarks: string
}

export interface WorkshopBookingFormProps {
  services: WorkshopService[]
  className?: string
}
