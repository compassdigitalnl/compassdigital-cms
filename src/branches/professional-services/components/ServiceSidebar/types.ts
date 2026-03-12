import type { ProfessionalService } from '@/payload-types'

export interface ServiceSidebarProps {
  service: ProfessionalService
  relatedServices?: ProfessionalService[]
  phone?: string
  className?: string
}
