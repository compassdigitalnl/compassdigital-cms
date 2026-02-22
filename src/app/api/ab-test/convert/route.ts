import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

/**
 * A/B Test Conversion Tracking API
 *
 * POST /api/ab-test/convert
 *
 * Tracks a conversion for an A/B test variant.
 * Called when user completes the desired action (e.g., completes checkout).
 *
 * Request:
 * {
 *   "testId": "123",
 *   "targetPage": "cart",
 *   "conversionValue": 149.99,  // Optional - order total
 *   "orderId": "456"             // Optional - order reference
 * }
 *
 * Response:
 * {
 *   "success": true
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { testId, targetPage, conversionValue, orderId } = await request.json()

    if (!testId || !targetPage) {
      return NextResponse.json(
        { error: 'testId and targetPage are required' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    // Get session ID from cookie
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('ab_session_id')?.value

    if (!sessionId) {
      return NextResponse.json({ error: 'No session found' }, { status: 400 })
    }

    // Find existing assignment
    const existingResult = await payload.find({
      collection: 'ab-test-results',
      where: {
        and: [
          { test: { equals: testId } },
          { sessionId: { equals: sessionId } },
        ],
      },
      limit: 1,
    })

    if (existingResult.docs.length === 0) {
      return NextResponse.json({ error: 'No assignment found' }, { status: 404 })
    }

    const result = existingResult.docs[0]

    // Don't update if already converted
    if (result.converted) {
      return NextResponse.json({ success: true, alreadyConverted: true })
    }

    // Update conversion
    await payload.update({
      collection: 'ab-test-results',
      id: result.id,
      data: {
        converted: true,
        conversionValue: conversionValue || undefined,
        convertedAt: new Date().toISOString(),
        order: orderId || undefined,
      },
    })

    // Update test totals
    const test = await payload.findByID({
      collection: 'ab-tests',
      id: testId,
    })

    await payload.update({
      collection: 'ab-tests',
      id: testId,
      data: {
        totalConversions: (test.totalConversions || 0) + 1,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking A/B test conversion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
