export interface PlanFeature {
  text: string
  included: boolean
  highlighted?: boolean
}

export interface PricingPlan {
  id: number | string
  name: string
  description?: string
  icon?: string
  price: number | null
  priceLabel?: string
  originalPrice?: number
  priceSuffix?: string
  billedLabel?: string
  highlighted?: boolean
  highlightLabel?: string
  buttonLabel?: string
  buttonVariant?: 'fill' | 'outline' | 'navy'
  features?: PlanFeature[]
  href?: string
}

export interface PricingPlanCardProps {
  plan: PricingPlan
  onSelect?: (plan: PricingPlan) => void
  className?: string
}
