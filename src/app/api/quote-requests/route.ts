import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { emailService } from '@/features/email-marketing/lib/TransactionalEmailService'
import { verifyRecaptchaToken, isRecaptchaConfigured } from '@/lib/integrations/recaptcha/verify'

type QuoteRequestData = {
  name: string
  email: string
  phone: string
  projectType: string
  budget?: string
  timeline?: string
  description?: string
  address?: string
  postalCode?: string
  city?: string
  recaptchaToken?: string
}

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

function buildCustomerConfirmationEmail(body: QuoteRequestData): { subject: string; html: string } {
  const siteName = escapeHtml(getSiteName())
  const name = escapeHtml(body.name)
  const projectType = escapeHtml(PROJECT_TYPE_LABELS[body.projectType] || body.projectType)
  const contactEmail = getContactEmail()
  const contactPhone = getContactPhone()

  const subject = `${getSiteName()} — Uw offerte aanvraag is ontvangen`

  const html = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offerte aanvraag ontvangen</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">${siteName}</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">

    <p style="font-size: 16px; margin-bottom: 20px;">
      Beste ${name},
    </p>

    <p style="font-size: 15px; margin-bottom: 20px;">
      Bedankt voor uw offerte aanvraag voor <strong>${projectType}</strong>.
      Wij hebben uw aanvraag in goede orde ontvangen en nemen zo snel mogelijk contact met u op.
    </p>

    <div style="background: #e7f3ff; border-left: 4px solid #0066cc; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <p style="margin: 0; color: #0066cc; font-size: 14px;">
        Wij streven ernaar om binnen 2 werkdagen contact met u op te nemen om uw project te bespreken.
      </p>
    </div>

    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      Heeft u in de tussentijd vragen? Neem gerust contact met ons op.
    </p>

    <p style="color: #666; font-size: 14px;">
      Met vriendelijke groet,<br>
      Het team van ${siteName}
    </p>

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

  return { subject, html }
}

