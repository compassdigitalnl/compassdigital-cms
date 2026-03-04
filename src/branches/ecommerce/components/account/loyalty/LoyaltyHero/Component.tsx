'use client'

import React from 'react'
import { Crown } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { LoyaltyHeroProps } from './types'

export function LoyaltyHero({ loyaltyData }: LoyaltyHeroProps) {
  const { formatPriceStr } = usePriceMode()
  const { availablePoints, totalEarned, tier, nextTier } = loyaltyData

  const progressPercentage = Math.min(
    ((totalEarned - tier.minPoints) / (nextTier.requiredPoints - tier.minPoints)) * 100,
    100,
  )

  return (
    <div className="rounded-2xl p-6 lg:p-7 mb-4 relative overflow-hidden text-white"
      style={{ background: 'linear-gradient(135deg, var(--color-navy, #0A1628), #121F33)' }}
    >
      {/* Decorative star watermark */}
      <div className="absolute right-10 top-2 text-8xl opacity-[0.04] select-none pointer-events-none">
        ⭐
      </div>

      {/* Top: avatar + tier + name */}
      <div className="flex items-center gap-4 lg:gap-5 mb-5 relative">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border-2 border-white/20"
          style={{ background: 'linear-gradient(135deg, #D4A843, #E8C968)' }}
        >
          {tier.icon}
        </div>
        <div>
          <div
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold mb-1"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: '#D4A843',
            }}
          >
            <Crown className="w-3 h-3" />
            {tier.name} Member
          </div>
          <div className="text-lg lg:text-xl font-extrabold">{tier.name} Tier</div>
        </div>
      </div>

      {/* Balance row */}
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 relative mb-5">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase mb-1 text-white/35">
            Beschikbare punten
          </div>
          <div className="text-4xl font-extrabold leading-none">
            {availablePoints.toLocaleString('nl-NL')}
          </div>
          <div className="text-xs text-white/30 mt-1">
            ≈ €{formatPriceStr(availablePoints / 100)} aan beloningen
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase mb-1 text-white/35">
            Totaal verdiend
          </div>
          <div className="text-4xl font-extrabold leading-none">
            {totalEarned.toLocaleString('nl-NL')}
          </div>
          <div className="text-xs text-white/30 mt-1">{tier.multiplier}× punten multiplier</div>
        </div>
      </div>

      {/* Tier progress bar */}
      <div className="relative">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPercentage}%`,
              background: 'linear-gradient(90deg, var(--color-primary, #00897B), #D4A843)',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <span style={{ color: '#D4A843' }}>● {tier.name} — {totalEarned.toLocaleString('nl-NL')} pts</span>
          <span>{nextTier.name} — {nextTier.requiredPoints.toLocaleString('nl-NL')} pts →</span>
        </div>
        <div className="text-center text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Nog {nextTier.pointsNeeded.toLocaleString('nl-NL')} punten tot {nextTier.name}
        </div>
      </div>
    </div>
  )
}
