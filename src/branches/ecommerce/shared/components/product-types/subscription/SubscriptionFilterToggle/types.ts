import * as LucideIcons from 'lucide-react'

export interface ToggleOption {
  id: string
  label: string
  icon?: keyof typeof LucideIcons
}

export interface SubscriptionFilterToggleProps {
  leftOption: ToggleOption
  rightOption: ToggleOption
  activeId: string
  onChange: (optionId: string) => void
  className?: string
}
