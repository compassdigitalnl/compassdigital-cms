'use client'

import { useCallback, useEffect, useState } from 'react'
import type { InsightsDashboardData } from '../../lib/types'
import type { InsightsDashboardProps } from './types'
import { KPICards } from '../KPICards'
import { SegmentDistribution } from '../SegmentDistribution'
import { ChurnRiskTable } from '../ChurnRiskTable'
import { CLVChart } from '../CLVChart'
import { RFMHeatmap } from '../RFMHeatmap'

export function InsightsDashboard({ className }: InsightsDashboardProps) {
  const [data, setData] = useState<InsightsDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/analytics/customer-insights', { credentials: 'include' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      const json: InsightsDashboardData = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e' }}>Klantinzichten</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>RFM-analyse, segmentatie, CLV en churn-predictie</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: '6rem', background: '#f3f4f6', borderRadius: '0.75rem' }} />
          ))}
        </div>
        <div style={{ height: '16rem', background: '#f3f4f6', borderRadius: '0.75rem', marginBottom: '1.5rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ height: '20rem', background: '#f3f4f6', borderRadius: '0.75rem' }} />
          <div style={{ height: '20rem', background: '#f3f4f6', borderRadius: '0.75rem' }} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e' }}>Klantinzichten</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>RFM-analyse, segmentatie, CLV en churn-predictie</div>
          </div>
          <button
            onClick={fetchData}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: '#7c3aed', color: '#fff', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Opnieuw laden
          </button>
        </div>
        <div style={{ borderRadius: '0.75rem', border: '1px solid #fecaca', background: '#fef2f2', padding: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: '#991b1b' }}>Fout bij laden van klantinzichten: {error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e' }}>Klantinzichten</div>
          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>RFM-analyse, segmentatie, CLV en churn-predictie</div>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: '#7c3aed',
            color: '#fff',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          Vernieuwen
        </button>
      </div>

      <KPICards
        totalCustomers={data.totalCustomers}
        activeCustomers={data.activeCustomers}
        avgClv={data.avgClv}
        churnRate={data.churnRate}
      />

      <SegmentDistribution segments={data.segments} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <CLVChart customers={data.topClv} />
        <RFMHeatmap customers={data.topChurnRisk} />
      </div>

      <ChurnRiskTable customers={data.topChurnRisk} />
    </div>
  )
}
