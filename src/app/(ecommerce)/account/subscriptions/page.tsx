'use client'

import React, { useState } from 'react'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import SubscriptionsTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/SubscriptionsTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import type {
  Subscription,
  SubscriptionInvoice,
} from '@/branches/ecommerce/templates/account/AccountTemplate1/SubscriptionsTemplate/types'

export default function SubscriptionPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()

  // TODO: Replace with real subscription data from API
  const [subscription] = useState<Subscription>({
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
      storage: { current: 12.5, limit: 50 },
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

  const [invoices] = useState<SubscriptionInvoice[]>([
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

  const handleAddAddon = () => {
    // TODO: Implement add-on flow
    console.log('Adding addon...')
    alert('Add-on functionaliteit nog niet beschikbaar')
  }

  const handleAddPaymentMethod = () => {
    // TODO: Implement add payment method flow
    console.log('Adding payment method...')
    alert('Betaalmethode toevoegen nog niet beschikbaar')
  }

  return (
    <SubscriptionsTemplate
      subscription={subscription}
      invoices={invoices}
      onCancelSubscription={handleCancelSubscription}
      onUpgradePlan={handleUpgradePlan}
      onAddAddon={handleAddAddon}
      onAddPaymentMethod={handleAddPaymentMethod}
    />
  )
}
