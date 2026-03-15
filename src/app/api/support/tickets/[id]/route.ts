import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { checkRole } from '@/access/utilities'

/**
 * GET /api/support/tickets/[id]
 * Fetch a single ticket with its messages
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      depth: 1,
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket niet gevonden' }, { status: 404 })
    }

    // Check access: admins can see all, customers only their own
    const isAdmin = checkRole(['admin', 'editor'], user)
    const customerId = typeof ticket.customer === 'object' ? ticket.customer.id : ticket.customer
    if (!isAdmin && customerId !== user.id) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    // Fetch messages for this ticket
    const messagesWhere: any = { ticket: { equals: ticket.id } }
    if (!isAdmin) {
      messagesWhere.isInternal = { equals: false }
    }

    const messages = await payload.find({
      collection: 'support-messages',
      where: messagesWhere,
      depth: 1,
      sort: 'createdAt',
      limit: 100,
    })

    return NextResponse.json({
      success: true,
      doc: ticket,
      messages: messages.docs,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching ticket:', error)
    return NextResponse.json({ error: 'Failed to fetch ticket', message }, { status: 500 })
  }
}
