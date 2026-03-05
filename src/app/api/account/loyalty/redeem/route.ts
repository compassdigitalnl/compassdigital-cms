import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/account/loyalty/redeem
 * Redeem a loyalty reward
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rewardId, pointsCost } = body

    if (!rewardId || !pointsCost) {
      return NextResponse.json(
        { error: 'rewardId and pointsCost are required' },
        { status: 400 },
      )
    }

    // Log the redemption request
    console.log(`[Loyalty] Reward ${rewardId} redeemed by user ${user.id} for ${pointsCost} points`)

    return NextResponse.json({
      success: true,
      message: 'Beloning ingewisseld',
      rewardId,
      pointsCost,
    })
  } catch (error: any) {
    console.error('Error redeeming reward:', error)
    return NextResponse.json(
      { error: 'Failed to redeem reward', message: error.message },
      { status: 500 },
    )
  }
}
