'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

const SHADOW_PRESETS = [
  { label: 'Geen', value: 'none' },
  { label: 'Subtiel', value: '0 1px 3px rgba(10, 22, 40, 0.06)' },
  { label: 'Licht', value: '0 2px 8px rgba(10, 22, 40, 0.08)' },
  { label: 'Medium', value: '0 4px 20px rgba(10, 22, 40, 0.08)' },
  { label: 'Sterk', value: '0 8px 40px rgba(10, 22, 40, 0.12)' },
  { label: 'Zwaar', value: '0 20px 60px rgba(10, 22, 40, 0.16)' },
]

export const ShadowPreviewField: React.FC<any> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const [customMode, setCustomMode] = React.useState(false)

  const isPreset = SHADOW_PRESETS.some((p) => p.value === value)

  return (
    <div style={{ marginBottom: '1.25rem' }}>
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
        <p style={{ fontSize: 12, color: 'var(--theme-elevation-500)', margin: '0 0 8px' }}>
          {field.admin.description}
        </p>
      )}

      {/* Preview */}
      <div
        style={{
          display: 'inline-block',
          width: 120,
          height: 60,
          borderRadius: 8,
          background: '#fff',
          boxShadow: value || 'none',
          border: '1px solid var(--theme-elevation-50)',
          marginBottom: 10,
        }}
      />

      {!customMode ? (
        <>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {SHADOW_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setValue(preset.value)}
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  border:
                    value === preset.value
                      ? '2px solid var(--theme-elevation-800)'
                      : '1px solid var(--theme-elevation-150)',
                  borderRadius: 4,
                  background: value === preset.value ? 'var(--theme-elevation-50)' : 'transparent',
                  cursor: 'pointer',
                  color: 'var(--theme-elevation-700)',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCustomMode(true)}
            style={{
              marginTop: 6,
              fontSize: 11,
              color: 'var(--theme-elevation-400)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Eigen waarde invoeren
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0 4px 20px rgba(10, 22, 40, 0.08)"
            style={{
              width: '100%',
              maxWidth: 400,
              padding: '8px 10px',
              fontSize: 12,
              fontFamily: 'monospace',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: 6,
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-elevation-800)',
            }}
          />
          <button
            type="button"
            onClick={() => setCustomMode(false)}
            style={{
              marginTop: 6,
              marginLeft: 8,
              fontSize: 11,
              color: 'var(--theme-elevation-400)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Terug naar presets
          </button>
        </>
      )}
    </div>
  )
}
