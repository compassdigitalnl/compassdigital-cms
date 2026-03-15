'use client'

import React, { useEffect, useState, useCallback } from 'react'

interface FulfillmentOrder {
  id: number
  orderNumber: string
  remoteOrderNumber?: string
  sourceSiteName?: string
  status: string
  fulfillmentStatus: string
  total: number
  customerEmail?: string
  itemCount: number
  pickedBy?: string
  pickedAt?: string
  packedAt?: string
  trackingCode?: string
  shippingProvider?: string
  createdAt: string
}

type FulfillmentFilter = '' | 'new' | 'picking' | 'packing' | 'shipped' | 'delivered'

const FULFILLMENT_MAP: Record<string, { label: string; color: string }> = {
  new:       { label: 'Nieuw', color: 'gray' },
  picking:   { label: 'Picken', color: 'amber' },
  packing:   { label: 'Inpakken', color: 'blue' },
  shipped:   { label: 'Verzonden', color: 'purple' },
  delivered: { label: 'Afgeleverd', color: 'green' },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' })
}

export function Fulfillment() {
  const [orders, setOrders] = useState<FulfillmentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FulfillmentFilter>('')
  const [updating, setUpdating] = useState<number | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '50',
        depth: '1',
        sort: '-createdAt',
        'where[sourceSite][exists]': 'true',
      })
      if (filter) {
        params.set('where[fulfillmentStatus][equals]', filter)
      }

      const res = await fetch(`/api/orders?${params}`)
      if (!res.ok) throw new Error('Kan bestellingen niet ophalen')
      const data = await res.json()

      setOrders(
        data.docs.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          remoteOrderNumber: order.remoteOrderNumber,
          sourceSiteName: typeof order.sourceSite === 'object' ? order.sourceSite?.name : undefined,
          status: order.status,
          fulfillmentStatus: order.fulfillmentStatus || 'new',
          total: order.total || 0,
          customerEmail: order.customerEmail || order.guestEmail,
          itemCount: order.items?.length || 0,
          pickedBy: typeof order.pickedBy === 'object' ? order.pickedBy?.email : undefined,
          pickedAt: order.pickedAt,
          packedAt: order.packedAt,
          trackingCode: order.trackingCode,
          shippingProvider: order.shippingProvider,
          createdAt: order.createdAt,
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  async function updateFulfillment(orderId: number, newStatus: string, extraData?: Record<string, any>) {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: newStatus, ...extraData }),
      })
      if (!res.ok) throw new Error('Update mislukt')
      await fetchOrders()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fout bij update')
    } finally {
      setUpdating(null)
    }
  }

  const handleStartPicking = (id: number) =>
    updateFulfillment(id, 'picking', { pickedAt: new Date().toISOString() })

  const handleMarkPacked = (id: number) =>
    updateFulfillment(id, 'packing', { packedAt: new Date().toISOString() })

  const handleMarkShipped = (id: number) => {
    const trackingCode = prompt('Track & Trace code (optioneel):')
    const shippingProvider = prompt('Verzendpartij (postnl/dhl/dpd/ups):')
    const extra: Record<string, any> = { status: 'shipped' }
    if (trackingCode) extra.trackingCode = trackingCode
    if (shippingProvider) extra.shippingProvider = shippingProvider
    updateFulfillment(id, 'shipped', extra)
  }

  const handleMarkDelivered = (id: number) =>
    updateFulfillment(id, 'delivered', { status: 'delivered', actualDeliveryDate: new Date().toISOString() })

  // Stats per pipeline step
  const stats = {
    new: orders.filter((o) => o.fulfillmentStatus === 'new').length,
    picking: orders.filter((o) => o.fulfillmentStatus === 'picking').length,
    packing: orders.filter((o) => o.fulfillmentStatus === 'packing').length,
    shipped: orders.filter((o) => o.fulfillmentStatus === 'shipped').length,
    delivered: orders.filter((o) => o.fulfillmentStatus === 'delivered').length,
  }

  if (error) return <div className="ms-error">{error}</div>

  return (
    <div className="ms-page">
      {/* Pipeline */}
      <div className="ms-pipeline">
        {(['new', 'picking', 'packing', 'shipped', 'delivered'] as const).map((step, i) => (
          <button
            key={step}
            className={`ms-pipeline__step ms-pipeline__step--${step}${filter === step ? ` ms-pipeline__step--active ms-pipeline__step--${step}--active` : ''}`}
            onClick={() => setFilter(filter === step ? '' : step)}
          >
            <div className="ms-pipeline__count">{stats[step]}</div>
            <div className="ms-pipeline__label">{FULFILLMENT_MAP[step].label}</div>
            {i < 4 && <span className="ms-pipeline__arrow">→</span>}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="ms-toolbar">
        <button className="ms-btn ms-btn--sm" onClick={() => fetchOrders()}>
          Vernieuwen
        </button>
        {filter && (
          <button className="ms-btn ms-btn--sm ms-btn--danger" onClick={() => setFilter('')}>
            Filter wissen
          </button>
        )}
        <span className="ms-toolbar__count">{orders.length} bestellingen</span>
      </div>

      {/* Table */}
      <div className="ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr>
              <th>Bestelling</th>
              <th>Webshop</th>
              <th>Status</th>
              <th className="ms-table__center">Items</th>
              <th className="ms-table__right">Totaal</th>
              <th>Info</th>
              <th>Actie</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div className="ms-loading"><div className="ms-spinner" />Laden...</div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="ms-empty">Geen bestellingen gevonden</div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const info = FULFILLMENT_MAP[order.fulfillmentStatus] || { label: order.fulfillmentStatus, color: 'gray' }
                return (
                  <tr key={order.id}>
                    <td>
                      <a href={`/admin/collections/orders/${order.id}`} className="ms-table__link">
                        {order.orderNumber}
                      </a>
                      {order.remoteOrderNumber && order.remoteOrderNumber !== order.orderNumber && (
                        <div className="ms-table__muted">{order.remoteOrderNumber}</div>
                      )}
                    </td>
                    <td>{order.sourceSiteName || '—'}</td>
                    <td>
                      <span className={`ms-pill ms-pill--${info.color}`}>
                        <span className={`ms-pill__dot ms-pill__dot--${info.color}`} />
                        {info.label}
                      </span>
                    </td>
                    <td className="ms-table__center">{order.itemCount}</td>
                    <td className="ms-table__right" style={{ fontWeight: 600 }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td>
                      <FulfillmentInfo order={order} />
                    </td>
                    <td>
                      <FulfillmentActions
                        order={order}
                        updating={updating === order.id}
                        onStartPicking={() => handleStartPicking(order.id)}
                        onMarkPacked={() => handleMarkPacked(order.id)}
                        onMarkShipped={() => handleMarkShipped(order.id)}
                        onMarkDelivered={() => handleMarkDelivered(order.id)}
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FulfillmentInfo({ order }: { order: FulfillmentOrder }) {
  const parts: string[] = []
  if (order.pickedBy) parts.push(`Picker: ${order.pickedBy}`)
  if (order.pickedAt) parts.push(`Gepickt: ${formatTime(order.pickedAt)}`)
  if (order.packedAt) parts.push(`Ingepakt: ${formatTime(order.packedAt)}`)
  if (order.trackingCode) parts.push(`T&T: ${order.trackingCode}`)
  if (order.shippingProvider) parts.push(order.shippingProvider.toUpperCase())

  if (parts.length === 0) return <span className="ms-table__muted">—</span>

  return (
    <div className="ms-fulfillment-info">
      {parts.map((part, i) => (
        <div key={i}>{part}</div>
      ))}
    </div>
  )
}

function FulfillmentActions({
  order,
  updating,
  onStartPicking,
  onMarkPacked,
  onMarkShipped,
  onMarkDelivered,
}: {
  order: FulfillmentOrder
  updating: boolean
  onStartPicking: () => void
  onMarkPacked: () => void
  onMarkShipped: () => void
  onMarkDelivered: () => void
}) {
  if (updating) return <span className="ms-table__muted">Bijwerken...</span>

  switch (order.fulfillmentStatus) {
    case 'new':
      return <button className="ms-action-btn ms-action-btn--amber" onClick={onStartPicking}>Start Picken</button>
    case 'picking':
      return <button className="ms-action-btn ms-action-btn--blue" onClick={onMarkPacked}>Ingepakt</button>
    case 'packing':
      return <button className="ms-action-btn ms-action-btn--purple" onClick={onMarkShipped}>Verzenden</button>
    case 'shipped':
      return <button className="ms-action-btn ms-action-btn--green" onClick={onMarkDelivered}>Afgeleverd</button>
    case 'delivered':
      return <span className="ms-action-btn__complete">Compleet</span>
    default:
      return null
  }
}
