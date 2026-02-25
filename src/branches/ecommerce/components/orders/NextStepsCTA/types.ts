export type NextStepVariant = 'primary' | 'secondary' | 'navy' | 'coral'
export type NextStepsCTAVariant = 'default' | 'compact' | 'icon-only'

export interface NextStepBadge {
  text: string
  color?: string
}

export interface NextStepAction {
  id: string
  label: string
  icon: string // Lucide icon name (e.g., "map-pin", "download", "shopping-bag")
  variant: NextStepVariant
  href?: string // Link URL
  onClick?: () => void // Click handler
  badge?: NextStepBadge
  download?: boolean // For download links
  external?: boolean // Opens in new tab
}

export interface NextStepsCTAProps {
  actions: NextStepAction[]
  variant?: NextStepsCTAVariant // Default: 'default'
  columns?: number // Override grid columns (default: auto based on actions.length)
  className?: string
}
