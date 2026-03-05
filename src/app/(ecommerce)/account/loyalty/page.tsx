'use client'

import React, { useState, useEffect } from 'react'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import LoyaltyTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/LoyaltyTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import type {
  LoyaltyData,
  LoyaltyTransaction,
  LoyaltyReward,
} from '@/branches/ecommerce/templates/account/AccountTemplate1/LoyaltyTemplate/types'

const EMPTY_LOYALTY: LoyaltyData = {
  availablePoints: 0,
  totalEarned: 0,
  totalSpent: 0,
  tier: {
    name: 'Bronze',
    icon: '🥉',
    color: 'amber',
    minPoints: 0,
    multiplier: 1,
    benefits: [],
  },
  nextTier: {
    name: 'Silver',
    icon: '🥈',
    requiredPoints: 1000,
    pointsNeeded: 1000,
  },
  referralCode: '',
  stats: {
    totalOrders: 0,
    totalSpentMoney: 0,
    rewardsRedeemed: 0,
    referrals: 0,
  },
}

export default function LoyaltyPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData>(EMPTY_LOYALTY)
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([])
  const [rewards, setRewards] = useState<LoyaltyReward[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/account/loyalty', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          if (data.loyaltyData) setLoyaltyData(data.loyaltyData)
          setTransactions(data.transactions || [])
          setRewards(data.rewards || [])
        }
      } catch (err) {
        console.error('Error fetching loyalty data:', err)
      }
    }
    fetchData()
  }, [])

  return (
    <LoyaltyTemplate
      loyaltyData={loyaltyData}
      transactions={transactions}
      rewards={rewards}
    />
  )
}
