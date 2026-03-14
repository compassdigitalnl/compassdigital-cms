'use client'

import React, { useEffect, useState } from 'react'

interface SiteRevenue {
  siteId: number
  siteName: string
  totalOrders: number
  totalRevenue: number
  totalCommission: number
  avgOrderValue: number
  ordersByStatus: Record<string, number>
  fulfillmentByStatus: Record<string, number>
}

interface ReportPeriod {
  label: string
  days: number
}

const periods: ReportPeriod[] = [
  { label: '7 dagen', days: 7 },
  { label: '30 dagen', days: 30 },
  { label: '90 dagen', days: 90 },
  { label: 'Alles', days: 0 },
]

export function Reports() {
  const [siteRevenues, setSiteRevenues] = useState<SiteRevenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<number>(30)

  useEffect(() => {
    fetchReport()
  }, [period])

  async function fetchReport() {
    setLoading(true)
    try {
      // Fetch sites
      const sitesRes = await fetch('/api/multistore-sites?limit=100&depth=0&where[status][equals]=active')
      if (!sitesRes.ok) throw new Error('Kan webshops niet ophalen')
      const sitesData = await sitesRes.json()

      const revenues: SiteRevenue[] = []

      for (const site of sitesData.docs) {
        // Build date filter
        const whereParams = new URLSearchParams({
          limit: '0',
          depth: '0',
          'where[sourceSite][equals]': String(site.id),
        })

        if (period > 0) {
          const since = new Date()
          since.setDate(since.getDate() - period)
          whereParams.set('where[createdAt][greater_than]', since.toISOString())
        }

        // Fetch order count
        const countRes = await fetch(`/api/orders?${whereParams}`)
        const countData = countRes.ok ? await countRes.json() : { totalDocs: 0 }

        // Fetch actual orders for revenue calculation (limit to 500)
        whereParams.set('limit', '500')
        const ordersRes = await fetch(`/api/orders?${whereParams}`)
        const ordersData = ordersRes.ok ? await ordersRes.json() : { docs: [] }

        let totalRevenue = 0
        let totalCommission = 0
        const ordersByStatus: Record<string, number> = {}
        const fulfillmentByStatus: Record<string, number> = {}

        for (const order of ordersData.docs) {
          totalRevenue += order.total || 0
          totalCommission += order.commission || 0

          const status = order.status || 'unknown'
          ordersByStatus[status] = (ordersByStatus[status] || 0) + 1

          const fStatus = order.fulfillmentStatus || 'new'
          fulfillmentByStatus[fStatus] = (fulfillmentByStatus[fStatus] || 0) + 1
        }

        revenues.push({
          siteId: site.id,
          siteName: site.name,
          totalOrders: countData.totalDocs,
          totalRevenue,
          totalCommission,
          avgOrderValue: countData.totalDocs > 0 ? totalRevenue / countData.totalDocs : 0,
          ordersByStatus,
          fulfillmentByStatus,
        })
      }

      setSiteRevenues(revenues)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  const totals = siteRevenues.reduce(
    (acc, s) => ({
      orders: acc.orders + s.totalOrders,
      revenue: acc.revenue + s.totalRevenue,
      commission: acc.commission + s.totalCommission,
    }),
    { orders: 0, revenue: 0, commission: 0 },
  )

  const statusLabels: Record<string, string> = {
    pending: 'In behandeling',
    paid: 'Betaald',
    processing: 'In voorbereiding',
    shipped: 'Verzonden',
    delivered: 'Geleverd',
    cancelled: 'Geannuleerd',
    refunded: 'Terugbetaald',
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
      {/* Period Selector */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {periods.map((p) => (
          <button
            key={p.days}
            onClick={() => setPeriod(p.days)}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              border: period === p.days ? '2px solid #2563eb' : '1px solid #d1d5db',
              background: period === p.days ? '#eff6ff' : '#fff',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: period === p.days ? 600 : 400,
              color: period === p.days ? '#2563eb' : '#4b5563',
            }}
          >
            {p.label}
          </button>
        ))}
        <button onClick={() => fetchReport()} style={btnStyle}>
          Vernieuwen
        </button>
      </div>

      {/* Totals KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <KPICard label="Totaal Bestellingen" value={String(totals.orders)} />
        <KPICard label="Totaal Omzet" value={formatCurrency(totals.revenue)} />
        <KPICard label="Totaal Commissie" value={formatCurrency(totals.commission)} />
        <KPICard
          label="Gem. Orderwaarde"
          value={formatCurrency(totals.orders > 0 ? totals.revenue / totals.orders : 0)}
        />
      </div>

      {/* Per-Site Breakdown */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Per Webshop</h2>

      {loading ? (
        <div style={{ padding: '2rem', color: '#9ca3af', textAlign: 'center' }}>Laden...</div>
      ) : siteRevenues.length === 0 ? (
        <div style={{ padding: '2rem', color: '#9ca3af', textAlign: 'center' }}>Geen webshops gevonden</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th style={thStyle}>Webshop</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Bestellingen</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Omzet</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Commissie</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Gem. Order</th>
                <th style={thStyle}>Orderstatus</th>
              </tr>
            </thead>
            <tbody>
              {siteRevenues.map((site) => (
                <tr key={site.siteId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={tdStyle}>
                    <a
                      href={`/admin/collections/multistore-sites/${site.siteId}`}
                      style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {site.siteName}
                    </a>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>
                    {site.totalOrders}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(site.totalRevenue)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: '#059669', fontWeight: 600 }}>
                    {formatCurrency(site.totalCommission)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {formatCurrency(site.avgOrderValue)}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {Object.entries(site.ordersByStatus).map(([status, count]) => (
                        <span
                          key={status}
                          style={{
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: '#f3f4f6',
                            fontSize: '0.65rem',
                            color: '#4b5563',
                          }}
                        >
                          {statusLabels[status] || status}: {count}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #e5e7eb', fontWeight: 700 }}>
                <td style={tdStyle}>Totaal</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{totals.orders}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{formatCurrency(totals.revenue)}</td>
                <td style={{ ...tdStyle, textAlign: 'right', color: '#059669' }}>
                  {formatCurrency(totals.commission)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  {formatCurrency(totals.orders > 0 ? totals.revenue / totals.orders : 0)}
                </td>
                <td style={tdStyle} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

function KPICard({ label, value }: { label: string; value: string }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginTop: '0.25rem' }}>
        {value}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount)
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '1.25rem',
}
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
