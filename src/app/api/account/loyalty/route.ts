import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/loyalty
 * Fetch loyalty data, transactions, and available rewards for the current user.
 *
 * Loyalty points are now stored directly on the Users collection (merged from LoyaltyPoints).
 * Transactions include redemptions (merged from LoyaltyRedemptions, type='spent_reward').
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Loyalty data is now on the user record itself
    const loyaltyData = {
      availablePoints: (user as any).loyaltyAvailablePoints || 0,
      totalEarned: (user as any).loyaltyTotalEarned || 0,
      totalSpent: (user as any).loyaltyTotalSpent || 0,
      tier: (user as any).loyaltyTier || null,
      referralCode: (user as any).referralCode || null,
      memberSince: (user as any).loyaltyMemberSince || null,
      stats: {
        rewardsRedeemed: (user as any).loyaltyStats?.rewardsRedeemed || 0,
        referrals: (user as any).loyaltyStats?.referrals || 0,
      },
    }

    // Fetch tier details if set
    let tierDetails = null
    if (loyaltyData.tier) {
      const tierId = typeof loyaltyData.tier === 'object' ? loyaltyData.tier?.id : loyaltyData.tier
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

    // Fetch recent transactions (includes redemptions with type='spent_reward')
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

    // Fetch active redemptions (transactions where type=spent_reward and status=available)
    const activeRedemptions = await payload.find({
      collection: 'loyalty-transactions',
      where: {
        and: [
          { user: { equals: user.id } },
          { type: { equals: 'spent_reward' } },
          { redemptionStatus: { equals: 'available' } },
        ],
      },
      depth: 1,
    })

    return NextResponse.json({
      success: true,
      loyaltyData: {
        ...loyaltyData,
        tierDetails,
      },
      transactions: transactionsResult.docs,
      rewards: rewardsResult.docs,
      activeRedemptions: activeRedemptions.docs,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching loyalty data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch loyalty data', message },
      { status: 500 },
    )
  }
}
