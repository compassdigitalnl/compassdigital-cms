import type { CollectionAfterChangeHook } from 'payload'
import { emailService } from '@/features/email-marketing/lib/TransactionalEmailService'

/**
 * Reservation Status Hook (Horeca Branch)
 *
 * Payload CMS afterChange hook on ContentBookings collection.
 * Detects status changes and triggers transactional emails:
 *
 * Trigger map:
 *   new       -> confirmed  : "Reservering Bevestigd" to customer + admin. If guests >= 8, mention personal phone follow-up.
 *   confirmed -> cancelled  : "Reservering Geannuleerd" to customer + admin
 *   confirmed -> completed  : Log completion (no email)
 *   confirmed -> no-show    : Console log for admin
 *
 * ONLY handles docs where branch === 'horeca' (safe for other branches).
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
  return process.env.SITE_NAME || 'Restaurant'
}

function getContactEmail(): string {
  return process.env.CONTACT_EMAIL || 'info@example.com'
}

function getContactPhone(): string {
  return process.env.CONTACT_PHONE || ''
}

const HORECA_GRADIENT = 'linear-gradient(135deg, #f97316, #dc2626)'

const OCCASION_LABELS: Record<string, string> = {
  regular: 'Gewoon diner',
  birthday: 'Verjaardag',
  anniversary: 'Jubileum',
  business: 'Zakelijk diner',
  romantic: 'Romantisch diner',
  group: 'Groepsdiner',
  other: 'Anders',
}

const PREF_LABELS: Record<string, string> = {
  window: 'Raam',
  terrace: 'Terras',
  inside: 'Binnen',
  quiet: 'Rustig hoekje',
  bar: 'Aan de bar',
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

function getOccasionLabel(doc: any): string {
  const occasion = doc.occasion || 'regular'
  return OCCASION_LABELS[occasion] || occasion
}

function getPreferencesStr(doc: any): string {
  const prefs = doc.preferences || []
  if (!Array.isArray(prefs) || prefs.length === 0) return 'Geen'
  return prefs.map((p: string) => PREF_LABELS[p] || p).join(', ')
}

function buildConfirmedCustomerEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const name = escapeHtml(doc.firstName || '')
  const date = escapeHtml(doc.date || '')
  const time = escapeHtml(doc.time || '')
  const guests = doc.guests || 2
  const occasion = doc.occasion || 'regular'

  const subject = `${siteName} — Uw reservering is bevestigd!`

  const largeGroupNote = guests >= 8
    ? `
    <p style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; font-size: 14px; color: #92400e; margin-top: 20px;">
      Voor gezelschappen van 8 of meer gasten nemen wij telefonisch contact met u op om de details door te spreken.
    </p>
    `
    : ''

  const body = `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Beste ${name},
    </p>

    <p style="font-size: 15px; margin-bottom: 20px;">
      Geweldig nieuws! Uw reservering is bevestigd.
    </p>

    <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0 0 8px 0;"><strong>Datum:</strong> ${date}</p>
      <p style="margin: 0 0 8px 0;"><strong>Tijd:</strong> ${time}</p>
      <p style="margin: 0 0 8px 0;"><strong>Gasten:</strong> ${guests}</p>
      ${occasion !== 'regular' ? `<p style="margin: 0;"><strong>Gelegenheid:</strong> ${escapeHtml(getOccasionLabel(doc))}</p>` : ''}
    </div>

    ${largeGroupNote}

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Wij kijken ernaar uit u te verwelkomen! Kunt u onverhoopt niet komen?
      Laat het ons dan zo snel mogelijk weten.
    </p>

    <p style="color: #666; font-size: 14px;">
      Hartelijke groet,<br>
      Het team van ${escapeHtml(siteName)}
    </p>
  `

  return {
    subject,
    html: emailWrapper(subject, HORECA_GRADIENT, body),
  }
}

function buildConfirmedAdminEmail(doc: any): { subject: string; html: string } {
  const guests = doc.guests || 2

  const subject = `Reservering bevestigd: ${doc.firstName} ${doc.lastName} — ${guests} gasten`

  const body = `
    <h2 style="margin-top: 0; font-size: 18px;">Reservering Bevestigd</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #666;">Klant:</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(doc.firstName || '')} ${escapeHtml(doc.lastName || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">E-mail:</td><td style="padding: 8px 0;">${escapeHtml(doc.email || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Telefoon:</td><td style="padding: 8px 0;">${escapeHtml(doc.phone || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Datum:</td><td style="padding: 8px 0;">${escapeHtml(doc.date || '')} om ${escapeHtml(doc.time || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Gasten:</td><td style="padding: 8px 0; font-weight: 600;">${guests}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Gelegenheid:</td><td style="padding: 8px 0;">${escapeHtml(getOccasionLabel(doc))}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Voorkeuren:</td><td style="padding: 8px 0;">${escapeHtml(getPreferencesStr(doc))}</td></tr>
      ${doc.remarks ? `<tr><td style="padding: 8px 0; color: #666;">Opmerkingen:</td><td style="padding: 8px 0;">${escapeHtml(doc.remarks)}</td></tr>` : ''}
    </table>
    ${guests >= 8 ? `<p style="background: #fef3c7; padding: 10px; border-radius: 4px; font-size: 13px; color: #92400e; margin-top: 15px;"><strong>Let op:</strong> Groot gezelschap (${guests} gasten) — telefonisch opvolgen.</p>` : ''}
  `

  return {
    subject,
    html: emailWrapper(subject, HORECA_GRADIENT, body),
  }
}

function buildCancelledCustomerEmail(doc: any): { subject: string; html: string } {
  const siteName = getSiteName()
  const name = escapeHtml(doc.firstName || '')
  const date = escapeHtml(doc.date || '')
  const time = escapeHtml(doc.time || '')
  const guests = doc.guests || 2

  const subject = `${siteName} — Uw reservering is geannuleerd`

  const body = `
    <p style="font-size: 16px; margin-bottom: 20px;">
      Beste ${name},
    </p>

    <p style="font-size: 15px; margin-bottom: 20px;">
      Uw reservering voor ${guests} gasten op ${date} om ${time} is geannuleerd.
    </p>

    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #991b1b; font-size: 14px;">
        Jammer dat het niet doorgaat! Wilt u een nieuwe reservering maken?
        Neem gerust contact met ons op of reserveer direct via onze website.
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
  const guests = doc.guests || 2

  const subject = `Reservering geannuleerd: ${doc.firstName} ${doc.lastName} — ${guests} gasten`

  const body = `
    <h2 style="margin-top: 0; font-size: 18px; color: #ef4444;">Reservering Geannuleerd</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #666;">Klant:</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(doc.firstName || '')} ${escapeHtml(doc.lastName || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Datum:</td><td style="padding: 8px 0;">${escapeHtml(doc.date || '')} om ${escapeHtml(doc.time || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Gasten:</td><td style="padding: 8px 0;">${guests}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">E-mail:</td><td style="padding: 8px 0;">${escapeHtml(doc.email || '')}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Telefoon:</td><td style="padding: 8px 0;">${escapeHtml(doc.phone || '')}</td></tr>
    </table>
    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Dit tijdslot is nu weer beschikbaar voor andere gasten.
    </p>
  `

  return {
    subject,
    html: emailWrapper(subject, 'linear-gradient(135deg, #6c757d 0%, #495057 100%)', body),
  }
}

export const reservationStatusHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  // Only trigger on update (not create — creates are handled by the API endpoint)
  if (operation !== 'update') return doc

  // Only handle horeca branch bookings
  if (doc.branch !== 'horeca') return doc

  const newStatus = doc.status
  const oldStatus = previousDoc?.status

  // No status change -> no action
  if (!newStatus || newStatus === oldStatus) return doc

  // Need customer email to send
  const customerEmail = doc.email
  if (!customerEmail) {
    console.warn(`[reservationStatusHook] No email found for reservation ${doc.id}`)
    return doc
  }

  const adminEmail = getContactEmail()

  // Handle status transitions
  if (oldStatus === 'new' && newStatus === 'confirmed') {
    // -- new -> confirmed: Send confirmation to customer + admin --
    const customerEmailData = buildConfirmedCustomerEmail(doc)
    const adminEmailData = buildConfirmedAdminEmail(doc)

    try {
      const result = await emailService.send({
        to: customerEmail,
        subject: customerEmailData.subject,
        html: customerEmailData.html,
      })
      if (result.success) {
        console.log(`[reservationStatusHook] Confirmation email sent to ${customerEmail} (reservation ${doc.id})`)
      } else {
        console.warn(`[reservationStatusHook] Failed to send confirmation email:`, result.error)
      }
    } catch (error) {
      console.error(`[reservationStatusHook] Failed to send confirmation email for reservation ${doc.id}:`, error)
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
        console.error(`[reservationStatusHook] Failed to send admin confirmation email:`, error)
      }
    }

    // Large group phone follow-up reminder
    const guests = doc.guests || 0
    if (guests >= 8) {
      console.log(`[reservationStatusHook] Large group (${guests} guests) confirmed — reservation ${doc.id}. Phone follow-up recommended for ${doc.firstName} ${doc.lastName} (${doc.phone})`)
    }
  } else if (oldStatus === 'confirmed' && newStatus === 'cancelled') {
    // -- confirmed -> cancelled: Send cancellation to customer + admin --
    const customerEmailData = buildCancelledCustomerEmail(doc)
    const adminEmailData = buildCancelledAdminEmail(doc)

    try {
      const result = await emailService.send({
        to: customerEmail,
        subject: customerEmailData.subject,
        html: customerEmailData.html,
      })
      if (result.success) {
        console.log(`[reservationStatusHook] Cancellation email sent to ${customerEmail} (reservation ${doc.id})`)
      } else {
        console.warn(`[reservationStatusHook] Failed to send cancellation email:`, result.error)
      }
    } catch (error) {
      console.error(`[reservationStatusHook] Failed to send cancellation email for reservation ${doc.id}:`, error)
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
        console.error(`[reservationStatusHook] Failed to send admin cancellation email:`, error)
      }
    }
  } else if (oldStatus === 'confirmed' && newStatus === 'completed') {
    // -- confirmed -> completed: Log only (no email) --
    console.log(`[reservationStatusHook] Reservation ${doc.id} completed — ${doc.firstName} ${doc.lastName}, ${doc.guests} gasten, ${doc.date} ${doc.time}`)
  } else if (oldStatus === 'confirmed' && newStatus === 'no-show') {
    // -- confirmed -> no-show: Admin log --
    console.log(`[reservationStatusHook] No-show for reservation ${doc.id} — ${doc.firstName} ${doc.lastName}, ${doc.guests} gasten, ${doc.date} ${doc.time}`)
  }

  return doc
}
