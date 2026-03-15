/**
 * Support Email Templates
 *
 * Uses TransactionalEmailService (Resend) for ticket notifications.
 */

import { TransactionalEmailService } from '@/features/email-marketing/lib/TransactionalEmailService'

const emailService = new TransactionalEmailService()

interface TicketEmailData {
  ticketNumber: string
  subject: string
  customerName: string
  customerEmail: string
  status?: string
  agentName?: string
  siteUrl?: string
  companyName?: string
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SERVER_URL || 'https://example.com'
}

function getCompanyName(): string {
  return process.env.COMPANY_NAME || 'Support'
}

function wrapInTemplate(title: string, body: string): string {
  const companyName = getCompanyName()
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:#fff;border-radius:8px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="margin:0 0 24px;color:#1a1a1a;font-size:20px;">${title}</h2>
      ${body}
    </div>
    <p style="text-align:center;color:#888;font-size:12px;margin-top:16px;">&copy; ${new Date().getFullYear()} ${companyName}</p>
  </div>
</body>
</html>`
}

/**
 * Send ticket created confirmation to customer
 */
export async function sendTicketCreatedEmail(data: TicketEmailData): Promise<void> {
  if (!emailService.isConfigured()) return

  const baseUrl = getBaseUrl()
  const ticketUrl = `${baseUrl}/account/support/${data.ticketNumber}`

  const body = `
    <p style="color:#333;line-height:1.6;">Beste ${data.customerName},</p>
    <p style="color:#333;line-height:1.6;">Uw support ticket is aangemaakt.</p>
    <div style="background:#f8f9fa;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0;"><strong>Ticketnummer:</strong> ${data.ticketNumber}</p>
      <p style="margin:8px 0 0;"><strong>Onderwerp:</strong> ${data.subject}</p>
    </div>
    <p style="color:#333;line-height:1.6;">We nemen zo snel mogelijk contact met u op.</p>
    <a href="${ticketUrl}" style="display:inline-block;background:#0066cc;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:8px;">Ticket bekijken</a>
  `

  try {
    await emailService.send({
      to: data.customerEmail,
      subject: `Ticket ${data.ticketNumber}: ${data.subject}`,
      html: wrapInTemplate('Ticket aangemaakt', body),
    })
  } catch (err) {
    console.error('[Support Email] Failed to send ticket created email:', err)
  }
}

/**
 * Send ticket assigned notification to agent
 */
export async function sendTicketAssignedEmail(data: TicketEmailData & { agentEmail: string }): Promise<void> {
  if (!emailService.isConfigured()) return

  const baseUrl = getBaseUrl()
  const ticketUrl = `${baseUrl}/admin/collections/support-tickets/${data.ticketNumber}`

  const body = `
    <p style="color:#333;line-height:1.6;">Hallo ${data.agentName || 'Agent'},</p>
    <p style="color:#333;line-height:1.6;">Er is een nieuw ticket aan u toegewezen.</p>
    <div style="background:#f8f9fa;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0;"><strong>Ticketnummer:</strong> ${data.ticketNumber}</p>
      <p style="margin:8px 0 0;"><strong>Onderwerp:</strong> ${data.subject}</p>
      <p style="margin:8px 0 0;"><strong>Klant:</strong> ${data.customerName}</p>
    </div>
    <a href="${ticketUrl}" style="display:inline-block;background:#0066cc;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:8px;">Ticket openen</a>
  `

  try {
    await emailService.send({
      to: data.agentEmail,
      subject: `[Toegewezen] Ticket ${data.ticketNumber}: ${data.subject}`,
      html: wrapInTemplate('Ticket toegewezen', body),
    })
  } catch (err) {
    console.error('[Support Email] Failed to send assigned email:', err)
  }
}

/**
 * Send new message notification
 */
export async function sendNewMessageEmail(data: TicketEmailData & { recipientEmail: string; senderName: string }): Promise<void> {
  if (!emailService.isConfigured()) return

  const baseUrl = getBaseUrl()
  const ticketUrl = `${baseUrl}/account/support/${data.ticketNumber}`

  const body = `
    <p style="color:#333;line-height:1.6;">Er is een nieuw bericht op uw ticket.</p>
    <div style="background:#f8f9fa;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0;"><strong>Ticketnummer:</strong> ${data.ticketNumber}</p>
      <p style="margin:8px 0 0;"><strong>Van:</strong> ${data.senderName}</p>
    </div>
    <a href="${ticketUrl}" style="display:inline-block;background:#0066cc;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:8px;">Bericht bekijken</a>
  `

  try {
    await emailService.send({
      to: data.recipientEmail,
      subject: `Nieuw bericht op ticket ${data.ticketNumber}`,
      html: wrapInTemplate('Nieuw bericht', body),
    })
  } catch (err) {
    console.error('[Support Email] Failed to send new message email:', err)
  }
}

/**
 * Send ticket resolved email with satisfaction rating link
 */
export async function sendTicketResolvedEmail(data: TicketEmailData): Promise<void> {
  if (!emailService.isConfigured()) return

  const baseUrl = getBaseUrl()
  const ticketUrl = `${baseUrl}/account/support/${data.ticketNumber}`

  const body = `
    <p style="color:#333;line-height:1.6;">Beste ${data.customerName},</p>
    <p style="color:#333;line-height:1.6;">Uw ticket is opgelost.</p>
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0;"><strong>Ticketnummer:</strong> ${data.ticketNumber}</p>
      <p style="margin:8px 0 0;"><strong>Status:</strong> Opgelost</p>
    </div>
    <p style="color:#333;line-height:1.6;">Hoe tevreden bent u over onze service?</p>
    <a href="${ticketUrl}" style="display:inline-block;background:#0066cc;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:8px;">Beoordeling geven</a>
  `

  try {
    await emailService.send({
      to: data.customerEmail,
      subject: `Ticket ${data.ticketNumber} opgelost`,
      html: wrapInTemplate('Ticket opgelost', body),
    })
  } catch (err) {
    console.error('[Support Email] Failed to send resolved email:', err)
  }
}

/**
 * Send SLA breach warning to agent
 */
export async function sendSLABreachEmail(data: TicketEmailData & { agentEmail: string; breachType: 'response' | 'resolution' }): Promise<void> {
  if (!emailService.isConfigured()) return

  const baseUrl = getBaseUrl()
  const ticketUrl = `${baseUrl}/admin/collections/support-tickets/${data.ticketNumber}`
  const breachLabel = data.breachType === 'response' ? 'responstijd' : 'oplostijd'

  const body = `
    <p style="color:#333;line-height:1.6;">De SLA ${breachLabel} is overschreden voor het volgende ticket:</p>
    <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:6px;padding:16px;margin:16px 0;">
      <p style="margin:0;"><strong>Ticketnummer:</strong> ${data.ticketNumber}</p>
      <p style="margin:8px 0 0;"><strong>Onderwerp:</strong> ${data.subject}</p>
      <p style="margin:8px 0 0;"><strong>Klant:</strong> ${data.customerName}</p>
    </div>
    <a href="${ticketUrl}" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:8px;">Direct actie ondernemen</a>
  `

  try {
    await emailService.send({
      to: data.agentEmail,
      subject: `[SLA Overschrijding] Ticket ${data.ticketNumber}`,
      html: wrapInTemplate('SLA Overschrijding', body),
    })
  } catch (err) {
    console.error('[Support Email] Failed to send SLA breach email:', err)
  }
}
