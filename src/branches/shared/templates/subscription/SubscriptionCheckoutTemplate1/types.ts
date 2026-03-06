import type { PricingPlan } from '@/branches/shared/components/ui/pricing/PricingPlanCard/types'
import type { SummarySection } from '@/branches/shared/components/ui/checkout/OrderSummary/types'
import type { TrustItem } from '@/branches/shared/components/ui/checkout/TrustList/types'
import type { CheckoutStep } from '@/branches/shared/components/ui/checkout/CheckoutSteps/types'
import type { BillingOption } from '@/branches/shared/components/ui/checkout/BillingPeriodSelector/types'

export interface SubscriptionCheckoutTemplate1Props {
  steps: CheckoutStep[]
  plans: PricingPlan[]
  selectedPlanId?: number | string
  billingOptions?: BillingOption[]
  summarySections: SummarySection[]
  totalLabel?: string
  totalValue: string
  totalSubtext?: string
  confirmLabel: string
  confirmNote?: string
  trustItems?: TrustItem[]
  guaranteeTitle?: string
  guaranteeDescription?: string
  summaryTitle?: string
  summarySubtitle?: string
}
