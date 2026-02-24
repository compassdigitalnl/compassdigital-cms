/**
 * Health Checker
 *
 * Comprehensive health checks for the Email Marketing Engine
 * Checks database, Redis, Listmonk, queue system, and more
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { getRedisClient } from '@/lib/queue/redis'
import { getListmonkClient } from '@/lib/email/listmonk/client'
import { getMetricsCollector } from './MetricsCollector'

/**
 * Health check status
 */
export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
}

/**
 * Component health check result
 */
export interface ComponentHealth {
  status: HealthStatus
  message?: string
  responseTime?: number
  metadata?: Record<string, any>
}

/**
 * Overall system health
 */
export interface SystemHealth {
  status: HealthStatus
  timestamp: Date
  components: {
    database: ComponentHealth
    redis: ComponentHealth
    listmonk: ComponentHealth
    queue: ComponentHealth
    metrics: ComponentHealth
  }
  summary: {
    totalChecks: number
    healthyChecks: number
    degradedChecks: number
    unhealthyChecks: number
  }
}

/**
 * Health Checker Service
 */
export class HealthChecker {
  /**
   * Check database health
   */
  async checkDatabase(): Promise<ComponentHealth> {
    const startTime = Date.now()

    try {
      const payload = await getPayload({ config })

      // Try a simple query
      await payload.find({
        collection: 'email-events',
        limit: 1,
      })

      const responseTime = Date.now() - startTime

      return {
        status: responseTime < 1000 ? HealthStatus.HEALTHY : HealthStatus.DEGRADED,
        message: responseTime < 1000 ? 'Database responding normally' : 'Database slow',
        responseTime,
        metadata: {
          connectionPool: 'active',
        },
      }
    } catch (error: any) {
      return {
        status: HealthStatus.UNHEALTHY,
        message: `Database error: ${error.message}`,
        responseTime: Date.now() - startTime,
      }
    }
  }

  /**
   * Check Redis health
   */
  async checkRedis(): Promise<ComponentHealth> {
    const startTime = Date.now()

    try {
      const redis = getRedisClient()

      // Test Redis with ping
      await redis.ping()

      // Test write/read
      const testKey = 'health_check_test'
      await redis.set(testKey, 'ok', 'EX', 10)
      const value = await redis.get(testKey)

      if (value !== 'ok') {
        throw new Error('Redis read/write test failed')
      }

      await redis.del(testKey)

      const responseTime = Date.now() - startTime

      return {
        status: responseTime < 100 ? HealthStatus.HEALTHY : HealthStatus.DEGRADED,
        message: responseTime < 100 ? 'Redis responding normally' : 'Redis slow',
        responseTime,
        metadata: {
          connected: true,
        },
      }
    } catch (error: any) {
      return {
        status: HealthStatus.UNHEALTHY,
        message: `Redis error: ${error.message}`,
        responseTime: Date.now() - startTime,
      }
    }
  }

  /**
   * Check Listmonk health
   */
  async checkListmonk(): Promise<ComponentHealth> {
    const startTime = Date.now()

    try {
      const client = getListmonkClient()

      // Test Listmonk API
      const health = await client.getHealth()

      const responseTime = Date.now() - startTime

      if (!health || health.status !== 'ok') {
        return {
          status: HealthStatus.DEGRADED,
          message: 'Listmonk reporting issues',
          responseTime,
          metadata: health,
        }
      }

      return {
        status: responseTime < 500 ? HealthStatus.HEALTHY : HealthStatus.DEGRADED,
        message: responseTime < 500 ? 'Listmonk responding normally' : 'Listmonk slow',
        responseTime,
        metadata: health,
      }
    } catch (error: any) {
      return {
        status: HealthStatus.UNHEALTHY,
        message: `Listmonk error: ${error.message}`,
        responseTime: Date.now() - startTime,
      }
    }
  }

