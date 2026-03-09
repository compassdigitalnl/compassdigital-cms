/**
 * Cancel Campaign API
 * POST /api/campaigns/[id]/cancel
 *
 * Cancels a scheduled or running campaign
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ListmonkClient } from '@/features/email-marketing/lib/listmonk/client'
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
    if (campaign.status === 'finished' || campaign.status === 'cancelled') {
      return NextResponse.json(
        { error: `Cannot cancel campaign with status: ${campaign.status}` },
        { status: 400 }
      )
    }

    // Cancel in Listmonk if synced
    if (campaign.listmonkCampaignId) {
      const listmonk = new ListmonkClient({
        baseUrl: process.env.LISTMONK_API_URL!,
        username: process.env.LISTMONK_USERNAME!,
        password: process.env.LISTMONK_PASSWORD!,
      })

      await listmonk.cancelCampaign(campaign.listmonkCampaignId)
    }

    // Update status in Payload
    await payload.update({
      collection: 'email-campaigns',
      id: campaignId,
      data: {
        status: 'cancelled',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Campaign cancelled',
      campaignId,
    })
  } catch (error: any) {
    console.error('[API] Cancel campaign error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to cancel campaign' },
      { status: 500 }
    )
  }
}
