import React from 'react'
import { Package, Truck, ClipboardList, Euro } from 'lucide-react'
import { features } from '@/lib/features'
import { AccountStatCard } from '@/branches/ecommerce/components/account/ui'
import type { DashboardStatsProps } from './types'

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {features.checkout && (
        <AccountStatCard
          icon={Package}
          value={stats.totalOrders}
          label="Totaal bestellingen"
          subtitle="Alle tijd"
        />
      )}
      {features.checkout && features.orderTracking && (
        <AccountStatCard
          icon={Truck}
          value={stats.ordersInTransit}
          label="Onderweg"
          subtitle="Track & trace"
          iconBg="rgba(245, 158, 11, 0.1)"
          iconColor="var(--color-warning)"
        />
      )}
      {features.orderLists && (
        <AccountStatCard
          icon={ClipboardList}
          value={stats.orderLists}
          label="Bestelformulieren"
          subtitle="Opgeslagen lijsten"
          iconBg="rgba(0, 200, 83, 0.1)"
          iconColor="var(--color-success)"
        />
      )}
      {features.checkout && (
        <AccountStatCard
          icon={Euro}
          value={stats.yearlySpend > 0 ? `€${stats.yearlySpend.toLocaleString('nl-NL')}` : '€0'}
          label="Dit jaar besteed"
          subtitle={`Totaal ${new Date().getFullYear()}`}
          iconBg="rgba(33,150,243,0.1)"
          iconColor="var(--color-info)"
        />
      )}
    </div>
  )
}
