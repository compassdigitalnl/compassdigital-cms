import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/favorites
 * Fetch user's favorite/wishlist products
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { docs } = await payload.find({
      collection: 'wishlists',
      where: { user: { equals: user.id } },
      depth: 2,
      sort: '-createdAt',
      limit: 100,
    })
    return NextResponse.json({ success: true, docs })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites', message },
      { status: 500 },
    )
  }
}

/**
 * POST /api/account/favorites
 * Add a product to favorites
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    if (!body.productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    // Check for duplicate
    const existing = await payload.find({
      collection: 'wishlists',
      where: {
        user: { equals: user.id },
        product: { equals: body.productId },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({ success: true, doc: existing.docs[0], duplicate: true })
    }

    const doc = await payload.create({
      collection: 'wishlists',
      data: {
        user: user.id,
        product: body.productId,
        notes: body.notes || undefined,
      },
    })
    return NextResponse.json({ success: true, doc })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite', message },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/account/favorites
 * Remove a product from favorites
 */
export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    await payload.delete({
      collection: 'wishlists',
      id,
    })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite', message },
      { status: 500 },
    )
  }
}
