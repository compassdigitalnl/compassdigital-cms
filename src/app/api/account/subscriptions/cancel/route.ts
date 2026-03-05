import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/account/subscriptions/cancel
 * Cancel the current user's active subscription
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find active subscription for user
    const result = await payload.find({
      collection: 'user-subscriptions',
      where: {
        and: [
          { user: { equals: user.id } },
          { status: { equals: 'active' } },
        ],
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 },
      )
    }

    const subscription = result.docs[0]

    // Update subscription to cancel at period end
    await payload.update({
      collection: 'user-subscriptions',
      id: subscription.id,
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription', message: error.message },
      { status: 500 },
    )
  }
}
