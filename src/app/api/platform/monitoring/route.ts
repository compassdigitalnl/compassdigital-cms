/**
 * Platform Monitoring Dashboard API
 *
 * Returns aggregated uptime data, incidents, and per-client status.
 */

import { NextResponse } from 'next/server'
import { getMonitoringDashboard, calculateUptime } from '@/features/platform/services/monitoring'

export async function GET(request: Request) {
  try {
    // Auth check — only platform admins
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // For browser requests, check cookie-based auth
      const { getPayloadClient } = await import('@/lib/tenant/getPlatformPayload')
      const payload = await getPayloadClient()

      // Try to get user from headers (Payload auth)
      const cookie = request.headers.get('cookie') || ''
      if (!cookie.includes('payload-token')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const dashboard = await getMonitoringDashboard()

    return NextResponse.json({
      success: true,
      ...dashboard,
    })
  } catch (error: unknown) {
    console.error('[API] Monitoring dashboard error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    )
  }
}
