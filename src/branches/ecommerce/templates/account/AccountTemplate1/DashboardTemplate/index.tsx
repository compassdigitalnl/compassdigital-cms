'use client'

import React from 'react'
import { features } from '@/lib/features'
import { DashboardStats, QuickActions, RecentOrders, OrderListsWidget, AddressesWidget } from '@/branches/ecommerce/components/account/dashboard'
import type { DashboardTemplateProps } from './types'

export default function DashboardTemplate({
  stats,
  recentOrders,
  orderLists,
  addresses,
}: DashboardTemplateProps) {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm lg:text-base text-gray-500">
          Welkom terug! Hier is een overzicht van je account.
        </p>
      </div>

      <DashboardStats stats={stats} />
      <QuickActions />
      <RecentOrders orders={recentOrders} />

      {/* Order Lists + Addresses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {features.orderLists && <OrderListsWidget orderLists={orderLists} />}
        {features.addresses && <AddressesWidget addresses={addresses} />}
      </div>
    </div>
  )
}
