'use client'

import React, { useCallback } from 'react'
import type { SegmentGroupBlockProps } from './types'
import type { SegmentCondition } from '../../lib/segmentation/types'
import { SegmentConditionRow } from '../SegmentConditionRow'

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

function createEmptyCondition(): SegmentCondition {
  return {
    id: generateId(),
    field: 'email',
    operator: 'contains',
    value: '',
  }
}

export function SegmentGroupBlock({ group, onChange, onDelete, index }: SegmentGroupBlockProps) {
  const conditions = group.conditions || []

  const handleToggleLogic = useCallback(() => {
    onChange({
      ...group,
      logic: group.logic === 'and' ? 'or' : 'and',
    })
  }, [group, onChange])

  const handleAddCondition = useCallback(() => {
    onChange({
      ...group,
      conditions: [...conditions, createEmptyCondition()],
    })
  }, [group, conditions, onChange])

  const handleConditionChange = useCallback(
    (condIndex: number, updatedCondition: SegmentCondition) => {
      const updated = [...conditions]
      updated[condIndex] = updatedCondition
      onChange({ ...group, conditions: updated })
    },
    [group, conditions, onChange],
  )

  const handleConditionDelete = useCallback(
    (condIndex: number) => {
      const updated = conditions.filter((_, i) => i !== condIndex)
      onChange({ ...group, conditions: updated })
    },
    [group, conditions, onChange],
  )

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Group header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Groep {index + 1}</span>
          <button
            type="button"
            onClick={handleToggleLogic}
            className="rounded border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            {group.logic === 'and' ? 'EN' : 'OF'}
          </button>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          title="Groep verwijderen"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Conditions */}
      <div className="space-y-2 p-4">
        {conditions.map((condition, condIndex) => (
          <React.Fragment key={condition.id}>
            {condIndex > 0 && (
              <div className="py-1 text-center text-xs font-medium text-gray-400">
                {group.logic === 'and' ? 'EN' : 'OF'}
              </div>
            )}
            <SegmentConditionRow
              condition={condition}
              onChange={(updated) => handleConditionChange(condIndex, updated)}
              onDelete={() => handleConditionDelete(condIndex)}
            />
          </React.Fragment>
        ))}

        {conditions.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">
            Geen voorwaarden. Voeg een voorwaarde toe.
          </p>
        )}

        {/* Add condition button */}
        <button
          type="button"
          onClick={handleAddCondition}
          className="mt-2 flex w-full items-center justify-center rounded border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600"
        >
          + Voorwaarde toevoegen
        </button>
      </div>
    </div>
  )
}
