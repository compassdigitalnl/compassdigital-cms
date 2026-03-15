/**
 * Multistore Sync Worker
 *
 * BullMQ worker for processing multistore sync jobs.
 * Handles: product sync, order fetch, inventory sync, fulfillment sync,
 * bulk operations, health checks, and reconciliation.
 *
 * Follows emailMarketingWorker pattern.
 */

import { Worker, Job } from 'bullmq'
import { redis } from '@/lib/queue/redis'
import { baseWorkerConfig } from '@/lib/queue/config'
import { MultistoreClient, MultistoreAPIError } from '../lib/client'
import { getResilientClient } from '../lib/resilient-client'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { MultistoreSyncJob, PayloadAPIResponse, PayloadAPIListResponse, HealthCheckResult } from '../lib/types'

// ═══════════════════════════════════════════════════════════
// PAYLOAD SINGLETON
// ═══════════════════════════════════════════════════════════

let payload: Payload | null = null

async function getPayloadInstance(): Promise<Payload> {
  if (!payload) {
    payload = await getPayload({ config })
  }
  return payload
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

async function getSiteConfig(siteId: number) {
  const pl = await getPayloadInstance()
  const site = await pl.findByID({
    collection: 'multistore-sites' as any,
    id: siteId,
    depth: 0,
  })
  return site
}

async function getClientForSite(site: any) {
  return getResilientClient(site.id, {
    apiUrl: site.apiUrl,
    apiKey: site.apiKey,
    webhookSecret: site.webhookSecret,
    siteName: site.name,
  })
}

async function logSync(data: {
  site: number
  direction: 'hub-to-child' | 'child-to-hub'
  entityType: string
  entityId: string
  operation: string
  status: 'success' | 'failed' | 'skipped'
  duration?: number
  error?: string
  requestPayload?: any
  responsePayload?: any
}) {
  try {
    const pl = await getPayloadInstance()
    await pl.create({
      collection: 'multistore-sync-log' as any,
      data,
      overrideAccess: true,
    })
  } catch (err) {
    console.error('[Multistore Worker] Failed to create sync log:', err)
  }
}

// ═══════════════════════════════════════════════════════════
// JOB PROCESSORS
// ═══════════════════════════════════════════════════════════

async function processSyncProduct(job: Job): Promise<void> {
  const { productId, siteId, operation } = job.data.data
  console.log(`[Multistore Worker] sync-product: product=${productId} site=${siteId} op=${operation}`)

  const start = Date.now()
  const pl = await getPayloadInstance()
  const site = await getSiteConfig(siteId)

  if (site.status !== 'active') {
    console.log(`[Multistore Worker] Site ${site.name} is ${site.status}, skipping`)
    await logSync({
      site: siteId,
      direction: 'hub-to-child',
      entityType: 'product',
      entityId: String(productId),
      operation,
      status: 'skipped',
      duration: Date.now() - start,
    })
    return
  }

  const client = await getClientForSite(site)

  // Fetch product from Hub
  const product = await pl.findByID({
    collection: 'products',
    id: productId,
    depth: 2,
  })

  if (!product) {
    throw new Error(`Product ${productId} not found on Hub`)
  }

  // Find site entry in distributedTo for syncMode and priceOverride
  const distributedTo = (product as any).distributedTo as any[] | undefined
  const siteEntry = distributedTo?.find((e: any) => {
    const sid = typeof e.site === 'object' ? e.site.id : e.site
    return sid === siteId
  })

  const syncMode = siteEntry?.syncMode || 'full'

  // Operational fields — always synced regardless of syncMode
  const productData: Record<string, any> = {
    sku: (product as any).hubMasterSku || product.sku,
    ean: product.ean,
    price: product.price,
    salePrice: product.salePrice,
    stock: product.stock,
    stockStatus: product.stockStatus,
    status: product.status,
    weight: product.weight,
    // Child-specific metadata
    hubProductId: product.id,
    hubMasterSku: (product as any).hubMasterSku || product.sku,
    syncStatus: 'synced',
    syncSource: 'hub',
    syncMode,
    lastSyncedAt: new Date().toISOString(),
  }

  // Content fields — only synced in 'full' mode
  // In 'operational-only' mode, the child controls title, description, slug, SEO, images, categories
  if (syncMode === 'full') {
    productData.title = product.title
    productData.slug = product.slug
    productData.description = product.description
    productData.productType = product.productType
  }

  // Apply price override if configured
  if (siteEntry?.priceOverride) {
    productData.price = siteEntry.priceOverride
  }

  try {
    let response: any

    if (operation === 'create' || !siteEntry?.remoteProductId) {
      // Check if product already exists on child (by hubProductId)
      const existing = await client.execute<PayloadAPIListResponse>(
        (c) => c.getProducts({ where: { hubProductId: { equals: productId } }, limit: 1 }),
        'check existing product',
      )

      if (existing.docs.length > 0) {
        // Already exists — update instead
        const remoteId = (existing.docs[0] as any).id
        response = await client.execute<PayloadAPIResponse>(
          (c) => c.updateProduct(remoteId, productData),
          'update existing product',
        )
      } else {
        response = await client.execute<PayloadAPIResponse>(
          (c) => c.createProduct(productData),
          'create product',
        )
      }
    } else {
      response = await client.execute<PayloadAPIResponse>(
        (c) => c.updateProduct(siteEntry.remoteProductId, productData),
        'update product',
      )
    }

    // Update distributedTo entry on Hub
    const remoteProductId = response?.doc?.id || siteEntry?.remoteProductId
    if (remoteProductId && distributedTo) {
      const updatedDistributedTo = distributedTo.map((entry: any) => {
        const sid = typeof entry.site === 'object' ? entry.site.id : entry.site
        if (sid === siteId) {
          return {
            ...entry,
            remoteProductId,
            syncStatus: 'synced',
            lastSyncedAt: new Date().toISOString(),
            syncError: null,
          }
        }
        return entry
      })

      await pl.update({
        collection: 'products',
        id: productId,
        data: { distributedTo: updatedDistributedTo } as any,
        overrideAccess: true,
        context: { fromMultistoreSync: true },
      })
    }

    await logSync({
      site: siteId,
      direction: 'hub-to-child',
      entityType: 'product',
      entityId: String(productId),
      operation,
      status: 'success',
      duration: Date.now() - start,
    })

    console.log(`[Multistore Worker] Product ${productId} synced to ${site.name} (remote: ${remoteProductId})`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    // Update distributedTo entry with error
    if (distributedTo) {
      const updatedDistributedTo = distributedTo.map((entry: any) => {
        const sid = typeof entry.site === 'object' ? entry.site.id : entry.site
        if (sid === siteId) {
          return {
            ...entry,
            syncStatus: 'error',
            syncError: message,
            lastSyncedAt: new Date().toISOString(),
          }
        }
        return entry
      })

      await pl.update({
        collection: 'products',
        id: productId,
        data: { distributedTo: updatedDistributedTo } as any,
        overrideAccess: true,
        context: { fromMultistoreSync: true },
      }).catch(() => {})
    }

    await logSync({
      site: siteId,
      direction: 'hub-to-child',
      entityType: 'product',
      entityId: String(productId),
      operation,
      status: 'failed',
      duration: Date.now() - start,
      error: message,
    })

    throw error
  }
}

async function processSyncInventory(job: Job): Promise<void> {
  const { productId, siteIds, stock, stockStatus } = job.data.data
  console.log(`[Multistore Worker] sync-inventory: product=${productId} stock=${stock} sites=${siteIds.length}`)

  const pl = await getPayloadInstance()

  for (const siteId of siteIds) {
    const start = Date.now()
    try {
      const site = await getSiteConfig(siteId)
      if (site.status !== 'active') continue

      const client = await getClientForSite(site)

      // Find remote product ID from distributedTo
      const product = await pl.findByID({ collection: 'products', id: productId, depth: 0 })
      const distributedTo = (product as any).distributedTo as any[] | undefined
      const entry = distributedTo?.find((e: any) => {
        const sid = typeof e.site === 'object' ? e.site.id : e.site
        return sid === siteId
      })

      if (!entry?.remoteProductId) {
        console.log(`[Multistore Worker] No remote product for site ${siteId}, skipping inventory sync`)
        continue
      }

      await client.execute(
        (c) => c.updateStock(entry.remoteProductId, stock, stockStatus),
        'update stock',
      )

      await logSync({
        site: siteId,
        direction: 'hub-to-child',
        entityType: 'inventory',
        entityId: String(productId),
        operation: 'update',
        status: 'success',
        duration: Date.now() - start,
      })
    } catch (error) {
      await logSync({
        site: siteId,
        direction: 'hub-to-child',
        entityType: 'inventory',
        entityId: String(productId),
        operation: 'update',
        status: 'failed',
        duration: Date.now() - start,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
}

async function processHealthCheck(job: Job): Promise<void> {
  const { siteId } = job.data.data
  const pl = await getPayloadInstance()
  const site = await getSiteConfig(siteId)
  const client = await getClientForSite(site)

  const result = await client.execute<HealthCheckResult>(
    (c) => c.healthCheck(),
    'health check',
  )

  const healthStatus = result.status === 'ok' ? 'healthy' : 'down'

  await pl.update({
    collection: 'multistore-sites' as any,
    id: siteId,
    data: {
      healthStatus,
      lastHealthCheck: new Date().toISOString(),
      lastSyncError: result.status === 'error' ? result.message : null,
    },
    overrideAccess: true,
  })

  console.log(`[Multistore Worker] Health check ${site.name}: ${healthStatus} (${result.responseTime}ms)`)
}

async function processBulkProductSync(job: Job): Promise<void> {
  const { siteId, productIds } = job.data.data
  const pl = await getPayloadInstance()
  const { Queue } = await import('bullmq')
  const { redisConfig } = await import('@/lib/queue/redis')
  const queue = new Queue('multistore-sync', { connection: redisConfig })

  // If no specific products, sync all products with multistoreSyncEnabled
  let ids = productIds
  if (!ids || ids.length === 0) {
    const products = await pl.find({
      collection: 'products',
      where: { multistoreSyncEnabled: { equals: true } },
      limit: 10000,
      depth: 0,
      overrideAccess: true,
    })
    ids = products.docs.map((p: any) => p.id)
  }

  console.log(`[Multistore Worker] Bulk sync: ${ids.length} products to site ${siteId}`)

  for (const productId of ids) {
    await queue.add(
      'sync-product',
      {
        type: 'sync-product',
        data: { productId, siteId, operation: 'update' },
      },
      {
        jobId: `sync-product-${productId}-${siteId}-${Date.now()}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    )
  }

  await queue.close()
  console.log(`[Multistore Worker] Queued ${ids.length} product sync jobs for site ${siteId}`)
}

async function processSyncFulfillment(job: Job): Promise<void> {
  const { orderId, siteId, fulfillmentStatus, trackingCode } = job.data.data
  console.log(`[Multistore Worker] sync-fulfillment: order=${orderId} site=${siteId} status=${fulfillmentStatus}`)

  const start = Date.now()
  const pl = await getPayloadInstance()
  const site = await getSiteConfig(siteId)

  if (site.status !== 'active') {
    await logSync({
      site: siteId,
      direction: 'hub-to-child',
      entityType: 'fulfillment',
      entityId: String(orderId),
      operation: 'update',
      status: 'skipped',
      duration: Date.now() - start,
    })
    return
  }

  const client = await getClientForSite(site)

  // Get Hub order to find remoteOrderId
  const order = await pl.findByID({ collection: 'orders', id: orderId, depth: 0 })
  const remoteOrderId = (order as any).remoteOrderId
  if (!remoteOrderId) {
    console.log(`[Multistore Worker] No remoteOrderId for order ${orderId}, skipping fulfillment sync`)
    return
  }

  try {
    // Push fulfillment update to child via webhook
    await client.execute(
      (c) => c.sendWebhook('/api/webhooks/multistore', {
        event: 'fulfillment-update',
        remoteOrderId,
        fulfillmentStatus,
        trackingCode: trackingCode || (order as any).trackingCode,
        shippingProvider: (order as any).shippingProvider,
      }),
      'push fulfillment update',
    )

    await logSync({
      site: siteId,
      direction: 'hub-to-child',
      entityType: 'fulfillment',
      entityId: String(orderId),
      operation: 'update',
      status: 'success',
      duration: Date.now() - start,
    })

    console.log(`[Multistore Worker] Fulfillment ${fulfillmentStatus} pushed to ${site.name} for order ${orderId}`)
  } catch (error) {
    await logSync({
      site: siteId,
      direction: 'hub-to-child',
      entityType: 'fulfillment',
      entityId: String(orderId),
      operation: 'update',
      status: 'failed',
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

async function processReconcile(job: Job): Promise<void> {
  const { siteId, entityType } = job.data.data
  console.log(`[Multistore Worker] reconcile: entity=${entityType} site=${siteId || 'all'}`)

  const pl = await getPayloadInstance()

  if (entityType === 'inventory') {
    const { reconcileSiteInventory, fixDiscrepancies } = await import('../lib/inventory-sync')

    // If siteId is provided, reconcile that site only. Otherwise, all active sites.
    let siteIds: number[] = []
    if (siteId) {
      siteIds = [siteId]
    } else {
      const sites = await pl.find({
        collection: 'multistore-sites' as any,
        where: { status: { equals: 'active' } },
        limit: 100,
        depth: 0,
        overrideAccess: true,
      })
      siteIds = sites.docs.map((s: any) => s.id)
    }

    for (const sid of siteIds) {
      const result = await reconcileSiteInventory(pl, sid)
      console.log(
        `[Multistore Worker] Reconciliation ${result.siteName}: ${result.inSync}/${result.totalProducts} in sync, ${result.outOfSync} discrepancies (${result.duration}ms)`,
      )

      // Auto-fix discrepancies (Hub is authoritative)
      if (result.discrepancies.length > 0) {
        const fixResult = await fixDiscrepancies(pl, result.discrepancies)
        console.log(
          `[Multistore Worker] Fixed ${fixResult.fixed}/${result.discrepancies.length} discrepancies on ${result.siteName}`,
        )
      }

      // Log reconciliation run
      await logSync({
        site: sid,
        direction: 'hub-to-child',
        entityType: 'inventory',
        entityId: 'reconciliation',
        operation: 'update',
        status: result.errors.length > 0 ? 'failed' : 'success',
        duration: result.duration,
        responsePayload: {
          totalProducts: result.totalProducts,
          inSync: result.inSync,
          outOfSync: result.outOfSync,
          errorsCount: result.errors.length,
        },
      })
    }
  }
}

// ═══════════════════════════════════════════════════════════
// WORKER INSTANCE
// ═══════════════════════════════════════════════════════════

export const multistoreSyncWorker = new Worker(
  'multistore-sync',
  async (job: Job) => {
    const jobType = job.data?.type || job.name
    console.log(`[Multistore Worker] Processing: ${jobType} (${job.id}, attempt ${job.attemptsMade + 1})`)

    try {
      switch (jobType) {
        case 'sync-product':
          await processSyncProduct(job)
          break
        case 'sync-inventory':
          await processSyncInventory(job)
          break
        case 'health-check':
          await processHealthCheck(job)
          break
        case 'bulk-product-sync':
          await processBulkProductSync(job)
          break
        case 'sync-fulfillment':
          await processSyncFulfillment(job)
          break
        case 'reconcile':
          await processReconcile(job)
          break
        default:
          console.warn(`[Multistore Worker] Unknown job type: ${jobType}`)
      }
    } catch (error) {
      console.error(`[Multistore Worker] Job ${jobType} failed:`, error)
      throw error
    }
  },
  {
    ...baseWorkerConfig,
    connection: redis.options,
    concurrency: 3,
  },
)

// Worker events
multistoreSyncWorker.on('completed', (job) => {
  console.log(`[Multistore Worker] Job ${job.id} completed`)
})

multistoreSyncWorker.on('failed', (job, error) => {
  console.error(`[Multistore Worker] Job ${job?.id} failed:`, error.message)
})

multistoreSyncWorker.on('error', (error) => {
  console.error('[Multistore Worker] Worker error:', error)
})

console.log('[Multistore Worker] Multistore sync worker started')
