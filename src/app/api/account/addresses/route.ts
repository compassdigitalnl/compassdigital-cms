import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * GET /api/account/addresses
 * Fetch addresses for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const addresses = (user as any).addresses || []

    return NextResponse.json({ success: true, docs: addresses, userId: user.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses', message },
      { status: 500 },
    )
  }
}

/**
 * POST /api/account/addresses
 * Add a new address to the current user
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const addresses = ((user as any).addresses || []) as any[]
    const newAddress = {
      id: `addr_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        addresses: [...addresses, newAddress],
      },
    })

    return NextResponse.json({ success: true, doc: newAddress })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Failed to create address', message },
      { status: 500 },
    )
  }
}
