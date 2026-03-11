import type { ConstructionService } from '@/payload-types'

export interface ServiceSidebarProps {
  service: ConstructionService
  relatedServices?: ConstructionService[]
  phone?: string
  className?: string
}
