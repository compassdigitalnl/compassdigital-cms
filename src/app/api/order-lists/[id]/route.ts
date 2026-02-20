import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/order-lists/[id]
 * Fetch a single order list by ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    // Get user from cookies
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Fetch order list with full depth for products
    const doc = await payload.findByID({
      collection: 'orderLists',
      id,
      depth: 3, // Populate products fully
    })

    if (!doc) {
      return NextResponse.json({ error: 'Order list not found' }, { status: 404 })
    }

    // Check access: user must be owner or in shareWith
    const isOwner = typeof doc.owner === 'string' ? doc.owner === user.id : doc.owner?.id === user.id
    const isShared = doc.shareWith?.some((share: any) => {
      const shareUserId = typeof share.user === 'string' ? share.user : share.user?.id
      return shareUserId === user.id
    })

    if (!isOwner && !isShared && !user.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      doc,
    })
  } catch (error: any) {
    console.error('Error fetching order list:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch order list',
        message: error.message,
      },
      { status: 500 },
    )
  }
}

/**
 * PATCH /api/order-lists/[id]
 * Update an order list
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    // Get user from cookies
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Fetch existing doc to check permissions
    const existingDoc = await payload.findByID({
      collection: 'orderLists',
      id,
      depth: 1,
    })

    if (!existingDoc) {
      return NextResponse.json({ error: 'Order list not found' }, { status: 404 })
    }

    // Check access: user must be owner or in shareWith with canEdit
    const isOwner =
      typeof existingDoc.owner === 'string'
        ? existingDoc.owner === user.id
        : existingDoc.owner?.id === user.id
    const canEdit = existingDoc.shareWith?.some((share: any) => {
      const shareUserId = typeof share.user === 'string' ? share.user : share.user?.id
      return shareUserId === user.id && share.canEdit === true
    })

    if (!isOwner && !canEdit && !user.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update order list
    const doc = await payload.update({
      collection: 'orderLists',
      id,
      data: body,
    })

    return NextResponse.json({
      success: true,
      doc,
    })
  } catch (error: any) {
    console.error('Error updating order list:', error)
    return NextResponse.json(
      {
        error: 'Failed to update order list',
        message: error.message,
      },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/order-lists/[id]
 * Delete an order list
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    // Get user from cookies
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Fetch existing doc to check permissions
    const existingDoc = await payload.findByID({
      collection: 'orderLists',
      id,
      depth: 0,
    })

    if (!existingDoc) {
      return NextResponse.json({ error: 'Order list not found' }, { status: 404 })
    }

    // Check access: only owner can delete
    const isOwner =
      typeof existingDoc.owner === 'string'
        ? existingDoc.owner === user.id
        : existingDoc.owner?.id === user.id

    if (!isOwner && !user.roles?.includes('admin')) {
      return NextResponse.json({ error: 'Forbidden - only owner can delete' }, { status: 403 })
    }

    // Delete order list
    await payload.delete({
      collection: 'orderLists',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Order list deleted',
    })
  } catch (error: any) {
    console.error('Error deleting order list:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete order list',
        message: error.message,
      },
      { status: 500 },
    )
  }
}
