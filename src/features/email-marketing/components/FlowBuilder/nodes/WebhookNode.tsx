'use client'

import type { NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'

export function WebhookNode({ data, selected }: NodeProps) {
  const d = data as any

  return (
    <BaseNode
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      }
      title={d.name || 'Webhook'}
      color="#6366f1"
      bgColor="#eef2ff"
      selected={selected}
    >
      <div className="truncate font-mono text-[10px]">
        {d.webhookUrl || 'Geen URL ingesteld'}
      </div>
    </BaseNode>
  )
}
