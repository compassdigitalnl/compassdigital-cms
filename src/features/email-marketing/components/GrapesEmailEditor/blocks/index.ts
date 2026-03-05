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
import { registerRteVariables } from './rteVariables'
import { registerUtilityBlocks } from './utility'
import { registerEcommerceBlocks } from './ecommerce'
import { registerProductPicker } from './productPicker'
import { registerLiveEcommerceBlocks } from './ecommerce-live'

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

  // Utility blocks (spacer, social, video, countdown) — always available
  registerUtilityBlocks(editor)

  // Listmonk variables (subscriber data, unsubscribe link, etc.)
  if (listmonkVariables) {
    registerListmonkBlocks(editor)
    registerRteVariables(editor)
  }

  // E-commerce blocks (product cards, etc.)
  if (ecommerceBlocks) {
    registerEcommerceBlocks(editor)
    registerProductPicker(editor)
    registerLiveEcommerceBlocks(editor)
  }
}
