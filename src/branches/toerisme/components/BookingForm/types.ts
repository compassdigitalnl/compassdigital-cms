export interface BookingFormProps {
  tours?: { id: string | number; title: string }[]
  accommodations?: { id: string | number; name: string }[]
  className?: string
}

export interface BookingFormData {
  // Step 1: Reis & Accommodatie
  tourId?: string | number
  accommodationId?: string | number

  // Step 2: Reizigers & Data
  departureDate: string
  returnDate: string
  travelers: number
  travelInsurance: boolean

  // Step 3: Persoonsgegevens
  firstName: string
  lastName: string
  email: string
  phone: string
  remarks: string
}
