'use client'

import React from 'react'
import { Clock, Check, X, MessageSquare } from 'lucide-react'
import type { ApprovalTimelineProps } from './types'

const ICONS = {
  created: Clock,
  approved: Check,
  rejected: X,
  expired: Clock,
  note: MessageSquare,
}

const COLORS = {
  created: 'var(--color-info)',
  approved: 'var(--color-success)',
  rejected: 'var(--color-error)',
  expired: 'var(--color-grey-mid)',
  note: 'var(--color-primary)',
}

const TYPE_LABELS = {
  created: 'Aangevraagd',
  approved: 'Goedgekeurd',
  rejected: 'Afgewezen',
  expired: 'Verlopen',
  note: 'Opmerking',
}

export function ApprovalTimeline({ events }: ApprovalTimelineProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Tijdlijn</h3>

      <div className="space-y-0">
        {events.map((event, i) => {
          const Icon = ICONS[event.type]
          const color = COLORS[event.type]
          const isLast = i === events.length - 1
          const dateStr = new Date(event.date).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: color, opacity: 0.15 }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                {!isLast && <div className="w-px flex-1 bg-gray-200 my-1" />}
              </div>

              <div className="pb-4">
                <div className="text-sm font-semibold text-gray-900">{TYPE_LABELS[event.type]}</div>
                {event.user && <div className="text-xs text-gray-500 mt-0.5">Door {event.user}</div>}
                {event.message && (
                  <div className="text-xs text-gray-500 mt-1 italic">&ldquo;{event.message}&rdquo;</div>
                )}
                <div className="text-[10px] text-gray-400 mt-1">{dateStr}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
