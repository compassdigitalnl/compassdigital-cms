export interface ExperienceInfoProps {
  category?: string
  categoryIcon?: string
  title: string
  rating?: number
  reviewCount?: number
  topReview?: string
  duration?: string
  personRange?: string
  location?: string
  availability?: string
  description?: string
  included?: Array<{ icon: string; label: string }>
  tip?: { title: string; content: string }
  className?: string
}
