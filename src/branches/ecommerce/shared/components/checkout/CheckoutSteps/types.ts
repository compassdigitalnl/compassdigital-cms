export interface CheckoutStepsProps {
  currentStep: number // 1-4
  onStepClick?: (step: number) => void
  allowClickPrevious?: boolean
  className?: string
}
