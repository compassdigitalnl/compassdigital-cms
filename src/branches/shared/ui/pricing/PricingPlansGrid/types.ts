import type { PricingPlan } from '../PricingPlanCard/types'

export interface PricingPlansGridProps {
  plans: PricingPlan[]
  onSelectPlan?: (plan: PricingPlan) => void
  className?: string
}
