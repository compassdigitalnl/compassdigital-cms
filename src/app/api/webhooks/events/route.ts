/**
 * Webhook Events Endpoint
 * POST /api/webhooks/events
 *
 * Receives automation events and triggers matching automation rules
 *
 * Example payloads:
 * - User signup: { eventType: 'user.signup', email: '...', userId: '...', tenantId: '...' }
 * - Order placed: { eventType: 'order.placed', email: '...', total: 100, tenantId: '...' }
 * - Subscriber added: { eventType: 'subscriber.added', email: '...', tenantId: '...' }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { processEvent } from '@/lib/email/automation/engine'
import { isValidEventType } from '@/lib/email/automation/types'
import type { EventPayload } from '@/lib/email/automation/types'
import { emailMarketingFeatures } from '@/lib/features'

export async function POST(request: NextRequest) {
  try {
    // Check feature flag
    if (!emailMarketingFeatures.campaigns()) {
      return NextResponse.json(
        { error: 'Automation feature is disabled' },
        { status: 403 }
      )
    }

    const payload = await getPayload({ config })

    // Parse request body
    const body = await request.json()

    // Validate event type
    if (!body.eventType || !isValidEventType(body.eventType)) {
      return NextResponse.json(
        { error: 'Invalid or missing eventType' },
        { status: 400 }
      )
    }

    // Validate tenant ID
    if (!body.tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      )
    }

    // Construct event payload
    const eventPayload: EventPayload = {
      ...body,
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
    }

    console.log(`[Webhook Events] Received event: ${eventPayload.eventType}`, eventPayload)

    // Process event through automation engine
    const result = await processEvent(eventPayload)

    console.log(
      `[Webhook Events] Processed: ${result.triggeredRules} triggered, ${result.queuedExecutions} queued`
    )

    return NextResponse.json({
      success: result.success,
      event: {
        type: eventPayload.eventType,
        timestamp: eventPayload.timestamp,
      },
      automation: {
        triggeredRules: result.triggeredRules,
        queuedExecutions: result.queuedExecutions,
        errors: result.errors,
      },
    })
  } catch (error: any) {
    console.error('[Webhook Events] Error processing event:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process event' },
      { status: 500 }
    )
  }
}

// Allow public access (webhook endpoint)
export const dynamic = 'force-dynamic'
