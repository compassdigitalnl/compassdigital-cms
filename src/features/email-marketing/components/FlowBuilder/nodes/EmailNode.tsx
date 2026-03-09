'use client'

import type { NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'

export function EmailNode({ data, selected }: NodeProps) {
  const d = data as any
  const templateName = typeof d.emailTemplate === 'object'
    ? d.emailTemplate?.name || 'Template geselecteerd'
    : d.emailTemplate ? 'Template ID: ' + d.emailTemplate : 'Geen template'

  return (
    <BaseNode
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
      title={d.name || 'E-mail versturen'}
      color="#3b82f6"
      bgColor="#eff6ff"
      selected={selected}
    >
      <div className="truncate">{templateName}</div>
    </BaseNode>
  )
}
