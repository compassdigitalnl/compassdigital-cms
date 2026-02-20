import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Download, Eye, Calendar, CreditCard } from 'lucide-react'
import type { Invoice } from '@/payload-types'

export const metadata = {
  title: 'Mijn Facturen | Account',
  description: 'Bekijk en download je facturen',
}

export default async function InvoicesPage() {
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/account/invoices')
  }

  // Fetch user's invoices
  const invoices = await payload.find({
    collection: 'invoices',
    where: {
      user: {
        equals: user.id,
      },
    },
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })

  // Group invoices by status
  const unpaidInvoices = invoices.docs.filter((inv) => (inv as Invoice).status === 'unpaid')
  const paidInvoices = invoices.docs.filter((inv) => (inv as Invoice).status === 'paid')
  const overdueInvoices = invoices.docs.filter((inv) => (inv as Invoice).status === 'overdue')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mijn Facturen</h1>
            <p className="text-gray-600 mt-1">Bekijk en download al je facturen</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Totaal facturen</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.totalDocs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Unpaid */}
        <div className="bg-white rounded-lg border border-amber-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 font-medium">Openstaand</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{unpaidInvoices.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          {unpaidInvoices.length > 0 && (
            <p className="text-xs text-amber-700 mt-3">
              Totaal: €
              {unpaidInvoices
                .reduce((sum, inv) => sum + ((inv as Invoice).totalAmount || 0), 0)
                .toFixed(2)}
            </p>
          )}
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-lg border border-red-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Achterstallig</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{overdueInvoices.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
          </div>
          {overdueInvoices.length > 0 && (
            <p className="text-xs text-red-700 mt-3">
              Totaal: €
              {overdueInvoices
                .reduce((sum, inv) => sum + ((inv as Invoice).totalAmount || 0), 0)
                .toFixed(2)}
            </p>
          )}
        </div>

        {/* Paid */}
        <div className="bg-white rounded-lg border border-green-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Betaald</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{paidInvoices.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
          {paidInvoices.length > 0 && (
            <p className="text-xs text-green-700 mt-3">
              Totaal: €
              {paidInvoices
                .reduce((sum, inv) => sum + ((inv as Invoice).totalAmount || 0), 0)
                .toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Alle Facturen</h2>
        </div>

        {invoices.docs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Je hebt nog geen facturen</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factuurnummer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vervaldatum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bedrag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.docs.map((invoice) => {
                  const inv = invoice as Invoice
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {inv.invoiceNumber}
                            </p>
                            {typeof inv.order === 'object' && inv.order?.orderNumber && (
                              <p className="text-xs text-gray-500">
                                Order #{String(inv.order.orderNumber).padStart(5, '0')}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {new Date(inv.invoiceDate).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {new Date(inv.dueDate).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">
                          €{inv.totalAmount.toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            inv.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : inv.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : inv.status === 'unpaid'
                                  ? 'bg-amber-100 text-amber-800'
                                  : inv.status === 'cancelled'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {inv.status === 'paid'
                            ? 'Betaald'
                            : inv.status === 'overdue'
                              ? 'Achterstallig'
                              : inv.status === 'unpaid'
                                ? 'Openstaand'
                                : inv.status === 'cancelled'
                                  ? 'Geannuleerd'
                                  : 'Concept'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/account/invoices/${inv.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Bekijk
                          </Link>
                          {inv.pdfUrl && (
                            <a
                              href={inv.pdfUrl}
                              download
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
                            >
                              <Download className="w-3.5 h-3.5" />
                              PDF
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
