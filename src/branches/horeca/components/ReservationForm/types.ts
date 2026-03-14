export interface ReservationFormProps {
  className?: string
}

export interface ReservationFormData {
  date: string
  time: string
  guests: number
  occasion: string
  preferences: string[]
  firstName: string
  lastName: string
  email: string
  phone: string
  remarks: string
}
