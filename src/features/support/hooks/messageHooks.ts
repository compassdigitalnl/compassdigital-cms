/**
 * Support Message Hooks
 *
 * Handles: email notifications when new messages are added.
 * Note: ticket status updates (waiting_agent/waiting_customer) are in the collection's afterChange hook.
 */

import type { Payload } from 'payload'
import { sendNewMessageEmail } from '../lib/emailTemplates'

/**
 * Send notification when a new message is added to a ticket
 */
export async function onMessageCreated(payload: Payload, messageId: string | number): Promise<void> {
  try {
    const message = await payload.findByID({
      collection: 'support-messages',
      id: messageId,
      depth: 2,
    })

    if (!message || message.isInternal) return

    const ticket = typeof message.ticket === 'object' ? message.ticket : null
    if (!ticket?.ticketNumber) return

    const sender = typeof message.sender === 'object' ? message.sender : null
    const senderName = sender
      ? [sender.firstName, sender.lastName].filter(Boolean).join(' ') || sender.email || 'Onbekend'
      : 'Onbekend'

    // Determine recipient: if customer sent → notify agent, if agent sent → notify customer
    if (message.senderRole === 'customer') {
      // Notify assigned agent
      const agent = typeof ticket.assignedTo === 'object' ? ticket.assignedTo : null
      if (agent?.email) {
        await sendNewMessageEmail({
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          customerName: senderName,
          customerEmail: sender?.email || '',
          recipientEmail: agent.email,
          senderName,
        })
      }
    } else if (message.senderRole === 'agent') {
      // Notify customer
      const customer = typeof ticket.customer === 'object' ? ticket.customer : null
      if (customer?.email) {
        await sendNewMessageEmail({
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          customerName: [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email,
          customerEmail: customer.email,
          recipientEmail: customer.email,
          senderName,
        })
      }
    }
  } catch (err) {
    console.error('[MessageHooks] onMessageCreated error:', err)
  }
}
