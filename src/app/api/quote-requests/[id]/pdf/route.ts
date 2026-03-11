import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { QuoteDocument } from '@/branches/construction/components/pdf/QuoteDocument'

/**
 * GET /api/quote-requests/[id]/pdf
 *
 * Generates and returns a quote PDF.
 * Auth required: admin or editor only.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    const payload = await getPayload({ config: configPromise })

    // Get current user from cookie/token
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    // Check admin/editor role
    const isAllowed =
      'roles' in user &&
      (user.roles?.includes('admin') || user.roles?.includes('editor'))
    if (!isAllowed) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    // Fetch quote request
    const quoteRequest = await payload.findByID({
      collection: 'quote-requests',
      id,
      depth: 0,
    })

    if (!quoteRequest) {
      return NextResponse.json(
        { error: 'Offerte aanvraag niet gevonden' },
        { status: 404 },
      )
    }

    // Build company info from env
    const company = {
      name: process.env.COMPANY_NAME || process.env.SITE_NAME || 'Bouwbedrijf BV',
      address: process.env.COMPANY_ADDRESS || '',
      postalCode: process.env.COMPANY_POSTAL_CODE || '',
      city: process.env.COMPANY_CITY || '',
      country: process.env.COMPANY_COUNTRY || 'Nederland',
      kvk: process.env.COMPANY_KVK || '',
      vatNumber: process.env.COMPANY_VAT_NUMBER || '',
      email: process.env.CONTACT_EMAIL || '',
      phone: process.env.CONTACT_PHONE || '',
      website: process.env.NEXT_PUBLIC_SERVER_URL || '',
    }

    // Render PDF to buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await (renderToBuffer as any)(
      React.createElement(QuoteDocument, {
        quote: {
          id: quoteRequest.id,
          name: (quoteRequest as any).name,
          email: (quoteRequest as any).email,
          phone: (quoteRequest as any).phone,
          address: (quoteRequest as any).address,
          postalCode: (quoteRequest as any).postalCode,
          city: (quoteRequest as any).city,
          projectType: (quoteRequest as any).projectType,
          budget: (quoteRequest as any).budget,
          timeline: (quoteRequest as any).timeline,
          description: (quoteRequest as any).description,
          quotedAmount: (quoteRequest as any).quotedAmount,
          expiresAt: (quoteRequest as any).expiresAt,
          submittedAt: (quoteRequest as any).submittedAt,
          status: (quoteRequest as any).status,
        },
        company,
      }),
    )

    const quoteNumber = `OFF-${String(quoteRequest.id).padStart(5, '0')}`

    // Return PDF stream
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${quoteNumber}.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('[PDF] Failed to generate quote PDF:', error)
    return NextResponse.json(
      { error: 'PDF generatie mislukt' },
      { status: 500 },
    )
  }
}
