'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'

export function ExitNode({ data, selected }: NodeProps) {
  const d = data as any

  return (
    <div
      className="rounded-full px-5 py-3 shadow-md min-w-[140px] text-center transition-shadow"
      style={{
        background: selected ? '#fef2f2' : '#fff',
        border: `2px solid ${selected ? '#ef4444' : '#fca5a5'}`,
        boxShadow: selected ? '0 0 0 2px rgba(239,68,68,0.2)' : undefined,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2 !border-white"
        style={{ background: '#ef4444' }}
      />

      <div className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
        <span className="text-sm font-bold text-red-600">{d.name || 'Einde'}</span>
      </div>
      {d.exitReason && (
        <div className="text-[10px] text-gray-500 mt-1">{d.exitReason}</div>
      )}
    </div>
  )
}
