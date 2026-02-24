/**
 * Usage Tracker
 *
 * Tracks email usage and determines billing tier for tenants
 * Calculates overage costs and enforces rate limits
 */

import { getPayload } from 'payload'
import config from '@payload-config'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type EmailTier = 'starter' | 'basis' | 'groei' | 'pro' | 'business' | 'enterprise'

export interface TenantUsage {
  tenantId: string
  period: string // YYYY-MM
  subscriberCount: number
  emailsSent: number
  currentTier: EmailTier
  includedEmails: number
  extraEmails: number
  extraCost: number // In euros
  baseCost: number // Monthly tier cost
  totalCost: number // Base + extra
  usagePercentage: number // % of included emails used
  hardLimitReached: boolean
}

export interface TierConfig {
  name: EmailTier
  maxSubscribers: number
  includedEmails: number
  baseCost: number // euros/month
  extraEmailRate: number // euros per 1000 emails
  features: {
    campaignsUnlimited: boolean
    automationRulesMax: number | null // null = unlimited
    automationFlows: boolean
    advancedSegmentation: boolean
    abTesting: boolean
    apiAccess: boolean
    dedicatedIP: boolean
    prioritySupport: boolean
  }
}

// ═══════════════════════════════════════════════════════════
// TIER CONFIGURATION
// ═══════════════════════════════════════════════════════════

export const TIER_CONFIG: Record<EmailTier, TierConfig> = {
  starter: {
    name: 'starter',
    maxSubscribers: 1000,
    includedEmails: 5000,
    baseCost: 19,
    extraEmailRate: 1.00,
    features: {
      campaignsUnlimited: true,
      automationRulesMax: 3,
      automationFlows: false,
      advancedSegmentation: false,
      abTesting: false,
      apiAccess: false,
      dedicatedIP: false,
      prioritySupport: false,
    },
  },
  basis: {
    name: 'basis',
    maxSubscribers: 2500,
    includedEmails: 15000,
    baseCost: 39,
    extraEmailRate: 0.80,
    features: {
      campaignsUnlimited: true,
      automationRulesMax: null, // unlimited
      automationFlows: false,
      advancedSegmentation: false,
      abTesting: false,
      apiAccess: false,
      dedicatedIP: false,
      prioritySupport: false,
    },
  },
  groei: {
    name: 'groei',
    maxSubscribers: 5000,
    includedEmails: 30000,
    baseCost: 69,
    extraEmailRate: 0.60,
    features: {
      campaignsUnlimited: true,
      automationRulesMax: null,
      automationFlows: true,
      advancedSegmentation: true,
      abTesting: false,
      apiAccess: false,
      dedicatedIP: false,
      prioritySupport: false,
    },
  },
  pro: {
    name: 'pro',
    maxSubscribers: 10000,
    includedEmails: 60000,
    baseCost: 99,
    extraEmailRate: 0.40,
    features: {
      campaignsUnlimited: true,
      automationRulesMax: null,
      automationFlows: true,
      advancedSegmentation: true,
      abTesting: true,
      apiAccess: true,
      dedicatedIP: false,
      prioritySupport: false,
    },
  },
  business: {
    name: 'business',
    maxSubscribers: 25000,
    includedEmails: 150000,
    baseCost: 179,
    extraEmailRate: 0.30,
    features: {
      campaignsUnlimited: true,
      automationRulesMax: null,
      automationFlows: true,
      advancedSegmentation: true,
      abTesting: true,
      apiAccess: true,
      dedicatedIP: true,
      prioritySupport: true,
    },
  },
  enterprise: {
    name: 'enterprise',
    maxSubscribers: 999999,
    includedEmails: 500000,
    baseCost: 299,
    extraEmailRate: 0.20,
    features: {
      campaignsUnlimited: true,
      automationRulesMax: null,
      automationFlows: true,
      advancedSegmentation: true,
      abTesting: true,
      apiAccess: true,
      dedicatedIP: true,
      prioritySupport: true,
    },
  },
}

// ═══════════════════════════════════════════════════════════
// USAGE TRACKER CLASS
// ═══════════════════════════════════════════════════════════

export class UsageTracker {
  /**
   * Get monthly usage stats for a tenant
   */
  async getMonthlyUsage(tenantId: string): Promise<TenantUsage> {
    const payload = await getPayload({ config })

    const now = new Date()
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // Count active subscribers
    const subscriberCount = await this.getSubscriberCount(tenantId)

    // Count sent emails this month
    const emailsSent = await this.getEmailsSent(tenantId, monthStart)

    // Determine tier
    const tier = this.determineTier(subscriberCount)
    const tierConfig = TIER_CONFIG[tier]

    // Calculate usage
    const includedEmails = tierConfig.includedEmails
    const extraEmails = Math.max(0, emailsSent - includedEmails)
    const extraCost = this.calculateExtraCost(tier, extraEmails)
    const baseCost = tierConfig.baseCost
    const totalCost = baseCost + extraCost
    const usagePercentage = (emailsSent / includedEmails) * 100

    // Check if hard limit reached (2x included)
    const hardLimit = includedEmails * 2
    const hardLimitReached = emailsSent >= hardLimit

    return {
      tenantId,
      period,
      subscriberCount,
      emailsSent,
      currentTier: tier,
      includedEmails,
      extraEmails,
      extraCost: Math.round(extraCost * 100) / 100, // Round to 2 decimals
      baseCost,
      totalCost: Math.round(totalCost * 100) / 100,
      usagePercentage: Math.round(usagePercentage * 10) / 10, // Round to 1 decimal
      hardLimitReached,
    }
  }

