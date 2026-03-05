/**
 * Warmup Manager for Email Sending
 *
 * Manages gradual increase in email sending volume to build sender reputation
 * Prevents spam triggers by limiting daily send volumes
 */

// ═══════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════

export interface WarmupSchedule {
  day: number
  maxEmails: number
  recommended: number
}

export interface WarmupStatus {
  tenantId: string
  currentDay: number
  totalEmailsSent: number
  emailsSentToday: number
  warmupStartDate: Date
  isComplete: boolean
  currentLimit: number
  nextLimit: number
  status: 'warming' | 'completed' | 'paused'
}

export interface SendVolumeCheck {
  allowed: boolean
  currentCount: number
  limit: number
  remaining: number
  message: string
}

// ═══════════════════════════════════════════════════════════
// WARMUP SCHEDULE (14-DAY PLAN)
// ═══════════════════════════════════════════════════════════

/**
 * Standard 14-day warmup schedule
 * Based on industry best practices for new sending domains/IPs
 */
export const WARMUP_SCHEDULE: WarmupSchedule[] = [
  { day: 1, maxEmails: 50, recommended: 40 },
  { day: 2, maxEmails: 100, recommended: 80 },
  { day: 3, maxEmails: 200, recommended: 150 },
  { day: 4, maxEmails: 500, recommended: 400 },
  { day: 5, maxEmails: 1000, recommended: 800 },
  { day: 6, maxEmails: 2000, recommended: 1500 },
  { day: 7, maxEmails: 5000, recommended: 4000 },
  { day: 8, maxEmails: 10000, recommended: 8000 },
  { day: 9, maxEmails: 20000, recommended: 15000 },
  { day: 10, maxEmails: 40000, recommended: 30000 },
  { day: 11, maxEmails: 70000, recommended: 50000 },
  { day: 12, maxEmails: 100000, recommended: 80000 },
  { day: 13, maxEmails: 150000, recommended: 120000 },
  { day: 14, maxEmails: 200000, recommended: 150000 },
]

/**
 * Get warmup limit for a specific day
 */
export function getWarmupLimit(day: number): number {
  if (day < 1) return 0
  if (day > WARMUP_SCHEDULE.length) {
    // After warmup period, no limit
    return Infinity
  }

  const schedule = WARMUP_SCHEDULE[day - 1]
  return schedule.maxEmails
}

/**
 * Get recommended send count for a specific day
 */
export function getRecommendedSendCount(day: number): number {
  if (day < 1) return 0
  if (day > WARMUP_SCHEDULE.length) {
    return WARMUP_SCHEDULE[WARMUP_SCHEDULE.length - 1].recommended
  }

  const schedule = WARMUP_SCHEDULE[day - 1]
  return schedule.recommended
}

/**
 * Calculate current warmup day based on start date
 */
