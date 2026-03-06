'use client'

import React, { useState } from 'react'
import { CreditCard, Calendar, ShieldCheck } from 'lucide-react'
import { CheckoutSteps } from '@/branches/shared/ui/checkout/CheckoutSteps'
import { CheckoutCard } from '@/branches/shared/ui/checkout/CheckoutCard'
import { OrderSummary } from '@/branches/shared/ui/checkout/OrderSummary'
import { TrustList } from '@/branches/shared/ui/checkout/TrustList'
import { TrustBanner } from '@/branches/shared/ui/checkout/TrustBanner'
import { BillingPeriodSelector } from '@/branches/shared/ui/checkout/BillingPeriodSelector'
import { PricingPlanCard } from '@/branches/shared/ui/pricing/PricingPlanCard'
import type { PricingPlan } from '@/branches/shared/ui/pricing/PricingPlanCard/types'
import type { SubscriptionCheckoutTemplate1Props } from './types'

export default function SubscriptionCheckoutTemplate1({
  steps,
  plans,
  selectedPlanId,
  billingOptions,
  summarySections,
  totalLabel,
  totalValue,
  totalSubtext,
  confirmLabel,
  confirmNote,
  trustItems,
  guaranteeTitle = '30 dagen geld-terug-garantie',
  guaranteeDescription = 'Niet tevreden? Je krijgt het volledige bedrag terug, geen vragen.',
  summaryTitle = 'Besteloverzicht',
  summarySubtitle,
}: SubscriptionCheckoutTemplate1Props) {
  const [selectedId, setSelectedId] = useState<number | string | undefined>(
    selectedPlanId || plans.find((p) => p.highlighted)?.id || plans[0]?.id,
  )
  const [billingId, setBillingId] = useState<string>(billingOptions?.[billingOptions.length - 1]?.id || '')

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedId(plan.id)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background,#F5F7FA)]">
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1200px)' }}>
        {/* Secure header indicator */}
        <div className="flex items-center justify-end py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success,#00C853)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Beveiligde checkout
          </div>
        </div>

        {/* Steps */}
        <CheckoutSteps steps={steps} />

        {/* 2-column layout: 1fr 380px */}
        <div
          className="grid items-start gap-7 pb-12"
          style={{ gridTemplateColumns: '1fr 380px' }}
        >
          {/* Left column */}
          <div className="flex flex-col gap-4">
            {/* Plan selector */}
            <CheckoutCard title="Kies je abonnement" icon={CreditCard}>
              <div
                className={`grid gap-3.5 ${
                  plans.length <= 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`cursor-pointer rounded-[14px] border-2 transition-all duration-150 ${
                      selectedId === plan.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)]'
                        : 'border-transparent'
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <PricingPlanCard
                      plan={{
                        ...plan,
                        buttonLabel: selectedId === plan.id ? '✓ Geselecteerd' : plan.buttonLabel,
                        buttonVariant: selectedId === plan.id ? 'fill' : 'outline',
                      }}
                      onSelect={handleSelectPlan}
                    />
                  </div>
                ))}
              </div>
            </CheckoutCard>

            {/* Billing period */}
            {billingOptions && billingOptions.length > 0 && (
              <CheckoutCard title="Facturatieperiode" icon={Calendar}>
                <BillingPeriodSelector
                  options={billingOptions}
                  selectedId={billingId}
                  onSelect={setBillingId}
                />
              </CheckoutCard>
            )}
          </div>

          {/* Right column — Order summary */}
          <aside>
            <OrderSummary
              title={summaryTitle}
              subtitle={summarySubtitle}
              sections={summarySections}
              totalLabel={totalLabel}
              totalValue={totalValue}
              totalSubtext={totalSubtext}
              confirmLabel={confirmLabel}
              confirmNote={confirmNote}
            >
              {/* Trust list */}
              {trustItems && trustItems.length > 0 && (
                <TrustList items={trustItems} className="mt-3" />
              )}

              {/* Guarantee banner */}
              <TrustBanner
                title={guaranteeTitle}
                description={guaranteeDescription}
                className="mt-3.5"
              />
            </OrderSummary>
          </aside>
        </div>
      </div>
    </div>
  )
}
