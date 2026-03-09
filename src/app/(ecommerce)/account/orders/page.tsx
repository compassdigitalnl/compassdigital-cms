'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import OrdersTemplate from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/OrdersTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/shared/contexts/AccountTemplateContext'
import type { OrderListItem } from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/OrdersTemplate/types'

export default function OrdersPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const { user, isLoading: authLoading } = useAccountAuth()
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/account/orders?${params}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setOrders(
          (data.docs || []).map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            createdAt: o.createdAt,
            status: o.status,
            total: o.total || 0,
            items: o.items,
          })),
        )
        setTotalDocs(data.totalDocs || 0)
        setTotalPages(data.totalPages || 1)
        setHasNextPage(data.hasNextPage || false)
        setHasPrevPage(data.hasPrevPage || false)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user, page, statusFilter, searchQuery])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    setPage(1)
  }

  return (
    <OrdersTemplate
      orders={orders}
      totalDocs={totalDocs}
      totalPages={totalPages}
      page={page}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      onPageChange={setPage}
      onStatusFilter={handleStatusFilter}
      onSearch={handleSearch}
      statusFilter={statusFilter}
      searchQuery={searchQuery}
      isLoading={authLoading || isLoading}
    />
  )
}
