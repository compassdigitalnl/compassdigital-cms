export interface TestDriveFormData {
  vehicleId: number
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: 'ochtend' | 'middag'
  remarks: string
}

export interface TestDriveFormProps {
  vehicleId: number
  vehicleTitle: string
  className?: string
}
