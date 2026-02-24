/**
 * Webhook Events Endpoint
 * POST /api/webhooks/events
 *
 * Receives automation events and triggers matching automation rules
 *
 * Security (PRODUCTION-GRADE):
 * - Multi-tier rate limiting (IP, tenant, global)
 * - HMAC-SHA256 signature verification
 * - Timestamp validation (prevents replay attacks)
 * - Tenant isolation
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
import { applyWebhookRateLimit, recordWebhookResult } from '@/lib/email/webhooks/RateLimiter'
import { verifyWebhookSignature } from '@/lib/email/webhooks/SignatureVerifier'

export async function POST(request: NextRequest) {
  let tenantId: string | undefined
  let success = false

  try {
    // Check feature flag
    if (!emailMarketingFeatures.campaigns()) {
      return NextResponse.json({ error: 'Automation feature is disabled' }, { status: 403 })
    }

    // Parse request body (needed for both signature and rate limiting)
    const body = await request.json()
    tenantId = body.tenantId

    // ═══════════════════════════════════════════════════════════
    // SECURITY LAYER 1: RATE LIMITING
    // ═══════════════════════════════════════════════════════════
    // Apply BEFORE signature verification to prevent CPU abuse from signature attacks

    const rateLimitResult = await applyWebhookRateLimit(request, tenantId)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
            'Retry-After': rateLimitResult.retryAfter?.toString() || '',
          },
        },
      )
    }

    // ═══════════════════════════════════════════════════════════
    // SECURITY LAYER 2: SIGNATURE VERIFICATION
    // ═══════════════════════════════════════════════════════════
    // Verifies request is from authorized source
    // Prevents replay attacks via timestamp validation

    const verification = await verifyWebhookSignature(request, body)
    if (!verification.valid) {
      // Don't count failed auth against rate limit (prevents lockout of legitimate users)
      await recordWebhookResult(request, tenantId, false)

      return NextResponse.json(
        {
          error: verification.error || 'Invalid signature',
          code: 'INVALID_SIGNATURE',
        },
        { status: 401 },
      )
    }

    // ═══════════════════════════════════════════════════════════
    // VALIDATION
    // ═══════════════════════════════════════════════════════════

    // Validate event type
    if (!body.eventType || !isValidEventType(body.eventType)) {
      await recordWebhookResult(request, tenantId, false)
      return NextResponse.json({ error: 'Invalid or missing eventType' }, { status: 400 })
    }

    // Validate tenant ID
    if (!body.tenantId) {
      await recordWebhookResult(request, tenantId, false)
      return NextResponse.json({ error: 'tenantId is required' }, { status: 400 })
    }

    // ═══════════════════════════════════════════════════════════
    // PROCESSING
    // ═══════════════════════════════════════════════════════════

    const payload = await getPayload({ config })

    // Construct event payload
    const eventPayload: EventPayload = {
      ...body,
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
    }

    console.log(`[Webhook Events] Received event: ${eventPayload.eventType}`, {
      tenantId: eventPayload.tenantId,
      eventType: eventPayload.eventType,
      signatureAge: verification.age,
    })

    // Process event through automation engine
    const result = await processEvent(eventPayload)

    console.log(
      `[Webhook Events] Processed: ${result.triggeredRules} triggered, ${result.queuedExecutions} queued`,
    )

    // Mark as successful for rate limiting
    success = true
    await recordWebhookResult(request, tenantId, true)

    return NextResponse.json(
      {
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
      },
      {
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
        },
      },
    )
  } catch (error: any) {
    // Record failed request for rate limiting
    if (!success) {
      await recordWebhookResult(request, tenantId, false).catch(() => {
        // Ignore errors in error handler
      })
    }

    console.error('[Webhook Events] Error processing event:', error)
    return NextResponse.json({ error: error.message || 'Failed to process event' }, { status: 500 })
  }
}

// Allow public access (webhook endpoint)
export const dynamic = 'force-dynamic'
