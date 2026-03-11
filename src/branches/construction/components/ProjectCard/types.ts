import type { ConstructionProject } from '@/payload-types'

export interface ProjectCardProps {
  project: ConstructionProject
  variant?: 'default' | 'compact' | 'detailed'
  showTestimonial?: boolean
  className?: string
}
