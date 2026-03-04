'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronLeft, TrendingUp, XCircle } from 'lucide-react'
import {
  CurrentPlanCard,
  UsageMeters,
  BillingHistory,
} from '@/branches/ecommerce/components/account/subscriptions'
import type { SubscriptionsTemplateProps } from './types'

export default function SubscriptionsTemplate({
  subscription,
  invoices,
  onCancelSubscription,
  onUpgradePlan,
  onAddAddon,
  onAddPaymentMethod,
}: SubscriptionsTemplateProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/account/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Abonnement</h1>
        </div>
        <p className="text-sm text-gray-600">Beheer je abonnement, gebruik en facturatie</p>
      </div>

      {/* Current Plan */}
      <CurrentPlanCard subscription={subscription} />

      {/* Usage Meters */}
      <UsageMeters usage={subscription.usage} />

      {/* Upgrade Suggestion */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-100/50 border border-teal-200 rounded-lg p-4 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm mb-0.5">Upgrade naar Enterprise</div>
          <div className="text-xs text-gray-600">
            Onbeperkte gebruikers, 500GB opslag, 1M API calls
          </div>
        </div>
        <button
          onClick={onUpgradePlan}
          className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-navy-900 transition-colors"
        >
          Upgrade
        </button>
      </div>

      {/* Add-ons */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Add-ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {subscription.addons.map((addon, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                {addon.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{addon.name}</div>
                <div className="text-xs text-gray-500">
                  Sinds {new Date(addon.since).toLocaleDateString('nl-NL')}
                </div>
              </div>
              <div className="font-mono font-bold text-sm">&euro;{addon.price}</div>
            </div>
          ))}
          <button
            onClick={onAddAddon}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all cursor-pointer"
          >
            + Add-on toevoegen
          </button>
        </div>
      </div>

      {/* Billing History */}
      <BillingHistory invoices={invoices} />

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Betaalmethoden</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className={`bg-white rounded-lg p-4 flex items-center gap-3 ${
              subscription.paymentMethod.isDefault
                ? 'border-2 border-teal-500'
                : 'border border-gray-200'
            }`}
          >
            <div className="w-11 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold flex-shrink-0">
              {subscription.paymentMethod.brand}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">
                {subscription.paymentMethod.brand} eindigt op {subscription.paymentMethod.last4}
              </div>
              <div className="text-xs text-gray-500">Verloopt 12/2027</div>
            </div>
            {subscription.paymentMethod.isDefault && (
              <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-bold rounded">
                Standaard
              </span>
            )}
          </div>
          <button
            onClick={onAddPaymentMethod}
            className="border border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all"
          >
            + Betaalmethode toevoegen
          </button>
        </div>
      </div>

      {/* Cancel Subscription */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <XCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm">Abonnement opzeggen</div>
          <div className="text-xs text-gray-500">
            Je blijft toegang houden tot het einde van de periode
          </div>
        </div>
        <button
          onClick={onCancelSubscription}
          className="px-4 py-2 border-2 border-red-500 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
        >
          Opzeggen
        </button>
      </div>
    </div>
  )
}
