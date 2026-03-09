'use client'

import React from 'react'
import type { SegmentCardProps } from './types'

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    return new Intl.DateTimeFormat('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export function SegmentCard({ segment, onEdit, onDuplicate, onDelete }: SegmentCardProps) {
  const isArchived = segment.status === 'archived'

  return (
    <div className={`rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md ${isArchived ? 'border-gray-200 opacity-70' : 'border-gray-200'}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-gray-900">{segment.title}</h3>
            {segment.description && (
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">{segment.description}</p>
            )}
          </div>

          {/* Status badge */}
          <span
            className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isArchived
                ? 'bg-gray-100 text-gray-600'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {isArchived ? 'Gearchiveerd' : 'Actief'}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-6">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {(segment.subscriberCount ?? 0).toLocaleString('nl-NL')}
            </span>
            <span className="ml-1 text-sm text-gray-500">abonnees</span>
          </div>
          <div className="text-sm text-gray-400">
            Laatst berekend: {formatDate(segment.lastCalculatedAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Bewerken
            </button>
          )}
          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              className="rounded px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Dupliceren
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="ml-auto rounded px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Verwijderen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
