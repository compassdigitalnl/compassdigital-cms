'use client'

import { useState, useEffect } from 'react'
import type { PromotionStatsProps } from './types'

interface StatsData {
  usedCount: number
  estimatedRevenue: number
  title?: string
}

export function PromotionStats({ promotionId }: PromotionStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const url = promotionId
          ? `/api/promotions/stats?id=${promotionId}`
          : '/api/promotions/stats'

        const res = await fetch(url)
        if (!res.ok) throw new Error('Fout bij ophalen statistieken')

        const data = await res.json()
        setStats(data)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [promotionId])

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">
        {error || 'Geen statistieken beschikbaar'}
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {stats.title && (
        <h4 className="text-sm font-medium text-gray-500 mb-3">{stats.title}</h4>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">Gebruik</span>
          <p className="text-2xl font-bold text-gray-900">{stats.usedCount}</p>
        </div>
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">Geschatte impact</span>
          <p className="text-2xl font-bold text-gray-900">
            &euro;{stats.estimatedRevenue.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
