/**
 * Support Ticket Hooks
 *
 * Handles: email notifications on ticket creation and status changes.
 * Note: ticketNumber generation, timestamps, and auto-assign are in the collection's beforeChange hook.
 */

import type { Payload } from 'payload'
import { sendTicketCreatedEmail, sendTicketAssignedEmail, sendTicketResolvedEmail } from '../lib/emailTemplates'

/**
 * Send email notifications after ticket creation
 */
export async function onTicketCreated(payload: Payload, ticketId: string | number): Promise<void> {
  try {
    const ticket = await payload.findByID({
      collection: 'support-tickets',
      id: ticketId,
      depth: 1,
    })

    if (!ticket) return

    const customer = typeof ticket.customer === 'object' ? ticket.customer : null
    if (!customer?.email) return

    const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email

    // Send confirmation to customer
    await sendTicketCreatedEmail({
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      customerName,
      customerEmail: customer.email,
    })

    // Send notification to assigned agent
    if (ticket.assignedTo) {
      const agent = typeof ticket.assignedTo === 'object' ? ticket.assignedTo : null
      if (agent?.email) {
        await sendTicketAssignedEmail({
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          customerName,
          customerEmail: customer.email,
          agentName: [agent.firstName, agent.lastName].filter(Boolean).join(' ') || 'Agent',
          agentEmail: agent.email,
        })
      }
    }
  } catch (err) {
    console.error('[TicketHooks] onTicketCreated error:', err)
  }
}

/**
 * Send notification when ticket is resolved
 */
export async function onTicketResolved(payload: Payload, ticketId: string | number): Promise<void> {
  try {
    const ticket = await payload.findByID({
      collection: 'support-tickets',
      id: ticketId,
      depth: 1,
    })

    if (!ticket) return

    const customer = typeof ticket.customer === 'object' ? ticket.customer : null
    if (!customer?.email) return

    const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email

    await sendTicketResolvedEmail({
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      customerName,
      customerEmail: customer.email,
    })
  } catch (err) {
    console.error('[TicketHooks] onTicketResolved error:', err)
  }
}
