'use client'

import type { NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'

const UNIT_LABELS: Record<string, string> = {
  hours: 'uur',
  days: 'dagen',
  weeks: 'weken',
}

export function WaitNode({ data, selected }: NodeProps) {
  const d = data as any
  const duration = d.waitDuration || { value: 1, unit: 'days' }

  return (
    <BaseNode
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      title={d.name || 'Wachten'}
      subtitle={`${duration.value} ${UNIT_LABELS[duration.unit] || duration.unit}`}
      color="#f59e0b"
      bgColor="#fffbeb"
      selected={selected}
    />
  )
}
