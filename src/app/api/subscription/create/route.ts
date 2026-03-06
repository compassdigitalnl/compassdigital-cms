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
    const { magazineSlug, planId } = body

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

    // Create the order — use overrideAccess to bypass required field validation
    // for fields that don't apply to subscription orders (shipping address, product relationship)
    const order = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        items: [
          {
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
        paymentMethod: 'ideal',
        paymentStatus: 'pending',
        shippingAddress: {
          firstName: 'Abonnement',
          lastName: magazine.name,
          street: 'N.v.t.',
          houseNumber: '-',
          postalCode: '0000AA',
          city: 'N.v.t.',
          country: 'Nederland',
        },
        notes: `Abonnement: ${magazine.name} — ${plan.name} (${plan.period || 'n/a'})`,
      },
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
