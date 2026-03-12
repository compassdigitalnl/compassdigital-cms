'use client'

/**
 * AI-Enhanced Textarea Field Component for Payload CMS 3.x
 *
 * Replaces the native textarea field with AI generate + improve buttons.
 * Uses Payload's native TextareaInput + FieldLabel for full compatibility.
 *
 * Usage in collection config:
 * {
 *   name: 'excerpt',
 *   type: 'textarea',
 *   admin: {
 *     components: {
 *       Field: '@/branches/shared/components/admin/fields/AITextareaField#AITextareaField'
 *     }
 *   }
 * }
 */

import React, { useState, useCallback } from 'react'
import type { TextareaFieldClientProps } from 'payload'
import { FieldLabel, TextareaInput, useField, useFormFields } from '@payloadcms/ui'

export const AITextareaField: React.FC<TextareaFieldClientProps> = (props) => {
  const { field, readOnly } = props
  const { label, required, localized, admin } = field

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    errorMessage,
    path,
    setValue,
    showError,
    value,
  } = useField<string>()

  // Get title from form for context
  const titleValue = useFormFields(([fields]) => fields?.title?.value as string | undefined)

  const [loading, setLoading] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<'generate' | 'improve'>('generate')

  const handleGenerate = useCallback(async () => {
    if (mode === 'generate' && !prompt.trim()) return
    setLoading(true)
    try {
      const contextParts: string[] = []
      if (titleValue) contextParts.push(`Titel: ${titleValue}`)

      if (mode === 'improve' && value) {
        const res = await fetch('/api/ai/generate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            prompt: `Verbeter de volgende tekst. Maak het professioneler, duidelijker en aantrekkelijker. Behoud dezelfde boodschap en lengte.\n\nContext: ${contextParts.join('. ')}\n\nOriginele tekst:\n${value}`,
            type: 'description',
            maxTokens: 500,
          }),
        })
        const data = await res.json()
        if (data.success && data.content) {
          setValue(data.content.trim())
        }
      } else {
        const res = await fetch('/api/ai/generate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            prompt: `Genereer een tekst voor het veld "${label || path}". ${contextParts.length ? `Context: ${contextParts.join('. ')}. ` : ''}Instructie: ${prompt}`,
            type: 'description',
            maxTokens: 500,
          }),
        })
        const data = await res.json()
        if (data.success && data.content) {
          setValue(data.content.trim())
          setShowPrompt(false)
          setPrompt('')
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [mode, prompt, value, label, path, setValue, titleValue])

  const btnStyle = (active: boolean) => ({
    background: 'none',
    border: '1px solid ' + (active ? '#6366f1' : '#d1d5db'),
    borderRadius: '0.25rem',
    padding: '0.125rem 0.5rem',
    fontSize: '0.7rem',
    fontWeight: 600 as const,
    cursor: 'pointer' as const,
    color: active ? '#6366f1' : '#6b7280',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '0.25rem',
  })

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ marginBottom: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {Label ?? (
            <FieldLabel label={label} localized={localized} path={path} required={required} />
          )}
        </div>
        {!readOnly && (
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              type="button"
              onClick={() => { setMode('generate'); setShowPrompt(!showPrompt || mode !== 'generate') }}
              disabled={loading}
              style={btnStyle(showPrompt && mode === 'generate')}
            >
              {loading && mode === 'generate' ? 'Bezig...' : 'AI Genereren'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => { setMode('improve'); handleGenerate() }}
                disabled={loading}
                style={btnStyle(false)}
              >
                {loading && mode === 'improve' ? 'Bezig...' : 'Verbeteren'}
              </button>
            )}
          </div>
        )}
      </div>

      {showPrompt && mode === 'generate' && (
        <div style={{
          marginBottom: '0.5rem',
          padding: '0.5rem',
          backgroundColor: '#f5f3ff',
          border: '1px solid #e0e7ff',
          borderRadius: '0.375rem',
          display: 'flex',
          gap: '0.375rem',
        }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder={`Beschrijf wat je wilt genereren voor ${label || path}...`}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.375rem 0.5rem',
              fontSize: '0.8rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontFamily: 'inherit',
            }}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: '#6366f1',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading || !prompt.trim() ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Genereren...' : 'Genereer'}
          </button>
        </div>
      )}

      <TextareaInput
        AfterInput={AfterInput}
        BeforeInput={BeforeInput}
        Error={errorMessage}
        onChange={setValue}
        path={path}
        readOnly={readOnly}
        required={required}
        rows={(admin as any)?.rows || 4}
        showError={showError}
        value={value}
      />

      {Description}
      {admin?.description && !Description && (
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
          {admin.description as string}
        </div>
      )}
    </div>
  )
}
