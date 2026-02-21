/**
 * Health Check Cron Job
 * Runs every 5 minutes to check all client health
 */

import { NextResponse } from 'next/server'
import { checkAllClientsHealth } from '@/branches/platform/services/monitoring'

export async function GET(request: Request) {
  try {
    // Verify cron secret (Vercel Cron authentication)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Cron] Starting health checks...')

    // Run health checks on all clients
    const results = await checkAllClientsHealth()

    console.log(`[Cron] Health checks completed. Checked ${results.length} clients`)

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
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[Cron] Health check error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
