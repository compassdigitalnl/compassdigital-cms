import type { ProfessionalReview } from '@/payload-types'

export interface ConsultationSidebarProps {
  phone?: string
  testimonial?: ProfessionalReview | null
  className?: string
}
