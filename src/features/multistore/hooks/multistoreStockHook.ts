/**
 * Hub: Stock Change Propagation Hook
 *
 * When stock or stockStatus changes on a Hub product, queue inventory sync
 * jobs to push the update to all distributed child webshops.
 *
 * Only active when ENABLE_MULTISTORE_HUB=true AND ENABLE_MULTISTORE_INVENTORY=true.
 */

import type { CollectionAfterChangeHook } from 'payload'
import { multistoreFeatures } from '@/lib/tenant/features'

export const multistoreStockHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  // Only runs on the Hub with inventory feature enabled
  if (!multistoreFeatures.isHub() || !multistoreFeatures.inventory()) return doc

  // Skip if this change came from multistore sync (prevent loops)
  if (req.context?.fromMultistoreSync) return doc

  // Skip if sync not enabled for this product
  if (!(doc as any).multistoreSyncEnabled) return doc

  // Check if stock or stockStatus actually changed
  const stockChanged = previousDoc?.stock !== doc.stock
  const statusChanged = previousDoc?.stockStatus !== doc.stockStatus

  if (!stockChanged && !statusChanged) return doc

  // Get all sites this product is distributed to
  const distributedTo = (doc as any).distributedTo as any[] | undefined
  if (!distributedTo || distributedTo.length === 0) return doc

  const activeSiteIds = distributedTo
    .filter((entry: any) => entry.remoteProductId && entry.syncStatus !== 'error')
    .map((entry: any) => {
      const siteId = typeof entry.site === 'object' ? entry.site?.id : entry.site
      return siteId
    })
    .filter(Boolean) as number[]

  if (activeSiteIds.length === 0) return doc

  // Queue inventory sync job (fire-and-forget)
  try {
    const { Queue } = await import('bullmq')
    const { redisConfig } = await import('@/lib/queue/redis')
    const queue = new Queue('multistore-sync', { connection: redisConfig })

    await queue.add(
      'sync-inventory',
      {
        type: 'sync-inventory',
        data: {
          productId: doc.id,
          siteIds: activeSiteIds,
          stock: doc.stock ?? 0,
          stockStatus: doc.stockStatus || 'in-stock',
        },
      },
      {
        jobId: `sync-inventory-${doc.id}-${Date.now()}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    )

    await queue.close()

    console.log(
      `[Multistore Stock Hook] Queued inventory sync for product ${doc.id} → ${activeSiteIds.length} site(s) (stock: ${doc.stock}, status: ${doc.stockStatus})`,
    )
  } catch (error) {
    // Don't fail the product save
    console.error('[Multistore Stock Hook] Failed to queue inventory sync:', error)
  }

  return doc
}
