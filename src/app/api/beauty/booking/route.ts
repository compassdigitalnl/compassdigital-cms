import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { emailService } from '@/features/email-marketing/lib/TransactionalEmailService'

type BookingFormData = {
  serviceId: number
  staffMemberId?: number | null
  date: string
  time: string
  firstName: string
  lastName: string
  email: string
  phone: string
  isFirstVisit?: boolean
  remarks?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingFormData = await request.json()

    // Validate required fields
    if (!body.serviceId || !body.date || !body.time || !body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Resolve service name for email
    let serviceName = 'Behandeling'
    try {
      const service = await payload.findByID({ collection: 'content-services', id: body.serviceId })
      if (service) serviceName = service.title
    } catch { /* use default */ }

    // Resolve staff member name
    let staffName = ''
    if (body.staffMemberId) {
      try {
        const staff = await payload.findByID({ collection: 'content-team', id: body.staffMemberId })
        if (staff) staffName = staff.name
      } catch { /* skip */ }
    }

    // Create booking in content-bookings
    const booking = await payload.create({
      collection: 'content-bookings',
      data: {
        branch: 'beauty',
        status: 'new',
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        date: body.date,
        time: body.time,
        isFirstVisit: body.isFirstVisit || false,
        remarks: body.remarks || '',
        service: body.serviceId,
        staffMember: body.staffMemberId || undefined,
      } as any,
    })

    console.log('[Beauty Booking] New booking created:', {
      id: booking.id,
      service: serviceName,
      date: body.date,
      time: body.time,
      customer: `${body.firstName} ${body.lastName}`,
    })

    // Send confirmation email to customer
    let emailSent = false
    if (emailService.isConfigured()) {
      try {
        const siteName = process.env.SITE_NAME || 'Beauty Salon'
        const result = await emailService.send({
          to: body.email,
          subject: `Afspraak aangevraagd — ${serviceName} op ${body.date}`,
          html: buildCustomerConfirmationEmail({
            customerName: body.firstName,
            serviceName,
            date: body.date,
            time: body.time,
            staffName,
            siteName,
          }),
        })
        emailSent = result.success
      } catch (e) {
        console.warn('[Beauty Booking] Failed to send customer email:', e)
      }

      // Send notification to admin
      const adminEmail = process.env.CONTACT_EMAIL
      if (adminEmail) {
        try {
          await emailService.send({
            to: adminEmail,
            subject: `Nieuwe afspraak: ${body.firstName} ${body.lastName} — ${serviceName}`,
            html: buildAdminNotificationEmail({
              customerName: `${body.firstName} ${body.lastName}`,
              customerEmail: body.email,
              customerPhone: body.phone,
              serviceName,
              date: body.date,
              time: body.time,
              staffName,
              isFirstVisit: body.isFirstVisit || false,
              remarks: body.remarks || '',
            }),
          })
        } catch (e) {
          console.warn('[Beauty Booking] Failed to send admin email:', e)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      bookingId: booking.id,
      emailSent,
    })
  } catch (error) {
    console.error('[Beauty Booking] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function buildCustomerConfirmationEmail(data: {
  customerName: string
  serviceName: string
  date: string
  time: string
  staffName: string
  siteName: string
}): string {
  const { customerName, serviceName, date, time, staffName, siteName } = data
  return `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Afspraak aangevraagd</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">${escapeHtml(siteName)}</h1>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px;">Hoi ${escapeHtml(customerName)},</p>
    <p>Je afspraak voor <strong>${escapeHtml(serviceName)}</strong> is aangevraagd!</p>
    <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 8px 0;"><strong>Datum:</strong> ${escapeHtml(date)}</p>
      <p style="margin: 0 0 8px 0;"><strong>Tijd:</strong> ${escapeHtml(time)}</p>
      ${staffName ? `<p style="margin: 0;"><strong>Specialist:</strong> ${escapeHtml(staffName)}</p>` : ''}
    </div>
    <p style="color: #666; font-size: 14px;">Je ontvangt een bevestiging zodra je afspraak is bevestigd.</p>
  </div>
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${escapeHtml(siteName)}</p>
  </div>
</body>
</html>`.trim()
}

function buildAdminNotificationEmail(data: {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceName: string
  date: string
  time: string
  staffName: string
  isFirstVisit: boolean
  remarks: string
}): string {
  return `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Nieuwe afspraak</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">
  <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Nieuwe Afspraak</h1>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="margin-top: 0; font-size: 18px;">Klantgegevens</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #666;">Naam:</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.customerName)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">E-mail:</td><td style="padding: 8px 0;">${escapeHtml(data.customerEmail)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Telefoon:</td><td style="padding: 8px 0;">${escapeHtml(data.customerPhone)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Behandeling:</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.serviceName)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Datum:</td><td style="padding: 8px 0;">${escapeHtml(data.date)} om ${escapeHtml(data.time)}</td></tr>
      ${data.staffName ? `<tr><td style="padding: 8px 0; color: #666;">Specialist:</td><td style="padding: 8px 0;">${escapeHtml(data.staffName)}</td></tr>` : ''}
      <tr><td style="padding: 8px 0; color: #666;">Eerste bezoek:</td><td style="padding: 8px 0;">${data.isFirstVisit ? 'Ja' : 'Nee'}</td></tr>
      ${data.remarks ? `<tr><td style="padding: 8px 0; color: #666;">Opmerkingen:</td><td style="padding: 8px 0;">${escapeHtml(data.remarks)}</td></tr>` : ''}
    </table>
  </div>
</body>
</html>`.trim()
}

export const dynamic = 'force-dynamic'
