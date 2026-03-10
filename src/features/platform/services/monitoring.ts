/**
 * 📊 Monitoring Service
 *
 * Monitors health and uptime of all client sites.
 * Runs periodic health checks and updates client status.
 */

export interface HealthCheckResult {
  clientId: string
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  responseTime: number
  statusCode: number
  timestamp: string
  errors?: string[]
  details?: {
    database?: boolean
    memory?: number
    disk?: number
  }
}

/**
 * Perform health check on a client site
 */
export async function checkClientHealth(client: {
  id: string
  deploymentUrl: string
  adminUrl: string
}): Promise<HealthCheckResult> {
  const start = Date.now()
  const errors: string[] = []

  try {
    // Check main site
    const siteResponse = await fetch(client.deploymentUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    // Check health endpoint
    const healthResponse = await fetch(`${client.deploymentUrl}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5s timeout
    })

    const responseTime = Date.now() - start
    const healthData = healthResponse.ok ? await healthResponse.json() : null

    // Determine status
    let status: HealthCheckResult['status'] = 'healthy'
    if (!siteResponse.ok) {
      status = 'critical'
      errors.push(`Site returned ${siteResponse.status}`)
    } else if (!healthResponse.ok) {
      status = 'warning'
      errors.push('Health endpoint unavailable')
    } else if (responseTime > 3000) {
      status = 'warning'
      errors.push('Slow response time')
    }

    return {
      clientId: client.id,
      status,
      responseTime,
      statusCode: siteResponse.status,
      timestamp: new Date().toISOString(),
      errors: errors.length > 0 ? errors : undefined,
      details: healthData?.details,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[Monitoring] Health check failed for ${client.id}:`, error)

    return {
      clientId: client.id,
      status: 'critical',
      responseTime: Date.now() - start,
      statusCode: 0,
      timestamp: new Date().toISOString(),
      errors: [message],
    }
  }
}

/**
 * Check health of all active clients
 */
export async function checkAllClientsHealth(): Promise<HealthCheckResult[]> {
  try {
    const { getPayloadClient } = await import('@/lib/tenant/getPlatformPayload')
    const payload = await getPayloadClient()

    // Get all active clients from Payload
    const clients = await payload.find({
      collection: 'clients',
      where: {
        status: { equals: 'active' },
      },
      limit: 1000,
    })

    console.log(`[Monitoring] Checking ${clients.docs.length} active clients`)

    // Run health checks in parallel (batched to avoid overwhelming)
    const batchSize = 10
    const results: HealthCheckResult[] = []

    for (let i = 0; i < clients.docs.length; i += batchSize) {
      const batch = clients.docs.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map((client: any) =>
          checkClientHealth({
            id: client.id,
            deploymentUrl: client.deploymentUrl,
            adminUrl: client.adminUrl,
          }),
        ),
      )
      results.push(...batchResults)
    }

    // Update client health status in database
    await Promise.all(
      results.map((result) =>
        payload.update({
          collection: 'clients',
          id: result.clientId,
          data: {
            healthStatus: result.status,
            lastHealthCheck: result.timestamp,
          },
        }),
      ),
    )

    console.log(`[Monitoring] Health checks completed`)

    return results
  } catch (error) {
    console.error('[Monitoring] Error checking all clients:', error)
    return []
  }
}

/**
 * Calculate uptime percentage for client (uses uptime_checks table)
 */
export async function calculateUptime(
  clientId: string,
  days: number = 30,
): Promise<number> {
  try {
    const { calculateUptimePercent } = await import(
      '@/features/platform/monitoring/lib/uptime-checker'
    )
    const { getPayloadClient } = await import('@/lib/tenant/getPlatformPayload')
    const payload = await getPayloadClient()
    const drizzle = (payload.db as any).drizzle
    return await calculateUptimePercent(drizzle, clientId, days)
  } catch (error) {
    console.error('[Monitoring] Error calculating uptime:', error)
    return 0
  }
}

/**
 * Get monitoring dashboard data
 */
