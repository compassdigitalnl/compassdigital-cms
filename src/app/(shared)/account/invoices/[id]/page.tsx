import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Printer, Calendar, CreditCard, FileText } from 'lucide-react'
import type { Invoice, Order } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Factuur ${id} | Mijn Account`,
    description: 'Bekijk factuurdetails',
  }
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/account/invoices/' + id)
  }

  // Fetch invoice
  let invoice: Invoice
  try {
    const doc = await payload.findByID({
      collection: 'invoices',
      id,
      depth: 2,
    })
    invoice = doc as Invoice

    // Verify this invoice belongs to the user
    const invoiceUserId =
      typeof invoice.user === 'string' ? invoice.user : invoice.user?.id || null
    if (invoiceUserId !== user.id) {
      notFound()
    }
  } catch (error) {
    notFound()
  }

  // Get order if available
  const order = typeof invoice.order === 'object' ? (invoice.order as Order) : null

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/account/invoices"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar facturen
      </Link>

      {/* Invoice Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Factuur {invoice.invoiceNumber}</h1>
            {order && (
              <p className="text-gray-600 mt-1">
                Order #{String(order.orderNumber).padStart(5, '0')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {invoice.pdfUrl && (
              <>
                <a
                  href={invoice.pdfUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Printer className="w-4 h-4" />
                  Printen
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Invoice Date */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Factuurdatum</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {new Date(invoice.invoiceDate).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Vervaldatum</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {new Date(invoice.dueDate).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  invoice.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : invoice.status === 'overdue'
                      ? 'bg-red-100 text-red-800'
                      : invoice.status === 'unpaid'
                        ? 'bg-amber-100 text-amber-800'
                        : invoice.status === 'cancelled'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                }`}
              >
                {invoice.status === 'paid'
                  ? 'Betaald'
                  : invoice.status === 'overdue'
                    ? 'Achterstallig'
                    : invoice.status === 'unpaid'
                      ? 'Openstaand'
                      : invoice.status === 'cancelled'
                        ? 'Geannuleerd'
                        : 'Concept'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billing Address */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Factuuradres</h2>
          {invoice.billingAddress ? (
            <div className="text-sm text-gray-700 space-y-1">
              {typeof invoice.billingAddress === 'object' && (
                <>
                  <p className="font-medium">{user.name}</p>
                  {user.accountType === 'b2b' &&
                    typeof user.company === 'object' &&
                    user.company?.name && <p>{user.company.name}</p>}
                  <p>
                    {invoice.billingAddress.street} {invoice.billingAddress.houseNumber}
                    {invoice.billingAddress.houseNumberAddition || ''}
                  </p>
                  <p>
                    {invoice.billingAddress.postalCode} {invoice.billingAddress.city}
                  </p>
                  {invoice.billingAddress.country && <p>{invoice.billingAddress.country}</p>}
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Geen factuuradres beschikbaar</p>
          )}
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Betaalinformatie</h2>
          <div className="space-y-3">
            {invoice.paymentMethod && (
              <div>
                <p className="text-sm text-gray-600">Betaalmethode</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {invoice.paymentMethod === 'creditcard'
                    ? 'Creditcard'
                    : invoice.paymentMethod === 'ideal'
                      ? 'iDEAL'
                      : invoice.paymentMethod === 'bancontact'
                        ? 'Bancontact'
                        : invoice.paymentMethod === 'invoice'
                          ? 'Factuur'
                          : 'Overig'}
                </p>
              </div>
            )}
            {invoice.paymentDate && (
              <div>
                <p className="text-sm text-gray-600">Betaaldatum</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">
                  {new Date(invoice.paymentDate).toLocaleDateString('nl-NL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
            {invoice.transactionId && (
              <div>
                <p className="text-sm text-gray-600">Transactie ID</p>
                <p className="text-sm font-mono text-gray-900 mt-0.5">{invoice.transactionId}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Factuurregels</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aantal
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prijs
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotaal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.description}</p>
                        {item.sku && <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-sm text-gray-900">{item.quantity}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-gray-900">€{item.unitPrice.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        €{(item.quantity * item.unitPrice).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    Geen factuurregels beschikbaar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="max-w-md ml-auto space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotaal</span>
              <span className="text-gray-900 font-medium">€{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">BTW ({invoice.vatPercentage || 21}%)</span>
              <span className="text-gray-900 font-medium">€{invoice.vatAmount.toFixed(2)}</span>
            </div>
            {invoice.discountAmount && invoice.discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Korting</span>
                <span className="text-green-600 font-medium">
                  -€{invoice.discountAmount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">Totaal</span>
                <span className="text-xl font-bold text-gray-900">
                  €{invoice.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Opmerkingen</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}
