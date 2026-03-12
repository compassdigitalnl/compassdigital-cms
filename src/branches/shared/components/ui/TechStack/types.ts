export interface TechItem {
  name: string
  icon?: string
  category?: 'frontend' | 'backend' | 'platform' | 'integration' | 'design'
}

export interface TechStackProps {
  technologies: TechItem[]
  title?: string
  variant?: 'pills' | 'cards'
  className?: string
}
