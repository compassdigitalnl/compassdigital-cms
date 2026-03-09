import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import type { Order, Return } from '@/payload-types'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await getCurrentUser()

    // Check authentication
    if (!user) {
      return NextResponse.json({ error: 'Niet geauthenticeerd' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const reason = formData.get('reason') as string
    const notes = formData.get('notes') as string
    const termsAccepted = formData.get('termsAccepted') === 'on'

    // Validation
    if (!orderId || !reason) {
      return NextResponse.json(
        { error: 'Ordernummer en reden zijn verplicht' },
        { status: 400 },
      )
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: 'Je moet akkoord gaan met de retourvoorwaarden' },
        { status: 400 },
      )
    }

    // Fetch the order
    let order: Order
    try {
      const orderDoc = await payload.findByID({
        collection: 'orders',
        id: orderId,
        depth: 2,
      })
      order = orderDoc as Order
    } catch (error) {
      return NextResponse.json({ error: 'Bestelling niet gevonden' }, { status: 404 })
    }

    // Verify order belongs to user
    const orderCustomerId = typeof order.customer === 'number' ? order.customer : order.customer?.id
    if (orderCustomerId !== user.id) {
      return NextResponse.json({ error: 'Geen toegang tot deze bestelling' }, { status: 403 })
    }

    // Check if order is eligible for return (completed/shipped within 14 days)
    if (!['completed', 'shipped'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Deze bestelling komt niet in aanmerking voor retournering' },
        { status: 400 },
      )
    }

    const completedDate = (order as any).shipping?.deliveredAt ? new Date((order as any).shipping.deliveredAt) : null
    if (!completedDate) {
      return NextResponse.json(
        { error: 'Deze bestelling is nog niet afgeleverd' },
        { status: 400 },
      )
    }

    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
    if (completedDate < fourteenDaysAgo) {
      return NextResponse.json(
        { error: 'De retourperiode van 14 dagen is verstreken' },
        { status: 400 },
      )
    }

    // Check if return already exists for this order
    const existingReturns = await payload.find({
      collection: 'returns',
      where: {
        and: [
          {
            order: {
              equals: orderId,
            },
          },
          {
            status: {
              not_in: ['rejected', 'cancelled'],
            },
          },
        ],
      },
      limit: 1,
    })

    if (existingReturns.docs.length > 0) {
      return NextResponse.json(
        { error: 'Er bestaat al een actieve retourzending voor deze bestelling' },
        { status: 400 },
      )
    }

    // Generate RMA number (format: RMA-YYYYMMDD-XXXXX)
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')

    // Get latest return to determine next sequence number
    const latestReturns = await payload.find({
      collection: 'returns',
      limit: 1,
      sort: '-createdAt',
    })

    let sequenceNumber = 1
    if (latestReturns.docs.length > 0) {
      const latestReturn = latestReturns.docs[0] as Return
      if (latestReturn.rmaNumber) {
        const match = latestReturn.rmaNumber.match(/-(\d+)$/)
        if (match) {
          sequenceNumber = parseInt(match[1], 10) + 1
        }
      }
    }

    const rmaNumber = `RMA-${dateStr}-${String(sequenceNumber).padStart(5, '0')}`

    // Prepare return items from order items
    const returnItems =
      order.items?.map((orderItem) => {
        const productId = typeof orderItem.product === 'number' ? orderItem.product : orderItem.product?.id || null
        const productData = typeof orderItem.product !== 'number' ? orderItem.product : null

        const brandName = productData?.brand
          ? typeof productData.brand === 'string'
            ? productData.brand
            : typeof productData.brand === 'object' && productData.brand !== null
              ? (productData.brand as any).name
              : undefined
          : undefined

        return {
          product: productId,
          title: (orderItem as any).productSnapshot?.name || productData?.title || 'Onbekend product',
          sku: (orderItem as any).productSnapshot?.sku || productData?.sku || undefined,
          brand: brandName,
          unitPrice: (orderItem as any).unitPrice,
          quantityOrdered: orderItem.quantity,
          quantityReturning: orderItem.quantity,
          returnValue: (orderItem as any).totalPrice || (orderItem as any).unitPrice * orderItem.quantity,
        }
      }) || []

    // Calculate refund amount (order total minus shipping, or use order subtotal)
    const refundAmount = order.subtotal || order.total - ((order as any).shippingCost || 0)

    // Create the return
    const newReturn = await (payload.create as any)({
      collection: 'returns',
      data: {
        customer: user.id,
        order: parseInt(orderId),
        rmaNumber,
        status: 'pending',
        returnReason: reason,
        reasonDescription: notes || undefined,
        items: returnItems,
        refundAmount,
        refundMethod: 'original', // Default to original payment method
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    })

    // TODO: Send email notification to user with RMA number and instructions
    // TODO: Send notification to admin about new return request

    // Redirect to return detail page
    return NextResponse.redirect(
      new URL(`/account/returns/${newReturn.id}`, request.url),
      303,
    )
  } catch (error) {
    console.error('Error creating return:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de retourzending' },
      { status: 500 },
    )
  }
}
