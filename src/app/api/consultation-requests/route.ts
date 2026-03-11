import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, email, phone, serviceType } = body
    if (!name || !email || !phone || !serviceType) {
      return NextResponse.json(
        { error: 'Naam, e-mail, telefoonnummer en type dienstverlening zijn verplicht.' },
        { status: 400 },
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ongeldig e-mailadres.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const consultationRequest = await payload.create({
      collection: 'consultation-requests',
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.companyName || '',
        projectType: body.serviceType,
        budget: body.budget || undefined,
        timeline: body.timeline || undefined,
        description: body.description || '',
        status: 'new',
        submittedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, id: consultationRequest.id }, { status: 201 })
  } catch (error) {
    console.error('[consultation-requests API] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verwerken van uw aanvraag.' },
      { status: 500 },
    )
  }
}