export async function getMonitoringDashboard(): Promise<{
  totalClients: number
  healthyClients: number
  warningClients: number
  criticalClients: number
  averageUptime: number
  averageResponseTime: number
  recentIncidents: any[]
}> {
  try {
    const { getPayloadClient } = await import('@/lib/tenant/getPlatformPayload')
    const payload = await getPayloadClient()
    const drizzle = (payload.db as any).drizzle

    // Count clients by health status
    const clients = await payload.find({
      collection: 'clients',
      where: { status: { equals: 'active' } },
      limit: 1000,
    })

    const docs = clients.docs as any[]
    const totalClients = docs.length
    const healthyClients = docs.filter((c) => c.healthStatus === 'healthy').length
    const warningClients = docs.filter((c) => c.healthStatus === 'warning').length
    const criticalClients = docs.filter((c) => c.healthStatus === 'critical').length

    // Get recent incidents
    const { getRecentIncidents } = await import(
      '@/features/platform/monitoring/lib/incident-detector'
    )
    const recentIncidents = await getRecentIncidents(drizzle, 20)

    // Calculate average response time from recent checks
    const { sql } = await import('drizzle-orm')
    const avgResult = await drizzle.execute(
      sql.raw(`
        SELECT AVG(response_time) as avg_rt
        FROM uptime_checks
        WHERE checked_at >= NOW() - INTERVAL '1 day'
      `),
    )
    const averageResponseTime = Math.round(Number(avgResult?.rows?.[0]?.avg_rt) || 0)

    // Average uptime
    const uptimeResult = await drizzle.execute(
      sql.raw(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status != 'critical') as up
        FROM uptime_checks
        WHERE checked_at >= NOW() - INTERVAL '30 days'
      `),
    )
    const uptimeRow = uptimeResult?.rows?.[0]
    const averageUptime =
      uptimeRow && Number(uptimeRow.total) > 0
        ? Math.round((Number(uptimeRow.up) / Number(uptimeRow.total)) * 10000) / 100
        : 100

    return {
      totalClients,
      healthyClients,
      warningClients,
      criticalClients,
      averageUptime,
      averageResponseTime,
      recentIncidents,
    }
  } catch (error) {
    console.error('[Monitoring] Error getting dashboard data:', error)
    throw error
  }
}

/**
 * Send alert for critical issues
 */
export async function sendAlert(data: {
  clientId: string
  clientName: string
  issue: string
  severity: 'warning' | 'critical'
  deploymentUrl?: string
}): Promise<void> {
  try {
    const { sendAlertEmail } = await import('@/features/platform/integrations/resend')

    console.log(`[Alert] ${data.severity.toUpperCase()}: ${data.clientName} - ${data.issue}`)

    // Send email alert
    await sendAlertEmail({
      clientId: data.clientId,
      clientName: data.clientName,
      issue: data.issue,
      severity: data.severity,
      deploymentUrl: data.deploymentUrl,
    })
  } catch (error) {
    console.error('[Monitoring] Error sending alert:', error)
  }
}

/**
 * Scheduled job: Run health checks every 5 minutes
 */
export async function scheduleHealthChecks() {
  console.log('[Monitoring] Starting scheduled health checks...')

  // Run initial check
  await runScheduledHealthCheck()

  // Schedule recurring checks (every 5 minutes)
  setInterval(
    async () => {
      await runScheduledHealthCheck()
    },
    5 * 60 * 1000,
  ) // 5 minutes
}

/**
 * Run scheduled health check
 */
async function runScheduledHealthCheck() {
  try {
    console.log('[Monitoring] Running scheduled health check...')

    const results = await checkAllClientsHealth()

    // Check for critical issues
    const criticalIssues = results.filter((r) => r.status === 'critical')
    if (criticalIssues.length > 0) {
      console.warn(`[Monitoring] Found ${criticalIssues.length} critical issues`)

      // Send alerts (implement based on your needs)
      for (const issue of criticalIssues) {
        await sendAlert({
          clientId: issue.clientId,
          clientName: issue.clientId, // TODO: Get actual name
          issue: issue.errors?.join(', ') || 'Unknown error',
          severity: 'critical',
        })
      }
    }

    console.log(`[Monitoring] Health check completed. ${results.length} clients checked.`)
  } catch (error) {
    console.error('[Monitoring] Scheduled health check failed:', error)
  }
}
