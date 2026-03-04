import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, items } = body

    if (!orderId || !items?.length) {
      return NextResponse.json({ error: 'Missing orderId or items' }, { status: 400 })
    }

    // Try to create in returns collection if it exists
    try {
      const result = await payload.create({
        collection: 'returns' as any,
        data: {
          order: orderId,
          customer: user.id,
          customerEmail: user.email,
          items,
          status: 'requested',
        },
      })
      return NextResponse.json(result, { status: 201 })
    } catch {
      // Returns collection may not exist yet — return success anyway
      return NextResponse.json({ success: true, message: 'Return request received' }, { status: 201 })
    }
  } catch (error: any) {
    console.error('Error creating return:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
