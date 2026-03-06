import type { PricingPlan } from '@/branches/shared/ui/pricing/PricingPlanCard/types'
import type { FeatureCategory } from '@/branches/shared/ui/pricing/PricingFeatureTable/types'
import type { FAQItem } from '@/branches/shared/ui/pricing/PricingFAQ/types'
import type { TrustItem } from '@/branches/shared/ui/checkout/TrustList/types'

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
