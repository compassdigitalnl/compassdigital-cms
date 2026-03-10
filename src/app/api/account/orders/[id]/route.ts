import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/orders/[id]
 * Fetch a single order by ID for the current user
 */
export async function GET(
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

    const order = await payload.findByID({
      collection: 'orders',
      id,
      depth: 2,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify ownership: customer must be this user or email must match
    const customerId = typeof order.customer === 'object' ? order.customer?.id : order.customer
    if (customerId !== user.id && order.customerEmail !== user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ success: true, doc: order })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order', message },
      { status: 500 },
    )
  }
}
