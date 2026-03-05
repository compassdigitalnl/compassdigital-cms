import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/quotes
 * Fetch quotes for the current user (paginated)
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

    const result = await payload.find({
      collection: 'quotes',
      where: {
        user: { equals: user.id },
      },
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
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes', message: error.message },
      { status: 500 },
    )
  }
}

/**
 * POST /api/account/quotes
 * Create a new quote request
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      products,
      companyName,
      kvkNumber,
      contactPerson,
      email,
      phone,
      sector,
      desiredDeliveryDate,
      deliveryFrequency,
      notes,
      wantsConsultation,
    } = body

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'At least one product is required' },
        { status: 400 },
      )
    }

    const quote = await payload.create({
      collection: 'quotes',
      data: {
        user: user.id,
        status: 'new',
        products,
        companyName,
        kvkNumber,
        contactPerson,
        email,
        phone,
        sector,
        desiredDeliveryDate,
        deliveryFrequency,
        notes,
        wantsConsultation: wantsConsultation ?? false,
      },
    })

    return NextResponse.json({
      success: true,
      quote,
    })
  } catch (error: any) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Failed to create quote', message: error.message },
      { status: 500 },
    )
  }
}
