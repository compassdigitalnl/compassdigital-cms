'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  CreditCard,
  Users,
  HardDrive,
  Zap,
  TrendingUp,
  Download,
  AlertTriangle,
  XCircle,
} from 'lucide-react'

export default function SubscriptionPage() {
  // TODO: Replace with real subscription data from API
  const [subscription, setSubscription] = useState({
    plan: {
      name: 'Professional',
      price: 49,
      billingInterval: 'monthly',
      icon: '💼',
    },
    status: 'active',
    currentPeriodStart: '2026-02-01',
    currentPeriodEnd: '2026-03-01',
    usage: {
      users: { current: 3, limit: 5 },
      storage: { current: 12.5, limit: 50 }, // GB
      apiCalls: { current: 45000, limit: 100000 },
    },
    addons: [
      { name: 'Extra Storage', icon: '💾', price: 9, since: '2026-01-15' },
      { name: 'Priority Support', icon: '🎧', price: 19, since: '2026-01-01' },
    ],
    paymentMethod: {
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      isDefault: true,
    },
  })

  const [invoices] = useState([
    {
      id: 1,
      date: '2026-02-01',
      description: 'Professional plan — February 2026',
      amount: 77,
      status: 'paid',
    },
    {
      id: 2,
      date: '2026-01-01',
      description: 'Professional plan — January 2026',
      amount: 77,
      status: 'paid',
    },
  ])

  const calculatePercentage = (current: number, limit: number) => {
    return Math.min(Math.round((current / limit) * 100), 100)
  }

  const handleCancelSubscription = () => {
    // TODO: Implement cancel subscription API call
    if (
      confirm(
        'Weet je zeker dat je je abonnement wilt opzeggen? Je blijft toegang houden tot het einde van de huidige periode.',
      )
    ) {
      console.log('Canceling subscription...')
      alert('Abonnement opgezegd')
    }
  }

  const handleUpgradePlan = () => {
    // TODO: Implement upgrade plan flow
    console.log('Upgrading plan...')
    alert('Upgrade functionaliteit nog niet beschikbaar')
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/my-account"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Abonnement</h1>
        </div>
        <p className="text-sm text-gray-600">
          Beheer je abonnement, gebruik en facturatie
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl">
                {subscription.plan.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{subscription.plan.name}</h2>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                    {subscription.status === 'active' ? 'Actief' : 'Proefperiode'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  €{subscription.plan.price}/maand · Verlengt op{' '}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString('nl-NL')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-1">Volgende betaling</div>
            <div className="font-bold">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString('nl-NL')}
            </div>
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-1">Bedrag</div>
            <div className="font-bold">€{subscription.plan.price}</div>
            <div className="text-xs text-gray-500">per maand</div>
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-1">Betaalmethode</div>
            <div className="font-bold">
              {subscription.paymentMethod.brand} ···· {subscription.paymentMethod.last4}
            </div>
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-1">Verlenging</div>
            <div className="font-bold text-green-600">Automatisch</div>
          </div>
        </div>
      </div>

      {/* Usage Meters */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          Gebruik
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Users */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Users className="w-4 h-4 text-teal-600" />
                Gebruikers
              </div>
              <div className="text-xs font-mono font-bold">
                {calculatePercentage(
                  subscription.usage.users.current,
                  subscription.usage.users.limit,
                )}
                %
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{
                  width: `${calculatePercentage(subscription.usage.users.current, subscription.usage.users.limit)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{subscription.usage.users.current} gebruikt</span>
              <span>{subscription.usage.users.limit} limiet</span>
            </div>
          </div>

          {/* Storage */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-sm font-bold">
                <HardDrive className="w-4 h-4 text-teal-600" />
                Opslag
              </div>
              <div className="text-xs font-mono font-bold">
                {calculatePercentage(
                  subscription.usage.storage.current,
                  subscription.usage.storage.limit,
                )}
                %
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{
                  width: `${calculatePercentage(subscription.usage.storage.current, subscription.usage.storage.limit)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{subscription.usage.storage.current} GB</span>
              <span>{subscription.usage.storage.limit} GB</span>
            </div>
          </div>

          {/* API Calls */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Zap className="w-4 h-4 text-teal-600" />
                API Calls
              </div>
              <div className="text-xs font-mono font-bold">
                {calculatePercentage(
                  subscription.usage.apiCalls.current,
                  subscription.usage.apiCalls.limit,
                )}
                %
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{
                  width: `${calculatePercentage(subscription.usage.apiCalls.current, subscription.usage.apiCalls.limit)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{subscription.usage.apiCalls.current.toLocaleString()}</span>
              <span>{subscription.usage.apiCalls.limit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

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
          onClick={handleUpgradePlan}
          className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-navy-900 transition-colors flex items-center gap-2"
        >
          <span>Upgrade</span>
        </button>
      </div>

      {/* Add-ons */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Add-ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {subscription.addons.map((addon, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                {addon.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{addon.name}</div>
                <div className="text-xs text-gray-500">
                  Sinds {new Date(addon.since).toLocaleDateString('nl-NL')}
                </div>
              </div>
              <div className="font-mono font-bold text-sm">€{addon.price}</div>
            </div>
          ))}
          <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all cursor-pointer">
            <span>+ Add-on toevoegen</span>
          </button>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="mb-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-600" />
              Recente facturen
            </h3>
            <Link href="/my-account/invoices" className="text-xs font-semibold text-teal-600 hover:underline">
              Alles bekijken
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500">
                <tr>
                  <th className="p-3 text-left">Datum</th>
                  <th className="p-3 text-left">Beschrijving</th>
                  <th className="p-3 text-right">Bedrag</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-200 last:border-0">
                    <td className="p-3 font-semibold">
                      {new Date(invoice.date).toLocaleDateString('nl-NL')}
                    </td>
                    <td className="p-3 text-gray-600">{invoice.description}</td>
                    <td className="p-3 text-right font-mono font-bold">€{invoice.amount}</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                        Betaald
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href="#"
                        className="text-teal-600 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Betaalmethoden</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white border-2 border-teal-500 rounded-lg p-4 flex items-center gap-3">
            <div className="w-11 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">
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
          <button className="border border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all">
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
          onClick={handleCancelSubscription}
          className="px-4 py-2 border-2 border-red-500 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
        >
          Opzeggen
        </button>
      </div>
    </div>
  )
}
