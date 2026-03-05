/**
 * Listmonk Utility Functions
 *
 * Helper functions for Listmonk integration
 */

import type { ListmonkSubscriber, ListmonkCampaign } from '@/features/email-marketing/types/listmonk'

// ═══════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate subscriber data
 */
export function validateSubscriber(subscriber: Partial<ListmonkSubscriber>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!subscriber.email) {
    errors.push('Email is required')
  } else if (!isValidEmail(subscriber.email)) {
    errors.push('Invalid email format')
  }

  if (!subscriber.name || subscriber.name.trim().length === 0) {
    errors.push('Name is required')
  }

  if (subscriber.status && !['enabled', 'disabled', 'blocklisted'].includes(subscriber.status)) {
    errors.push('Invalid status. Must be: enabled, disabled, or blocklisted')
  }

  if (subscriber.lists && (!Array.isArray(subscriber.lists) || subscriber.lists.length === 0)) {
    errors.push('At least one list is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate campaign data
 */
export function validateCampaign(campaign: Partial<ListmonkCampaign>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!campaign.name || campaign.name.trim().length === 0) {
    errors.push('Campaign name is required')
  }

  if (!campaign.subject || campaign.subject.trim().length === 0) {
    errors.push('Campaign subject is required')
  }

  if (!campaign.body || campaign.body.trim().length === 0) {
    errors.push('Campaign body is required')
  }

  if (!campaign.lists || campaign.lists.length === 0) {
    errors.push('At least one list is required')
  }

  if (campaign.from_email && !isValidEmail(campaign.from_email)) {
    errors.push('Invalid from_email format')
  }

  if (campaign.send_at) {
    const sendDate = new Date(campaign.send_at)
    if (sendDate < new Date()) {
      errors.push('send_at must be in the future')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// ═══════════════════════════════════════════════════════════
// FORMATTING
// ═══════════════════════════════════════════════════════════

/**
 * Format subscriber name (capitalize first letters)
 */
export function formatSubscriberName(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Generate unique campaign name with timestamp
 */
export function generateCampaignName(baseName: string): string {
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
  return `${baseName} - ${timestamp}`
}

/**
 * Sanitize HTML for email (remove scripts, dangerous tags)
 */
export function sanitizeEmailHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
}

// ═══════════════════════════════════════════════════════════
// RATE CALCULATION
// ═══════════════════════════════════════════════════════════

/**
 * Calculate email open rate percentage
 */
export function calculateOpenRate(sent: number, opened: number): number {
  if (sent === 0) return 0
  return Math.round((opened / sent) * 10000) / 100 // 2 decimal places
}

/**
 * Calculate click-through rate percentage
 */
export function calculateClickRate(sent: number, clicked: number): number {
  if (sent === 0) return 0
  return Math.round((clicked / sent) * 10000) / 100
}

/**
 * Calculate bounce rate percentage
 */
export function calculateBounceRate(sent: number, bounced: number): number {
  if (sent === 0) return 0
  return Math.round((bounced / sent) * 10000) / 100
}

/**
 * Calculate click-to-open rate (CTOR)
 */
export function calculateCTOR(opened: number, clicked: number): number {
  if (opened === 0) return 0
  return Math.round((clicked / opened) * 10000) / 100
}

// ═══════════════════════════════════════════════════════════
// STATUS HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Check if campaign is in a final state
 */
export function isCampaignFinished(status: string): boolean {
  return ['finished', 'cancelled'].includes(status)
}

/**
 * Check if campaign can be edited
 */
export function isCampaignEditable(status: string): boolean {
  return ['draft', 'scheduled'].includes(status)
}

/**
 * Check if campaign is running
 */
export function isCampaignRunning(status: string): boolean {
  return ['running'].includes(status)
}

/**
 * Get human-readable status
 */
export function formatCampaignStatus(status: string): string {
  const statusMap: Record<string, string> = {
    draft: 'Draft',
    scheduled: 'Scheduled',
    running: 'Sending',
    paused: 'Paused',
    finished: 'Completed',
    cancelled: 'Cancelled',
  }
  return statusMap[status] || status
}

// ═══════════════════════════════════════════════════════════
// MULTI-TENANCY HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Generate tenant-specific list name
 */
export function getTenantListName(tenantId: string, listName: string): string {
  return `[${tenantId}] ${listName}`
}

/**
 * Extract tenant ID from list tags
 */
export function extractTenantIdFromTags(tags: string[]): string | null {
  const tenantTag = tags.find(tag => tag.startsWith('tenant:'))
  return tenantTag ? tenantTag.replace('tenant:', '') : null
}

/**
 * Add tenant tag to tags array
 */
export function addTenantTag(tags: string[], tenantId: string): string[] {
  const tenantTag = `tenant:${tenantId}`
  if (tags.includes(tenantTag)) return tags
  return [...tags, tenantTag]
}

// ═══════════════════════════════════════════════════════════
// RETRY LOGIC
// ═══════════════════════════════════════════════════════════

/**
 * Retry async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
): Promise<T> {
  let lastError: Error | unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on client errors (4xx)
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const statusCode = (error as any).statusCode
        if (statusCode >= 400 && statusCode < 500) {
          throw error
        }
      }

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt)
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`)
        await sleep(delay)
      }
    }
  }

  throw lastError
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ═══════════════════════════════════════════════════════════
// DATE HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Check if date is in the future
 */
export function isFutureDate(date: string | Date): boolean {
  return new Date(date) > new Date()
}

/**
 * Format date for Listmonk API (ISO 8601)
 */
export function formatDateForListmonk(date: Date): string {
  return date.toISOString()
}

/**
 * Parse Listmonk date string to Date object
 */
export function parseListmonkDate(dateString: string): Date {
  return new Date(dateString)
}

// ═══════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return (error as any).statusCode === 429
  }
  return false
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return (error as any).statusCode === 401
  }
  return false
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message)
  }
  return 'An unknown error occurred'
}
