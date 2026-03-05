import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/subscriptions
 * Fetch the current user's subscription with plan details
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await payload.find({
      collection: 'user-subscriptions',
      where: {
        user: { equals: user.id },
      },
      depth: 2,
      limit: 1,
    })

    const subscription = result.docs[0] || null

    return NextResponse.json({
      success: true,
      subscription,
      invoices: [], // Placeholder for future invoice integration
    })
  } catch (error: any) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription', message: error.message },
      { status: 500 },
    )
  }
}
