export interface PortfolioGridProps {
  heading?: {
    badge?: string
    title: string
    description?: string
  }
  source?: 'auto' | 'manual'
  cases?: any[]
  limit?: number
  columns?: '2' | '3' | '4'
}
