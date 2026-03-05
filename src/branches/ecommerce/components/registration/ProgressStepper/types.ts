export interface Step {
  label: string
  description: string
}

export type StepStatus = 'done' | 'active' | 'upcoming'

export interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}
