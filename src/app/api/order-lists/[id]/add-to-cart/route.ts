import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'

/**
 * POST /api/order-lists/[id]/add-to-cart
 * Add all items from an order list to the shopping cart
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    // Get user from cookies
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Fetch order list with full product details
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

    // Parse optional body for quantity overrides
    let body: { items?: { id: string; quantity: number }[] } = {}
    try {
      const text = await request.text()
      if (text) {
        body = JSON.parse(text)
      }
    } catch (e) {
      // No body or invalid JSON, use default quantities
    }

    // Get or create cart for this user
    const existingCarts = await payload.find({
      collection: 'carts',
      where: {
        user: {
          equals: user.id,
        },
      },
      limit: 1,
    })

    let cart
    const itemsToAdd = doc.items || []

    // Prepare cart items from order list
    const newCartItems = itemsToAdd.map((orderItem: any) => {
      // Check if quantity override provided in request body
      const override = body.items?.find((i) => i.id === orderItem.id)
      const quantity = override?.quantity || orderItem.defaultQuantity || 1

      return {
        product: typeof orderItem.product === 'string' ? orderItem.product : orderItem.product.id,
        quantity,
      }
    })

    if (existingCarts.docs.length > 0) {
      // Update existing cart - merge items
      cart = existingCarts.docs[0]
      const existingItems = cart.items || []

      // Merge logic: if product already in cart, increase quantity, otherwise add new item
      const mergedItems = [...existingItems]

      newCartItems.forEach((newItem: any) => {
        const existingIndex = mergedItems.findIndex(
          (item: any) =>
            (typeof item.product === 'string' ? item.product : item.product.id) === newItem.product,
        )

        if (existingIndex >= 0) {
          // Product exists, increase quantity
          mergedItems[existingIndex] = {
            ...mergedItems[existingIndex],
            quantity: mergedItems[existingIndex].quantity + newItem.quantity,
          }
        } else {
          // New product, add to cart
          mergedItems.push(newItem)
        }
      })

      cart = await payload.update({
        collection: 'carts',
        id: cart.id,
        data: {
          items: mergedItems,
        },
      })
    } else {
      // Create new cart
      cart = await payload.create({
        collection: 'carts',
        data: {
          user: user.id,
          items: newCartItems,
        },
      })
    }

    // Update lastOrderedAt timestamp on order list
    await payload.update({
      collection: 'orderLists',
      id,
      data: {
        lastOrderedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: `${itemsToAdd.length} product(en) toegevoegd aan winkelwagen`,
      cart,
      itemsAdded: itemsToAdd.length,
    })
  } catch (error: any) {
    console.error('Error adding order list to cart:', error)
    return NextResponse.json(
      {
        error: 'Failed to add order list to cart',
        message: error.message,
      },
      { status: 500 },
    )
  }
}
