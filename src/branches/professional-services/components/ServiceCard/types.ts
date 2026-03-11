import type { ProfessionalService } from '@/payload-types'

export interface ServiceCardProps {
  service: ProfessionalService
  variant?: 'default' | 'compact' | 'featured'
  showCTA?: boolean
  className?: string
}