function buildAdminNotificationEmail(body: QuoteRequestData, submissionId: number | string): { subject: string; html: string } {
  const siteName = escapeHtml(getSiteName())
  const projectType = escapeHtml(PROJECT_TYPE_LABELS[body.projectType] || body.projectType)

  const subject = `Nieuwe offerte aanvraag van ${body.name} — ${PROJECT_TYPE_LABELS[body.projectType] || body.projectType}`

  const optionalRows = [
    body.budget ? `<tr><td style="padding: 10px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee; width: 140px;">Budget</td><td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${escapeHtml(body.budget)}</td></tr>` : '',
    body.timeline ? `<tr><td style="padding: 10px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee; width: 140px;">Gewenste start</td><td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${escapeHtml(body.timeline)}</td></tr>` : '',
    body.address ? `<tr><td style="padding: 10px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee; width: 140px;">Adres</td><td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${escapeHtml(body.address)}</td></tr>` : '',
    body.postalCode ? `<tr><td style="padding: 10px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee; width: 140px;">Postcode</td><td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${escapeHtml(body.postalCode)}</td></tr>` : '',
    body.city ? `<tr><td style="padding: 10px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee; width: 140px;">Plaats</td><td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${escapeHtml(body.city)}</td></tr>` : '',
  ].filter(Boolean).join('')

  const html = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuwe offerte aanvraag</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f5;">

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Nieuwe Offerte Aanvraag</h1>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #667eea;">Aanvraag #${escapeHtml(String(submissionId))}</h2>
      <p style="margin: 0; color: #666; font-size: 14px;">Projecttype: <strong>${projectType}</strong></p>
    </div>

    <h3 style="font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
      Contactgegevens
    </h3>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <tr>
        <td style="padding: 10px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee; width: 140px;">Naam</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${escapeHtml(body.name)}</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee; width: 140px;">E-mail</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(body.email)}" style="color: #667eea;">${escapeHtml(body.email)}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee; width: 140px;">Telefoon</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;"><a href="tel:${escapeHtml(body.phone)}" style="color: #667eea;">${escapeHtml(body.phone)}</a></td>
      </tr>
    </table>

    <h3 style="font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
      Projectdetails
    </h3>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <tr>
        <td style="padding: 10px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #eee; width: 140px;">Projecttype</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${projectType}</td>
      </tr>
      ${optionalRows}
    </table>

    ${body.description ? `
    <h3 style="font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
      Omschrijving
    </h3>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 30px; white-space: pre-wrap; font-size: 14px; color: #333;">
${escapeHtml(body.description)}
    </div>
    ` : ''}

    <div style="text-align: center; margin-top: 20px;">
      <a href="${process.env.NEXT_PUBLIC_SERVER_URL || ''}/admin/collections/quote-requests/${escapeHtml(String(submissionId))}" style="display: inline-block; background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
        Bekijk in admin
      </a>
    </div>

  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p style="margin: 0;">${siteName} — Offerte aanvragen systeem</p>
  </div>

</body>
</html>
  `.trim()

  return { subject, html }
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequestData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.projectType) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in (naam, e-mail, telefoon, projecttype)' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA token (if configured)
    if (isRecaptchaConfigured()) {
      if (!body.recaptchaToken) {
        console.warn('[Quote Request] reCAPTCHA token missing')
        return NextResponse.json(
          { error: 'reCAPTCHA verification required' },
          { status: 400 }
        )
      }

      const recaptchaResult = await verifyRecaptchaToken(
        body.recaptchaToken,
        'quote_request',
        0.5
      )

      if (!recaptchaResult.success) {
        console.warn('[Quote Request] reCAPTCHA verification failed:', recaptchaResult.error)
        return NextResponse.json(
          {
            error: 'Spam verificatie mislukt. Probeer het opnieuw.',
            details: process.env.NODE_ENV === 'development' ? recaptchaResult.error : undefined,
          },
          { status: 403 }
        )
      }

      console.log('[Quote Request] reCAPTCHA verified - Score:', recaptchaResult.score)
    } else {
      console.warn('[Quote Request] reCAPTCHA not configured - spam protection disabled')
    }

    // Get Payload instance
    const payload = await getPayload({ config })

    // Create quote request in database
    const submission = await payload.create({
      collection: 'quote-requests',
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        projectType: body.projectType,
        budget: body.budget || undefined,
        timeline: body.timeline || undefined,
        description: body.description || undefined,
        address: body.address || undefined,
        postalCode: body.postalCode || undefined,
        city: body.city || undefined,
        status: 'new',
        submittedAt: new Date().toISOString(),
      } as any,
    })

    console.log('[Quote Request] New submission received:', {
      id: submission.id,
      name: body.name,
      email: body.email,
      projectType: body.projectType,
    })

    // Send confirmation email to customer
    let customerEmailSent = false
    try {
      const customerEmail = buildCustomerConfirmationEmail(body)
      const customerResult = await emailService.send({
        to: body.email,
        subject: customerEmail.subject,
        html: customerEmail.html,
      })

      customerEmailSent = customerResult.success
      if (customerResult.success) {
        console.log('[Quote Request] Customer confirmation email sent to', body.email)
      } else {
        console.warn('[Quote Request] Failed to send customer confirmation:', customerResult.error)
      }
    } catch (error) {
      console.error('[Quote Request] Error sending customer confirmation email:', error)
    }

    // Send notification email to admin
    let adminEmailSent = false
    const adminEmail = getContactEmail()
    try {
      const adminNotification = buildAdminNotificationEmail(body, submission.id)
      const adminResult = await emailService.send({
        to: adminEmail,
        subject: adminNotification.subject,
        html: adminNotification.html,
      })

      adminEmailSent = adminResult.success
      if (adminResult.success) {
        console.log('[Quote Request] Admin notification email sent to', adminEmail)
      } else {
        console.warn('[Quote Request] Failed to send admin notification:', adminResult.error)
      }
    } catch (error) {
      console.error('[Quote Request] Error sending admin notification email:', error)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Offerte aanvraag succesvol ingediend',
        submissionId: submission.id,
        customerEmailSent,
        adminEmailSent,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('[Quote Request] Error processing submission:', error)

    return NextResponse.json(
      { error: 'Er is een fout opgetreden. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
