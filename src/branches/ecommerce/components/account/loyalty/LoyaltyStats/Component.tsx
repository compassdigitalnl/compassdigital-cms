import React from 'react'
import { ShoppingBag, TrendingUp, Gift, Users } from 'lucide-react'
import { AccountStatCard } from '@/branches/ecommerce/components/account/ui'
import type { LoyaltyStatsProps } from './types'

export function LoyaltyStats({ stats }: LoyaltyStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <AccountStatCard
        icon={ShoppingBag}
        value={stats.totalOrders}
        label="Bestellingen"
        subtitle="Alle tijd"
      />
      <AccountStatCard
        icon={TrendingUp}
        value={`€${stats.totalSpentMoney.toLocaleString('nl-NL')}`}
        label="Totaal besteed"
        subtitle="Cumulatief"
        iconBg="rgba(33,150,243,0.1)"
        iconColor="var(--color-info, #2196F3)"
      />
      <AccountStatCard
        icon={Gift}
        value={stats.rewardsRedeemed}
        label="Beloningen"
        subtitle="Ingewisseld"
        iconBg="rgba(124,58,237,0.1)"
        iconColor="#7C3AED"
      />
      <AccountStatCard
        icon={Users}
        value={stats.referrals}
        label="Referrals"
        subtitle="Vrienden doorverwezen"
        iconBg="rgba(0,200,83,0.1)"
        iconColor="var(--color-success, #00C853)"
      />
    </div>
  )
}
