import type { CollectionAfterChangeHook } from 'payload'
import { emailService } from '@/features/email-marketing/lib/TransactionalEmailService'

/**
 * Order Status Hook
 *
 * Payload CMS afterChange hook on Orders collection.
 * Detects status changes and triggers:
 * 1. Transactional emails (always)
 * 2. Auto-create Invoice record + PDF on payment (status → paid)
 * 3. Tracking link in emails (if enabled in ecommerce settings)
 * 4. PDF attachment in order confirmation (if enabled in ecommerce settings)
 *
 * Trigger map:
 *   pending       → (no email — waiting for payment)
 *   paid          → sendOrderConfirmation() + auto-create Invoice
 *   processing    → (no email)
 *   shipped       → sendShippingConfirmation()
 *   delivered     → sendDeliveryConfirmation()
 *   cancelled     → sendOrderCancellation()
 *   refunded      → sendRefundConfirmation()
 */
export const orderStatusHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Only trigger on update (not create — new orders start as 'pending')
  if (operation !== 'update') return doc

  const newStatus = doc.status
  const oldStatus = previousDoc?.status

  // No status change → no email
  if (!newStatus || newStatus === oldStatus) return doc

  // Resolve customer email
  const customerEmail = await resolveCustomerEmail(doc, req)
  if (!customerEmail) {
    console.warn(`[orderStatusHook] No email found for order ${doc.orderNumber}`)
    return doc
  }

  // Fetch ecommerce settings for email toggles
  const emailSettings = await getEmailSettings(req)

  // Build order data for EmailService
  const orderData = mapOrderToEmailData(doc)

  // Build tracking link if enabled
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const trackingLink = emailSettings.enableTrackingLink && siteUrl
    ? `${siteUrl}/track?order=${encodeURIComponent(doc.orderNumber)}&email=${encodeURIComponent(customerEmail)}`
    : null

  try {
    switch (newStatus) {
      case 'paid': {
        // Auto-create Invoice record
        const invoice = await autoCreateInvoice(doc, req)

        // Generate PDF attachment if enabled
        let pdfBuffer: Buffer | null = null
        let invoiceNumber: string | null = null
        if (emailSettings.enableInvoiceAttachment && invoice) {
          pdfBuffer = await generateInvoicePDF(invoice, doc, req)
          invoiceNumber = invoice.invoiceNumber
        }

        await emailService.sendOrderConfirmation(orderData, customerEmail, {
          trackingLink,
          pdfAttachment: pdfBuffer ? { filename: `${invoiceNumber || 'factuur'}.pdf`, content: pdfBuffer } : undefined,
        })
        console.log(`[orderStatusHook] Order confirmation sent for ${doc.orderNumber}`)
        break
      }

      case 'shipped':
        await emailService.sendShippingConfirmation(
          orderData,
          customerEmail,
          doc.trackingCode || '',
          resolveCarrierName(doc.shippingProvider),
          { trackingLink },
        )
        console.log(`[orderStatusHook] Shipping confirmation sent for ${doc.orderNumber}`)
        break

      case 'delivered':
        await emailService.sendDeliveryConfirmation(orderData, customerEmail, { trackingLink })
        console.log(`[orderStatusHook] Delivery confirmation sent for ${doc.orderNumber}`)
        break

      case 'cancelled':
        await emailService.sendOrderCancellation(orderData, customerEmail, { trackingLink })
        console.log(`[orderStatusHook] Cancellation email sent for ${doc.orderNumber}`)
        break

      case 'refunded':
        await emailService.sendRefundConfirmation(orderData, customerEmail, { trackingLink })
        console.log(`[orderStatusHook] Refund confirmation sent for ${doc.orderNumber}`)
        break

      default:
        break
    }
  } catch (error) {
    // Log but don't throw — email failure should not block order update
    console.error(`[orderStatusHook] Failed to send email for ${doc.orderNumber}:`, error)
  }

  return doc
}

/**
 * Fetch email notification settings from ecommerce global
 */
async function getEmailSettings(req: any): Promise<{
  enableInvoiceAttachment: boolean
  enableTrackingLink: boolean
}> {
  try {
    const settings = await req.payload.findGlobal({ slug: 'e-commerce-settings' })
    return {
      enableInvoiceAttachment: settings?.emailNotifications?.enableInvoiceAttachment ?? false,
      enableTrackingLink: settings?.emailNotifications?.enableTrackingLink ?? false,
    }
  } catch {
    return { enableInvoiceAttachment: false, enableTrackingLink: false }
  }
}

/**
 * Auto-create an Invoice record when order is paid
 */
