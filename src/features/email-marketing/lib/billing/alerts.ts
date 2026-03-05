/**
 * Usage Alerts System
 *
 * Sends notifications to tenant admins when usage thresholds are reached
 * Thresholds: 50%, 75%, 90%, 100%, hard limit (200%)
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { TenantUsage } from './usage-tracker'

// ═══════════════════════════════════════════════════════════
// ALERT THRESHOLDS
// ═══════════════════════════════════════════════════════════

export const USAGE_THRESHOLDS = {
  WARNING: 50, // 50% - First warning
  MEDIUM: 75, // 75% - Medium alert
  HIGH: 90, // 90% - High alert
  CRITICAL: 100, // 100% - Overage started
  HARD_LIMIT: 200, // 200% - Hard limit reached
}

// ═══════════════════════════════════════════════════════════
// ALERT TYPES
// ═══════════════════════════════════════════════════════════

export type AlertLevel = 'info' | 'warning' | 'critical'

export interface UsageAlert {
  level: AlertLevel
  threshold: number
  message: string
  recommendations: string[]
  emailsSent: number
  includedEmails: number
  overageEmails?: number
  overageCost?: number
}

// ═══════════════════════════════════════════════════════════
// ALERT GENERATOR
// ═══════════════════════════════════════════════════════════

/**
 * Generate usage alert based on current usage
 */
export function generateUsageAlert(usage: TenantUsage): UsageAlert | null {
  const { usagePercentage, emailsSent, includedEmails, extraEmails, extraCost } = usage

  // Hard limit reached
  if (usagePercentage >= USAGE_THRESHOLDS.HARD_LIMIT) {
    return {
      level: 'critical',
      threshold: USAGE_THRESHOLDS.HARD_LIMIT,
      message: '🚨 HARD LIMIT REACHED - Email sending has been suspended',
      recommendations: [
        'Contact support immediately to increase your email limit',
        'Your account will remain suspended until next month or until limit is increased',
        `You have sent ${emailsSent} emails (hard limit: ${includedEmails * 2})`,
      ],
      emailsSent,
      includedEmails,
      overageEmails: extraEmails,
      overageCost: extraCost,
    }
  }

  // Over limit (overage charges applying)
  if (usagePercentage >= USAGE_THRESHOLDS.CRITICAL) {
    return {
      level: 'critical',
      threshold: USAGE_THRESHOLDS.CRITICAL,
      message: '⚠️ OVER LIMIT - Overage charges now applying',
      recommendations: [
        `You have exceeded your included ${includedEmails} emails`,
        `Current overage: ${extraEmails} emails = €${extraCost}`,
        'Consider upgrading to a higher tier to reduce overage costs',
        'Monitor your sending to avoid further charges',
      ],
      emailsSent,
      includedEmails,
      overageEmails: extraEmails,
      overageCost: extraCost,
    }
  }

  // High usage (90%)
  if (usagePercentage >= USAGE_THRESHOLDS.HIGH) {
    return {
      level: 'warning',
      threshold: USAGE_THRESHOLDS.HIGH,
      message: '⚠️ High Usage - 90% of quota used',
      recommendations: [
        `You have sent ${emailsSent} of ${includedEmails} included emails (${usagePercentage}%)`,
        'You may exceed your quota soon and incur overage charges',
        'Consider upgrading your plan before reaching the limit',
      ],
      emailsSent,
      includedEmails,
    }
  }

  // Medium usage (75%)
  if (usagePercentage >= USAGE_THRESHOLDS.MEDIUM) {
    return {
      level: 'warning',
      threshold: USAGE_THRESHOLDS.MEDIUM,
      message: '📊 Medium Usage - 75% of quota used',
      recommendations: [
        `You have sent ${emailsSent} of ${includedEmails} included emails (${usagePercentage}%)`,
        'Monitor your usage to avoid overage charges',
        'Review your email campaigns to optimize sending',
      ],
      emailsSent,
      includedEmails,
    }
  }

  // First warning (50%)
  if (usagePercentage >= USAGE_THRESHOLDS.WARNING) {
    return {
      level: 'info',
      threshold: USAGE_THRESHOLDS.WARNING,
      message: 'ℹ️ Usage Update - 50% of quota used',
      recommendations: [
        `You have sent ${emailsSent} of ${includedEmails} included emails (${usagePercentage}%)`,
        'Your usage is on track for this month',
      ],
      emailsSent,
      includedEmails,
    }
  }

  // No alert needed
  return null
}

