/**
 * Metrics Collector
 *
 * Collects and tracks performance metrics for the Email Marketing Engine
 * Integrates with monitoring services (Prometheus, DataDog, etc.)
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'

/**
 * Metric types
 */
export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  SUMMARY = 'summary',
}

/**
 * Metric data point
 */
export interface MetricData {
  name: string
  type: MetricType
  value: number
  labels?: Record<string, string>
  timestamp?: Date
}

/**
 * System health metrics
 */
export interface SystemHealthMetrics {
  // Email sending
  emailsSentTotal: number
  emailsSent24h: number
  emailsFailedTotal: number
  emailsFailed24h: number
  emailsSentPerMinute: number

  // Campaign metrics
  activeCampaigns: number
  scheduledCampaigns: number
  draftCampaigns: number

  // Subscriber metrics
  totalSubscribers: number
  activeSubscribers: number
  subscribersAdded24h: number
  unsubscribes24h: number

  // Automation metrics
  activeAutomationRules: number
  automationExecutions24h: number
  automationErrors24h: number

  // Queue metrics
  queuedJobs: number
  failedJobs: number
  completedJobs24h: number
  averageJobDuration: number

  // API metrics
  apiRequests24h: number
  apiErrors24h: number
  apiRateLimitHits24h: number
  averageApiLatency: number

  // System metrics
  databaseConnections: number
  redisConnections: number
  memoryUsage: number
  cpuUsage: number

  // Error metrics
  criticalErrors24h: number
  warnings24h: number
}

/**
 * Metrics Collector Service
 */
export class MetricsCollector {
  private payload: Payload | null = null
  private metrics: Map<string, MetricData> = new Map()

  constructor() {
    // Initialize metrics storage
    this.initializeMetrics()
  }

  /**
   * Get Payload instance
   */
  private async getPayloadInstance(): Promise<Payload> {
    if (!this.payload) {
      this.payload = await getPayload({ config })
    }
    return this.payload
  }

  /**
   * Initialize metric counters
   */
  private initializeMetrics(): void {
    // Email metrics
    this.metrics.set('emails_sent_total', {
      name: 'emails_sent_total',
      type: MetricType.COUNTER,
      value: 0,
    })
    this.metrics.set('emails_failed_total', {
      name: 'emails_failed_total',
      type: MetricType.COUNTER,
      value: 0,
    })

    // API metrics
    this.metrics.set('api_requests_total', {
      name: 'api_requests_total',
      type: MetricType.COUNTER,
      value: 0,
    })
    this.metrics.set('api_errors_total', {
      name: 'api_errors_total',
      type: MetricType.COUNTER,
      value: 0,
    })

    // Queue metrics
    this.metrics.set('jobs_completed_total', {
      name: 'jobs_completed_total',
      type: MetricType.COUNTER,
      value: 0,
    })
    this.metrics.set('jobs_failed_total', {
      name: 'jobs_failed_total',
      type: MetricType.COUNTER,
      value: 0,
    })
  }

