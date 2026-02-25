export type StepStatus = 'done' | 'active' | 'pending'

export interface Step {
  label: string
  status: StepStatus
}

export interface ProgressStepsProps {
  steps: Step[]
  currentStep: number // 0-indexed
  ariaLabel?: string // e.g., "Checkout progress"
  className?: string
}