  /**
   * Get current subscriber count for tenant
   */
  async getSubscriberCount(tenantId: string): Promise<number> {
    const payload = await getPayload({ config })

    const result = await payload.count({
      collection: 'email-subscribers',
      where: {
        and: [
          { tenant: { equals: tenantId } },
          { status: { equals: 'enabled' } },
        ],
      },
    })

    return result.totalDocs
  }

  /**
   * Get emails sent this month for tenant
   */
  async getEmailsSent(tenantId: string, monthStart: string): Promise<number> {
    const payload = await getPayload({ config })

    const result = await payload.count({
      collection: 'email-events',
      where: {
        and: [
          { tenant: { equals: tenantId } },
          { type: { equals: 'sent' } },
          { createdAt: { greater_than: monthStart } },
        ],
      },
    })

    return result.totalDocs
  }

  /**
   * Determine tier based on subscriber count
   */
  determineTier(subscriberCount: number): EmailTier {
    if (subscriberCount <= 1000) return 'starter'
    if (subscriberCount <= 2500) return 'basis'
    if (subscriberCount <= 5000) return 'groei'
    if (subscriberCount <= 10000) return 'pro'
    if (subscriberCount <= 25000) return 'business'
    return 'enterprise'
  }

  /**
   * Get tier configuration
   */
  getTierConfig(tier: EmailTier): TierConfig {
    return TIER_CONFIG[tier]
  }

  /**
   * Calculate extra cost for overage emails
   */
  calculateExtraCost(tier: EmailTier, extraEmails: number): number {
    const tierConfig = TIER_CONFIG[tier]
    return (extraEmails / 1000) * tierConfig.extraEmailRate
  }

  /**
   * Check if tenant can send more emails (rate limiting)
   */
  async canSendEmail(tenantId: string): Promise<{
    allowed: boolean
    reason?: string
    usage?: TenantUsage
  }> {
    const usage = await this.getMonthlyUsage(tenantId)

    // Hard limit: 2x included emails (prevent unexpected costs)
    const hardLimit = usage.includedEmails * 2
    if (usage.emailsSent >= hardLimit) {
      return {
        allowed: false,
        reason: `Hard limit reached: ${usage.emailsSent}/${hardLimit} emails sent this month`,
        usage,
      }
    }

    // Soft warning at 90% of included emails
    if (usage.emailsSent >= usage.includedEmails * 0.9) {
      console.warn(
        `[Usage Tracker] Tenant ${tenantId} at ${usage.usagePercentage}% of included emails`
      )
    }

    return {
      allowed: true,
      usage,
    }
  }

  /**
   * Record email sent event
   */
  async recordEmailSent(data: {
    tenantId: string
    subscriberId: string
    campaignId?: string
    templateId?: string
    subject: string
    recipientEmail: string
    messageId?: string
    source: 'campaign' | 'automation' | 'flow' | 'transactional'
    metadata?: Record<string, any>
  }): Promise<void> {
    const payload = await getPayload({ config })

    try {
      await payload.create({
        collection: 'email-events',
        data: {
          type: 'sent',
          campaign: data.campaignId,
          subscriber: data.subscriberId,
          template: data.templateId,
          subject: data.subject,
          recipientEmail: data.recipientEmail,
          messageId: data.messageId,
          source: data.source,
          metadata: data.metadata,
          tenant: data.tenantId,
        },
      })

      console.log(`[Usage Tracker] Email sent event recorded for tenant ${data.tenantId}`)
    } catch (error: any) {
      console.error('[Usage Tracker] Failed to record email event:', error)
      // Don't throw - email tracking shouldn't block email sending
    }
  }

  /**
   * Get usage stats for all tenants (super-admin only)
   */
  async getAllTenantUsage(): Promise<TenantUsage[]> {
    const payload = await getPayload({ config })

    // Get all tenants
    const tenants = await payload.find({
      collection: 'clients',
      limit: 1000, // Adjust as needed
    })

    // Get usage for each tenant
    const usagePromises = tenants.docs.map((tenant) =>
      this.getMonthlyUsage(String(tenant.id))
    )

    return await Promise.all(usagePromises)
  }
}

// ═══════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════

let usageTrackerInstance: UsageTracker | null = null

/**
 * Get singleton UsageTracker instance
 */
export function getUsageTracker(): UsageTracker {
  if (!usageTrackerInstance) {
    usageTrackerInstance = new UsageTracker()
  }
  return usageTrackerInstance
}
