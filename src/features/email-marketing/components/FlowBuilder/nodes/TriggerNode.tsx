'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'

const TRIGGER_LABELS: Record<string, string> = {
  'user.signup': 'Nieuwe gebruiker',
  'subscriber.added': 'Nieuwe subscriber',
  'subscriber.confirmed': 'Subscriber bevestigd',
  'order.placed': 'Bestelling geplaatst',
  'cart.abandoned': 'Verlaten winkelwagen',
  'email.clicked': 'E-mail klik',
  'custom.event': 'Custom event',
}

export function TriggerNode({ data, selected }: NodeProps) {
  const triggerType = (data as any).eventType || ''
  const label = TRIGGER_LABELS[triggerType] || 'Trigger'

  return (
    <div
      className="rounded-full px-5 py-3 shadow-md min-w-[160px] text-center transition-shadow"
      style={{
        background: 'linear-gradient(135deg, #0a1628, #1a3a5c)',
        border: `2px solid ${selected ? '#14b8a6' : '#0a1628'}`,
        boxShadow: selected ? '0 0 0 2px rgba(20,184,166,0.3)' : undefined,
      }}
    >
      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-sm font-bold text-white">{label}</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2 !border-white"
        style={{ background: '#14b8a6' }}
      />
    </div>
  )
}
