/**
 * Email Marketing Engine Health Check API
 * GET /api/email-marketing/health
 *
 * Comprehensive health check for all email marketing components
 *
 * Returns:
 * - 200: All systems healthy or degraded
 * - 503: One or more critical systems unhealthy
 */

import { NextRequest, NextResponse } from 'next/server'
import { getHealthChecker } from '@/features/email-marketing/lib/monitoring/HealthChecker'
import { emailMarketingFeatures } from '@/lib/tenant/features'

export async function GET(request: NextRequest) {
  try {
    // Check feature flag
    if (!emailMarketingFeatures.campaigns()) {
      return NextResponse.json({ error: 'Email marketing feature is disabled' }, { status: 403 })
    }

    const healthChecker = getHealthChecker()

    // Run all health checks
    const health = await healthChecker.checkAll()

    // Determine HTTP status code
    const statusCode = health.status === 'unhealthy' ? 503 : 200

    return NextResponse.json(
      {
        status: health.status,
        timestamp: health.timestamp,
        components: health.components,
        summary: health.summary,
      },
      { status: statusCode },
    )
  } catch (error: unknown) {
    console.error('[Health Check] Error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: message || 'Health check failed',
        timestamp: new Date(),
      },
      { status: 503 },
    )
  }
}

// Allow public access (for monitoring services)
export const dynamic = 'force-dynamic'
