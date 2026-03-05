#!/usr/bin/env tsx
/**
 * Health Monitoring Cron Job
 *
 * Runs periodic health checks and sends alerts if issues are detected
 *
 * Usage:
 *   npx tsx src/scripts/cron/health-monitoring.ts
 *
 * Crontab examples:
 *   # Every 5 minutes
 *   *\/5 * * * * cd /app && npx tsx src/scripts/cron/health-monitoring.ts
 *
 *   # Every 1 minute
 *   * * * * * cd /app && npx tsx src/scripts/cron/health-monitoring.ts
 */

import { getHealthChecker } from '@/features/email-marketing/lib/monitoring/HealthChecker'
import { getMetricsCollector } from '@/features/email-marketing/lib/monitoring/MetricsCollector'
import { getAlertManager } from '@/features/email-marketing/lib/monitoring/AlertManager'
import { captureError, addBreadcrumb } from '@/features/email-marketing/lib/monitoring/SentryIntegration'

/**
 * Main monitoring function
 */
async function runHealthMonitoring() {
  const startTime = Date.now()

  console.log('═══════════════════════════════════════════════════════════════════════════════')
  console.log('🏥 HEALTH MONITORING - Starting checks...')
  console.log('═══════════════════════════════════════════════════════════════════════════════')

  try {
    addBreadcrumb({
      category: 'monitoring',
      message: 'Starting health monitoring',
      level: 'info',
    })

    // Get instances
    const healthChecker = getHealthChecker()
    const metricsCollector = getMetricsCollector()
    const alertManager = getAlertManager()

    // 1. Run health checks
    console.log('\n[1/3] Running health checks...')
    const health = await healthChecker.checkAll()

    console.log(`\nHealth Status: ${health.status.toUpperCase()}`)
    console.log('Component Status:')
    for (const [name, component] of Object.entries(health.components)) {
      const statusIcon =
        component.status === 'healthy'
          ? '✅'
          : component.status === 'degraded'
            ? '⚠️'
            : '❌'
      console.log(
        `  ${statusIcon} ${name.padEnd(15)} ${component.status.padEnd(10)} (${component.responseTime}ms)`,
      )
      if (component.message) {
        console.log(`     ${component.message}`)
      }
    }

    console.log('\nSummary:')
    console.log(`  Total checks: ${health.summary.totalChecks}`)
    console.log(`  ✅ Healthy: ${health.summary.healthyChecks}`)
    console.log(`  ⚠️ Degraded: ${health.summary.degradedChecks}`)
    console.log(`  ❌ Unhealthy: ${health.summary.unhealthyChecks}`)

    // 2. Check metrics
    console.log('\n[2/3] Checking metrics...')
    const metrics = await metricsCollector.getSystemHealth()

    console.log('\nKey Metrics (24h):')
    console.log(`  Emails sent: ${metrics.emailsSent24h}`)
    console.log(`  Emails failed: ${metrics.emailsFailed24h}`)
    console.log(
      `  Failure rate: ${metrics.emailsSent24h > 0 ? ((metrics.emailsFailed24h / metrics.emailsSent24h) * 100).toFixed(1) : 0}%`,
    )
    console.log(`  Active subscribers: ${metrics.activeSubscribers}`)
    console.log(`  Active campaigns: ${metrics.activeCampaigns}`)
    console.log(`  Automation executions: ${metrics.automationExecutions24h}`)
    console.log(`  Automation errors: ${metrics.automationErrors24h}`)
    console.log(`  API requests: ${metrics.apiRequests24h}`)
    console.log(`  API errors: ${metrics.apiErrors24h}`)
    console.log(`  Failed jobs: ${metrics.failedJobs}`)

    // 3. Send alerts if needed
    console.log('\n[3/3] Checking alerts...')
    await alertManager.checkHealthAndAlert(health)
    await alertManager.checkMetricsAndAlert(metrics)

    const activeAlerts = alertManager.getActiveAlerts()
    if (activeAlerts.length > 0) {
      console.log(`\n⚠️  Active alerts: ${activeAlerts.length}`)
      for (const alert of activeAlerts) {
        console.log(`  - [${alert.severity.toUpperCase()}] ${alert.title}`)
      }
    } else {
      console.log('\n✅ No active alerts')
    }

    // Finish
    const duration = Date.now() - startTime
    console.log('\n═══════════════════════════════════════════════════════════════════════════════')
    console.log(`✅ HEALTH MONITORING COMPLETE (${duration}ms)`)
    console.log('═══════════════════════════════════════════════════════════════════════════════\n')

    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ HEALTH MONITORING FAILED')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)

    // Capture in Sentry
    captureError(error, {
      tags: { component: 'health-monitoring' },
      level: 'error',
    })

    console.log('\n═══════════════════════════════════════════════════════════════════════════════\n')

    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  runHealthMonitoring()
}

export { runHealthMonitoring }
