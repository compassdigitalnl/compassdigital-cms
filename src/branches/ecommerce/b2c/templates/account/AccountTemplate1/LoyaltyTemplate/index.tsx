'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import {
  LoyaltyHero,
  LoyaltyStats,
  EarnPointsGrid,
  RewardsCatalog,
  LoyaltyActivity,
  ReferralSection,
} from '@/branches/ecommerce/b2c/components/account/loyalty'
import type { LoyaltyTemplateProps, EarnWay } from './types'

const DEFAULT_EARN_WAYS: EarnWay[] = [
  {
    id: 'purchase',
    icon: '🛒',
    name: 'Bestellingen',
    description: 'Verdien bij elke aankoop',
    points: '1pt per €1',
    bgColor: 'teal',
  },
  {
    id: 'review',
    icon: '⭐',
    name: 'Review schrijven',
    description: 'Deel je ervaring',
    points: 50,
    bgColor: 'purple',
  },
  {
    id: 'referral',
    icon: '👥',
    name: 'Vriend doorverwijzen',
    description: 'Voor jou én je vriend',
    points: 250,
    bgColor: 'blue',
  },
  {
    id: 'birthday',
    icon: '🎂',
    name: 'Verjaardagsbonus',
    description: 'Jaarlijkse bonus',
    points: 500,
    bgColor: 'green',
  },
  {
    id: 'app',
    icon: '📱',
    name: 'App downloaden',
    description: 'Eenmalige beloning',
    points: 100,
    bgColor: 'amber',
  },
  {
    id: 'newsletter',
    icon: '🔔',
    name: 'Nieuwsbrief',
    description: 'Blijf op de hoogte',
    points: 25,
    bgColor: 'coral',
  },
]

export default function LoyaltyTemplate({
  loyaltyData,
  transactions,
  rewards,
  earnWays = DEFAULT_EARN_WAYS,
  onRedeemReward,
}: LoyaltyTemplateProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyReferralCode = () => {
    const textToCopy = loyaltyData.referralUrl || loyaltyData.referralCode
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRedeemReward = (rewardId: number, pointsCost: number) => {
    if (onRedeemReward) {
      onRedeemReward(rewardId, pointsCost)
      return
    }
    // Default fallback (should not reach here if page passes onRedeemReward)
    return
  }

  return (
    <div className="space-y-0">
      {/* Page Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/account/"
            className="text-grey-mid hover:text-grey-dark transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-navy">
            Loyalty Programma
          </h1>
        </div>
        <p className="text-sm text-grey-mid ml-8">
          Verdien punten, bereik hogere tiers en wissel beloningen in
        </p>
      </div>

      {/* Hero card with points + tier + progress */}
      <LoyaltyHero loyaltyData={loyaltyData} />

      {/* Stats grid */}
      <LoyaltyStats stats={loyaltyData.stats} />

      {/* Ways to earn */}
      <EarnPointsGrid earnWays={earnWays} />

      {/* Rewards catalog */}
      <RewardsCatalog
        rewards={rewards}
        availablePoints={loyaltyData.availablePoints}
        onRedeemReward={handleRedeemReward}
      />

      {/* Activity feed */}
      <LoyaltyActivity transactions={transactions} />

      {/* Referral section */}
      <ReferralSection
        referralCode={loyaltyData.referralCode}
        referralUrl={loyaltyData.referralUrl}
        referralCount={loyaltyData.stats.referrals}
        referralPointsEarned={loyaltyData.referralPointsEarned}
        referralActiveUsers={loyaltyData.referralActiveUsers}
        onCopyCode={handleCopyReferralCode}
        copied={copied}
      />
    </div>
  )
}
