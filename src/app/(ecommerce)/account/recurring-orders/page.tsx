'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import RecurringOrdersTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/RecurringOrdersTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'

export default function RecurringOrdersPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const { user, isLoading: authLoading } = useAccountAuth()
  const [recurringOrders, setRecurringOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/account/recurring-orders', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setRecurringOrders(data.docs || [])
      }
    } catch (err) {
      console.error('Error fetching recurring orders:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleTogglePause = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'pauzeren' : 'hervatten'
    if (!confirm(`Weet je zeker dat je deze terugkerende bestelling wilt ${action}?`)) return
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active'
      await fetch(`/api/account/recurring-orders/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      setRecurringOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      )
    } catch (err) {
      console.error('Error toggling recurring order:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze terugkerende bestelling wilt verwijderen?')) return
    try {
      await fetch(`/api/account/recurring-orders/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'deleted' }),
      })
      setRecurringOrders((prev) => prev.filter((o) => o.id !== id))
    } catch (err) {
      console.error('Error deleting recurring order:', err)
    }
  }

  return (
    <RecurringOrdersTemplate
      recurringOrders={recurringOrders}
      onTogglePause={handleTogglePause}
      onDelete={handleDelete}
      isLoading={authLoading || isLoading}
    />
  )
}
