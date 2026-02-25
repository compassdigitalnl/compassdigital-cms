/**
 * CheckoutProgressStepper Type Definitions
 */

/**
 * Checkout step data
 */
export interface CheckoutStep {
  /**
   * Step ID (1-4)
   */
  id: number

  /**
   * Step label (e.g., "Gegevens", "Verzending")
   */
  label: string
}

/**
 * Step state types
 */
export type StepState = 'completed' | 'active' | 'pending'

/**
 * CheckoutProgressStepper Props
 */
export interface CheckoutProgressStepperProps {
  /**
   * Current active step (1-4)
   */
  currentStep: 1 | 2 | 3 | 4

  /**
   * Step labels (optional override)
   * Default: Gegevens, Verzending, Betaling, Bevestiging
   */
  steps?: CheckoutStep[]

  /**
   * Click handler for steps (allows navigation to completed steps)
   */
  onStepClick?: (step: number) => void

  /**
   * Additional CSS class names
   */
  className?: string
}
