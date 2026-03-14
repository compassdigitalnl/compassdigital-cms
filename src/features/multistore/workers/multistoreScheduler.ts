/**
 * Multistore Scheduler
 *
 * Cron-like scheduling for multistore sync operations.
 * Runs periodic health checks, product sync, and order fetch.
 *
 * Only active when ENABLE_MULTISTORE_HUB=true.
 */

import { Queue } from 'bullmq'
import { redisConfig } from '@/lib/queue/redis'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'

let payload: Payload | null = null
let healthCheckInterval: ReturnType<typeof setInterval> | null = null
let inventoryReconcileInterval: ReturnType<typeof setInterval> | null = null

async function getPayloadInstance(): Promise<Payload> {
  if (!payload) {
    payload = await getPayload({ config })
  }
  return payload
}

async function getActiveSites(): Promise<any[]> {
  const pl = await getPayloadInstance()
  const result = await pl.find({
    collection: 'multistore-sites' as any,
    where: { status: { equals: 'active' } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })
  return result.docs
}

async function getSettings(): Promise<any> {
  try {
    const pl = await getPayloadInstance()
    return await pl.findGlobal({
      slug: 'multistore-settings' as any,
      depth: 0,
    })
  } catch {
    // Return defaults if settings not found
    return {
      healthCheckInterval: 5,
      productSyncInterval: 15,
      orderSyncInterval: 5,
      inventorySyncInterval: 30,
    }
  }
}

/**
 * Schedule health checks for all active sites
 */
async function scheduleHealthChecks(queue: Queue): Promise<void> {
  const sites = await getActiveSites()

  for (const site of sites) {
    await queue.add(
      'health-check',
      {
        type: 'health-check',
        data: { siteId: site.id },
      },
      {
        jobId: `health-check-${site.id}-${Date.now()}`,
        attempts: 1,
      },
    )
  }

  if (sites.length > 0) {
    console.log(`[Multistore Scheduler] Scheduled health checks for ${sites.length} site(s)`)
  }
}

/**
 * Schedule inventory reconciliation for all active sites
 */
async function scheduleInventoryReconciliation(queue: Queue): Promise<void> {
  await queue.add(
    'reconcile',
    {
      type: 'reconcile',
      data: { entityType: 'inventory' },
    },
    {
      jobId: `reconcile-inventory-${Date.now()}`,
      attempts: 1,
    },
  )

  console.log('[Multistore Scheduler] Scheduled inventory reconciliation')
}

/**
 * Start the scheduler loop
 */
export async function startMultistoreScheduler(): Promise<void> {
  const settings = await getSettings()
  const healthCheckMs = (settings.healthCheckInterval || 5) * 60 * 1000
  const inventoryReconcileMs = (settings.inventorySyncInterval || 30) * 60 * 1000

  const queue = new Queue('multistore-sync', { connection: redisConfig })

  // Run health checks immediately on start
  await scheduleHealthChecks(queue).catch((err) =>
    console.error('[Multistore Scheduler] Initial health check failed:', err),
  )

  // Schedule periodic health checks
  healthCheckInterval = setInterval(async () => {
    await scheduleHealthChecks(queue).catch((err) =>
      console.error('[Multistore Scheduler] Scheduled health check failed:', err),
    )
  }, healthCheckMs)

  // Schedule periodic inventory reconciliation
  inventoryReconcileInterval = setInterval(async () => {
    await scheduleInventoryReconciliation(queue).catch((err) =>
      console.error('[Multistore Scheduler] Scheduled inventory reconciliation failed:', err),
    )
  }, inventoryReconcileMs)

  console.log(`[Multistore Scheduler] Started (health: every ${settings.healthCheckInterval}min, inventory: every ${settings.inventorySyncInterval || 30}min)`)
}

/**
 * Stop the scheduler
 */
export async function stopMultistoreScheduler(): Promise<void> {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
    healthCheckInterval = null
  }
  if (inventoryReconcileInterval) {
    clearInterval(inventoryReconcileInterval)
    inventoryReconcileInterval = null
  }
  console.log('[Multistore Scheduler] Stopped')
}
