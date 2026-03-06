'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

const FONT_PRESETS = [
  { label: 'Inter', value: 'Inter, system-ui, sans-serif', google: 'Inter' },
  { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', system-ui, sans-serif", google: 'Plus+Jakarta+Sans' },
  { label: 'DM Sans', value: "'DM Sans', system-ui, sans-serif", google: 'DM+Sans' },
  { label: 'Poppins', value: "'Poppins', system-ui, sans-serif", google: 'Poppins' },
  { label: 'Montserrat', value: "'Montserrat', system-ui, sans-serif", google: 'Montserrat' },
  { label: 'Open Sans', value: "'Open Sans', system-ui, sans-serif", google: 'Open+Sans' },
  { label: 'Lato', value: "'Lato', system-ui, sans-serif", google: 'Lato' },
  { label: 'Roboto', value: "'Roboto', system-ui, sans-serif", google: 'Roboto' },
  { label: 'Nunito', value: "'Nunito', system-ui, sans-serif", google: 'Nunito' },
  { label: 'Raleway', value: "'Raleway', system-ui, sans-serif", google: 'Raleway' },
  { label: 'Source Sans 3', value: "'Source Sans 3', system-ui, sans-serif", google: 'Source+Sans+3' },
  { label: 'Work Sans', value: "'Work Sans', system-ui, sans-serif", google: 'Work+Sans' },
  { label: 'Outfit', value: "'Outfit', system-ui, sans-serif", google: 'Outfit' },
  { label: 'Manrope', value: "'Manrope', system-ui, sans-serif", google: 'Manrope' },
  // Serif
  { label: 'Playfair Display', value: "'Playfair Display', Georgia, serif", google: 'Playfair+Display' },
  { label: 'DM Serif Display', value: "'DM Serif Display', Georgia, serif", google: 'DM+Serif+Display' },
  { label: 'Merriweather', value: "'Merriweather', Georgia, serif", google: 'Merriweather' },
  { label: 'Lora', value: "'Lora', Georgia, serif", google: 'Lora' },
  { label: 'Libre Baskerville', value: "'Libre Baskerville', Georgia, serif", google: 'Libre+Baskerville' },
  // System
  { label: 'System UI (standaard)', value: 'system-ui, -apple-system, sans-serif', google: '' },
]

const SAMPLE_TEXT = 'Welkom bij uw webshop — The quick brown fox'

export const FontSelectField: React.FC<any> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const [customMode, setCustomMode] = React.useState(false)

  // Load Google Fonts CSS
  const googleFonts = FONT_PRESETS.filter((f) => f.google).map((f) => f.google)
  const fontsUrl = `https://fonts.googleapis.com/css2?${googleFonts.map((f) => `family=${f}:wght@400;600;700`).join('&')}&display=swap`

  const currentPreset = FONT_PRESETS.find((f) => f.value === value)
  const isCustom = !currentPreset && !!value

  React.useEffect(() => {
    if (isCustom) setCustomMode(true)
  }, [isCustom])

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Load all Google Fonts */}
      <link rel="stylesheet" href={fontsUrl} />

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

      {!customMode ? (
        <>
          {/* Preset grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 6,
              marginBottom: 8,
            }}
          >
            {FONT_PRESETS.map((preset) => {
              const isSelected = value === preset.value
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setValue(preset.value)}
                  style={{
                    padding: '10px 12px',
                    border: isSelected
                      ? '2px solid var(--theme-elevation-800)'
                      : '1px solid var(--theme-elevation-150)',
                    borderRadius: 6,
                    background: isSelected ? 'var(--theme-elevation-50)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: 11,
                      color: 'var(--theme-elevation-500)',
                      marginBottom: 4,
                      fontFamily: 'system-ui',
                    }}
                  >
                    {preset.label}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 16,
                      fontFamily: preset.value,
                      color: 'var(--theme-elevation-800)',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {SAMPLE_TEXT}
                  </span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => setCustomMode(true)}
            style={{
              fontSize: 12,
              color: 'var(--theme-elevation-500)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Eigen font-family invoeren (Adobe Fonts, etc.)
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            placeholder="'Custom Font', system-ui, sans-serif"
            style={{
              width: '100%',
              maxWidth: 500,
              padding: '8px 10px',
              fontSize: 13,
              fontFamily: 'monospace',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: 6,
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-elevation-800)',
              marginBottom: 8,
            }}
          />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setCustomMode(false)}
              style={{
                fontSize: 12,
                color: 'var(--theme-elevation-500)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Terug naar presets
            </button>
            <span style={{ fontSize: 11, color: 'var(--theme-elevation-400)' }}>
              Tip: voor Adobe Fonts, voeg je Kit ID toe in het veld hieronder
            </span>
          </div>
        </>
      )}

      {/* Live preview */}
      {value && (
        <div
          style={{
            marginTop: 12,
            padding: '16px',
            border: '1px solid var(--theme-elevation-100)',
            borderRadius: 8,
            background: 'var(--theme-elevation-0)',
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--theme-elevation-400)',
              marginBottom: 8,
              fontFamily: 'system-ui',
            }}
          >
            Voorbeeld
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: value,
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--theme-elevation-800)',
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            Heading voorbeeld tekst
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: value,
              fontSize: 14,
              fontWeight: 400,
              color: 'var(--theme-elevation-600)',
              lineHeight: 1.6,
            }}
          >
            Dit is een voorbeeld van body tekst in het geselecteerde lettertype. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit.
          </span>
        </div>
      )}
    </div>
  )
}
