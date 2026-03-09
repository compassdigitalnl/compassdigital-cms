'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import SubscriptionsTemplate from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/SubscriptionsTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/shared/contexts/AccountTemplateContext'
import { toast } from '@/lib/toast'
import type {
  Subscription,
  SubscriptionInvoice,
} from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/SubscriptionsTemplate/types'

const EMPTY_SUBSCRIPTION: Subscription = {
  plan: {
    name: 'Geen abonnement',
    price: 0,
    billingInterval: 'monthly',
    icon: '📦',
  },
  status: 'canceled',
  currentPeriodStart: '',
  currentPeriodEnd: '',
  usage: {
    users: { current: 0, limit: 0 },
    storage: { current: 0, limit: 0 },
    apiCalls: { current: 0, limit: 0 },
  },
  addons: [],
  paymentMethod: {
    type: '',
    brand: '',
    last4: '',
    isDefault: false,
  },
}

export default function SubscriptionPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription>(EMPTY_SUBSCRIPTION)
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([])

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/account/subscriptions', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.subscription) setSubscription(data.subscription)
        setInvoices(data.invoices || [])
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCancelSubscription = async () => {
    if (!confirm('Weet je zeker dat je je abonnement wilt opzeggen? Je blijft toegang houden tot het einde van de huidige periode.')) return
    try {
      const res = await fetch('/api/account/subscriptions/cancel', {
        method: 'POST',
        credentials: 'include',
      })
      if (res.ok) {
        fetchData()
      } else {
        toast.error('Opzeggen mislukt. Probeer het later opnieuw.')
      }
    } catch {
      toast.error('Er is iets misgegaan')
    }
  }

  const handleUpgradePlan = () => {
    toast.info('Neem contact op met ons verkoopteam voor upgradeopties')
    router.push('/contact')
  }

  const handleAddAddon = () => {
    toast.info('Neem contact op met ons verkoopteam voor add-on opties')
    router.push('/contact')
  }

  const handleAddPaymentMethod = () => {
    toast.info('Neem contact op met ons om een betaalmethode toe te voegen')
    router.push('/contact')
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
