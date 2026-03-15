'use client'

import React, { useState, useEffect } from 'react'

interface Stats {
  totalOpen: number
  totalInProgress: number
  totalResolved: number
  avgResponseHours: number | null
  avgResolutionHours: number | null
  avgRating: number | null
}

interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  status: string
  priority: string
  customer?: { firstName?: string; lastName?: string; email?: string } | null
  assignedTo?: { firstName?: string; lastName?: string } | null
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In behandeling',
  waiting_customer: 'Wacht op klant',
  waiting_agent: 'Wacht op agent',
  resolved: 'Opgelost',
  closed: 'Gesloten',
}

const PRIORITY_COLORS: Record<string, string> = {
  low: '#6b7280',
  normal: '#3b82f6',
  high: '#f59e0b',
  urgent: '#ef4444',
}

export function SupportDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filter, setFilter] = useState<string>('open')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch open/in-progress tickets as queue
        const params = new URLSearchParams({ limit: '25' })
        if (filter !== 'all') params.set('status', filter)

        const res = await fetch(`/api/support/tickets?${params}`)
        const data = await res.json()
        if (data.success) {
          setTickets(data.docs)
        }

        // Fetch stats via Payload REST API
        const [openRes, progressRes, resolvedRes] = await Promise.all([
          fetch('/api/support-tickets?where[status][equals]=open&limit=0'),
          fetch('/api/support-tickets?where[status][equals]=in_progress&limit=0'),
          fetch('/api/support-tickets?where[status][equals]=resolved&limit=0'),
        ])
        const [openData, progressData, resolvedData] = await Promise.all([
          openRes.json(), progressRes.json(), resolvedRes.json(),
        ])

        setStats({
          totalOpen: openData.totalDocs || 0,
          totalInProgress: progressData.totalDocs || 0,
          totalResolved: resolvedData.totalDocs || 0,
          avgResponseHours: null,
          avgResolutionHours: null,
          avgRating: null,
        })
      } catch (err) {
        console.error('[SupportDashboard] Failed to load:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filter])

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ background: '#f3f4f6', borderRadius: '8px', height: '80px', animation: 'pulse 2s infinite' }} />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Open" value={stats?.totalOpen ?? 0} color="#3b82f6" />
        <StatCard label="In behandeling" value={stats?.totalInProgress ?? 0} color="#f59e0b" />
        <StatCard label="Opgelost" value={stats?.totalResolved ?? 0} color="#10b981" />
        <StatCard label="Gem. beoordeling" value={stats?.avgRating ? `${stats.avgRating.toFixed(1)}/5` : '-'} color="#8b5cf6" />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['all', 'open', 'in_progress', 'waiting_agent', 'waiting_customer', 'resolved'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              background: filter === s ? '#1a1a2e' : '#f3f4f6',
              color: filter === s ? '#fff' : '#374151',
            }}
          >
            {s === 'all' ? 'Alle' : STATUS_LABELS[s] || s}
          </button>
        ))}
      </div>

      {/* Ticket queue table */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Ticket</th>
              <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Onderwerp</th>
              <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Klant</th>
              <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Prioriteit</th>
              <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Agent</th>
              <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontWeight: 600 }}>Datum</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Geen tickets gevonden</td></tr>
            ) : (
              tickets.map((t) => {
                const customerName = t.customer
                  ? [t.customer.firstName, t.customer.lastName].filter(Boolean).join(' ') || t.customer.email || '-'
                  : '-'
                const agentName = t.assignedTo
                  ? [t.assignedTo.firstName, t.assignedTo.lastName].filter(Boolean).join(' ') || '-'
                  : '-'

                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                    onClick={() => window.location.href = `/admin/collections/support-tickets/${t.id}`}
                  >
                    <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{t.ticketNumber}</td>
                    <td style={{ padding: '0.5rem 0.75rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>{customerName}</td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                      <span style={{ fontSize: '0.7rem', padding: '0.125rem 0.5rem', borderRadius: '999px', background: '#f3f4f6', fontWeight: 500 }}>
                        {STATUS_LABELS[t.status] || t.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                      <span style={{ color: PRIORITY_COLORS[t.priority] || '#6b7280', fontWeight: t.priority === 'urgent' ? 700 : 400 }}>
                        {t.priority}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>{agentName}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#9ca3af', fontSize: '0.75rem' }}>
                      {new Date(t.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
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

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem 1.25rem', border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
    </div>
  )
}
