'use client'

import React, { useState } from 'react'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import LoyaltyTemplate from '@/branches/ecommerce/templates/account/LoyaltyTemplate'
import type {
  LoyaltyData,
  LoyaltyTransaction,
  LoyaltyReward,
} from '@/branches/ecommerce/templates/account/LoyaltyTemplate/types'

export default function LoyaltyPage() {
  if (!isFeatureEnabled('shop')) notFound()

  // TODO: Replace with real loyalty data from API
  const [loyaltyData] = useState<LoyaltyData>({
    availablePoints: 2450,
    totalEarned: 4200,
    totalSpent: 1750,
    tier: {
      name: 'Gold',
      icon: '👑',
      color: 'amber',
      minPoints: 2000,
      multiplier: 1.5,
      benefits: [
        'Gratis verzending',
        'Priority support',
        '15% korting op nieuwe producten',
        'Early access tot sales',
      ],
    },
    nextTier: {
      name: 'Platinum',
      icon: '💎',
      requiredPoints: 5000,
      pointsNeeded: 550,
    },
    referralCode: 'MARK2024',
    referralPointsEarned: 750,
    referralActiveUsers: 2,
    stats: {
      totalOrders: 42,
      totalSpentMoney: 4850,
      rewardsRedeemed: 7,
      referrals: 3,
    },
  })

  const [transactions] = useState<LoyaltyTransaction[]>([
    {
      id: 1,
      type: 'earned_purchase',
      points: 150,
      description: 'Aankoop bestelling #DS-2026-0847',
      createdAt: '2026-02-15',
    },
    {
      id: 2,
      type: 'earned_review',
      points: 50,
      description: 'Product review geschreven',
      createdAt: '2026-02-10',
    },
    {
      id: 3,
      type: 'spent_reward',
      points: -200,
      description: '€10 korting ingewisseld',
      createdAt: '2026-02-05',
    },
    {
      id: 4,
      type: 'earned_referral',
      points: 100,
      description: 'Vriend doorverwezen',
      createdAt: '2026-02-01',
    },
  ])

  const [rewards] = useState<LoyaltyReward[]>([
    {
      id: 1,
      name: '€5 korting',
      icon: '🏷️',
      description: 'Op je volgende bestelling',
      type: 'discount',
      pointsCost: 500,
      value: 5,
    },
    {
      id: 2,
      name: 'Gratis verzending',
      icon: '🚚',
      description: 'Op je volgende bestelling',
      type: 'shipping',
      pointsCost: 300,
      value: null,
    },
    {
      id: 3,
      name: '€10 korting',
      icon: '🎁',
      description: 'Op je volgende bestelling',
      type: 'discount',
      pointsCost: 1000,
      value: 10,
    },
    {
      id: 4,
      name: 'VIP Event toegang',
      icon: '🎫',
      description: 'Exclusieve productlancering',
      type: 'event',
      pointsCost: 2000,
      value: null,
    },
  ])

  return (
    <LoyaltyTemplate
      loyaltyData={loyaltyData}
      transactions={transactions}
      rewards={rewards}
    />
  )
}
