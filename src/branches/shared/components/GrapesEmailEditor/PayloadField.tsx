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

  // Handle editor changes
  const handleChange = (html: string, projectData: any) => {
    // Store the complete GrapesJS project data as JSON string
    setValue(JSON.stringify(projectData))
  }

  // Handle export (when user clicks export button)
  const handleExport = (fullHtml: string, inlinedHtml: string) => {
    console.log('[GrapesJSField] Export triggered')
    console.log('Full HTML:', fullHtml.substring(0, 200) + '...')
    console.log('Inlined HTML:', inlinedHtml.substring(0, 200) + '...')

    // You could trigger a download or copy to clipboard here
    // For now, just log it
    alert('Template exported! Check browser console for HTML.')
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
