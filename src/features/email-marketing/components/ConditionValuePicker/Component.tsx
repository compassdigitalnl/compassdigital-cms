'use client'

import React, { useCallback, useMemo } from 'react'
import type { ConditionValuePickerProps } from './types'
import { getFieldDefinition } from '../../lib/segmentation/condition-types'

const INPUT_CLASSES =
  'w-full rounded border border-grey-light bg-white px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal'

export function ConditionValuePicker({
  field,
  operator,
  value,
  valueEnd,
  onChange,
}: ConditionValuePickerProps) {
  const fieldDef = getFieldDefinition(field)
  const fieldType = fieldDef?.type || 'text'
  const isBetween = operator === 'between'
  const isMulti = operator === 'in' || operator === 'not_in'

  // Convert array value to comma-separated string for display
  const displayValue = useMemo(() => {
    if (Array.isArray(value)) return value.join(', ')
    return String(value ?? '')
  }, [value])

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = e.target.value === '' ? '' : Number(e.target.value)
      onChange(num)
    },
    [onChange],
  )

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  const handleMultiChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Split comma-separated values
      const parts = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
      onChange(parts)
    },
    [onChange],
  )

  const handleEndValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = fieldType === 'number'
        ? (e.target.value === '' ? '' : Number(e.target.value))
        : e.target.value
      onChange(value, val)
    },
    [value, fieldType, onChange],
  )

  // Select field with options
  if (fieldType === 'select' && fieldDef?.options && !isMulti) {
    return (
      <select
        value={String(value ?? '')}
        onChange={handleSelectChange}
        className={INPUT_CLASSES}
      >
        <option value="">Selecteer...</option>
        {fieldDef.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }

  // Multi-value input (in / not_in)
  if (isMulti) {
    return (
      <input
        type="text"
        value={displayValue}
        onChange={handleMultiChange}
        placeholder="waarde1, waarde2, waarde3"
        className={INPUT_CLASSES}
      />
    )
  }

  // Between operator — two inputs
  if (isBetween) {
    const inputType = fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'
    return (
      <div className="flex items-center gap-2">
        <input
          type={inputType}
          value={String(value ?? '')}
          onChange={fieldType === 'number' ? handleNumberChange : fieldType === 'date' ? handleDateChange : handleTextChange}
          placeholder="Van"
          className={INPUT_CLASSES}
        />
        <span className="shrink-0 text-sm text-grey-mid">en</span>
        <input
          type={inputType}
          value={String(valueEnd ?? '')}
          onChange={handleEndValueChange}
          placeholder="Tot"
          className={INPUT_CLASSES}
        />
      </div>
    )
  }

  // Date field
  if (fieldType === 'date') {
    return (
      <input
        type="date"
        value={String(value ?? '')}
        onChange={handleDateChange}
        className={INPUT_CLASSES}
      />
    )
  }

  // Number field
  if (fieldType === 'number') {
    return (
      <input
        type="number"
        value={String(value ?? '')}
        onChange={handleNumberChange}
        placeholder="Waarde"
        step="any"
        className={INPUT_CLASSES}
      />
    )
  }

  // Default: text field
  return (
    <input
      type="text"
      value={String(value ?? '')}
      onChange={handleTextChange}
      placeholder="Waarde"
      className={INPUT_CLASSES}
    />
  )
}
