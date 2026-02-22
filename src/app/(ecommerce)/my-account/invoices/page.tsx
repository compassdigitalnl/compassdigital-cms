'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, FileText, Download, Eye, Calendar, Euro } from 'lucide-react'

export default function InvoicesPage() {
  // TODO: Replace with real invoices data from API
  const [invoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-2026-00142',
      orderNumber: 'ORD-20260218-00142',
      date: '2026-02-18',
      dueDate: '2026-03-20',
      total: 245.50,
      status: 'paid',
      statusLabel: 'Betaald',
      downloadUrl: '/invoices/INV-2026-00142.pdf',
    },
    {
      id: 2,
      invoiceNumber: 'INV-2026-00138',
      orderNumber: 'ORD-20260215-00138',
      date: '2026-02-15',
      dueDate: '2026-03-17',
      total: 189.90,
      status: 'paid',
      statusLabel: 'Betaald',
      downloadUrl: '/invoices/INV-2026-00138.pdf',
    },
    {
      id: 3,
      invoiceNumber: 'INV-2026-00129',
      orderNumber: 'ORD-20260210-00129',
      date: '2026-02-10',
      dueDate: '2026-03-12',
      total: 124.95,
      status: 'pending',
      statusLabel: 'Openstaand',
      downloadUrl: '/invoices/INV-2026-00129.pdf',
    },
    {
      id: 4,
      invoiceNumber: 'INV-2026-00095',
      orderNumber: 'ORD-20260128-00095',
      date: '2026-01-28',
      dueDate: '2026-02-27',
      total: 567.80,
      status: 'paid',
      statusLabel: 'Betaald',
      downloadUrl: '/invoices/INV-2026-00095.pdf',
    },
  ])

  const handleDownloadInvoice = (invoiceId: number, downloadUrl: string) => {
    // TODO: Implement invoice download
    console.log(`Downloading invoice ${invoiceId} from ${downloadUrl}`)
    alert('Download functionaliteit nog niet beschikbaar')
  }

  const handleViewInvoice = (invoiceId: number) => {
    // TODO: Implement invoice preview
    console.log(`Viewing invoice ${invoiceId}`)
    alert('Preview functionaliteit nog niet beschikbaar')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' }
      case 'pending':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
      case 'overdue':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0)

  const totalPending = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.total, 0)

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/my-account/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Mijn Facturen</h1>
        </div>
        <p className="text-sm text-gray-600">
          Bekijk en download je facturen
        </p>
      </div>

      {/* Stats Cards */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Totaal facturen</div>
                <div className="text-2xl font-bold">{invoices.length}</div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Betaald</div>
                <div className="text-2xl font-bold text-green-600">€{totalPaid.toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Openstaand</div>
                <div className="text-2xl font-bold text-amber-600">€{totalPending.toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Euro className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoices List */}
      {invoices.length > 0 ? (
        <div className="space-y-3">
          {invoices.map((invoice) => {
            const statusColors = getStatusColor(invoice.status)
            return (
              <div
                key={invoice.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Invoice Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-sm font-mono">{invoice.invoiceNumber}</h3>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                          {invoice.statusLabel}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Factuurdatum: {new Date(invoice.date).toLocaleDateString('nl-NL')}</span>
                        </div>
                        <div>Order: {invoice.orderNumber}</div>
                        {invoice.status === 'pending' && (
                          <div className="text-amber-600 font-semibold">
                            Vervaldatum: {new Date(invoice.dueDate).toLocaleDateString('nl-NL')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <div className="text-xl font-bold">€{invoice.total.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewInvoice(invoice.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Bekijk factuur"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(invoice.id, invoice.downloadUrl)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download factuur"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">Geen facturen</h3>
          <p className="text-gray-600 text-sm mb-4">
            Je hebt nog geen facturen
          </p>
          <Link
            href="/shop/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            Bekijk producten
          </Link>
        </div>
      )}
    </div>
  )
}