export function calculateWarmupDay(startDate: Date): number {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Check if warmup is complete
 */
export function isWarmupComplete(startDate: Date): boolean {
  const currentDay = calculateWarmupDay(startDate)
  return currentDay > WARMUP_SCHEDULE.length
}

// ═══════════════════════════════════════════════════════════
// WARMUP STATUS MANAGEMENT
// ═══════════════════════════════════════════════════════════

// In-memory store (in production, use Redis or database)
const warmupStore: Map<string, WarmupStatus> = new Map()

/**
 * Initialize warmup for a tenant
 */
export function initializeWarmup(tenantId: string): WarmupStatus {
  const status: WarmupStatus = {
    tenantId,
    currentDay: 1,
    totalEmailsSent: 0,
    emailsSentToday: 0,
    warmupStartDate: new Date(),
    isComplete: false,
    currentLimit: getWarmupLimit(1),
    nextLimit: getWarmupLimit(2),
    status: 'warming',
  }

  warmupStore.set(tenantId, status)
  return status
}

/**
 * Get warmup status for a tenant
 */
export function getWarmupStatus(tenantId: string): WarmupStatus | null {
  return warmupStore.get(tenantId) || null
}

/**
 * Update warmup status after sending emails
 */
export function updateWarmupStatus(tenantId: string, emailsSent: number): WarmupStatus {
  let status = warmupStore.get(tenantId)

  if (!status) {
    status = initializeWarmup(tenantId)
  }

  // Calculate current day
  status.currentDay = calculateWarmupDay(status.warmupStartDate)

  // Check if warmup is complete
  if (status.currentDay > WARMUP_SCHEDULE.length) {
    status.isComplete = true
    status.status = 'completed'
    status.currentLimit = Infinity
    status.nextLimit = Infinity
  } else {
    status.currentLimit = getWarmupLimit(status.currentDay)
    status.nextLimit = getWarmupLimit(status.currentDay + 1)
  }

  // Update counts
  status.totalEmailsSent += emailsSent
  status.emailsSentToday += emailsSent

  warmupStore.set(tenantId, status)
  return status
}

/**
 * Reset daily send count (should be called via cron at midnight)
 */
export function resetDailySendCount(tenantId: string): void {
  const status = warmupStore.get(tenantId)
  if (status) {
    status.emailsSentToday = 0
    warmupStore.set(tenantId, status)
  }
}

// ═══════════════════════════════════════════════════════════
// SEND VOLUME VALIDATION
// ═══════════════════════════════════════════════════════════

/**
 * Check if a send is allowed based on warmup limits
 */
export function checkSendAllowed(
  tenantId: string,
  emailCount: number
): SendVolumeCheck {
  let status = warmupStore.get(tenantId)

  if (!status) {
    status = initializeWarmup(tenantId)
  }

  // Update current day
  status.currentDay = calculateWarmupDay(status.warmupStartDate)

  // If warmup is complete, allow unlimited sends
  if (status.isComplete || status.currentDay > WARMUP_SCHEDULE.length) {
    return {
      allowed: true,
      currentCount: status.emailsSentToday,
      limit: Infinity,
      remaining: Infinity,
      message: 'Warmup complete - no sending limits',
    }
  }

  const currentLimit = getWarmupLimit(status.currentDay)
  const projectedCount = status.emailsSentToday + emailCount
  const remaining = Math.max(0, currentLimit - status.emailsSentToday)

  // Check if send would exceed limit
  if (projectedCount > currentLimit) {
    return {
      allowed: false,
      currentCount: status.emailsSentToday,
      limit: currentLimit,
      remaining,
      message: `Send would exceed warmup limit. Current: ${status.emailsSentToday}/${currentLimit}. Remaining today: ${remaining}`,
    }
  }

  return {
    allowed: true,
    currentCount: status.emailsSentToday,
    limit: currentLimit,
    remaining: remaining - emailCount,
    message: `Send allowed. After send: ${projectedCount}/${currentLimit}`,
  }
}

// ═══════════════════════════════════════════════════════════
// WARMUP RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════

/**
 * Get recommendations for optimizing warmup
 */
export function getWarmupRecommendations(tenantId: string): string[] {
  const status = warmupStore.get(tenantId)
  const recommendations: string[] = []

  if (!status) {
    recommendations.push('Initialize warmup tracking for your domain')
    return recommendations
  }

  if (status.isComplete) {
    recommendations.push('Warmup complete! Maintain consistent sending patterns.')
    return recommendations
  }

  const recommended = getRecommendedSendCount(status.currentDay)
  const currentLimit = getWarmupLimit(status.currentDay)

  // Pacing recommendations
  if (status.emailsSentToday === 0) {
    recommendations.push(`Start sending today - recommended: ${recommended} emails`)
  } else if (status.emailsSentToday < recommended * 0.5) {
    recommendations.push(`Consider sending more emails today (current: ${status.emailsSentToday}, recommended: ${recommended})`)
  } else if (status.emailsSentToday > recommended * 1.2) {
    recommendations.push('Slow down - you\'re sending faster than recommended pace')
  }

  // Daily consistency
  recommendations.push(`Maintain consistent sending each day (don't skip days)`)

  // Content quality
  recommendations.push('Ensure high-quality content to maintain low bounce/complaint rates')

  // Engagement
  recommendations.push('Start with your most engaged subscribers first')

  // Progress
  const daysRemaining = WARMUP_SCHEDULE.length - status.currentDay + 1
  recommendations.push(`${daysRemaining} days remaining in warmup period`)

  return recommendations
}

/**
 * Export warmup status for all tenants (for monitoring)
 */
export function getAllWarmupStatuses(): WarmupStatus[] {
  return Array.from(warmupStore.values())
}

/**
 * Pause warmup for a tenant
 */
export function pauseWarmup(tenantId: string): void {
  const status = warmupStore.get(tenantId)
  if (status) {
    status.status = 'paused'
    warmupStore.set(tenantId, status)
  }
}

/**
 * Resume warmup for a tenant
 */
export function resumeWarmup(tenantId: string): void {
  const status = warmupStore.get(tenantId)
  if (status) {
    status.status = 'warming'
    warmupStore.set(tenantId, status)
  }
}
