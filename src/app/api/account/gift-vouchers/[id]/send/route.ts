import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/account/gift-vouchers/[id]/send
 * Request to re-send a gift voucher (registers the request for processing)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Log the resend request (actual email sending is a future feature)
    console.log(`[Gift Voucher] Resend requested by user ${user.id} for voucher ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Verzoek om opnieuw te versturen is ontvangen',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error sending gift voucher:', error)
    return NextResponse.json(
      { error: 'Failed to send gift voucher', message },
      { status: 500 },
    )
  }
}
