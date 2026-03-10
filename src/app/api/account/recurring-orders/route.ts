import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/recurring-orders
 * Fetch recurring orders for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const { docs } = await payload.find({
        collection: 'recurring-orders' as any,
        where: {
          or: [
            { customer: { equals: user.id } },
            { user: { equals: user.id } },
          ],
        },
        depth: 2,
        sort: '-createdAt',
        limit: 100,
      })
      return NextResponse.json({ success: true, docs })
    } catch {
      // Collection might not exist yet
      return NextResponse.json({ success: true, docs: [] })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching recurring orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recurring orders', message },
      { status: 500 },
    )
  }
}
