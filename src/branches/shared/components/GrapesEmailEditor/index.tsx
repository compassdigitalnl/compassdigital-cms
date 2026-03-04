/**
 * GrapesEmailEditor - Main Wrapper Component
 *
 * Uses dynamic import to only load GrapesJS when feature is enabled
 * This keeps bundle size small when EMAIL_GRAPES_EDITOR is disabled
 */

'use client'

import { useEffect, useState, type ComponentType } from 'react'

// Types for the editor component
export interface GrapesEmailEditorProps {
  value?: string
  onChange?: (html: string, data: any) => void
  onExport?: (html: string, inlinedHtml: string) => void
  readOnly?: boolean
  height?: string
  width?: string
  tenantBranding?: {
    logo?: string
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
  }
  listmonkVariables?: boolean
  ecommerceBlocks?: boolean
}

// Loading placeholder component
function EditorLoadingPlaceholder() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '600px',
        background: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: '#666', fontSize: '14px' }}>E-mail editor wordt geladen...</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Disabled state component
function EditorDisabled() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '600px',
        background: '#fef3c7',
        border: '1px solid #fbbf24',
        borderRadius: '4px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ margin: '0 auto 16px' }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600 }}>
          Visuele editor uitgeschakeld
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          De visuele editor is momenteel uitgeschakeld. Stel{' '}
          <code
            style={{
              background: '#fff',
              padding: '2px 6px',
              borderRadius: '3px',
              fontFamily: 'monospace',
            }}
          >
            ENABLE_EMAIL_GRAPES_EDITOR=true
          </code>{' '}
          in bij de omgevingsvariabelen om deze te activeren.
        </p>
      </div>
    </div>
  )
}

// Main component
export default function GrapesEmailEditor(props: GrapesEmailEditorProps) {
  const [EditorCore, setEditorCore] = useState<ComponentType<GrapesEmailEditorProps> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    // Dynamic import - only loads when component is rendered
    setIsLoading(true)

    import('./GrapesEditorCore')
      .then((mod) => {
        setEditorCore(() => mod.GrapesEditorCore)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('[GrapesEmailEditor] Failed to load editor:', error)
        setLoadError(error.message)
        setIsLoading(false)
      })
  }, [])

  // Loading
  if (isLoading) {
    return <EditorLoadingPlaceholder />
  }

  // Load error
  if (loadError) {
    return (
      <div
        style={{
          padding: '20px',
          background: '#fef2f2',
          border: '1px solid #ef4444',
          borderRadius: '4px',
        }}
      >
        <h3 style={{ margin: '0 0 8px', color: '#dc2626' }}>Editor kon niet worden geladen</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{loadError}</p>
      </div>
    )
  }

  // Render loaded component
  if (!EditorCore) {
    return <EditorLoadingPlaceholder />
  }

  return <EditorCore {...props} />
}
