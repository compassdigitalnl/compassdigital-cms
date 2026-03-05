import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { buildCustomerOrderQuery } from '@/branches/ecommerce/lib/getCustomerForUser'

/**
 * GET /api/account/orders
 * Fetch orders for the current user (paginated, filterable)
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build where clause
    const customerQuery = buildCustomerOrderQuery(user.id, user.email)
    const conditions: any[] = [customerQuery]

    if (status && status !== 'all') {
      conditions.push({ status: { equals: status } })
    }

    if (search) {
      conditions.push({
        or: [
          { orderNumber: { contains: search } },
          { 'items.title': { contains: search } },
        ],
      })
    }

    const where = conditions.length === 1 ? conditions[0] : { and: conditions }

    const result = await payload.find({
      collection: 'orders',
      where,
      depth: 1,
      sort: '-createdAt',
      page,
      limit,
    })

    return NextResponse.json({
      success: true,
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders', message: error.message },
      { status: 500 },
    )
  }
}
