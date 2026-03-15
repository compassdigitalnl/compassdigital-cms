'use client'

/**
 * AI-Enhanced Text Field Component for Payload CMS 3.x
 *
 * Replaces the native text field with an AI generate button next to the label.
 * Uses Payload's native TextInput + FieldLabel for full compatibility.
 *
 * Usage in collection config:
 * {
 *   name: 'title',
 *   type: 'text',
 *   admin: {
 *     components: {
 *       Field: '@/branches/shared/components/admin/fields/AITextField#AITextField'
 *     }
 *   }
 * }
 */

import React, { useState, useCallback } from 'react'
import type { TextFieldClientProps } from 'payload'
import { FieldLabel, TextInput, useField } from '@payloadcms/ui'

export const AITextField: React.FC<TextFieldClientProps> = (props) => {
  const { field, readOnly } = props
  const { label, required, localized, maxLength, admin } = field

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    errorMessage,
    path,
    setValue,
    showError,
    value,
  } = useField<string>()

  const [loading, setLoading] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [prompt, setPrompt] = useState('')

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          prompt: `Genereer een korte, pakkende tekst (max 1 zin) voor het veld "${label || path}": ${prompt}`,
          type: 'title',
          maxTokens: 100,
        }),
      })
      const data = await res.json()
      if (data.success && data.content) {
        // Strip quotes if the AI wrapped the title in them
        const cleaned = data.content.replace(/^["']|["']$/g, '').trim()
        setValue(cleaned)
        setShowPrompt(false)
        setPrompt('')
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [prompt, label, path, setValue])

  return (
    <div className="field-type" style={{ width: '100%' }}>
      <div style={{ marginBottom: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {Label ?? (
            <FieldLabel label={label} localized={localized} path={path} required={required} />
          )}
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={() => setShowPrompt(!showPrompt)}
            disabled={loading}
            style={{
              background: 'none',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            {loading ? 'Bezig...' : 'AI'}
          </button>
        )}
      </div>

      {showPrompt && (
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

      <TextInput
        AfterInput={AfterInput}
        BeforeInput={BeforeInput}
        Error={errorMessage}
        onChange={setValue}
        path={path}
        readOnly={readOnly}
        required={required}
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
