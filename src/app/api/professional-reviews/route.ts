import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { clientName, rating, quote } = body
    if (!clientName || !rating || !quote) {
      return NextResponse.json(
        { error: 'Naam, beoordeling en review zijn verplicht.' },
        { status: 400 },
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Beoordeling moet tussen 1 en 5 zijn.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    const initials = clientName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const review = await payload.create({
      collection: 'professional-reviews',
      data: {
        clientName: body.clientName,
        clientRole: body.clientRole || '',
        clientInitials: initials,
        rating: body.rating,
        quote: body.quote,
        service: body.serviceId || undefined,
        project: body.caseId || undefined,
        status: 'draft',
      },
    })

    return NextResponse.json({ success: true, id: review.id }, { status: 201 })
  } catch (error) {
    console.error('[professional-reviews API] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verwerken van uw review.' },
      { status: 500 },
    )
  }
}
