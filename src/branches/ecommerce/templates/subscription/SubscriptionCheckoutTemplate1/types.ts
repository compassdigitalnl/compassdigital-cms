import type { PricingPlan } from '@/branches/shared/ui/pricing/PricingPlanCard/types'
import type { SummarySection } from '@/branches/shared/ui/checkout/OrderSummary/types'
import type { TrustItem } from '@/branches/shared/ui/checkout/TrustList/types'
import type { CheckoutStep } from '@/branches/shared/ui/checkout/CheckoutSteps/types'
import type { BillingOption } from '@/branches/shared/ui/checkout/BillingPeriodSelector/types'

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
