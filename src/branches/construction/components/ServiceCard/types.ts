import type { ConstructionService } from '@/payload-types'

export interface ServiceCardProps {
  service: ConstructionService
  variant?: 'default' | 'compact' | 'featured'
  showCTA?: boolean
  className?: string
}
