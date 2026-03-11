/**
 * Payload Custom Field Component for GrapesJS Editor
 *
 * This integrates the GrapesJS editor as a custom field in Payload CMS
 * Used in EmailTemplates collection
 *
 * Auto-fetches branding from Theme + Settings globals so email templates
 * automatically use the site's brand colors, fonts, and logo.
 */

'use client'

import { useEffect, useState } from 'react'
import { useField } from '@payloadcms/ui'
import GrapesEmailEditor from '../index'
import type { GrapesEmailEditorProps } from '../index'
import '../styles.css'

export interface GrapesJSFieldProps {
  path: string
  readOnly?: boolean
  tenantBranding?: GrapesEmailEditorProps['tenantBranding']
  listmonkVariables?: boolean
  ecommerceBlocks?: boolean
}

type Branding = GrapesEmailEditorProps['tenantBranding']

function useBrandingFromGlobals(propBranding?: Branding): Branding | undefined {
  const [branding, setBranding] = useState<Branding | undefined>(propBranding)

  useEffect(() => {
    if (propBranding) {
      setBranding(propBranding)
      return
    }

    let cancelled = false

    async function fetchBranding() {
      try {
        const [themeRes, settingsRes] = await Promise.all([
          fetch('/api/globals/theme?depth=0', { credentials: 'include' }),
          fetch('/api/globals/settings?depth=1', { credentials: 'include' }),
        ])

        if (cancelled) return

        const theme = themeRes.ok ? await themeRes.json() : {}
        const settings = settingsRes.ok ? await settingsRes.json() : {}

        // Extract logo URL from upload field (populated object or string)
        let logoUrl: string | undefined
        if (settings.logo && typeof settings.logo === 'object' && settings.logo.url) {
          logoUrl = settings.logo.url
        }

        const result: Branding = {
          primaryColor: theme.primaryColor || settings.primaryColor || undefined,
          secondaryColor: theme.secondaryColor || settings.accentColor || undefined,
          fontFamily: theme.bodyFont || theme.headingFont || undefined,
          logo: logoUrl,
        }

        if (result.primaryColor || result.secondaryColor || result.fontFamily || result.logo) {
          if (!cancelled) setBranding(result)
        }
      } catch (err) {
        console.warn('[GrapesJSField] Could not fetch branding from globals:', err)
      }
    }

    fetchBranding()
    return () => { cancelled = true }
  }, [propBranding])

  return branding
}

export function GrapesJSField(props: GrapesJSFieldProps) {
  const {
    path,
    readOnly = false,
    tenantBranding: propBranding,
    listmonkVariables = true,
    ecommerceBlocks = false,
  } = props

  // Auto-fetch branding from Theme + Settings globals
  const tenantBranding = useBrandingFromGlobals(propBranding)

  // Get field state from Payload
  // Payload's json field returns parsed objects, but GrapesJS expects a string
  const { value, setValue } = useField<unknown>({ path })
  const { setValue: setHtmlValue } = useField<string>({ path: 'html' })

  // Ensure value is always a string for GrapesJS editor
  const editorValue = typeof value === 'object' && value !== null
    ? JSON.stringify(value)
    : (typeof value === 'string' ? value : '')

  // Handle editor changes — store projectData AND auto-populate html field
  const handleChange = (html: string, projectData: any) => {
    setValue(JSON.stringify(projectData))
    setHtmlValue(html)
  }

  // Handle export — store inlined HTML in the html field
  const handleExport = (_fullHtml: string, inlinedHtml: string) => {
    setHtmlValue(inlinedHtml)
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <GrapesEmailEditor
        value={editorValue}
        onChange={handleChange}
        onExport={handleExport}
        readOnly={readOnly}
        height="700px"
        width="100%"
        tenantBranding={tenantBranding}
        listmonkVariables={listmonkVariables}
        ecommerceBlocks={ecommerceBlocks}
      />
    </div>
  )
}
