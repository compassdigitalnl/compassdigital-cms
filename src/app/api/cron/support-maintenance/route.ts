import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { sendSLABreachEmail } from '@/features/support/lib/emailTemplates'

/**
 * POST /api/cron/support-maintenance
 *
 * Cron job for:
 * 1. Auto-close tickets that have been "resolved" for X days
 * 2. SLA breach detection + email warnings
 *
 * Secured by CRON_SECRET header.
 */
export async function POST(request: NextRequest) {
  // Verify cron secret
  const secret = request.headers.get('x-cron-secret') || request.headers.get('authorization')
  const expectedSecret = process.env.CRON_SECRET
  if (expectedSecret && secret !== expectedSecret && secret !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadHMR({ config: configPromise })

    // Get settings for auto-close days
    let autoCloseAfterDays = 14
    try {
      const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
      if (settings?.supportAutoCloseAfterDays) {
        autoCloseAfterDays = settings.supportAutoCloseAfterDays
      }
    } catch {
      // Use default
    }

    // ─── 1. Auto-close resolved tickets ───
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - autoCloseAfterDays)

    const resolvedTickets = await payload.find({
      collection: 'support-tickets',
      where: {
        and: [
          { status: { equals: 'resolved' } },
          { resolvedAt: { less_than: cutoffDate.toISOString() } },
        ],
      },
      limit: 100,
      depth: 0,
    })

    let closedCount = 0
    for (const ticket of resolvedTickets.docs) {
      try {
        await payload.update({
          collection: 'support-tickets',
          id: ticket.id,
          data: {
            status: 'closed',
            closedAt: new Date().toISOString(),
          },
        })
        closedCount++
      } catch {
        // Continue with next ticket
      }
    }

    // ─── 2. SLA breach detection ───
    let slaBreaches = 0

    // Find open tickets without first response
    const openTickets = await payload.find({
      collection: 'support-tickets',
      where: {
        and: [
          { status: { in: ['open', 'in_progress', 'waiting_agent'] } },
          { firstResponseAt: { exists: false } },
        ],
      },
      depth: 1,
      limit: 50,
    })

    for (const ticket of openTickets.docs) {
      const category = typeof ticket.category === 'object' ? ticket.category : null
      const slaHours = category?.sla?.responseTimeHours || 24
      const createdAt = new Date(ticket.createdAt)
      const deadline = new Date(createdAt.getTime() + slaHours * 60 * 60 * 1000)

      if (new Date() > deadline) {
        slaBreaches++
        // Notify assigned agent
        const agent = typeof ticket.assignedTo === 'object' ? ticket.assignedTo : null
        const customer = typeof ticket.customer === 'object' ? ticket.customer : null
        if (agent?.email && customer) {
          const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email || '-'
          await sendSLABreachEmail({
            ticketNumber: ticket.ticketNumber,
            subject: ticket.subject,
            customerName,
            customerEmail: customer.email || '',
            agentEmail: agent.email,
            breachType: 'response',
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      results: {
        autoClosedTickets: closedCount,
        slaBreaches,
        resolvedTicketsChecked: resolvedTickets.totalDocs,
        openTicketsChecked: openTickets.totalDocs,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[Support Maintenance] Cron error:', error)
    return NextResponse.json({ error: 'Maintenance failed', message }, { status: 500 })
  }
}
