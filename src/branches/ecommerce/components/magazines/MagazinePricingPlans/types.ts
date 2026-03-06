export interface PlanFeature {
  text: string
  included: boolean
}

export interface SubscriptionPlan {
  id: number | string
  name: string
  description?: string
  highlighted?: boolean
  price: number
  period: 'monthly' | 'quarterly' | 'biannual' | 'yearly' | 'once'
  editions?: number
  features?: PlanFeature[]
  externalUrl?: string
}

export interface TrustItem {
  icon?: string
  text: string
}

export interface MagazinePricingPlansProps {
  magazineName: string
  magazineSlug: string
  plans: SubscriptionPlan[]
  trustItems?: TrustItem[]
  className?: string
}
