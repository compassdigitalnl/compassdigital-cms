import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { emailService } from '@/lib/email/EmailService'
import { verifyRecaptchaToken, isRecaptchaConfigured } from '@/lib/recaptcha/verify'

type ContactFormData = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  recaptchaToken?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA token (if configured)
    if (isRecaptchaConfigured()) {
      if (!body.recaptchaToken) {
        console.warn('[Contact Form] reCAPTCHA token missing')
        return NextResponse.json(
          { error: 'reCAPTCHA verification required' },
          { status: 400 }
        )
      }

      const recaptchaResult = await verifyRecaptchaToken(
        body.recaptchaToken,
        'contact_form',
        0.5 // Minimum score of 0.5 (range: 0.0 - 1.0)
      )

      if (!recaptchaResult.success) {
        console.warn('[Contact Form] reCAPTCHA verification failed:', recaptchaResult.error)
        return NextResponse.json(
          {
            error: 'Spam verification failed. Please try again.',
            details: process.env.NODE_ENV === 'development' ? recaptchaResult.error : undefined,
          },
          { status: 403 }
        )
      }

      console.log('[Contact Form] reCAPTCHA verified - Score:', recaptchaResult.score)
    } else {
      console.warn('[Contact Form] reCAPTCHA not configured - spam protection disabled')
    }

    // Get Payload instance
    const payload = await getPayload({ config })

    // Store submission in database
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: 'contact',
        submittedAt: new Date().toISOString(),
        data: [
          { field: 'name', value: body.name },
          { field: 'email', value: body.email },
          ...(body.phone ? [{ field: 'phone', value: body.phone }] : []),
          ...(body.subject ? [{ field: 'subject', value: body.subject }] : []),
          { field: 'message', value: body.message },
        ],
      },
    })

    console.log('[Contact Form] New submission received:', {
      id: submission.id,
      name: body.name,
      email: body.email,
      subject: body.subject || '(geen onderwerp)',
    })

    // Send email notification
    let emailSent = false
    let emailError: string | undefined

    if (emailService.isConfigured()) {
      const emailResult = await emailService.sendContactEmail({
        name: body.name,
        email: body.email,
        phone: body.phone,
        subject: body.subject,
        message: body.message,
      })

      emailSent = emailResult.success
      emailError = emailResult.error

      if (emailResult.success) {
        console.log('[Contact Form] Email notification sent successfully')
      } else {
        console.warn('[Contact Form] Failed to send email notification:', emailResult.error)
      }
    } else {
      console.warn('[Contact Form] Email service not configured - skipping email notification')
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        submissionId: submission.id,
        emailSent,
        ...(emailError ? { emailError } : {}),
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('[Contact Form] Error processing submission:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
