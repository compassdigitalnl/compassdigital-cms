export interface VehicleFilterState {
  brand: string
  model: string
  priceMin: number
  priceMax: number
  yearMin: number
  yearMax: number
  mileageMax: number
  fuelType: string[]
  transmission: string
  bodyType: string[]
  color: string
}

export interface VehicleBrand {
  id: number
  title: string
  slug: string
}

export interface VehicleFiltersProps {
  brands?: VehicleBrand[]
  onChange: (filters: VehicleFilterState) => void
  initialFilters?: Partial<VehicleFilterState>
  className?: string
}
