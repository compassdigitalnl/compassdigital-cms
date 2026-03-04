'use client'

import React, { useState, useEffect } from 'react'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import OrderListsTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/OrderListsTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import type { OrderList } from '@/branches/ecommerce/templates/account/AccountTemplate1/OrderListsTemplate/types'

export default function OrderListsPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const [lists, setLists] = useState<OrderList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrderLists = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/order-lists')

      if (response.status === 401) {
        const currentPath = window.location.pathname
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
        return
      }

      if (!response.ok) throw new Error('Failed to fetch order lists')
      const data = await response.json()
      setLists(data.docs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderLists()
  }, [])

  const handleAddToCart = async (listId: string, listName: string) => {
    try {
      const response = await fetch(`/api/order-lists/${listId}/add-to-cart`, { method: 'POST' })
      if (!response.ok) throw new Error('Failed to add to cart')
      const data = await response.json()
      alert(data.message || `Alle producten uit "${listName}" toegevoegd aan winkelwagen`)
    } catch (err) {
      alert('Fout bij toevoegen aan winkelwagen')
      console.error(err)
    }
  }

  return (
    <OrderListsTemplate
      lists={lists}
      loading={loading}
      error={error}
      onRetry={fetchOrderLists}
      onAddToCart={handleAddToCart}
    />
  )
}
