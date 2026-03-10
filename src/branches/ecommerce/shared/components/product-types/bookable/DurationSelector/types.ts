export interface DurationOption {
  id: string
  duration: number // in minutes
  label: string
  description?: string
  price: number
  popular?: boolean
}

export interface DurationSelectorProps {
  options: DurationOption[]
  selectedOptionId?: string
  onOptionSelect: (optionId: string) => void
  layout?: 'grid' | 'list'
  className?: string
}
