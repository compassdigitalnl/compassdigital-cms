import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/gift-vouchers
 * Fetch gift vouchers for the current user (purchased or redeemed)
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await payload.find({
      collection: 'gift-vouchers',
      where: {
        or: [
          { purchasedBy: { equals: user.id } },
          { redeemedBy: { equals: user.id } },
        ],
      },
      depth: 1,
      sort: '-createdAt',
    })

    // Compute balance stats
    let totalBalance = 0
    let activeCount = 0
    let totalSpent = 0
    let totalReceived = 0

    for (const voucher of result.docs as any[]) {
      const balance = voucher.balance ?? 0
      const initialValue = voucher.initialValue ?? voucher.amount ?? 0

      if (voucher.status === 'active') {
        activeCount++
        totalBalance += balance
      }

      // Vouchers purchased by user = money spent
      if (typeof voucher.purchasedBy === 'object' ? voucher.purchasedBy?.id === user.id : voucher.purchasedBy === user.id) {
        totalSpent += initialValue
      }

      // Vouchers redeemed by user = money received
      if (typeof voucher.redeemedBy === 'object' ? voucher.redeemedBy?.id === user.id : voucher.redeemedBy === user.id) {
        totalReceived += initialValue
      }
    }

    return NextResponse.json({
      success: true,
      docs: result.docs,
      balance: {
        totalBalance,
        activeCount,
        totalSpent,
        totalReceived,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching gift vouchers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gift vouchers', message },
      { status: 500 },
    )
  }
}

/**
 * POST /api/account/gift-vouchers
 * Redeem a gift voucher code
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Gift voucher code is required' },
        { status: 400 },
      )
    }

    // Find voucher by code
    const result = await payload.find({
      collection: 'gift-vouchers',
      where: {
        code: { equals: code },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        { error: 'Gift voucher not found' },
        { status: 404 },
      )
    }

    const giftVoucher = result.docs[0] as any

    // Check if voucher is active
    if (giftVoucher.status !== 'active') {
      return NextResponse.json(
        { error: 'This gift voucher is not active' },
        { status: 400 },
      )
    }

    // Check balance
    const balance = giftVoucher.balance ?? giftVoucher.amount ?? 0
    if (balance <= 0) {
      return NextResponse.json(
        { error: 'This gift voucher has no remaining balance' },
        { status: 400 },
      )
    }

    // Check expiration
    if (giftVoucher.expiresAt && new Date(giftVoucher.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This gift voucher has expired' },
        { status: 400 },
      )
    }

    // Update voucher with redeemed user
    const updatedVoucher = await payload.update({
      collection: 'gift-vouchers',
      id: giftVoucher.id,
      data: {
        redeemedBy: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      giftVoucher: updatedVoucher,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error redeeming gift voucher:', error)
    return NextResponse.json(
      { error: 'Failed to redeem gift voucher', message },
      { status: 500 },
    )
  }
}
