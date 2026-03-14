export interface RdwVehicleInfo {
  brand: string
  model: string
  year: number
  fuelType: string
}

export interface TradeInFormData {
  licensePlate: string
  rdwInfo: RdwVehicleInfo | null
  mileage: number
  condition: 'uitstekend' | 'goed' | 'redelijk' | 'matig'
  remarks: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface TradeInFormProps {
  className?: string
}
