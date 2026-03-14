export interface BookingFormProps {
  services: Array<{
    id: number
    title: string
    slug: string
    duration?: number
    price?: number
    category?: string
  }>
  stylists?: Array<{
    id: number
    name: string
    slug: string
    avatar?: { url: string; alt?: string } | null
    specialties?: Array<{ specialty: string }>
  }>
  preselectedService?: string
  preselectedStylist?: string
  className?: string
}

export interface BookingFormData {
  serviceId: number | null
  staffMemberId: number | null
  date: string
  time: string
  firstName: string
  lastName: string
  email: string
  phone: string
  isFirstVisit: boolean
  remarks: string
}
