export interface CompareVehicle {
  id: number
  title: string
  slug: string
  image?: string | null
  price?: number | null
  year?: number | null
  mileage?: number | null
  fuelType?: string | null
  transmission?: string | null
  power?: number | null
  bodyType?: string | null
  color?: string | null
  doors?: number | null
  seats?: number | null
  apkExpiry?: string | null
}

export interface VehicleCompareProps {
  vehicles: CompareVehicle[]
  onRemove?: (vehicleId: number) => void
  className?: string
}
