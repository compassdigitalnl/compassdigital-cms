/**
 * GrapesEditorCore - Core GrapesJS Editor Component
 *
 * This is the actual GrapesJS editor implementation
 * Only loaded when ENABLE_EMAIL_GRAPES_EDITOR=true (via dynamic import)
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import 'grapesjs/dist/css/grapes.min.css'
import type { GrapesEmailEditorProps } from './index'
import { getGrapesConfig } from './config'
import { registerCustomBlocks } from './blocks/index'
import juice from 'juice'

// GrapesJS types (minimal - library doesn't have official types)
interface GrapesJSEditor {
  getHtml: () => string
  getCss: () => string
  getJs: () => string
  setComponents: (components: any) => void
  setStyle: (style: any) => void
  getProjectData: () => any
  loadProjectData: (data: any) => void
  on: (event: string, callback: (...args: any[]) => void) => void
  off: (event: string, callback: (...args: any[]) => void) => void
  runCommand: (command: string, options?: any) => any
  destroy: () => void
  Canvas: any
  Panels: any
  Commands: any
}

// Loading state component
function EditorInitializing() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '600px',
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '4px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }}
        />
        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
          Editor wordt geïnitialiseerd...
        </p>
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

export function GrapesEditorCore(props: GrapesEmailEditorProps) {
  const {
    value = '',
    onChange,
    onExport,
    readOnly = false,
    height = '600px',
    width = '100%',
    tenantBranding,
    listmonkVariables = true,
    ecommerceBlocks = false,
  } = props

  const editorRef = useRef<GrapesJSEditor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'blocks' | 'styles' | 'layers' | 'traits'>('blocks')

  // Initialize GrapesJS
  useEffect(() => {
    if (!containerRef.current) return

    let editor: GrapesJSEditor | null = null

    ;(async () => {
      try {
        // Dynamic imports - only load when this component is rendered
        const gjsModule = await import('grapesjs')
        const gjsPresetModule = await import('grapesjs-preset-newsletter')

        // Resolve the actual grapesjs object (ESM: { default: { init, ... } })
        const grapesjs = (gjsModule as any).default || gjsModule
        const gjsPresetNewsletter = (gjsPresetModule as any).default || gjsPresetModule

        // Get configuration
        const config = getGrapesConfig({
          container: containerRef.current!,
          height,
          width,
          readOnly,
        })

        // Initialize editor — grapesjs exposes .init(), not a callable function
        editor = grapesjs.init(config)
        editorRef.current = editor

        // Load newsletter preset (it's a GrapesJS plugin function)
        if (typeof gjsPresetNewsletter === 'function') {
          gjsPresetNewsletter(editor, {
          modalTitleImport: 'Template importeren',
          modalTitleExport: 'Template exporteren',
          codeViewerTheme: 'material',
          importPlaceholder: 'Plak hier uw HTML/CSS template',
          cellStyle: {
            'font-size': '14px',
            'font-weight': '300',
            'vertical-align': 'top',
            color: 'rgb(111, 119, 125)',
            margin: '0',
            padding: '0',
          },
          })
        }

        // Register custom blocks
        registerCustomBlocks(editor, {
          tenantBranding,
          listmonkVariables,
          ecommerceBlocks,
        })

        // Load initial content
        if (value) {
          try {
            // Try to parse as GrapesJS project data first
            const parsed = JSON.parse(value)
            if (parsed.assets || parsed.styles || parsed.pages) {
              // It's GrapesJS project data
              editor.loadProjectData(parsed)
            } else {
              // It's raw HTML
              editor.setComponents(value)
            }
          } catch {
            // Not JSON, treat as HTML
            editor.setComponents(value)
          }
        }

        // Listen to changes
        let changeTimeout: NodeJS.Timeout
        editor.on('update', () => {
          if (readOnly || !onChange) return

          // Debounce changes (wait 500ms after last edit)
          clearTimeout(changeTimeout)
          changeTimeout = setTimeout(() => {
            if (editor) {
              const html = editor.getHtml()
              const projectData = editor.getProjectData()
              onChange(html, projectData)
            }
          }, 500)
        })

        // Add custom export command with inline CSS
        editor.Commands.add('export-template', {
          run: (editor: GrapesJSEditor) => {
            try {
              const html = editor.getHtml()
              const css = editor.getCss()

              // Combine HTML + CSS
              const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${css}</style>
</head>
<body>
  ${html}
</body>
</html>
              `.trim()

              // Inline CSS using juice (critical for email clients!)
              const inlinedHtml = juice(fullHtml, {
                preserveMediaQueries: true,
                preserveFontFaces: true,
                removeStyleTags: false, // Keep media queries in <style>
                webResources: {
                  relativeTo: '',
                  strict: false,
                },
              })

              // Callback
              if (onExport) {
                onExport(fullHtml, inlinedHtml)
              }

              // Also show in modal
              const code = editor.Panels.getButton('views', 'open-code')
              if (code) {
                code.set('active', true)
              }

              return inlinedHtml
            } catch (error) {
              console.error('[GrapesEditorCore] Export failed:', error)
              alert(`Export failed: ${error instanceof Error ? error.message : String(error)}`)
              return ''
            }
          },
        })

        // Add export button to toolbar
        editor.Panels.addButton('options', {
          id: 'export-template',
          className: 'fa fa-download',
          command: 'export-template',
          attributes: {
            title: 'Export template (with inlined CSS)',
            'data-tooltip': 'Export template',
          },
        })

        setIsInitialized(true)
      } catch (error) {
        console.error('[GrapesEditorCore] Failed to initialize:', error)
        setInitError(error instanceof Error ? error.message : String(error))
      }
    })()

    // Cleanup
    return () => {
      if (editor) {
        try {
          editor.destroy()
        } catch (error) {
          console.error('[GrapesEditorCore] Cleanup error:', error)
        }
      }
    }
  }, []) // Only run once on mount

  // Update content when value prop changes (after initial render)
  useEffect(() => {
    if (!isInitialized || !editorRef.current) return

    const editor = editorRef.current

    // Only update if value is different from current content
    const currentHtml = editor.getHtml()
    if (value && value !== currentHtml) {
      try {
        const parsed = JSON.parse(value)
        if (parsed.assets || parsed.styles || parsed.pages) {
          editor.loadProjectData(parsed)
        } else {
          editor.setComponents(value)
        }
      } catch {
        editor.setComponents(value)
      }
    }
  }, [value, isInitialized])

  // Error state
  if (initError) {
    return (
      <div
        style={{
          padding: '20px',
          background: '#fef2f2',
          border: '1px solid #ef4444',
          borderRadius: '4px',
        }}
      >
        <h3 style={{ margin: '0 0 8px', color: '#dc2626', fontSize: '16px' }}>
          Editor kon niet worden gestart
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#666', fontFamily: 'monospace' }}>
          {initError}
        </p>
      </div>
    )
  }

  return (
    <div className="grapes-email-editor" style={{ width, height: isInitialized ? height : undefined }}>
      {!isInitialized && <EditorInitializing />}
      <div className="editor-layout" style={{ display: isInitialized ? 'flex' : 'none', height: '100%' }}>
        {/* Canvas (left) */}
        <div className="editor-canvas" ref={containerRef} />

        {/* Right panel */}
        <div className="editor-panel-right">
          <div className="panel__switcher">
            <button
              className={`panel__btn ${activeTab === 'blocks' ? 'panel__btn--active' : ''}`}
              onClick={() => setActiveTab('blocks')}
            >
              Blokken
            </button>
            <button
              className={`panel__btn ${activeTab === 'styles' ? 'panel__btn--active' : ''}`}
              onClick={() => setActiveTab('styles')}
            >
              Stijlen
            </button>
            <button
              className={`panel__btn ${activeTab === 'layers' ? 'panel__btn--active' : ''}`}
              onClick={() => setActiveTab('layers')}
            >
              Lagen
            </button>
            <button
              className={`panel__btn ${activeTab === 'traits' ? 'panel__btn--active' : ''}`}
              onClick={() => setActiveTab('traits')}
            >
              Instellingen
            </button>
          </div>
          <div className="panel__content">
            <div id="blocks" style={{ display: activeTab === 'blocks' ? 'block' : 'none' }} />
            <div className="styles-container" style={{ display: activeTab === 'styles' ? 'block' : 'none' }} />
            <div className="layers-container" style={{ display: activeTab === 'layers' ? 'block' : 'none' }} />
            <div className="traits-container" style={{ display: activeTab === 'traits' ? 'block' : 'none' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
