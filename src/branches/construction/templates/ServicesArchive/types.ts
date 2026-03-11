import type { ConstructionService } from '@/payload-types'

export interface ServicesArchiveProps {
  services: ConstructionService[]
  totalPages: number
  currentPage: number
}
