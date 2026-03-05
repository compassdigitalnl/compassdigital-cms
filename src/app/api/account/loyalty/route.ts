import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/loyalty
 * Fetch loyalty data, transactions, and available rewards for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch loyalty points for user
    const pointsResult = await payload.find({
      collection: 'loyalty-points',
      where: {
        user: { equals: user.id },
      },
      limit: 1,
      depth: 1,
    })

    const loyaltyData = pointsResult.docs[0] || null

    // Fetch recent transactions
    const transactionsResult = await payload.find({
      collection: 'loyalty-transactions',
      where: {
        user: { equals: user.id },
      },
      sort: '-createdAt',
      limit: 20,
      depth: 1,
    })

    // Fetch available rewards catalog
    const rewardsResult = await payload.find({
      collection: 'loyalty-rewards',
      where: {
        active: { equals: true },
      },
      depth: 1,
    })

    // If loyalty data has a current tier, fetch tier details
    let tierDetails = null
    if (loyaltyData && (loyaltyData as any).currentTier) {
      const tierId = typeof (loyaltyData as any).currentTier === 'object'
        ? (loyaltyData as any).currentTier?.id
        : (loyaltyData as any).currentTier

      if (tierId) {
        try {
          tierDetails = await payload.findByID({
            collection: 'loyalty-tiers',
            id: tierId,
            depth: 1,
          })
        } catch {
          // Tier not found, ignore
        }
      }
    }

    return NextResponse.json({
      success: true,
      loyaltyData: loyaltyData
        ? {
            ...loyaltyData,
            tierDetails,
          }
        : null,
      transactions: transactionsResult.docs,
      rewards: rewardsResult.docs,
    })
  } catch (error: any) {
    console.error('Error fetching loyalty data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch loyalty data', message: error.message },
      { status: 500 },
    )
  }
}
