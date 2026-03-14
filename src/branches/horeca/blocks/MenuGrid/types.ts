export interface MenuGridProps {
  heading?: {
    badge?: string
    title: string
    description?: string
  }
  source?: 'auto' | 'manual'
  menuItems?: any[]
  limit?: number
  columns?: '2' | '3' | '4'
  showCategoryFilter?: boolean
}
