'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'

export function ConditionNode({ data, selected }: NodeProps) {
  const d = data as any
  const condition = d.condition || {}
  const summary = condition.field
    ? `${condition.field} ${condition.operator} ${condition.value}`
    : 'Geen voorwaarde'

  return (
    <div
      className="min-w-[220px] max-w-[260px] transition-shadow"
      style={{
        filter: selected ? 'drop-shadow(0 0 4px rgba(168,85,247,0.4))' : undefined,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2 !border-white"
        style={{ background: '#a855f7' }}
      />

      {/* Diamond shape via rotated square */}
      <div
        className="rounded-xl shadow-md overflow-hidden"
        style={{
          background: 'white',
          border: `2px solid ${selected ? '#a855f7' : '#e5e7eb'}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-3 py-2.5" style={{ background: '#faf5ff' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-teal text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-teal truncate">{d.name || 'Voorwaarde'}</div>
            <div className="text-[10px] text-gray-500 truncate">{summary}</div>
          </div>
        </div>

        {/* Two output handles */}
        <div className="flex border-t" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex-1 text-center py-1.5 text-[10px] font-bold text-green border-r" style={{ borderColor: '#e5e7eb', background: '#f0fdf4' }}>
            Ja
          </div>
          <div className="flex-1 text-center py-1.5 text-[10px] font-bold text-coral" style={{ background: '#fef2f2' }}>
            Nee
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="!w-3 !h-3 !border-2 !border-white"
        style={{ background: '#22c55e', left: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="!w-3 !h-3 !border-2 !border-white"
        style={{ background: '#ef4444', left: '70%' }}
      />
    </div>
  )
}