async function autoCreateInvoice(order: any, req: any): Promise<any | null> {
  try {
    // Check if invoice already exists for this order
    const { docs: existing } = await req.payload.find({
      collection: 'invoices',
      where: { order: { equals: order.id } },
      limit: 1,
    })

    if (existing.length > 0) {
      console.log(`[orderStatusHook] Invoice already exists for order ${order.orderNumber}`)
      return existing[0]
    }

    // Resolve customer ID
    const customerId = typeof order.customer === 'object' ? order.customer?.id : order.customer
    if (!customerId) {
      console.warn(`[orderStatusHook] No customer ID for invoice creation on ${order.orderNumber}`)
      return null
    }

    // Create invoice
    const invoice = await req.payload.create({
      collection: 'invoices',
      data: {
        order: order.id,
        customer: customerId,
        invoiceDate: new Date().toISOString(),
        subtotal: order.subtotal || 0,
        tax: order.tax || 0,
        shippingCost: order.shippingCost || 0,
        discount: order.discount || 0,
        amount: order.total || 0,
        status: order.paymentMethod === 'invoice' ? 'open' : 'paid',
        paymentMethod: order.paymentMethod,
        paymentDate: order.paymentMethod !== 'invoice' ? new Date().toISOString() : undefined,
        items: (order.items || []).map((item: any) => ({
          description: item.title || 'Product',
          sku: item.sku || '',
          quantity: item.quantity || 1,
          unitPrice: item.price || 0,
        })),
      },
    })

    console.log(`[orderStatusHook] Invoice ${invoice.invoiceNumber} created for order ${order.orderNumber}`)

    // Store invoice number on order
    try {
      await req.payload.update({
        collection: 'orders',
        id: order.id,
        data: { invoiceNumber: invoice.invoiceNumber },
      })
    } catch {
      // Non-critical — don't fail if this update doesn't work
    }

    return invoice
  } catch (error) {
    console.error(`[orderStatusHook] Failed to create invoice for ${order.orderNumber}:`, error)
    return null
  }
}

/**
 * Generate invoice PDF buffer for email attachment
 */
async function generateInvoicePDF(invoice: any, order: any, _req: any): Promise<Buffer | null> {
  try {
    const React = require('react')
    const { renderToBuffer } = require('@react-pdf/renderer')
    const { InvoiceDocument } = require('@/branches/ecommerce/shared/components/pdf/InvoiceDocument')

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

    const pdfBuffer = await (renderToBuffer as any)(
      React.createElement(InvoiceDocument, {
        invoice: {
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate,
          dueDate: invoice.dueDate,
          status: invoice.status,
          paymentMethod: invoice.paymentMethod,
          paymentDate: invoice.paymentDate,
          subtotal: invoice.subtotal || 0,
          tax: invoice.tax || 0,
          shippingCost: invoice.shippingCost || 0,
          discount: invoice.discount || 0,
          amount: invoice.amount || 0,
          items: (invoice.items || []).map((item: any) => ({
            description: item.description,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal || (item.unitPrice || 0) * (item.quantity || 0),
          })),
        },
        order: {
          orderNumber: order.orderNumber,
          shippingAddress: order.shippingAddress,
          billingAddress: order.billingAddress,
        },
        company,
      }),
    )

    return Buffer.from(pdfBuffer)
  } catch (error) {
    console.error(`[orderStatusHook] Failed to generate PDF for invoice ${invoice.invoiceNumber}:`, error)
    return null
  }
}

/**
 * Resolve the customer email address (logged-in user or guest)
 */
async function resolveCustomerEmail(doc: any, req: any): Promise<string | null> {
  if (doc.customerEmail) return doc.customerEmail
  if (doc.guestEmail) return doc.guestEmail

  if (doc.customer) {
    try {
      const customerId = typeof doc.customer === 'object' ? doc.customer.id : doc.customer
      const user = await req.payload.findByID({
        collection: 'users',
        id: customerId,
      })
      return user?.email || null
    } catch {
      return null
    }
  }

  return null
}

/**
 * Map Payload order doc to the EmailService Order interface
 */
function mapOrderToEmailData(doc: any) {
  return {
    orderNumber: doc.orderNumber,
    items: (doc.items || []).map((item: any) => ({
      product: item.product,
      productSnapshot: { name: item.title, sku: item.sku },
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.subtotal || (item.price || 0) * (item.quantity || 0),
      bookingData: item.bookingData || undefined,
      personalizationData: item.personalizationData || undefined,
      configurationData: item.configurationData || undefined,
    })),
    subtotal: doc.subtotal,
    discountTotal: doc.discount,
    shippingTotal: doc.shippingCost,
    taxTotal: doc.tax,
    total: doc.total,
    currency: 'EUR',
    billingAddress: doc.billingAddress?.sameAsShipping ? doc.shippingAddress : doc.billingAddress,
    shippingAddress: doc.shippingAddress,
    shipping: {
      trackingNumber: doc.trackingCode,
      carrier: resolveCarrierName(doc.shippingProvider),
    },
    createdAt: doc.createdAt,
  }
}

/**
 * Map shipping provider slug to display name
 */
function resolveCarrierName(provider?: string): string {
  const carriers: Record<string, string> = {
    postnl: 'PostNL',
    dhl: 'DHL',
    dpd: 'DPD',
    ups: 'UPS',
    transmission: 'Transmission',
    own: 'Eigen bezorging',
    pickup: 'Ophalen',
  }
  return carriers[provider || ''] || provider || ''
}
