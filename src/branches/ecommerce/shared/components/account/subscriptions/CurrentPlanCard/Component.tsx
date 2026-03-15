import React from 'react'
import type { CurrentPlanCardProps } from './types'

export function CurrentPlanCard({ subscription }: CurrentPlanCardProps) {
  const { plan, status, currentPeriodEnd, paymentMethod } = subscription

  const statusLabel = status === 'active' ? 'Actief' : status === 'trialing' ? 'Proefperiode' : status

  return (
    <div className="bg-white border border-grey-light rounded-xl overflow-hidden mb-6">
      {/* Plan header */}
      <div className="p-6 border-b border-grey-light">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--color-primary-glow)] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            {plan.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                {statusLabel}
              </span>
            </div>
            <p className="text-sm text-grey-dark mt-0.5">
              &euro;{plan.price}/maand &middot; Verlengt op{' '}
              {new Date(currentPeriodEnd).toLocaleDateString('nl-NL')}
            </p>
          </div>
        </div>
      </div>

      {/* Billing info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-grey-light">
        <div className="p-4">
          <div className="text-xs text-grey-mid mb-1">Volgende betaling</div>
          <div className="font-bold text-sm">
            {new Date(currentPeriodEnd).toLocaleDateString('nl-NL')}
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs text-grey-mid mb-1">Bedrag</div>
          <div className="font-bold text-sm">&euro;{plan.price}</div>
          <div className="text-xs text-grey-mid">per maand</div>
        </div>
        <div className="p-4">
          <div className="text-xs text-grey-mid mb-1">Betaalmethode</div>
          <div className="font-bold text-sm">
            {paymentMethod.brand} &middot;&middot;&middot;&middot; {paymentMethod.last4}
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs text-grey-mid mb-1">Verlenging</div>
          <div className="font-bold text-sm text-green">Automatisch</div>
        </div>
      </div>
    </div>
  )
}
