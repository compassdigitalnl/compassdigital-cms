'use client'

import React, { useCallback } from 'react'
import type { SegmentBuilderProps } from './types'
import type { SegmentGroup } from '../../lib/segmentation/types'
import { SegmentGroupBlock } from '../SegmentGroupBlock'

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

function createEmptyGroup(): SegmentGroup {
  return {
    id: generateId(),
    logic: 'and',
    conditions: [],
  }
}

export function SegmentBuilder({ value, onChange }: SegmentBuilderProps) {
  const groups = value.groups || []

  const handleToggleLogic = useCallback(() => {
    onChange({
      ...value,
      logic: value.logic === 'and' ? 'or' : 'and',
    })
  }, [value, onChange])

  const handleAddGroup = useCallback(() => {
    onChange({
      ...value,
      groups: [...groups, createEmptyGroup()],
    })
  }, [value, groups, onChange])

  const handleGroupChange = useCallback(
    (index: number, updatedGroup: SegmentGroup) => {
      const updated = [...groups]
      updated[index] = updatedGroup
      onChange({ ...value, groups: updated })
    },
    [value, groups, onChange],
  )

  const handleGroupDelete = useCallback(
    (index: number) => {
      const updated = groups.filter((_, i) => i !== index)
      onChange({ ...value, groups: updated })
    },
    [value, groups, onChange],
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Segmentvoorwaarden</h3>
      </div>

      {/* Groups */}
      {groups.map((group, index) => (
        <React.Fragment key={group.id}>
          {/* Logic toggle between groups */}
          {index > 0 && (
            <div className="flex items-center justify-center py-2">
              <button
                type="button"
                onClick={handleToggleLogic}
                className="rounded-full border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                {value.logic === 'and' ? 'EN' : 'OF'}
              </button>
            </div>
          )}

          <SegmentGroupBlock
            group={group}
            onChange={(updated) => handleGroupChange(index, updated)}
            onDelete={() => handleGroupDelete(index)}
            index={index}
          />
        </React.Fragment>
      ))}

      {/* Add group button */}
      <button
        type="button"
        onClick={handleAddGroup}
        className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-blue-400 hover:text-blue-600"
      >
        + Groep toevoegen
      </button>
    </div>
  )
}
