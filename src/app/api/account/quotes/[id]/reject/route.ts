import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * POST /api/account/quotes/[id]/reject
 *
 * Reject a quote with optional reason.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quote: any = await payload.findByID({
      collection: 'quotes',
      id,
      depth: 0,
    })

    if (!quote) {
      return NextResponse.json({ error: 'Offerte niet gevonden' }, { status: 404 })
    }

    // Verify ownership
    const quoteUserId = typeof quote.user === 'object' ? quote.user.id : quote.user
    if (String(quoteUserId) !== String(user.id)) {
      return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })
    }

    if (quote.status !== 'quoted') {
      return NextResponse.json(
        { error: 'Deze offerte kan niet meer afgewezen worden' },
        { status: 400 },
      )
    }

    const body = await request.json().catch(() => ({}))
    const reason = body.reason || ''

    await payload.update({
      collection: 'quotes',
      id: quote.id,
      data: {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
      } as any,
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Offerte afgewezen',
    })
  } catch (error: any) {
    console.error('Error rejecting quote:', error)
    return NextResponse.json(
      { error: 'Kon offerte niet afwijzen' },
      { status: 500 },
    )
  }
}
