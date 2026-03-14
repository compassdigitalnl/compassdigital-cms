/**
 * Hub: Fulfillment Status Change Hook
 *
 * When the fulfillmentStatus changes on a Hub order (that has a sourceSite),
 * queue a sync-fulfillment job to push the status to the child webshop.
 *
 * Flow:
 *   Hub order fulfillmentStatus changes → queue job → worker pushes to child webhook
 *   → child updates local order status + tracking info
 *
 * Only active when ENABLE_MULTISTORE_HUB=true AND ENABLE_MULTISTORE_FULFILLMENT=true.
 */

import type { CollectionAfterChangeHook } from 'payload'
import { multistoreFeatures } from '@/lib/tenant/features'

export const multistoreFulfillmentHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Only runs on the Hub with fulfillment feature enabled
  if (!multistoreFeatures.isHub() || !multistoreFeatures.fulfillment()) return doc

  // Skip if this change came from multistore sync (prevent loops)
  if (req.context?.fromMultistoreSync) return doc

  // Only process orders that came from a child webshop
  const sourceSiteId = typeof doc.sourceSite === 'object' ? doc.sourceSite?.id : doc.sourceSite
  if (!sourceSiteId) return doc

  // Check if fulfillmentStatus actually changed
  const prevFulfillment = previousDoc?.fulfillmentStatus
  const newFulfillment = doc.fulfillmentStatus

  if (!newFulfillment || prevFulfillment === newFulfillment) return doc

  // Queue fulfillment sync job
  try {
    const { Queue } = await import('bullmq')
    const { redisConfig } = await import('@/lib/queue/redis')
    const queue = new Queue('multistore-sync', { connection: redisConfig })

    await queue.add(
      'sync-fulfillment',
      {
        type: 'sync-fulfillment',
        data: {
          orderId: doc.id,
          siteId: sourceSiteId,
          fulfillmentStatus: newFulfillment,
          trackingCode: doc.trackingCode,
        },
      },
      {
        jobId: `sync-fulfillment-${doc.id}-${Date.now()}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    )

    await queue.close()

    console.log(
      `[Multistore Fulfillment Hook] Queued fulfillment sync: order ${doc.id} → ${newFulfillment} → site ${sourceSiteId}`,
    )
  } catch (error) {
    // Don't fail the order save
    console.error('[Multistore Fulfillment Hook] Failed to queue fulfillment sync:', error)
  }

  return doc
}
