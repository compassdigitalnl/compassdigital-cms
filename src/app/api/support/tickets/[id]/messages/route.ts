import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { checkRole } from '@/access/utilities'
import { onMessageCreated } from '@/features/support/hooks/messageHooks'

/**
 * POST /api/support/tickets/[id]/messages
 * Add a message to a ticket
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ticket exists and user has access
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

    const body = await request.json()
    const { message: messageContent, isInternal, attachments } = body

    if (!messageContent) {
      return NextResponse.json({ error: 'Bericht is verplicht' }, { status: 400 })
    }

    const senderRole = isAdmin ? 'agent' : 'customer'

    const msgData: Record<string, any> = {
      ticket: ticket.id,
      sender: user.id,
      senderRole,
      message: messageContent,
      isInternal: isAdmin ? (isInternal || false) : false,
    }

    if (attachments?.length) msgData.attachments = attachments

    const doc = await payload.create({
      collection: 'support-messages',
      data: msgData,
    })

    // Fire-and-forget email notification
    onMessageCreated(payload, doc.id).catch(() => {})

    return NextResponse.json({ success: true, doc }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to create message', message }, { status: 500 })
  }
}
