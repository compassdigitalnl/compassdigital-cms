/**
 * Readiness Probe
 * GET /api/email-marketing/ready
 *
 * Kubernetes-style readiness probe
 * Checks if the service is ready to accept traffic
 *
 * Returns:
 * - 200: Service is ready (database and Redis accessible)
 * - 503: Service is not ready
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
    const ready = await healthChecker.isReady()

    if (ready) {
      return NextResponse.json({ status: 'ready' }, { status: 200 })
    } else {
      return NextResponse.json({ status: 'not ready' }, { status: 503 })
    }
  } catch (error: any) {
    return NextResponse.json({ status: 'not ready', error: error.message }, { status: 503 })
  }
}

export const dynamic = 'force-dynamic'
