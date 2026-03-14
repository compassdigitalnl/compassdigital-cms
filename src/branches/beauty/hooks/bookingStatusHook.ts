import type { CollectionAfterChangeHook } from 'payload'
import { emailService } from '@/features/email-marketing/lib/TransactionalEmailService'

/**
 * Booking Status Hook (Beauty Branch)
 *
 * Payload CMS afterChange hook on ContentBookings collection.
 * Detects status changes and triggers transactional emails:
 *
 * Trigger map:
 *   new       → confirmed  : "Afspraak Bevestiging" to customer + admin. If isFirstVisit → "Eerste Bezoek Welkom"
 *   confirmed → cancelled  : "Afspraak Geannuleerd" to customer + admin
 *   confirmed → completed  : Log completion (no email — review flow triggers via automation)
 *   confirmed → no-show    : Console log for admin
 *
 * ONLY handles docs where branch === 'beauty' (safe for other branches).
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
  return process.env.SITE_NAME || 'Beauty Salon'
}

function getContactEmail(): string {
  return process.env.CONTACT_EMAIL || 'info@example.com'
}

function getContactPhone(): string {
  return process.env.CONTACT_PHONE || ''
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

const BEAUTY_GRADIENT = 'linear-gradient(135deg, #ec4899, #8b5cf6)'

function getServiceName(doc: any): string {
  if (typeof doc.service === 'object' && doc.service?.title) return doc.service.title
  return 'Behandeling'
}

function getStaffName(doc: any): string {
  if (typeof doc.staffMember === 'object' && doc.staffMember?.name) return doc.staffMember.name
  return ''
}

function buildConfirmedCustomerEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const name = escapeHtml(doc.firstName || '')
  const serviceName = escapeHtml(getServiceName(doc))
  const date = escapeHtml(doc.date || '')
  const time = escapeHtml(doc.time || '')
  const staffName = getStaffName(doc)

  const subject = `${siteName} — Je afspraak is bevestigd!`

  const body = `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hoi ${name},
    </p>

    <p style="font-size: 15px; margin-bottom: 20px;">
      Geweldig nieuws! Je afspraak voor <strong>${serviceName}</strong> is bevestigd.
    </p>

    <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0 0 8px 0;"><strong>Datum:</strong> ${date}</p>
      <p style="margin: 0 0 8px 0;"><strong>Tijd:</strong> ${time}</p>
      ${staffName ? `<p style="margin: 0;"><strong>Specialist:</strong> ${escapeHtml(staffName)}</p>` : ''}
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Wij kijken ernaar uit je te verwelkomen! Kun je onverhoopt niet komen?
      Laat het ons dan zo snel mogelijk weten.
    </p>
  `

  return {
    subject,
    html: emailWrapper(subject, BEAUTY_GRADIENT, body),
  }
}

function buildConfirmedAdminEmail(doc: any): { subject: string; html: string } {
  const serviceName = getServiceName(doc)
  const staffName = getStaffName(doc)

  const subject = `Afspraak bevestigd: ${doc.firstName} ${doc.lastName} — ${serviceName}`

  const body = `
    <h2 style="margin-top: 0; font-size: 18px;">Afspraak Bevestigd</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #666;">Klant:</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(doc.firstName || '')} ${escapeHtml(doc.lastName || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Behandeling:</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(serviceName)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Datum:</td><td style="padding: 8px 0;">${escapeHtml(doc.date || '')} om ${escapeHtml(doc.time || '')}</td></tr>
      ${staffName ? `<tr><td style="padding: 8px 0; color: #666;">Specialist:</td><td style="padding: 8px 0;">${escapeHtml(staffName)}</td></tr>` : ''}
      <tr><td style="padding: 8px 0; color: #666;">E-mail:</td><td style="padding: 8px 0;">${escapeHtml(doc.email || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Telefoon:</td><td style="padding: 8px 0;">${escapeHtml(doc.phone || '')}</td></tr>
    </table>
  `

  return {
    subject,
    html: emailWrapper(subject, BEAUTY_GRADIENT, body),
  }
}

function buildFirstVisitWelcomeEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const name = escapeHtml(doc.firstName || '')
  const serviceName = escapeHtml(getServiceName(doc))

  const subject = `Welkom bij ${siteName}! — Tips voor je eerste bezoek`

  const body = `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hoi ${name},
    </p>

    <p style="font-size: 15px; margin-bottom: 20px;">
      Wat leuk dat je voor het eerst bij ons komt voor <strong>${serviceName}</strong>!
      Hier zijn een paar tips om je bezoek zo fijn mogelijk te maken:
    </p>

    <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #ec4899;">Tips voor je eerste bezoek</h3>
      <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
        <li style="margin-bottom: 8px;">Kom 5-10 minuten eerder zodat we rustig kennis kunnen maken</li>
        <li style="margin-bottom: 8px;">Heb je allergieën of gevoeligheden? Laat het ons even weten</li>
        <li style="margin-bottom: 8px;">Vragen over de behandeling? Stel ze gerust — we leggen alles uit</li>
      </ul>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      We kijken ernaar uit je te ontmoeten!
    </p>

    <p style="color: #666; font-size: 14px;">
      Hartelijke groet,<br>
      Het team van ${escapeHtml(siteName)}
    </p>
  `

  return {
    subject,
    html: emailWrapper(subject, BEAUTY_GRADIENT, body),
  }
}

function buildCancelledCustomerEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const name = escapeHtml(doc.firstName || '')
  const serviceName = escapeHtml(getServiceName(doc))
  const date = escapeHtml(doc.date || '')
  const time = escapeHtml(doc.time || '')

  const subject = `${siteName} — Je afspraak is geannuleerd`

  const body = `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Hoi ${name},
    </p>

    <p style="font-size: 15px; margin-bottom: 20px;">
      Je afspraak voor <strong>${serviceName}</strong> op ${date} om ${time} is geannuleerd.
    </p>

    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #991b1b; font-size: 14px;">
        Jammer dat het niet doorgaat! Wil je een nieuwe afspraak maken?
        Neem gerust contact met ons op of boek direct via onze website.
      </p>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Hopelijk tot snel!
    </p>

    <p style="color: #666; font-size: 14px;">
      Hartelijke groet,<br>
      Het team van ${escapeHtml(siteName)}
    </p>
  `

  return {
    subject,
    html: emailWrapper(subject, 'linear-gradient(135deg, #6c757d 0%, #495057 100%)', body),
  }
}

function buildCancelledAdminEmail(doc: any): { subject: string; html: string } {
  const serviceName = getServiceName(doc)

  const subject = `Afspraak geannuleerd: ${doc.firstName} ${doc.lastName} — ${serviceName}`

  const body = `
    <h2 style="margin-top: 0; font-size: 18px; color: #ef4444;">Afspraak Geannuleerd</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #666;">Klant:</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(doc.firstName || '')} ${escapeHtml(doc.lastName || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Behandeling:</td><td style="padding: 8px 0;">${escapeHtml(serviceName)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Datum:</td><td style="padding: 8px 0;">${escapeHtml(doc.date || '')} om ${escapeHtml(doc.time || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">E-mail:</td><td style="padding: 8px 0;">${escapeHtml(doc.email || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Telefoon:</td><td style="padding: 8px 0;">${escapeHtml(doc.phone || '')}</td></tr>
    </table>
    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Dit tijdslot is nu weer beschikbaar voor andere klanten.
    </p>
  `

  return {
    subject,
    html: emailWrapper(subject, 'linear-gradient(135deg, #6c757d 0%, #495057 100%)', body),
  }
}

export const bookingStatusHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  // Only trigger on update (not create — creates are handled by the API endpoint)
  if (operation !== 'update') return doc

  // Only handle beauty branch bookings
  if (doc.branch !== 'beauty') return doc

  const newStatus = doc.status
  const oldStatus = previousDoc?.status

  // No status change → no action
  if (!newStatus || newStatus === oldStatus) return doc

  // Need customer email to send
  const customerEmail = doc.email
  if (!customerEmail) {
    console.warn(`[bookingStatusHook] No email found for booking ${doc.id}`)
    return doc
  }

  const adminEmail = getContactEmail()

  // Handle status transitions
  if (oldStatus === 'new' && newStatus === 'confirmed') {
    // ── new → confirmed: Send confirmation to customer + admin ──
    const customerEmailData = buildConfirmedCustomerEmail(doc)
    const adminEmailData = buildConfirmedAdminEmail(doc)

    try {
      const result = await emailService.send({
        to: customerEmail,
        subject: customerEmailData.subject,
        html: customerEmailData.html,
      })
      if (result.success) {
        console.log(`[bookingStatusHook] Confirmation email sent to ${customerEmail} (booking ${doc.id})`)
      } else {
        console.warn(`[bookingStatusHook] Failed to send confirmation email:`, result.error)
      }
    } catch (error) {
      console.error(`[bookingStatusHook] Failed to send confirmation email for booking ${doc.id}:`, error)
    }

    // Admin notification
    if (adminEmail) {
      try {
        await emailService.send({
          to: adminEmail,
          subject: adminEmailData.subject,
          html: adminEmailData.html,
        })
      } catch (error) {
        console.error(`[bookingStatusHook] Failed to send admin confirmation email:`, error)
      }
    }

    // First visit welcome email
    if (doc.isFirstVisit) {
      const welcomeEmailData = buildFirstVisitWelcomeEmail(doc)
      try {
        const result = await emailService.send({
          to: customerEmail,
          subject: welcomeEmailData.subject,
          html: welcomeEmailData.html,
        })
        if (result.success) {
          console.log(`[bookingStatusHook] First visit welcome email sent to ${customerEmail} (booking ${doc.id})`)
        }
      } catch (error) {
        console.error(`[bookingStatusHook] Failed to send first visit welcome email:`, error)
      }
    }
  } else if (oldStatus === 'confirmed' && newStatus === 'cancelled') {
    // ── confirmed → cancelled: Send cancellation to customer + admin ──
    const customerEmailData = buildCancelledCustomerEmail(doc)
    const adminEmailData = buildCancelledAdminEmail(doc)

    try {
      const result = await emailService.send({
        to: customerEmail,
        subject: customerEmailData.subject,
        html: customerEmailData.html,
      })
      if (result.success) {
        console.log(`[bookingStatusHook] Cancellation email sent to ${customerEmail} (booking ${doc.id})`)
      } else {
        console.warn(`[bookingStatusHook] Failed to send cancellation email:`, result.error)
      }
    } catch (error) {
      console.error(`[bookingStatusHook] Failed to send cancellation email for booking ${doc.id}:`, error)
    }

    // Admin notification
    if (adminEmail) {
      try {
        await emailService.send({
          to: adminEmail,
          subject: adminEmailData.subject,
          html: adminEmailData.html,
        })
      } catch (error) {
        console.error(`[bookingStatusHook] Failed to send admin cancellation email:`, error)
      }
    }
  } else if (oldStatus === 'confirmed' && newStatus === 'completed') {
    // ── confirmed → completed: Log only (review flow via automation) ──
    console.log(`[bookingStatusHook] Booking ${doc.id} completed — ${doc.firstName} ${doc.lastName} (${getServiceName(doc)})`)
  } else if (oldStatus === 'confirmed' && newStatus === 'no-show') {
    // ── confirmed → no-show: Admin log ──
    console.log(`[bookingStatusHook] No-show for booking ${doc.id} — ${doc.firstName} ${doc.lastName}, ${doc.date} ${doc.time}`)
  }

  return doc
}
