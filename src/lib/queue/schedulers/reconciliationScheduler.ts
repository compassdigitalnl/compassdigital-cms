/**
 * Reconciliation Scheduler
 *
 * Schedules recurring reconciliation jobs using BullMQ repeatable jobs
 *
 * Default schedule:
 * - Full reconciliation: Daily at 2 AM
 * - Per-tenant reconciliation: Every 6 hours
 */

import { Queue } from 'bullmq'
import { redisConfig } from '../redis'

// ═══════════════════════════════════════════════════════════
// QUEUE
// ═══════════════════════════════════════════════════════════

const reconciliationQueue = new Queue('email-reconciliation', {
  connection: redisConfig,
})

// ═══════════════════════════════════════════════════════════
// SCHEDULE CONFIGURATION
// ═══════════════════════════════════════════════════════════

/**
 * Schedule daily full reconciliation at 2 AM
 */
export async function scheduleDailyReconciliation(): Promise<void> {
  try {
    // Remove existing schedules (in case of restart)
    const repeatableJobs = await reconciliationQueue.getRepeatableJobs()
    for (const job of repeatableJobs) {
      if (job.name === 'daily-full-reconciliation') {
        await reconciliationQueue.removeRepeatableByKey(job.key)
      }
    }

    // Schedule new job
    await reconciliationQueue.add(
      'daily-full-reconciliation',
      {
        type: 'full',
        scheduledBy: 'cron',
      },
      {
        repeat: {
          pattern: '0 2 * * *', // Every day at 2 AM (cron format)
        },
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000, // Start with 60s backoff
        },
      }
    )

    console.log('[Reconciliation Scheduler] ✅ Daily full reconciliation scheduled (2 AM daily)')
  } catch (error: unknown) {
    console.error('[Reconciliation Scheduler] ❌ Failed to schedule daily reconciliation:', error)
    throw error
  }
}

/**
 * Schedule hourly reconciliation checks
 * Useful for high-traffic tenants that need more frequent syncing
 */
export async function scheduleHourlyReconciliation(): Promise<void> {
  try {
    // Remove existing schedules
    const repeatableJobs = await reconciliationQueue.getRepeatableJobs()
    for (const job of repeatableJobs) {
      if (job.name === 'hourly-reconciliation') {
        await reconciliationQueue.removeRepeatableByKey(job.key)
      }
    }

    // Schedule new job
    await reconciliationQueue.add(
      'hourly-reconciliation',
      {
        type: 'full',
        scheduledBy: 'cron',
      },
      {
        repeat: {
          pattern: '0 * * * *', // Every hour at minute 0
        },
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 30000,
        },
      }
    )

    console.log('[Reconciliation Scheduler] ✅ Hourly reconciliation scheduled (every hour)')
  } catch (error: unknown) {
    console.error('[Reconciliation Scheduler] ❌ Failed to schedule hourly reconciliation:', error)
    throw error
  }
}

/**
 * Schedule reconciliation for specific tenant
 */
export async function scheduleTenantReconciliation(
  tenantId: string | number,
  intervalHours: number = 6
): Promise<void> {
  try {
    const jobName = `tenant-reconciliation-${tenantId}`

    // Remove existing schedule for this tenant
    const repeatableJobs = await reconciliationQueue.getRepeatableJobs()
    for (const job of repeatableJobs) {
      if (job.name === jobName) {
        await reconciliationQueue.removeRepeatableByKey(job.key)
      }
    }

    // Schedule new job
    const pattern = intervalHours === 1
      ? '0 * * * *' // Every hour
      : intervalHours === 6
      ? '0 */6 * * *' // Every 6 hours
      : intervalHours === 12
      ? '0 */12 * * *' // Every 12 hours
      : '0 0 * * *' // Default: daily

    await reconciliationQueue.add(
      jobName,
      {
        type: 'tenant',
        tenantId,
        scheduledBy: 'cron',
      },
      {
        repeat: {
          pattern,
        },
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 30000,
        },
      }
    )

    console.log(`[Reconciliation Scheduler] ✅ Tenant ${tenantId} reconciliation scheduled (every ${intervalHours}h)`)
  } catch (error: unknown) {
    console.error(`[Reconciliation Scheduler] ❌ Failed to schedule tenant ${tenantId} reconciliation:`, error)
    throw error
  }
}

/**
 * Trigger immediate reconciliation (manual trigger)
 */
export async function triggerImmediateReconciliation(
  tenantId?: string | number
): Promise<string> {
  try {
    const job = await reconciliationQueue.add(
      'manual-reconciliation',
      {
        type: tenantId ? 'tenant' : 'full',
        tenantId,
        scheduledBy: 'manual',
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 10000,
        },
      }
    )

    console.log(`[Reconciliation Scheduler] ✅ Manual reconciliation triggered (Job ID: ${job.id})`)
    return job.id || 'unknown'
  } catch (error: unknown) {
    console.error('[Reconciliation Scheduler] ❌ Failed to trigger manual reconciliation:', error)
    throw error
  }
}

/**
 * Get all scheduled reconciliation jobs
 */
export async function getScheduledJobs(): Promise<any[]> {
  try {
    const repeatableJobs = await reconciliationQueue.getRepeatableJobs()
    return repeatableJobs
  } catch (error: unknown) {
    console.error('[Reconciliation Scheduler] ❌ Failed to get scheduled jobs:', error)
    throw error
  }
}

/**
 * Remove all scheduled reconciliation jobs
 */
export async function clearAllSchedules(): Promise<void> {
  try {
    const repeatableJobs = await reconciliationQueue.getRepeatableJobs()
    for (const job of repeatableJobs) {
      await reconciliationQueue.removeRepeatableByKey(job.key)
    }
    console.log(`[Reconciliation Scheduler] ✅ Cleared ${repeatableJobs.length} scheduled jobs`)
  } catch (error: unknown) {
    console.error('[Reconciliation Scheduler] ❌ Failed to clear schedules:', error)
    throw error
  }
}

/**
 * Initialize default schedules
 * Call this on server startup
 */
export async function initializeReconciliationSchedules(): Promise<void> {
  console.log('[Reconciliation Scheduler] Initializing schedules...')

  try {
    // Clear any existing schedules first
    await clearAllSchedules()

    // Schedule based on environment
    const env = (process.env.NODE_ENV || 'development') as string

    if (env === 'production') {
      // Production: Daily at 2 AM
      await scheduleDailyReconciliation()
    } else if (env === 'staging') {
      // Staging: Every 6 hours
      await scheduleHourlyReconciliation()
    } else {
      // Development: Manual only (no automatic scheduling)
      console.log('[Reconciliation Scheduler] Development mode - no automatic schedules')
    }

    console.log('[Reconciliation Scheduler] ✅ Initialization complete')
  } catch (error: unknown) {
    console.error('[Reconciliation Scheduler] ❌ Initialization failed:', error)
  }
}

// ═══════════════════════════════════════════════════════════
// AUTO-INITIALIZE ON IMPORT (IF ENABLED)
// ═══════════════════════════════════════════════════════════

const AUTO_INIT = process.env.AUTO_INIT_RECONCILIATION === 'true'

if (AUTO_INIT) {
  initializeReconciliationSchedules().catch(console.error)
}
