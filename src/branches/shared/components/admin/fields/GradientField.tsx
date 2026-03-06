'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

function parseGradient(css: string) {
  const angleMatch = css.match(/(\d+)deg/)
  const hexMatches = css.match(/#[0-9A-Fa-f]{6}/g)
  return {
    angle: angleMatch ? parseInt(angleMatch[1]) : 135,
    color1: hexMatches?.[0] || '#00897B',
    color2: hexMatches?.[1] || '#26A69A',
  }
}

function buildGradient(angle: number, color1: string, color2: string) {
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`
}

const ANGLE_PRESETS = [
  { label: '0', value: 0, icon: '\u2191' },
  { label: '45', value: 45, icon: '\u2197' },
  { label: '90', value: 90, icon: '\u2192' },
  { label: '135', value: 135, icon: '\u2198' },
  { label: '180', value: 180, icon: '\u2193' },
  { label: '225', value: 225, icon: '\u2199' },
  { label: '270', value: 270, icon: '\u2190' },
  { label: '315', value: 315, icon: '\u2196' },
]

export const GradientField: React.FC<any> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })

  const gradient = value || field?.defaultValue || ''
  const parsed = parseGradient(gradient)

  const [angle, setAngle] = React.useState(parsed.angle)
  const [color1, setColor1] = React.useState(parsed.color1)
  const [color2, setColor2] = React.useState(parsed.color2)
  const [rawMode, setRawMode] = React.useState(false)

  // Sync state when value changes externally
  React.useEffect(() => {
    if (value) {
      const p = parseGradient(value)
      setAngle(p.angle)
      setColor1(p.color1)
      setColor2(p.color2)
    }
  }, [value])

  const updateGradient = (newAngle: number, newC1: string, newC2: string) => {
    setAngle(newAngle)
    setColor1(newC1)
    setColor2(newC2)
    setValue(buildGradient(newAngle, newC1, newC2))
  }

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

      {/* Preview bar */}
      <div
        style={{
          height: 48,
          borderRadius: 8,
          background: gradient || 'linear-gradient(135deg, #ccc, #eee)',
          border: '1px solid var(--theme-elevation-100)',
          marginBottom: 10,
        }}
      />

      {!rawMode ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {/* Color 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--theme-elevation-500)' }}>Start</span>
              <input
                type="color"
                value={color1}
                onChange={(e) => updateGradient(angle, e.target.value, color2)}
                style={{
                  width: 36,
                  height: 36,
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 6,
                  padding: 2,
                  cursor: 'pointer',
                  background: 'transparent',
                }}
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => {
                  setColor1(e.target.value)
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    updateGradient(angle, e.target.value, color2)
                  }
                }}
                style={{
                  width: 80,
                  padding: '6px 8px',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 4,
                  background: 'var(--theme-input-bg)',
                  color: 'var(--theme-elevation-800)',
                }}
              />
            </div>

            {/* Color 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--theme-elevation-500)' }}>Eind</span>
              <input
                type="color"
                value={color2}
                onChange={(e) => updateGradient(angle, color1, e.target.value)}
                style={{
                  width: 36,
                  height: 36,
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 6,
                  padding: 2,
                  cursor: 'pointer',
                  background: 'transparent',
                }}
              />
              <input
                type="text"
                value={color2}
                onChange={(e) => {
                  setColor2(e.target.value)
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    updateGradient(angle, color1, e.target.value)
                  }
                }}
                style={{
                  width: 80,
                  padding: '6px 8px',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 4,
                  background: 'var(--theme-input-bg)',
                  color: 'var(--theme-elevation-800)',
                }}
              />
            </div>

            {/* Angle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--theme-elevation-500)' }}>Hoek</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {ANGLE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => updateGradient(preset.value, color1, color2)}
                    title={`${preset.value}\u00B0`}
                    style={{
                      width: 28,
                      height: 28,
                      border:
                        angle === preset.value
                          ? '2px solid var(--theme-elevation-800)'
                          : '1px solid var(--theme-elevation-150)',
                      borderRadius: 4,
                      background:
                        angle === preset.value ? 'var(--theme-elevation-50)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--theme-elevation-600)',
                    }}
                  >
                    {preset.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRawMode(true)}
            style={{
              marginTop: 8,
              fontSize: 11,
              color: 'var(--theme-elevation-400)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            CSS handmatig bewerken
          </button>
        </>
      ) : (
        <>
          <textarea
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            rows={2}
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: 12,
              fontFamily: 'monospace',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: 6,
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-elevation-800)',
              resize: 'vertical',
            }}
          />
          <button
            type="button"
            onClick={() => setRawMode(false)}
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
            Terug naar visuele editor
          </button>
        </>
      )}
    </div>
  )
}
