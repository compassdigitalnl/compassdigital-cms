'use client'

import React, { useCallback, useMemo } from 'react'
import type { SegmentConditionRowProps } from './types'
import type { ConditionField, ConditionOperator } from '../../lib/segmentation/types'
import { CONDITION_FIELDS, getFieldDefinition, getFieldGroups } from '../../lib/segmentation/condition-types'
import { OPERATORS } from '../../lib/segmentation/operators'
import { ConditionValuePicker } from '../ConditionValuePicker'

export function SegmentConditionRow({ condition, onChange, onDelete }: SegmentConditionRowProps) {
  const fieldDef = getFieldDefinition(condition.field)
  const groups = useMemo(() => getFieldGroups(), [])

  // Get allowed operators for the selected field
  const allowedOperators = useMemo(() => {
    if (!fieldDef) return Object.keys(OPERATORS) as ConditionOperator[]
    return fieldDef.operators
  }, [fieldDef])

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newField = e.target.value as ConditionField
      const newFieldDef = getFieldDefinition(newField)
      // Reset operator and value when field changes
      const defaultOp = newFieldDef?.operators[0] || 'equals'
      onChange({
        ...condition,
        field: newField,
        operator: defaultOp,
        value: '',
        valueEnd: undefined,
      })
    },
    [condition, onChange],
  )

  const handleOperatorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newOp = e.target.value as ConditionOperator
      onChange({
        ...condition,
        operator: newOp,
        // Reset valueEnd if operator is not 'between'
        valueEnd: newOp === 'between' ? condition.valueEnd : undefined,
      })
    },
    [condition, onChange],
  )

  const handleValueChange = useCallback(
    (value: any, valueEnd?: any) => {
      onChange({
        ...condition,
        value,
        valueEnd,
      })
    },
    [condition, onChange],
  )

  const operatorDef = OPERATORS[condition.operator]
  const showValue = operatorDef?.requiresValue !== false

  return (
    <div className="flex items-start gap-2">
      {/* Field select */}
      <select
        value={condition.field}
        onChange={handleFieldChange}
        className="w-44 shrink-0 rounded border border-grey-light bg-white px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
      >
        {groups.map((group) => (
          <optgroup key={group} label={group}>
            {CONDITION_FIELDS.filter((f) => f.group === group).map((f) => (
              <option key={f.field} value={f.field}>
                {f.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* Operator select */}
      <select
        value={condition.operator}
        onChange={handleOperatorChange}
        className="w-40 shrink-0 rounded border border-grey-light bg-white px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
      >
        {allowedOperators.map((op) => (
          <option key={op} value={op}>
            {OPERATORS[op]?.label || op}
          </option>
        ))}
      </select>

      {/* Value picker */}
      {showValue && (
        <div className="min-w-0 flex-1">
          <ConditionValuePicker
            field={condition.field}
            operator={condition.operator}
            value={condition.value}
            valueEnd={condition.valueEnd}
            onChange={handleValueChange}
          />
        </div>
      )}

      {/* Delete button */}
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 rounded p-2 text-grey-mid transition-colors hover:bg-coral-50 hover:text-coral"
        title="Voorwaarde verwijderen"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
