export interface EventsGridProps {
  heading?: {
    badge?: string
    title: string
    description?: string
  }
  source?: 'auto' | 'manual'
  events?: any[]
  limit?: number
  columns?: '2' | '3' | '4'
}
