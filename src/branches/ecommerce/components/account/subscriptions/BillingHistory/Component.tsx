import React from 'react'
import Link from 'next/link'
import { CreditCard, Download } from 'lucide-react'
import type { BillingHistoryProps } from './types'
import type { SubscriptionInvoice } from '@/branches/ecommerce/templates/account/AccountTemplate1/SubscriptionsTemplate/types'

function statusLabel(status: SubscriptionInvoice['status']): string {
  switch (status) {
    case 'paid':
      return 'Betaald'
    case 'open':
      return 'Open'
    case 'void':
      return 'Vervallen'
    default:
      return status
  }
}

function statusClasses(status: SubscriptionInvoice['status']): string {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-700'
    case 'open':
      return 'bg-amber-100 text-amber-700'
    case 'void':
      return 'bg-gray-100 text-gray-500'
    default:
      return 'bg-gray-100 text-gray-500'
  }
}

export function BillingHistory({ invoices }: BillingHistoryProps) {
  return (
    <div className="mb-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-teal-600" />
            Recente facturen
          </h3>
          <Link
            href="/account/invoices/"
            className="text-xs font-semibold text-teal-600 hover:underline"
          >
            Alles bekijken
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500">
              <tr>
                <th className="p-3 text-left">Datum</th>
                <th className="p-3 text-left">Beschrijving</th>
                <th className="p-3 text-right">Bedrag</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Download</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-semibold">
                    {new Date(invoice.date).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="p-3 text-gray-600">{invoice.description}</td>
                  <td className="p-3 text-right font-mono font-bold">&euro;{invoice.amount}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded ${statusClasses(invoice.status)}`}
                    >
                      {statusLabel(invoice.status)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <a
                      href="#"
                      className="text-teal-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
