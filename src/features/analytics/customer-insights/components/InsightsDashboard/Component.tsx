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
      <div className={`space-y-6 ${className || ''}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Klantinzichten</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className || ''}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Klantinzichten</h2>
          <button
            onClick={fetchData}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Opnieuw laden
          </button>
        </div>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Fout bij laden van klantinzichten: {error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Klantinzichten</h2>
        <button
          onClick={fetchData}
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CLVChart customers={data.topClv} />
        <RFMHeatmap customers={data.topChurnRisk} />
      </div>

      <ChurnRiskTable customers={data.topChurnRisk} />
    </div>
  )
}
