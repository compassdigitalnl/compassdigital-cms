import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { emailService } from '@/features/email-marketing/lib/TransactionalEmailService'

type ReservationFormData = {
  date: string
  time: string
  guests: number
  occasion?: string
  preferences?: string[]
  firstName: string
  lastName: string
  email: string
  phone: string
  remarks?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ReservationFormData = await request.json()

    // Validate required fields
    if (!body.date || !body.time || !body.guests || !body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Validate guests
    if (body.guests < 1 || body.guests > 20) {
      return NextResponse.json({ error: 'Guests must be between 1 and 20' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Create reservation in content-bookings
    const reservation = await payload.create({
      collection: 'content-bookings',
      data: {
        branch: 'horeca',
        status: 'new',
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        date: body.date,
        time: body.time,
        guests: body.guests,
        occasion: body.occasion || 'regular',
        preferences: body.preferences || [],
        remarks: body.remarks || '',
      } as any,
    })

    console.log('[Horeca Reservation] New reservation created:', {
      id: reservation.id,
      date: body.date,
      time: body.time,
      guests: body.guests,
      customer: `${body.firstName} ${body.lastName}`,
    })

    // Send confirmation email to customer
    let emailSent = false
    if (emailService.isConfigured()) {
      const siteName = process.env.SITE_NAME || 'Restaurant'

      try {
        const result = await emailService.send({
          to: body.email,
          subject: `Reservering aangevraagd — ${body.date} om ${body.time}`,
          html: buildCustomerEmail({
            customerName: body.firstName,
            date: body.date,
            time: body.time,
            guests: body.guests,
            occasion: body.occasion,
            siteName,
          }),
        })
        emailSent = result.success
      } catch (e) {
        console.warn('[Horeca Reservation] Failed to send customer email:', e)
      }

      // Admin notification
      const adminEmail = process.env.CONTACT_EMAIL
      if (adminEmail) {
        try {
          await emailService.send({
            to: adminEmail,
            subject: `Nieuwe reservering: ${body.firstName} ${body.lastName} — ${body.guests} gasten`,
            html: buildAdminEmail({
              customerName: `${body.firstName} ${body.lastName}`,
              customerEmail: body.email,
              customerPhone: body.phone,
              date: body.date,
              time: body.time,
              guests: body.guests,
              occasion: body.occasion || 'regular',
              preferences: body.preferences || [],
              remarks: body.remarks || '',
            }),
          })
        } catch (e) {
          console.warn('[Horeca Reservation] Failed to send admin email:', e)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation created successfully',
      reservationId: reservation.id,
      emailSent,
    })
  } catch (error) {
    console.error('[Horeca Reservation] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions for HTML emails with horeca gradient
function escapeHtml(text: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

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

function buildCustomerEmail(data: { customerName: string; date: string; time: string; guests: number; occasion?: string; siteName: string }): string {
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Reservering aangevraagd</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">${escapeHtml(data.siteName)}</h1>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px;">Beste ${escapeHtml(data.customerName)},</p>
    <p>Uw reservering is aangevraagd!</p>
    <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px 0;"><strong>Datum:</strong> ${escapeHtml(data.date)}</p>
      <p style="margin: 0 0 8px 0;"><strong>Tijd:</strong> ${escapeHtml(data.time)}</p>
      <p style="margin: 0 0 8px 0;"><strong>Gasten:</strong> ${data.guests}</p>
      ${data.occasion && data.occasion !== 'regular' ? `<p style="margin: 0;"><strong>Gelegenheid:</strong> ${escapeHtml(OCCASION_LABELS[data.occasion] || data.occasion)}</p>` : ''}
    </div>
    <p style="color: #666; font-size: 14px;">U ontvangt een bevestiging zodra uw reservering is bevestigd.</p>
  </div>
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${escapeHtml(data.siteName)}</p>
  </div>
</body></html>`.trim()
}

function buildAdminEmail(data: { customerName: string; customerEmail: string; customerPhone: string; date: string; time: string; guests: number; occasion: string; preferences: string[]; remarks: string }): string {
  const prefsStr = data.preferences.map(p => PREF_LABELS[p] || p).join(', ') || 'Geen'
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Nieuwe reservering</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Nieuwe Reservering</h1>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #666;">Naam:</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.customerName)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">E-mail:</td><td style="padding: 8px 0;">${escapeHtml(data.customerEmail)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Telefoon:</td><td style="padding: 8px 0;">${escapeHtml(data.customerPhone)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Datum:</td><td style="padding: 8px 0;">${escapeHtml(data.date)} om ${escapeHtml(data.time)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Gasten:</td><td style="padding: 8px 0; font-weight: 600;">${data.guests}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Gelegenheid:</td><td style="padding: 8px 0;">${escapeHtml(OCCASION_LABELS[data.occasion] || data.occasion)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Voorkeuren:</td><td style="padding: 8px 0;">${escapeHtml(prefsStr)}</td></tr>
      ${data.remarks ? `<tr><td style="padding: 8px 0; color: #666;">Opmerkingen:</td><td style="padding: 8px 0;">${escapeHtml(data.remarks)}</td></tr>` : ''}
    </table>
  </div>
</body></html>`.trim()
}

export const dynamic = 'force-dynamic'
