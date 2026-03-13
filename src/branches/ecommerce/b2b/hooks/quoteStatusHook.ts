import type { CollectionAfterChangeHook } from 'payload'
import { emailService } from '@/features/email-marketing/lib/EmailService'

/**
 * Quote Status Hook
 *
 * Payload CMS afterChange hook on Quotes collection.
 * Detects status changes and triggers transactional emails:
 *
 * Trigger map:
 *   new        → Email to admin (new quote request)
 *   quoted     → Email to customer (quote ready)
 *   accepted   → Email to admin (quote accepted)
 *   rejected   → Email to admin (quote rejected)
 */

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function getSiteName(): string {
  return process.env.SITE_NAME || 'Webshop'
}

function getAdminEmail(): string {
  return process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL || 'info@example.com'
}

function emailWrapper(title: string, headerColor: string, bodyContent: string): string {
  const siteName = escapeHtml(getSiteName())

  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: ${headerColor}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">${siteName}</h1>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    ${bodyContent}
  </div>
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${siteName}</p>
  </div>
</body>
</html>`.trim()
}

function buildNewQuoteAdminEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const customerName = escapeHtml(doc.contactPerson || doc.companyName || 'Onbekend')
  const productCount = doc.products?.length || 0

  const body = `
    <h2 style="color: #1e293b; margin: 0 0 16px;">Nieuwe offerteaanvraag</h2>
    <p>Er is een nieuwe offerteaanvraag binnengekomen.</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px;"><strong>Offertenummer:</strong> ${escapeHtml(doc.quoteNumber || '-')}</p>
      <p style="margin: 0 0 8px;"><strong>Klant:</strong> ${customerName}</p>
      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> ${escapeHtml(doc.email || '-')}</p>
      <p style="margin: 0 0 8px;"><strong>Aantal producten:</strong> ${productCount}</p>
      ${doc.notes ? `<p style="margin: 0;"><strong>Opmerkingen:</strong> ${escapeHtml(doc.notes)}</p>` : ''}
    </div>
    <p>Ga naar het admin panel om de offerte te bekijken en te beantwoorden.</p>
  `

  return {
    subject: `${siteName} — Nieuwe offerteaanvraag ${doc.quoteNumber || ''}`,
    html: emailWrapper('Nieuwe offerteaanvraag', '#2563eb', body),
  }
}

function buildQuotedCustomerEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const name = escapeHtml(doc.contactPerson || 'Klant')
  const validUntil = doc.validUntil ? new Date(doc.validUntil).toLocaleDateString('nl-NL') : 'onbekend'
  const totalPrice = doc.quotedPrice != null ? `€ ${doc.quotedPrice.toFixed(2).replace('.', ',')}` : 'Zie offerte'

  const body = `
    <h2 style="color: #1e293b; margin: 0 0 16px;">Uw offerte is klaar</h2>
    <p>Beste ${name},</p>
    <p>Goed nieuws! Uw offerte <strong>${escapeHtml(doc.quoteNumber || '')}</strong> is gereed.</p>
    <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px;"><strong>Totaalprijs:</strong> ${totalPrice}</p>
      <p style="margin: 0;"><strong>Geldig tot:</strong> ${validUntil}</p>
    </div>
    <p>U kunt de offerte bekijken en accepteren via uw account.</p>
    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Met vriendelijke groet,<br>Het team van ${escapeHtml(siteName)}
    </p>
  `

  return {
    subject: `${siteName} — Uw offerte ${doc.quoteNumber || ''} is klaar`,
    html: emailWrapper('Offerte klaar', '#22c55e', body),
  }
}

function buildAcceptedAdminEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const customerName = escapeHtml(doc.contactPerson || doc.companyName || 'Klant')

  const body = `
    <h2 style="color: #1e293b; margin: 0 0 16px;">Offerte geaccepteerd</h2>
    <p>Klant <strong>${customerName}</strong> heeft offerte <strong>${escapeHtml(doc.quoteNumber || '')}</strong> geaccepteerd.</p>
    <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0;">De offerte kan nu omgezet worden naar een bestelling.</p>
    </div>
  `

  return {
    subject: `${siteName} — Offerte ${doc.quoteNumber || ''} geaccepteerd`,
    html: emailWrapper('Offerte geaccepteerd', '#22c55e', body),
  }
}

function buildRejectedAdminEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const customerName = escapeHtml(doc.contactPerson || doc.companyName || 'Klant')

  const body = `
    <h2 style="color: #1e293b; margin: 0 0 16px;">Offerte afgewezen</h2>
    <p>Klant <strong>${customerName}</strong> heeft offerte <strong>${escapeHtml(doc.quoteNumber || '')}</strong> afgewezen.</p>
    ${doc.rejectionReason ? `
    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0;"><strong>Reden:</strong> ${escapeHtml(doc.rejectionReason)}</p>
    </div>
    ` : ''}
  `

  return {
    subject: `${siteName} — Offerte ${doc.quoteNumber || ''} afgewezen`,
    html: emailWrapper('Offerte afgewezen', '#ef4444', body),
  }
}

export const quoteStatusHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const newStatus = doc.status
  const oldStatus = previousDoc?.status

  // On create, send admin notification for new quotes
  if (operation === 'create' && newStatus === 'new') {
    const emailData = buildNewQuoteAdminEmail(doc)
    try {
      await emailService.send({
        to: getAdminEmail(),
        subject: emailData.subject,
        html: emailData.html,
      })
      console.log(`[quoteStatusHook] New quote admin email sent for ${doc.quoteNumber}`)
    } catch (error) {
      console.error(`[quoteStatusHook] Failed to send new quote email:`, error)
    }
    return doc
  }

  // On update, check for status changes
  if (operation !== 'update') return doc
  if (!newStatus || newStatus === oldStatus) return doc

  let emailData: { subject: string; html: string } | null = null
  let recipient: string | null = null

  switch (newStatus) {
    case 'quoted': {
      // Email to customer
      const customerEmail = doc.email
      if (!customerEmail) {
        // Try to get from user relationship
        if (doc.user) {
          try {
            const userId = typeof doc.user === 'object' ? doc.user.id : doc.user
            const user = await req.payload.findByID({ collection: 'users', id: userId })
            recipient = user.email
          } catch { /* skip */ }
        }
      } else {
        recipient = customerEmail
      }
      emailData = buildQuotedCustomerEmail(doc)
      break
    }
    case 'accepted':
      emailData = buildAcceptedAdminEmail(doc)
      recipient = getAdminEmail()
      break
    case 'rejected':
      emailData = buildRejectedAdminEmail(doc)
      recipient = getAdminEmail()
      break
    default:
      break
  }

  if (!emailData || !recipient) return doc

  try {
    const result = await emailService.send({
      to: recipient,
      subject: emailData.subject,
      html: emailData.html,
    })
    if (result.success) {
      console.log(`[quoteStatusHook] Email sent for status '${newStatus}' to ${recipient} (quote ${doc.quoteNumber})`)
    } else {
      console.warn(`[quoteStatusHook] Failed to send email:`, result.error)
    }
  } catch (error) {
    console.error(`[quoteStatusHook] Failed to send email for quote ${doc.id}:`, error)
  }

  return doc
}
