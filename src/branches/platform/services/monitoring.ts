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
  } catch (error: any) {
    console.error(`[Monitoring] Health check failed for ${client.id}:`, error)

    return {
      clientId: client.id,
      status: 'critical',
      responseTime: Date.now() - start,
      statusCode: 0,
      timestamp: new Date().toISOString(),
      errors: [error.message],
    }
  }
}

/**
 * Check health of all active clients
 */
export async function checkAllClientsHealth(): Promise<HealthCheckResult[]> {
  try {
    const { getPayloadClient } = await import('@/lib/getPlatformPayload')
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
 * Calculate uptime percentage for client
 */
export async function calculateUptime(
  clientId: string,
  days: number = 30,
): Promise<number> {
  try {
    // TODO: Implement uptime calculation
    // This should:
    // 1. Query health check history from database
    // 2. Calculate percentage of successful checks
    // 3. Return uptime percentage

    /*
    const payload = await getPayloadClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const healthChecks = await payload.find({
      collection: 'health-checks', // Need to create this collection
      where: {
        clientId: { equals: clientId },
        timestamp: { greater_than: startDate.toISOString() }
      },
      limit: 10000
    })

    const totalChecks = healthChecks.totalDocs
    const successfulChecks = healthChecks.docs.filter(
      check => check.status === 'healthy'
    ).length

    return totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 0
    */

    return 99.9 // Mock for now
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
    // TODO: Aggregate monitoring data
    /*
    const payload = await getPayloadClient()

    const [
      totalClients,
      healthyClients,
      warningClients,
      criticalClients
    ] = await Promise.all([
      payload.count({ collection: 'clients', where: { status: { equals: 'active' } } }),
      payload.count({ collection: 'clients', where: { healthStatus: { equals: 'healthy' } } }),
      payload.count({ collection: 'clients', where: { healthStatus: { equals: 'warning' } } }),
      payload.count({ collection: 'clients', where: { healthStatus: { equals: 'critical' } } })
    ])

    return {
      totalClients: totalClients.totalDocs,
      healthyClients: healthyClients.totalDocs,
      warningClients: warningClients.totalDocs,
      criticalClients: criticalClients.totalDocs,
      averageUptime: 99.5,
      averageResponseTime: 250,
      recentIncidents: []
    }
    */

    return {
      totalClients: 0,
      healthyClients: 0,
      warningClients: 0,
      criticalClients: 0,
      averageUptime: 0,
      averageResponseTime: 0,
      recentIncidents: [],
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
    const { sendAlertEmail } = await import('@/platform/integrations/resend')

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
