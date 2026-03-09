/**
 * Start Campaign API
 * POST /api/campaigns/[id]/start
 *
 * Starts a campaign immediately (queues start job in BullMQ)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Queue } from 'bullmq'
import { redisConfig } from '@/lib/queue/redis'
import { emailMarketingFeatures } from '@/lib/tenant/features'
import { checkRole, isUser } from '@/access/utilities'

export async function POST(
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

    // Validate campaign status
    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      return NextResponse.json(
        { error: `Cannot start campaign with status: ${campaign.status}` },
        { status: 400 }
      )
    }

    // Check if synced to Listmonk
    if (!campaign.listmonkCampaignId) {
      return NextResponse.json(
        { error: 'Campaign not synced to Listmonk. Save the campaign first.' },
        { status: 400 }
      )
    }

    // Queue start job
    const queue = new Queue('email-marketing', { connection: redisConfig })

    await queue.add('start-campaign', {
      campaignId,
      tenantId: campaign.tenant,
    })

    // Update status to scheduled
    await payload.update({
      collection: 'email-campaigns',
      id: campaignId,
      data: {
        status: 'scheduled',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Campaign start queued',
      campaignId,
    })
  } catch (error: any) {
    console.error('[API] Start campaign error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to start campaign' },
      { status: 500 }
    )
  }
}
