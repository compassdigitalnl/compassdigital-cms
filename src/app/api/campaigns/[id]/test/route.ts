/**
 * Test Campaign API
 * POST /api/campaigns/[id]/test
 *
 * Sends test emails for a campaign
 *
 * Body: { emails: string[] }
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

    // Parse request body
    const body = await request.json()
    const { emails } = body

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'emails array is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = emails.filter(email => !emailRegex.test(email))
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: `Invalid emails: ${invalidEmails.join(', ')}` },
        { status: 400 }
      )
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
        { error: 'Campaign not synced to Listmonk. Save the campaign first.' },
        { status: 400 }
      )
    }

    // Queue test job
    const queue = new Queue('email-marketing', { connection: redisConfig })

    await queue.add('test-campaign', {
      campaignId,
      emails,
      tenantId: campaign.tenant,
    })

    return NextResponse.json({
      success: true,
      message: `Test emails queued for ${emails.length} recipient(s)`,
      emails,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[API] Test campaign error:', error)
    return NextResponse.json(
      { error: message || 'Failed to send test emails' },
      { status: 500 }
    )
  }
}
