'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  Award,
  TrendingUp,
  Gift,
  ShoppingBag,
  Star,
  Users,
  Truck,
  Zap,
  Copy,
  Check,
} from 'lucide-react'

export default function LoyaltyPage() {
  const [copied, setCopied] = useState(false)

  // TODO: Replace with real loyalty data from API
  const [loyaltyData] = useState({
    availablePoints: 2450,
    totalEarned: 4200,
    totalSpent: 1750,
    tier: {
      name: 'Gold',
      icon: '🥇',
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
    stats: {
      totalOrders: 42,
      totalSpentMoney: 4850,
      rewardsRedeemed: 7,
      referrals: 3,
    },
  })

  const [transactions] = useState([
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

  const [rewards] = useState([
    {
      id: 1,
      name: '€5 korting',
      icon: '🏷️',
      type: 'discount',
      pointsCost: 500,
      value: 5,
    },
    {
      id: 2,
      name: 'Gratis verzending',
      icon: '🚚',
      type: 'shipping',
      pointsCost: 300,
      value: null,
    },
    {
      id: 3,
      name: '€10 korting',
      icon: '🎁',
      type: 'discount',
      pointsCost: 1000,
      value: 10,
    },
    {
      id: 4,
      name: 'VIP Event toegang',
      icon: '🎫',
      type: 'event',
      pointsCost: 2000,
      value: null,
    },
  ])

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(loyaltyData.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRedeemReward = (rewardId: number, pointsCost: number) => {
    // TODO: Implement redeem reward API call
    if (loyaltyData.availablePoints < pointsCost) {
      alert('Je hebt niet genoeg punten voor deze beloning')
      return
    }
    if (confirm(`Wil je deze beloning inwisselen voor ${pointsCost} punten?`)) {
      console.log(`Redeeming reward ${rewardId}`)
      alert('Beloning ingewisseld!')
    }
  }

  const progressPercentage = Math.min(
    ((loyaltyData.totalEarned - loyaltyData.tier.minPoints) /
      (loyaltyData.nextTier.requiredPoints - loyaltyData.tier.minPoints)) *
      100,
    100,
  )

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
          <h1 className="text-2xl font-bold">Loyalty Programma</h1>
        </div>
        <p className="text-sm text-gray-600">
          Verzamel punten, verdien beloningen en ontgrendel exclusieve voordelen
        </p>
      </div>

      {/* Points Card */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm opacity-90 mb-1">Beschikbare punten</div>
            <div className="text-4xl font-bold">{loyaltyData.availablePoints.toLocaleString()}</div>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl">
            {loyaltyData.tier.icon}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="opacity-90">Tier:</span> <span className="font-bold">{loyaltyData.tier.name}</span>
            <span className="mx-2">•</span>
            <span className="opacity-90">{loyaltyData.tier.multiplier}x multiplier</span>
          </div>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">
            Voortgang naar {loyaltyData.nextTier.name}
          </h3>
          <span className="text-sm text-gray-600">
            {loyaltyData.nextTier.pointsNeeded} punten te gaan
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{loyaltyData.tier.name}</span>
          <span>{loyaltyData.nextTier.name}</span>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="font-bold mb-4">Jouw {loyaltyData.tier.name} voordelen</h3>
        <div className="grid grid-cols-2 gap-3">
          {loyaltyData.tier.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs">Bestellingen</span>
          </div>
          <div className="text-2xl font-bold">{loyaltyData.stats.totalOrders}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Uitgegeven</span>
          </div>
          <div className="text-2xl font-bold">€{loyaltyData.stats.totalSpentMoney}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Gift className="w-4 h-4" />
            <span className="text-xs">Beloningen</span>
          </div>
          <div className="text-2xl font-bold">{loyaltyData.stats.rewardsRedeemed}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs">Referrals</span>
          </div>
          <div className="text-2xl font-bold">{loyaltyData.stats.referrals}</div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold mb-1">Nodig vrienden uit</div>
              <div className="text-sm text-gray-600">
                Verdien 100 punten voor elke vriend die zich aanmeldt met jouw code
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono font-bold">
              {loyaltyData.referralCode}
            </div>
            <button
              onClick={handleCopyReferralCode}
              className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-navy-900 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Gekopieerd!' : 'Kopieer'}
            </button>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-teal-600" />
          Beschikbare beloningen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-2xl">
                    {reward.icon}
                  </div>
                  <div>
                    <div className="font-bold">{reward.name}</div>
                    {reward.value && (
                      <div className="text-xs text-gray-500">Waarde: €{reward.value}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-mono font-bold text-teal-600">{reward.pointsCost} punten</div>
                <button
                  onClick={() => handleRedeemReward(reward.id, reward.pointsCost)}
                  className="px-3 py-1.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-navy-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loyaltyData.availablePoints < reward.pointsCost}
                >
                  Inwisselen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold">Recente transacties</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.points > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {transaction.type.startsWith('earned') ? (
                    <TrendingUp className={`w-5 h-5 ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`} />
                  ) : (
                    <Gift className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm">{transaction.description}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString('nl-NL')}
                  </div>
                </div>
              </div>
              <div className={`font-mono font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.points > 0 ? '+' : ''}{transaction.points}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
