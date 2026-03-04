import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * PATCH /api/account/recurring-orders/[id]
 * Pause/resume a recurring order
 */
export async function PATCH(
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
    const body = await request.json()

    try {
      const doc = await payload.update({
        collection: 'recurring-orders' as any,
        id,
        data: body,
      })
      return NextResponse.json({ success: true, doc })
    } catch {
      return NextResponse.json({ error: 'Recurring orders not available' }, { status: 501 })
    }
  } catch (error: any) {
    console.error('Error updating recurring order:', error)
    return NextResponse.json(
      { error: 'Failed to update recurring order', message: error.message },
      { status: 500 },
    )
  }
}