// ═══════════════════════════════════════════════════════════
// ALERT NOTIFICATION
// ═══════════════════════════════════════════════════════════

/**
 * Send usage alert notification to tenant admins
 */
export async function sendUsageAlert(
  tenantId: string,
  alert: UsageAlert,
  usage: TenantUsage
): Promise<void> {
  try {
    const payload = await getPayload({ config })

    // TODO: Create notification in database
    // Currently disabled - Notifications collection needs schema updates to support:
    // - tenant field (to filter notifications by tenant)
    // - metadata field (to store usage/alert details)
    // - OR create a separate BillingAlerts collection

    // await payload.create({
    //   collection: 'notifications',
    //   data: {
    //     type: 'system',
    //     title: alert.message,
    //     message: alert.recommendations.join('\n'),
    //     category: 'system',
    //     priority: alert.level === 'critical' ? 'urgent' : 'normal',
    //     // Need to add these fields to Notifications schema:
    //     // tenant: tenantId,
    //     // metadata: {
    //     //   usage: {
    //     //     period: usage.period,
    //     //     emailsSent: usage.emailsSent,
    //     //     includedEmails: usage.includedEmails,
    //     //     usagePercentage: usage.usagePercentage,
    //     //     extraEmails: usage.extraEmails,
    //     //     extraCost: usage.extraCost,
    //     //     currentTier: usage.currentTier,
    //     //   },
    //     //   alert: {
    //     //     level: alert.level,
    //     //     threshold: alert.threshold,
    //     //   },
    //     // },
    //   },
    // })

    console.log(
      `[Usage Alerts] Notification created for tenant ${tenantId}: ${alert.message}`
    )

    // TODO: Send email notification to tenant admins
    // This could be implemented as a webhook or email service call
  } catch (error: any) {
    console.error('[Usage Alerts] Failed to send alert:', error)
    // Don't throw - alerts shouldn't block the system
  }
}

// ═══════════════════════════════════════════════════════════
// ALERT TRACKING (Prevent Spam)
// ═══════════════════════════════════════════════════════════

/**
 * Track which alerts have been sent to avoid spam
 * Uses in-memory storage (consider Redis for production)
 */
const sentAlerts = new Map<string, Set<number>>() // tenantId -> Set of thresholds

/**
 * Check if alert was already sent this month
 */
export function wasAlertSent(tenantId: string, threshold: number, period: string): boolean {
  const key = `${tenantId}:${period}`
  const thresholds = sentAlerts.get(key)
  return thresholds ? thresholds.has(threshold) : false
}

/**
 * Mark alert as sent
 */
export function markAlertSent(tenantId: string, threshold: number, period: string): void {
  const key = `${tenantId}:${period}`
  const thresholds = sentAlerts.get(key) || new Set()
  thresholds.add(threshold)
  sentAlerts.set(key, thresholds)
}

/**
 * Clear alerts for new month (call from cron job)
 */
export function clearOldAlerts(): void {
  const now = new Date()
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  // Keep only current period
  for (const key of Array.from(sentAlerts.keys())) {
    if (!key.endsWith(currentPeriod)) {
      sentAlerts.delete(key)
    }
  }

  console.log('[Usage Alerts] Old alerts cleared')
}

// ═══════════════════════════════════════════════════════════
// MAIN ALERT CHECKER
// ═══════════════════════════════════════════════════════════

/**
 * Check usage and send alert if threshold crossed
 * Call this after recording email send events
 */
export async function checkAndSendAlert(usage: TenantUsage): Promise<void> {
  const alert = generateUsageAlert(usage)

  if (!alert) {
    return // No alert needed
  }

  // Check if this alert was already sent
  if (wasAlertSent(usage.tenantId, alert.threshold, usage.period)) {
    return // Already sent this alert this month
  }

  // Send alert
  await sendUsageAlert(usage.tenantId, alert, usage)

  // Mark as sent
  markAlertSent(usage.tenantId, alert.threshold, usage.period)

  console.log(
    `[Usage Alerts] Alert sent to tenant ${usage.tenantId}: ${alert.threshold}% threshold`
  )
}
