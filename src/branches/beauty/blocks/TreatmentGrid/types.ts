export interface TreatmentGridProps {
  heading?: {
    badge?: string
    title: string
    description?: string
  }
  source?: 'auto' | 'manual'
  treatments?: any[]
  limit?: number
  columns?: '2' | '3' | '4'
  showCategoryFilter?: boolean
}
