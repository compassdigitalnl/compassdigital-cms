export interface ProjectsGridBlockProps {
  heading?: {
    badge?: string
    title?: string
    description?: string
  }
  projectsSource?: 'auto' | 'featured' | 'manual' | 'branch'
  projects?: any[]
  branch?: string
  limit?: number
  columns?: '2' | '3' | '4'
  showFilter?: boolean
  ctaButton?: {
    enabled?: boolean
    text?: string
    link?: string
  }
  enableAnimation?: boolean
  animationType?: string
  animationDuration?: string
  animationDelay?: string
}
