import type { PricingPlan } from '@/branches/shared/components/ui/pricing/PricingPlanCard/types'
import type { FeatureCategory } from '@/branches/shared/components/ui/pricing/PricingFeatureTable/types'
import type { FAQItem } from '@/branches/shared/components/ui/pricing/PricingFAQ/types'
export interface TrustItem {
  icon: string
  text: string
}

export interface SubscriptionPricingTemplate1Props {
  badge?: string
  title: string
  subtitle?: string
  plans: PricingPlan[]
  showToggle?: boolean
  featureTable?: {
    planNames: string[]
    highlightedPlanIndex?: number
    categories: FeatureCategory[]
  }
  faqItems?: FAQItem[]
  trustItems?: TrustItem[]
  enterpriseCTA?: {
    title: string
    description: string
    features?: string[]
    primaryButtonLabel?: string
    primaryButtonHref?: string
    secondaryButtonLabel?: string
    secondaryButtonHref?: string
  }
}
