'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CreditCard, ShieldCheck, ArrowRight, CheckCircle, Loader2,
} from 'lucide-react'
import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import { CheckoutSteps } from '@/branches/shared/components/ui/checkout/CheckoutSteps'
import { CheckoutCard } from '@/branches/shared/components/ui/checkout/CheckoutCard'
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
  const [error, setError] = useState<string | null>(null)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string>('')

  const selectedPlan = plans.find((p) => p.id === selectedId) || plans[0]

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedId(plan.id)
    setError(null)
  }

  const handleConfirm = async () => {
    if (!selectedPlan || isSubmitting) return
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/subscription/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magazineSlug,
          planId: selectedPlan.id,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setOrderNumber(data.orderNumber || `#${data.orderId}`)
        setOrderConfirmed(true)
      } else {
        setError(data.error || 'Er is een fout opgetreden. Probeer het opnieuw.')
      }
    } catch {
      setError('Verbindingsfout. Controleer je internet en probeer het opnieuw.')
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

  // ── Confirmation view ──
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[var(--color-background,#F5F7FA)]">
        <div className="mx-auto px-6 py-16" style={{ maxWidth: 'var(--container-width, 800px)' }}>
          <div className="rounded-[20px] border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] p-10 text-center shadow-[var(--shadow-lg,0_16px_48px_rgba(10,22,40,0.12))]">
            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'var(--color-success-light, #E8F5E9)' }}
            >
              <CheckCircle className="h-8 w-8 text-[var(--color-success,#00C853)]" />
            </div>

            <h1 className="mb-2 font-heading text-[28px] font-extrabold text-[var(--color-text-primary)]">
              Bestelling geplaatst!
            </h1>
            <p className="mb-1 text-base text-[var(--color-text-secondary)]">
              Je abonnement op <strong>{magazineName}</strong> — {selectedPlan?.name} is ontvangen.
            </p>
            <p className="mb-6 text-sm text-[var(--color-text-muted)]">
              Bestelnummer: <strong>{orderNumber}</strong>
            </p>

            <div className="mb-6 rounded-xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-background,#F5F7FA)] px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {magazineName} — {selectedPlan?.name}
                </span>
                <span className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]">
                  {priceFormatted}
                </span>
              </div>
              {selectedPlan?.priceSuffix && (
                <div className="text-right text-xs text-[var(--color-text-muted)]">
                  {selectedPlan.priceSuffix}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/magazines/${magazineSlug}`}
                className="inline-flex items-center gap-2 rounded-[var(--border-radius,12px)] bg-[var(--color-primary)] px-6 py-3 font-heading text-sm font-extrabold text-white no-underline shadow-[0_4px_12px_var(--color-primary-glow)] transition-all duration-200 hover:opacity-90"
              >
                Terug naar {magazineName}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/magazines"
                className="inline-flex items-center gap-2 rounded-[var(--border-radius,12px)] border-2 border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] px-6 py-3 font-heading text-sm font-extrabold text-[var(--color-text-primary)] no-underline transition-all duration-200 hover:border-[var(--color-primary)]"
              >
                Alle magazines
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Checkout view ──
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

        {/* Secure header */}
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

        {/* 2-column layout — responsive: stacked on mobile, side-by-side on lg+ */}
        <div className="grid grid-cols-1 items-start gap-7 pb-12 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <CheckoutCard title="Kies je abonnement" icon={CreditCard}>
              <div
                className={`grid gap-3.5 ${
                  plans.length <= 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
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
                        href: undefined,
                        buttonLabel: selectedId === plan.id ? 'Geselecteerd' : plan.buttonLabel,
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
            <div className="overflow-hidden rounded-[18px] border-[1.5px] border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] shadow-[var(--shadow-md,0_8px_24px_rgba(10,22,40,0.08))] lg:sticky lg:top-[88px]">
              {/* Header */}
              <div
                className="px-[22px] py-5"
                style={{ background: 'linear-gradient(135deg, var(--color-text-primary, #0A1628), var(--color-text-primary, #121F33))' }}
              >
                <div className="flex items-center gap-1.5 font-heading text-base font-extrabold text-white">
                  <CreditCard className="h-4 w-4 text-[var(--color-primary-light)]" />
                  Besteloverzicht
                </div>
                <div className="text-xs text-white/40">{magazineName} abonnement</div>
              </div>

              {/* Body */}
              <div className="px-[22px] py-5">
                {/* Summary row */}
                <div className="mb-3.5 border-b border-[var(--color-border,#E8ECF1)] pb-3.5">
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Abonnement
                  </div>
                  <div className="flex justify-between py-1 text-sm text-[var(--color-text-primary)]">
                    <span>{magazineName} — {selectedPlan?.name}</span>
                    <span>{priceFormatted}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-end justify-between border-t-2 border-[var(--color-text-primary,#0A1628)] pt-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Totaal
                    </div>
                    <div className="font-heading text-xl font-extrabold text-[var(--color-text-primary)]">
                      {priceFormatted}
                    </div>
                  </div>
                  {selectedPlan?.priceSuffix && (
                    <div className="text-right text-xs text-[var(--color-text-muted)]">
                      {selectedPlan.priceSuffix}
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-3 rounded-lg bg-[var(--color-error-light,#FFEBEE)] px-3 py-2 text-sm text-[var(--color-error,#D32F2F)]">
                    {error}
                  </div>
                )}

                {/* Confirm button */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isSubmitting || !selectedPlan}
                    className="flex h-[54px] w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--border-radius,12px)] border-none font-heading text-base font-extrabold text-white shadow-[0_4px_16px_var(--color-primary-glow)] transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #00695C))' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-[18px] w-[18px] animate-spin" />
                        Bezig met verwerken...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-[18px] w-[18px]" />
                        Naar bestellen — {priceFormatted}
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-1.5 text-center text-xs text-[var(--color-text-muted)]">
                  Door te bestellen ga je akkoord met de voorwaarden.
                </div>

                {/* Trust items */}
                {defaultTrustItems.length > 0 && (
                  <TrustList items={defaultTrustItems} className="mt-3" />
                )}

                {/* Guarantee */}
                <TrustBanner
                  title="30 dagen geld-terug-garantie"
                  description="Niet tevreden? Je krijgt het volledige bedrag terug, geen vragen."
                  className="mt-3.5"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
