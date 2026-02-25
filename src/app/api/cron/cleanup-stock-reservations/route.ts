import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cleanupExpiredReservations } from '@/lib/stock/reservations'

/**
 * GET /api/cron/cleanup-stock-reservations
 *
 * Cron job endpoint to cleanup expired stock reservations.
 *
 * This should be called every 1-5 minutes by a cron service (e.g., Vercel Cron, GitHub Actions, or external cron-job.org).
 *
 * Purpose:
 * - Release expired stock reservations (older than 15 minutes)
 * - Free up reserved stock for other customers
 * - Prevent stock from being locked indefinitely
 *
 * Setup:
 * 1. Vercel Cron (vercel.json):
 *    {
 *      "crons": [{
 *        "path": "/api/cron/cleanup-stock-reservations",
 *        "schedule": "*/5 * * * *"
 *      }]
 *    }
 *
 * 2. External Cron (cron-job.org):
 *    - URL: https://yourdomain.com/api/cron/cleanup-stock-reservations?secret=YOUR_CRON_SECRET
 *    - Schedule: */5 * * * * (every 5 minutes)
 *
 * Security:
 * - Requires CRON_SECRET in environment variables
 * - Only accessible with correct secret parameter or from Vercel cron
 */
export async function GET(request: NextRequest) {
  try {
    // ========================================
    // 1. AUTHENTICATION
    // ========================================

    const authHeader = request.headers.get('authorization')
    const secret = request.nextUrl.searchParams.get('secret')
    const cronSecret = process.env.CRON_SECRET

    // Check if request is authorized (either via Bearer token or secret param)
    const isVercelCron = authHeader === `Bearer ${cronSecret}`
    const isValidSecret = secret && cronSecret && secret === cronSecret

    if (!isVercelCron && !isValidSecret) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid cron secret' },
        { status: 401 }
      )
    }

    // ========================================
    // 2. CLEANUP EXPIRED RESERVATIONS
    // ========================================

    const payload = await getPayload({ config })
    const result = await cleanupExpiredReservations(payload)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    // ========================================
    // 3. RETURN SUCCESS
    // ========================================

    return NextResponse.json({
      success: true,
      cleaned: result.cleaned,
      message: `Successfully cleaned up ${result.cleaned} expired stock reservations`,
      timestamp: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error('❌ Cron job error (cleanup-stock-reservations):', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Cron job failed',
        message: error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Also support POST for some cron services
export async function POST(request: NextRequest) {
  return GET(request)
}
