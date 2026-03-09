'use client'

import type { NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'

export function ListNode({ data, selected }: NodeProps) {
  const d = data as any
  const isRemove = d.type === 'remove_from_list'

  return (
    <BaseNode
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      }
      title={d.name || (isRemove ? 'Van lijst verwijderen' : 'Aan lijst toevoegen')}
      color="#06b6d4"
      bgColor="#ecfeff"
      selected={selected}
    >
      <div className="truncate">
        {d.list ? (typeof d.list === 'object' ? d.list.name : `Lijst ID: ${d.list}`) : 'Geen lijst geselecteerd'}
      </div>
    </BaseNode>
  )
}
