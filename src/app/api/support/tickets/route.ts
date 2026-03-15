import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { checkRole } from '@/access/utilities'
import { onTicketCreated } from '@/features/support/hooks/ticketHooks'

/**
 * GET /api/support/tickets
 * Fetch tickets for the current user (paginated, filterable)
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const isAdmin = checkRole(['admin', 'editor'], user)
    const conditions: any[] = []

    // Non-admins can only see their own tickets
    if (!isAdmin) {
      conditions.push({ customer: { equals: user.id } })
    }

    if (status && status !== 'all') {
      conditions.push({ status: { equals: status } })
    }

    if (search) {
      conditions.push({
        or: [
          { ticketNumber: { contains: search } },
          { subject: { contains: search } },
        ],
      })
    }

    const where = conditions.length === 0
      ? {}
      : conditions.length === 1
        ? conditions[0]
        : { and: conditions }

    const result = await payload.find({
      collection: 'support-tickets',
      where,
      depth: 1,
      sort: '-createdAt',
      page,
      limit,
    })

    return NextResponse.json({
      success: true,
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets', message }, { status: 500 })
  }
}

/**
 * POST /api/support/tickets
 * Create a new support ticket
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subject, description, category, priority, attachments, chatSessionId } = body

    if (!subject?.trim()) {
      return NextResponse.json({ error: 'Onderwerp is verplicht' }, { status: 400 })
    }

    const ticketData: Record<string, any> = {
      subject: subject.trim(),
      customer: user.id,
      status: 'open',
      priority: priority || 'normal',
      source: chatSessionId ? 'chatbot' : 'web',
    }

    if (description) ticketData.description = description
    if (category) ticketData.category = category
    if (chatSessionId) ticketData.chatSessionId = chatSessionId
    if (attachments?.length) ticketData.attachments = attachments

    const ticket = await payload.create({
      collection: 'support-tickets',
      data: ticketData,
    })

    // Fire-and-forget email notifications
    onTicketCreated(payload, ticket.id).catch(() => {})

    return NextResponse.json({ success: true, doc: ticket }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error creating ticket:', error)
    return NextResponse.json({ error: 'Failed to create ticket', message }, { status: 500 })
  }
}
