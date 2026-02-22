import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import type { ABTest } from '@/payload-types'

/**
 * A/B Test Variant Assignment API
 *
 * POST /api/ab-test/assign
 *
 * Assigns a variant to a user for a specific test.
 * Uses weighted random distribution based on variant percentages.
 *
 * Request:
 * {
 *   "targetPage": "cart" | "checkout" | "login" | "registration" | etc.
 * }
 *
 * Response:
 * {
 *   "testId": "123",
 *   "variant": "template1",
 *   "isConverted": false
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { targetPage } = await request.json()

    if (!targetPage) {
      return NextResponse.json({ error: 'targetPage is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Get session ID from cookie (or create new one)
    const cookieStore = await cookies()
    let sessionId = cookieStore.get('ab_session_id')?.value

    if (!sessionId) {
      sessionId = uuidv4()
      // Set cookie (expires in 30 days)
      cookieStore.set('ab_session_id', sessionId, {
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }

    // Find active test for this target page
    const testsResult = await payload.find({
      collection: 'ab-tests',
      where: {
        and: [
          { targetPage: { equals: targetPage } },
          { status: { equals: 'running' } },
        ],
      },
      limit: 1,
    })

    if (testsResult.docs.length === 0) {
      // No active test - return null variant
      return NextResponse.json({
        testId: null,
        variant: null,
        isConverted: false,
      })
    }

    const test = testsResult.docs[0] as ABTest

    // Check if user already has assignment
    const existingResult = await payload.find({
      collection: 'ab-test-results',
      where: {
        and: [
          { test: { equals: test.id } },
          { sessionId: { equals: sessionId } },
        ],
      },
      limit: 1,
    })

    if (existingResult.docs.length > 0) {
      const result = existingResult.docs[0]
      return NextResponse.json({
        testId: test.id,
        variant: result.variant,
        isConverted: result.converted || false,
      })
    }

    // Assign new variant based on distribution
    const variant = selectVariant(test.variants || [])

    // Get user agent and referrer
    const userAgent = request.headers.get('user-agent') || undefined
    const referrer = request.headers.get('referer') || undefined

    // Create assignment record
    await payload.create({
      collection: 'ab-test-results',
      data: {
        test: test.id,
        variant,
        sessionId,
        converted: false,
        userAgent,
        referrer,
      },
    })

    return NextResponse.json({
      testId: test.id,
      variant,
      isConverted: false,
    })
  } catch (error) {
    console.error('Error assigning A/B test variant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Select variant based on weighted distribution
 */
function selectVariant(variants: any[]): string {
  const random = Math.random() * 100
  let cumulative = 0

  for (const variant of variants) {
    cumulative += variant.distribution || 0
    if (random <= cumulative) {
      return variant.name
    }
  }

  // Fallback to first variant
  return variants[0]?.name || 'default'
}
