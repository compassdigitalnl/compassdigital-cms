/**
 * Custom Blocks Registration
 *
 * Registers custom blocks for:
 * - Tenant branding (logo, colors, fonts)
 * - Listmonk variables (subscriber data, campaign data)
 * - E-commerce (product cards, price drops, reviews)
 */

import { registerTenantBlocks } from './tenant'
import { registerListmonkBlocks } from './listmonk'
import { registerEcommerceBlocks } from './ecommerce'

export interface CustomBlocksOptions {
  tenantBranding?: {
    logo?: string
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
  }
  listmonkVariables?: boolean
  ecommerceBlocks?: boolean
}

export function registerCustomBlocks(editor: any, options: CustomBlocksOptions = {}) {
  const { tenantBranding, listmonkVariables = true, ecommerceBlocks = false } = options

  console.log('[Custom Blocks] Registering blocks:', {
    tenantBranding: !!tenantBranding,
    listmonkVariables,
    ecommerceBlocks,
  })

  // Always register tenant blocks (logo, colors, etc.)
  if (tenantBranding) {
    registerTenantBlocks(editor, tenantBranding)
  }

  // Listmonk variables (subscriber data, unsubscribe link, etc.)
  if (listmonkVariables) {
    registerListmonkBlocks(editor)
  }

  // E-commerce blocks (product cards, etc.)
  if (ecommerceBlocks) {
    registerEcommerceBlocks(editor)
  }
}
