'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Download, Eye, Calendar } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import type { InvoiceRowProps } from './types'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green/20', label: 'Betaald' }
    case 'pending':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Openstaand' }
    case 'failed':
      return { bg: 'bg-coral-50', text: 'text-coral-700', border: 'border-coral/20', label: 'Mislukt' }
    default:
      return { bg: 'bg-grey-light', text: 'text-grey-dark', border: 'border-grey-light', label: status }
  }
}

export function InvoiceRow({ invoice }: InvoiceRowProps) {
  const { formatPriceStr } = usePriceMode()
  const statusColors = getStatusColor(invoice.paymentStatus)

  return (
    <div className="bg-white border border-grey-light rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-bold text-sm font-mono">{invoice.invoiceNumber}</h3>
              <span className={`px-2 py-0.5 text-xs font-bold rounded ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                {statusColors.label}
              </span>
            </div>
            <div className="text-xs text-grey-dark space-y-0.5">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(invoice.createdAt).toLocaleDateString('nl-NL')}</span>
              </div>
              <div>Order: {invoice.orderNumber}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <div className="text-xl font-bold">€{formatPriceStr(invoice.total)}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/account/orders/${invoice.id}`}
              className="p-2 text-grey-dark hover:bg-grey-light rounded-lg transition-colors"
              title="Bekijk bestelling"
            >
              <Eye className="w-4 h-4" />
            </Link>
            {invoice.invoicePDF && (
              <a
                href={typeof invoice.invoicePDF === 'object' ? invoice.invoicePDF.url : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-teal hover:bg-teal-50 rounded-lg transition-colors"
                title="Download factuur"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
