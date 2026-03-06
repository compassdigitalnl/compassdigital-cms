'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

export const ColorPickerField: React.FC<any> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })

  const color = value || field?.defaultValue || '#000000'

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          display: 'block',
          marginBottom: 4,
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--theme-elevation-800)',
        }}
      >
        {field?.label || path}
      </label>
      {field?.admin?.description && (
        <p
          style={{
            fontSize: 12,
            color: 'var(--theme-elevation-500)',
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          {field.admin.description}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="color"
          value={color.startsWith('#') ? color : '#000000'}
          onChange={handleColorInput}
          style={{
            width: 40,
            height: 40,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 6,
            padding: 2,
            cursor: 'pointer',
            background: 'transparent',
          }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={handleTextInput}
          placeholder={field?.defaultValue || '#000000'}
          style={{
            flex: 1,
            maxWidth: 140,
            padding: '8px 10px',
            fontSize: 13,
            fontFamily: 'monospace',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 6,
            background: 'var(--theme-input-bg)',
            color: 'var(--theme-elevation-800)',
          }}
        />
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            border: '1px solid var(--theme-elevation-150)',
            background: color,
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  )
}
