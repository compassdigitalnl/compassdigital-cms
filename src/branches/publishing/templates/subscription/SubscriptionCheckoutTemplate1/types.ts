import type { PricingPlan } from '@/branches/shared/components/ui/pricing/PricingPlanCard/types'
import type { BillingOption } from '@/branches/shared/components/ui/checkout/BillingPeriodSelector/types'

export interface CheckoutStep {
  label: string
  status: 'done' | 'active' | 'pending'
}

export interface SummarySection {
  label?: string
  rows: { label: string; value: string }[]
}

export interface TrustItem {
  icon: string
  text: string
}

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
