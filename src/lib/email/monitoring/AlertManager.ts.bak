/**
 * Alert Manager
 *
 * Manages alerts and notifications for critical system events
 * Integrates with email, Slack, PagerDuty, etc.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { SystemHealth, HealthStatus } from './HealthChecker'
import type { SystemHealthMetrics } from './MetricsCollector'

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Alert types
 */
export enum AlertType {
  SYSTEM_HEALTH = 'system_health',
  HIGH_ERROR_RATE = 'high_error_rate',
  HIGH_FAILURE_RATE = 'high_failure_rate',
  QUEUE_STUCK = 'queue_stuck',
  DATABASE_SLOW = 'database_slow',
  REDIS_DOWN = 'redis_down',
  LISTMONK_DOWN = 'listmonk_down',
  RATE_LIMIT_ABUSE = 'rate_limit_abuse',
  AUTOMATION_ERRORS = 'automation_errors',
  DISK_SPACE_LOW = 'disk_space_low',
  MEMORY_HIGH = 'memory_high',
}

/**
 * Alert data
 */
export interface Alert {
  id?: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  metadata?: Record<string, any>
  timestamp: Date
  resolved?: boolean
  resolvedAt?: Date
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  // Email failure rate threshold
  emailFailureRateThreshold: number // %
  emailFailureWindowMinutes: number

  // Queue stuck threshold
  queueStuckJobsThreshold: number
  queueStuckMinutes: number

  // Database performance threshold
  databaseSlowThresholdMs: number

  // Automation error threshold
  automationErrorThreshold: number
  automationErrorWindowMinutes: number

  // Rate limit abuse threshold
  rateLimitAbuseThreshold: number
  rateLimitAbuseWindowMinutes: number

  // System health check interval
  healthCheckIntervalSeconds: number

  // Memory threshold
  memoryUsageThresholdPercent: number

  // Notification channels
  enableEmailAlerts: boolean
  enableSlackAlerts: boolean
  enablePagerDutyAlerts: boolean

  // Alert recipients
  alertEmails: string[]
  slackWebhookUrl?: string
  pagerDutyApiKey?: string
}

/**
 * Default alert configuration
 */
export const DEFAULT_ALERT_CONFIG: AlertConfig = {
  emailFailureRateThreshold: 10, // 10%
  emailFailureWindowMinutes: 60,

  queueStuckJobsThreshold: 50,
  queueStuckMinutes: 60,

  databaseSlowThresholdMs: 1000,

  automationErrorThreshold: 10,
  automationErrorWindowMinutes: 60,

  rateLimitAbuseThreshold: 100,
  rateLimitAbuseWindowMinutes: 60,

  healthCheckIntervalSeconds: 60,

  memoryUsageThresholdPercent: 90,

  enableEmailAlerts: true,
  enableSlackAlerts: false,
  enablePagerDutyAlerts: false,

  alertEmails: process.env.ALERT_EMAILS?.split(',') || [],
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  pagerDutyApiKey: process.env.PAGERDUTY_API_KEY,
}

/**
 * Alert Manager
 */
export class AlertManager {
  private config: AlertConfig
  private activeAlerts: Map<string, Alert> = new Map()

  constructor(config: AlertConfig = DEFAULT_ALERT_CONFIG) {
    this.config = config
  }

  /**
   * Create and send alert
   */
  async sendAlert(alert: Omit<Alert, 'id' | 'timestamp'>): Promise<void> {
    const fullAlert: Alert = {
      ...alert,
      id: this.generateAlertId(alert.type),
      timestamp: new Date(),
    }

    // Store alert
    this.activeAlerts.set(fullAlert.id, fullAlert)

    // Log alert
    console.error(`[ALERT] [${fullAlert.severity.toUpperCase()}] ${fullAlert.title}`)
    console.error(`[ALERT] ${fullAlert.message}`)
    if (fullAlert.metadata) {
      console.error('[ALERT] Metadata:', fullAlert.metadata)
    }

    // Send notifications based on severity and configuration
    await this.sendNotifications(fullAlert)

    // Store in database for history
    await this.storeAlert(fullAlert)
  }

  /**
   * Send notifications via configured channels
   */
  private async sendNotifications(alert: Alert): Promise<void> {
    const notifications: Promise<void>[] = []

    // Email alerts
    if (this.config.enableEmailAlerts && this.config.alertEmails.length > 0) {
      notifications.push(this.sendEmailAlert(alert))
    }

    // Slack alerts
    if (this.config.enableSlackAlerts && this.config.slackWebhookUrl) {
      notifications.push(this.sendSlackAlert(alert))
    }

    // PagerDuty alerts (critical only)
    if (
      this.config.enablePagerDutyAlerts &&
      this.config.pagerDutyApiKey &&
      alert.severity === AlertSeverity.CRITICAL
    ) {
      notifications.push(this.sendPagerDutyAlert(alert))
    }

    await Promise.allSettled(notifications)
  }

