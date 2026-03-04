'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import RetourTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/RetourTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import type { RetourItem } from '@/branches/ecommerce/templates/account/AccountTemplate1/RetourTemplate/types'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/components/account/ui'

export default function RetourPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const params = useParams()
  const router = useRouter()
  const orderId = params?.id as string
  const { user, isLoading: authLoading } = useAccountAuth()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || !orderId) return

    const fetchOrder = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/account/orders/${orderId}`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
        }
      } catch (err) {
        console.error('Error fetching order:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [user, orderId])

  const handleSubmit = async (data: {
    items: Array<{ itemId: string; quantity: number; reason: string }>
  }) => {
    const res = await fetch('/api/account/returns', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        items: data.items,
      }),
    })
    if (!res.ok) {
      throw new Error('Failed to submit return')
    }
  }

  if (authLoading || isLoading) return <AccountLoadingSkeleton variant="detail" />
  if (!order) return <AccountLoadingSkeleton variant="detail" />

  const items: RetourItem[] = (order.items || []).map((item: any) => ({
    id: item.id || item._id || String(Math.random()),
    title: item.productTitle || item.title || 'Product',
    sku: item.sku,
    quantity: 1,
    maxQuantity: item.quantity || 1,
    selected: false,
  }))

  return (
    <RetourTemplate
      orderId={orderId}
      orderNumber={order.orderNumber || orderId}
      items={items}
      onSubmit={handleSubmit}
    />
  )
}
