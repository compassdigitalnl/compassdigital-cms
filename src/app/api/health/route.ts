import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Health Check API Endpoint
 *
 * Returns the health status of the application and its dependencies.
 * Use this endpoint for uptime monitoring services (UptimeRobot, etc.)
 *
 * GET /api/health
 *
 * Returns:
 * - 200: Everything is healthy
 * - 503: Service unavailable (database connection failed, etc.)
 */

type HealthStatus = {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    database: {
      status: 'ok' | 'error'
      message?: string
      latency?: number
    }
    memory: {
      status: 'ok' | 'warning' | 'error'
      used: number
      total: number
      percentage: number
    }
    environment: {
      nodeEnv: string
      nodeVersion: string
    }
  }
}

export async function GET() {
  const startTime = Date.now()

  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: {
        status: 'ok',
      },
      memory: {
        status: 'ok',
        used: 0,
        total: 0,
        percentage: 0,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        nodeVersion: process.version,
      },
    },
  }

  // Check database connection
  try {
    const dbStartTime = Date.now()
    const payload = await getPayload({ config })

    // Try a simple query to verify database connection
    await payload.find({
      collection: 'users',
      limit: 1,
    })

    const dbLatency = Date.now() - dbStartTime
    health.checks.database = {
      status: 'ok',
      latency: dbLatency,
    }

    // Warn if database is slow
    if (dbLatency > 1000) {
      health.checks.database.message = 'High database latency detected'
    }
  } catch (error: any) {
    health.status = 'unhealthy'
    health.checks.database = {
      status: 'error',
      message: error.message || 'Database connection failed',
    }
  }

  // Check memory usage
  const memUsage = process.memoryUsage()
  const totalMem = memUsage.heapTotal
  const usedMem = memUsage.heapUsed
  const memPercentage = (usedMem / totalMem) * 100

  health.checks.memory = {
    status: memPercentage > 90 ? 'error' : memPercentage > 75 ? 'warning' : 'ok',
    used: Math.round(usedMem / 1024 / 1024), // MB
    total: Math.round(totalMem / 1024 / 1024), // MB
    percentage: Math.round(memPercentage),
  }

  // Determine HTTP status code
  const statusCode = health.status === 'healthy' ? 200 : 503

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Response-Time': `${Date.now() - startTime}ms`,
    },
  })
}

// Prevent caching
export const dynamic = 'force-dynamic'
