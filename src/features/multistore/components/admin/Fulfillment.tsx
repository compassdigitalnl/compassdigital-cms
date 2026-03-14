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

      const mapped: FulfillmentOrder[] = data.docs.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        remoteOrderNumber: order.remoteOrderNumber,
        sourceSiteName: typeof order.sourceSite === 'object' ? order.sourceSite?.name : undefined,
        status: order.status,
        fulfillmentStatus: order.fulfillmentStatus || 'new',
        total: order.total,
        customerEmail: order.customerEmail || order.guestEmail,
        itemCount: order.items?.length || 0,
        pickedBy: typeof order.pickedBy === 'object' ? order.pickedBy?.email : undefined,
        pickedAt: order.pickedAt,
        packedAt: order.packedAt,
        trackingCode: order.trackingCode,
        shippingProvider: order.shippingProvider,
        createdAt: order.createdAt,
      }))

      setOrders(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  async function updateFulfillment(
    orderId: number,
    newStatus: string,
    extraData?: Record<string, any>,
  ) {
    setUpdating(orderId)
    try {
      const data: Record<string, any> = {
        fulfillmentStatus: newStatus,
        ...extraData,
      }

      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Update mislukt')

      // Refresh the list
      await fetchOrders()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fout bij update')
    } finally {
      setUpdating(null)
    }
  }

  function handleStartPicking(orderId: number) {
    updateFulfillment(orderId, 'picking', {
      pickedAt: new Date().toISOString(),
    })
  }

  function handleMarkPacked(orderId: number) {
    updateFulfillment(orderId, 'packing', {
      packedAt: new Date().toISOString(),
    })
  }

  function handleMarkShipped(orderId: number) {
    const trackingCode = prompt('Track & Trace code (optioneel):')
    const shippingProvider = prompt('Verzendpartij (postnl/dhl/dpd/ups):')

    const extraData: Record<string, any> = {}
    if (trackingCode) extraData.trackingCode = trackingCode
    if (shippingProvider) extraData.shippingProvider = shippingProvider

    updateFulfillment(orderId, 'shipped', {
      ...extraData,
      status: 'shipped',
    })
  }

  function handleMarkDelivered(orderId: number) {
    updateFulfillment(orderId, 'delivered', {
      status: 'delivered',
      actualDeliveryDate: new Date().toISOString(),
    })
  }

  const fulfillmentLabels: Record<string, string> = {
    new: 'Nieuw',
    picking: 'Picken',
    packing: 'Inpakken',
    shipped: 'Verzonden',
    delivered: 'Afgeleverd',
  }

  const fulfillmentColors: Record<string, string> = {
    new: '#6b7280',
    picking: '#f59e0b',
    packing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#059669',
  }

  // Stats
  const stats = {
    new: orders.filter((o) => o.fulfillmentStatus === 'new').length,
    picking: orders.filter((o) => o.fulfillmentStatus === 'picking').length,
    packing: orders.filter((o) => o.fulfillmentStatus === 'packing').length,
    shipped: orders.filter((o) => o.fulfillmentStatus === 'shipped').length,
    delivered: orders.filter((o) => o.fulfillmentStatus === 'delivered').length,
  }

  if (error) {
    return (
      <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b' }}>
        {error}
      </div>
    )
  }

  return (
    <div>
      {/* Pipeline Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {(['new', 'picking', 'packing', 'shipped', 'delivered'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(filter === status ? '' : status)}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: filter === status ? `2px solid ${fulfillmentColors[status]}` : '1px solid #e5e7eb',
              background: filter === status ? `${fulfillmentColors[status]}10` : '#fff',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: fulfillmentColors[status] }}>
              {stats[status]}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {fulfillmentLabels[status]}
            </div>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => fetchOrders()} style={btnStyle}>
          Vernieuwen
        </button>
        {filter && (
          <button onClick={() => setFilter('')} style={{ ...btnStyle, color: '#ef4444' }}>
            Filter wissen
          </button>
        )}
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '0.5rem' }}>
          {orders.length} bestellingen
        </span>
      </div>

      {/* Orders Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={thStyle}>Bestelling</th>
              <th style={thStyle}>Webshop</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Items</th>
              <th style={thStyle}>Totaal</th>
              <th style={thStyle}>Info</th>
              <th style={thStyle}>Actie</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                  Laden...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                  Geen bestellingen gevonden
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={tdStyle}>
                    <a
                      href={`/admin/collections/orders/${order.id}`}
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {order.orderNumber}
                    </a>
                    {order.remoteOrderNumber && order.remoteOrderNumber !== order.orderNumber && (
                      <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>
                        {order.remoteOrderNumber}
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>{order.sourceSiteName || '—'}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#fff',
                        background: fulfillmentColors[order.fulfillmentStatus] || '#6b7280',
                      }}
                    >
                      {fulfillmentLabels[order.fulfillmentStatus] || order.fulfillmentStatus}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{order.itemCount}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(
                      order.total,
                    )}
                  </td>
                  <td style={tdStyle}>
                    <FulfillmentInfo order={order} />
                  </td>
                  <td style={tdStyle}>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

function FulfillmentInfo({ order }: { order: FulfillmentOrder }) {
  const parts: string[] = []
  if (order.pickedBy) parts.push(`Picker: ${order.pickedBy}`)
  if (order.pickedAt) parts.push(`Gepickt: ${formatTime(order.pickedAt)}`)
  if (order.packedAt) parts.push(`Ingepakt: ${formatTime(order.packedAt)}`)
  if (order.trackingCode) parts.push(`T&T: ${order.trackingCode}`)
  if (order.shippingProvider) parts.push(order.shippingProvider.toUpperCase())

  if (parts.length === 0) {
    return <span style={{ color: '#d1d5db' }}>—</span>
  }

  return (
    <div style={{ fontSize: '0.65rem', color: '#6b7280', lineHeight: '1.4' }}>
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
  if (updating) {
    return <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Bijwerken...</span>
  }

  switch (order.fulfillmentStatus) {
    case 'new':
      return (
        <button onClick={onStartPicking} style={actionBtnStyle('#f59e0b')}>
          Start Picken
        </button>
      )
    case 'picking':
      return (
        <button onClick={onMarkPacked} style={actionBtnStyle('#3b82f6')}>
          Ingepakt
        </button>
      )
    case 'packing':
      return (
        <button onClick={onMarkShipped} style={actionBtnStyle('#8b5cf6')}>
          Verzenden
        </button>
      )
    case 'shipped':
      return (
        <button onClick={onMarkDelivered} style={actionBtnStyle('#059669')}>
          Afgeleverd
        </button>
      )
    case 'delivered':
      return <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>Compleet</span>
    default:
      return null
  }
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' })
}

function actionBtnStyle(color: string): React.CSSProperties {
  return {
    padding: '0.3rem 0.6rem',
    borderRadius: '6px',
    border: `1px solid ${color}`,
    background: `${color}15`,
    color,
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  }
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════

const thStyle: React.CSSProperties = { padding: '0.5rem 0.75rem', fontWeight: 600, color: '#374151', fontSize: '0.75rem' }
const tdStyle: React.CSSProperties = { padding: '0.5rem 0.75rem', color: '#4b5563' }
const btnStyle: React.CSSProperties = {
  padding: '0.4rem 0.75rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '0.85rem',
}
