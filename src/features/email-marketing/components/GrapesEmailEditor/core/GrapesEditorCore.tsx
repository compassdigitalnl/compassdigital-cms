/**
 * GrapesEditorCore - Core GrapesJS Editor Component
 *
 * This is the actual GrapesJS editor implementation
 * Only loaded when ENABLE_EMAIL_GRAPES_EDITOR=true (via dynamic import)
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import 'grapesjs/dist/css/grapes.min.css'
import type { GrapesEmailEditorProps } from '../index'
import { getGrapesConfig } from '../config'
import { registerCustomBlocks } from '../blocks/index'
import { icons } from '../blocks/icons'
import juice from 'juice'

// GrapesJS types (minimal - library doesn't have official types)
interface GrapesJSEditor {
  getHtml: () => string
  getCss: () => string
  getJs: () => string
  getWrapper: () => any
  setComponents: (components: any) => void
  setStyle: (style: any) => void
  getProjectData: () => any
  loadProjectData: (data: any) => void
  on: (event: string, callback: (...args: any[]) => void) => void
  off: (event: string, callback: (...args: any[]) => void) => void
  runCommand: (command: string, options?: any) => any
  destroy: () => void
  BlockManager: any
  Canvas: any
  Panels: any
  Commands: any
}

// Loading overlay — positioned absolute so editor-layout DOM is always accessible for GrapesJS
function EditorInitializing() {
  return (
    <div className="editor-loading-overlay">
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
  const [activeTab, setActiveTab] = useState<'blocks' | 'styles' | 'traits'>('blocks')

  // Initialize GrapesJS
  useEffect(() => {
    if (!containerRef.current) return

    let editor: GrapesJSEditor = null as unknown as GrapesJSEditor

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

        // Clean up preset blocks: remove irrelevant ones, translate useful ones to Dutch
        const bm = editor.BlockManager
        if (bm) {
          // Remove blocks that are not useful for email clients
          const removeIds = ['link', 'link-block', 'grid-items', 'list-items', 'quote', 'text-sect']
          removeIds.forEach((id: string) => {
            try { bm.remove(id) } catch {}
          })

          // Translate useful preset blocks to Dutch in "Basis" category
          const translations: Record<string, { label: string; icon?: string }> = {
            'sect100': { label: '1 Kolom', icon: icons.columns1 },
            'sect50': { label: '2 Kolommen', icon: icons.columns2 },
            'sect30': { label: '3 Kolommen', icon: icons.columns3 },
            'sect37': { label: '3/7 Kolommen', icon: icons.columns37 },
            'button': { label: 'Knop', icon: icons.button },
            'divider': { label: 'Scheidingslijn', icon: icons.minus },
            'text': { label: 'Tekst', icon: icons.type },
            'image': { label: 'Afbeelding', icon: icons.image },
          }

          Object.entries(translations).forEach(([id, { label, icon }]) => {
            const block = bm.get(id)
            if (block) {
              block.set({ label, category: 'Basis', ...(icon && { media: icon }) })
            }
          })
        }

        // ── Replace ALL preset toolbar icons with Lucide SVGs ──
        const pn = editor.Panels
        if (pn) {
          // Hide buttons not needed by clients
          const hideButtons = ['gjs-open-import-template', 'canvas-clear']
          hideButtons.forEach((id: string) => {
            try {
              const btn = pn.getButton('options', id)
              if (btn) btn.set('visible', false)
            } catch {}
          })

          // Map of panel → button ID → Lucide icon + tooltip
          const iconOverrides: Array<{ panel: string; id: string; icon: string; title: string }> = [
            { panel: 'options', id: 'sw-visibility', icon: icons.borderAll, title: 'Randen tonen' },
            { panel: 'options', id: 'preview', icon: icons.eye, title: 'Voorbeeld' },
            { panel: 'options', id: 'fullscreen', icon: icons.maximize, title: 'Volledig scherm' },
            { panel: 'options', id: 'export-code', icon: icons.fileCode, title: 'Bekijk code' },
            { panel: 'options', id: 'undo', icon: icons.undo, title: 'Ongedaan maken' },
            { panel: 'options', id: 'redo', icon: icons.redo, title: 'Opnieuw' },
            { panel: 'options', id: 'gjs-open-import-template', icon: icons.upload, title: 'Importeer template' },
            { panel: 'options', id: 'canvas-clear', icon: icons.trash, title: 'Canvas wissen' },
          ]

          iconOverrides.forEach(({ panel, id, icon, title }) => {
            try {
              const btn = pn.getButton(panel, id)
              if (btn) {
                btn.set('label', icon)
                btn.set('className', '')
                btn.set('attributes', { ...btn.get('attributes'), title })
              }
            } catch {}
          })
        }

        // Replace component toolbar icons with Lucide SVGs + add clone
        const toolbarIconMap: Record<string, { icon: string; title: string }> = {
          'tlb-move': { icon: icons.move, title: 'Verplaatsen' },
          'select-parent': { icon: icons.arrowUp, title: 'Selecteer parent' },
          'tlb-clone': { icon: icons.copy, title: 'Dupliceer' },
          'tlb-delete': { icon: icons.x, title: 'Verwijder' },
        }

        editor.on('component:selected', (component: any) => {
          const toolbar = component.get('toolbar') || []

          // Replace FA icons with Lucide on existing toolbar items
          const updated = toolbar.map((btn: any) => {
            const cmd = btn.command
            const override = toolbarIconMap[cmd]
            if (override) {
              return {
                ...btn,
                label: override.icon,
                attributes: { ...btn.attributes, title: override.title, class: '' },
              }
            }
            return btn
          })

          // Add clone button if missing
          const hasClone = updated.some((btn: any) => btn.command === 'tlb-clone')
          if (!hasClone) {
            updated.push({
              label: icons.copy,
              attributes: { title: 'Dupliceer' },
              command: 'tlb-clone',
            })
          }

          component.set('toolbar', updated)
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

        // ── Empty State Hint ──────────────────────────────
        // Only show when editor is truly empty (no content loaded)
        const hasInitialContent = !!value

        const updateEmptyState = () => {
          const canvasEl = containerRef.current?.querySelector('.gjs-cv-canvas')
          if (!canvasEl) return

          const existing = canvasEl.querySelector('.canvas-empty-state')
          const wrapper = editor.getWrapper()
          const isEmpty = !wrapper || wrapper.components().length === 0

          if (isEmpty && !hasInitialContent && !existing) {
            const hint = document.createElement('div')
            hint.className = 'canvas-empty-state'
            hint.innerHTML = `
              <div class="canvas-empty-state__icon">📧</div>
              <p class="canvas-empty-state__title">Begin met het bouwen van je email</p>
              <p class="canvas-empty-state__text">Sleep een blok vanuit het rechterpaneel naar hier</p>
            `
            canvasEl.appendChild(hint)
          } else if ((!isEmpty || hasInitialContent) && existing) {
            existing.remove()
          }
        }

        editor.on('component:add', updateEmptyState)
        editor.on('component:remove', updateEmptyState)
        editor.on('load', updateEmptyState)
        setTimeout(updateEmptyState, 500)

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
          label: icons.externalLink,
          command: 'export-template',
          attributes: {
            title: 'Export template (with inlined CSS)',
            'data-tooltip': 'Export template',
          },
        })

        // ── Device Preview Buttons ──────────────────────────
        // Register device switch commands
        const deviceIds = ['device-desktop', 'device-tablet', 'device-mobile-landscape', 'device-mobile']
        const deviceMap: Record<string, string> = {
          'device-desktop': 'Desktop',
          'device-tablet': 'Tablet',
          'device-mobile-landscape': 'Mobiel liggend',
          'device-mobile': 'Mobiel staand',
        }

        deviceIds.forEach((id) => {
          editor.Commands.add(id, {
            run: (ed: any) => {
              ed.setDevice(deviceMap[id])
            },
            stop: () => {},
          })
        })

        editor.Panels.addPanel({
          id: 'device-panel',
          visible: true,
          buttons: [
            {
              id: 'device-desktop',
              command: 'device-desktop',
              label: icons.monitor,
              attributes: { title: 'Desktop' },
              active: true,
              togglable: false,
            },
            {
              id: 'device-tablet',
              command: 'device-tablet',
              label: icons.tablet,
              attributes: { title: 'Tablet (768px)' },
              togglable: false,
            },
            {
              id: 'device-mobile-landscape',
              command: 'device-mobile-landscape',
              label: icons.smartphoneLandscape,
              attributes: { title: 'Mobiel liggend (568px)' },
              togglable: false,
            },
            {
              id: 'device-mobile',
              command: 'device-mobile',
              label: icons.smartphone,
              attributes: { title: 'Mobiel staand (320px)' },
              togglable: false,
            },
          ],
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
    <div className="grapes-email-editor" style={{ width, height }}>
      {!isInitialized && <EditorInitializing />}
      <div className="editor-layout" style={{ height: '100%' }}>
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
              className={`panel__btn ${activeTab === 'traits' ? 'panel__btn--active' : ''}`}
              onClick={() => setActiveTab('traits')}
            >
              Instellingen
            </button>
          </div>
          <div className="panel__content">
            <div id="blocks" style={{ display: activeTab === 'blocks' ? 'block' : 'none' }} />
            <div className="styles-container" style={{ display: activeTab === 'styles' ? 'block' : 'none' }} />
            <div className="traits-container" style={{ display: activeTab === 'traits' ? 'block' : 'none' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
