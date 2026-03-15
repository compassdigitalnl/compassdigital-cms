'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { ReactNode } from 'react'

interface BaseNodeProps {
  icon: ReactNode
  title: string
  subtitle?: string
  color: string
  bgColor: string
  children?: ReactNode
  selected?: boolean
  hasSourceHandle?: boolean
  hasTargetHandle?: boolean
}

export function BaseNode({
  icon,
  title,
  subtitle,
  color,
  bgColor,
  children,
  selected,
  hasSourceHandle = true,
  hasTargetHandle = true,
}: BaseNodeProps) {
  return (
    <div
      className="rounded-xl shadow-md min-w-[220px] max-w-[260px] transition-shadow"
      style={{
        background: 'white',
        border: `2px solid ${selected ? color : '#e5e7eb'}`,
        boxShadow: selected ? `0 0 0 2px ${color}40` : undefined,
      }}
    >
      {hasTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !border-2 !border-white"
          style={{ background: color }}
        />
      )}

      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-t-[10px]"
        style={{ background: bgColor }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: color, color: 'white' }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate" style={{ color }}>
            {title}
          </div>
          {subtitle && (
            <div className="text-[10px] text-grey-mid truncate">{subtitle}</div>
          )}
        </div>
      </div>

      {/* Body */}
      {children && <div className="px-3 py-2 text-xs text-grey-dark">{children}</div>}

      {hasSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !border-2 !border-white"
          style={{ background: color }}
        />
      )}
    </div>
  )
}
