import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/order-lists
 * Fetch all order lists for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    // Get user from cookies (Payload auth)
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch order lists for this user (owned or shared)
    const { docs } = await payload.find({
      collection: 'orderLists',
      where: {
        or: [
          {
            owner: {
              equals: user.id,
            },
          },
          {
            'shareWith.user': {
              equals: user.id,
            },
          },
        ],
      },
      depth: 2, // Populate product relationships
      sort: '-updatedAt',
      limit: 100,
    })

    return NextResponse.json({
      success: true,
      docs,
      totalDocs: docs.length,
    })
  } catch (error: any) {
    console.error('Error fetching order lists:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch order lists',
        message: error.message,
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/order-lists
 * Create a new order list
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    // Get user from cookies
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Create order list
    const doc = await payload.create({
      collection: 'orderLists',
      data: {
        name: body.name,
        description: body.description || '',
        icon: body.icon || 'clipboard-list',
        color: body.color || 'teal',
        isPinned: body.isPinned || false,
        owner: user.id,
        items: body.items || [],
        shareWith: body.shareWith || [],
        notes: body.notes || '',
      },
    })

    return NextResponse.json({
      success: true,
      doc,
    })
  } catch (error: any) {
    console.error('Error creating order list:', error)
    return NextResponse.json(
      {
        error: 'Failed to create order list',
        message: error.message,
      },
      { status: 500 },
    )
  }
}
