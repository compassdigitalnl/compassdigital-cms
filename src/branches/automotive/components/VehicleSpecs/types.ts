export interface VehicleSpecsData {
  // Algemeen
  brand?: string | null
  model?: string | null
  year?: number | null
  bodyType?: string | null
  // Motor
  fuelType?: string | null
  transmission?: string | null
  power?: number | null
  engineCapacity?: number | null
  // Registratie
  licensePlate?: string | null
  apkExpiry?: string | null
  previousOwners?: number | null
  napCheck?: boolean | null
  // Afmetingen
  weight?: number | null
  doors?: number | null
  seats?: number | null
  color?: string | null
}

export interface VehicleSpecsProps {
  specs: VehicleSpecsData
  className?: string
}
