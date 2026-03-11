export interface ServicesGridProps {
  heading?: {
    badge?: string | null
    badgeIcon?: string | null
    title?: string | null
    description?: string | null
  }
  servicesSource?: 'auto' | 'manual'
  services?: any[] | null
  limit?: number | null
  columns?: '2' | '3' | '4' | null
  linkText?: string | null
}

export type ProfessionalService = any
