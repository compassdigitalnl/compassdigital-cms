import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

type CookieConsentData = {
  sessionId: string
  necessary: boolean
  analytics: boolean
  marketing: boolean
  consentedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CookieConsentData = await request.json()

    // Validate required fields
    if (!body.sessionId || typeof body.necessary !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get client IP and user agent for compliance logging
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Get Payload instance
    const payload = await getPayload({ config })

    // Store consent in database
    const consent = await payload.create({
      collection: 'cookie-consents',
      data: {
        sessionId: body.sessionId,
        necessary: body.necessary,
        analytics: body.analytics ?? false,
        marketing: body.marketing ?? false,
        consentedAt: body.consentedAt,
        ipAddress: ip,
        userAgent: userAgent,
      },
    })

    console.log('[Cookie Consent] New consent recorded:', {
      id: consent.id,
      sessionId: body.sessionId,
      analytics: body.analytics,
      marketing: body.marketing,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Cookie consent saved successfully',
        consentId: consent.id,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('[Cookie Consent] Error saving consent:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
