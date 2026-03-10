/**
 * Health Check Cron Job
 *
 * Runs every 5 minutes to check all client health.
 * Now includes uptime logging, incident detection, and alerting.
 */

import { NextResponse } from 'next/server'
import { checkAllClientsHealth } from '@/features/platform/services/monitoring'
import {
  checkSiteHealth,
  logCheck,
  getConsecutiveFailures,
  cleanupOldChecks,
} from '@/features/platform/monitoring/lib/uptime-checker'
import { processCheckResult } from '@/features/platform/monitoring/lib/incident-detector'
import { sendDownAlert, sendRecoveryAlert } from '@/features/platform/monitoring/lib/uptime-alerter'

export async function GET(request: Request) {
  try {
    // Verify cron secret (Vercel Cron authentication)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Cron] Starting health checks...')

    // Run existing health checks (updates client records)
    const results = await checkAllClientsHealth()

    console.log(`[Cron] Health checks completed. Checked ${results.length} clients`)

    // Enhanced uptime monitoring with incident detection
    let incidentsCreated = 0
    let incidentsResolved = 0

    try {
      const { getPayloadClient } = await import('@/lib/tenant/getPlatformPayload')
      const payload = await getPayloadClient()
      const drizzle = (payload.db as any).drizzle

      // Get all active clients for detailed checks
      const clients = await payload.find({
        collection: 'clients',
        where: { status: { equals: 'active' } },
        limit: 1000,
      })

      // Run uptime checks, log results, detect incidents
      for (const client of clients.docs as any[]) {
        const check = await checkSiteHealth({
          id: String(client.id),
          name: client.name || client.id,
          deploymentUrl: client.deploymentUrl,
        })

        // Log to uptime_checks table
        await logCheck(drizzle, check)

        // Get consecutive failures and process incidents
        const failures = await getConsecutiveFailures(drizzle, String(client.id))
        const { incident, resolved, needsAlert } = await processCheckResult(
          drizzle,
          check,
          failures,
        )

        // Send alerts if needed
        if (needsAlert) {
          if (incident && !resolved) {
            await sendDownAlert(drizzle, incident)
            incidentsCreated++
          } else if (resolved && incident) {
            await sendRecoveryAlert(incident)
            incidentsResolved++
          }
        }
      }

      // Cleanup old check records (once a day, roughly)
      if (new Date().getMinutes() === 0 && new Date().getHours() === 3) {
        const cleaned = await cleanupOldChecks(drizzle)
        if (cleaned > 0) console.log(`[Cron] Cleaned up ${cleaned} old uptime checks`)
      }
    } catch (uptimeError: unknown) {
      const message = uptimeError instanceof Error ? uptimeError.message : String(uptimeError)
      console.error('[Cron] Uptime monitoring error (non-fatal):', message)
    }

    // Count by status
    const statusCounts = results.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      success: true,
      checked: results.length,
      statusCounts,
      incidentsCreated,
      incidentsResolved,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    console.error('[Cron] Health check error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    )
  }
}
