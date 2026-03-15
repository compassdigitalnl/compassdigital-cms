import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/support/tickets/[id]/rate
 * Rate a resolved/closed ticket
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ticket = await payload.findByID({
      collection: 'support-tickets',
      id,
      depth: 0,
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket niet gevonden' }, { status: 404 })
    }

    // Only the customer can rate their ticket
    const customerId = typeof ticket.customer === 'object' ? (ticket.customer as any).id : ticket.customer
    if (customerId !== user.id) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    // Only rate resolved/closed tickets
    if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
      return NextResponse.json({ error: 'Ticket is nog niet opgelost' }, { status: 400 })
    }

    const body = await request.json()
    const { rating, feedback } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Beoordeling moet tussen 1 en 5 zijn' }, { status: 400 })
    }

    const updated = await payload.update({
      collection: 'support-tickets',
      id: ticket.id,
      data: {
        rating,
        ratingFeedback: feedback || undefined,
      },
    })

    return NextResponse.json({ success: true, doc: updated })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error rating ticket:', error)
    return NextResponse.json({ error: 'Failed to rate ticket', message }, { status: 500 })
  }
}
