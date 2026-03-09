export type QuickOrderActionVariant = 'secondary' | 'teal'

export interface QuickOrderHeaderAction {
  id: string
  label: string
  icon: string // Lucide icon name
  variant: QuickOrderActionVariant
  onClick?: () => void | Promise<void>
  href?: string
}

export interface QuickOrderHeaderProps {
  title?: string
  description?: string
  icon?: string // Lucide icon name for header, default "zap"
  actions: QuickOrderHeaderAction[]
  className?: string
}
