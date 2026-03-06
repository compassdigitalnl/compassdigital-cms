/**
 * POST /api/subscription/create
 *
 * Create a subscription order for a magazine plan.
 * Creates an order record in Payload CMS orders collection.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { magazineSlug, planId, customer, address, paymentMethod: payMethod } = body

    if (!magazineSlug || !planId) {
      return NextResponse.json(
        { error: 'magazineSlug en planId zijn verplicht' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    // Find the magazine and plan
    const { docs } = await payload.find({
      collection: 'magazines',
      where: { slug: { equals: magazineSlug } },
      limit: 1,
      depth: 0,
    })

    const magazine = docs[0] as any
    if (!magazine) {
      return NextResponse.json(
        { error: 'Magazine niet gevonden' },
        { status: 404 },
      )
    }

    const plan = (magazine.plans || []).find((p: any) => String(p.id) === String(planId))
    if (!plan) {
      return NextResponse.json(
        { error: 'Abonnement niet gevonden' },
        { status: 404 },
      )
    }

    const price = plan.price || 0

    // Find any product to satisfy the required relationship
    // (subscription orders don't have a real product, but the field is required)
    let placeholderProductId: number | null = null
    try {
      const { docs: products } = await payload.find({
        collection: 'products',
        limit: 1,
        depth: 0,
      })
      if (products.length > 0) {
        placeholderProductId = products[0].id
      }
    } catch {
      // products collection might not exist
    }

    // Build order data
    const orderData: Record<string, any> = {
      items: [
        {
          ...(placeholderProductId ? { product: placeholderProductId } : {}),
          title: `${magazine.name} — ${plan.name}`,
          sku: `SUB-${magazineSlug}-${planId}`,
          quantity: 1,
          price,
          subtotal: price,
        },
      ],
      subtotal: price,
      shippingCost: 0,
      tax: 0,
      discount: 0,
      total: price,
      status: 'pending',
      paymentMethod: payMethod || 'ideal',
      paymentStatus: 'pending',
      shippingAddress: {
        firstName: customer?.firstName || 'Abonnement',
        lastName: customer?.lastName || magazine.name,
        street: address?.street || 'Digitaal abonnement',
        houseNumber: address?.houseNumber || '-',
        postalCode: address?.postalCode || '0000AA',
        city: address?.city || 'N.v.t.',
        country: 'Nederland',
      },
      ...(customer?.email ? { customerEmail: customer.email } : {}),
      ...(customer?.phone ? { customerPhone: customer.phone } : {}),
      notes: `Abonnement: ${magazine.name} — ${plan.name} (${plan.period || 'n/a'})${customer?.email ? ` | ${customer.email}` : ''}${customer?.phone ? ` | ${customer.phone}` : ''}`,
    }

    const order = await payload.create({
      collection: 'orders',
      data: orderData as any,
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: (order as any).orderNumber,
    })
  } catch (error: any) {
    console.error('[Subscription] Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Fout bij aanmaken bestelling' },
      { status: 500 },
    )
  }
}
