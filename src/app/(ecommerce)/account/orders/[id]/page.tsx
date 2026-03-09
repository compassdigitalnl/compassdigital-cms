'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import OrderDetailTemplate from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/OrderDetailTemplate'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import { useAccountTemplate } from '@/branches/ecommerce/shared/contexts/AccountTemplateContext'
import { useCart } from '@/branches/ecommerce/shared/contexts/CartContext'
import { toast } from '@/lib/toast'
import type { OrderDetail } from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/OrderDetailTemplate/types'

export default function OrderDetailPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const params = useParams()
  const orderId = params?.id as string
  const { user, isLoading: authLoading } = useAccountAuth()
  const { addGroupedItems } = useCart()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !orderId) return

    const fetchOrder = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/account/orders/${orderId}`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          const o = data.doc
          setOrder({
            id: o.id,
            orderNumber: o.orderNumber,
            createdAt: o.createdAt,
            status: o.status,
            paymentMethod: o.paymentMethod || 'ideal',
            paymentStatus: o.paymentStatus || 'pending',
            trackingCode: o.trackingCode,
            trackingUrl: o.trackingUrl,
            shippingProvider: o.shippingProvider,
            items: (o.items || []).map((item: any) => ({
              id: item.id,
              product: item.product,
              title: item.title || 'Product',
              sku: item.sku,
              ean: item.ean,
              quantity: item.quantity || 1,
              price: item.price || 0,
              subtotal: item.subtotal || (item.price || 0) * (item.quantity || 1),
            })),
            shippingAddress: o.shippingAddress || {
              firstName: '',
              lastName: '',
              street: '',
              houseNumber: '',
              postalCode: '',
              city: '',
            },
            billingAddress: o.billingAddress || { sameAsShipping: true },
            timeline: o.timeline,
            subtotal: o.subtotal || 0,
            shippingCost: o.shippingCost || 0,
            tax: o.tax || 0,
            discount: o.discount || 0,
            total: o.total || 0,
          })
        } else if (res.status === 404) {
          setError('Bestelling niet gevonden')
        } else {
          setError('Kon bestelling niet laden')
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Er is iets misgegaan')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [user, orderId])

  if (authLoading || isLoading) {
    return <AccountLoadingSkeleton variant="detail" />
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <h2 className="text-lg font-extrabold text-gray-900 mb-2">{error || 'Bestelling niet gevonden'}</h2>
        <p className="text-sm text-gray-500">Controleer het bestelnummer en probeer het opnieuw.</p>
      </div>
    )
  }

  const handleReorder = () => {
    if (!order) return
    const cartItems = order.items.map((item) => ({
      id: item.product || item.id,
      slug: item.sku || String(item.id),
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      stock: 9999,
      sku: item.sku,
      ean: item.ean,
    }))
    addGroupedItems(cartItems)
    toast.success(
      `${order.items.length} producten toegevoegd`,
      'Alle producten uit deze bestelling zijn aan je winkelwagen toegevoegd',
    )
  }

  const handleDownloadInvoice = () => {
    // If the order has an invoice PDF URL, download it
    if ((order as any).invoicePDF?.url) {
      window.open((order as any).invoicePDF.url, '_blank')
    } else {
      toast.info('Geen factuur beschikbaar', 'De factuur voor deze bestelling is nog niet beschikbaar')
    }
  }

  return <OrderDetailTemplate order={order} onReorder={handleReorder} onDownloadInvoice={handleDownloadInvoice} />
}
