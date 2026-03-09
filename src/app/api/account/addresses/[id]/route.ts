import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * PUT /api/account/addresses/[id]
 * Update an address
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const addresses = (((user as any).addresses || []) as any[]).map((addr: any) =>
      addr.id === id ? { ...addr, ...body } : addr,
    )

    await payload.update({
      collection: 'users',
      id: user.id,
      data: { addresses },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Failed to update address', message: error.message },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/account/addresses/[id]
 * Remove an address
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const addresses = (((user as any).addresses || []) as any[]).filter(
      (addr: any) => addr.id !== id,
    )

    await payload.update({
      collection: 'users',
      id: user.id,
      data: { addresses },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address', message: error.message },
      { status: 500 },
    )
  }
}
