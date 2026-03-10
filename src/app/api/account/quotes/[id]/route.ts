import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * GET /api/account/quotes/[id]
 * Fetch a single quote for the current user
 */
export async function GET(
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

    const quote = await payload.findByID({
      collection: 'quotes',
      id,
      depth: 1,
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Verify ownership
    const quoteUserId = typeof quote.user === 'object' ? (quote.user as any).id : quote.user
    if (String(quoteUserId) !== String(user.id)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, doc: quote })
  } catch (error: unknown) {
    console.error('Error fetching quote:', error)
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 })
  }
}