  /**
   * Increment a counter metric
   */
  incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
    const metric = this.metrics.get(name)
    if (metric && metric.type === MetricType.COUNTER) {
      metric.value += value
      metric.labels = labels
      metric.timestamp = new Date()
    }
  }

  /**
   * Set a gauge metric
   */
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const metric = this.metrics.get(name)
    if (metric && metric.type === MetricType.GAUGE) {
      metric.value = value
      metric.labels = labels
      metric.timestamp = new Date()
    } else {
      this.metrics.set(name, {
        name,
        type: MetricType.GAUGE,
        value,
        labels,
        timestamp: new Date(),
      })
    }
  }

  /**
   * Record a histogram value (for latency tracking)
   */
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    // In production, this would send to Prometheus/DataDog
    // For now, we'll track average
    const metric = this.metrics.get(name)
    if (metric && metric.type === MetricType.HISTOGRAM) {
      // Simple moving average
      metric.value = (metric.value + value) / 2
      metric.labels = labels
      metric.timestamp = new Date()
    } else {
      this.metrics.set(name, {
        name,
        type: MetricType.HISTOGRAM,
        value,
        labels,
        timestamp: new Date(),
      })
    }
  }

  /**
   * Track email sent
   */
  trackEmailSent(tenantId: string, campaignId?: string): void {
    this.incrementCounter('emails_sent_total', 1, { tenant: tenantId })
    if (campaignId) {
      this.incrementCounter('emails_sent_total', 1, { campaign: campaignId })
    }
  }

  /**
   * Track email failed
   */
  trackEmailFailed(tenantId: string, errorType: string): void {
    this.incrementCounter('emails_failed_total', 1, {
      tenant: tenantId,
      error_type: errorType,
    })
  }

  /**
   * Track API request
   */
  trackApiRequest(endpoint: string, method: string, statusCode: number, duration: number): void {
    this.incrementCounter('api_requests_total', 1, {
      endpoint,
      method,
      status: statusCode.toString(),
    })

    this.recordHistogram('api_request_duration', duration, {
      endpoint,
      method,
    })

    if (statusCode >= 400) {
      this.incrementCounter('api_errors_total', 1, {
        endpoint,
        status: statusCode.toString(),
      })
    }
  }

  /**
   * Track rate limit hit
   */
  trackRateLimitHit(tier: string, identifier: string): void {
    this.incrementCounter('rate_limit_hits_total', 1, {
      tier,
      identifier,
    })
  }

  /**
   * Track automation execution
   */
  trackAutomationExecution(ruleId: string, success: boolean, duration: number): void {
    this.incrementCounter('automation_executions_total', 1, {
      rule: ruleId,
      success: success.toString(),
    })

    this.recordHistogram('automation_duration', duration, {
      rule: ruleId,
    })

    if (!success) {
      this.incrementCounter('automation_errors_total', 1, {
        rule: ruleId,
      })
    }
  }

  /**
   * Track job completion
   */
  trackJobCompletion(queueName: string, jobName: string, success: boolean, duration: number): void {
    if (success) {
      this.incrementCounter('jobs_completed_total', 1, {
        queue: queueName,
        job: jobName,
      })
    } else {
      this.incrementCounter('jobs_failed_total', 1, {
        queue: queueName,
        job: jobName,
      })
    }

    this.recordHistogram('job_duration', duration, {
      queue: queueName,
      job: jobName,
    })
  }

  /**
   * Get current system health metrics
   */
  async getSystemHealth(): Promise<SystemHealthMetrics> {
    const payload = await this.getPayloadInstance()
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    try {
      // Email metrics
      const emailEvents24h = await payload.find({
        collection: 'email-events',
        where: {
          and: [
            { createdAt: { greater_than: yesterday.toISOString() } },
            { type: { in: ['sent', 'failed'] as any[] } },
          ],
        },
        limit: 10000,
      })

      const emailsSent24h = emailEvents24h.docs.filter((e: any) => e.type === 'sent').length
      const emailsFailed24h = emailEvents24h.docs.filter((e: any) => e.type === 'failed').length

      // Campaign metrics
      const campaigns = await payload.find({
        collection: 'email-campaigns',
        limit: 10000,
      })

      const activeCampaigns = campaigns.docs.filter((c: any) => c.status === 'active').length
      const scheduledCampaigns = campaigns.docs.filter((c: any) => c.status === 'scheduled').length
      const draftCampaigns = campaigns.docs.filter((c: any) => c.status === 'draft').length

      // Subscriber metrics
      const subscribers = await payload.find({
        collection: 'email-subscribers',
        limit: 10000,
      })

      const activeSubscribers = subscribers.docs.filter((s: any) => s.status === 'subscribed').length

      const subscribersAdded24h = await payload.find({
        collection: 'email-subscribers',
        where: {
          createdAt: { greater_than: yesterday.toISOString() },
        },
        limit: 10000,
      })

      const unsubscribes24h = await payload.find({
        collection: 'email-subscribers',
        where: {
          and: [
            { status: { equals: 'unsubscribed' } },
            { updatedAt: { greater_than: yesterday.toISOString() } },
          ],
        },
        limit: 10000,
      })

      // Automation metrics
      const automationRules = await payload.find({
        collection: 'automation-rules',
        limit: 10000,
      })

      const activeAutomationRules = automationRules.docs.filter((r: any) => r.status === 'active').length

      const automationEvents24h = await payload.find({
        collection: 'email-events',
        where: {
          and: [
            { type: { equals: 'automation_triggered' } },
            { createdAt: { greater_than: yesterday.toISOString() } },
          ],
        },
        limit: 10000,
      })

      const automationErrorEvents24h = await payload.find({
        collection: 'email-events',
        where: {
          and: [
            { type: { equals: 'automation_error' } },
            { createdAt: { greater_than: yesterday.toISOString() } },
          ],
        },
        limit: 10000,
      })

      // Get metrics from internal storage
      const emailsSentTotal = this.metrics.get('emails_sent_total')?.value || 0
      const emailsFailedTotal = this.metrics.get('emails_failed_total')?.value || 0
      const apiRequests24h = this.metrics.get('api_requests_total')?.value || 0
      const apiErrors24h = this.metrics.get('api_errors_total')?.value || 0
      const apiRateLimitHits24h = this.metrics.get('rate_limit_hits_total')?.value || 0
      const completedJobs24h = this.metrics.get('jobs_completed_total')?.value || 0
      const failedJobs = this.metrics.get('jobs_failed_total')?.value || 0

      return {
        // Email sending
        emailsSentTotal,
        emailsSent24h,
        emailsFailedTotal,
        emailsFailed24h,
        emailsSentPerMinute: emailsSent24h / (24 * 60),

        // Campaign metrics
        activeCampaigns,
        scheduledCampaigns,
        draftCampaigns,

        // Subscriber metrics
        totalSubscribers: subscribers.totalDocs,
        activeSubscribers,
        subscribersAdded24h: subscribersAdded24h.totalDocs,
        unsubscribes24h: unsubscribes24h.totalDocs,

        // Automation metrics
        activeAutomationRules,
        automationExecutions24h: automationEvents24h.totalDocs,
        automationErrors24h: automationErrorEvents24h.totalDocs,

        // Queue metrics
        queuedJobs: 0, // Would come from BullMQ
        failedJobs,
        completedJobs24h,
        averageJobDuration: this.metrics.get('job_duration')?.value || 0,

        // API metrics
        apiRequests24h,
        apiErrors24h,
        apiRateLimitHits24h,
        averageApiLatency: this.metrics.get('api_request_duration')?.value || 0,

        // System metrics (would come from system monitoring)
        databaseConnections: 0,
        redisConnections: 0,
        memoryUsage: process.memoryUsage().heapUsed,
        cpuUsage: 0,

        // Error metrics
        criticalErrors24h: 0, // Would come from error tracking
        warnings24h: 0,
      }
    } catch (error) {
      console.error('[MetricsCollector] Error getting system health:', error)
      throw error
    }
  }

  /**
   * Export metrics in Prometheus format
   */
  exportPrometheusMetrics(): string {
    const lines: string[] = []

    for (const [name, metric] of this.metrics) {
      // Add metric type
      lines.push(`# TYPE ${name} ${metric.type}`)

      // Add metric value with labels
      const labels = metric.labels
        ? Object.entries(metric.labels)
            .map(([key, value]) => `${key}="${value}"`)
            .join(',')
        : ''

      lines.push(`${name}${labels ? `{${labels}}` : ''} ${metric.value}`)
    }

    return lines.join('\n')
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): MetricData[] {
    return Array.from(this.metrics.values())
  }

  /**
   * Reset all metrics (useful for testing)
   */
  reset(): void {
    this.initializeMetrics()
  }
}

