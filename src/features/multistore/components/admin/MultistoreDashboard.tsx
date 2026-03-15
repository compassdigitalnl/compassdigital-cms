'use client'

import React, { useEffect, useState, useCallback } from 'react'

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

interface SyncLogEntry {
  id: number
  site: { name: string } | null
  direction: string
  entityType: string
  operation: string
  status: string
  duration: number | null
  error: string | null
  createdAt: string
  summary: string | null
}

interface DashboardData {
  sites: SiteStats[]
  totalOrders: number
  totalProducts: number
  syncLogs: SyncLogEntry[]
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'zojuist'
  if (mins < 60) return `${mins} min geleden`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} uur geleden`
  const days = Math.floor(hours / 24)
  return `${days} dag${days > 1 ? 'en' : ''} geleden`
}

function formatDuration(ms: number | null): string {
  if (!ms) return ''
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export function MultistoreDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [sitesRes, ordersRes, productsRes, logsRes] = await Promise.all([
        fetch('/api/multistore-sites?limit=100&depth=0'),
        fetch('/api/orders?limit=0&depth=0&where[sourceSite][exists]=true'),
        fetch('/api/products?limit=0&depth=0&where[multistoreSyncEnabled][equals]=true'),
        fetch('/api/sync-log?limit=10&depth=1&sort=-createdAt'),
      ])

      if (!sitesRes.ok) throw new Error('Kan webshops niet ophalen')

      const sitesData = await sitesRes.json()
      const ordersData = ordersRes.ok ? await ordersRes.json() : { totalDocs: 0 }
      const productsData = productsRes.ok ? await productsRes.json() : { totalDocs: 0 }
      const logsData = logsRes.ok ? await logsRes.json() : { docs: [] }

      const sites: SiteStats[] = sitesData.docs.map((s: any) => ({
        id: s.id,
        name: s.name,
        domain: s.domain,
        status: s.status,
        healthStatus: s.healthStatus || 'unknown',
        totalProductsSynced: s.totalProductsSynced || 0,
        totalOrdersImported: s.totalOrdersImported || 0,
        lastHealthCheck: s.lastHealthCheck,
      }))

      const syncLogs: SyncLogEntry[] = (logsData.docs || []).map((l: any) => ({
        id: l.id,
        site: typeof l.site === 'object' ? l.site : null,
        direction: l.direction,
        entityType: l.entityType,
        operation: l.operation,
        status: l.status,
        duration: l.duration,
        error: l.error,
        createdAt: l.createdAt,
        summary: l.summary,
      }))

      setData({
        sites,
        totalOrders: ordersData.totalDocs,
        totalProducts: productsData.totalDocs,
        syncLogs,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="ms-loading">
        <div className="ms-spinner" />
        Dashboard laden...
      </div>
    )
  }

  if (error) {
    return <div className="ms-error">{error}</div>
  }

  if (!data) return null

  const activeSites = data.sites.filter((s) => s.status === 'active').length
  const healthySites = data.sites.filter((s) => s.healthStatus === 'healthy').length
  const healthPct = data.sites.length > 0 ? Math.round((healthySites / data.sites.length) * 100) : 0

  const healthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'green'
      case 'degraded': return 'amber'
      case 'down': return 'red'
      default: return 'gray'
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actief'
      case 'paused': return 'Gepauzeerd'
      case 'disconnected': return 'Niet verbonden'
      case 'error': return 'Fout'
      default: return status
    }
  }

  const syncLogIcon = (status: string) => {
    switch (status) {
      case 'success': return { class: 'success', icon: '✓' }
      case 'failed': return { class: 'error', icon: '✗' }
      case 'skipped': return { class: 'pending', icon: '—' }
      default: return { class: 'info', icon: '↻' }
    }
  }

  return (
    <div className="ms-page">
      {/* KPI Cards */}
      <div className="ms-kpi-grid">
        <div className="ms-kpi">
          <div className="ms-kpi__top">
            <span className="ms-kpi__label">Webshops</span>
            <span className="ms-kpi__icon ms-kpi__icon--teal">🏪</span>
          </div>
          <div className="ms-kpi__value">{activeSites}</div>
          <div className="ms-kpi__footer">
            <span className="ms-kpi__sub">van {data.sites.length} totaal</span>
          </div>
        </div>

        <div className="ms-kpi">
          <div className="ms-kpi__top">
            <span className="ms-kpi__label">Bestellingen</span>
            <span className="ms-kpi__icon ms-kpi__icon--blue">📦</span>
          </div>
          <div className="ms-kpi__value">{data.totalOrders}</div>
          <div className="ms-kpi__footer">
            <span className="ms-kpi__sub">van alle webshops</span>
          </div>
        </div>

        <div className="ms-kpi">
          <div className="ms-kpi__top">
            <span className="ms-kpi__label">Producten</span>
            <span className="ms-kpi__icon ms-kpi__icon--green">🔄</span>
          </div>
          <div className="ms-kpi__value">{data.totalProducts}</div>
          <div className="ms-kpi__footer">
            <span className="ms-kpi__sub">sync ingeschakeld</span>
          </div>
        </div>

        <div className="ms-kpi">
          <div className="ms-kpi__top">
            <span className="ms-kpi__label">Sync Health</span>
            <span className="ms-kpi__icon ms-kpi__icon--amber">💚</span>
          </div>
          <div className="ms-kpi__value">{healthPct}%</div>
          <div className="ms-kpi__footer">
            <span className="ms-kpi__sub">{healthySites} van {data.sites.length} healthy</span>
          </div>
        </div>
      </div>

      {/* Main content: Sites + Sync Log */}
      <div className="ms-grid ms-grid--60-40">
        {/* Sites */}
        <div className="ms-section">
          <div className="ms-section__header">
            <h2 className="ms-section__title">Webshops</h2>
            <a href="/admin/collections/multistore-sites" className="ms-section__link">
              Alles bekijken →
            </a>
          </div>

          {data.sites.length === 0 ? (
            <div className="ms-empty">
              <div className="ms-empty__icon">🏪</div>
              <div className="ms-empty__text">Nog geen webshops geconfigureerd</div>
              <a href="/admin/collections/multistore-sites/create" className="ms-btn ms-btn--primary ms-btn--sm">
                Webshop toevoegen
              </a>
            </div>
          ) : (
            <div className="ms-sites-grid">
              {data.sites.map((site) => (
                <a
                  key={site.id}
                  href={`/admin/collections/multistore-sites/${site.id}`}
                  className="ms-site-card"
                >
                  <div className="ms-site-card__top">
                    <div>
                      <div className="ms-site-card__name">{site.name}</div>
                      <div className="ms-site-card__domain">{site.domain}</div>
                    </div>
                    <span className={`ms-pill ms-pill--${healthColor(site.healthStatus)}`}>
                      <span className={`ms-pill__dot ms-pill__dot--${healthColor(site.healthStatus)}`} />
                      {statusLabel(site.status)}
                    </span>
                  </div>
                  <div className="ms-site-card__stats">
                    <div className="ms-site-card__stat">
                      <div className="ms-site-card__stat-value">{site.totalProductsSynced}</div>
                      <div className="ms-site-card__stat-label">Producten</div>
                    </div>
                    <div className="ms-site-card__stat">
                      <div className="ms-site-card__stat-value">{site.totalOrdersImported}</div>
                      <div className="ms-site-card__stat-label">Orders</div>
                    </div>
                    <div className="ms-site-card__stat">
                      <div className="ms-site-card__stat-value">
                        {site.lastHealthCheck ? formatTimeAgo(site.lastHealthCheck) : '—'}
                      </div>
                      <div className="ms-site-card__stat-label">Laatste check</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Sync Activity Log */}
        <div className="ms-section">
          <div className="ms-section__header">
            <h2 className="ms-section__title">Sync Activiteit</h2>
            <span className="ms-live">
              <span className="ms-live__dot" />
              Live
            </span>
          </div>

          <div className="ms-card">
            <div className="ms-card__body">
              {data.syncLogs.length === 0 ? (
                <div className="ms-empty">
                  <div className="ms-empty__text">Nog geen sync activiteit</div>
                </div>
              ) : (
                <ul className="ms-sync-log">
                  {data.syncLogs.map((log) => {
                    const iconInfo = syncLogIcon(log.status)
                    return (
                      <li key={log.id} className="ms-sync-log__item">
                        <span className={`ms-sync-log__icon ms-sync-log__icon--${iconInfo.class}`}>
                          {iconInfo.icon}
                        </span>
                        <div className="ms-sync-log__content">
                          <div className="ms-sync-log__text">
                            {log.summary || (
                              <>
                                <strong>{log.site?.name || 'Onbekend'}</strong>
                                {' — '}
                                {log.entityType} {log.operation}
                              </>
                            )}
                          </div>
                          <div className="ms-sync-log__time">
                            {formatTimeAgo(log.createdAt)}
                            {log.error && (
                              <> — <span style={{ color: '#ef4444' }}>{log.error}</span></>
                            )}
                          </div>
                        </div>
                        {log.duration != null && (
                          <span className="ms-sync-log__duration">
                            {formatDuration(log.duration)}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
