import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { ConsultationDocument } from '@/branches/professional-services/components/pdf/ConsultationDocument'

/**
 * GET /api/consultation-requests/[id]/pdf
 *
 * Generates and returns a consultation proposal PDF.
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

    // Fetch consultation request
    const consultationRequest = await payload.findByID({
      collection: 'consultation-requests',
      id,
      depth: 0,
    })

    if (!consultationRequest) {
      return NextResponse.json(
        { error: 'Adviesgesprek aanvraag niet gevonden' },
        { status: 404 },
      )
    }

    // Build company info from env
    const companyInfo = {
      name: process.env.COMPANY_NAME || process.env.SITE_NAME || 'Zakelijke Dienstverlening BV',
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
      React.createElement(ConsultationDocument, {
        consultation: {
          id: consultationRequest.id,
          name: (consultationRequest as any).name,
          email: (consultationRequest as any).email,
          phone: (consultationRequest as any).phone,
          company: (consultationRequest as any).company,
          address: (consultationRequest as any).address,
          postalCode: (consultationRequest as any).postalCode,
          city: (consultationRequest as any).city,
          projectType: (consultationRequest as any).projectType,
          budget: (consultationRequest as any).budget,
          timeline: (consultationRequest as any).timeline,
          description: (consultationRequest as any).description,
          quotedAmount: (consultationRequest as any).quotedAmount,
          expiresAt: (consultationRequest as any).expiresAt,
          submittedAt: (consultationRequest as any).submittedAt,
          status: (consultationRequest as any).status,
        },
        companyInfo,
      }),
    )

    const proposalNumber = `VST-${String(consultationRequest.id).padStart(5, '0')}`

    // Return PDF stream
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${proposalNumber}.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('[PDF] Failed to generate consultation PDF:', error)
    return NextResponse.json(
      { error: 'PDF generatie mislukt' },
      { status: 500 },
    )
  }
}