  /**
   * Check queue system health
   */
  async checkQueue(): Promise<ComponentHealth> {
    const startTime = Date.now()

    try {
      const redis = getRedisClient()

      // Check for queue-related keys
      const keys = await redis.keys('bull:email-marketing:*')

      // Check if there are any stuck jobs (waiting > 1 hour)
      const now = Date.now()
      let stuckJobs = 0

      // This is a simplified check - in production you'd use BullMQ's built-in methods
      for (const key of keys.slice(0, 100)) {
        // Limit checks
        if (key.includes(':wait')) {
          const waitTime = await redis.zrange(key, 0, 0, 'WITHSCORES')
          if (waitTime.length > 0) {
            const timestamp = parseInt(waitTime[1])
            if (now - timestamp > 60 * 60 * 1000) {
              stuckJobs++
            }
          }
        }
      }

      const responseTime = Date.now() - startTime

      if (stuckJobs > 10) {
        return {
          status: HealthStatus.DEGRADED,
          message: `${stuckJobs} stuck jobs detected`,
          responseTime,
          metadata: {
            stuckJobs,
            totalKeys: keys.length,
          },
        }
      }

      return {
        status: HealthStatus.HEALTHY,
        message: 'Queue system healthy',
        responseTime,
        metadata: {
          totalKeys: keys.length,
          stuckJobs,
        },
      }
    } catch (error: any) {
      return {
        status: HealthStatus.UNHEALTHY,
        message: `Queue error: ${error.message}`,
        responseTime: Date.now() - startTime,
      }
    }
  }

  /**
   * Check metrics system health
   */
  async checkMetrics(): Promise<ComponentHealth> {
    const startTime = Date.now()

    try {
      const metricsCollector = getMetricsCollector()

      // Get system health metrics
      const health = await metricsCollector.getSystemHealth()

      const responseTime = Date.now() - startTime

      // Check for concerning metrics
      const warnings: string[] = []

      if (health.emailsFailed24h > health.emailsSent24h * 0.1) {
        warnings.push('High email failure rate (>10%)')
      }

      if (health.automationErrors24h > 10) {
        warnings.push('High automation error rate')
      }

      if (health.failedJobs > 100) {
        warnings.push('Many failed jobs in queue')
      }

      if (warnings.length > 0) {
        return {
          status: HealthStatus.DEGRADED,
          message: warnings.join('; '),
          responseTime,
          metadata: health,
        }
      }

      return {
        status: HealthStatus.HEALTHY,
        message: 'Metrics healthy',
        responseTime,
        metadata: {
          emailsSent24h: health.emailsSent24h,
          activeSubscribers: health.activeSubscribers,
          activeCampaigns: health.activeCampaigns,
        },
      }
    } catch (error: any) {
      return {
        status: HealthStatus.UNHEALTHY,
        message: `Metrics error: ${error.message}`,
        responseTime: Date.now() - startTime,
      }
    }
  }

  /**
   * Run all health checks
   */
  async checkAll(): Promise<SystemHealth> {
    const [database, redis, listmonk, queue, metrics] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkListmonk(),
      this.checkQueue(),
      this.checkMetrics(),
    ])

    const components = { database, redis, listmonk, queue, metrics }

    // Count statuses
    const statuses = Object.values(components).map((c) => c.status)
    const healthyChecks = statuses.filter((s) => s === HealthStatus.HEALTHY).length
    const degradedChecks = statuses.filter((s) => s === HealthStatus.DEGRADED).length
    const unhealthyChecks = statuses.filter((s) => s === HealthStatus.UNHEALTHY).length

    // Determine overall status
    let overallStatus: HealthStatus
    if (unhealthyChecks > 0) {
      overallStatus = HealthStatus.UNHEALTHY
    } else if (degradedChecks > 0) {
      overallStatus = HealthStatus.DEGRADED
    } else {
      overallStatus = HealthStatus.HEALTHY
    }

    return {
      status: overallStatus,
      timestamp: new Date(),
      components,
      summary: {
        totalChecks: statuses.length,
        healthyChecks,
        degradedChecks,
        unhealthyChecks,
      },
    }
  }

  /**
   * Check if system is ready to accept traffic
   */
  async isReady(): Promise<boolean> {
    try {
      const health = await this.checkAll()
      // Ready if database and Redis are at least degraded (not unhealthy)
      return (
        health.components.database.status !== HealthStatus.UNHEALTHY &&
        health.components.redis.status !== HealthStatus.UNHEALTHY
      )
    } catch (error) {
      return false
    }
  }

  /**
   * Check if system is alive (minimal check)
   */
  async isAlive(): Promise<boolean> {
    try {
      // Just check if we can connect to database
      const payload = await getPayload({ config })
      await payload.find({ collection: 'email-events', limit: 1 })
      return true
    } catch (error) {
      return false
    }
  }
}

// Singleton instance
let healthChecker: HealthChecker | null = null

/**
 * Get health checker instance
 */
export function getHealthChecker(): HealthChecker {
  if (!healthChecker) {
    healthChecker = new HealthChecker()
  }
  return healthChecker
}
