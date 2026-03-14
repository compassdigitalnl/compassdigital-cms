export interface AppointmentFormProps {
  treatments?: Array<{
    id: number
    title: string
    slug: string
    duration?: number
  }>
  practitioners?: Array<{
    id: number
    name: string
    slug: string
    role?: string
  }>
  className?: string
}

export interface AppointmentFormData {
  treatmentSlug: string
  practitionerSlug: string
  date: string
  time: string
  period: 'ochtend' | 'middag' | ''
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  insuranceProvider: string
  complaint: string
  hasReferral: boolean
  remarks: string
}
