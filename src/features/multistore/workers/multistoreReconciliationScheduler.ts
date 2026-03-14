/**
 * Multistore Reconciliation Scheduler
 *
 * Periodically runs full data consistency checks (products, orders)
 * across all active child webshops. Logs results to SyncLog.
 *
 * Runs alongside the main multistoreScheduler, but at a lower frequency
 * (default: every 6 hours) since reconciliation is expensive.
 *
 * Only active when ENABLE_MULTISTORE_HUB=true AND ENABLE_MULTISTORE_REPORTS=true.
 */

import { Queue } from 'bullmq'
import { redisConfig } from '@/lib/queue/redis'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { runFullReconciliation } from '../lib/reconciliation'

let payload: Payload | null = null
let reconciliationInterval: ReturnType<typeof setInterval> | null = null

async function getPayloadInstance(): Promise<Payload> {
  if (!payload) {
    payload = await getPayload({ config })
  }
  return payload
}

/**
 * Run full reconciliation and log results
 */
async function runScheduledReconciliation(): Promise<void> {
  const pl = await getPayloadInstance()

  console.log('[Multistore Reconciliation] Starting scheduled full reconciliation...')

  try {
    const report = await runFullReconciliation(pl)

    console.log(
      `[Multistore Reconciliation] Complete: ${report.sitesChecked} sites, ` +
      `${report.summary.totalIssues} issues (${report.summary.errors} errors, ${report.summary.warnings} warnings) ` +
      `in ${report.duration}ms`,
    )

    // Log summary to SyncLog
    await pl.create({
      collection: 'multistore-sync-log' as any,
      data: {
        direction: 'hub-to-child',
        entityType: 'product',
        entityId: 'reconciliation-report',
        operation: 'update',
        status: report.summary.errors > 0 ? 'failed' : 'success',
        duration: report.duration,
        responsePayload: {
          sitesChecked: report.sitesChecked,
          totalIssues: report.summary.totalIssues,
          warnings: report.summary.warnings,
          errors: report.summary.errors,
          issues: report.issues.slice(0, 50), // Limit stored issues
        },
      },
      overrideAccess: true,
    }).catch(() => {})

    // Log individual errors for visibility
    for (const issue of report.issues.filter((i) => i.severity === 'error')) {
      console.warn(`[Multistore Reconciliation] ERROR: ${issue.description}`)
    }
  } catch (error) {
    console.error('[Multistore Reconciliation] Failed:', error)
  }
}

/**
 * Start the reconciliation scheduler
 * Default: every 6 hours
 */
export async function startReconciliationScheduler(intervalHours: number = 6): Promise<void> {
  const intervalMs = intervalHours * 60 * 60 * 1000

  // Run after a 5-minute delay on startup (let other systems initialize first)
  setTimeout(() => {
    runScheduledReconciliation().catch((err) =>
      console.error('[Multistore Reconciliation] Initial run failed:', err),
    )
  }, 5 * 60 * 1000)

  // Schedule periodic runs
  reconciliationInterval = setInterval(async () => {
    await runScheduledReconciliation().catch((err) =>
      console.error('[Multistore Reconciliation] Scheduled run failed:', err),
    )
  }, intervalMs)

  console.log(`[Multistore Reconciliation] Scheduler started (every ${intervalHours}h)`)
}

/**
 * Stop the reconciliation scheduler
 */
export function stopReconciliationScheduler(): void {
  if (reconciliationInterval) {
    clearInterval(reconciliationInterval)
    reconciliationInterval = null
    console.log('[Multistore Reconciliation] Scheduler stopped')
  }
}
