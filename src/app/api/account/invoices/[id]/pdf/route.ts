import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import { InvoiceDocument } from '@/branches/ecommerce/shared/components/pdf/InvoiceDocument'

/**
 * GET /api/account/invoices/[id]/pdf
 *
 * Generates and returns an invoice PDF.
 * Auth required: user must own the invoice or be admin.
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

    // Fetch invoice with order data
    const invoice = await payload.findByID({
      collection: 'invoices',
      id,
      depth: 2,
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Factuur niet gevonden' }, { status: 404 })
    }

    // Auth check: user must own the invoice or be admin
    const isAdmin = 'roles' in user && user.roles?.includes('admin')
    const invoiceCustomerId =
      typeof invoice.customer === 'object' ? invoice.customer?.id : invoice.customer
    if (!isAdmin && invoiceCustomerId !== user.id) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    // Resolve order data
    const order = typeof invoice.order === 'object' ? invoice.order : null
    if (!order) {
      return NextResponse.json({ error: 'Bestelling niet gevonden' }, { status: 404 })
    }

    // Build company info from env
    const company = {
      name: process.env.COMPANY_NAME || 'Bedrijfsnaam BV',
      address: process.env.COMPANY_ADDRESS || '',
      postalCode: process.env.COMPANY_POSTAL_CODE || '',
      city: process.env.COMPANY_CITY || '',
      country: process.env.COMPANY_COUNTRY || 'Nederland',
      kvk: process.env.COMPANY_KVK || '',
      vatNumber: process.env.COMPANY_VAT_NUMBER || '',
      iban: process.env.COMPANY_IBAN || '',
      email: process.env.CONTACT_EMAIL || '',
      phone: process.env.CONTACT_PHONE || '',
      website: process.env.NEXT_PUBLIC_SERVER_URL || '',
    }

    // Render PDF to buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await (renderToBuffer as any)(
      React.createElement(InvoiceDocument, {
        invoice: {
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate,
          dueDate: invoice.dueDate,
          status: invoice.status,
          paymentMethod: invoice.paymentMethod as string | undefined,
          paymentDate: invoice.paymentDate as string | undefined,
          subtotal: invoice.subtotal,
          tax: invoice.tax || 0,
          shippingCost: invoice.shippingCost || 0,
          discount: invoice.discount || 0,
          amount: invoice.amount,
          items: (invoice.items || []).map((item: any) => ({
            description: item.description,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal || item.unitPrice * item.quantity,
          })),
          notes: invoice.notes as string | undefined,
        },
        order: {
          orderNumber: (order as any).orderNumber || '',
          shippingAddress: (order as any).shippingAddress,
          billingAddress: (order as any).billingAddress,
        },
        company,
      }),
    )

    // Return PDF stream
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${invoice.invoiceNumber}.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('[PDF] Failed to generate invoice PDF:', error)
    return NextResponse.json(
      { error: 'PDF generatie mislukt' },
      { status: 500 },
    )
  }
}
