/**
 * Email Marketing Usage API
 *
 * GET /api/email-marketing/usage - Get current month usage for authenticated user's tenant
 * GET /api/email-marketing/usage/all - Get usage for all tenants (super-admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getUsageTracker, TIER_CONFIG } from '@/features/email-marketing/lib/billing/usage-tracker'
import { rateLimit, RateLimitPresets } from '@/lib/security/rate-limiter'
import { checkRole } from '@/access/utilities'
import { isUser } from '@/access/utilities'

/**
 * GET - Get usage stats for current tenant
 */
export async function GET(request: NextRequest) {
  // Rate limiting - 60 requests per minute
  const rateLimitResult = rateLimit(request, RateLimitPresets.API)
  if (rateLimitResult) return rateLimitResult

  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    // Get authenticated user
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const usageTracker = getUsageTracker()

    // Super-admin can get all tenants
    if (all && checkRole(['super-admin'], user)) {
      const allUsage = await usageTracker.getAllTenantUsage()

      return NextResponse.json({
        success: true,
        tenants: allUsage.length,
        usage: allUsage,
        totalRevenue: allUsage.reduce((sum, u) => sum + u.totalCost, 0),
        totalEmailsSent: allUsage.reduce((sum, u) => sum + u.emailsSent, 0),
      })
    }

    // Regular users get their tenant usage
    // Note: In this system, only super-admins and tenant users can access usage data
    // Regular customers don't have direct access to tenant usage stats
    let tenantId: string | number | undefined

    // Try to get tenant ID from user (if user has tenant field)
    if (isUser(user) && (user as any).tenant) {
      const tenant = (user as any).tenant
      tenantId = typeof tenant === 'string' || typeof tenant === 'number' ? tenant : tenant?.id
    }

    if (!tenantId) {
      return NextResponse.json({ error: 'No tenant associated with user' }, { status: 400 })
    }

    // Get usage stats
    const usage = await usageTracker.getMonthlyUsage(String(tenantId))

    // Get tier config for feature limits
    const tierConfig = usageTracker.getTierConfig(usage.currentTier)

    return NextResponse.json({
      success: true,
      usage,
      tierConfig: {
        name: tierConfig.name,
        maxSubscribers: tierConfig.maxSubscribers,
        includedEmails: tierConfig.includedEmails,
        baseCost: tierConfig.baseCost,
        extraEmailRate: tierConfig.extraEmailRate,
        features: tierConfig.features,
      },
      warnings: {
        approachingLimit: usage.usagePercentage >= 80,
        hardLimitReached: usage.hardLimitReached,
        overageCharges: usage.extraEmails > 0,
      },
      recommendations: getRecommendations(usage),
    })
  } catch (error: unknown) {
    console.error('[Usage API] Error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    )
  }
}

/**
 * Generate usage recommendations
 */
function getRecommendations(usage: any): string[] {
  const recommendations: string[] = []

  // Approaching hard limit
  if (usage.hardLimitReached) {
    recommendations.push(
      'You have reached the hard limit (2x included emails). Please contact support to increase your limit or wait for next month.'
    )
  } else if (usage.usagePercentage >= 90) {
    recommendations.push(
      `You've used ${usage.usagePercentage}% of your included emails. Consider upgrading to a higher tier to avoid overage charges.`
    )
  } else if (usage.usagePercentage >= 75) {
    recommendations.push(
      `You've used ${usage.usagePercentage}% of your included emails this month. Monitor your usage to avoid unexpected costs.`
    )
  }

  // Overage charges
  if (usage.extraEmails > 0) {
    recommendations.push(
      `You have sent ${usage.extraEmails} emails beyond your included limit, resulting in €${usage.extraCost} in overage charges this month.`
    )
  }

  // Tier upgrade suggestion
  if (usage.subscriberCount > usage.currentTier.maxSubscribers * 0.9) {
    const currentTierIndex = Object.keys(TIER_CONFIG).indexOf(usage.currentTier)
    const nextTier = Object.values(TIER_CONFIG)[currentTierIndex + 1]

    if (nextTier) {
      recommendations.push(
        `You're approaching the subscriber limit for your tier. Consider upgrading to ${nextTier.name} (up to ${nextTier.maxSubscribers} subscribers).`
      )
    }
  }

  // No recommendations
  if (recommendations.length === 0) {
    recommendations.push('Your usage is within normal limits. Keep up the good work!')
  }

  return recommendations
}
