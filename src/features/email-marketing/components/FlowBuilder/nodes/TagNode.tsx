'use client'

import type { NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'

export function TagNode({ data, selected }: NodeProps) {
  const d = data as any
  const isRemove = d.type === 'remove_tag'

  return (
    <BaseNode
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      }
      title={d.name || (isRemove ? 'Tag verwijderen' : 'Tag toevoegen')}
      subtitle={d.tagName || 'Geen tag'}
      color="#10b981"
      bgColor="#ecfdf5"
      selected={selected}
    />
  )
}
