/**
 * Hub: Product afterChange Hook
 *
 * When a product is created/updated on the Hub and has multistoreSyncEnabled=true,
 * queue sync jobs for all sites in distributedTo[].
 *
 * Only active when ENABLE_MULTISTORE_HUB=true.
 */

import type { CollectionAfterChangeHook } from 'payload'
import { multistoreFeatures } from '@/lib/tenant/features'

export const multistoreProductSyncHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Skip if multistore products feature is not enabled
  if (!multistoreFeatures.products()) return doc

  // Skip if sync is disabled for this product
  if (!doc.multistoreSyncEnabled) return doc

  // Skip if this is a sync-originated update (prevent loops)
  if ((req as any)?.context?.fromMultistoreSync) return doc

  const distributedTo = doc.distributedTo as Array<{
    site: number | { id: number }
    remoteProductId?: number
    syncStatus?: string
  }> | undefined

  // Skip if no sites to sync to
  if (!distributedTo || distributedTo.length === 0) return doc

  try {
    // Dynamically import to avoid circular dependencies and only load when needed
    const { Queue } = await import('bullmq')
    const { redisConfig } = await import('@/lib/queue/redis')

    const queue = new Queue('multistore-sync', { connection: redisConfig })

    const syncOperation = operation === 'create' ? 'create' : 'update'

    for (const entry of distributedTo) {
      const siteId = typeof entry.site === 'object' ? entry.site.id : entry.site
      if (!siteId) continue

      await queue.add(
        'sync-product',
        {
          type: 'sync-product',
          data: {
            productId: doc.id,
            siteId,
            operation: syncOperation,
          },
        },
        {
          jobId: `sync-product-${doc.id}-${siteId}-${Date.now()}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        },
      )
    }

    console.log(
      `[Multistore] Queued ${syncOperation} sync for product ${doc.id} to ${distributedTo.length} site(s)`,
    )

    await queue.close()
  } catch (error) {
    // Don't fail the product save if queuing fails
    console.error('[Multistore] Failed to queue product sync:', error)
  }

  return doc
}
