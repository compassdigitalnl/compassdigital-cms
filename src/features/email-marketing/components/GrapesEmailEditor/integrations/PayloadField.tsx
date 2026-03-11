/**
 * Payload Custom Field Component for GrapesJS Editor
 *
 * This integrates the GrapesJS editor as a custom field in Payload CMS
 * Used in EmailTemplates collection
 */

'use client'

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

export function GrapesJSField(props: GrapesJSFieldProps) {
  const {
    path,
    readOnly = false,
    tenantBranding,
    listmonkVariables = true,
    ecommerceBlocks = false,
  } = props

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
