'use client'

import React, { useEffect, useState, useCallback } from 'react'

interface SiteRevenue {
  siteId: number
  siteName: string
  totalOrders: number
  totalRevenue: number
  totalCommission: number
  avgOrderValue: number
  ordersByStatus: Record<string, number>
}

const PERIODS = [
  { label: '7 dagen', days: 7 },
  { label: '30 dagen', days: 30 },
  { label: '90 dagen', days: 90 },
  { label: 'Alles', days: 0 },
]

const STATUS_LABELS: Record<string, string> = {
  pending: 'In behandeling',
  paid: 'Betaald',
  processing: 'In voorbereiding',
  shipped: 'Verzonden',
  delivered: 'Geleverd',
  cancelled: 'Geannuleerd',
  refunded: 'Terugbetaald',
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function Reports() {
  const [siteRevenues, setSiteRevenues] = useState<SiteRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState(30)

  const fetchReport = useCallback(async () => {
    setLoading(true)
    try {
      const sitesRes = await fetch('/api/multistore-sites?limit=100&depth=0&where[status][equals]=active')
      if (!sitesRes.ok) throw new Error('Kan webshops niet ophalen')
      const sitesData = await sitesRes.json()

      const revenues: SiteRevenue[] = []

      for (const site of sitesData.docs) {
        const params = new URLSearchParams({
          limit: '500',
          depth: '0',
          'where[sourceSite][equals]': String(site.id),
        })
        if (period > 0) {
          const since = new Date()
          since.setDate(since.getDate() - period)
          params.set('where[createdAt][greater_than]', since.toISOString())
        }

        const ordersRes = await fetch(`/api/orders?${params}`)
        const ordersData = ordersRes.ok ? await ordersRes.json() : { docs: [], totalDocs: 0 }

        let totalRevenue = 0
        let totalCommission = 0
        const ordersByStatus: Record<string, number> = {}

        for (const order of ordersData.docs) {
          totalRevenue += order.total || 0
          totalCommission += order.commission || 0
          const status = order.status || 'unknown'
          ordersByStatus[status] = (ordersByStatus[status] || 0) + 1
        }

        revenues.push({
          siteId: site.id,
          siteName: site.name,
          totalOrders: ordersData.totalDocs,
          totalRevenue,
          totalCommission,
          avgOrderValue: ordersData.totalDocs > 0 ? totalRevenue / ordersData.totalDocs : 0,
          ordersByStatus,
        })
      }

      setSiteRevenues(revenues)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const totals = siteRevenues.reduce(
    (acc, s) => ({
      orders: acc.orders + s.totalOrders,
      revenue: acc.revenue + s.totalRevenue,
      commission: acc.commission + s.totalCommission,
    }),
    { orders: 0, revenue: 0, commission: 0 },
  )

  const maxRevenue = Math.max(...siteRevenues.map((s) => s.totalRevenue), 1)

  if (error) return <div className="ms-error">{error}</div>

  return (
    <div className="ms-page">
      {/* Period Selector */}
      <div className="ms-toolbar">
        <div className="ms-period">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              className={`ms-period__btn${period === p.days ? ' ms-period__btn--active' : ''}`}
              onClick={() => setPeriod(p.days)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button className="ms-btn ms-btn--sm" onClick={() => fetchReport()}>
          Vernieuwen
        </button>
      </div>

      {/* KPI Cards */}
      <div className="ms-kpi-grid">
        <div className="ms-kpi">
          <div className="ms-kpi__top">
            <span className="ms-kpi__label">Totaal Bestellingen</span>
            <span className="ms-kpi__icon ms-kpi__icon--blue">📦</span>
          </div>
          <div className="ms-kpi__value">{loading ? '...' : totals.orders}</div>
        </div>
        <div className="ms-kpi">
          <div className="ms-kpi__top">
            <span className="ms-kpi__label">Totaal Omzet</span>
            <span className="ms-kpi__icon ms-kpi__icon--green">💰</span>
          </div>
          <div className="ms-kpi__value">{loading ? '...' : formatCurrency(totals.revenue)}</div>
        </div>
        <div className="ms-kpi">
          <div className="ms-kpi__top">
            <span className="ms-kpi__label">Totaal Commissie</span>
            <span className="ms-kpi__icon ms-kpi__icon--teal">🏦</span>
          </div>
          <div className="ms-kpi__value">{loading ? '...' : formatCurrency(totals.commission)}</div>
        </div>
        <div className="ms-kpi">
          <div className="ms-kpi__top">
            <span className="ms-kpi__label">Gem. Orderwaarde</span>
            <span className="ms-kpi__icon ms-kpi__icon--amber">📊</span>
          </div>
          <div className="ms-kpi__value">
            {loading ? '...' : formatCurrency(totals.orders > 0 ? totals.revenue / totals.orders : 0)}
          </div>
        </div>
      </div>

      {/* Revenue bars */}
      {!loading && siteRevenues.length > 0 && (
        <div className="ms-section">
          <div className="ms-section__header">
            <h2 className="ms-section__title">Omzet per Webshop</h2>
          </div>
          <div className="ms-card">
            <div className="ms-card__body">
              {siteRevenues.map((site) => (
                <div key={site.siteId} className="ms-bar">
                  <span className="ms-bar__label">{site.siteName}</span>
                  <div className="ms-bar__track">
                    <div
                      className="ms-bar__fill ms-bar__fill--teal"
                      style={{ width: `${(site.totalRevenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="ms-bar__value">{formatCurrency(site.totalRevenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail Table */}
      <div className="ms-section">
        <div className="ms-section__header">
          <h2 className="ms-section__title">Detail per Webshop</h2>
        </div>

        <div className="ms-table-wrap">
          <table className="ms-table">
            <thead>
              <tr>
                <th>Webshop</th>
                <th className="ms-table__right">Bestellingen</th>
                <th className="ms-table__right">Omzet</th>
                <th className="ms-table__right">Commissie</th>
                <th className="ms-table__right">Gem. Order</th>
                <th>Orderstatus</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="ms-loading"><div className="ms-spinner" />Laden...</div>
                  </td>
                </tr>
              ) : siteRevenues.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="ms-empty">Geen webshops gevonden</div>
                  </td>
                </tr>
              ) : (
                siteRevenues.map((site) => (
                  <tr key={site.siteId}>
                    <td>
                      <a href={`/admin/collections/multistore-sites/${site.siteId}`} className="ms-table__link">
                        {site.siteName}
                      </a>
                    </td>
                    <td className="ms-table__right" style={{ fontWeight: 600 }}>{site.totalOrders}</td>
                    <td className="ms-table__right" style={{ fontWeight: 600 }}>{formatCurrency(site.totalRevenue)}</td>
                    <td className="ms-table__right" style={{ color: '#059669', fontWeight: 600 }}>
                      {formatCurrency(site.totalCommission)}
                    </td>
                    <td className="ms-table__right">{formatCurrency(site.avgOrderValue)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {Object.entries(site.ordersByStatus).map(([status, count]) => (
                          <span key={status} className="ms-pill ms-pill--gray">
                            {STATUS_LABELS[status] || status}: {count}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {!loading && siteRevenues.length > 0 && (
              <tfoot>
                <tr>
                  <td>Totaal</td>
                  <td className="ms-table__right">{totals.orders}</td>
                  <td className="ms-table__right">{formatCurrency(totals.revenue)}</td>
                  <td className="ms-table__right" style={{ color: '#059669' }}>
                    {formatCurrency(totals.commission)}
                  </td>
                  <td className="ms-table__right">
                    {formatCurrency(totals.orders > 0 ? totals.revenue / totals.orders : 0)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
