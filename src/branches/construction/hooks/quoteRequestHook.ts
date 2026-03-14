import type { CollectionAfterChangeHook } from 'payload'
import { emailService } from '@/features/email-marketing/lib/TransactionalEmailService'

/**
 * Quote Request Status Hook
 *
 * Payload CMS afterChange hook on QuoteRequests collection.
 * Detects status changes and triggers transactional emails:
 *
 * Trigger map:
 *   new        → (no email — create is handled by the API endpoint)
 *   contacted  → sendContactedEmail()
 *   quoted     → sendQuotedEmail()
 *   won        → sendWonEmail()
 *   lost       → sendLostEmail()
 */

const PROJECT_TYPE_LABELS: Record<string, string> = {
  nieuwbouw: 'Nieuwbouw',
  renovatie: 'Renovatie',
  verduurzaming: 'Verduurzaming',
  aanbouw: 'Aanbouw / Opbouw',
  utiliteitsbouw: 'Utiliteitsbouw',
  herstelwerk: 'Herstelwerk',
}

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
  return process.env.SITE_NAME || 'Bouwbedrijf'
}

function getContactEmail(): string {
  return process.env.CONTACT_EMAIL || 'info@example.com'
}

function getContactPhone(): string {
  return process.env.CONTACT_PHONE || ''
}

function getProjectTypeLabel(value: string): string {
  return PROJECT_TYPE_LABELS[value] || value
}

