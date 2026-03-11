import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyRecaptchaToken, isRecaptchaConfigured } from '@/lib/integrations/recaptcha/verify'

type ReviewFormData = {
  clientName: string
  clientRole?: string
  rating: number
  quote: string
  projectSlug?: string
  serviceSlug?: string
  recaptchaToken?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export async function POST(request: NextRequest) {
  try {
    const body: ReviewFormData = await request.json()

    // Validate required fields
    if (!body.clientName || !body.rating || !body.quote) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in (naam, beoordeling, review)' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Beoordeling moet tussen 1 en 5 zijn' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA token (if configured)
    if (isRecaptchaConfigured()) {
      if (!body.recaptchaToken) {
        return NextResponse.json({ error: 'reCAPTCHA verification required' }, { status: 400 })
      }

      const recaptchaResult = await verifyRecaptchaToken(body.recaptchaToken, 'construction_review', 0.5)
      if (!recaptchaResult.success) {
        return NextResponse.json(
          { error: 'Spam verificatie mislukt. Probeer het opnieuw.' },
          { status: 403 }
        )
      }
    }

    const payload = await getPayload({ config })

    // Resolve project/service relationships
    let projectId: number | undefined
    let serviceId: number | undefined

    if (body.projectSlug) {
      try {
        const { docs } = await payload.find({
          collection: 'construction-projects',
          where: { slug: { equals: body.projectSlug } },
          limit: 1,
          depth: 0,
        })
        if (docs[0]) projectId = docs[0].id
      } catch { /* ignore */ }
    }

    if (body.serviceSlug) {
      try {
        const { docs } = await payload.find({
          collection: 'construction-services',
          where: { slug: { equals: body.serviceSlug } },
          limit: 1,
          depth: 0,
        })
        if (docs[0]) serviceId = docs[0].id
      } catch { /* ignore */ }
    }

    // Create review (as draft — needs admin approval)
    const review = await payload.create({
      collection: 'construction-reviews',
      data: {
        clientName: body.clientName,
        clientRole: body.clientRole || undefined,
        clientInitials: getInitials(body.clientName),
        rating: body.rating,
        quote: body.quote,
        project: projectId || undefined,
        service: serviceId || undefined,
        featured: false,
        status: 'draft',
      } as any,
    })

    console.log('[Construction Review] New review submitted:', {
      id: review.id,
      name: body.clientName,
      rating: body.rating,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Bedankt voor uw review! Na goedkeuring wordt deze zichtbaar.',
        reviewId: review.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Construction Review] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
