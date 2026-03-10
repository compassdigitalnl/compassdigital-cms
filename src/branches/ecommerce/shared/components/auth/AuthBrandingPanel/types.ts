export interface Feature {
  icon: string // Emoji or Lucide icon name
  title: string // Feature title (bold)
  description: string // Feature description
}

export interface AuthBrandingPanelProps {
  badge?: string
  title?: React.ReactNode // Can include <span> for accent color
  description?: string
  features?: Feature[]
  className?: string
}
