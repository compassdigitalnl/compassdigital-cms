'use client'

import React, { useEffect, useState } from 'react'

interface SiteStats {
  id: number
  name: string
  domain: string
  status: string
  healthStatus: string
  totalProductsSynced: number
  totalOrdersImported: number
  lastHealthCheck: string | null
}

interface DashboardStats {
  totalSites: number
  activeSites: number
  totalOrders: number
  totalProducts: number
  sites: SiteStats[]
}

export function MultistoreDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch sites
        const sitesRes = await fetch('/api/multistore-sites?limit=100&depth=0')
        if (!sitesRes.ok) throw new Error('Kan webshops niet ophalen')
        const sitesData = await sitesRes.json()

        // Fetch orders count (Hub orders have sourceSite set)
        const ordersRes = await fetch('/api/orders?limit=0&depth=0&where[sourceSite][exists]=true')
        const ordersData = ordersRes.ok ? await ordersRes.json() : { totalDocs: 0 }

        // Fetch synced products count
        const productsRes = await fetch('/api/products?limit=0&depth=0&where[multistoreSyncEnabled][equals]=true')
        const productsData = productsRes.ok ? await productsRes.json() : { totalDocs: 0 }

        const sites: SiteStats[] = sitesData.docs.map((site: any) => ({
          id: site.id,
          name: site.name,
          domain: site.domain,
          status: site.status,
          healthStatus: site.healthStatus || 'unknown',
          totalProductsSynced: site.totalProductsSynced || 0,
          totalOrdersImported: site.totalOrdersImported || 0,
          lastHealthCheck: site.lastHealthCheck,
        }))

        setStats({
          totalSites: sitesData.totalDocs,
          activeSites: sites.filter((s) => s.status === 'active').length,
          totalOrders: ordersData.totalDocs,
          totalProducts: productsData.totalDocs,
          sites,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Onbekende fout')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div style={{ padding: '2rem', color: '#6b7280' }}>Laden...</div>
  }

  if (error) {
    return (
      <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b' }}>
        {error}
      </div>
    )
  }

  if (!stats) return null

  const healthIcons: Record<string, string> = {
    healthy: '🟢',
    degraded: '🟡',
    down: '🔴',
    unknown: '⚪',
  }

  const statusLabels: Record<string, string> = {
    active: 'Actief',
    paused: 'Gepauzeerd',
    disconnected: 'Niet verbonden',
    error: 'Fout',
  }

  return (
    <div>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Webshops</div>
          <div style={cardValueStyle}>{stats.activeSites} / {stats.totalSites}</div>
          <div style={cardSubStyle}>actief</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Bestellingen</div>
          <div style={cardValueStyle}>{stats.totalOrders}</div>
          <div style={cardSubStyle}>van alle webshops</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Producten</div>
          <div style={cardValueStyle}>{stats.totalProducts}</div>
          <div style={cardSubStyle}>sync ingeschakeld</div>
        </div>
      </div>

      {/* Sites Table */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Webshops</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Naam</th>
              <th style={thStyle}>Domein</th>
              <th style={thStyle}>Producten</th>
              <th style={thStyle}>Orders</th>
              <th style={thStyle}>Laatste check</th>
            </tr>
          </thead>
          <tbody>
            {stats.sites.map((site) => (
              <tr key={site.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={tdStyle}>
                  {healthIcons[site.healthStatus] || '⚪'} {statusLabels[site.status] || site.status}
                </td>
                <td style={tdStyle}>
                  <a href={`/admin/collections/multistore-sites/${site.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                    {site.name}
                  </a>
                </td>
                <td style={tdStyle}>{site.domain}</td>
                <td style={tdStyle}>{site.totalProductsSynced}</td>
                <td style={tdStyle}>{site.totalOrdersImported}</td>
                <td style={tdStyle}>
                  {site.lastHealthCheck
                    ? new Date(site.lastHealthCheck).toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' })
                    : '—'}
                </td>
              </tr>
            ))}
            {stats.sites.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                  Nog geen webshops geconfigureerd
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Styles
const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '1.25rem',
}
const cardLabelStyle: React.CSSProperties = { fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }
const cardValueStyle: React.CSSProperties = { fontSize: '1.75rem', fontWeight: 800, color: '#1a1a2e', marginTop: '0.25rem' }
const cardSubStyle: React.CSSProperties = { fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.125rem' }
const thStyle: React.CSSProperties = { padding: '0.5rem 0.75rem', fontWeight: 600, color: '#374151' }
const tdStyle: React.CSSProperties = { padding: '0.5rem 0.75rem', color: '#4b5563' }
