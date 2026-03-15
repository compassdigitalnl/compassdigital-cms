import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/vendor-applications
 * Submit a new vendor/supplier application.
 *
 * Body: { companyName, contactPerson, email, phone?, website?, description, productCategories?, estimatedProducts? }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const body = await request.json()

    // Validate required fields
    if (!body.companyName || !body.contactPerson || !body.email || !body.description) {
      return NextResponse.json(
        { error: 'companyName, contactPerson, email en description zijn verplicht' },
        { status: 400 },
      )
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
    }

    // Rate limit: max 3 per email per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const recentApplications = await payload.find({
      collection: 'vendor-applications' as any,
      where: {
        email: { equals: body.email },
        submittedAt: { greater_than: oneDayAgo },
      },
      limit: 0,
    })

    if (recentApplications.totalDocs >= 3) {
      return NextResponse.json(
        { error: 'U heeft het maximaal aantal aanvragen voor vandaag bereikt. Probeer het morgen opnieuw.' },
        { status: 429 },
      )
    }

    // Create the application
    await payload.create({
      collection: 'vendor-applications' as any,
      data: {
        companyName: body.companyName,
        contactPerson: body.contactPerson,
        email: body.email,
        phone: body.phone || undefined,
        website: body.website || undefined,
        description: body.description,
        productCategories: body.productCategories || undefined,
        estimatedProducts: body.estimatedProducts || undefined,
        status: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Uw aanvraag is ontvangen. Wij nemen zo snel mogelijk contact met u op.',
    })
  } catch (error: unknown) {
    console.error('Error submitting vendor application:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het indienen van uw aanvraag.' },
      { status: 500 },
    )
  }
}
