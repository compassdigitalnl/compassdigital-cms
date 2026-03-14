export interface PatientReviewsProps {
  heading?: {
    badge?: string
    title: string
    description?: string
  }
  source?: 'auto' | 'manual'
  reviews?: any[]
  limit?: number
  showTreatmentType?: boolean
}