  /**
   * Send email alert
   */
  private async sendEmailAlert(alert: Alert): Promise<void> {
    try {
      const payload = await getPayload({ config })

      // Create email via contact form submission (or use dedicated email service)
      const emailBody = this.formatAlertEmail(alert)

      // In production, you'd use Resend or another email service
      console.log('[AlertManager] Would send email alert to:', this.config.alertEmails)
      console.log('[AlertManager] Email body:', emailBody)

      // TODO: Implement actual email sending via Resend
      // await sendEmail({
      //   to: this.config.alertEmails,
      //   subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
      //   html: emailBody,
      // })
    } catch (error) {
      console.error('[AlertManager] Failed to send email alert:', error)
    }
  }

  /**
   * Send Slack alert
   */
  private async sendSlackAlert(alert: Alert): Promise<void> {
    try {
      if (!this.config.slackWebhookUrl) return

      const color =
        alert.severity === AlertSeverity.CRITICAL
          ? '#DC2626'
          : alert.severity === AlertSeverity.ERROR
            ? '#F59E0B'
            : alert.severity === AlertSeverity.WARNING
              ? '#FCD34D'
              : '#3B82F6'

      const payload = {
        attachments: [
          {
            color,
            title: alert.title,
            text: alert.message,
            fields: alert.metadata
              ? Object.entries(alert.metadata).map(([key, value]) => ({
                  title: key,
                  value: String(value),
                  short: true,
                }))
              : [],
            footer: 'Email Marketing Engine',
            ts: Math.floor(alert.timestamp.getTime() / 1000),
          },
        ],
      }

      const response = await fetch(this.config.slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Slack API returned ${response.status}`)
      }
    } catch (error) {
      console.error('[AlertManager] Failed to send Slack alert:', error)
    }
  }

  /**
   * Send PagerDuty alert
   */
  private async sendPagerDutyAlert(alert: Alert): Promise<void> {
    try {
      if (!this.config.pagerDutyApiKey) return

      const payload = {
        routing_key: this.config.pagerDutyApiKey,
        event_action: 'trigger',
        payload: {
          summary: alert.title,
          severity: alert.severity === AlertSeverity.CRITICAL ? 'critical' : 'error',
          source: 'Email Marketing Engine',
          custom_details: {
            message: alert.message,
            ...alert.metadata,
          },
        },
      }

      const response = await fetch('https://events.pagerduty.com/v2/enqueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`PagerDuty API returned ${response.status}`)
      }
    } catch (error) {
      console.error('[AlertManager] Failed to send PagerDuty alert:', error)
    }
  }

  /**
   * Format alert as HTML email
   */
  private formatAlertEmail(alert: Alert): string {
    const severityColor =
      alert.severity === AlertSeverity.CRITICAL
        ? '#DC2626'
        : alert.severity === AlertSeverity.ERROR
          ? '#F59E0B'
          : alert.severity === AlertSeverity.WARNING
            ? '#FCD34D'
            : '#3B82F6'

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${severityColor}; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 5px 5px; }
            .metadata { background: white; padding: 15px; margin-top: 15px; border-radius: 5px; }
            .metadata-item { margin: 5px 0; }
            .metadata-key { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>[${alert.severity.toUpperCase()}] ${alert.title}</h2>
            </div>
            <div class="content">
              <p><strong>Alert Type:</strong> ${alert.type}</p>
              <p><strong>Time:</strong> ${alert.timestamp.toISOString()}</p>
              <p><strong>Message:</strong></p>
              <p>${alert.message}</p>
              ${
                alert.metadata
                  ? `
                <div class="metadata">
                  <h3>Additional Details:</h3>
                  ${Object.entries(alert.metadata)
                    .map(
                      ([key, value]) => `
                    <div class="metadata-item">
                      <span class="metadata-key">${key}:</span> ${value}
                    </div>
                  `,
                    )
                    .join('')}
                </div>
              `
                  : ''
              }
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Store alert in database
   */
  private async storeAlert(alert: Alert): Promise<void> {
    try {
      const payload = await getPayload({ config })

      await payload.create({
        collection: 'email-events',
        data: {
          type: 'system_alert',
          status: 'pending',
          metadata: {
            alert: {
              id: alert.id,
              type: alert.type,
              severity: alert.severity,
              title: alert.title,
              message: alert.message,
              metadata: alert.metadata,
              timestamp: alert.timestamp,
            },
          },
        },
      })
    } catch (error) {
      console.error('[AlertManager] Failed to store alert in database:', error)
    }
  }

  /**
   * Check system health and trigger alerts if needed
   */
  async checkHealthAndAlert(health: SystemHealth): Promise<void> {
    // Critical: Any unhealthy component
    if (health.summary.unhealthyChecks > 0) {
      const unhealthyComponents = Object.entries(health.components)
        .filter(([_, component]) => component.status === 'unhealthy')
        .map(([name]) => name)

      await this.sendAlert({
        type: AlertType.SYSTEM_HEALTH,
        severity: AlertSeverity.CRITICAL,
        title: 'System Component(s) Unhealthy',
        message: `The following components are unhealthy: ${unhealthyComponents.join(', ')}`,
        metadata: {
          unhealthyComponents,
          healthSummary: health.summary,
        },
      })
    }

    // Warning: Any degraded component
    else if (health.summary.degradedChecks > 0) {
      const degradedComponents = Object.entries(health.components)
        .filter(([_, component]) => component.status === 'degraded')
        .map(([name]) => name)

      await this.sendAlert({
        type: AlertType.SYSTEM_HEALTH,
        severity: AlertSeverity.WARNING,
        title: 'System Component(s) Degraded',
        message: `The following components are degraded: ${degradedComponents.join(', ')}`,
        metadata: {
          degradedComponents,
          healthSummary: health.summary,
        },
      })
    }
  }

  /**
   * Check metrics and trigger alerts if needed
   */
  async checkMetricsAndAlert(metrics: SystemHealthMetrics): Promise<void> {
    // High email failure rate
    const failureRate =
      metrics.emailsSent24h > 0 ? metrics.emailsFailed24h / metrics.emailsSent24h : 0
    if (failureRate > this.config.emailFailureRateThreshold / 100) {
      await this.sendAlert({
        type: AlertType.HIGH_FAILURE_RATE,
        severity: AlertSeverity.ERROR,
        title: 'High Email Failure Rate',
        message: `Email failure rate is ${(failureRate * 100).toFixed(1)}% (threshold: ${this.config.emailFailureRateThreshold}%)`,
        metadata: {
          failureRate: `${(failureRate * 100).toFixed(1)}%`,
          emailsSent: metrics.emailsSent24h,
          emailsFailed: metrics.emailsFailed24h,
        },
      })
    }

    // High automation error rate
    if (metrics.automationErrors24h > this.config.automationErrorThreshold) {
      await this.sendAlert({
        type: AlertType.AUTOMATION_ERRORS,
        severity: AlertSeverity.WARNING,
        title: 'High Automation Error Rate',
        message: `${metrics.automationErrors24h} automation errors in the last 24 hours (threshold: ${this.config.automationErrorThreshold})`,
        metadata: {
          errors: metrics.automationErrors24h,
          executions: metrics.automationExecutions24h,
        },
      })
    }

    // Many stuck jobs
    if (metrics.failedJobs > this.config.queueStuckJobsThreshold) {
      await this.sendAlert({
        type: AlertType.QUEUE_STUCK,
        severity: AlertSeverity.WARNING,
        title: 'Many Failed Jobs in Queue',
        message: `${metrics.failedJobs} failed jobs detected (threshold: ${this.config.queueStuckJobsThreshold})`,
        metadata: {
          failedJobs: metrics.failedJobs,
          completedJobs: metrics.completedJobs24h,
        },
      })
    }

    // High memory usage
    const memoryUsagePercent = (metrics.memoryUsage / (process.memoryUsage().heapTotal || 1)) * 100
    if (memoryUsagePercent > this.config.memoryUsageThresholdPercent) {
      await this.sendAlert({
        type: AlertType.MEMORY_HIGH,
        severity: AlertSeverity.WARNING,
        title: 'High Memory Usage',
        message: `Memory usage is ${memoryUsagePercent.toFixed(1)}% (threshold: ${this.config.memoryUsageThresholdPercent}%)`,
        metadata: {
          memoryUsage: `${(metrics.memoryUsage / 1024 / 1024).toFixed(0)} MB`,
          memoryUsagePercent: `${memoryUsagePercent.toFixed(1)}%`,
        },
      })
    }

    // Rate limit abuse
    if (metrics.apiRateLimitHits24h > this.config.rateLimitAbuseThreshold) {
      await this.sendAlert({
        type: AlertType.RATE_LIMIT_ABUSE,
        severity: AlertSeverity.WARNING,
        title: 'High Rate Limit Hits',
        message: `${metrics.apiRateLimitHits24h} rate limit hits in the last 24 hours (threshold: ${this.config.rateLimitAbuseThreshold})`,
        metadata: {
          hits: metrics.apiRateLimitHits24h,
        },
      })
    }
  }

  /**
   * Resolve an active alert
   */
  async resolveAlert(alertId: string): Promise<void> {
    const alert = this.activeAlerts.get(alertId)
    if (alert) {
      alert.resolved = true
      alert.resolvedAt = new Date()
      this.activeAlerts.delete(alertId)

      console.log(`[AlertManager] Alert resolved: ${alertId}`)
    }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values())
  }

  /**
   * Generate unique alert ID
   */
  private generateAlertId(type: AlertType): string {
    return `${type}_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }
}

// Singleton instance
let alertManager: AlertManager | null = null

/**
 * Get alert manager instance
 */
export function getAlertManager(): AlertManager {
  if (!alertManager) {
    alertManager = new AlertManager()
  }
  return alertManager
}