// Singleton instance
let metricsCollector: MetricsCollector | null = null

/**
 * Get metrics collector instance
 */
export function getMetricsCollector(): MetricsCollector {
  if (!metricsCollector) {
    metricsCollector = new MetricsCollector()
  }
  return metricsCollector
}

/**
 * Track email sent (convenience function)
 */
export function trackEmailSent(tenantId: string, campaignId?: string): void {
  getMetricsCollector().trackEmailSent(tenantId, campaignId)
}

/**
 * Track email failed (convenience function)
 */
export function trackEmailFailed(tenantId: string, errorType: string): void {
  getMetricsCollector().trackEmailFailed(tenantId, errorType)
}

/**
 * Track API request (convenience function)
 */
export function trackApiRequest(
  endpoint: string,
  method: string,
  statusCode: number,
  duration: number,
): void {
  getMetricsCollector().trackApiRequest(endpoint, method, statusCode, duration)
}

/**
 * Track rate limit hit (convenience function)
 */
export function trackRateLimitHit(tier: string, identifier: string): void {
  getMetricsCollector().trackRateLimitHit(tier, identifier)
}

/**
 * Track automation execution (convenience function)
 */
export function trackAutomationExecution(
  ruleId: string,
  success: boolean,
  duration: number,
): void {
  getMetricsCollector().trackAutomationExecution(ruleId, success, duration)
}

/**
 * Track job completion (convenience function)
 */
export function trackJobCompletion(
  queueName: string,
  jobName: string,
  success: boolean,
  duration: number,
): void {
  getMetricsCollector().trackJobCompletion(queueName, jobName, success, duration)
}
