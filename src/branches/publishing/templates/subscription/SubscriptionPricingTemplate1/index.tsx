'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Building, CheckCircle, MessageCircle, Calendar } from 'lucide-react'
import { PricingPlansGrid } from '@/branches/shared/components/ui/ecommerce/pricing/PricingPlansGrid'
import { PricingToggle } from '@/branches/shared/components/ui/ecommerce/pricing/PricingToggle'
import { PricingFeatureTable } from '@/branches/shared/components/ui/ecommerce/pricing/PricingFeatureTable'
import { PricingFAQ } from '@/branches/shared/components/ui/ecommerce/pricing/PricingFAQ'
import type { SubscriptionPricingTemplate1Props } from './types'

export default function SubscriptionPricingTemplate1({
  badge,
  title,
  subtitle,
  plans,
  showToggle = false,
  featureTable,
  faqItems,
  trustItems,
  enterpriseCTA,
}: SubscriptionPricingTemplate1Props) {
  const [isYearly, setIsYearly] = useState(true)

  return (
    <div className="min-h-screen bg-[var(--color-background,#F5F7FA)]">
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1200px)' }}>
        {/* Hero */}
        <div className="pb-9 pt-[52px] text-center">
          {badge && (
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary-glow)] bg-[var(--color-primary-glow)] px-3.5 py-1.5 text-xs font-bold text-[var(--color-primary)]">
              <Sparkles className="h-[13px] w-[13px]" />
              {badge}
            </div>
          )}
          <h1
            className="mb-2 font-heading text-[42px] font-extrabold leading-tight text-[var(--color-text-primary)]"
            style={{ letterSpacing: '-0.02em' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-[560px] text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Toggle */}
        {showToggle && (
          <PricingToggle
            isYearly={isYearly}
            onToggle={setIsYearly}
            className="mb-8"
          />
        )}

        {/* Plans grid */}
        <PricingPlansGrid
          plans={plans}
          className="mb-12"
        />

        {/* Trust items */}
        {trustItems && trustItems.length > 0 && (
          <div className="mx-auto mb-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                <CheckCircle className="h-3.5 w-3.5 text-[var(--color-success,#00C853)]" />
                {item.text}
              </div>
            ))}
          </div>
        )}

        {/* Feature comparison table */}
        {featureTable && (
          <PricingFeatureTable
            planNames={featureTable.planNames}
            highlightedPlanIndex={featureTable.highlightedPlanIndex}
            categories={featureTable.categories}
            className="mb-12"
          />
        )}

        {/* FAQ */}
        {faqItems && faqItems.length > 0 && (
          <PricingFAQ items={faqItems} className="mb-12" />
        )}

        {/* Enterprise CTA */}
        {enterpriseCTA && (
          <div className="relative mb-12 overflow-hidden rounded-3xl p-12" style={{ background: 'linear-gradient(135deg, var(--color-text-primary, #0A1628), var(--color-text-primary, #121F33))' }}>
            <div
              className="pointer-events-none absolute -top-20 right-0 h-[400px] w-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, var(--color-primary-glow), transparent 70%)' }}
            />

            <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
              <div>
                <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-white/50">
                  <Building className="h-[13px] w-[13px]" />
                  Enterprise
                </div>
                <h2 className="mb-1.5 font-heading text-[26px] font-extrabold text-white">
                  {enterpriseCTA.title}
                </h2>
                <p className="max-w-[480px] text-[15px] leading-normal text-white/40">
                  {enterpriseCTA.description}
                </p>
                {enterpriseCTA.features && (
                  <div className="mt-3.5 flex flex-wrap gap-4">
                    {enterpriseCTA.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[13px] text-white/50">
                        <CheckCircle className="h-3.5 w-3.5 text-[var(--color-primary-light)]" />
                        {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {enterpriseCTA.primaryButtonHref && (
                  <Link
                    href={enterpriseCTA.primaryButtonHref}
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-[var(--border-radius,12px)] bg-[var(--color-primary)] px-7 py-3.5 font-heading text-[15px] font-extrabold text-white no-underline transition-all hover:bg-white hover:text-[var(--color-primary)]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {enterpriseCTA.primaryButtonLabel || 'Neem contact op'}
                  </Link>
                )}
                {enterpriseCTA.secondaryButtonHref && (
                  <Link
                    href={enterpriseCTA.secondaryButtonHref}
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-[var(--border-radius,12px)] border-[1.5px] border-white/15 bg-transparent px-7 py-3.5 font-heading text-[15px] font-extrabold text-white no-underline transition-all hover:border-white"
                  >
                    <Calendar className="h-4 w-4" />
                    {enterpriseCTA.secondaryButtonLabel || 'Plan een demo'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
