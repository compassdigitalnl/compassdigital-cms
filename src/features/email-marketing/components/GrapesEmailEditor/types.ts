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
