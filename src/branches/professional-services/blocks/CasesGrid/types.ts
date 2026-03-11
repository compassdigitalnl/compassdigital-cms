export interface CasesGridProps {
  heading?: {
    badge?: string | null
    title?: string | null
    description?: string | null
  }
  casesSource?: 'auto' | 'featured' | 'manual' | 'service'
  cases?: any[] | null
  service?: any | null
  limit?: number | null
  columns?: '2' | '3' | '4' | null
  showFilter?: boolean | null
  ctaButton?: {
    enabled?: boolean | null
    text?: string | null
    link?: string | null
  }
}

export type ProfessionalCase = any
