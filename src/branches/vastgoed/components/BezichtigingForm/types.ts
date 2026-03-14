export interface BezichtigingFormProps {
  propertyId?: string | number
  propertyAddress?: string
  className?: string
}

export interface BezichtigingFormState {
  viewingType: 'fysiek' | 'online'
  preferredDate: string
  preferredTime: string
  naam: string
  email: string
  telefoon: string
  opmerking: string
}
