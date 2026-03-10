import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { buildCustomerOrderQuery } from '@/branches/ecommerce/shared/lib/getCustomerForUser'

/**
 * GET /api/account/invoices
 * Fetch invoices (orders with invoiceNumber) for current user
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

    const customerQuery = buildCustomerOrderQuery(user.id, user.email)

    // Fetch orders that have invoiceNumber set
    const result = await payload.find({
      collection: 'orders',
      where: {
        and: [
          customerQuery,
          { invoiceNumber: { exists: true } },
        ],
      },
      depth: 1,
      sort: '-createdAt',
      page,
      limit,
    })

    // Calculate stats
    const allInvoices = await payload.find({
      collection: 'orders',
      where: {
        and: [
          customerQuery,
          { invoiceNumber: { exists: true } },
        ],
      },
      depth: 0,
      limit: 0, // just totalDocs
    })

    const paidOrders = await payload.find({
      collection: 'orders',
      where: {
        and: [
          customerQuery,
          { invoiceNumber: { exists: true } },
          { paymentStatus: { equals: 'paid' } },
        ],
      },
      depth: 0,
      limit: 0,
    })

    return NextResponse.json({
      success: true,
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      stats: {
        totalInvoices: allInvoices.totalDocs,
        paidInvoices: paidOrders.totalDocs,
        pendingInvoices: allInvoices.totalDocs - paidOrders.totalDocs,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices', message },
      { status: 500 },
    )
  }
}
