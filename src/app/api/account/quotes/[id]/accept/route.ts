import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * POST /api/account/quotes/[id]/accept
 *
 * Accept a quote and convert it to an order.
 * - Validates quote belongs to user
 * - Validates quote is in 'quoted' status and not expired
 * - Creates order from quote products with quoted prices
 * - Updates quote status to 'accepted' + links to created order
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch quote
    const quote: any = await payload.findByID({
      collection: 'quotes',
      id,
      depth: 1,
    })

    if (!quote) {
      return NextResponse.json({ error: 'Offerte niet gevonden' }, { status: 404 })
    }

    // Verify ownership
    const quoteUserId = typeof quote.user === 'object' ? quote.user.id : quote.user
    if (String(quoteUserId) !== String(user.id)) {
      return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })
    }

    // Validate status
    if (quote.status !== 'quoted') {
      return NextResponse.json(
        { error: 'Deze offerte kan niet meer geaccepteerd worden' },
        { status: 400 },
      )
    }

    // Check expiration
    if (quote.validUntil && new Date(quote.validUntil) < new Date()) {
      // Auto-update to expired
      await payload.update({
        collection: 'quotes',
        id: quote.id,
        data: { status: 'expired' },
        overrideAccess: true,
      })
      return NextResponse.json(
        { error: 'Deze offerte is verlopen. Vraag een nieuwe offerte aan.' },
        { status: 400 },
      )
    }

    // Build order items from quote products
    const products = (quote.products as any[]) || []
    const orderItems = products.map((p: any) => ({
      title: p.name,
      sku: p.sku || '',
      quantity: p.quantity || 1,
      price: p.quotedUnitPrice || 0,
      subtotal: (p.quotedUnitPrice || 0) * (p.quantity || 1),
    }))

    const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.subtotal, 0)
    const quotedTotal = quote.quotedPrice || subtotal

    // Generate order number
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const seq = String(Math.floor(Math.random() * 99999)).padStart(5, '0')
    const orderNumber = `ORD-${dateStr}-${seq}`

    // Create order
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customer: user.id,
        customerEmail: quote.email || user.email,
        status: 'pending',
        paymentStatus: 'pending',
        items: orderItems,
        subtotal,
        total: quotedTotal,
        tax: 0,
        shippingCost: 0,
        shippingAddress: {
          firstName: quote.contactPerson?.split(' ')[0] || '',
          lastName: quote.contactPerson?.split(' ').slice(1).join(' ') || '',
          company: quote.companyName || '',
        },
        notes: `Bestelling op basis van offerte ${quote.quoteNumber}`,
        timeline: [
          {
            event: 'order_placed',
            title: 'Bestelling geplaatst vanuit offerte',
            timestamp: now.toISOString(),
            description: `Offerte ${quote.quoteNumber} geaccepteerd`,
          },
        ],
      } as any,
      overrideAccess: true,
    })

    // Update quote → accepted + link to order
    await payload.update({
      collection: 'quotes',
      id: quote.id,
      data: {
        status: 'accepted',
        acceptedAt: now.toISOString(),
        convertedToOrder: order.id,
      } as any,
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: (order as any).orderNumber || orderNumber,
      message: 'Offerte geaccepteerd en bestelling aangemaakt',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error accepting quote:', error)
    return NextResponse.json(
      { error: 'Kon offerte niet accepteren', message },
      { status: 500 },
    )
  }
}
