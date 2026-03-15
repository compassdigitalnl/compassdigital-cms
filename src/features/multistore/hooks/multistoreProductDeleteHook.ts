/**
 * Hub: Product afterDelete Hook
 *
 * When a product is deleted on the Hub, queue delete webhooks to all child sites
 * that had this product in distributedTo[].
 *
 * Only active when ENABLE_MULTISTORE_HUB=true.
 */

import type { CollectionAfterDeleteHook } from 'payload'
import { multistoreFeatures } from '@/lib/tenant/features'

export const multistoreProductDeleteHook: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  if (!multistoreFeatures.products()) return doc

  // Skip if this is a sync-originated delete (prevent loops)
  if ((req as any)?.context?.fromMultistoreSync) return doc

  const distributedTo = doc.distributedTo as Array<{
    site: number | { id: number }
    remoteProductId?: number
  }> | undefined

  if (!distributedTo || distributedTo.length === 0) return doc

  try {
    const { Queue } = await import('bullmq')
    const { redisConfig } = await import('@/lib/queue/redis')

    const queue = new Queue('multistore-sync', { connection: redisConfig })

    for (const entry of distributedTo) {
      const siteId = typeof entry.site === 'object' ? entry.site.id : entry.site
      if (!siteId) continue

      await queue.add(
        'sync-product-delete',
        {
          type: 'sync-product-delete',
          data: {
            productId: doc.id,
            siteId,
            hubProductId: doc.id,
          },
        },
        {
          jobId: `sync-product-delete-${doc.id}-${siteId}-${Date.now()}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        },
      )
    }

    console.log(
      `[Multistore] Queued delete propagation for product ${doc.id} to ${distributedTo.length} site(s)`,
    )

    await queue.close()
  } catch (error) {
    console.error('[Multistore] Failed to queue product delete propagation:', error)
  }

  return doc
}
