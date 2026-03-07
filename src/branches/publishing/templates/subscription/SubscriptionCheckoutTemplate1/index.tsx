'use client'

import React, { useState } from 'react'
import { CreditCard, Calendar, CheckCircle } from 'lucide-react'
import { BillingPeriodSelector } from '@/branches/shared/components/ui/checkout/BillingPeriodSelector'
import { PricingPlanCard } from '@/branches/shared/components/ui/pricing/PricingPlanCard'
import type { PricingPlan } from '@/branches/shared/components/ui/pricing/PricingPlanCard/types'
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
        {/* Steps */}
        <div className="flex items-center justify-center gap-6 py-6">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step.status === 'done' ? 'bg-[var(--color-success,#00C853)] text-white'
                : step.status === 'active' ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-grey-light,#F1F4F8)] text-[var(--color-text-muted)]'
              }`}>
                {step.status === 'done' ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span className={step.status === 'active' ? 'font-bold text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 items-start gap-7 pb-12 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            {/* Plan selector */}
            <div className="rounded-xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] p-6">
              <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-extrabold text-[var(--color-text-primary)]">
                <CreditCard className="h-5 w-5 text-[var(--color-primary)]" />
                Kies je abonnement
              </h2>
              <div className={`grid gap-3.5 ${
                plans.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
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
                        buttonLabel: selectedId === plan.id ? 'Geselecteerd' : plan.buttonLabel,
                        buttonVariant: selectedId === plan.id ? 'fill' : 'outline',
                      }}
                      onSelect={handleSelectPlan}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Billing period */}
            {billingOptions && billingOptions.length > 0 && (
              <div className="rounded-xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] p-6">
                <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-extrabold text-[var(--color-text-primary)]">
                  <Calendar className="h-5 w-5 text-[var(--color-primary)]" />
                  Facturatieperiode
                </h2>
                <BillingPeriodSelector
                  options={billingOptions}
                  selectedId={billingId}
                  onSelect={setBillingId}
                />
              </div>
            )}
          </div>

          {/* Right column — Order summary */}
          <aside className="rounded-xl border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] overflow-hidden">
            <div className="bg-[var(--color-text-primary,#0A1628)] px-6 py-4">
              <h3 className="font-heading text-base font-extrabold text-white">{summaryTitle}</h3>
              {summarySubtitle && <p className="text-xs text-white/40">{summarySubtitle}</p>}
            </div>
            <div className="p-6">
              {summarySections?.map((section, si) => (
                <div key={si} className="mb-4">
                  {section.label && (
                    <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {section.label}
                    </div>
                  )}
                  {section.rows.map((row, ri) => (
                    <div key={ri} className="flex justify-between py-1 text-sm">
                      <span className="text-[var(--color-text-secondary)]">{row.label}</span>
                      <span className="font-bold text-[var(--color-text-primary)]">{row.value}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="border-t-2 border-[var(--color-text-primary,#0A1628)] pt-3">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{totalLabel}</div>
                    <div className="font-heading text-xl font-extrabold text-[var(--color-text-primary)]">{totalValue}</div>
                  </div>
                  {totalSubtext && <div className="text-xs text-[var(--color-text-muted)]">{totalSubtext}</div>}
                </div>
              </div>

              {confirmLabel && (
                <button className="mt-4 w-full rounded-[var(--border-radius,12px)] bg-[var(--color-primary)] px-6 py-3.5 font-heading text-sm font-extrabold text-white shadow-[0_4px_12px_var(--color-primary-glow)] transition-all hover:opacity-90">
                  {confirmLabel}
                </button>
              )}

              {confirmNote && (
                <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">{confirmNote}</p>
              )}

              {/* Trust items */}
              {trustItems && trustItems.length > 0 && (
                <div className="mt-4 flex flex-col gap-1.5">
                  {trustItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success,#00C853)]">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {item.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Guarantee */}
              <div className="mt-4 rounded-lg bg-[var(--color-success-light,#E8F5E9)] p-4">
                <div className="text-sm font-bold text-[var(--color-success-dark,#1B5E20)]">{guaranteeTitle}</div>
                <div className="text-xs text-[var(--color-success-dark,#1B5E20)] opacity-80">{guaranteeDescription}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
