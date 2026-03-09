'use client'

import React, { useCallback, useEffect, useState } from 'react'
import type { SegmentListProps } from './types'
import type { EmailSegment } from '../../lib/segmentation/types'
import { SegmentCard } from '../SegmentCard'

export function SegmentList({ onEdit }: SegmentListProps) {
  const [segments, setSegments] = useState<EmailSegment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSegments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/email-marketing/segments')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Fout bij ophalen segmenten')
      }
      const data = await res.json()
      setSegments(data.segments || [])
    } catch (err: any) {
      setError(err.message || 'Fout bij ophalen segmenten')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSegments()
  }, [fetchSegments])

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm('Weet je zeker dat je dit segment wilt verwijderen?')) return

      try {
        const res = await fetch(`/api/email-marketing/segments/${id}`, {
          method: 'DELETE',
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Fout bij verwijderen')
        }
        // Re-fetch after delete
        fetchSegments()
      } catch (err: any) {
        alert(err.message || 'Fout bij verwijderen segment')
      }
    },
    [fetchSegments],
  )

  const handleDuplicate = useCallback(
    async (segment: EmailSegment) => {
      try {
        const res = await fetch('/api/email-marketing/segments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `${segment.title} (kopie)`,
            description: segment.description,
            conditions: segment.conditions,
            conditionLogic: segment.conditionLogic,
            autoSync: false,
            status: 'active',
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Fout bij dupliceren')
        }
        // Re-fetch after duplicate
        fetchSegments()
      } catch (err: any) {
        alert(err.message || 'Fout bij dupliceren segment')
      }
    },
    [fetchSegments],
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <span className="ml-3 text-sm text-gray-500">Segmenten laden...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Segmenten</h2>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(0)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Nieuw segment
          </button>
        )}
      </div>

      {/* Segment cards */}
      {segments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-3 text-sm font-medium text-gray-900">Geen segmenten</h3>
          <p className="mt-1 text-sm text-gray-500">
            Maak een segment aan om abonnees te groeperen op basis van gedrag en kenmerken.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment) => (
            <SegmentCard
              key={segment.id}
              segment={segment}
              onEdit={onEdit ? () => onEdit(segment.id) : undefined}
              onDuplicate={() => handleDuplicate(segment)}
              onDelete={() => handleDelete(segment.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
