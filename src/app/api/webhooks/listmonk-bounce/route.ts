/**
 * Listmonk Bounce Webhook Handler
 * POST /api/webhooks/listmonk-bounce
 *
 * Processes bounce notifications from Listmonk
 * Updates subscriber status and tracks bounce metrics
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Parse webhook payload
    const body = await request.json()
    const { email, bounce_type, campaign_uuid, list_uuid } = body

    if (!email) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      )
    }

    console.log(`[Bounce Webhook] Received bounce for ${email}, type: ${bounce_type}`)

    // Find subscriber
    const subscribers = await payload.find({
      collection: 'email-subscribers',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (subscribers.docs.length === 0) {
      console.log(`[Bounce Webhook] Subscriber not found: ${email}`)
      return NextResponse.json({ success: true, message: 'Subscriber not found' })
    }

    const subscriber = subscribers.docs[0]

    // Handle bounce based on type
    if (bounce_type === 'hard') {
      // Hard bounce - permanently disable
      await payload.update({
        collection: 'email-subscribers',
        id: subscriber.id,
        data: {
          status: 'bounced',
          syncStatus: 'synced',
        },
      })
      console.log(`[Bounce Webhook] Hard bounce - disabled ${email}`)
    } else if (bounce_type === 'soft') {
      // Soft bounce - track but don't disable yet
      console.log(`[Bounce Webhook] Soft bounce - tracking ${email}`)
      // In production: increment soft bounce counter
      // After X soft bounces, disable subscriber
    }

    return NextResponse.json({
      success: true,
      message: 'Bounce processed',
      email,
      bounce_type,
    })
  } catch (error: any) {
    console.error('[Bounce Webhook] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process bounce' },
      { status: 500 }
    )
  }
}

// Allow public access (webhook)
export const dynamic = 'force-dynamic'
