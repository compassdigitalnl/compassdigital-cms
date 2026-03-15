'use client'

import React, { useEffect, useState, useCallback } from 'react'

interface Order {
  id: number
  orderNumber: string
  remoteOrderNumber?: string
  sourceSiteName?: string
  sourceSiteId?: number
  status: string
  fulfillmentStatus?: string
  total: number
  customerEmail?: string
  itemCount: number
  createdAt: string
}

interface SiteOption {
  id: number
  name: string
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:    { label: 'In behandeling', color: 'amber' },
  paid:       { label: 'Betaald', color: 'green' },
  processing: { label: 'In voorbereiding', color: 'blue' },
  shipped:    { label: 'Verzonden', color: 'purple' },
  delivered:  { label: 'Geleverd', color: 'green' },
  cancelled:  { label: 'Geannuleerd', color: 'red' },
  refunded:   { label: 'Terugbetaald', color: 'gray' },
}

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' })
}

export function CentralOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [sites, setSites] = useState<SiteOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [siteFilter, setSiteFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch sites for filter dropdown
  useEffect(() => {
    fetch('/api/multistore-sites?limit=100&depth=0')
      .then((res) => (res.ok ? res.json() : { docs: [] }))
      .then((data) => setSites(data.docs.map((s: any) => ({ id: s.id, name: s.name }))))
      .catch(() => {})
  }, [])

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '25',
        page: String(page),
        depth: '1',
        sort: '-createdAt',
        'where[sourceSite][exists]': 'true',
      })
      if (statusFilter) params.set('where[status][equals]', statusFilter)
      if (siteFilter) params.set('where[sourceSite][equals]', siteFilter)

      const res = await fetch(`/api/orders?${params}`)
      if (!res.ok) throw new Error('Kan bestellingen niet ophalen')
      const data = await res.json()

      setOrders(
        data.docs.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          remoteOrderNumber: order.remoteOrderNumber,
          sourceSiteName: typeof order.sourceSite === 'object' ? order.sourceSite?.name : undefined,
          sourceSiteId: typeof order.sourceSite === 'object' ? order.sourceSite?.id : order.sourceSite,
          status: order.status,
          fulfillmentStatus: order.fulfillmentStatus,
          total: order.total || 0,
          customerEmail: order.customerEmail || order.guestEmail,
          itemCount: order.items?.length || 0,
          createdAt: order.createdAt,
        })),
      )
      setTotalPages(data.totalPages || 1)
      setTotalDocs(data.totalDocs || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, siteFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  if (error) return <div className="ms-error">{error}</div>

  const filteredOrders = searchQuery
    ? orders.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : orders

  return (
    <div className="ms-page">
      {/* Toolbar */}
      <div className="ms-toolbar">
        <select
          className="ms-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
        >
          <option value="">Alle statussen</option>
          {Object.entries(STATUS_MAP).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          className="ms-select"
          value={siteFilter}
          onChange={(e) => { setSiteFilter(e.target.value); setPage(1) }}
        >
          <option value="">Alle webshops</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>

        <input
          type="text"
          className="ms-input"
          placeholder="Zoek op bestelnr of e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '220px' }}
        />

        <button className="ms-btn ms-btn--sm" onClick={() => fetchOrders()}>
          Vernieuwen
        </button>

        {(statusFilter || siteFilter) && (
          <button
            className="ms-btn ms-btn--sm ms-btn--danger"
            onClick={() => { setStatusFilter(''); setSiteFilter(''); setPage(1) }}
          >
            Filters wissen
          </button>
        )}

        <span className="ms-toolbar__count">{totalDocs} bestellingen</span>
      </div>

      {/* Table */}
      <div className="ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr>
              <th>Bestelnr.</th>
              <th>Webshop</th>
              <th>Status</th>
              <th>Fulfillment</th>
              <th className="ms-table__right">Totaal</th>
              <th>Klant</th>
              <th className="ms-table__right">Items</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className="ms-loading">
                    <div className="ms-spinner" />
                    Laden...
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="ms-empty">Geen bestellingen gevonden</div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'gray' }
                const fulfillInfo = order.fulfillmentStatus
                  ? FULFILLMENT_MAP[order.fulfillmentStatus] || { label: order.fulfillmentStatus, color: 'gray' }
                  : null

                return (
                  <tr key={order.id}>
                    <td>
                      <a href={`/admin/collections/orders/${order.id}`} className="ms-table__link">
                        {order.orderNumber}
                      </a>
                      {order.remoteOrderNumber && order.remoteOrderNumber !== order.orderNumber && (
                        <div className="ms-table__muted">Remote: {order.remoteOrderNumber}</div>
                      )}
                    </td>
                    <td>{order.sourceSiteName || '—'}</td>
                    <td>
                      <span className={`ms-pill ms-pill--${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      {fulfillInfo ? (
                        <span className={`ms-pill ms-pill--${fulfillInfo.color}`}>
                          {fulfillInfo.label}
                        </span>
                      ) : (
                        <span className="ms-table__muted">—</span>
                      )}
                    </td>
                    <td className="ms-table__right" style={{ fontWeight: 600 }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td>{order.customerEmail || <span className="ms-table__muted">—</span>}</td>
                    <td className="ms-table__right">{order.itemCount}</td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ms-pagination">
          <button
            className="ms-btn ms-btn--sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Vorige
          </button>
          <span className="ms-pagination__info">
            Pagina {page} van {totalPages}
          </span>
          <button
            className="ms-btn ms-btn--sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Volgende
          </button>
        </div>
      )}
    </div>
  )
}
