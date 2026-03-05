/**
 * Email Reconciliation API
 *
 * Endpoints:
 * - POST /api/email-marketing/reconciliation - Trigger manual reconciliation
 * - GET  /api/email-marketing/reconciliation - Get reconciliation status
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  triggerImmediateReconciliation,
  getScheduledJobs,
  scheduleDailyReconciliation,
  scheduleHourlyReconciliation,
  scheduleTenantReconciliation,
  clearAllSchedules,
} from '@/lib/queue/schedulers/reconciliationScheduler'
import { getReconciler } from '@/features/email-marketing/lib/reconciliation/reconciler'
import { rateLimit, RateLimitPresets } from '@/lib/security/rate-limiter'
import { checkRole, isUser } from '@/access/utilities'

// ═══════════════════════════════════════════════════════════
// POST - Trigger Manual Reconciliation
// ═══════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  // Rate limiting - 30 requests per minute (stricter for POST operations)
  const rateLimitResult = rateLimit(request, RateLimitPresets.STRICT)
  if (rateLimitResult) return rateLimitResult

  try {
    const payload = await getPayload({ config })

    // Authenticate user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { action, tenantId, intervalHours } = body

    // Handle different actions
    switch (action) {
      case 'trigger': {
        // Trigger immediate reconciliation
        const jobId = await triggerImmediateReconciliation(tenantId)

        return NextResponse.json({
          success: true,
          message: tenantId
            ? `Tenant ${tenantId} reconciliation triggered`
            : 'Full reconciliation triggered',
          jobId,
        })
      }

      case 'schedule-daily': {
        // Schedule daily reconciliation
        if (!checkRole(['super-admin'], user)) {
          return NextResponse.json(
            { success: false, error: 'Forbidden - super-admin only' },
            { status: 403 }
          )
        }

        await scheduleDailyReconciliation()

        return NextResponse.json({
          success: true,
          message: 'Daily reconciliation scheduled (2 AM)',
        })
      }

      case 'schedule-hourly': {
        // Schedule hourly reconciliation
        if (!checkRole(['super-admin'], user)) {
          return NextResponse.json(
            { success: false, error: 'Forbidden - super-admin only' },
            { status: 403 }
          )
        }

        await scheduleHourlyReconciliation()

        return NextResponse.json({
          success: true,
          message: 'Hourly reconciliation scheduled',
        })
      }

      case 'schedule-tenant': {
        // Schedule tenant-specific reconciliation
        if (!tenantId) {
          return NextResponse.json(
            { success: false, error: 'tenantId required for tenant scheduling' },
            { status: 400 }
          )
        }

        await scheduleTenantReconciliation(tenantId, intervalHours || 6)

        return NextResponse.json({
          success: true,
          message: `Tenant ${tenantId} reconciliation scheduled (every ${intervalHours || 6}h)`,
        })
      }

      case 'clear-schedules': {
        // Clear all schedules
        if (!checkRole(['super-admin'], user)) {
          return NextResponse.json(
            { success: false, error: 'Forbidden - super-admin only' },
            { status: 403 }
          )
        }

        await clearAllSchedules()

        return NextResponse.json({
          success: true,
          message: 'All schedules cleared',
        })
      }

      case 'run-now': {
        // Run reconciliation immediately (synchronous)
        const reconciler = getReconciler()
        const result = await reconciler.reconcile(tenantId ? String(tenantId) : undefined)

        return NextResponse.json({
          success: true,
          result: {
            duration: result.duration,
            dataConsistency: result.summary.dataConsistency,
            subscribers: {
              synced: result.subscribers.synced,
              created: result.subscribers.created,
              updated: result.subscribers.updated,
              orphaned: result.subscribers.orphanedPayload + result.subscribers.orphanedListmonk,
            },
            lists: {
              synced: result.lists.synced,
              created: result.lists.created,
              updated: result.lists.updated,
              orphaned: result.lists.orphanedPayload + result.lists.orphanedListmonk,
            },
            campaigns: {
              synced: result.campaigns.synced,
              statusUpdated: result.campaigns.statusUpdated,
              statsUpdated: result.campaigns.statsUpdated,
              orphaned: result.campaigns.orphanedPayload,
            },
            errors: result.errors.length,
          },
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: trigger, schedule-daily, schedule-hourly, schedule-tenant, clear-schedules, or run-now' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('[Reconciliation API] POST error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════
// GET - Get Reconciliation Status
// ═══════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  // Rate limiting - 60 requests per minute
  const rateLimitResult = rateLimit(request, RateLimitPresets.API)
  if (rateLimitResult) return rateLimitResult

  try {
    const payload = await getPayload({ config })

    // Authenticate user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get scheduled jobs
    const scheduledJobs = await getScheduledJobs()

    // Format scheduled jobs
    const formattedJobs = scheduledJobs.map((job) => ({
      id: job.id,
      name: job.name,
      pattern: job.pattern,
      nextRun: job.next,
      description: getJobDescription(job.name),
    }))

    return NextResponse.json({
      success: true,
      scheduled: formattedJobs,
      environment: process.env.NODE_ENV,
      autoInit: process.env.AUTO_INIT_RECONCILIATION === 'true',
    })
  } catch (error: any) {
    console.error('[Reconciliation API] GET error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function getJobDescription(jobName: string): string {
  if (jobName === 'daily-full-reconciliation') {
    return 'Full reconciliation - Daily at 2 AM'
  }
  if (jobName === 'hourly-reconciliation') {
    return 'Full reconciliation - Every hour'
  }
  if (jobName.startsWith('tenant-reconciliation-')) {
    const tenantId = jobName.replace('tenant-reconciliation-', '')
    return `Tenant ${tenantId} reconciliation`
  }
  return jobName
}
