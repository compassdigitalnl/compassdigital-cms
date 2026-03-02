/**
 * Campaign Statistics API
 * GET /api/campaigns/[id]/stats
 *
 * Fetches and syncs campaign statistics from Listmonk
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Queue } from 'bullmq'
import { redisConfig } from '@/lib/queue/redis'
import { emailMarketingFeatures } from '@/lib/features'
import { checkRole, isUser } from '@/access/utilities'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check feature flag
    if (!emailMarketingFeatures.campaigns()) {
      return NextResponse.json(
        { error: 'Email marketing campaigns feature is disabled' },
        { status: 403 }
      )
    }

    const campaignId = id
    const payload = await getPayload({ config })

    // Get user from session
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch campaign
    const campaign = await payload.findByID({
      collection: 'email-campaigns',
      id: campaignId,
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Check tenant access (only for non-super-admins)
    if (!checkRole(['super-admin'], user)) {
      const userTenant = isUser(user) ? (user as any).tenant : null
      const userTenantId = typeof userTenant === 'string' || typeof userTenant === 'number'
        ? userTenant
        : userTenant?.id

      if (isUser(user) && campaign.tenant !== userTenantId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Check if synced to Listmonk
    if (!campaign.listmonkCampaignId) {
      return NextResponse.json(
        { error: 'Campaign not synced to Listmonk' },
        { status: 400 }
      )
    }

    // Queue stats sync job (immediate)
    const queue = new Queue('email-marketing', { connection: redisConfig })

    await queue.add('sync-stats', {
      campaignId,
      listmonkId: campaign.listmonkCampaignId,
      tenantId: campaign.tenant,
    })

    // Return current stats (will be updated after sync completes)
    return NextResponse.json({
      success: true,
      message: 'Stats sync queued',
      stats: campaign.stats || {
        sent: 0,
        delivered: 0,
        bounced: 0,
        opened: 0,
        clicked: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribed: 0,
      },
    })
  } catch (error: any) {
    console.error('[API] Get campaign stats error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
