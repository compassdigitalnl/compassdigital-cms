export interface CheckoutStep {
  label: string
  status: 'done' | 'active' | 'pending'
}

export interface CheckoutStepsProps {
  steps: CheckoutStep[]
  className?: string
}
