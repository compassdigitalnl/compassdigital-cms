export interface StepNavigationProps {
  onBack?: () => void
  onNext?: () => void
  backLabel?: string
  nextLabel?: string
  showBack?: boolean
  isLastStep?: boolean
  isLoading?: boolean
  className?: string
}
