import type { WorkshopService } from '@/branches/automotive/components/WorkshopBookingForm/types'

export interface WorkshopBookingProps {
  services: WorkshopService[]
  preselectedService?: string
  preselectedVehicle?: string
}
