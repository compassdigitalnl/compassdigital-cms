/**
 * Child: Order afterChange Hook
 *
 * When a new order is placed on a child webshop, push it to the Hub.
 * Also pushes status changes (paid, shipped, etc.) to keep Hub in sync.
 *
 * Only active when ENABLE_MULTISTORE_CHILD=true.
 */

import type { CollectionAfterChangeHook } from 'payload'
import { multistoreFeatures } from '@/lib/tenant/features'

export const multistoreChildOrderHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  // Skip if not a child site
  if (!multistoreFeatures.isChild()) return doc

  // Skip if this update came from the Hub (prevent loops)
  if (doc.hubOrderId) {
    // Only forward status changes back to Hub if they changed locally
    const statusChanged = previousDoc?.status !== doc.status
    if (!statusChanged) return doc
  }

  const hubApiUrl = process.env.MULTISTORE_HUB_API_URL
  const hubApiKey = process.env.MULTISTORE_HUB_API_KEY
  const hubWebhookSecret = process.env.MULTISTORE_HUB_WEBHOOK_SECRET

  if (!hubApiUrl || !hubApiKey) {
    return doc
  }

  try {
    const payload: Record<string, any> = {
      event: operation === 'create' ? 'order-created' : 'order-updated',
      order: {
        id: doc.id,
        orderNumber: doc.orderNumber,
        status: doc.status,
        paymentStatus: doc.paymentStatus,
        paymentMethod: doc.paymentMethod,
        items: doc.items,
        subtotal: doc.subtotal,
        shippingCost: doc.shippingCost,
        tax: doc.tax,
        discount: doc.discount,
        total: doc.total,
        customerEmail: doc.customerEmail || doc.guestEmail,
        shippingAddress: doc.shippingAddress,
        billingAddress: doc.billingAddress,
        trackingCode: doc.trackingCode,
        trackingUrl: doc.trackingUrl,
        shippingProvider: doc.shippingProvider,
        notes: doc.notes,
      },
      timestamp: new Date().toISOString(),
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${hubApiKey}`,
      'Content-Type': 'application/json',
    }

    // Add HMAC signature if configured
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

    // Fire-and-forget: don't block the order save
    fetch(`${hubApiUrl}/api/webhooks/multistore/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }).catch((error) => {
      console.error('[Multistore Child] Failed to push order to Hub:', error)
    })

    console.log(
      `[Multistore Child] Pushing order ${doc.orderNumber} to Hub (${operation})`,
    )
  } catch (error) {
    // Don't fail the order save
    console.error('[Multistore Child] Error preparing order push:', error)
  }

  return doc
}
