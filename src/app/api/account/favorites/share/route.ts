import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/account/favorites/share
 * Toggle sharing for user's wishlist items
 *
 * Body: { enabled: boolean }
 * - enabled=true: Sets all user's wishlist items to isPublic=true
 * - enabled=false: Sets all user's wishlist items to isPublic=false
 *
 * Returns the shareToken (from first item) for building the share URL
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const enabled = body.enabled !== false

    // Get all user's wishlist items
    const { docs } = await payload.find({
      collection: 'wishlists',
      where: { user: { equals: user.id } },
      limit: 500,
    })

    if (docs.length === 0) {
      return NextResponse.json({ error: 'No wishlist items found' }, { status: 404 })
    }

    // Update all items' isPublic status
    for (const doc of docs) {
      await payload.update({
        collection: 'wishlists',
        id: doc.id,
        data: { isPublic: enabled },
      })
    }

    // Return the shareToken from the first item for building the share URL
    const shareToken = docs[0].shareToken

    return NextResponse.json({
      success: true,
      enabled,
      shareToken,
      itemCount: docs.length,
      shareUrl: enabled ? `/wishlist/${shareToken}` : null,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error toggling wishlist sharing:', error)
    return NextResponse.json(
      { error: 'Failed to toggle sharing', message },
      { status: 500 },
    )
  }
}

/**
 * GET /api/account/favorites/share
 * Get current sharing status and share URL
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's first wishlist item to check sharing status
    const { docs } = await payload.find({
      collection: 'wishlists',
      where: { user: { equals: user.id } },
      limit: 1,
    })

    if (docs.length === 0) {
      return NextResponse.json({
        success: true,
        enabled: false,
        shareToken: null,
        shareUrl: null,
        itemCount: 0,
      })
    }

    const isPublic = docs[0].isPublic ?? false
    const shareToken = docs[0].shareToken

    // Count total items
    const { totalDocs } = await payload.count({
      collection: 'wishlists',
      where: { user: { equals: user.id } },
    })

    return NextResponse.json({
      success: true,
      enabled: isPublic,
      shareToken,
      shareUrl: isPublic ? `/wishlist/${shareToken}` : null,
      itemCount: totalDocs,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error getting share status:', error)
    return NextResponse.json(
      { error: 'Failed to get share status', message },
      { status: 500 },
    )
  }
}
