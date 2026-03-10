export interface MixMatchProgressCounterProps {
  // Progress state
  currentCount: number
  maxCount: number

  // Labels
  label?: string
  completedLabel?: string

  // Display options
  variant?: 'default' | 'compact'
  showLabel?: boolean

  // Styling
  className?: string

  // Callbacks
  onChange?: (current: number, max: number) => void
}
