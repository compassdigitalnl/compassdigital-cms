'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Calendar, ShieldCheck, ArrowRight } from 'lucide-react'
import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import { CheckoutSteps } from '@/branches/shared/components/ui/checkout/CheckoutSteps'
import { CheckoutCard } from '@/branches/shared/components/ui/checkout/CheckoutCard'
import { OrderSummary } from '@/branches/shared/components/ui/checkout/OrderSummary'
import { TrustList } from '@/branches/shared/components/ui/checkout/TrustList'
import { TrustBanner } from '@/branches/shared/components/ui/checkout/TrustBanner'
import { PricingPlanCard } from '@/branches/shared/components/ui/pricing/PricingPlanCard'
import type { PricingPlan } from '@/branches/shared/components/ui/pricing/PricingPlanCard/types'
import type { TrustItem } from '@/branches/shared/components/ui/checkout/TrustList/types'

interface SubscriptionCheckoutClientProps {
  magazineName: string
  magazineSlug: string
  plans: PricingPlan[]
  selectedPlanId?: number | string
  trustItems?: TrustItem[]
}

export default function SubscriptionCheckoutClient({
  magazineName,
  magazineSlug,
  plans,
  selectedPlanId: initialPlanId,
  trustItems = [],
}: SubscriptionCheckoutClientProps) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<number | string | undefined>(
    initialPlanId || plans.find((p) => p.highlighted)?.id || plans[0]?.id,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedPlan = plans.find((p) => p.id === selectedId) || plans[0]

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedId(plan.id)
  }

  const handleConfirm = async () => {
    if (!selectedPlan || isSubmitting) return
    setIsSubmitting(true)

    try {
      // Create subscription order via API
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magazineSlug,
          planId: selectedPlan.id,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        // Redirect to payment or confirmation
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        } else {
          router.push(`/order/${data.orderId || 'confirmation'}`)
        }
      } else {
        // For now redirect to checkout with plan info
        router.push(`/checkout?subscription=${magazineSlug}&plan=${selectedPlan.id}`)
      }
    } catch {
      // Fallback: redirect to checkout
      router.push(`/checkout?subscription=${magazineSlug}&plan=${selectedPlan.id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrustItems: TrustItem[] = trustItems.length > 0 ? trustItems : [
    { icon: 'Zap', text: 'Direct actief na betaling' },
    { icon: 'RotateCcw', text: '30 dagen geld-terug-garantie' },
    { icon: 'ShieldCheck', text: 'Veilig betalen' },
    { icon: 'Lock', text: 'Beveiligde verbinding (SSL)' },
  ]

  const priceFormatted = selectedPlan?.price != null
    ? `€${selectedPlan.price.toFixed(2).replace('.', ',')}`
    : '—'

  return (
    <div className="min-h-screen bg-[var(--color-background,#F5F7FA)]">
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1200px)' }}>
        <Breadcrumbs
          items={[
            { label: 'Magazines', href: '/magazines' },
            { label: magazineName, href: `/magazines/${magazineSlug}` },
          ]}
          currentPage="Afrekenen"
        />

        {/* Secure header indicator */}
        <div className="flex items-center justify-end py-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success,#00C853)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Beveiligde checkout
          </div>
        </div>

        {/* Steps */}
        <CheckoutSteps
          steps={[
            { label: 'Plan kiezen', status: 'active' },
            { label: 'Betalen', status: 'pending' },
            { label: 'Bevestiging', status: 'pending' },
          ]}
        />

        {/* 2-column layout */}
        <div
          className="grid items-start gap-7 pb-12"
          style={{ gridTemplateColumns: '1fr 380px' }}
        >
          {/* Left column */}
          <div className="flex flex-col gap-4">
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
          </div>

          {/* Right column — Order summary */}
          <aside>
            <OrderSummary
              title="Besteloverzicht"
              subtitle={`${magazineName} abonnement`}
              sections={[
                {
                  label: 'Abonnement',
                  rows: [
                    {
                      label: `${magazineName} — ${selectedPlan?.name || ''}`,
                      value: priceFormatted,
                    },
                  ],
                },
              ]}
              totalLabel="Totaal"
              totalValue={priceFormatted}
              totalSubtext={selectedPlan?.priceSuffix || ''}
              confirmLabel={isSubmitting ? 'Bezig...' : `Naar bestellen — ${priceFormatted}`}
              onConfirm={handleConfirm}
              confirmNote="Door te bestellen ga je akkoord met de voorwaarden."
            >
              {defaultTrustItems.length > 0 && (
                <TrustList items={defaultTrustItems} className="mt-3" />
              )}

              <TrustBanner
                title="30 dagen geld-terug-garantie"
                description="Niet tevreden? Je krijgt het volledige bedrag terug, geen vragen."
                className="mt-3.5"
              />
            </OrderSummary>
          </aside>
        </div>
      </div>
    </div>
  )
}
