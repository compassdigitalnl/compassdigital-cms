'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import OrderListsTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/OrderListsTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { toast } from '@/lib/toast'
import type { OrderList } from '@/branches/ecommerce/templates/account/AccountTemplate1/OrderListsTemplate/types'

export default function OrderListsPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const router = useRouter()
  const { addGroupedItems } = useCart()
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

  const handleAddToCart = (listId: string, listName: string) => {
    const list = lists.find((l) => l.id === listId)
    if (!list || list.items.length === 0) return
    const cartItems = list.items.map((item) => ({
      id: item.product.id,
      slug: item.product.name,
      title: item.product.name,
      price: item.product.price,
      quantity: item.defaultQuantity,
      stock: 9999,
    }))
    addGroupedItems(cartItems)
    toast.success(
      `${list.items.length} producten toegevoegd`,
      `Alle producten uit "${listName}" zijn aan je winkelwagen toegevoegd`,
    )
  }

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Weet je zeker dat je deze lijst wilt verwijderen?')) return
    try {
      const response = await fetch(`/api/order-lists/${listId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete list')
      setLists((prev) => prev.filter((l) => l.id !== listId))
      toast.success('Lijst verwijderd')
    } catch (err) {
      console.error('Failed to delete list:', err)
      toast.error('Fout bij verwijderen lijst')
    }
  }

  const handleDuplicateList = async (listId: string) => {
    const list = lists.find((l) => l.id === listId)
    if (!list) return
    try {
      const response = await fetch('/api/order-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${list.name} (kopie)`,
          icon: list.icon,
          color: list.color,
          items: list.items.map((item) => ({
            product: item.product.id,
            defaultQuantity: item.defaultQuantity,
            notes: item.notes || '',
          })),
        }),
      })
      if (!response.ok) throw new Error('Failed to duplicate list')
      toast.success('Lijst gedupliceerd')
      await fetchOrderLists()
    } catch (err) {
      console.error('Failed to duplicate list:', err)
      toast.error('Fout bij dupliceren lijst')
    }
  }

  const handleTogglePin = async (listId: string) => {
    const list = lists.find((l) => l.id === listId)
    if (!list) return
    try {
      const response = await fetch(`/api/order-lists/${listId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !list.isPinned }),
      })
      if (!response.ok) throw new Error('Failed to toggle pin')
      setLists((prev) =>
        prev.map((l) => (l.id === listId ? { ...l, isPinned: !l.isPinned } : l)),
      )
      toast.success(list.isPinned ? 'Lijst losgemaakt' : 'Lijst vastgepind')
    } catch (err) {
      console.error('Failed to toggle pin:', err)
      toast.error('Fout bij vastpinnen lijst')
    }
  }

  return (
    <OrderListsTemplate
      lists={lists}
      loading={loading}
      error={error}
      onRetry={fetchOrderLists}
      onAddToCart={handleAddToCart}
      onDeleteList={handleDeleteList}
      onDuplicateList={handleDuplicateList}
      onTogglePin={handleTogglePin}
    />
  )
}
