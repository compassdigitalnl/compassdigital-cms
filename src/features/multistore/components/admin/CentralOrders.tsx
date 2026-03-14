'use client'

import React, { useEffect, useState } from 'react'

interface Order {
  id: number
  orderNumber: string
  remoteOrderNumber?: string
  sourceSiteName?: string
  status: string
  fulfillmentStatus?: string
  total: number
  customerEmail?: string
  createdAt: string
}

export function CentralOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter])

  async function fetchOrders() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '25',
        page: String(page),
        depth: '1',
        sort: '-createdAt',
        'where[sourceSite][exists]': 'true',
      })
      if (statusFilter) {
        params.set('where[status][equals]', statusFilter)
      }

      const res = await fetch(`/api/orders?${params}`)
      if (!res.ok) throw new Error('Kan bestellingen niet ophalen')
      const data = await res.json()

      const mapped: Order[] = data.docs.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        remoteOrderNumber: order.remoteOrderNumber,
        sourceSiteName: typeof order.sourceSite === 'object' ? order.sourceSite?.name : undefined,
        status: order.status,
        fulfillmentStatus: order.fulfillmentStatus,
        total: order.total,
        customerEmail: order.customerEmail || order.guestEmail,
        createdAt: order.createdAt,
      }))

      setOrders(mapped)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const statusLabels: Record<string, string> = {
    pending: 'In behandeling',
    paid: 'Betaald',
    processing: 'In voorbereiding',
    shipped: 'Verzonden',
    delivered: 'Geleverd',
    cancelled: 'Geannuleerd',
    refunded: 'Terugbetaald',
  }

  const fulfillmentLabels: Record<string, string> = {
    new: 'Nieuw',
    picking: 'Picken',
    packing: 'Inpakken',
    shipped: 'Verzonden',
    delivered: 'Afgeleverd',
  }

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    paid: '#10b981',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#059669',
    cancelled: '#ef4444',
    refunded: '#6b7280',
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
      {/* Filters */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
        >
          <option value="">Alle statussen</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          onClick={() => fetchOrders()}
          style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Vernieuwen
        </button>
      </div>

      {/* Orders Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={thStyle}>Bestelnr.</th>
              <th style={thStyle}>Webshop</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Fulfillment</th>
              <th style={thStyle}>Totaal</th>
              <th style={thStyle}>Klant</th>
              <th style={thStyle}>Datum</th>
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
                    <a href={`/admin/collections/orders/${order.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                      {order.orderNumber}
                    </a>
                    {order.remoteOrderNumber && order.remoteOrderNumber !== order.orderNumber && (
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                        Remote: {order.remoteOrderNumber}
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>{order.sourceSiteName || '—'}</td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#fff',
                      background: statusColors[order.status] || '#6b7280',
                    }}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {order.fulfillmentStatus
                      ? fulfillmentLabels[order.fulfillmentStatus] || order.fulfillmentStatus
                      : '—'}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(order.total)}
                  </td>
                  <td style={tdStyle}>{order.customerEmail || '—'}</td>
                  <td style={tdStyle}>
                    {new Date(order.createdAt).toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            style={{ ...paginationBtnStyle, opacity: page <= 1 ? 0.5 : 1 }}
          >
            Vorige
          </button>
          <span style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', color: '#6b7280' }}>
            Pagina {page} van {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            style={{ ...paginationBtnStyle, opacity: page >= totalPages ? 0.5 : 1 }}
          >
            Volgende
          </button>
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '0.5rem 0.75rem', fontWeight: 600, color: '#374151' }
const tdStyle: React.CSSProperties = { padding: '0.5rem 0.75rem', color: '#4b5563' }
const paginationBtnStyle: React.CSSProperties = {
  padding: '0.4rem 0.75rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '0.85rem',
}
