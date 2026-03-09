import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/addresses
 * Fetch addresses for the current user from the customers collection
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find customer by user email
    const { docs: customers } = await payload.find({
      collection: 'customers',
      where: { email: { equals: user.email } },
      depth: 0,
      limit: 1,
    })

    const customer = customers[0]
    const addresses = customer?.addresses || []

    return NextResponse.json({ success: true, docs: addresses, customerId: customer?.id })
  } catch (error: any) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses', message: error.message },
      { status: 500 },
    )
  }
}

/**
 * POST /api/account/addresses
 * Add a new address to the current user's customer record
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Find customer
    const { docs: customers } = await payload.find({
      collection: 'customers',
      where: { email: { equals: user.email } },
      depth: 0,
      limit: 1,
    })

    const customer = customers[0]
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const addresses = (customer.addresses || []) as any[]
    const newAddress = {
      id: `addr_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }

    await payload.update({
      collection: 'customers',
      id: customer.id,
      data: {
        addresses: [...addresses, newAddress],
      },
    })

    return NextResponse.json({ success: true, doc: newAddress })
  } catch (error: any) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Failed to create address', message: error.message },
      { status: 500 },
    )
  }
}