function emailWrapper(title: string, headerColor: string, bodyContent: string): string {
  const siteName = escapeHtml(getSiteName())
  const contactEmail = getContactEmail()
  const contactPhone = getContactPhone()

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
    <p style="margin: 0 0 5px 0;">${siteName}</p>
    ${contactEmail ? `<p style="margin: 0 0 5px 0;">E-mail: <a href="mailto:${escapeHtml(contactEmail)}" style="color: #999;">${escapeHtml(contactEmail)}</a></p>` : ''}
    ${contactPhone ? `<p style="margin: 0 0 5px 0;">Tel: <a href="tel:${escapeHtml(contactPhone)}" style="color: #999;">${escapeHtml(contactPhone)}</a></p>` : ''}
    <p style="margin: 10px 0 0 0;">&copy; ${new Date().getFullYear()} ${siteName}. Alle rechten voorbehouden.</p>
  </div>

</body>
</html>
  `.trim()
}

function buildContactedEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const name = escapeHtml(doc.name || '')
  const projectType = getProjectTypeLabel(doc.projectType || '')

  const subject = `${siteName} — Uw offerte aanvraag is ontvangen`

  const body = `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Beste ${name},
    </p>

    <p style="font-size: 15px; margin-bottom: 20px;">
      Bedankt voor uw offerte aanvraag voor <strong>${escapeHtml(projectType)}</strong>.
      Wij hebben uw aanvraag in goede orde ontvangen.
    </p>

    <div style="background: #e7f3ff; border-left: 4px solid #0066cc; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #0066cc; font-size: 14px;">
        Een van onze medewerkers neemt zo snel mogelijk telefonisch contact met u op om uw project te bespreken.
        Houd uw telefoon in de gaten!
      </p>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Heeft u in de tussentijd vragen? Neem gerust contact met ons op.
    </p>
  `

  return {
    subject,
    html: emailWrapper(subject, 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', body),
  }
}

function buildQuotedEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const name = escapeHtml(doc.name || '')
  const projectType = getProjectTypeLabel(doc.projectType || '')

  const subject = `${siteName} — Uw offerte is gereed`

  const body = `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Beste ${name},
    </p>

    <p style="font-size: 15px; margin-bottom: 20px;">
      Goed nieuws! De offerte voor uw project <strong>${escapeHtml(projectType)}</strong> is gereed.
    </p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #667eea;">Uw offerte is klaar</h2>
      <p style="margin: 0; color: #666; font-size: 14px;">
        Wij hebben op basis van ons gesprek en uw wensen een offerte opgesteld.
        U ontvangt deze per e-mail of post, of onze medewerker bespreekt deze persoonlijk met u.
      </p>
    </div>

    <div style="background: #e7f3ff; border-left: 4px solid #0066cc; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #0066cc; font-size: 14px;">
        Heeft u vragen over de offerte of wilt u iets bespreken?
        Neem gerust contact met ons op. Wij helpen u graag verder.
      </p>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Met vriendelijke groet,<br>
      Het team van ${escapeHtml(siteName)}
    </p>
  `

  return {
    subject,
    html: emailWrapper(subject, 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', body),
  }
}

function buildWonEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const name = escapeHtml(doc.name || '')
  const projectType = getProjectTypeLabel(doc.projectType || '')

  const subject = `${siteName} — Welkom als opdrachtgever!`

  const body = `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Beste ${name},
    </p>

    <p style="font-size: 15px; margin-bottom: 20px;">
      Fantastisch nieuws! Wij zijn verheugd dat u voor ${escapeHtml(siteName)} heeft gekozen
      voor uw project <strong>${escapeHtml(projectType)}</strong>.
    </p>

    <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #155724; font-size: 14px;">
        <strong>Bedankt voor uw vertrouwen!</strong><br>
        Wij gaan met veel enthousiasme aan de slag met uw project.
        Onze projectleider neemt binnenkort contact met u op om de planning en verdere details te bespreken.
      </p>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">Wat kunt u verwachten?</h3>
      <ol style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
        <li style="margin-bottom: 8px;">Onze projectleider neemt contact met u op</li>
        <li style="margin-bottom: 8px;">Samen stellen we een planning op</li>
        <li style="margin-bottom: 8px;">U ontvangt de benodigde documenten en contracten</li>
        <li style="margin-bottom: 8px;">De werkzaamheden starten volgens planning</li>
      </ol>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Met vriendelijke groet,<br>
      Het team van ${escapeHtml(siteName)}
    </p>
  `

  return {
    subject,
    html: emailWrapper(subject, 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', body),
  }
}

function buildLostEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const name = escapeHtml(doc.name || '')

  const subject = `${siteName} — Bedankt voor uw interesse`

  const body = `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Beste ${name},
    </p>

    <p style="font-size: 15px; margin-bottom: 20px;">
      Bedankt voor uw offerte aanvraag en de tijd die u heeft genomen om uw project met ons te bespreken.
      Wij begrijpen dat u op dit moment een andere keuze heeft gemaakt.
    </p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        Mocht u in de toekomst toch nog een bouwproject hebben, dan staan wij uiteraard
        graag voor u klaar. Aarzel niet om opnieuw contact met ons op te nemen.
      </p>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Wij wensen u veel succes met uw project!
    </p>

    <p style="color: #666; font-size: 14px;">
      Met vriendelijke groet,<br>
      Het team van ${escapeHtml(siteName)}
    </p>
  `

  return {
    subject,
    html: emailWrapper(subject, 'linear-gradient(135deg, #6c757d 0%, #495057 100%)', body),
  }
}

export const quoteRequestHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  // Only trigger on update (not create — creates are handled by the API endpoint)
  if (operation !== 'update') return doc

  const newStatus = doc.status
  const oldStatus = previousDoc?.status

  // No status change → no email
  if (!newStatus || newStatus === oldStatus) return doc

  // Need customer email to send
  const customerEmail = doc.email
  if (!customerEmail) {
    console.warn(`[quoteRequestHook] No email found for quote request ${doc.id}`)
    return doc
  }

  let emailData: { subject: string; html: string } | null = null

  switch (newStatus) {
    case 'contacted':
      emailData = buildContactedEmail(doc)
      break
    case 'quoted':
      emailData = buildQuotedEmail(doc)
      break
    case 'won':
      emailData = buildWonEmail(doc)
      break
    case 'lost':
      emailData = buildLostEmail(doc)
      break
    default:
      break
  }

  if (!emailData) return doc

  try {
    const result = await emailService.send({
      to: customerEmail,
      subject: emailData.subject,
      html: emailData.html,
    })

    if (result.success) {
      console.log(`[quoteRequestHook] Email sent for status '${newStatus}' to ${customerEmail} (quote request ${doc.id})`)
    } else {
      console.warn(`[quoteRequestHook] Failed to send email for status '${newStatus}':`, result.error)
    }
  } catch (error) {
    // Log but don't throw — email failure should not block quote request update
    console.error(`[quoteRequestHook] Failed to send email for quote request ${doc.id}:`, error)
  }

  return doc
}
