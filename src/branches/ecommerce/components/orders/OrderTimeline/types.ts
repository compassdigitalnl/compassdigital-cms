export type TimelineStepStatus = 'done' | 'active' | 'upcoming'

export interface TimelineStep {
  id: string
  label: string
  description?: string
  timestamp?: string
  status: TimelineStepStatus
  icon?: string // Lucide icon name (kebab-case)
}

export interface OrderTimelineProps {
  steps: TimelineStep[]
  expectedDelivery?: string
  deliveryMethod?: string
  className?: string
}
