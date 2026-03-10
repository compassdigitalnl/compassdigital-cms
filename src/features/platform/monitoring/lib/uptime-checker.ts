/**
 * Uptime Checker
 *
 * Performs HTTP health checks on client sites, logs results,
 * and detects incidents based on consecutive failures.
 */

import { sql } from 'drizzle-orm'

export interface UptimeCheckResult {
  clientId: string
  clientName: string
  deploymentUrl: string
  status: 'healthy' | 'warning' | 'critical'
  responseTime: number
  statusCode: number
  error?: string
  checkedAt: string
}

/**
 * Check a single site's health
 */
export async function checkSiteHealth(site: {
  id: string
  name: string
  deploymentUrl: string
}): Promise<UptimeCheckResult> {
  const start = Date.now()

  try {
    const response = await fetch(site.deploymentUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'CompassDigital-UptimeChecker/1.0' },
    })

    const responseTime = Date.now() - start

    let status: UptimeCheckResult['status'] = 'healthy'
    if (!response.ok) {
      status = response.status >= 500 ? 'critical' : 'warning'
    } else if (responseTime > 5000) {
      status = 'warning'
    }

    return {
      clientId: site.id,
      clientName: site.name,
      deploymentUrl: site.deploymentUrl,
      status,
      responseTime,
      statusCode: response.status,
      checkedAt: new Date().toISOString(),
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      clientId: site.id,
      clientName: site.name,
      deploymentUrl: site.deploymentUrl,
      status: 'critical',
      responseTime: Date.now() - start,
      statusCode: 0,
      error: message,
      checkedAt: new Date().toISOString(),
    }
  }
}

/**
 * Log a check result to the uptime_checks table
 */
export async function logCheck(drizzle: any, result: UptimeCheckResult): Promise<void> {
  await drizzle.execute(
    sql.raw(`
      INSERT INTO uptime_checks (client_id, status, response_time, status_code, error, checked_at)
      VALUES ('${result.clientId}', '${result.status}', ${result.responseTime}, ${result.statusCode},
              ${result.error ? `'${result.error.replace(/'/g, "''").substring(0, 500)}'` : 'NULL'},
              '${result.checkedAt}')
    `),
  )
}

/**
 * Count recent consecutive failures for a client
 */
export async function getConsecutiveFailures(drizzle: any, clientId: string): Promise<number> {
  const result = await drizzle.execute(
    sql.raw(`
      SELECT status FROM uptime_checks
      WHERE client_id = '${clientId}'
      ORDER BY checked_at DESC
      LIMIT 10
    `),
  )

  const rows = result?.rows || []
  let count = 0
  for (const row of rows) {
    if (row.status === 'critical') {
      count++
    } else {
      break
    }
  }
  return count
}

/**
 * Calculate uptime percentage for a client over N days
 */
export async function calculateUptimePercent(
  drizzle: any,
  clientId: string,
  days: number = 30,
): Promise<number> {
  const result = await drizzle.execute(
    sql.raw(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'healthy' OR status = 'warning') as up
      FROM uptime_checks
      WHERE client_id = '${clientId}'
        AND checked_at >= NOW() - INTERVAL '${days} days'
    `),
  )

  const row = result?.rows?.[0]
  if (!row || Number(row.total) === 0) return 100
  return Math.round((Number(row.up) / Number(row.total)) * 10000) / 100
}

/**
 * Cleanup old check records (keep last 30 days)
 */
export async function cleanupOldChecks(drizzle: any): Promise<number> {
  const result = await drizzle.execute(
    sql.raw(`
      DELETE FROM uptime_checks
      WHERE checked_at < NOW() - INTERVAL '30 days'
    `),
  )
  return result?.rowCount || 0
}
