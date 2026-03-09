'use client'

import React, { useState, useEffect } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { useAccountTemplate } from '@/branches/ecommerce/shared/contexts/AccountTemplateContext'
import DashboardTemplate from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/DashboardTemplate'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import type { DashboardStats, DashboardOrder, DashboardAddress } from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/DashboardTemplate/types'

export default function MyAccountPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const { user, isLoading: authLoading } = useAccountAuth()
  const [stats, setStats] = useState<DashboardStats>({ totalOrders: 0, ordersInTransit: 0, orderLists: 0, yearlySpend: 0 })
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([])
  const [orderLists, setOrderLists] = useState<any[]>([])
  const [addresses, setAddresses] = useState<DashboardAddress[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [ordersRes, listsRes, addressesRes] = await Promise.allSettled([
          fetch('/api/account/orders?limit=3', { credentials: 'include' }),
          fetch('/api/order-lists', { credentials: 'include' }),
          fetch('/api/account/addresses', { credentials: 'include' }),
        ])

        // Orders
        if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
          const data = await ordersRes.value.json()
          setRecentOrders(
            (data.docs || []).map((o: any) => ({
              id: o.id,
              orderNumber: o.orderNumber,
              date: o.createdAt,
              status: o.status,
              statusLabel: o.status,
              total: o.total || 0,
              items: o.items || [],
              trackingUrl: o.trackingUrl,
            })),
          )
          setStats((prev) => ({
            ...prev,
            totalOrders: data.totalDocs || 0,
          }))
        }

        // Order lists
        if (listsRes.status === 'fulfilled' && listsRes.value.ok) {
          const data = await listsRes.value.json()
          setOrderLists(data.docs || [])
          setStats((prev) => ({
            ...prev,
            orderLists: data.totalDocs || 0,
          }))
        }

        // Addresses
        if (addressesRes.status === 'fulfilled' && addressesRes.value.ok) {
          const data = await addressesRes.value.json()
          setAddresses(
            (data.docs || []).map((a: any) => ({
              id: a.id || a._id || String(Math.random()),
              type: a.type || 'shipping',
              typeLabel: a.type === 'billing' ? 'Factuuradres' : 'Bezorgadres',
              isDefault: a.isPrimary || a.isDefault || false,
              name: a.company || `${a.firstName || ''} ${a.lastName || ''}`.trim(),
              street: `${a.street || ''} ${a.houseNumber || ''}`.trim(),
              postalCode: a.postalCode || '',
              city: a.city || '',
              country: a.country || 'Nederland',
            })),
          )
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err)
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (authLoading || !user) {
    return <AccountLoadingSkeleton variant="page" />
  }

  if (dataLoading) {
    return <AccountLoadingSkeleton variant="page" />
  }

  return (
    <DashboardTemplate
      user={user}
      stats={stats}
      recentOrders={recentOrders}
      orderLists={orderLists}
      addresses={addresses}
    />
  )
}
