/**
 * Reconciliation Worker
 *
 * BullMQ worker that runs scheduled reconciliation jobs
 * to maintain data consistency between Payload and Listmonk
 */

import { Worker, Job, WorkerOptions } from 'bullmq'
import { redis } from '../redis'
import { baseWorkerConfig } from '../config'
import { getReconciler } from '@/features/email-marketing/lib/reconciliation/reconciler'
import type { ReconciliationResult } from '@/features/email-marketing/lib/reconciliation/reconciler'
import {
  classifyError,
  shouldRetry,
  moveToDLQ,
  reportError,
} from '../errors'

// ═══════════════════════════════════════════════════════════
// JOB TYPES
// ═══════════════════════════════════════════════════════════

interface ReconciliationJob {
  type: 'full' | 'tenant'
  tenantId?: string | number
  scheduledBy?: 'cron' | 'manual' | 'api'
}

// ═══════════════════════════════════════════════════════════
// WORKER
// ═══════════════════════════════════════════════════════════

export const reconciliationWorker = new Worker(
  'email-reconciliation',
  async (job: Job<ReconciliationJob>) => {
    const { type, tenantId, scheduledBy = 'cron' } = job.data
    const attemptsMade = job.attemptsMade

    console.log(
      `[Reconciliation Worker] Starting ${type} reconciliation (attempt ${attemptsMade + 1}, scheduled by: ${scheduledBy})`
    )

    if (tenantId) {
      console.log(`[Reconciliation Worker] Target tenant: ${tenantId}`)
    }

    try {
      const reconciler = getReconciler()

      // Run reconciliation
      const result: ReconciliationResult = await reconciler.reconcile(
        tenantId ? String(tenantId) : undefined
      )

      // Log results
      console.log('[Reconciliation Worker] ✅ Reconciliation completed')
      console.log(`[Reconciliation Worker] Duration: ${result.duration}ms`)
      console.log(`[Reconciliation Worker] Data consistency: ${result.summary.dataConsistency}%`)
      console.log('[Reconciliation Worker] Summary:')
      console.log(`  - Subscribers: ${result.subscribers.synced} synced, ${result.subscribers.created} created, ${result.subscribers.updated} updated`)
      console.log(`  - Lists: ${result.lists.synced} synced, ${result.lists.created} created, ${result.lists.updated} updated`)
      console.log(`  - Campaigns: ${result.campaigns.synced} synced, ${result.campaigns.statusUpdated} status updated, ${result.campaigns.statsUpdated} stats updated`)

      if (result.errors.length > 0) {
        console.warn(`[Reconciliation Worker] ⚠️ ${result.errors.length} errors occurred during reconciliation`)
        result.errors.forEach((error, index) => {
          console.warn(`  ${index + 1}. [${error.type}] ${error.operation}: ${error.error}`)
        })
      }

      // Check data consistency
      if (result.summary.dataConsistency < 95) {
        console.warn(
          `[Reconciliation Worker] ⚠️ Data consistency below 95% (${result.summary.dataConsistency}%)`
        )
      }

      // Return result
      return {
        success: true,
        result,
        timestamp: new Date().toISOString(),
      }
    } catch (error: unknown) {
      // Classify error
      const classifiedError = classifyError(error)
      reportError('reconciliation', classifiedError, {
        jobId: job.id,
        type,
        tenantId,
        attemptsMade,
      })

      // Determine if should retry
      const retryDecision = shouldRetry(error, attemptsMade)

      if (!retryDecision.shouldRetry) {
        console.error(
          `[Reconciliation Worker] ❌ Reconciliation permanently failed: ${retryDecision.reason}`
        )

        // Move to DLQ
        await moveToDLQ('reconciliation', job.data, classifiedError, attemptsMade)

        // Throw to mark as failed
        throw new Error(`Permanent failure: ${retryDecision.reason}`)
      }

      console.warn(
        `[Reconciliation Worker] ⚠️ Reconciliation will retry: ${retryDecision.reason} (delay: ${retryDecision.delay}ms)`
      )

      // Re-throw for BullMQ retry
      throw error
    }
  },
  {
    ...baseWorkerConfig,
    concurrency: 1, // Run one reconciliation at a time to avoid conflicts
  } as WorkerOptions
)

// Worker event handlers
reconciliationWorker.on('completed', (job) => {
  console.log(`[Reconciliation Worker] ✅ Job ${job.id} completed`)
})

reconciliationWorker.on('failed', (job, error) => {
  console.error(`[Reconciliation Worker] ❌ Job ${job?.id} failed:`, error)
})

reconciliationWorker.on('error', (error) => {
  console.error('[Reconciliation Worker] Worker error:', error)
})

console.log('✅ Reconciliation Worker registered')
