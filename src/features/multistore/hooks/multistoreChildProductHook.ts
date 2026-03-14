/**
 * Child: Product afterChange Hook
 *
 * When stock changes on a child webshop, notify the Hub.
 * This enables real-time inventory updates from child → Hub.
 *
 * Only active when ENABLE_MULTISTORE_CHILD=true.
 */

import type { CollectionAfterChangeHook } from 'payload'
import { multistoreFeatures } from '@/lib/tenant/features'

export const multistoreChildProductHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  // Skip if not a child site
  if (!multistoreFeatures.isChild()) return doc

  // Skip if this product is not from the Hub
  if (!doc.hubProductId) return doc

  // Skip if this is a sync-originated update (prevent loops)
  if (doc.syncSource === 'hub' && operation === 'update') {
    // Check if only syncStatus/lastSyncedAt changed (= incoming sync, not user edit)
    const stockChanged = previousDoc?.stock !== doc.stock
    const statusChanged = previousDoc?.stockStatus !== doc.stockStatus
    if (!stockChanged && !statusChanged) return doc
  }

  // Only notify Hub if stock or stockStatus changed
  const stockChanged = previousDoc?.stock !== doc.stock
  const statusChanged = previousDoc?.stockStatus !== doc.stockStatus

  if (!stockChanged && !statusChanged) return doc

  try {
    const hubApiUrl = process.env.MULTISTORE_HUB_API_URL
    const hubApiKey = process.env.MULTISTORE_HUB_API_KEY
    const hubWebhookSecret = process.env.MULTISTORE_HUB_WEBHOOK_SECRET

    if (!hubApiUrl || !hubApiKey) {
      console.warn('[Multistore Child] Hub API URL/Key not configured, skipping stock notification')
      return doc
    }

    const payload = {
      event: 'stock-changed',
      childProductId: doc.id,
      hubProductId: doc.hubProductId,
      stock: doc.stock,
      stockStatus: doc.stockStatus,
      timestamp: new Date().toISOString(),
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${hubApiKey}`,
      'Content-Type': 'application/json',
    }

    // Add HMAC signature if webhook secret is configured
    if (hubWebhookSecret) {
      const crypto = await import('crypto')
      const timestamp = Math.floor(Date.now() / 1000)
      const signedPayload = `${timestamp}.${JSON.stringify(payload)}`
      const signature = crypto.createHmac('sha256', hubWebhookSecret)
        .update(signedPayload)
        .digest('hex')

      headers['x-webhook-signature'] = signature
      headers['x-webhook-timestamp'] = timestamp.toString()
    }

    // Fire-and-forget: don't block the product save
    fetch(`${hubApiUrl}/api/webhooks/multistore`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }).catch((error) => {
      console.error('[Multistore Child] Failed to notify Hub of stock change:', error)
    })

    console.log(
      `[Multistore Child] Notifying Hub of stock change: product ${doc.id} (hub: ${doc.hubProductId}), stock: ${doc.stock}`,
    )
  } catch (error) {
    // Don't fail the product save
    console.error('[Multistore Child] Error preparing stock notification:', error)
  }

  return doc
}
