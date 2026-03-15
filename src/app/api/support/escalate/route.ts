import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { onTicketCreated } from '@/features/support/hooks/ticketHooks'

/**
 * POST /api/support/escalate
 * Escalate a chatbot conversation to a support ticket
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, subject, description } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is verplicht' }, { status: 400 })
    }

    // Create ticket from chatbot conversation
    const ticketData: Record<string, any> = {
      subject: subject || 'Doorgestuurd vanuit chatbot',
      customer: user.id,
      status: 'open',
      priority: 'normal',
      source: 'chatbot',
      chatSessionId: sessionId,
    }

    if (description) ticketData.description = description

    // Try to get default category from settings
    try {
      const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
      if (settings?.supportDefaultCategory) {
        ticketData.category = settings.supportDefaultCategory
      }
    } catch {
      // Non-critical
    }

    const ticket = await payload.create({
      collection: 'support-tickets',
      data: ticketData,
    })

    // Update chat conversation status
    try {
      const conversations = await payload.find({
        collection: 'chat-conversations',
        where: { sessionId: { equals: sessionId } },
        limit: 1,
      })
      if (conversations.docs.length > 0) {
        await payload.update({
          collection: 'chat-conversations',
          id: conversations.docs[0].id,
          data: {
            status: 'escalated',
            escalatedToTicket: ticket.id,
          },
        })
      }
    } catch {
      // Non-critical: conversation save may not have completed yet
    }

    // Fire-and-forget email notifications
    onTicketCreated(payload, ticket.id).catch(() => {})

    return NextResponse.json({ success: true, doc: ticket }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error escalating to ticket:', error)
    return NextResponse.json({ error: 'Failed to escalate', message }, { status: 500 })
  }
}
