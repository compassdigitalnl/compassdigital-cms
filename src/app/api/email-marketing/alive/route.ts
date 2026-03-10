/**
 * Liveness Probe
 * GET /api/email-marketing/alive
 *
 * Kubernetes-style liveness probe
 * Checks if the service is alive (minimal check)
 *
 * Returns:
 * - 200: Service is alive
 * - 503: Service is dead (needs restart)
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
    const alive = await healthChecker.isAlive()

    if (alive) {
      return NextResponse.json({ status: 'alive' }, { status: 200 })
    } else {
      return NextResponse.json({ status: 'dead' }, { status: 503 })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ status: 'dead', error: message }, { status: 503 })
  }
}

export const dynamic = 'force-dynamic'
