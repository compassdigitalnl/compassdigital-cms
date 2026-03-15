'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { SegmentPreviewProps } from './types'

export function SegmentPreview({ conditions }: SegmentPreviewProps) {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Check if there are any conditions to evaluate
    const hasConditions =
      conditions?.groups &&
      conditions.groups.length > 0 &&
      conditions.groups.some((g) => g.conditions && g.conditions.length > 0)

    if (!hasConditions) {
      setCount(null)
      setError(null)
      return
    }

    // Debounce 500ms
    debounceTimer.current = setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/email-marketing/segments/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conditions }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Fout bij ophalen preview')
        }

        const data = await res.json()
        setCount(data.count)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        setError(message || 'Fout bij ophalen preview')
        setCount(null)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [conditions])

  return (
    <div className="flex items-center gap-3 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3">
      {/* Icon */}
      <svg className="h-5 w-5 shrink-0 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>

      {/* Content */}
      <div className="flex-1">
        {loading && (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal border-t-transparent" />
            <span className="text-sm text-teal-700">Berekenen...</span>
          </div>
        )}

        {!loading && error && (
          <span className="text-sm text-coral">{error}</span>
        )}

        {!loading && !error && count !== null && (
          <span className="text-sm font-medium text-blue-800">
            ~{count.toLocaleString('nl-NL')} abonnees
          </span>
        )}

        {!loading && !error && count === null && (
          <span className="text-sm text-grey-mid">
            Voeg voorwaarden toe om een preview te zien
          </span>
        )}
      </div>
    </div>
  )
}
