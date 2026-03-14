export interface VehicleGridProps {
  heading?: string
  limit?: number
  columns?: '2' | '3' | '4'
  fuelFilter?: 'alle' | 'benzine' | 'diesel' | 'elektrisch' | 'hybride'
  bodyTypeFilter?: string
  showPrice?: boolean
}
