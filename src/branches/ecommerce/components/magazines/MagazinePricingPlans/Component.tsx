'use client'

import React from 'react'
import Link from 'next/link'
import {
  Check, X, Star, ShieldCheck, RotateCcw, Zap, Lock, BookOpen, CreditCard,
} from 'lucide-react'
import type { MagazinePricingPlansProps, SubscriptionPlan } from './types'

const PERIOD_LABELS: Record<string, string> = {
  monthly: 'per maand',
  quarterly: 'per kwartaal',
  biannual: 'per halfjaar',
  yearly: 'per jaar',
  once: 'eenmalig',
}

const TRUST_ICONS: Record<string, React.FC<any>> = {
  Zap, ShieldCheck, RotateCcw, Lock,
}

function PlanCard({ plan, magazineSlug }: { plan: SubscriptionPlan; magazineSlug: string }) {
  const isHighlighted = plan.highlighted
  const href = plan.externalUrl || `/abonneren/${magazineSlug}?plan=${plan.id}`

  return (
    <div
      className={`
        relative flex flex-col rounded-[18px] border-2 p-6 transition-all duration-200
        ${isHighlighted
          ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)] shadow-[0_8px_32px_var(--color-primary-glow)]'
          : 'border-[var(--color-border,#E8ECF1)] bg-white'
        }
      `}
    >
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-4 py-1 text-xs font-bold text-white">
          <Star className="mr-1 inline h-3 w-3" />
          Populairste keuze
        </div>
      )}

      <div className="mb-4 text-center">
        <h3
          className={`font-heading text-lg font-extrabold ${isHighlighted ? 'text-[var(--color-primary)]' : 'text-theme-text'}`}
          style={{ letterSpacing: '-0.01em' }}
        >
          {plan.name}
        </h3>
        {plan.description && (
          <p className="mt-1 text-sm text-theme-text-secondary">{plan.description}</p>
        )}
      </div>

      <div className="mb-5 text-center">
        <span className="font-heading text-[36px] font-extrabold leading-none text-theme-text">
          &euro;{plan.price.toFixed(2).replace('.', ',')}
        </span>
        <span className="ml-1 text-sm text-theme-text-muted">{PERIOD_LABELS[plan.period] || ''}</span>
        {plan.editions && (
          <div className="mt-1 text-xs text-theme-text-muted">{plan.editions} edities</div>
        )}
      </div>

      {plan.features && plan.features.length > 0 && (
        <ul className="mb-6 flex flex-col gap-2.5">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              {feature.included ? (
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-success,#00C853)]" />
              ) : (
                <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-theme-text-muted" />
              )}
              <span className={feature.included ? 'text-theme-text' : 'text-theme-text-muted line-through'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto">
        <Link
          href={href}
          className={`
            block w-full rounded-xl py-3.5 text-center text-[15px] font-bold no-underline transition-all duration-200
            ${isHighlighted
              ? 'bg-[var(--color-primary)] text-white shadow-[0_4px_16px_var(--color-primary-glow)] hover:opacity-90'
              : 'border-2 border-[var(--color-border,#E8ECF1)] bg-white text-theme-text hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }
          `}
        >
          {plan.name} bestellen
        </Link>
      </div>
    </div>
  )
}

export const MagazinePricingPlans: React.FC<MagazinePricingPlansProps> = ({
  magazineName,
  magazineSlug,
  plans,
  trustItems = [],
  className = '',
}) => {
  if (!plans || plans.length === 0) return null

  return (
    <section className={className} id="abonnementen">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary-glow)] bg-[var(--color-primary-glow)] px-3.5 py-1.5 text-xs font-bold text-[var(--color-primary)]">
          <CreditCard className="h-3.5 w-3.5" />
          Abonnementen
        </div>
        <h2
          className="font-heading text-[26px] font-extrabold text-theme-text md:text-[30px]"
          style={{ letterSpacing: '-0.02em' }}
        >
          Word {magazineName} abonnee
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-base text-theme-text-secondary">
          Kies het abonnement dat bij je past en ontvang {magazineName} thuis.
        </p>
      </div>

      <div
        className={`mx-auto grid gap-5 ${
          plans.length === 1 ? 'max-w-sm grid-cols-1'
            : plans.length === 2 ? 'max-w-2xl grid-cols-1 md:grid-cols-2'
              : 'max-w-4xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} magazineSlug={magazineSlug} />
        ))}
      </div>

      {trustItems.length > 0 && (
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {trustItems.map((item, i) => {
            const TrustIcon = item.icon ? TRUST_ICONS[item.icon] : ShieldCheck
            return (
              <div key={i} className="flex items-center gap-1.5 text-xs text-theme-text-muted">
                {TrustIcon && <TrustIcon className="h-3.5 w-3.5 text-[var(--color-success,#00C853)]" />}
                {item.text}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
