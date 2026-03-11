export interface CaseCardProps {
  case: any // ProfessionalCase type (will be generated)
  variant?: 'default' | 'compact' | 'detailed'
  showTestimonial?: boolean
  className?: string
}
