import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { checkRole } from '@/access/utilities'

/**
 * POST /api/support/tickets/[id]/close
 * Close a ticket
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

    const isAdmin = checkRole(['admin', 'editor'], user)
    const customerId = typeof ticket.customer === 'object' ? (ticket.customer as any).id : ticket.customer
    if (!isAdmin && customerId !== user.id) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const updated = await payload.update({
      collection: 'support-tickets',
      id: ticket.id,
      data: {
        status: 'closed',
        closedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, doc: updated })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error closing ticket:', error)
    return NextResponse.json({ error: 'Failed to close ticket', message }, { status: 500 })
  }
}
