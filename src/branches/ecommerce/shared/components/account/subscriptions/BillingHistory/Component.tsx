import React from 'react'
import Link from 'next/link'
import { CreditCard, Download } from 'lucide-react'
import type { BillingHistoryProps } from './types'
import type { SubscriptionInvoice } from '@/branches/ecommerce/shared/templates/account/AccountTemplate1/SubscriptionsTemplate/types'

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
      return 'bg-grey-light text-grey-mid'
    default:
      return 'bg-grey-light text-grey-mid'
  }
}

export function BillingHistory({ invoices }: BillingHistoryProps) {
  return (
    <div className="mb-6">
      <div className="bg-white border border-grey-light rounded-lg overflow-hidden">
        <div className="p-4 border-b border-grey-light flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[var(--color-primary)]" />
            Recente facturen
          </h3>
          <Link
            href="/account/invoices/"
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            Alles bekijken
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-grey-light text-xs font-bold uppercase text-grey-mid">
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
                  className="border-b border-grey-light last:border-0 hover:bg-grey-light transition-colors"
                >
                  <td className="p-3 font-semibold">
                    {new Date(invoice.date).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="p-3 text-grey-dark">{invoice.description}</td>
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
                      className="text-[var(--color-primary)] font-semibold hover:underline inline-flex items-center gap-1"
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
