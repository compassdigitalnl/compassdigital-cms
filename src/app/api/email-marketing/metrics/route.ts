/**
 * Metrics API
 * GET /api/email-marketing/metrics
 *
 * Returns metrics in multiple formats:
 * - JSON (default): For dashboards
 * - Prometheus: For Prometheus scraping (?format=prometheus)
 *
 * Authentication: Requires API key with 'analytics:read' scope
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getMetricsCollector } from '@/features/email-marketing/lib/monitoring/MetricsCollector'
import { requireApiKey } from '@/features/email-marketing/lib/api-auth/validateApiKey'
import { emailMarketingFeatures } from '@/lib/features'

export async function GET(request: NextRequest) {
  try {
    // Check feature flag
    if (!emailMarketingFeatures.campaigns()) {
      return NextResponse.json({ error: 'Email marketing feature is disabled' }, { status: 403 })
    }

    const payload = await getPayload({ config })

    // Validate API key
    const validation = await requireApiKey(request, payload, 'analytics:read')
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 401 })
    }

    const metricsCollector = getMetricsCollector()

    // Check requested format
    const format = request.nextUrl.searchParams.get('format') || 'json'

    if (format === 'prometheus') {
      // Export in Prometheus format
      const prometheusMetrics = metricsCollector.exportPrometheusMetrics()

      return new Response(prometheusMetrics, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; version=0.0.4',
        },
      })
    } else {
      // Export in JSON format
      const systemHealth = await metricsCollector.getSystemHealth()
      const allMetrics = metricsCollector.getAllMetrics()

      return NextResponse.json(
        {
          systemHealth,
          metrics: allMetrics,
          timestamp: new Date(),
        },
        { status: 200 },
      )
    }
  } catch (error: any) {
    console.error('[Metrics API] Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get metrics' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
