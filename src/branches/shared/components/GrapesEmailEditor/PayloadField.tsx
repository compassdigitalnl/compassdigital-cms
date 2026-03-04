/**
 * Payload Custom Field Component for GrapesJS Editor
 *
 * This integrates the GrapesJS editor as a custom field in Payload CMS
 * Used in EmailTemplates collection
 */

'use client'

import { useField } from '@payloadcms/ui'
import GrapesEmailEditor from './index'
import type { GrapesEmailEditorProps } from './index'
import './styles.css'

export interface GrapesJSFieldProps {
  path: string
  readOnly?: boolean
  tenantBranding?: GrapesEmailEditorProps['tenantBranding']
  listmonkVariables?: boolean
  ecommerceBlocks?: boolean
}

export function GrapesJSField(props: GrapesJSFieldProps) {
  const {
    path,
    readOnly = false,
    tenantBranding,
    listmonkVariables = true,
    ecommerceBlocks = false,
  } = props

  // Get field state from Payload
  const { value, setValue } = useField<string>({ path })
  const { setValue: setHtmlValue } = useField<string>({ path: 'html' })

  // Handle editor changes — store projectData AND auto-populate html field
  const handleChange = (html: string, projectData: any) => {
    setValue(JSON.stringify(projectData))
    setHtmlValue(html)
  }

  // Handle export — store inlined HTML in the html field
  const handleExport = (fullHtml: string, inlinedHtml: string) => {
    console.log('[GrapesJSField] Export triggered, saving inlined HTML to html field')
    setHtmlValue(inlinedHtml)
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <GrapesEmailEditor
        value={value || ''}
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
