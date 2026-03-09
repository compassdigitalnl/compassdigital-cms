/**
 * Incident Detector
 *
 * Detects, creates, and resolves uptime incidents based on
 * consecutive health check failures.
 */

import { sql } from 'drizzle-orm'
import type { UptimeCheckResult } from './uptime-checker'

export interface UptimeIncident {
  id: number
  clientId: string
  clientName: string
  deploymentUrl?: string
  status: 'ongoing' | 'resolved'
  severity: 'warning' | 'critical'
  startedAt: string
  resolvedAt?: string
  durationMinutes?: number
  failureCount: number
  lastError?: string
  lastStatusCode?: number
  alertSent: boolean
}

const CONSECUTIVE_FAILURES_THRESHOLD = 3

/**
 * Check if there's an ongoing incident for this client
 */
export async function getOngoingIncident(
  drizzle: any,
  clientId: string,
): Promise<UptimeIncident | null> {
  const result = await drizzle.execute(
    sql.raw(`
      SELECT * FROM uptime_incidents
      WHERE client_id = '${clientId}'
        AND status = 'ongoing'
      ORDER BY started_at DESC
      LIMIT 1
    `),
  )
  const row = result?.rows?.[0]
  if (!row) return null

  return {
    id: row.id,
    clientId: row.client_id,
    clientName: row.client_name,
    deploymentUrl: row.deployment_url,
    status: row.status,
    severity: row.severity,
    startedAt: row.started_at,
    resolvedAt: row.resolved_at,
    durationMinutes: row.duration_minutes,
    failureCount: row.failure_count,
    lastError: row.last_error,
    lastStatusCode: row.last_status_code,
    alertSent: row.alert_sent,
  }
}

/**
 * Create a new incident
 */
export async function createIncident(
  drizzle: any,
  check: UptimeCheckResult,
  failureCount: number,
): Promise<UptimeIncident> {
  const severity = failureCount >= 5 ? 'critical' : 'warning'

  const result = await drizzle.execute(
    sql.raw(`
      INSERT INTO uptime_incidents (client_id, client_name, deployment_url, status, severity,
        failure_count, last_error, last_status_code)
      VALUES ('${check.clientId}', '${check.clientName.replace(/'/g, "''")}',
              '${check.deploymentUrl}', 'ongoing', '${severity}',
              ${failureCount},
              ${check.error ? `'${check.error.replace(/'/g, "''").substring(0, 500)}'` : 'NULL'},
              ${check.statusCode})
      RETURNING *
    `),
  )

  const row = result?.rows?.[0]
  return {
    id: row.id,
    clientId: row.client_id,
    clientName: row.client_name,
    deploymentUrl: row.deployment_url,
    status: 'ongoing',
    severity,
    startedAt: row.started_at,
    failureCount,
    lastError: check.error,
    lastStatusCode: check.statusCode,
    alertSent: false,
  }
}

/**
 * Update an ongoing incident with new failure data
 */
export async function updateIncident(
  drizzle: any,
  incidentId: number,
  check: UptimeCheckResult,
  failureCount: number,
): Promise<void> {
  const severity = failureCount >= 5 ? 'critical' : 'warning'

  await drizzle.execute(
    sql.raw(`
      UPDATE uptime_incidents
      SET failure_count = ${failureCount},
          severity = '${severity}',
          last_error = ${check.error ? `'${check.error.replace(/'/g, "''").substring(0, 500)}'` : 'NULL'},
          last_status_code = ${check.statusCode},
          updated_at = NOW()
      WHERE id = ${incidentId}
    `),
  )
}

/**
 * Resolve an incident (site is back up)
 */
export async function resolveIncident(drizzle: any, incidentId: number): Promise<void> {
  await drizzle.execute(
    sql.raw(`
      UPDATE uptime_incidents
      SET status = 'resolved',
          resolved_at = NOW(),
          duration_minutes = EXTRACT(EPOCH FROM (NOW() - started_at)) / 60,
          updated_at = NOW()
      WHERE id = ${incidentId}
    `),
  )
}

/**
 * Mark incident as alerted
 */
export async function markAlertSent(drizzle: any, incidentId: number): Promise<void> {
  await drizzle.execute(
    sql.raw(`
      UPDATE uptime_incidents
      SET alert_sent = true, updated_at = NOW()
      WHERE id = ${incidentId}
    `),
  )
}

/**
 * Process a check result — detect/update/resolve incidents
 */
export async function processCheckResult(
  drizzle: any,
  check: UptimeCheckResult,
  consecutiveFailures: number,
): Promise<{ incident?: UptimeIncident; resolved?: boolean; needsAlert?: boolean }> {
  const existing = await getOngoingIncident(drizzle, check.clientId)

  if (check.status === 'critical') {
    if (existing) {
      // Update existing incident
      await updateIncident(drizzle, existing.id, check, consecutiveFailures)
      return { incident: { ...existing, failureCount: consecutiveFailures } }
    }

    // Create new incident if threshold reached
    if (consecutiveFailures >= CONSECUTIVE_FAILURES_THRESHOLD) {
      const incident = await createIncident(drizzle, check, consecutiveFailures)
      return { incident, needsAlert: true }
    }
  } else if (existing) {
    // Site recovered — resolve incident
    await resolveIncident(drizzle, existing.id)
    return { resolved: true, needsAlert: true }
  }

  return {}
}

/**
 * Get recent incidents (for dashboard)
 */
export async function getRecentIncidents(
  drizzle: any,
  limit: number = 50,
): Promise<UptimeIncident[]> {
  const result = await drizzle.execute(
    sql.raw(`
      SELECT * FROM uptime_incidents
      ORDER BY started_at DESC
      LIMIT ${limit}
    `),
  )

  return (result?.rows || []).map((row: any) => ({
    id: row.id,
    clientId: row.client_id,
    clientName: row.client_name,
    deploymentUrl: row.deployment_url,
    status: row.status,
    severity: row.severity,
    startedAt: row.started_at,
    resolvedAt: row.resolved_at,
    durationMinutes: row.duration_minutes,
    failureCount: row.failure_count,
    lastError: row.last_error,
    lastStatusCode: row.last_status_code,
    alertSent: row.alert_sent,
  }))
}
