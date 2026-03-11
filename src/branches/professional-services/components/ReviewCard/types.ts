export interface ReviewCardProps {
  review: any // ProfessionalReview type (will be generated)
  variant?: 'default' | 'compact' | 'featured'
  showCase?: boolean
  className?: string
}
